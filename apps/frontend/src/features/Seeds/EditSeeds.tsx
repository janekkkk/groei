import {
  GerminationType,
  Month,
  PlantHeight,
  type Seed,
} from "@groei/common/src/models/Seed";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { type ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSeedStore } from "@/features/Seeds/seeds.store";
import {
  useCreateSeedMutation,
  useDeleteSeedMutation,
  useSeedQuery,
  useSeedsQuery,
  useUpdateSeedMutation,
} from "@/features/Seeds/useSeedQuery";
import { Route } from "@/routes/seeds/$seedId.tsx";
import { Button } from "@/shadcdn/components/ui/button";
import { Checkbox } from "@/shadcdn/components/ui/checkbox.tsx";
import { Input } from "@/shadcdn/components/ui/input";
import { Label } from "@/shadcdn/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcdn/components/ui/select";
import { Textarea } from "@/shadcdn/components/ui/textarea";
import { useToast } from "@/shadcdn/hooks/use-toast.ts";
import type { SelectChange } from "@/shared/select.model";
import { classNames } from "@/shared/utils";
import { isNumeric } from "@/shared/utils/is-numeric.helper.ts";

const getEmptySeed = (): Seed => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: "",
    variety: "",
    sowFrom: undefined,
    sowTill: undefined,
    germinationType: GerminationType.DARK,
    preSprout: false,
    plantFrom: undefined,
    plantTill: undefined,
    harvestFrom: undefined,
    harvestTill: undefined,
    daysToMaturity: undefined,
    plantHeight: undefined,
    numberOfSeedsPerGridCell: 1,
    notes: "",
    url: "",
    expirationDate: undefined, // new Date().toISOString().substring(0, 10)
    createdAt: now,
    updatedAt: now,
    deletedAt: undefined,
  };
};

