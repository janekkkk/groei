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
import { Month, PlantHeight, Seed } from "@groei/common/src/models/Seed";
import {
  useCreateSeedMutation,
  useDeleteSeedMutation,
  useUpdateSeedMutation,
} from "@/features/Seeds/useSeedQuery";
import { classNames } from "@/shared/utils";
import { useRouter, useCanGoBack } from "@tanstack/react-router";

const emptySeed: Seed = {
  id: crypto.randomUUID(),
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
  const seeds = useSeedStore((state) => state.seeds);
  const createSeed = useCreateSeedMutation();
  const updateSeed = useUpdateSeedMutation();
  const deleteSeed = useDeleteSeedMutation();
  const [seed, setSeed] = useState<Seed>();
  const [newTag, setNewTag] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { seedId } = Route.useParams();
  const isCreate = Number(seedId) === -1;
  const router = useRouter();

  const handleInputChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    if (seed) setSeed({ ...seed, [name]: value });
  };

  const handleSelectChange = (e: SelectChange) => {
    if (seed) setSeed({ ...seed, [e.name]: e.value });
  };

  const handleTagAdd = () => {
    if (seed)
      setSeed({
        ...seed,
        tags: [...(seed?.tags || []), newTag],
      });
    setNewTag("");
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleSubmit = () => {
    if (isCreate && seed) {
      createSeed.mutate(seed);
      setSeed(emptySeed);
      nameInputRef?.current?.focus();
    } else {
      console.log("update", { seed });
      if (seed) updateSeed.mutate(seed);
    }
  };

  const initExistingSeed = useCallback(() => {
    const existingSeed = seeds.find((s) => s.id === seedId);
    if (seedId && !isCreate && existingSeed) {
      console.log("found seed!", { existingSeed });
      setSeed(existingSeed as unknown as Seed);
    } else {
      console.log("no seed found, creating new one");
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
            value={seed?.name}
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
            value={seed?.variety}
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
            value={seed?.numberOfSeedsPerGridCell}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="grow">
            <Label htmlFor="sowFrom">Sow From:</Label>
            <Select
              name="sowFrom"
              value={seed?.sowFrom}
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
              value={seed?.sowTill}
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
              value={seed?.plantFrom}
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
              value={seed?.plantTill}
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
              value={seed?.harvestFrom}
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
              value={seed?.harvestTill}
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
            value={seed?.daysToMaturity || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="plantDistance">Plant distance (cm):</Label>
          <Input
            type="number"
            name="plantDistance"
            value={seed?.plantDistance || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="plantHeight">Plant Height:</Label>
          <Select
            name="plantHeight"
            value={seed?.plantHeight}
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
            value={seed?.quantity || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="expirationDate">Expiration date:</Label>
          <Input
            type="date"
            name="experationDate"
            value={seed?.expirationDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="url">URL:</Label>
          <Input
            type="url"
            name="url"
            value={seed?.url}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes:</Label>
          <Textarea
            name="notes"
            value={seed?.notes}
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
            {(seed?.tags || []).map((tag) => (
              <li key={tag} className="border p-1">
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            onClick={() => {
              if (seed && seed.id) {
                deleteSeed.mutate(seed?.id);
                router.history.back();
              }
            }}
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
