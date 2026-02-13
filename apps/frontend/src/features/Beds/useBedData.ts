import type { Bed } from "@groei/common/src/models/Bed";
import { useEffect, useRef, useState } from "react";
import { useBedQuery, useBedsQuery } from "@/features/Beds/useBedQuery";
import { useBedStore } from "./beds.store";

const getEmptyBed = (): Bed => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: "",
    notes: "",
    gridWidth: 7,
    gridHeight: 2,
    grid: [],
    sowDate: new Date().toISOString().substring(0, 10),
    createdAt: now,
    updatedAt: now,
  };
};

interface UseBedDataOptions {
  bedId: string;
  isCreate: boolean;
  onDataLoaded?: () => void;
}

export const useBedData = ({
  bedId,
  isCreate,
  onDataLoaded,
}: UseBedDataOptions) => {
  const { beds } = useBedStore((state) => state);
  const [bed, setBed] = useState<Bed>(getEmptyBed());

  // Fetch bed from server if not in create mode
  const { data: fetchedBed } = useBedQuery(isCreate ? "" : bedId);

  // Also ensure beds list is loaded for fallback to store
  useBedsQuery();

  // Track which bedId we've initialized data for
  const initializedBedIdRef = useRef<string | null>(null);
  const hasReceivedFetchedBedRef = useRef(false);

  // Reset on bedId change
  useEffect(() => {
    initializedBedIdRef.current = null;
    hasReceivedFetchedBedRef.current = false;
  }, [bedId]);

  // Load bed data once it arrives or from fallback
  useEffect(() => {
    // Skip if we've already loaded this bedId
    if (
      initializedBedIdRef.current === bedId &&
      initializedBedIdRef.current !== null
    ) {
      return;
    }

    // Prefer fetched data from server (only use first time)
    if (fetchedBed && !hasReceivedFetchedBedRef.current) {
      setBed(fetchedBed);
      initializedBedIdRef.current = bedId;
      hasReceivedFetchedBedRef.current = true;
      onDataLoaded?.();
      return;
    }

    // For create mode, load empty bed
    if (isCreate && initializedBedIdRef.current !== bedId) {
      setBed(getEmptyBed());
      initializedBedIdRef.current = bedId;
      onDataLoaded?.();
      return;
    }

    // For existing beds, try fallback to store if fetch hasn't arrived yet
    if (!isCreate && !fetchedBed && initializedBedIdRef.current !== bedId) {
      const existingBed = beds.find((b) => b.id === bedId);
      if (existingBed) {
        setBed(existingBed as unknown as Bed);
        initializedBedIdRef.current = bedId;
        onDataLoaded?.();
      }
      // If not in store and fetch not arrived, keep waiting for fetchedBed
    }
  }, [bedId, isCreate, fetchedBed, beds, onDataLoaded]);

  return {
    bed,
    setBed,
  };
};
