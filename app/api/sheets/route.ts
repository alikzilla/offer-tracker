import {
  deleteGoogleSheet,
  getGoogleSheetsClient,
} from "@/core/lib/google-sheets";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/core/lib/auth";
import { NextResponse } from "next/server";
import { DEFAULT_HEADERS } from "@/core/lib/google-sheets";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();

  try {
    const existingSheet = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { sheet: true },
    });

    if (existingSheet?.sheet) {
      return NextResponse.json(
        { error: "You already have a sheet" },
        { status: 400 }
      );
    }

    const sheets = await getGoogleSheetsClient();

    const resource = {
      properties: { title: title || "My Offer Tracker" },
      sheets: [
        {
          properties: {
            title: "Offers",
            gridProperties: {
              rowCount: 100,
              columnCount: DEFAULT_HEADERS.length,
            },
          },
          data: [
            {
              rowData: [
                {
                  values: DEFAULT_HEADERS.map((header) => ({
                    userEnteredValue: { stringValue: header },
                  })),
                },
              ],
            },
          ],
        },
      ],
    };

    const response = await sheets.spreadsheets.create({
      requestBody: resource,
    });

    const sheet = await prisma.sheet.create({
      data: {
        name: title || "My Offer Tracker",
        sheetId: response.data.spreadsheetId!,
        user: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json({
      spreadsheetId: response.data.spreadsheetId,
      sheet,
    });
  } catch (error) {
    console.error("Error creating sheet:", error);
    return NextResponse.json(
      { error: "Failed to create spreadsheet" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userWithSheet = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { sheet: true },
    });

    if (!userWithSheet?.sheet) {
      return NextResponse.json({ sheet: null }, { status: 200 });
    }

    return NextResponse.json({ sheet: userWithSheet.sheet });
  } catch (error) {
    console.error("Error fetching sheet:", error);
    return NextResponse.json(
      { error: "Failed to fetch sheet" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();

  try {
    const userWithSheet = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { sheet: true },
    });

    if (!userWithSheet?.sheet) {
      return NextResponse.json({ error: "No sheet found" }, { status: 404 });
    }

    const sheets = await getGoogleSheetsClient();

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: userWithSheet.sheet.sheetId,
      requestBody: {
        requests: [
          {
            updateSpreadsheetProperties: {
              properties: {
                title: title || "My Offer Tracker",
              },
              fields: "title",
            },
          },
        ],
      },
    });

    const updatedSheet = await prisma.sheet.update({
      where: { id: userWithSheet.sheet.id },
      data: { name: title || "My Offer Tracker" },
    });

    return NextResponse.json({ sheet: updatedSheet });
  } catch (error) {
    console.error("Error updating sheet:", error);
    return NextResponse.json(
      { error: "Failed to update spreadsheet" },
      { status: 500 }
    );
  }
}

// export async function DELETE(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id || !session.user.accessToken) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return NextResponse.json(
//         { error: "Sheet ID is required" },
//         { status: 400 }
//       );
//     }

//     // Verify the sheet belongs to the user
//     const sheet = await prisma.sheet.findUnique({
//       where: {
//         id: id,
//         userId: session.user.id,
//       },
//     });

//     if (!sheet) {
//       return NextResponse.json(
//         { error: "Sheet not found or access denied" },
//         { status: 404 }
//       );
//     }

//     // First delete from Google Sheets
//     try {
//       await deleteGoogleSheet(sheet.sheetId, session.user.accessToken);
//     } catch (error) {
//       console.error("Google Sheet deletion failed:", error);
//     }

//     // Then delete from database
//     await prisma.sheet.delete({
//       where: { id },
//     });

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting sheet:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
