import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/core/lib/auth";
import { getSheetsClient, getSpreadsheetId } from "@/core/lib/google-sheets";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.error();

  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId(session);

  // Читаем все строки, начиная со второй (A2:J)
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Отклики!A2:J",
  });

  const rows = res.data.values || [];

  return NextResponse.json(
    rows.map((r, i) => ({
      id: i + 2,
      company: r[0] || "",
      vacancy: r[1] || "",
      status: r[2] || "",
      appliedAt: r[3] || "",
      updatedAt: r[4] || "",
      link: r[5] || "",
      location: r[6] || "",
      stack: r[7] || "",
      contacts: r[8] || "",
      notes: r[9] || "",
    }))
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.error();

  const {
    company,
    vacancy,
    status,
    appliedAt,
    link = "",
    location = "",
    stack = "",
    contacts = "",
    notes = "",
  } = await req.json();

  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId(session);

  // Текущая дата как "последний апдейт"
  const updatedAt = new Date().toISOString().slice(0, 10);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Отклики!A:J",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          company,
          vacancy,
          status,
          appliedAt,
          updatedAt,
          link,
          location,
          stack,
          contacts,
          notes,
        ],
      ],
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
