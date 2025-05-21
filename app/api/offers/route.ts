// app/api/offers/route.ts
import { getGoogleSheetsClient } from "@/core/lib/google-sheets";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/core/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { sheetId, offer } = await req.json();

  try {
    const sheet = await prisma.sheet.findFirst({
      where: { sheetId, userId: session.user.id },
    });

    if (!sheet) {
      return NextResponse.json(
        { error: "Sheet not found or access denied" },
        { status: 404 }
      );
    }

    const sheets = await getGoogleSheetsClient();

    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    const sheetName = sheetInfo.data.sheets?.[0]?.properties?.title || "Заявки";
    const rowCount =
      sheetInfo.data.sheets?.[0]?.properties?.gridProperties?.rowCount || 0;

    const offerNumber = rowCount;
    const currentDate = new Date().toISOString().split("T")[0];

    const request = {
      spreadsheetId: sheetId,
      range: `${sheetName}!A${rowCount + 1}:K${rowCount + 1}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            offerNumber,
            currentDate,
            offer.company,
            offer.position,
            offer.link,
            offer.status || "Отправлено",
            offer.comments || "",
            offer.contactPerson || "",
            offer.contactInfo || "",
            offer.nextStep || "",
            offer.reminder || "",
          ],
        ],
      },
    };

    await sheets.spreadsheets.values.append(request);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding offer:", error);
    return NextResponse.json({ error: "Failed to add offer" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { sheetId, rowNumber, offer } = await req.json();

  try {
    const sheet = await prisma.sheet.findFirst({
      where: { sheetId, userId: session.user.id },
    });

    if (!sheet) {
      return NextResponse.json(
        { error: "Sheet not found or access denied" },
        { status: 404 }
      );
    }

    const sheets = await getGoogleSheetsClient();

    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    const sheetName = sheetInfo.data.sheets?.[0]?.properties?.title || "Заявки";

    const request = {
      spreadsheetId: sheetId,
      range: `${sheetName}!A${rowNumber}:K${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            rowNumber - 1,
            offer.date || "",
            offer.company,
            offer.position,
            offer.link,
            offer.status,
            offer.comments || "",
            offer.contactPerson || "",
            offer.contactInfo || "",
            offer.nextStep || "",
            offer.reminder || "",
          ],
        ],
      },
    };

    await sheets.spreadsheets.values.update(request);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const sheetId = searchParams.get("sheetId");

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!sheetId) {
    return NextResponse.json(
      { error: "Sheet ID is required" },
      { status: 400 }
    );
  }

  try {
    // Verify the sheet belongs to the user
    const sheet = await prisma.sheet.findFirst({
      where: {
        sheetId: sheetId, // Explicitly pass as string
        userId: session.user.id,
      },
    });

    if (!sheet) {
      return NextResponse.json(
        { error: "Sheet not found or access denied" },
        { status: 404 }
      );
    }

    const sheets = await getGoogleSheetsClient();

    // Get sheet info with proper type checking
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: sheetId, // Already validated as string
    });

    if (!sheetInfo.data.sheets?.[0]?.properties?.title) {
      return NextResponse.json(
        { error: "No valid sheet found in the spreadsheet" },
        { status: 404 }
      );
    }

    const sheetName = sheetInfo.data.sheets[0].properties.title;

    // Get values with proper type checking
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A2:K`,
    });

    // Type-safe mapping of offers
    const offers = (response.data.values || []).map((row, index) => ({
      rowNumber: index + 2,
      number: row[0] ?? "",
      date: row[1] ?? "",
      company: row[2] ?? "",
      position: row[3] ?? "",
      link: row[4] ?? "",
      status: row[5] ?? "",
      comments: row[6] ?? "",
      contactPerson: row[7] ?? "",
      contactInfo: row[8] ?? "",
      nextStep: row[9] ?? "",
      reminder: row[10] ?? "",
    }));

    return NextResponse.json({ offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}
