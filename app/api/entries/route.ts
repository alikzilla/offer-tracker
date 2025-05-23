import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/core/lib/auth";
import { getSheetsClient, getSpreadsheetId } from "@/core/lib/google-sheets";
import { STATUS_META } from "@/core/lib/offer";

type EntryRequest = {
  company: string;
  vacancy: string;
  status: keyof typeof STATUS_META; // ← here TS knows this is one of the keys
  appliedAt: string;
  link?: string;
  location?: string;
  stack?: string;
  contacts?: string;
  notes?: string;
};

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

  // Текущая дата как "последний апдейт"
  const updatedAt = new Date().toISOString().slice(0, 10);

  const statusLabel = STATUS_META[status].label;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Отклики!A:J",
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

  return NextResponse.json({ ok: true }, { status: 201 });
}
