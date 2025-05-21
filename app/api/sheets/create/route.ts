import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/core/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.user.accessToken });

  const sheets = google.sheets({ version: "v4", auth });

  const { title } = await req.json();

  const resource = {
    properties: { title: title || "Мой трекер заявок" },
    sheets: [
      {
        properties: {
          title: "Заявки",
          gridProperties: { rowCount: 100, columnCount: 11 },
        },
        data: [
          {
            rowData: [
              {
                values: [
                  { userEnteredValue: { stringValue: "№" } },
                  { userEnteredValue: { stringValue: "Дата отклика" } },
                  { userEnteredValue: { stringValue: "Компания" } },
                  { userEnteredValue: { stringValue: "Вакансия" } },
                  { userEnteredValue: { stringValue: "Ссылка" } },
                  { userEnteredValue: { stringValue: "Статус" } },
                  { userEnteredValue: { stringValue: "Комментарий" } },
                  { userEnteredValue: { stringValue: "Контактное лицо" } },
                  { userEnteredValue: { stringValue: "Email/Телеграм" } },
                  { userEnteredValue: { stringValue: "Следующий шаг" } },
                  { userEnteredValue: { stringValue: "Напоминание" } },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  try {
    const response = await sheets.spreadsheets.create({
      requestBody: resource,
    });

    return new Response(
      JSON.stringify({ spreadsheetId: response.data.spreadsheetId }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
