import { useBedStore } from "@/features/Beds/beds.store";
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
import { useTranslation } from "react-i18next";
import { useBedsQuery } from "@/features/Beds/useBedQuery";
import { Skeleton } from "@/shadcdn/components/ui/skeleton";

export const BedOverview = () => {
  const { beds } = useBedStore((state) => state);
  const { t } = useTranslation();

  // This will fetch beds from the server and merge with local store
  const { isLoading, isError } = useBedsQuery();

  return (
    <div>
      <div className="w-full flex justify-end mb-2">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore*/}
        <Link to={"/beds/-1"}>
          <Button type="button">
            {t("core.add")} {t("beds.title")}
          </Button>
        </Link>
      </div>

      {isError && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {t("beds.errorLoading")}
        </div>
      )}

      <Table>
        <TableCaption>{t("beds.title")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t("beds.name")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Show loading skeletons while fetching
            Array(3)
              .fill(0)
              .map((_, index) => (
                <TableRow key={`loading-${index}`}>
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
                className="text-center py-6 text-muted-foreground"
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
