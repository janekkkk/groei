import type { Bed } from "@groei/common/src/models/Bed";
import type { Seed } from "@groei/common/src/models/Seed";
import { Grid, Minus, Plus, Sprout, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSeedStore } from "@/features/Seeds/seeds.store";
import { Button } from "@/shadcdn/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcdn/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcdn/components/ui/dialog";
import { Slider } from "@/shadcdn/components/ui/slider";
import { cn } from "@/shadcdn/lib/utils";

interface GridCell {
  row: number;
  col: number;
  seed?: Seed;
}

interface DragItem {
  row: number;
  col: number;
  seed: Seed;
}

// Map seed names to their colors for visual distinction
const getVegetableColor = (seedName: string): string => {
  const lowerName = seedName.toLowerCase();
  const colorMap: Record<string, string> = {
    tomato: "bg-red-500",
    carrot: "bg-orange-500",
    cucumber: "bg-green-600",
    zucchini: "bg-green-600",
    basil: "bg-green-500",
    parsley: "bg-green-500",
    chives: "bg-green-500",
    spinach: "bg-green-700",
    kale: "bg-green-700",
    "tuscan kale": "bg-green-700",
    "swiss chard": "bg-blue-600",
    pepper: "bg-yellow-500",
    bean: "bg-amber-600",
    "broad bean": "bg-amber-600",
    "winter pea": "bg-amber-600",
    sugarsnap: "bg-amber-600",
    beetroot: "bg-purple-600",
    radish: "bg-pink-500",
    lettuce: "bg-lime-500",
    cabbage: "bg-green-600",
    "white cabbage": "bg-gray-400",
    "pointed cabbage": "bg-green-600",
    broccoli: "bg-green-700",
    cauliflower: "bg-gray-350",
    leek: "bg-green-600",
    corn: "bg-yellow-400",
    "corn salad": "bg-green-500",
    sunflower: "bg-yellow-400",
  };

  return colorMap[lowerName] || "bg-emerald-500";
};

interface BedPlannerProps {
  bed: Bed;
  onBedChange: (bed: Bed) => void;
  isCreate: boolean;
}

