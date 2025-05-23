import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/core/lib/auth";
import { Session } from "next-auth";

export async function getSheetsClient() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.accessToken || !session.user.refreshToken) {
    throw new Error("Not authenticated");
  }

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2.setCredentials({
    access_token: session.user.accessToken,
    refresh_token: session.user.refreshToken,
  });

  return google.sheets({ version: "v4", auth: oauth2 });
}

export function getSpreadsheetId(session: Session) {
  if (!session.user.sheet?.sheetId) {
    throw new Error("Sheet not created");
  }
  return session.user.sheet.sheetId;
}
