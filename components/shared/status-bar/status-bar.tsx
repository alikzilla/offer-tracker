import { Tabs, TabsList, TabsTrigger } from "@/components/ui";

const STATUS_META: Record<string, { label: string; color: string }> = {
  response: { label: "Отклик", color: "bg-[#D9D9D9]" },
  viewed: { label: "Просмотрено", color: "bg-[#FFF2CC]" },
  invite: { label: "Приглашение", color: "bg-[#D9E1F2]" },
  interview: { label: "Интервью", color: "bg-[#FFE699]" },
  test: { label: "Тестовое", color: "bg-[#F4B183]" },
  offer: { label: "Оффер", color: "bg-[#C6E0B4]" },
  accepted: { label: "Принят", color: "bg-[#A9D08E]" },
  rejected: { label: "Отказ", color: "bg-[#F8CBAD]" },
  archived: { label: "Архив", color: "bg-[#C0C0C0]" },
};

const statusTabs = ["all", ...Object.keys(STATUS_META)];

const StatusTabs = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList className="w-full overflow-x-auto px-0 flex gap-1 bg-transparent">
        {statusTabs.map((v) => (
          <TabsTrigger
            key={v}
            value={v}
            className="shrink-0 px-3 py-1 text-xs capitalize rounded-full border hover:bg-muted"
          >
            {v === "all"
              ? "Все"
              : STATUS_META[v as keyof typeof STATUS_META].label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default StatusTabs;
