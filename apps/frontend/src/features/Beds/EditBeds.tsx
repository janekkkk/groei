import type { Bed } from "@groei/common/src/models/Bed";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import {
  type ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  useBedsQuery,
  useCreateBedMutation,
  useDeleteBedMutation,
  useBedQuery,
  useUpdateBedMutation,
} from "@/features/Beds/useBedQuery";
import { Route } from "@/routes/beds/$bedId.tsx";
import { Button } from "@/shadcdn/components/ui/button";
import { Input } from "@/shadcdn/components/ui/input";
import { Label } from "@/shadcdn/components/ui/label";
import { Textarea } from "@/shadcdn/components/ui/textarea";
import { useToast } from "@/shadcdn/hooks/use-toast.ts";
import { classNames } from "@/shared/utils";
import { isNumeric } from "@/shared/utils/is-numeric.helper";
import { useBedStore } from "./beds.store";
import { BedPlanner } from "./grid/BedPlanner";

const getEmptyBed = (): Bed => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: "",
    notes: "",
    gridWidth: 7,
    gridHeight: 2,
    grid: [],
    sowDate: new Date().toISOString().substring(0, 10),
    createdAt: now,
    updatedAt: now,
  };
};

export const EditBeds = () => {
  const createBed = useCreateBedMutation();
  const updateBed = useUpdateBedMutation();
  const deleteBed = useDeleteBedMutation();
  const { beds } = useBedStore((state) => state);
  const [bed, setBed] = useState<Bed>(getEmptyBed());
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { bedId } = Route.useParams();
  const isCreate = Number(bedId) === -1;
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch bed from server if not in create mode
  const { data: fetchedBed } = useBedQuery(isCreate ? "" : bedId);

  // Also ensure beds list is loaded for fallback to store
  useBedsQuery();

  // Debounced auto-save function
  const debouncedSave = useCallback(
    (bedToSave: Bed) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        setIsSaving(true);

        // Only auto-save if this is an update (not create)
        if (!isCreate && bedToSave.name.trim()) {
          updateBed.mutate(bedToSave, {
            onSuccess: () => {
              setIsSaving(false);
            },
            onError: () => {
              setIsSaving(false);
            },
          });
        } else {
          setIsSaving(false);
        }
      }, 1000); // 1 second debounce
    },
    [isCreate, updateBed],
  );

  // Handle input changes with auto-save
  const handleInputChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    let numberValue: number | undefined;

    if (isNumeric(value)) {
      numberValue = parseInt(value, 10);
      if (Number.isNaN(numberValue)) numberValue = undefined;
    }

    const updatedBed = {
      ...bed,
      [name]: numberValue ?? value,
      updatedAt: new Date().toISOString(),
    };

    setBed(updatedBed);
    debouncedSave(updatedBed);
  };

  // const handleSelectChange = (e: SelectChange) => {
  //   if (e.index !== undefined) {
  //     const grid = bed.grid || [];
  //     grid[e.index] = { index: e.index, seed: e.value as Seed };
  //     const updatedBed = { ...bed, grid, updatedAt: new Date() };
  //     setBed(updatedBed);
  //     debouncedSave(updatedBed);
  //   }
  // };

  const handleBedChange = (updatedBed: Bed) => {
    setBed(updatedBed);
    debouncedSave(updatedBed);
  };

  const handleDeleteBed = () => {
    if (bed?.id) {
      deleteBed.mutate(bed?.id);
      router.history.back();
    }
  };

  // const addRow = () => {
  //   const updatedBed = { ...bed, gridHeight: bed.gridHeight + 1 };
  //   setBed(updatedBed);
  //   debouncedSave(updatedBed);
  // };
  //
  // const removeRow = () => {
  //   const updatedBed = { ...bed, gridHeight: bed.gridHeight - 1 };
  //   setBed(updatedBed);
  //   debouncedSave(updatedBed);
  // };
  //
  // const addColumn = () => {
  //   const updatedBed = { ...bed, gridWidth: bed.gridWidth + 1 };
  //   setBed(updatedBed);
  //   debouncedSave(updatedBed);
  // };
  //
  // const removeColumn = () => {
  //   const updatedBed = { ...bed, gridWidth: bed.gridWidth - 1 };
  //   setBed(updatedBed);
  //   debouncedSave(updatedBed);
  // };

  const handleSubmit = () => {
    if (isCreate) {
      toast({
        title: `${t("beds.bed")} ${t("core.created")}`,
      });
      createBed.mutate(bed);
      setBed(getEmptyBed());
      nameInputRef?.current?.focus();
      router.navigate({ to: "/beds" });
    } else {
      toast({
        title: `${t("beds.bed")} ${t("core.updated")}`,
      });
      updateBed.mutate(bed);
    }
  };

  // Track which bedId we've initialized data for
  const initializedBedIdRef = useRef<string | null>(null);
  const hasReceivedFetchedBedRef = useRef(false);

  // Reset on bedId change
  useEffect(() => {
    initializedBedIdRef.current = null;
    hasReceivedFetchedBedRef.current = false;
  }, [bedId]);

  // Load bed data once it arrives or from fallback
  useEffect(() => {
    // Skip if we've already loaded this bedId
    if (
      initializedBedIdRef.current === bedId &&
      initializedBedIdRef.current !== null
    ) {
      return;
    }

    // Prefer fetched data from server (only use first time)
    if (fetchedBed && !hasReceivedFetchedBedRef.current) {
      setBed(fetchedBed);
      initializedBedIdRef.current = bedId;
      hasReceivedFetchedBedRef.current = true;
      return;
    }

    // For create mode, load empty bed
    if (isCreate && initializedBedIdRef.current !== bedId) {
      setBed(getEmptyBed());
      nameInputRef?.current?.focus();
      initializedBedIdRef.current = bedId;
      return;
    }

    // For existing beds, try fallback to store if fetch hasn't arrived yet
    if (!isCreate && !fetchedBed && initializedBedIdRef.current !== bedId) {
      const existingBed = beds.find((b) => b.id === bedId);
      if (existingBed) {
        setBed(existingBed as unknown as Bed);
        initializedBedIdRef.current = bedId;
      }
      // If not in store and fetch not arrived, keep waiting for fetchedBed
    }
  }, [bedId, isCreate, fetchedBed]);

  return (
    <div>
      {isCreate && (
        <h1 className="mb-4">
          {t("core.add")} {t("beds.title")}
        </h1>
      )}
      {!isCreate && (
        <h1 className="mb-4">
          {t("core.edit")} {t("beds.title")}
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
          <Label htmlFor="name">{t("beds.name")}</Label>
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
          <Label htmlFor="sowDate">{t("beds.sowDate")}</Label>
          <Input
            type="date"
            name="sowDate"
            value={bed.sowDate}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Grid Size Inputs (only visible for create mode) */}
        {isCreate && (
          <>
            <div>
              <Label htmlFor="gridWidth">{t("beds.gridWidth")}</Label>
              <p className="text-muted-foreground text-sm">
                {t("beds.gridHelp")}
              </p>
              <Input
                type="number"
                name="gridWidth"
                value={bed.gridWidth}
                onChange={handleInputChange}
                required
                disabled={!isCreate}
              />
            </div>
            <div>
              <Label htmlFor="gridWidth">{t("beds.gridHeight")}</Label>
              <p className="text-muted-foreground text-sm">
                {t("beds.gridHelp")}
              </p>
              <Input
                type="number"
                name="gridHeight"
                value={bed.gridHeight}
                onChange={handleInputChange}
                required
                disabled={!isCreate}
              />
            </div>
          </>
        )}

        {/* New BedPlanner Component */}
        <div>
          <BedPlanner
            bed={bed}
            onBedChange={handleBedChange}
            isCreate={isCreate}
          />
        </div>

        <div>
          <Label htmlFor="notes">{t("beds.notes")}</Label>
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

      {/* Saving Indicator */}
      {isSaving && (
        <div className="mt-4 flex items-center text-muted-foreground text-sm">
          <RefreshCw className="mr-2 animate-spin" />
          {t("core.saving")}
        </div>
      )}
    </div>
  );
};;;;;;;;;
