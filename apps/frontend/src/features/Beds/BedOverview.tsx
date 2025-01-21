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

export const BedOverview = () => {
  const { beds } = useBedStore((state) => state);

  return (
    <div>
      <div className="w-full flex justify-end mb-2">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore*/}
        <Link to={"/beds/add"}>
          <Button type="button">Add new bed</Button>
        </Link>
      </div>
      <Table>
        <TableCaption>Beds</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {beds.map((bed) => (
            <TableRow key={bed.name}>
              <TableCell>
                <Link to={bed.id}>{bed.name}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
