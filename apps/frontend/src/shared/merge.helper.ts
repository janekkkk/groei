export const merge = <T>(
  a: T[],
  b: T[],
  predicate: (a: T, b: T) => boolean = (a, b) => a === b,
): T[] => {
  const c = [...a]; // copy to avoid side effects
  // add all items from B to copy C if they're not already present
  b.forEach((bItem) =>
    c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem),
  );
  return c;
};

export type Item<T extends { id: string; updatedAt: Date }> = T;

export const mergeItems = <T extends { id: string; updatedAt: Date }>(
  items: T[],
): T[] => {
  const mergedMap = new Map<string, T>();

  for (const item of items) {
    const existing = mergedMap.get(item.id);

    if (!existing || item.updatedAt > existing.updatedAt) {
      mergedMap.set(item.id, item);
    }
  }

  return Array.from(mergedMap.values());
};
