import type { ShiftKitchen } from "@/types/shift";
import dummyEmployee from "../common/employee/dummyEmployee";
import dummyBranchList from "../common/branch/dummyBranchList";
import { dummyMenuSale } from "../menu/dummyMenuSale";

export const dummyShiftKitchen: ShiftKitchen[] = [
  {
    id: "sft-kch-1",
    employee: dummyEmployee[0],
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    initial_menu: dummyMenuSale,
    final_menu: dummyMenuSale.map((item) => ({ ...item, quantity: 0 })),
    notes: "test",
    meta: {
      updated_at: new Date('2025-07-03T16:00:00.000Z'),
    },
  },
  {
    id: "sft-kch-2",
    employee: dummyEmployee[1],
    branch: dummyBranchList[1],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    initial_menu: dummyMenuSale,
    final_menu: dummyMenuSale,
    notes: null,
    meta: {
      updated_at: new Date('2025-07-04T00:00:00.000Z'),
    },
  },
  {
    id: "sft-kch-3",
    employee: dummyEmployee[2],
    branch: dummyBranchList[2],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    notes: null,
    initial_menu: dummyMenuSale,
    final_menu: dummyMenuSale,
    meta: {
      updated_at: new Date('2025-07-03T16:00:00.000Z'),
    },
  },
  {
    id: "sft-kch-4",
    employee: dummyEmployee[3],
    branch: dummyBranchList[3],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    notes: null,
    initial_menu: dummyMenuSale,
    final_menu: dummyMenuSale,
    meta: {
      updated_at: new Date('2025-07-04T00:00:00.000Z'),
    },
  }
]