import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "@/shadcdn/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcdn/components/ui/select";
import { Label } from "@/shadcdn/components/ui/label";
import { Button } from "@/shadcdn/components/ui/button";
import { Textarea } from "@/shadcdn/components/ui/textarea";
import { useSeedStore } from "@/features/Seeds/seeds.store";
import { SelectChange } from "@/shared/select.model";
import { Route } from "@/routes/seeds/$seedId.lazy";
import { Month, PlantHeight, Seed } from "@bladwijzer/common/src/models/Seed";

const emptySeed: Seed = {
  id: 0,
  name: "",
  variety: "",
  sowFrom: undefined,
  sowTill: undefined,
  plantFrom: undefined,
  plantTill: undefined,
  harvestFrom: undefined,
  harvestTill: undefined,
  daysToMaturity: undefined,
  plantHeight: undefined,
  plantDistance: undefined,
  quantity: undefined,
  numberOfSeedsPerGridCell: 1,
  notes: "",
  tags: [],
  url: "",
  expirationDate: undefined, // new Date().toISOString().substring(0, 10)
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined,
};

export const EditSeeds = () => {
  const { addSeed, updateSeed, seeds } = useSeedStore((state) => state);
  const [seed, setSeed] = useState<Seed>(emptySeed);
  const [newTag, setNewTag] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { seedId } = Route.useParams();
  const isCreate = Number(seedId) === -1;

  const handleInputChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setSeed({ ...seed, [name]: value, updatedAt: new Date() });
  };

  const handleSelectChange = (e: SelectChange) => {
    setSeed({ ...seed, [e.name]: e.value, updatedAt: new Date() });
  };

  const handleTagAdd = () => {
    setSeed({
      ...seed,
      tags: [...(seed.tags || []), newTag],
      updatedAt: new Date(),
    });
    setNewTag("");
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleSubmit = () => {
    if (isCreate) {
      addSeed(seed);
      setSeed(emptySeed);
      nameInputRef?.current?.focus();
    } else {
      updateSeed(seed);
    }
  };

  const initExistingSeed = useCallback(() => {
    const existingSeed = seeds.find((s) => s.id === Number(seedId));
    if (seedId && !isCreate && existingSeed) {
      setSeed(existingSeed as unknown as Seed);
    } else {
      setSeed(emptySeed);
      nameInputRef?.current?.focus();
    }
  }, [isCreate, seedId, seeds]);

  useEffect(() => {
    initExistingSeed();
  }, [initExistingSeed]);

  useEffect(() => {
    console.log({ seed });
  }, [seed]);

  return (
    <div>
      {isCreate && <h1 className="mb-4">Add Seed</h1>}
      {!isCreate && <h1 className="mb-4">Edit Seed</h1>}

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
            value={seed.name}
            onChange={handleInputChange}
            required
            ref={nameInputRef}
          />
        </div>
        <div>
          <Label htmlFor="variety">Variety:</Label>
          <Input
            type="text"
            name="variety"
            value={seed.variety}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="numberOfSeedsPerGridCell">
            Number of seeds per grid cell:
          </Label>
          <Input
            type="number"
            name="numberOfSeedsPerGridCell"
            value={seed.numberOfSeedsPerGridCell}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="grow">
            <Label htmlFor="sowFrom">Sow From:</Label>
            <Select
              name="sowFrom"
              value={seed.sowFrom}
              onValueChange={(value) =>
                handleSelectChange({ name: "sowFrom", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grow">
            <Label htmlFor="sowTill">Sow Till:</Label>
            <Select
              name="sowTill"
              value={seed.sowTill}
              onValueChange={(value) =>
                handleSelectChange({ name: "sowTill", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <div className="grow">
            <Label htmlFor="plantFrom">Plant From:</Label>
            <Select
              name="plantFrom"
              value={seed.plantFrom}
              onValueChange={(value) =>
                handleSelectChange({ name: "plantFrom", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grow">
            <Label htmlFor="plantTill">Plant Till:</Label>
            <Select
              name="plantTill"
              value={seed.plantTill}
              onValueChange={(value) =>
                handleSelectChange({ name: "plantTill", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <div className="grow">
            <Label htmlFor="harvestFrom">Harvest From:</Label>
            <Select
              name="harvestFrom"
              value={seed.harvestFrom}
              onValueChange={(value) =>
                handleSelectChange({ name: "harvestFrom", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grow">
            <Label htmlFor="harvestTill">Harvest Till:</Label>
            <Select
              name="harvestTill"
              value={seed.harvestTill}
              onValueChange={(value) =>
                handleSelectChange({ name: "harvestTill", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="daysToMaturity">Days to Maturity:</Label>
          <Input
            type="number"
            name="daysToMaturity"
            value={seed.daysToMaturity || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="plantDistance">Plant distance (cm):</Label>
          <Input
            type="number"
            name="plantDistance"
            value={seed.plantDistance || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="plantHeight">Plant Height:</Label>
          <Select
            name="plantHeight"
            value={seed.plantHeight}
            onValueChange={(value) =>
              handleSelectChange({ name: "plantHeight", value: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Height (roughly)" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={PlantHeight.Short}>Short</SelectItem>
                <SelectItem value={PlantHeight.Medium}>Medium</SelectItem>
                <SelectItem value={PlantHeight.Tall}>Tall</SelectItem>
                <SelectItem value={PlantHeight.Huge}>Huge</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="quantity">Quantity:</Label>
          <Input
            type="number"
            name="quantity"
            value={seed.quantity || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="expirationDate">Expatriation date:</Label>
          <Input
            type="date"
            name="experationDate"
            value={seed.expirationDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="url">URL:</Label>
          <Input
            type="url"
            name="url"
            value={seed.url}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes:</Label>
          <Textarea
            name="notes"
            value={seed.notes}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="tag">Tags:</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              name="tag"
              value={newTag}
              onChange={handleTagChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTagAdd();
                }
              }}
            />
            <Button variant="secondary" type="button" onClick={handleTagAdd}>
              + Add Tag
            </Button>
          </div>
          <ul className="mt-2 flex gap-1 ">
            {(seed.tags || []).map((tag) => (
              <li key={tag} className="border p-1">
                {tag}
              </li>
            ))}
          </ul>
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
