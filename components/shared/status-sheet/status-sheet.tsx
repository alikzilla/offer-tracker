"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui";
import { toast } from "sonner";
import { Loader2, ExternalLink } from "lucide-react";
import { CreateSheetDialog } from "../create-sheet-dialog/create-sheet-dialog";

const SheetStatus = () => {
  const { data: session, update } = useSession();

  if (!session?.user) {
    return null;
  }

  if (!session.user.sheet) {
    return <CreateSheetDialog />;
  }

  const handleRefresh = async () => {
    try {
      await update();
      toast.success("Sheet refreshed");
    } catch (error) {
      toast.error("Failed to refresh sheet");
    }
  };

  return (
    <div className="w-full max-w-2xl p-4 border rounded-lg bg-muted">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{session.user.sheet.name}</h3>
          <p className="text-sm text-muted-foreground">
            Created on{" "}
            {new Date(session.user.sheet.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <Loader2 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild variant="default" size="sm">
            <a
              href={`https://docs.google.com/spreadsheets/d/${session.user.sheet.sheetId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Sheet
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SheetStatus;
