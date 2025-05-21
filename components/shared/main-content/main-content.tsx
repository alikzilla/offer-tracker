"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AddOfferForm } from "../add-offer-form/add-offer-form";
import { SheetStatus } from "../status-sheet/status-sheet";

const MainContent = () => {
  const { data: session } = useSession();
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 flex-1">
        <h1 className="text-xl font-bold">You need to sign in to start</h1>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center flex-1 gap-6 p-4 pb-20">
      <SheetStatus />

      <OfferFormSection isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
    </main>
  );
};

const OfferFormSection = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <Collapsible
    open={isOpen}
    onOpenChange={onOpenChange}
    className="w-full max-w-2xl"
  >
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xl font-semibold">
        {isOpen ? "Add New Offer" : "Ready to add an offer?"}
      </h2>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm">
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle form</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent>
      <AddOfferForm onSuccess={() => onOpenChange(false)} />
    </CollapsibleContent>
  </Collapsible>
);

export default MainContent;
