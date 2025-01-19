import { ChangeEventHandler, useRef, useState } from "react";
import { Input } from "@/shadcdn/components/ui/input";
import { Label } from "@/shadcdn/components/ui/label";
import { Button } from "@/shadcdn/components/ui/button";
import { Bed } from "@/features/Beds/beds.model";
import { useBedStore } from "./beds.store";
import { Textarea } from "@/shadcdn/components/ui/textarea";
import { classNames } from "@/shared/utils";

const emptyBed = {
  id: "", // generate uuid?
  name: "",
  notes: "",
  gridWidth: 0,
  gridHeight: 0,
};

export const AddBeds = () => {
  const { addBed } = useBedStore((state) => state);
  const [bed, setBed] = useState<Bed>(emptyBed);
  const nameInputRef = useRef<HTMLInputElement>(null); // Initialize with null

  const handleInputChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setBed({ ...bed, [name]: value });
  };

  const handleSubmit = () => {
    addBed(bed);
    setBed(emptyBed);
    nameInputRef?.current?.focus();
  };

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
          <Input
            type="number"
            name="gridHeight"
            value={bed.gridHeight}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes:</Label>
          <Textarea
            name="notes"
            value={bed.notes}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="grid">Grid:</Label>

          <div
            className={classNames(
              `grid gap-1 grid-cols-${bed.gridWidth} grid-rows-${bed.gridHeight} `,
            )}
          >
            {Array.from({ length: bed.gridWidth * bed.gridHeight }).map(
              (_, i) => (
                <div key={i} className="p-2 bg-gray-100 hover:bg-gray-200">
                  {i + 1}
                </div>
              ),
            )}
          </div>
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
