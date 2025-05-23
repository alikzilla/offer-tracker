import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/core/lib/auth";
import { getSheetsClient, getSpreadsheetId } from "@/core/lib/google-sheets";
import { STATUS_META } from "@/core/lib/offer";

type EntryRequest = {
  company: string;
  vacancy: string;
  status: keyof typeof STATUS_META;
  appliedAt: string;
  link?: string;
  location?: string;
  stack?: string;
  contacts?: string;
  notes?: string;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ row: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.error();

  const row = Number((await params).row);

  if (isNaN(row) || row < 2) {
    return NextResponse.json({ error: "Invalid row" }, { status: 400 });
  }

  const body = (await req.json()) as EntryRequest;

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
  } = body;

  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId(session);
  const updatedAt = new Date().toISOString().slice(0, 10);

  const statusLabel = STATUS_META[status].label;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Отклики!A${row}:J${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          company,
          vacancy,
          statusLabel,
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
