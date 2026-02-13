import type { Bed } from "@groei/common/src/models/Bed";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { type ChangeEventHandler, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateBedMutation,
  useDeleteBedMutation,
  useUpdateBedMutation,
} from "@/features/Beds/useBedQuery";
import { Route } from "@/routes/beds/$bedId.tsx";
import { Button } from "@/shadcdn/components/ui/button";
import { Input } from "@/shadcdn/components/ui/input";
import { Label } from "@/shadcdn/components/ui/label";
import { Textarea } from "@/shadcdn/components/ui/textarea";
import { DateInput } from "@/shared/components/DateInput";
import { SavingIndicator } from "@/shared/components/SavingIndicator";
import { classNames } from "@/shared/utils";
import { isNumeric } from "@/shared/utils/is-numeric.helper";
import { BedPlanner } from "./grid/BedPlanner";
import { useAutoSave } from "./useAutoSave";
import { useBedData } from "./useBedData";

export const EditBeds = () => {
  const createBed = useCreateBedMutation();
  const updateBed = useUpdateBedMutation();
  const deleteBed = useDeleteBedMutation();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { bedId } = Route.useParams();
  const isCreate = Number(bedId) === -1;
  const router = useRouter();
  const { t } = useTranslation();

  // Load bed data from server or create new
  const { bed, setBed } = useBedData({
    bedId,
    isCreate,
    onDataLoaded: () => {
      if (isCreate) {
        nameInputRef?.current?.focus();
      }
    },
  });

  // Auto-save functionality for updates
  const { saveStatus, debouncedSave } = useAutoSave<Bed>({
    onSave: async (bedToSave) => {
      await updateBed.mutateAsync(bedToSave);
    },
    shouldAutoSave: (bedToSave) => !isCreate && bedToSave.name.trim() !== "",
  });

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

  const handleDateChange = (value: string) => {
    const updatedBed = {
      ...bed,
      sowDate: value,
      updatedAt: new Date().toISOString(),
    };
    setBed(updatedBed);
    debouncedSave(updatedBed);
  };

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

  const handleCreateBed = () => {
    if (bed.name.trim()) {
      createBed.mutate(bed, {
        onSuccess: () => {
          router.history.back();
        },
      });
    }
  };

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

      <form className="flex flex-col gap-2">
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
        <DateInput
          label={t("beds.sowDate")}
          name="sowDate"
          value={bed.sowDate}
          onValueChange={handleDateChange}
          required
        />

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
          {isCreate && (
            <Button
              type="button"
              onClick={handleCreateBed}
              disabled={!bed.name.trim()}
            >
              {t("core.create")}
            </Button>
          )}
        </div>
      </form>

      <SavingIndicator status={saveStatus} />
    </div>
  );
};
