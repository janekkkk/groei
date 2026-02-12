import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useBedStore } from "@/features/Beds/beds.store";
import { useBedsQuery } from "@/features/Beds/useBedQuery";
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

export const BedOverview = () => {
  const { beds } = useBedStore((state) => state);
  const { t } = useTranslation();

  // This will fetch beds from the server and merge with local store
  const { isLoading, isError } = useBedsQuery();

  return (
    <div>
      <div className="mb-2 flex w-full justify-end">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore*/}
        <Link to={"/beds/-1"}>
          <Button type="button">
            {t("core.add")} {t("beds.title")}
          </Button>
        </Link>
      </div>

      {isError && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 text-sm">
          {t("beds.errorLoading")}
        </div>
      )}

      <Table>
        <TableCaption>{t("beds.title")}</TableCaption>
        <TableHeader>
          <TableRow disableHover>
            <TableHead className="w-28">{t("beds.name")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Show loading skeletons while fetching
            Array(3)
              .fill(0)
              .map((_, _index) => (
                <TableRow key={crypto.randomUUID()}>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
          ) : beds.length > 0 ? (
            // Show actual beds
            beds.map((bed) => (
              <TableRow key={bed.id}>
                <TableCell>
                  <Link to={bed.id?.toString()}>{bed.name}</Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // Show empty state
            <TableRow>
              <TableCell
                colSpan={1}
                className="py-6 text-center text-muted-foreground"
              >
                {t("beds.noBeds")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