export const EditSeeds = () => {
  const seeds = useSeedStore((state) => state.seeds);
  const createSeed = useCreateSeedMutation();
  const updateSeed = useUpdateSeedMutation();
  const deleteSeed = useDeleteSeedMutation();
  const [seed, setSeed] = useState<Seed>();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { seedId } = Route.useParams();
  const isCreate = Number(seedId) === -1;
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();

  // Fetch seed from server if not in create mode
  const { data: fetchedSeed } = useSeedQuery(isCreate ? "" : seedId);

  // Also ensure seeds list is loaded for fallback to store
  useSeedsQuery();

  const handleInputChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    let numberValue: number | undefined;

    if (isNumeric(value)) {
      numberValue = parseInt(value, 10);
      if (Number.isNaN(numberValue)) numberValue = undefined;
    }

    if (seed)
      setSeed({
        ...seed,
        [name]: numberValue ?? value,
        updatedAt: new Date().toISOString(),
      });
  };

  const handleCheckboxChange = (checked: CheckedState) => {
    if (seed) setSeed({ ...seed, preSprout: checked as boolean });
  };

  const handleSelectChange = (e: SelectChange) => {
    if (seed) setSeed({ ...seed, [e.name]: e.value });
  };

  const handleSubmit = () => {
    if (isCreate && seed) {
      toast({
        title: `${t("seeds.seed")} ${t("core.created")}`,
      });
      createSeed.mutate(seed);
      setSeed(getEmptySeed());
      nameInputRef?.current?.focus();
    } else {
      if (seed) {
        toast({
          title: `${t("seeds.seed")} ${t("core.updated")}`,
        });
        updateSeed.mutate(seed);
      }
    }
  };

  const handleDeleteSeed = () => {
    if (seed?.id) {
      deleteSeed.mutate(seed?.id);
      router.history.back();
    }
  };

  // Track which seedId we've initialized data for
  const initializedSeedIdRef = useRef<string | null>(null);
  const hasReceivedFetchedSeedRef = useRef(false);

  // Reset on seedId change
  // biome-ignore lint/correctness/useExhaustiveDependencies: seedId is intentionally the only dependency
  useEffect(() => {
    initializedSeedIdRef.current = null;
    hasReceivedFetchedSeedRef.current = false;
  }, [seedId]);

  // Load seed data once it arrives or from fallback
  useEffect(() => {
    // Skip if we've already loaded this seedId
    if (
      initializedSeedIdRef.current === seedId &&
      initializedSeedIdRef.current !== null
    ) {
      return;
    }

    // Prefer fetched data from server (only use first time)
    if (fetchedSeed && !hasReceivedFetchedSeedRef.current) {
      setSeed(fetchedSeed);
      initializedSeedIdRef.current = seedId;
      hasReceivedFetchedSeedRef.current = true;
      return;
    }

    // For create mode, load empty seed
    if (isCreate && initializedSeedIdRef.current !== seedId) {
      setSeed(getEmptySeed());
      nameInputRef?.current?.focus();
      initializedSeedIdRef.current = seedId;
      return;
    }

    // For existing seeds, try fallback to store if fetch hasn't arrived yet
    if (!isCreate && !fetchedSeed && initializedSeedIdRef.current !== seedId) {
      const existingSeed = seeds.find((s) => s.id === seedId);
      if (existingSeed) {
        setSeed(existingSeed as unknown as Seed);
        initializedSeedIdRef.current = seedId;
      }
      // If not in store and fetch not arrived, keep waiting for fetchedSeed
    }
  }, [seedId, isCreate, fetchedSeed, seeds]);

  return (
    <div>
      {isCreate && (
        <h1 className="mb-4">
          {t("core.add")} {t("seeds.title")}
        </h1>
      )}
      {!isCreate && (
        <h1 className="mb-4">
          {t("core.edit")} {t("seeds.title")}
        </h1>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-2"
      >
        <div>
          <Label htmlFor="name">{t("seeds.name")}</Label>
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
          <Label htmlFor="variety">{t("seeds.variety")}</Label>
          <Input
            type="text"
            name="variety"
            value={seed?.variety}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="numberOfSeedsPerGridCell">
            {t("seeds.numberOfSeedsPerGridCell")}
          </Label>
          <Input
            type="number"
            name="numberOfSeedsPerGridCell"
            value={seed?.numberOfSeedsPerGridCell}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="germinationType">{t("seeds.germinationType")}</Label>
          <Select
            name="germinationType"
            value={seed?.germinationType}
            onValueChange={(value) =>
              handleSelectChange({ name: "germinationType", value: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={`${t("core.select")} ${t("seeds.germinationType")}`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(GerminationType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <label
            htmlFor="preSprout"
            className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("seeds.preSprout")}
          </label>
          <Checkbox
            id="preSprout"
            checked={seed?.preSprout}
            onCheckedChange={handleCheckboxChange}
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="grow">
            <Label htmlFor="sowFrom">{t("seeds.sowFrom")}</Label>
            <Select
              name="sowFrom"
              value={seed?.sowFrom}
              onValueChange={(value) =>
                handleSelectChange({ name: "sowFrom", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={`${t("core.select")} ${t("seeds.month")}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {t(`months.${month.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grow">
            <Label htmlFor="sowTill">{t("seeds.sowTill")}</Label>
            <Select
              name="sowTill"
              value={seed?.sowTill}
              onValueChange={(value) =>
                handleSelectChange({ name: "sowTill", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={`${t("core.select")} ${t("seeds.month")}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {t(`months.${month.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <div className="grow">
            <Label htmlFor="plantFrom">{t("seeds.plantFrom")}</Label>
            <Select
              name="plantFrom"
              value={seed?.plantFrom}
              onValueChange={(value) =>
                handleSelectChange({ name: "plantFrom", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={`${t("core.select")} ${t("seeds.month")}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {t(`months.${month.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grow">
            <Label htmlFor="plantTill">{t("seeds.plantTill")}</Label>
            <Select
              name="plantTill"
              value={seed?.plantTill}
              onValueChange={(value) =>
                handleSelectChange({ name: "plantTill", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={`${t("core.select")} ${t("seeds.month")}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {t(`months.${month.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <div className="grow">
            <Label htmlFor="harvestFrom">{t("seeds.harvestFrom")}</Label>
            <Select
              name="harvestFrom"
              value={seed?.harvestFrom}
              onValueChange={(value) =>
                handleSelectChange({ name: "harvestFrom", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={`${t("core.select")} ${t("seeds.month")}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {t(`months.${month.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grow">
            <Label htmlFor="harvestTill">{t("seeds.harvestTill")}</Label>
            <Select
              name="harvestTill"
              value={seed?.harvestTill}
              onValueChange={(value) =>
                handleSelectChange({ name: "harvestTill", value: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={`${t("core.select")} ${t("seeds.month")}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Month).map((month) => (
                    <SelectItem key={month} value={month}>
                      {t(`months.${month.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="daysToMaturity">
            {t("seeds.numberOfDaysToMaturity")}
          </Label>
          <Input
            type="number"
            name="daysToMaturity"
            value={seed?.daysToMaturity || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="plantHeight">{t("seeds.plantHeight")}</Label>
          <Select
            name="plantHeight"
            value={seed?.plantHeight}
            onValueChange={(value) =>
              handleSelectChange({ name: "plantHeight", value: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={`${t("core.select")} ${t("seeds.height")}`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={PlantHeight.SHORT}>Short</SelectItem>
                <SelectItem value={PlantHeight.MEDIUM}>Medium</SelectItem>
                <SelectItem value={PlantHeight.TALL}>Tall</SelectItem>
                <SelectItem value={PlantHeight.CLIMBER}>Climber</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="notes">{t("seeds.notes")}</Label>
          <Textarea
            name="notes"
            value={seed?.notes}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            onClick={handleDeleteSeed}
            className={classNames(isCreate && "hidden")}
            variant="destructive"
          >
            {t("core.delete")}
          </Button>
          {useCanGoBack() && (
            <Button
              type="button"
              onClick={() => router.history.back()}
              variant="secondary"
            >
              {t("core.cancel")}
            </Button>
          )}
          <Button type="submit">
            {isCreate ? t("core.create") : t("core.update")}
          </Button>
        </div>
      </form>
    </div>
  );
};
