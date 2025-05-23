import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/core/lib/auth";
import { getSheetsClient, getSpreadsheetId } from "@/core/lib/google-sheets";

export async function PATCH(
  req: Request,
  { params }: { params: { row: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.error();

  const row = Number(params.row);
  if (isNaN(row) || row < 2) {
    return NextResponse.json({ error: "Invalid row" }, { status: 400 });
  }

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

  const updatedAt = new Date().toISOString().slice(0, 10);

  // Обновляем всю строку целиком (A{row}:J{row})
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Отклики!A${row}:J${row}`,
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

  return NextResponse.json({ ok: true });
}
