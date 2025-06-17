import type { StockMovement } from "@/types/inventory";
import { dummyInventoryItems } from "./dummyInventoryItems";
import dummyBranchList from "../common/branch/dummyBranchList";

export const dummyStockMovements: StockMovement[] = [
  {
    id: "sm-001",
    description: "Pengeluaran dari permintaan STR-001 oleh Budi",
    status: "Keluar",
    time: new Date("2025-06-01T10:00:00"),
    item: dummyInventoryItems[0], // Beras Cianjur
    branch: dummyBranchList[0],
    meta: { created_at: new Date("2025-06-01T10:00:00"), updated_at: null },
  },
  {
    id: "sm-002",
    description: "Barang masuk dari supplier Santan Segar",
    status: "Masuk",
    time: new Date("2025-06-02T09:30:00"),
    item: dummyInventoryItems[1], // Santan Kelapa
    branch: dummyBranchList[0],
    meta: { created_at: new Date("2025-06-02T09:30:00"), updated_at: null },
  },
  {
    id: "sm-003",
    description: "Penyesuaian stok karena item rusak",
    status: "Penyesuaian",
    time: new Date("2025-06-03T15:00:00"),
    item: dummyInventoryItems[2], // Daun Salam
    branch: dummyBranchList[0],
    meta: { created_at: new Date("2025-06-03T15:00:00"), updated_at: null },
  },
  {
    id: "sm-004",
    description: "Pengeluaran untuk kebutuhan dapur harian",
    status: "Keluar",
    time: new Date("2025-06-04T08:45:00"),
    item: dummyInventoryItems[5], // Ayam Potong
    branch: dummyBranchList[0],
    meta: { created_at: new Date("2025-06-04T08:45:00"), updated_at: null },
  },
  {
    id: "sm-005",
    description: "Stok masuk hasil pembelian telur ayam",
    status: "Masuk",
    time: new Date("2025-06-04T14:20:00"),
    item: dummyInventoryItems[6], // Telur Ayam
    branch: dummyBranchList[1],
    meta: { created_at: new Date("2025-06-04T14:20:00"), updated_at: null },
  },
  {
    id: "sm-006",
    description: "Penyesuaian karena salah pencatatan stok tempe",
    status: "Penyesuaian",
    time: new Date("2025-06-05T10:15:00"),
    item: dummyInventoryItems[7], // Tempe
    branch: dummyBranchList[1],
    meta: { created_at: new Date("2025-06-05T10:15:00"), updated_at: null },
  },
  {
    id: "sm-007",
    description: "Pengeluaran karena pesanan besar untuk katering",
    status: "Keluar",
    time: new Date("2025-06-06T12:30:00"),
    item: dummyInventoryItems[9], // Ikan Asin
    branch: dummyBranchList[1],
    meta: { created_at: new Date("2025-06-06T12:30:00"), updated_at: null },
  },
  {
    id: "sm-008",
    description: "Stok kerupuk diterima dari pemasok lokal",
    status: "Masuk",
    time: new Date("2025-06-06T16:00:00"),
    item: dummyInventoryItems[13], // Kerupuk
    branch: dummyBranchList[3],
    meta: { created_at: new Date("2025-06-06T16:00:00"), updated_at: null },
  },
  {
    id: "sm-009",
    description: "Penyesuaian karena kadaluarsa acar",
    status: "Penyesuaian",
    time: new Date("2025-06-07T09:00:00"),
    item: dummyInventoryItems[14], // Acar
    branch: dummyBranchList[3],
    meta: { created_at: new Date("2025-06-07T09:00:00"), updated_at: null },
  },
  {
    id: "sm-010",
    description: "Stok bawang merah goreng dikembalikan ke supplier",
    status: "Keluar",
    time: new Date("2025-06-08T11:45:00"),
    item: dummyInventoryItems[10], // Bawang Merah Goreng
    branch: dummyBranchList[3],
    meta: { created_at: new Date("2025-06-08T11:45:00"), updated_at: null },
  },
];