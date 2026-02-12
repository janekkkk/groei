import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shadcdn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcdn/components/ui/dialog";
import { Slider } from "@/shadcdn/components/ui/slider";

interface GridSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gridSize: { rows: number; cols: number };
  onGridSizeChange: (rows: number, cols: number) => void;
  onApply: (rows: number, cols: number) => void;
}

export const GridSettingsDialog = ({
  open,
  onOpenChange,
  gridSize,
  onGridSizeChange,
  onApply,
}: GridSettingsDialogProps) => {
  const { t } = useTranslation();

  const handleApply = () => {
    onApply(gridSize.rows, gridSize.cols);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {t("beds.customizeGridSize")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-sm">
                  {t("beds.rows")}: {gridSize.rows}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6"
                    onClick={() =>
                      onGridSizeChange(
                        Math.max(2, gridSize.rows - 1),
                        gridSize.cols,
                      )
                    }
                    disabled={gridSize.rows <= 2}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6"
                    onClick={() =>
                      onGridSizeChange(
                        Math.min(12, gridSize.rows + 1),
                        gridSize.cols,
                      )
                    }
                    disabled={gridSize.rows >= 12}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[gridSize.rows]}
                min={2}
                max={12}
                step={1}
                onValueChange={(value) =>
                  onGridSizeChange(value[0], gridSize.cols)
                }
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-sm">
                  {t("beds.columns")}: {gridSize.cols}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6"
                    onClick={() =>
                      onGridSizeChange(
                        gridSize.rows,
                        Math.max(2, gridSize.cols - 1),
                      )
                    }
                    disabled={gridSize.cols <= 2}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6"
                    onClick={() =>
                      onGridSizeChange(
                        gridSize.rows,
                        Math.min(16, gridSize.cols + 1),
                      )
                    }
                    disabled={gridSize.cols >= 16}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[gridSize.cols]}
                min={2}
                max={16}
                step={1}
                onValueChange={(value) =>
                  onGridSizeChange(gridSize.rows, value[0])
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {t("beds.totalCells")}: {gridSize.rows * gridSize.cols}
            </div>
            <Button onClick={handleApply}>{t("core.applyChanges")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
