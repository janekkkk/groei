import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcdn/components/ui/popover.tsx";
import { Button } from "@/shadcdn/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { Label } from "@/shadcdn/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcdn/components/ui/select.tsx";
import { Seed } from "@groei/common/src/models/Seed.ts";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSeedStore } from "@/features/Seeds/seeds.store.ts";
import { SelectChange } from "@/shared/select.model.ts";

interface Props {
  seed: Seed | undefined;
  index: number;
  handleSelectChange: (selectChange: SelectChange) => void;
}

export const GridItem = ({ seed, index, handleSelectChange }: Props) => {
  const { t } = useTranslation();
  const { seeds } = useSeedStore((state) => state);
  const [isSeedSelectPopoverOpen, setIsSeedSelectPopoverOpen] = useState(false);

  return (
    <Popover
      open={isSeedSelectPopoverOpen}
      defaultOpen={isSeedSelectPopoverOpen}
      onOpenChange={(isOpen: boolean) => {
        console.log(isOpen);
        setIsSeedSelectPopoverOpen(isOpen);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="p-2 bg-amber-900 text-white hover:text-white hover:bg-amber-800 border rounded-xl relative cursor-pointer"
        >
          <span className="absolute bottom-1 right-2 text-xs">
            <span className="sr-only">{t("beds.cell")}</span>
            {index + 1}
          </span>
          <div className="flex justify-center items-center">
            {!seed?.id && <Plus />}

            {seed?.id && (
              <span className=" text-white text-sm truncate">{seed?.name}</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{t("seeds.seed")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("beds.plantSeedInCell")}
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex gap-2">
              <Label htmlFor="selectSeed" className="sr-only">
                {t("core.select")} {t("seeds.seed")}
              </Label>
              <Select
                name="selectSeed"
                value={seed as unknown as string}
                defaultOpen
                onValueChange={(value) => {
                  if (value && value !== seed?.id)
                    handleSelectChange({
                      name: "grid",
                      index: index,
                      value: value,
                    });
                  setIsSeedSelectPopoverOpen(false);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={`${t("core.select")} ${t("seeds.seed")}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={null as unknown as string}>
                      None
                    </SelectItem>
                    {seeds
                      .sort((a: Seed, b: Seed) =>
                        a.name
                          .toLowerCase()
                          .localeCompare(b.name.toLowerCase()),
                      )
                      .map((seed) => (
                        <SelectItem
                          key={seed.id}
                          value={seed as unknown as string}
                        >
                          {seed.name}{" "}
                          {seed.variety && <span> - {seed.variety}</span>}
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
};
