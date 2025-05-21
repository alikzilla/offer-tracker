import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/core/lib/auth";

export async function getGoogleSheetsClient() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.user.accessToken });

  return google.sheets({ version: "v4", auth });
}

export async function deleteGoogleSheet(
  spreadsheetId: string,
  accessToken: string
) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: "v3", auth });

  try {
    await drive.files.delete({
      fileId: spreadsheetId,
    });
    return true;
  } catch (error) {
    console.error("Error deleting Google Sheet:", error);
    throw error;
  }
}

export const DEFAULT_HEADERS = [
  "№",
  "Дата отклика",
  "Компания",
  "Вакансия",
  "Ссылка",
  "Статус",
  "Комментарий",
  "Контактное лицо",
  "Email/Телеграм",
  "Следующий шаг",
  "Напоминание",
];
