import type { Seed } from "@groei/common/src/models/Seed";
import { useTranslation } from "react-i18next";
import { Button } from "@/shadcdn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcdn/components/ui/dialog";
import { cn } from "@/shadcdn/lib/utils";
import { getVegetableColor } from "./vegetableColors";
import { getVegetableIcon } from "./vegetableIcons";

interface SeedSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableSeeds: Seed[];
  onSeedSelect: (seed: Seed) => void;
}

export const SeedSelectionDialog = ({
  open,
  onOpenChange,
  availableSeeds,
  onSeedSelect,
}: SeedSelectionDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{t("seeds.chooseSeed")}</DialogTitle>
        </DialogHeader>
        <div className="grid max-h-[60vh] grid-cols-1 gap-2 overflow-y-auto md:grid-cols-2">
          {availableSeeds
            .sort((a: Seed, b: Seed) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
            )
            .map((seed) => (
              <Button
                key={seed.id}
                variant="outline"
                className="h-auto justify-start p-3"
                onClick={() => onSeedSelect(seed)}
              >
                <div className="flex w-full items-center gap-2">
                  <div
                    className={cn(
                      `flex h-6 w-6 items-center justify-center rounded-full`,
                      getVegetableColor(seed.name),
                    )}
                  >
                    {(() => {
                      const IconComponent = getVegetableIcon(seed.name);
                      return <IconComponent className="h-4 w-4 text-white" />;
                    })()}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{seed.name}</div>
                    {seed.variety && (
                      <div className="text-muted-foreground text-xs">
                        {seed.variety}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
