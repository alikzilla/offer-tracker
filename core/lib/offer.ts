export const STATUS_META = {
  response: { label: "Отклик", color: "bg-[#D9D9D9]" },
  viewed: { label: "Просмотрено", color: "bg-[#FFF2CC]" },
  invite: { label: "Приглашение", color: "bg-[#D9E1F2]" },
  interview: { label: "Интервью", color: "bg-[#FFE699]" },
  test: { label: "Тестовое", color: "bg-[#F4B183]" },
  offer: { label: "Оффер", color: "bg-[#C6E0B4]" },
  accepted: { label: "Принят", color: "bg-[#A9D08E]" },
  rejected: { label: "Отказ", color: "bg-[#F8CBAD]" },
  archived: { label: "Архив", color: "bg-[#C0C0C0]" },
} as const;

export type Offer = {
  id: string;
  company: string;
  position: string;
  status: keyof typeof STATUS_META;
  appliedAt: string;
};
