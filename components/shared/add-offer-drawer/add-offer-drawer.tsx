import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui";
import { Plus } from "lucide-react";
import { AddOfferForm } from "../add-offer-form/add-offer-form";

const AddOfferDrawer = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="rounded-full bg-primary text-white p-4 -mt-8 shadow-lg">
          <Plus size={24} />
        </button>
      </SheetTrigger>

      {/* full-screen на < md */}
      <SheetContent
        side="bottom"
        className="p-6 h-[90vh] md:h-auto md:w-[420px]"
      >
        <SheetTitle className="text-lg font-semibold mb-4">
          Новая вакансия
        </SheetTitle>
        <AddOfferForm />
      </SheetContent>
    </Sheet>
  );
};

export default AddOfferDrawer;
