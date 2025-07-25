import type { Seed } from "@groei/common/src/models/Seed";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSeedStore } from "@/features/Seeds/seeds.store";
import { useSeedsQuery } from "@/features/Seeds/useSeedQuery";
import { Button } from "@/shadcdn/components/ui/button";
import { Skeleton } from "@/shadcdn/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcdn/components/ui/table";

export const SeedOverview = () => {
  const { seeds } = useSeedStore((state) => state);
  const { t } = useTranslation();

  // This will fetch seeds from the server and merge with local store
  const { isLoading, isError } = useSeedsQuery();

  return (
    <div>
      <div className="mb-2 flex w-full justify-end">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore*/}
        <Link to={"/seeds/-1"}>
          <Button type="button">
            {t("core.add")} {t("seeds.title")}
          </Button>
        </Link>
      </div>

      {isError && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 text-sm">
          {t("seeds.errorLoading")}
        </div>
      )}

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
          {isLoading ? (
            // Show loading skeletons while fetching
            Array(3)
              .fill(0)
              .map(() => (
                <TableRow key={crypto.randomUUID()}>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                </TableRow>
              ))
          ) : seeds.length > 0 ? (
            // Show actual seeds
            seeds.map((seed: Seed) => (
              <TableRow key={seed.id}>
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
            ))
          ) : (
            // Show empty state
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-6 text-center text-muted-foreground"
              >
                {t("seeds.noSeeds")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
