import type { ShiftWarehouse } from "@/types/shift";
import dummyUser from "../common/user/dummyUser";

export const dummyShiftWarehouse: ShiftWarehouse[] = [
  {
    id: "sft-wh-1",
    start: new Date('2025-07-03T00:00:00.000Z'),
    end: new Date('2025-07-03T23:59:59.000Z'),
    notes: "Shift warehouse pertama pada hari ini",
    
    total_restock_request: 20,  // Total permintaan restock
    request_approved: 18,  // Permintaan restock yang disetujui
    request_rejected: 2,  // Permintaan restock yang ditolak
    total_stock_movement: 100,  // Total pergerakan stok
    stock_movement_in: 60,  // Stok masuk
    stock_movement_out: 40,  // Stok keluar
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: 'emp-001',
        name: 'Hermanu',
        role: 'Gudang',
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu',
        role: 'Gudang',
      },
    },
  },
  {
    id: "sft-wh-2",
    start: new Date('2025-07-04T00:00:00.000Z'),
    end: new Date('2025-07-04T23:59:59.000Z'),
    notes: "Shift warehouse kedua pada hari ini",
    
    total_restock_request: 35,  // Total permintaan restock
    request_approved: 32,  // Permintaan restock yang disetujui
    request_rejected: 3,  // Permintaan restock yang ditolak
    total_stock_movement: 150,  // Total pergerakan stok
    stock_movement_in: 90,  // Stok masuk
    stock_movement_out: 60,  // Stok keluar
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: 'emp-001',
        name: 'Hermanu',
        role: 'Gudang',
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu',
        role: 'Gudang',
      },
    },
  },
  {
    id: "sft-wh-3",
    start: new Date('2025-07-05T00:00:00.000Z'),
    end: new Date('2025-07-05T23:59:59.000Z'),
    notes: "Shift warehouse ketiga pada hari ini",
    total_restock_request: 35,  // Total permintaan restock
    request_approved: 32,  // Permintaan restock yang disetujui
    request_rejected: 3,  // Permintaan restock yang ditolak
    total_stock_movement: 150,  // Total pergerakan stok
    stock_movement_in: 90,  // Stok masuk
    stock_movement_out: 60,  // Stok keluar
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: 'emp-001',
        name: 'Hermanu',
        role: 'Gudang',
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu',
        role: 'Gudang',
      },
    },
  },
  {
    id: "sft-wh-4",
    start: new Date('2025-07-06T00:00:00.000Z'),
    end: new Date('2025-07-06T23:59:59.000Z'),
    notes: "Shift warehouse keempat pada hari ini",
    
    total_restock_request: 10,  // Total permintaan restock
    request_approved: 8,  // Permintaan restock yang disetujui
    request_rejected: 2,  // Permintaan restock yang ditolak
    total_stock_movement: 60,  // Total pergerakan stok
    stock_movement_in: 40,  // Stok masuk
    stock_movement_out: 20,  // Stok keluar
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: 'emp-001',
        name: 'Hermanu',
        role: 'Gudang',
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu',
        role: 'Gudang',
      },
    },
  }
]