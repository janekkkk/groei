import { useSeedStore } from "@/features/Seeds/seeds.store";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcdn/components/ui/table";
import { Link } from "@tanstack/react-router";
import { Button } from "@/shadcdn/components/ui/button";
import { Seed } from "@groei/common/src/models/Seed";
import { useTranslation } from "react-i18next";

export const SeedOverview = () => {
  const { seeds } = useSeedStore((state) => state);
  const { t } = useTranslation();

  return (
    <div>
      <div className="w-full flex justify-end mb-2">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore*/}
        <Link to={"/seeds/-1"}>
          <Button type="button">
            {t("core.add")} {t("seeds.title")}
          </Button>
        </Link>
      </div>
      <Table>
        <TableCaption>{t("seeds.title")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t("seeds.name")}</TableHead>
            <TableHead>{t("seeds.variety")}</TableHead>
            <TableHead className="text-right">
              {t("seeds.numberOfSeedsPerGridCell")}
            </TableHead>
            <TableHead className="text-right">
              {t("seeds.numberOfDaysToMaturity")}
            </TableHead>
            <TableHead>{t("seeds.expirationDate")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seeds.map((seed: Seed) => (
            <TableRow key={seed.name}>
              <TableCell>
                <Link to={seed.id.toString()}>{seed.name}</Link>
              </TableCell>
              <TableCell>{seed.variety}</TableCell>
              <TableCell className="text-right">
                {seed.numberOfSeedsPerGridCell}
              </TableCell>
              <TableCell className="text-right">
                {seed.daysToMaturity}
              </TableCell>
              <TableCell>{seed.expirationDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
