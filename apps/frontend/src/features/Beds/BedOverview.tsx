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

export const BedOverview = () => {
  const { beds } = useBedStore((state) => state);
  const { t } = useTranslation();

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
      <Table>
        <TableCaption>{t("beds.title")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t("beds.name")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {beds.map((bed) => (
            <TableRow key={bed.name}>
              <TableCell>
                <Link to={bed.id?.toString()}>{bed.name}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
