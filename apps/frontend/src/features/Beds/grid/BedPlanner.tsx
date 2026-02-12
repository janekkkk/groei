import type { Bed } from "@groei/common/src/models/Bed";
import type { Seed } from "@groei/common/src/models/Seed";
import { Grid, Sprout } from "lucide-react";
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
import { GridCell } from "./GridCell";
import { GridSettingsDialog } from "./GridSettingsDialog";
import { SeedSelectionDialog } from "./SeedSelectionDialog";

interface GridCellData {
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
  const [grid, setGrid] = useState<GridCellData[][]>(() => {
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

  const handleGridSizeChange = (rows: number, cols: number) => {
    setGridSize({ rows, cols });
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
              row.map((cell, colIndex) => (
                <GridCell
                  key={`cell-${rowIndex}-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: Using row and column index as key for grid cells is acceptable in this case since the grid structure is stable and doesn't reorder cells.
                    colIndex
                  }`}
                  seed={cell.seed}
                  row={rowIndex}
                  col={colIndex}
                  isDragOverCell={
                    dragOverCell?.row === rowIndex &&
                    dragOverCell?.col === colIndex
                  }
                  isDraggedItem={
                    draggedItem?.row === rowIndex &&
                    draggedItem?.col === colIndex
                  }
                  isLongPressed={
                    longPressedCell?.row === rowIndex &&
                    longPressedCell?.col === colIndex
                  }
                  onCellClick={handleCellClick}
                  onRemoveSeed={handleRemoveSeed}
                  onRemoveButtonLongPress={handleCellLongPress}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleCellLongPress(rowIndex, colIndex);
                  }}
                  onTouchStart={(e) => {
                    if (cell.seed) {
                      handleTouchStart(rowIndex, colIndex, cell.seed, e);
                    }
                  }}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  dragMode={dragMode}
                />
              )),
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seed Selection Dialog */}
      <SeedSelectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        availableSeeds={availableSeeds}
        onSeedSelect={handleSeedSelect}
      />

      {/* Grid Settings Dialog */}
      <GridSettingsDialog
        open={isGridDialogOpen}
        onOpenChange={setIsGridDialogOpen}
        gridSize={gridSize}
        onGridSizeChange={handleGridSizeChange}
        onApply={handleGridResize}
      />
    </div>
  );
};
