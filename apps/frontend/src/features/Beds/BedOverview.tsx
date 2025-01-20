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

export const BedOverview = () => {
  const { beds } = useBedStore((state) => state);

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
            <TableCell>{bed.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
