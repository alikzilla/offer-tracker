"use client";

import { useState } from "react";

export default function CreateSheetButton() {
  const [loading, setLoading] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);

  async function createSheet() {
    setLoading(true);
    try {
      const res = await fetch("/api/sheets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Мой трекер заявок" }),
      });
      const data = await res.json();
      setSpreadsheetId(data.spreadsheetId);
    } catch {
      alert("Ошибка при создании таблицы");
    }
    setLoading(false);
  }

  return (
    <div>
      <button onClick={createSheet} disabled={loading}>
        {loading ? "Создаем..." : "Создать таблицу"}
      </button>
      {spreadsheetId && (
        <p>
          Таблица создана:{" "}
          <a
            href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть
          </a>
        </p>
      )}
    </div>
  );
}
