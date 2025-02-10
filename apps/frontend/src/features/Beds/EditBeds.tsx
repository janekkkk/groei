import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "@/shadcdn/components/ui/input";
import { Label } from "@/shadcdn/components/ui/label";
import { Button } from "@/shadcdn/components/ui/button";
import { Bed } from "@groei/common/src/models/Bed";
import { useBedStore } from "./beds.store";
import { Textarea } from "@/shadcdn/components/ui/textarea";
import { classNames } from "@/shared/utils";
import { Minus, Plus } from "lucide-react";
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
import { Route } from "@/routes/beds/$bedId.lazy";
import { Seed } from "@groei/common/src/models/Seed";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import {
  useCreateBedMutation,
  useDeleteBedMutation,
  useUpdateBedMutation,
} from "@/features/Beds/useBedQuery";
import { isNumeric } from "@/shared/utils/is-numeric.helper";

const getEmptyBed = (): Bed =>
  ({
    id: crypto.randomUUID(),
    name: "",
    notes: "",
    gridWidth: 2,
    gridHeight: 2,
    grid: [],
    sowDate: new Date().toISOString().substring(0, 10),
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as Bed;

export const EditBeds = () => {
  const createBed = useCreateBedMutation();
  const updateBed = useUpdateBedMutation();
  const deleteBed = useDeleteBedMutation();
  const { beds } = useBedStore((state) => state);
  const { seeds } = useSeedStore((state) => state);
  const [bed, setBed] = useState<Bed>(getEmptyBed());
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { bedId } = Route.useParams();
  const isCreate = Number(bedId) === -1;
  const router = useRouter();

  const handleInputChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    let numberValue;

    if (isNumeric(value)) {
      numberValue = parseInt(value, 10);
      if (numberValue < 1) {
        return;
      }
    }

    setBed({ ...bed, [name]: numberValue ?? value, updatedAt: new Date() });
  };

  const handleSelectChange = (e: SelectChange) => {
    if (e.index !== undefined) {
      const grid = bed.grid;
      grid[e.index] = { index: e.index, seed: e.value as Seed };
      setBed({ ...bed, grid, updatedAt: new Date() });
    }
  };

  const handleDeleteBed = () => {
    if (bed && bed.id) {
      deleteBed.mutate(bed?.id);
      router.history.back();
    }
  };

  const addRow = () => {
    setBed({ ...bed, gridHeight: bed.gridHeight + 1 });
  };

  const removeRow = () => {
    setBed({ ...bed, gridHeight: bed.gridHeight - 1 });
  };

  const addColumn = () => {
    setBed({ ...bed, gridWidth: bed.gridWidth + 1 });
  };

  const removeColumn = () => {
    setBed({ ...bed, gridWidth: bed.gridWidth - 1 });
  };

  const handleSubmit = () => {
    if (isCreate) {
      createBed.mutate(bed);
      setBed(getEmptyBed());
      nameInputRef?.current?.focus();
    } else {
      updateBed.mutate(bed);
    }
  };

  const initExistingBed = useCallback(() => {
    const existingBed = beds.find((b) => b.id === bedId);
    console.log({ existingBed });
    if (bedId && !isCreate && existingBed) {
      setBed(existingBed as unknown as Bed);
    } else {
      setBed(getEmptyBed());
      nameInputRef?.current?.focus();
    }
  }, [bedId, beds, isCreate]);

  useEffect(() => {
    initExistingBed();
  }, [bedId, beds, initExistingBed]);

  useEffect(() => {
    console.log("useEffect", { bed });
  }, [bed]);

  return (
    <div>
      {isCreate && <h1 className="mb-4">Add Bed</h1>}
      {!isCreate && <h1 className="mb-4">Edit Bed</h1>}

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
          <Label htmlFor="sowDate">Sow Date:</Label>
          <Input
            type="date"
            name="sowDate"
            value={bed.sowDate}
            onChange={handleInputChange}
            required
          />

          {/*ToDo show how many days ago the bed was sown*/}
          {/*ToDO show how may weeks ago the bed was sown*/}
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
          <div className="flex mt-2">
            <div
              className={classNames(
                `grow grid gap-1 pr-2 grid-cols-${bed.gridWidth} grid-rows-${bed.gridHeight}`,
              )}
            >
              {Array.from({ length: bed.gridWidth * bed.gridHeight }).map(
                (_, i) => {
                  return (
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
                            {!bed?.grid?.[i]?.seed && <Plus />}

                            {bed?.grid?.[i]?.seed && (
                              <span className=" text-white text-sm">
                                {bed?.grid?.[i]?.seed.name}
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
                                value={
                                  bed?.grid?.[i]?.seed as unknown as string
                                }
                                defaultOpen
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
                                    <SelectItem
                                      value={null as unknown as string}
                                    >
                                      None
                                    </SelectItem>
                                    {seeds.map((seed) => (
                                      <SelectItem
                                        key={seed.name}
                                        value={seed as unknown as string}
                                      >
                                        {seed.name}{" "}
                                        {seed.variety && (
                                          <span> - {seed.variety}</span>
                                        )}
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
                  );
                },
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Button
                variant="secondary"
                type="button"
                className="h-full"
                title="Add Column"
                onClick={addColumn}
              >
                <Plus />
              </Button>
              <Button
                variant="secondary"
                type="button"
                className="h-full"
                title="Remove Column"
                onClick={removeColumn}
              >
                <Minus />
              </Button>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="secondary"
              type="button"
              className="w-full mt-2"
              title="Add Row"
              onClick={addRow}
            >
              <Plus />
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="w-full mt-2"
              title="Remove Row"
              onClick={removeRow}
            >
              <Minus />
            </Button>
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
          <Button
            type="button"
            onClick={handleDeleteBed}
            className={classNames({ hidden: isCreate })}
            variant="destructive"
          >
            Delete
          </Button>
          {useCanGoBack() && (
            <Button
              type="button"
              onClick={() => router.history.back()}
              variant="secondary"
            >
              Cancel
            </Button>
          )}
          <Button type="submit">{isCreate ? "Create" : "Update"}</Button>
        </div>
      </form>
    </div>
  );
};
