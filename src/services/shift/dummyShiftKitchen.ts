import type { ShiftKitchen } from "@/types/shift";
import dummyUser from "../common/user/dummyUser";
import dummyBranchList from "../common/branch/dummyBranchList";
import { dummyMenuSale } from "../menu/dummyMenuSale";

export const dummyShiftKitchen: ShiftKitchen[] = [
  {
    id: "sft-kch-1",
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    quantity_menu: dummyMenuSale.map(item => ({
      id: item.id,
      name: item.name,
      initial: 100,
      final: item.threshold
    })),
    total_restock_request: 0,  // Contoh restock request
    request_approved: 0,
    request_rejected: 0,
    total_order: 100,  // Total order
    completed_order: 90,
    canceled_order: 10,  // Canceled order
    notes: "test",
    meta: {
      created_at: new Date('2025-07-03T16:00:00.000Z'),
      created_by: {
        id: 'emp-004',
        name: 'Budi', 
        role: 'Dapur', 
      },
      updated_at: new Date('2025-07-03T16:00:00.000Z'),
      last_updated_by: {
        id: 'emp-004',
        name: 'Budi', 
        role: 'Dapur', 
      },
    },
  },
  {
    id: "sft-kch-2",
    branch: dummyBranchList[1],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    quantity_menu: dummyMenuSale.map(item => ({
      id: item.id,
      name: item.name,
      initial: 100,
      final: item.threshold
    })),
    total_restock_request: 3,  // Contoh restock request
    request_approved: 3,
    request_rejected: 0,
    total_order: 150,  // Total order
    completed_order: 135,
    canceled_order: 15,  // Canceled order
    notes: null,
    meta: {
      created_at: new Date('2025-07-03T16:00:00.000Z'),
      created_by: {
        id: 'emp-008',
        name: 'Fajar', 
        role: 'Dapur', 
      },
      updated_at: new Date('2025-07-04T00:00:00.000Z'),
      last_updated_by: {
        id: 'emp-008',
        name: 'Fajar', 
        role: 'Dapur', 
      },
    },
  },
  {
    id: "sft-kch-3",
    branch: dummyBranchList[2],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    quantity_menu: dummyMenuSale.map(item => ({
      id: item.id,
      name: item.name,
      initial: 100,
      final: item.threshold
    })),
    total_restock_request: 2,  // Contoh restock request
    request_approved: 1,
    request_rejected: 1,
    total_order: 120,  // Total order
    completed_order: 115,
    canceled_order: 5,  // Canceled order
    notes: null,
    meta: {
      created_at: new Date('2025-07-03T16:00:00.000Z'),
      created_by: {
        id: 'emp-013',
        name: 'Rizky', 
        role: 'Dapur', 
      },
      updated_at: new Date('2025-07-03T16:00:00.000Z'),
      last_updated_by: {
        id: 'emp-013',
        name: 'Rizky', 
        role: 'Dapur', 
      },
    },
  },
  {
    id: "sft-kch-4",
    branch: dummyBranchList[3],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    quantity_menu: dummyMenuSale.map(item => ({
      id: item.id,
      name: item.name,
      initial: 100,
      final: item.threshold
    })),
    total_restock_request: 0,  // Contoh restock request
    request_approved: 0,
    request_rejected: 0,
    total_order: 80,  // Total order
    completed_order: 72,
    canceled_order: 8,  // Canceled order
    notes: null,
    meta: {
      created_at: new Date('2025-07-03T16:00:00.000Z'),
      created_by: {
        id: 'emp-018',
        name: 'Gilang', 
        role: 'Dapur', 
      },
      updated_at: new Date('2025-07-04T00:00:00.000Z'),
      last_updated_by: {
        id: 'emp-018',
        name: 'Gilang', 
        role: 'Dapur', 
      },
    },
  }
]