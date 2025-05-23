// app/api/sheets/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/core/lib/auth";
import { prisma } from "@/core/lib/prisma";
import { google } from "googleapis";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.error();

  // не даём создать более одной таблицы
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { sheet: true },
  });
  if (user?.sheet) {
    return NextResponse.json(
      { error: "Sheet already exists" },
      { status: 400 }
    );
  }

  const { title } = (await req.json()) as { title: string };

  // === вот ключевая часть: используем OAuth2 клиента пользователя ===
  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2.setCredentials({
    access_token: session.user.accessToken,
    refresh_token: session.user.refreshToken,
  });

  // 1) создаём spreadsheet от имени пользователя
  const sheets = google.sheets({ version: "v4", auth: oauth2 });
  const createRes = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title },
      sheets: [{ properties: { title: "Отклики" } }],
    },
  });
  const spreadsheetId = createRes.data.spreadsheetId!;
  const sheetId = createRes.data.sheets![0].properties!.sheetId!;

  // 2) batchUpdate — инициализируем header, ширины, freeze, filter, валидацию и условное форматирование
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        // A. Вставляем заголовки в строку 1
        {
          updateCells: {
            start: { sheetId, rowIndex: 0, columnIndex: 0 },
            rows: [
              {
                values: [
                  "Компания",
                  "Вакансия",
                  "Статус",
                  "Дата отклика",
                  "Последний апдейт",
                  "Ссылка",
                  "Локация",
                  "Стек",
                  "Контакты",
                  "Notes",
                ].map((text) => ({
                  userEnteredValue: { stringValue: text },
                  userEnteredFormat: {
                    backgroundColor: { red: 0.867, green: 0.867, blue: 0.867 },
                    textFormat: { bold: true },
                  },
                })),
              },
            ],
            fields:
              "userEnteredValue,userEnteredFormat(backgroundColor,textFormat)",
          },
        },
        // B. Устанавливаем ширины столбцов A–J
        ...[25, 25, 15, 14, 18, 45, 18, 20, 25, 30].map((width, i) => ({
          updateDimensionProperties: {
            range: {
              sheetId,
              dimension: "COLUMNS",
              startIndex: i,
              endIndex: i + 1,
            },
            properties: { pixelSize: width * 7 }, // примерный множитель
            fields: "pixelSize",
          },
        })),
        // C. Freeze header
        {
          updateSheetProperties: {
            properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
            fields: "gridProperties.frozenRowCount",
          },
        },
        // D. Auto-filter на A1:J1
        {
          setBasicFilter: {
            filter: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 10,
              },
            },
          },
        },
        // E. DataValidation для C2:C5000
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 1,
              endRowIndex: 5000,
              startColumnIndex: 2,
              endColumnIndex: 3,
            },
            cell: {
              dataValidation: {
                condition: {
                  type: "ONE_OF_LIST",
                  values: [
                    { userEnteredValue: "Отклик" },
                    { userEnteredValue: "Просмотрено" },
                    { userEnteredValue: "Приглашение" },
                    { userEnteredValue: "Интервью" },
                    { userEnteredValue: "Тестовое" },
                    { userEnteredValue: "Оффер" },
                    { userEnteredValue: "Принят" },
                    { userEnteredValue: "Отказ" },
                    { userEnteredValue: "Архив" },
                  ],
                },
                showCustomUi: true,
                strict: false,
              },
            },
            fields: "dataValidation",
          },
        },
        // F. Conditional formatting для каждого статуса
        ...[
          ["Отклик", "#D9D9D9"],
          ["Просмотрено", "#FFF2CC"],
          ["Приглашение", "#D9E1F2"],
          ["Интервью", "#FFE699"],
          ["Тестовое", "#F4B183"],
          ["Оффер", "#C6E0B4"],
          ["Принят", "#A9D08E"],
          ["Отказ", "#F8CBAD"],
          ["Архив", "#C0C0C0"],
        ].map(([status, hex]) => ({
          addConditionalFormatRule: {
            rule: {
              ranges: [
                {
                  sheetId,
                  startRowIndex: 1,
                  endRowIndex: 5000,
                  startColumnIndex: 2,
                  endColumnIndex: 3,
                },
              ],
              booleanRule: {
                condition: {
                  type: "CUSTOM_FORMULA",
                  values: [{ userEnteredValue: `=$C2="${status}"` }],
                },
                format: {
                  backgroundColor: {
                    red: parseInt(hex.slice(1, 3), 16) / 255,
                    green: parseInt(hex.slice(3, 5), 16) / 255,
                    blue: parseInt(hex.slice(5, 7), 16) / 255,
                  },
                },
              },
            },
            index: 0,
          },
        })),
      ],
    },
  });

  // 3) сохраняем в БД
  await prisma.sheet.create({
    data: {
      title,
      sheetId: spreadsheetId,
      user: { connect: { email: session.user.email } },
    },
  });

  return NextResponse.json({ spreadsheetId, title }, { status: 201 });
}
