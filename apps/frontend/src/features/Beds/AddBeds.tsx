import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { Input } from "@/shadcdn/components/ui/input";
import { Label } from "@/shadcdn/components/ui/label";
import { Button } from "@/shadcdn/components/ui/button";
import { Bed } from "@/features/Beds/beds.model";
import { useBedStore } from "./beds.store";
import { Textarea } from "@/shadcdn/components/ui/textarea";
import { classNames } from "@/shared/utils";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcdn/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcdn/components/ui/select";
import { SelectChange } from "@/shared/select.model";
import { useSeedStore } from "@/features/Seeds/seeds.store";
import { Seed } from "@/features/Seeds/seeds.model";

const emptyBed: Bed = {
  id: "", // generate uuid?
  name: "",
  notes: "",
  gridWidth: 2,
  gridHeight: 2,
  grid: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const AddBeds = () => {
  const { addBed } = useBedStore((state) => state);
  const { seeds } = useSeedStore((state) => state);
  const [bed, setBed] = useState<Bed>(emptyBed);
  const nameInputRef = useRef<HTMLInputElement>(null); // Initialize with null

  const handleInputChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setBed({ ...bed, [name]: value });
  };

  const handleSelectChange = (e: SelectChange) => {
    if (e.index !== undefined) {
      const grid = bed.grid;
      grid[e.index] = { index: e.index, seed: e.value as Seed };
      setBed({ ...bed, grid });
    }
  };

  const handleSubmit = () => {
    addBed(bed);
    setBed(emptyBed);
    nameInputRef?.current?.focus();
  };

  useEffect(() => {
    console.log({ bed });
  }, [bed]);

  return (
    <div>
      <h1 className="mb-4">Add Beds</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-2"
      >
        <div>
          <Label htmlFor="name">Name:</Label>
          <Input
            type="text"
            name="name"
            value={bed.name}
            onChange={handleInputChange}
            required
            ref={nameInputRef}
          />
        </div>
        <div>
          <Label htmlFor="gridWidth">Grid Width:</Label>
          <p className="text-sm text-muted-foreground">
            Set the number of columns for the grid. Every grid cell is roughly
            30x30cm.
          </p>
          <Input
            type="number"
            name="gridWidth"
            value={bed.gridWidth}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="gridWidth">Grid Height:</Label>
          <p className="text-sm text-muted-foreground">
            Set the number of rows for the grid. Every grid cell is roughly
            30x30cm.
          </p>
          <Input
            type="number"
            name="gridHeight"
            value={bed.gridHeight}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="grid">Grid:</Label>
          <p className="text-sm text-muted-foreground">
            By clicking on a cell in the grid you can add seeds to it.
          </p>
          <div
            className={classNames(
              `grid gap-1 grid-cols-${bed.gridWidth} grid-rows-${bed.gridHeight} mt-2`,
            )}
          >
            {Array.from({ length: bed.gridWidth * bed.gridHeight }).map(
              (_, i) => (
                <Popover key={i}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="p-2 bg-amber-900 text-white hover:text-white hover:bg-amber-800 border rounded-xl relative cursor-pointer"
                    >
                      <span className="absolute bottom-1 right-2 text-xs">
                        <span className="sr-only">Cell</span>
                        {i + 1}
                      </span>
                      <div className="flex justify-center items-center">
                        {!bed.grid[i]?.seed && <Plus />}

                        {bed.grid[i]?.seed && (
                          <span className=" text-white text-sm">
                            {bed.grid[i]?.seed.name}
                          </span>
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Seed</h4>
                        <p className="text-sm text-muted-foreground">
                          Plant a seed for this grid cell.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex gap-2">
                          <Label htmlFor="selectSeed" className="sr-only">
                            Select Seed
                          </Label>
                          <Select
                            name="selectSeed"
                            value={bed.grid[i]?.seed}
                            className="w-full"
                            onValueChange={(value) =>
                              handleSelectChange({
                                name: "grid",
                                index: i,
                                value: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Seed" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {seeds.map((seed) => (
                                  <SelectItem key={seed.name} value={seed}>
                                    {seed.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ),
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes:</Label>
          <Textarea
            name="notes"
            value={bed.notes}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" onClick={() => console.log("Cancelled")}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};
