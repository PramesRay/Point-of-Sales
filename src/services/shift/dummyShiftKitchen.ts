import type { ShiftKitchen } from "@/types/shift";
import dummyEmployee from "../common/employee/dummyEmployee";
import dummyBranchList from "../common/branch/dummyBranchList";
import { dummyMenuSale } from "../menu/dummyMenuSale";

export const dummyShiftKitchen: ShiftKitchen[] = [
  {
    id: "sft-kch-1",
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    menu: dummyMenuSale.map(item => ({
      id: item.id,
      name: item.name,
      quantity: 100
    })),
    restock_request: 0,  // Contoh restock request
    total_order: 100,  // Total order
    canceled_order: 10,  // Canceled order
    notes: "test",
    meta: {
      created_at: new Date('2025-07-03T16:00:00.000Z'),
      created_by: {
        id: dummyEmployee[0].id,
        name: dummyEmployee[0].name
      },
      updated_at: new Date('2025-07-03T16:00:00.000Z'),
      last_updated_by: {
        id: dummyEmployee[0].id,
        name: dummyEmployee[0].name
      },
    },
  },
  {
    id: "sft-kch-2",
    branch: dummyBranchList[1],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    menu: dummyMenuSale.map(item => ({
      id: item.id,
      name: item.name,
      quantity: 0
    })),
    restock_request: 3,  // Contoh restock request
    total_order: 150,  // Total order
    canceled_order: 15,  // Canceled order
    notes: null,
    meta: {
      created_at: new Date('2025-07-03T16:00:00.000Z'),
      created_by: {
        id: dummyEmployee[1].id,
        name: dummyEmployee[0].name
      },
      updated_at: new Date('2025-07-04T00:00:00.000Z'),
      last_updated_by: {
        id: dummyEmployee[1].id,
        name: dummyEmployee[0].name
      },
    },
  },
  {
    id: "sft-kch-3",
    branch: dummyBranchList[2],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    menu: dummyMenuSale.map(item => ({
      id: item.id,
      name: item.name,
      quantity: 100
    })),
    restock_request: 2,  // Contoh restock request
    total_order: 120,  // Total order
    canceled_order: 5,  // Canceled order
    notes: null,
    meta: {
      created_at: new Date('2025-07-03T16:00:00.000Z'),
      created_by: {
        id: dummyEmployee[2].id,
        name: dummyEmployee[0].name
      },
      updated_at: new Date('2025-07-03T16:00:00.000Z'),
      last_updated_by: {
        id: dummyEmployee[2].id,
        name: dummyEmployee[0].name
      },
    },
  },
  {
    id: "sft-kch-4",
    branch: dummyBranchList[3],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    menu: dummyMenuSale.map(item => ({
      id: item.id,
      name: item.name,
      quantity: 0
    })),
    restock_request: 0,  // Contoh restock request
    total_order: 80,  // Total order
    canceled_order: 8,  // Canceled order
    notes: null,
    meta: {
      created_at: new Date('2025-07-03T16:00:00.000Z'),
      created_by: {
        id: dummyEmployee[3].id,
        name: dummyEmployee[0].name
      },
      updated_at: new Date('2025-07-04T00:00:00.000Z'),
      last_updated_by: {
        id: dummyEmployee[3].id,
        name: dummyEmployee[0].name
      },
    },
  }
]