import type { Seed } from "@groei/common/src/models/Seed.ts";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSeedStore } from "@/features/Seeds/seeds.store.ts";
import { Button } from "@/shadcdn/components/ui/button.tsx";
import { Label } from "@/shadcdn/components/ui/label.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcdn/components/ui/popover.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcdn/components/ui/select.tsx";
import type { SelectChange } from "@/shared/select.model.ts";

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
        setIsSeedSelectPopoverOpen(isOpen);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="relative cursor-pointer rounded-xl border bg-amber-900 p-2 text-white hover:bg-amber-800 hover:text-white"
        >
          <span className="absolute right-2 bottom-1 text-xs">
            <span className="sr-only">{t("beds.cell")}</span>
            {index + 1}
          </span>
          <div className="flex items-center justify-center">
            {!seed?.id && <Plus />}

            {seed?.id && (
              <div className="flex w-full flex-col items-center">
                <span className=" truncate text-sm text-white">
                  {seed?.name}
                </span>
                <span className=" w-9/12 truncate text-white text-xs">
                  {seed?.variety}
                </span>
              </div>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{t("seeds.seed")}</h4>
            <p className="text-muted-foreground text-sm">
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
                      .sort((a: Seed, b: Seed) => {
                        console.log({ seeds });
                        return a.name
                          .toLowerCase()
                          .localeCompare(b.name.toLowerCase());
                      })
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
