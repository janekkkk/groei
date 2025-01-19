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

export const SeedOverview = () => {
  const { seeds } = useSeedStore((state) => state);

  return (
    <Table>
      <TableCaption>Seeds</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Variety</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Days to maturity</TableHead>
          <TableHead className="text-right">Plant Distance</TableHead>
          <TableHead>Expiration Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {seeds.map((seed) => (
          <TableRow key={seed.name}>
            <TableCell>{seed.name}</TableCell>
            <TableCell>{seed.variety}</TableCell>
            <TableCell className="text-right">{seed.quantity}</TableCell>
            <TableCell className="text-right">{seed.daysToMaturity}</TableCell>
            <TableCell className="text-right">{seed.plantDistance}</TableCell>
            <TableCell>{seed.expirationDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
