import type { StockMovement } from "@/types/inventory";
import { dummyInventoryItems } from "./dummyInventoryItems";
import dummyBranchList from "../common/branch/dummyBranchList";

export const dummyStockMovements: StockMovement[] = [
  {
    id: "sm-001",
    shift_warehouse: 'sft-wh-1',
    description: "Pengeluaran dari permintaan STR-001 oleh Budi",
    status: "Keluar",
    time: new Date("2025-06-01T10:00:00"),
    item: dummyInventoryItems[0], // Beras Cianjur
    branch: dummyBranchList[0],
    meta: {
      created_at: new Date("2025-06-01T10:00:00"), 
      created_by: {
        id: 'emp-001',
        name: 'Hermanu'
      },
      updated_at: new Date("2025-06-01T10:00:00"),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu'
      }
    },
  },
  {
    id: "sm-002",
    shift_warehouse: 'sft-wh-1',
    description: "Barang masuk dari supplier Santan Segar",
    status: "Masuk",
    time: new Date("2025-06-02T09:30:00"),
    item: dummyInventoryItems[1], // Santan Kelapa
    branch: null,
    meta: {
      created_at: new Date("2025-06-02T09:30:00"), 
      created_by: {
        id: 'emp-001',
        name: 'Hermanu'
      },
      updated_at: new Date("2025-06-02T09:30:00"),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu'
      }
    },
  },
  {
    id: "sm-003",
    shift_warehouse: 'sft-wh-1',
    description: "Penyesuaian stok karena item rusak",
    status: "Pengurangan",
    time: new Date("2025-06-03T15:00:00"),
    item: dummyInventoryItems[2], // Daun Salam
    branch: null,
    meta: {
      created_at: new Date("2025-06-03T15:00:00"), 
      created_by: {
        id: 'emp-001',
        name: 'Hermanu'
      },
      updated_at: new Date("2025-06-03T15:00:00"),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu'
      }
    },
  },
  {
    id: "sm-004",
    shift_warehouse: 'sft-wh-1',
    description: "Pengeluaran untuk kebutuhan dapur harian",
    status: "Keluar",
    time: new Date("2025-06-04T08:45:00"),
    item: dummyInventoryItems[5], // Ayam Potong
    branch: dummyBranchList[0],
    meta: {
      created_at: new Date("2025-06-04T08:45:00"), 
      created_by: {
        id: 'emp-001',
        name: 'Hermanu'
      },
      updated_at: new Date("2025-06-04T08:45:00"),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu'
      }
    },
  },
  {
    id: "sm-005",
    shift_warehouse: 'sft-wh-1',
    description: "Stok masuk hasil pembelian telur ayam",
    status: "Masuk",
    time: new Date("2025-06-04T14:20:00"),
    item: dummyInventoryItems[6], // Telur Ayam
    branch: null,
    meta: {
      created_at: new Date("2025-06-04T14:20:00"), 
      created_by: {
        id: 'emp-001',
        name: 'Hermanu'
      },
      updated_at: new Date("2025-06-04T14:20:00"),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu'
      }
    },
  },
  {
    id: "sm-006",
    shift_warehouse: 'sft-wh-1',
    description: "Penyesuaian karena salah pencatatan stok tempe",
    status: "Pengurangan",
    time: new Date("2025-06-05T10:15:00"),
    item: dummyInventoryItems[7], // Tempe
    branch: null,
    meta: {
      created_at: new Date("2025-06-05T10:15:00"), 
      created_by: {
        id: 'emp-001',
        name: 'Hermanu'
      },
      updated_at: new Date("2025-06-05T10:15:00"),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu'
      }
    },
  },
  {
    id: "sm-007",
    shift_warehouse: 'sft-wh-1',
    description: "Pengeluaran karena pesanan besar untuk katering",
    status: "Keluar",
    time: new Date("2025-06-06T12:30:00"),
    item: dummyInventoryItems[9], // Ikan Asin
    branch: dummyBranchList[1],
    meta: {
      created_at: new Date("2025-06-06T12:30:00"), 
      created_by: {
        id: 'emp-001',
        name: 'Hermanu'
      },
      updated_at: new Date("2025-06-06T12:30:00"),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu'
      }
    },
  },
  {
    id: "sm-008",
    shift_warehouse: 'sft-wh-1',
    description: "Stok kerupuk diterima dari Restoran 1",
    status: "Masuk",
    time: new Date("2025-06-06T16:00:00"),
    item: dummyInventoryItems[13], // Kerupuk
    branch: dummyBranchList[0],
    meta: {
      created_at: new Date("2025-06-06T16:00:00"), 
      created_by: {
        id: 'emp-001',
        name: 'Hermanu'
      },
      updated_at: new Date("2025-06-06T16:00:00"),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu'
      }
    },
  },
  {
    id: "sm-009",
    shift_warehouse: 'sft-wh-1',
    description: "Penyesuaian karena kadaluarsa acar",
    status: "Pengurangan",
    time: new Date("2025-06-07T09:00:00"),
    item: dummyInventoryItems[14], // Acar
    branch: null,
    meta: {
      created_at: new Date("2025-06-07T09:00:00"), 
      created_by: {
        id: 'emp-001',
        name: 'Hermanu'
      },
      updated_at: new Date("2025-06-07T09:00:00"),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu'
      }
    },
  },
  {
    id: "sm-010",
    shift_warehouse: 'sft-wh-1',
    description: "Stok bawang merah goreng dikembalikan ke supplier",
    status: "Keluar",
    time: new Date("2025-06-08T11:45:00"),
    item: dummyInventoryItems[10], // Bawang Merah Goreng
    branch: dummyBranchList[3],
    meta: {
      created_at: new Date("2025-06-08T11:45:00"), 
      created_by: {
        id: 'emp-001',
        name: 'Hermanu'
      },
      updated_at: new Date("2025-06-08T11:45:00"),
      last_updated_by: {
        id: 'emp-001',
        name: 'Hermanu'
      }
    },
  },
];