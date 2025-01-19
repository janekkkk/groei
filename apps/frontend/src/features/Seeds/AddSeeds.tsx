/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {
  ChangeEvent,
  ChangeEventHandler,
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
import { Month, PlantHeight, Seed } from "@/features/Seeds/seeds.model";
import { Textarea } from "@/shadcdn/components/ui/textarea";
import { useSeedStore } from "@/features/Seeds/seeds.store";
import { HTMLInputElement } from "happy-dom";

const emptySeed = {
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
  notes: "",
  tags: [],
  photo: null,
  url: "",
  expirationDate: undefined, // new Date().toISOString().substring(0, 10)
};

export const AddSeeds = () => {
  const { addSeed } = useSeedStore((state) => state);
  const [seed, setSeed] = useState<Seed>(emptySeed);
  const [newTag, setNewTag] = useState("");
  const nameInputRef = useRef<HTMLInputElement>();

  type SelectChange = { name: string; value: string };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChange,
  ) => {
    if ((e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target) {
      // input
      const { name, value } = (
        e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ).target;
      setSeed({ ...seed, [name]: value });
    } else {
      // select
      setSeed({
        ...seed,
        [(e as SelectChange).name]: (e as SelectChange).value,
      });
    }
  };

  const handleTagAdd = () => {
    setSeed({ ...seed, tags: [...(seed.tags || []), newTag] });
    setNewTag("");
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSeed({ ...seed, photo: e.target.files[0] as unknown as File });
    }
  };
  const handleSubmit = () => {
    addSeed(seed);
    setSeed(emptySeed);
    nameInputRef?.current?.focus();
  };

  // @ts-ignore
  return (
    <div>
      <h1 className="mb-4">Add Seeds</h1>

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
            // @ts-ignore
            onChange={handleChange}
            required
            // @ts-ignore
            ref={nameInputRef}
          />
        </div>
        <div>
          <Label htmlFor="variety">Variety:</Label>
          <Input
            type="text"
            name="variety"
            value={seed.variety}
            // @ts-ignore
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="grow">
            <Label htmlFor="sowFrom">Sow From:</Label>
            <Select
              name="sowFrom"
              value={seed.sowFrom}
              onValueChange={(value) =>
                handleChange({ name: "sowFrom", value: value })
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
                handleChange({ name: "sowTill", value: value })
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
                handleChange({ name: "plantFrom", value: value })
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
                handleChange({ name: "plantTill", value: value })
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
                handleChange({ name: "harvestFrom", value: value })
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
                handleChange({ name: "harvestTill", value: value })
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
            // @ts-ignore
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="plantDistance">Plant distance (cm):</Label>
          <Input
            type="number"
            name="plantDistance"
            value={seed.plantDistance || ""}
            // @ts-ignore
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="plantHeight">Plant Height:</Label>
          <Select
            name="plantHeight"
            value={seed.plantHeight}
            onValueChange={(value) =>
              handleChange({ name: "plantHeight", value: value })
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
            // @ts-ignore
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="expirationDate">Expatriation date:</Label>
          <Input
            type="date"
            name="experationDate"
            value={seed.expirationDate}
            // @ts-ignore
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="url">URL:</Label>
          <Input
            type="url"
            name="url"
            value={seed.url}
            // @ts-ignore
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes:</Label>
          <Textarea name="notes" value={seed.notes} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="tag">Tags:</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              name="tag"
              value={newTag}
              // @ts-ignore
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
        <div>
          <Label>Photo:</Label>
          <Input
            type="file"
            // @ts-ignore
            onChange={handleFileChange as ChangeEventHandler<HTMLInputElement>}
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
