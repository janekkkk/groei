import type { Seed } from "@groei/common/src/models/Seed";
import { Plus, X } from "lucide-react";
import { Button } from "@/shadcdn/components/ui/button";
import { cn } from "@/shadcdn/lib/utils";
import { getVegetableColor } from "./vegetableColors";
import { getVegetableIcon } from "./vegetableIcons";

interface GridCellProps {
  seed?: Seed;
  row: number;
  col: number;
  isDragOverCell: boolean;
  isDraggedItem: boolean;
  isLongPressed: boolean;
  onCellClick: (row: number, col: number) => void;
  onRemoveSeed: (row: number, col: number) => void;
  onRemoveButtonLongPress: (row: number, col: number) => void;
  onDragStart: (
    e: React.DragEvent,
    row: number,
    col: number,
    seed: Seed,
  ) => void;
  onDragOver: (e: React.DragEvent, row: number, col: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, row: number, col: number) => void;
  onDragEnd: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  dragMode: boolean;
}

export const GridCell = ({
  seed,
  row,
  col,
  isDragOverCell,
  isDraggedItem,
  isLongPressed,
  onCellClick,
  onRemoveSeed,
  onRemoveButtonLongPress,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onContextMenu,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  dragMode,
}: GridCellProps) => {
  const cellId = `cell-${row * 7 + col}`;

  return (
    // biome-ignore lint/a11y/useSemanticElements: Cannot use button element as it contains a button (remove seed)
    <div
      key={cellId}
      role="button"
      tabIndex={0}
      data-cell="true"
      data-row={row}
      data-col={col}
      draggable={dragMode && !!seed}
      className={cn(
        "relative h-10 w-10 border-2 border-gray-300 border-dashed sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16",
        "cursor-pointer rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500",
        row !== 0 && "hover:border-green-400",
        seed ? "border-solid" : row !== 0 && "hover:bg-green-50",
        isDragOverCell && "border-green-500 bg-green-100",
        isDraggedItem && "opacity-50",
      )}
      onClick={() => onCellClick(row, col)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCellClick(row, col);
        }
      }}
      onDragStart={(e) => seed && onDragStart(e, row, col, seed)}
      onDragOver={(e) => onDragOver(e, row, col)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, row, col)}
      onDragEnd={onDragEnd}
      onContextMenu={onContextMenu}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label={
        seed
          ? `${seed.name} planted at row ${row + 1}, column ${col + 1}`
          : `Empty cell at row ${row + 1}, column ${col + 1}. Click to plant seed.`
      }
    >
      {seed ? (
        <div className="group relative h-full w-full">
          <div
            className={cn(
              "flex h-full w-full items-center justify-center rounded-md opacity-90",
              getVegetableColor(seed.name),
            )}
          >
            {(() => {
              const IconComponent = getVegetableIcon(seed.name);
              return (
                <IconComponent className="h-5 w-5 text-white sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
              );
            })()}
          </div>
          {/* Remove button - show on desktop hover or mobile long press */}
          <Button
            size="sm"
            variant="destructive"
            className={cn(
              "absolute -top-1 -right-1 z-20 h-4 w-4 rounded-full p-0 transition-opacity sm:-top-2 sm:-right-2 sm:h-5 sm:w-5",
              "hidden group-hover:block",
              isLongPressed && "block!",
            )}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveSeed(row, col);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              const timer = setTimeout(() => {
                onRemoveButtonLongPress(row, col);
              }, 500);
              const cleanup = () => {
                clearTimeout(timer);
              };
              e.currentTarget.addEventListener("touchend", cleanup, {
                once: true,
              });
            }}
            aria-label={`Remove ${seed.name}`}
          >
            <X className="h-2 w-2 sm:h-3 sm:w-3" />
          </Button>
          {/* Seed name label */}
          <div className="absolute right-0 -bottom-5 left-0 z-10 truncate rounded bg-white/90 px-1 py-0.5 text-center font-medium text-[10px] shadow-sm sm:-bottom-6 sm:px-1.5 sm:py-1 sm:text-xs md:hidden md:group-hover:block dark:bg-gray-900/90">
            {seed.name}
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Plus className="h-3 w-3 text-gray-400 sm:h-4 sm:w-4" />
        </div>
      )}
    </div>
  );
};
