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
import { Seed } from "@bladwijzer/common/src/models/Seed";

export const SeedOverview = () => {
  const { seeds } = useSeedStore((state) => state);

  return (
    <div>
      <div className="w-full flex justify-end mb-2">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore*/}
        <Link to={"/seeds/-1"}>
          <Button type="button">Add new seed</Button>
        </Link>
      </div>
      <Table>
        <TableCaption>Seeds</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Variety</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">
              Number of seeds per cell
            </TableHead>
            <TableHead className="text-right">Days to maturity</TableHead>
            <TableHead className="text-right">Plant Distance</TableHead>
            <TableHead>Expiration Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seeds.map((seed: Seed) => (
            <TableRow key={seed.name}>
              <TableCell>
                <Link to={seed.id.toString()}>{seed.name}</Link>
              </TableCell>
              <TableCell>{seed.variety}</TableCell>
              <TableCell className="text-right">{seed.quantity}</TableCell>
              <TableCell className="text-right">
                {seed.numberOfSeedsPerGridCell}
              </TableCell>

              <TableCell className="text-right">
                {seed.daysToMaturity}
              </TableCell>
              <TableCell className="text-right">{seed.plantDistance}</TableCell>
              <TableCell>{seed.expirationDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
