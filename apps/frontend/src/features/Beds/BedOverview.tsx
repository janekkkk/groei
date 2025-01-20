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

export const BedOverview = () => {
  const { beds } = useBedStore((state) => state);
  console.log({ beds });
  return (
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
  );
};