export const BedPlanner = ({ bed, onBedChange, isCreate }: BedPlannerProps) => {
  const { t } = useTranslation();
  const { seeds: availableSeeds } = useSeedStore((state) => state);

  const [gridSize, setGridSize] = useState({
    rows: bed.gridHeight,
    cols: bed.gridWidth,
  });
  const [isGridDialogOpen, setIsGridDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [grid, setGrid] = useState<GridCell[][]>(() => {
    // Convert flat grid array to 2D grid
    const grid2D = Array(gridSize.rows)
      .fill(null)
      .map((_, row) =>
        Array(gridSize.cols)
          .fill(null)
          .map((_, col) => {
            return { row, col, seed: undefined };
          }),
      );

    // Add seeds from bed.grid at their correct positions
    if (bed.grid && bed.grid.length > 0) {
      bed.grid.forEach((gridItem) => {
        if (gridItem.seed && gridItem.index !== undefined) {
          const row = Math.floor(gridItem.index / gridSize.cols);
          const col = gridItem.index % gridSize.cols;

          // Make sure the position is within our grid bounds
          if (row < gridSize.rows && col < gridSize.cols) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            grid2D[row][col].seed = gridItem.seed;
          }
        }
      });
    }

    return grid2D;
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dragMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [longPressedCell, setLongPressedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update grid when bed grid size changes
  useEffect(() => {
    setGridSize({ rows: bed.gridHeight, cols: bed.gridWidth });
    console.log("Updating grid size:", bed.gridHeight, bed.gridWidth);

    // Update grid with new dimensions
    const newGrid = Array(bed.gridHeight)
      .fill(null)
      .map((_, row) =>
        Array(bed.gridWidth)
          .fill(null)
          .map((_, col) => {
            const index = row * bed.gridWidth + col;
            // Look for seed at this specific index position
            const gridItem = bed.grid?.find((item) => item.index === index);
            const existingSeed = gridItem?.seed;
            return { row, col, seed: existingSeed };
          }),
      );
    setGrid(newGrid);
  }, [bed.grid, bed.gridHeight, bed.gridWidth]);

  // Update bed when grid changes - using a debounced approach
  const gridUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bedRef = useRef(bed);

  // Keep bed ref up to date
  useEffect(() => {
    bedRef.current = bed;
  }, [bed]);

  // Function to update the bed (outside of useEffect)
  const updateBedFromGrid = useCallback(() => {
    // Convert 2D grid to flat array for bed
    const flatGrid = grid
      .flat()
      .map((cell) => {
        const index = cell.row * gridSize.cols + cell.col;
        return {
          index,
          seed: cell.seed,
        };
      })
      .filter((item) => item.seed); // Only include cells with seeds

    // Only update if grid has changed
    const currentBed = bedRef.current;
    if (JSON.stringify(flatGrid) !== JSON.stringify(currentBed.grid)) {
      onBedChange({
        ...currentBed,
        grid: flatGrid,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [grid, gridSize.cols, onBedChange]);

  // Use this function after any grid changes
  const debouncedUpdateBed = useCallback(() => {
    if (gridUpdateTimeoutRef.current) {
      clearTimeout(gridUpdateTimeoutRef.current);
    }

    gridUpdateTimeoutRef.current = setTimeout(() => {
      updateBedFromGrid();
    }, 300); // 300ms debounce
  }, [updateBedFromGrid]);

  // Update bed when grid changes
  useEffect(() => {
    debouncedUpdateBed();

    return () => {
      if (gridUpdateTimeoutRef.current) {
        clearTimeout(gridUpdateTimeoutRef.current);
      }
    };
  }, [debouncedUpdateBed]);

  const handleCellClick = (row: number, col: number) => {
    if (dragMode) return;
    setSelectedCell({ row, col });
    setIsDialogOpen(true);
  };

  const handleSeedSelect = (seed: Seed) => {
    if (selectedCell) {
      const newGrid = [...grid];
      newGrid[selectedCell.row][selectedCell.col] = {
        ...newGrid[selectedCell.row][selectedCell.col],
        seed: seed,
      };
      setGrid(newGrid);
      setIsDialogOpen(false);
      setSelectedCell(null);
    }
  };

  const handleRemoveSeed = (row: number, col: number) => {
    const newGrid = [...grid];
    delete newGrid[row][col].seed;
    setGrid(newGrid);
  };

  const getPlantedSeedsCount = () => {
    return grid.flat().filter((cell) => cell.seed).length;
  };

  const handleGridResize = (newRows: number, newCols: number) => {
    // Create a new grid with the new dimensions
    const newGrid = Array(newRows)
      .fill(null)
      .map((_, row) =>
        Array(newCols)
          .fill(null)
          .map((_, col) => {
            // Preserve existing seeds if the cell exists in the old grid
            if (row < grid.length && col < grid[0].length) {
              return { ...grid[row][col] };
            }
            return { row, col };
          }),
      );

    setGrid(newGrid);
    setGridSize({ rows: newRows, cols: newCols });

    // Update bed dimensions
    onBedChange({
      ...bed,
      gridWidth: newCols,
      gridHeight: newRows,
      updatedAt: new Date().toISOString(),
    });

    setIsGridDialogOpen(false);
  };

  // Drag and drop handlers
  const handleDragStart = (
    e: React.DragEvent,
    row: number,
    col: number,
    seed: Seed,
  ) => {
    if (!dragMode) return;

    setDraggedItem({ row, col, seed });

    // Set drag image (optional)
    if (e.dataTransfer.setDragImage) {
      const dragPreview = document.createElement("div");
      dragPreview.className = `w-12 h-12 rounded-md bg-emerald-500 opacity-80 flex items-center justify-center`;

      // Create SVG element properly to avoid attribute issues
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "white");
      svg.setAttribute("stroke-width", "2");

      const path1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path1.setAttribute("d", "M7 17.259V12a5 5 0 0 1 10 0v5.259");

      const path2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path2.setAttribute("d", "M12 22v-3");

      const path3 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path3.setAttribute(
        "d",
        "M3 14c.83.643 1.983 1 3.5 1s2.67-.357 3.5-1c.83.643 1.983 1 3.5 1s2.67-.357 3.5-1",
      );

      svg.appendChild(path1);
      svg.appendChild(path2);
      svg.appendChild(path3);
      dragPreview.appendChild(svg);

      document.body.appendChild(dragPreview);
      e.dataTransfer.setDragImage(dragPreview, 24, 24);
      setTimeout(() => document.body.removeChild(dragPreview), 0);
    }

    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    if (!dragMode || !draggedItem) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCell({ row, col });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    if (!dragMode || !draggedItem) return;
    e.preventDefault();

    // Don't do anything if dropping onto the same cell
    if (draggedItem.row === row && draggedItem.col === col) {
      setDraggedItem(null);
      setDragOverCell(null);
      return;
    }

    // Create a new grid with the seed moved
    const newGrid = [...grid];

    // Remove seed from original position
    delete newGrid[draggedItem.row][draggedItem.col].seed;

    // Add seed to new position (replacing any existing seed)
    newGrid[row][col] = {
      ...newGrid[row][col],
      seed: { ...draggedItem.seed },
    };

    // Create the updated bed data with the new grid
    const flatGrid = newGrid
      .flat()
      .map((cell) => {
        const index = cell.row * gridSize.cols + cell.col;
        return {
          index,
          seed: cell.seed,
        };
      })
      .filter((item) => item.seed);

    // Create a new bed object with the updated grid
    const updatedBed = {
      ...bed,
      grid: flatGrid,
      updatedAt: new Date().toISOString(),
    };

    // Update the parent component first, then update the local grid
    onBedChange(updatedBed);

    // Update local grid state after the bed has been updated
    setGrid(newGrid);
    setDraggedItem(null);
    setDragOverCell(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverCell(null);
  };

  // Touch handlers for mobile drag and drop
  const handleTouchStart = (
    row: number,
    col: number,
    seed: Seed,
    e: React.TouchEvent,
  ) => {
    if (!dragMode) return;

    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });

    // Use a timeout to distinguish between tap and drag/long press
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setDraggedItem({ row, col, seed });
      // Add visual feedback that the item is being dragged
      const element = e.currentTarget as HTMLElement;
      element.classList.add("opacity-50", "scale-105");
    }, 200);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragMode || !draggedItem || !touchStartPos) return;

    // Clear the timeout to prevent it from triggering during a move
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }

    const touch = e.touches[0];

    // Find the element under the touch point
    const elementsUnderTouch = document.elementsFromPoint(
      touch.clientX,
      touch.clientY,
    );
    const cellElement = elementsUnderTouch.find((el) =>
      el.hasAttribute("data-cell"),
    );

    if (cellElement) {
      const row = Number.parseInt(
        cellElement.getAttribute("data-row") || "-1",
        10,
      );
      const col = Number.parseInt(
        cellElement.getAttribute("data-col") || "-1",
        10,
      );

      if (row >= 0 && col >= 0) {
        setDragOverCell({ row, col });
      } else {
        setDragOverCell(null);
      }
    } else {
      setDragOverCell(null);
    }
  };

  const handleTouchEnd = () => {
    // Clear the timeout
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }

    // Remove visual feedback
    const elements = document.querySelectorAll(".opacity-50.scale-105");
    elements.forEach((el) => {
      el.classList.remove("opacity-50", "scale-105");
    });

    if (!dragMode || !draggedItem || !dragOverCell) {
      setDraggedItem(null);
      setDragOverCell(null);
      setTouchStartPos(null);
      return;
    }

    // Create a new grid with the seed moved
    const newGrid = [...grid];

    // Remove seed from original position
    delete newGrid[draggedItem.row][draggedItem.col].seed;

    // Add seed to new position
    newGrid[dragOverCell.row][dragOverCell.col] = {
      ...newGrid[dragOverCell.row][dragOverCell.col],
      seed: { ...draggedItem.seed },
    };

    // Create the updated bed data with the new grid
    const flatGrid = newGrid
      .flat()
      .map((cell) => {
        const index = cell.row * gridSize.cols + cell.col;
        return {
          index,
          seed: cell.seed,
        };
      })
      .filter((item) => item.seed);

    // Create a new bed object with the updated grid
    const updatedBed = {
      ...bed,
      grid: flatGrid,
      updatedAt: new Date().toISOString(),
    };

    // Update the parent component first, then update the local grid
    onBedChange(updatedBed);

    // Update local grid state after the bed has been updated
    setGrid(newGrid);
    setDraggedItem(null);
    setDragOverCell(null);
    setTouchStartPos(null);
  };

  // Handle long press on cells to show remove button on mobile
  const handleCellLongPress = (row: number, col: number) => {
    setLongPressedCell({ row, col });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setLongPressedCell(null);
    }, 3000);
  };

  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      {/* Garden Grid Header */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1 text-lg">
              <Sprout className="h-5 w-5 text-green-600" />
              {t("beds.grid")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setIsGridDialogOpen(true)}
                disabled={!isCreate}
              >
                <Grid className="h-4 w-4" />
                <span className="hidden sm:inline">{t("beds.gridSize")}</span>
              </Button>
            </div>
          </div>
          <div className="flex gap-3 text-muted-foreground text-xs">
            <span>
              {t("beds.grid")}: {gridSize.rows} × {gridSize.cols}
            </span>
            <span>
              {t("beds.planted")}: {getPlantedSeedsCount()}/
              {gridSize.rows * gridSize.cols}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Garden Grid */}
      <Card>
        <CardContent className="p-6">
          <div
            className="mx-auto grid gap-1 sm:gap-2"
            style={{
              gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
              maxWidth: "fit-content",
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const cellId = `cell-${cell.row * gridSize.cols + cell.col}`;
                return (
                  // biome-ignore lint/a11y/useSemanticElements: Cannot use button element as it contains a button (remove seed)
                  <div
                    key={cellId}
                    role="button"
                    tabIndex={0}
                    data-cell="true"
                    data-row={rowIndex}
                    data-col={colIndex}
                    draggable={dragMode && !!cell.seed}
                    className={cn(
                      "relative h-10 w-10 border-2 border-gray-300 border-dashed sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16",
                      "cursor-pointer rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500",
                      rowIndex !== 0 && "hover:border-green-400",
                      cell.seed
                        ? "border-solid"
                        : rowIndex !== 0 && "hover:bg-green-50",
                      dragOverCell?.row === rowIndex &&
                        dragOverCell?.col === colIndex &&
                        "border-green-500 bg-green-100",
                      draggedItem?.row === rowIndex &&
                        draggedItem?.col === colIndex &&
                        "opacity-50",
                    )}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCellClick(rowIndex, colIndex);
                      }
                    }}
                    onDragStart={(e) =>
                      cell.seed &&
                      handleDragStart(e, rowIndex, colIndex, cell.seed)
                    }
                    onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                    onDragEnd={handleDragEnd}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleCellLongPress(rowIndex, colIndex);
                    }}
                    onTouchStart={(e) => {
                      if (cell.seed) {
                        handleTouchStart(rowIndex, colIndex, cell.seed, e);
                      } else {
                        // Long press on empty cell to prepare for planting
                        const timer = setTimeout(() => {
                          // Could show planting instructions here
                        }, 500);
                        const cleanup = () => {
                          clearTimeout(timer);
                        };
                        e.currentTarget.addEventListener("touchend", cleanup, {
                          once: true,
                        });
                      }
                    }}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    aria-label={
                      cell.seed
                        ? `${cell.seed.name} planted at row ${rowIndex + 1}, column ${colIndex + 1}`
                        : `Empty cell at row ${rowIndex + 1}, column ${colIndex + 1}. Click to plant seed.`
                    }
                  >
                    {cell.seed ? (
                      <div className="group relative h-full w-full">
                        <div
                          className={cn(
                            "flex h-full w-full items-center justify-center rounded-md opacity-90",
                            getVegetableColor(cell.seed.name),
                          )}
                        >
                          <Sprout className="h-5 w-5 text-white sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
                        </div>
                        {/* Remove button - show on desktop hover or mobile long press */}
                        <Button
                          size="sm"
                          variant="destructive"
                          className={cn(
                            "absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 sm:-top-2 sm:-right-2 sm:h-5 sm:w-5 transition-opacity",
                            // Desktop: show on group hover
                            "hidden group-hover:block",
                            // Mobile: show if long pressed
                            longPressedCell?.row === rowIndex &&
                              longPressedCell?.col === colIndex &&
                              "!block",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSeed(rowIndex, colIndex);
                            setLongPressedCell(null);
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            // Long press detection for remove button
                            const timer = setTimeout(() => {
                              handleCellLongPress(rowIndex, colIndex);
                            }, 500);
                            const cleanup = () => {
                              clearTimeout(timer);
                            };
                            e.currentTarget.addEventListener(
                              "touchend",
                              cleanup,
                              {
                                once: true,
                              },
                            );
                          }}
                          aria-label={`Remove ${cell.seed.name}`}
                        >
                          <X className="h-2 w-2 sm:h-3 sm:w-3" />
                        </Button>
                        <div className="absolute right-0 -bottom-5 left-0 truncate text-center font-medium text-[10px] sm:-bottom-6 sm:text-xs px-1 py-0.5 sm:px-1.5 sm:py-1 rounded bg-white/90 dark:bg-gray-900/90 shadow-sm z-10 md:hidden md:group-hover:block">
                          {cell.seed.name}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Plus className="h-3 w-3 text-gray-400 sm:h-4 sm:w-4" />
                      </div>
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seed Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {t("seeds.chooseSeed")}
            </DialogTitle>
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
                  onClick={() => handleSeedSelect(seed)}
                >
                  <div className="flex w-full items-center gap-2">
                    <div
                      className={cn(
                        `flex h-6 w-6 items-center justify-center rounded-full`,
                        getVegetableColor(seed.name),
                      )}
                    >
                      <Sprout className="h-4 w-4 text-white" />
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

      {/* Grid Settings Dialog */}
      <Dialog open={isGridDialogOpen} onOpenChange={setIsGridDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {t("beds.customizeGridSize")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
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
                      setGridSize((prev) => ({
                        ...prev,
                        rows: Math.max(2, prev.rows - 1),
                      }))
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
                      setGridSize((prev) => ({
                        ...prev,
                        rows: Math.min(12, prev.rows + 1),
                      }))
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
                  setGridSize((prev) => ({ ...prev, rows: value[0] }))
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
                      setGridSize((prev) => ({
                        ...prev,
                        cols: Math.max(2, prev.cols - 1),
                      }))
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
                      setGridSize((prev) => ({
                        ...prev,
                        cols: Math.min(16, prev.cols + 1),
                      }))
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
                  setGridSize((prev) => ({ ...prev, cols: value[0] }))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {t("beds.totalCells")}: {gridSize.rows * gridSize.cols}
            </div>
            <Button
              onClick={() => handleGridResize(gridSize.rows, gridSize.cols)}
            >
              {t("core.applyChanges")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
