export interface Bed {
  notes: string | readonly string[] | number | undefined;
  id?: string;
  name: string;
  gridWidth: number;
  gridHeight: number;
}
