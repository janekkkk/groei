import { useCallback, useEffect, useRef, useState } from "react";
import { Grid, Minus, Plus, Sprout, X } from "lucide-react";
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
import { useTranslation } from "react-i18next";
import { Bed } from "@groei/common/src/models/Bed";
import { Seed } from "@groei/common/src/models/Seed";
import { useSeedStore } from "@/features/Seeds/seeds.store";

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
            // @ts-ignore
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
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update grid when bed grid size changes
  useEffect(() => {
    setGridSize({ rows: bed.gridHeight, cols: bed.gridWidth });

    // Update grid with new dimensions
    const newGrid = Array(bed.gridHeight)
      .fill(null)
      .map((_, row) =>
        Array(bed.gridWidth)
          .fill(null)
          .map((_, col) => {
            const index = row * bed.gridWidth + col;
            const existingSeed =
              bed.grid && bed.grid[index] ? bed.grid[index].seed : undefined;
            return { row, col, seed: existingSeed };
          }),
      );
    setGrid(newGrid);
  }, [bed.grid, bed.gridHeight, bed.gridWidth]);

  // Update grid seeds when bed.grid changes (but skip on initial render)
  const initialRenderRef = useRef(true);
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    // Only update seeds in the grid, not recreating the whole grid
    if (bed.grid) {
      const newGrid = [...grid];

      // Clear existing seeds first
      for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[row].length; col++) {
          delete newGrid[row][col].seed;
        }
      }

      // Add seeds from bed.grid
      bed.grid.forEach((item) => {
        if (item.seed) {
          const row = Math.floor(item.index / gridSize.cols);
          const col = item.index % gridSize.cols;
          if (row < newGrid.length && col < newGrid[row].length) {
            newGrid[row][col].seed = item.seed;
          }
        }
      });

      setGrid(newGrid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bed.grid, gridSize.cols]);

  // Update bed when grid changes - using a debounced approach
  const gridUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    if (JSON.stringify(flatGrid) !== JSON.stringify(bed.grid)) {
      onBedChange({
        ...bed,
        grid: flatGrid,
        updatedAt: new Date(),
      });
    }
  }, [grid, gridSize.cols, bed, onBedChange]);

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
  }, [grid, debouncedUpdateBed]);

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
      updatedAt: new Date(),
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
      dragPreview.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17.259V12a5 5 0 0 1 10 0v5.259"></path><path d="M12 22v-3"></path><path d="M3 14c.83.643 1.983 1 3.5 1s2.67-.357 3.5-1c.83.643 1.983 1 3.5 1s2.67-.357 3.5-1"></path></svg>`;
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
      updatedAt: new Date(),
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

    // Use a timeout to distinguish between tap and drag
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
      const row = Number.parseInt(cellElement.getAttribute("data-row") || "-1");
      const col = Number.parseInt(cellElement.getAttribute("data-col") || "-1");

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
      updatedAt: new Date(),
    };

    // Update the parent component first, then update the local grid
    onBedChange(updatedBed);

    // Update local grid state after the bed has been updated
    setGrid(newGrid);
    setDraggedItem(null);
    setDragOverCell(null);
    setTouchStartPos(null);
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
    <div className="space-y-4">
      {/* Garden Grid Header */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1 text-lg">
              <Sprout className="w-5 h-5 text-green-600" />
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
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">{t("beds.gridSize")}</span>
              </Button>
            </div>
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
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
            className="grid gap-1 sm:gap-2 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
              maxWidth: "fit-content",
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  data-cell="true"
                  data-row={rowIndex}
                  data-col={colIndex}
                  className={cn(
                    "relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 border-2 border-dashed border-gray-300",
                    "rounded-lg cursor-pointer transition-all duration-200 hover:border-green-400",
                    cell.seed ? "border-solid" : "hover:bg-green-50",
                    dragOverCell?.row === rowIndex &&
                      dragOverCell?.col === colIndex &&
                      "bg-green-100 border-green-500",
                    draggedItem?.row === rowIndex &&
                      draggedItem?.col === colIndex &&
                      "opacity-50",
                  )}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {cell.seed ? (
                    <div
                      className="relative w-full h-full"
                      draggable={dragMode}
                      onDragStart={(e) =>
                        handleDragStart(e, rowIndex, colIndex, cell.seed!)
                      }
                      onDragEnd={handleDragEnd}
                      onTouchStart={(e) =>
                        handleTouchStart(rowIndex, colIndex, cell.seed!, e)
                      }
                    >
                      <div
                        className={`w-full h-full rounded-md bg-emerald-500 opacity-80 flex items-center justify-center`}
                      >
                        <Sprout className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      {!dragMode && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 p-0 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSeed(rowIndex, colIndex);
                          }}
                        >
                          <X className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                      )}
                      <div className="absolute -bottom-5 sm:-bottom-6 left-0 right-0 text-[10px] sm:text-xs text-center font-medium truncate">
                        {cell.seed.name}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              )),
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
            {availableSeeds.map((seed) => (
              <Button
                key={seed.id}
                variant="outline"
                className="h-auto p-3 justify-start"
                onClick={() => handleSeedSelect(seed)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={`w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center`}
                  >
                    <Sprout className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{seed.name}</div>
                    {seed.variety && (
                      <div className="text-xs text-muted-foreground">
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
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
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
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
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

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {t("beds.totalCells")}: {gridSize.rows * gridSize.cols}
              </div>
              <Button
                onClick={() => handleGridResize(gridSize.rows, gridSize.cols)}
              >
                {t("core.applyChanges")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
