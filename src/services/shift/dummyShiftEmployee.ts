import type { Shift } from "@/types/shift";
import dummyEmployee from "../common/employee/dummyEmployee";
import dummyBranchList from "../common/branch/dummyBranchList";

export const dummyShiftEmployee: Shift[] = [
  // // Hermanu (Admin)
  // {
  //   id: "sft-emp-1",
  //   branch: dummyBranchList[0],
  //   start: null,
  //   end: null,  // Shift belum berakhir karena aktif
  //   notes: 'Admin shift',
  //   meta: {
  //     created_at: new Date('2025-07-01T10:00:00.000Z'),
  //     created_by: { id: 'emp-001', name: 'Hermanu' },
  //     updated_at: new Date(),
  //     last_updated_by: { id: 'emp-001', name: 'Hermanu' },
  //   },
  // },
  // Hermanu (Gudang)
  {
    id: "sft-emp-2",
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T10:00:00.000Z'),
    end: null,  // Shift belum berakhir karena aktif
    notes: 'Gudang shift',
    meta: {
      created_at: new Date('2025-07-01T11:00:00.000Z'),
      created_by: { id: 'emp-001', name: 'Hermanu' },
      updated_at: new Date(),
      last_updated_by: { id: 'emp-001', name: 'Hermanu' },
    },
  },
  // Aldi (Kasir)
  {
    id: "sft-emp-3",
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T12:00:00.000Z'),
    end: null,  // Shift belum berakhir karena aktif
    notes: 'Kasir shift',
    meta: {
      created_at: new Date('2025-07-01T12:00:00.000Z'),
      created_by: { id: 'emp-002', name: 'Aldi' },
      updated_at: new Date(),
      last_updated_by: { id: 'emp-002', name: 'Aldi' },
    },
  },
  // Rani (Dapur) - Tidak aktif, shift sudah berakhir
  {
    id: "sft-emp-4",
    branch: dummyBranchList[0],
    start: new Date('2025-07-01T08:00:00.000Z'),
    end: new Date('2025-07-01T16:00:00.000Z'),  // Shift berakhir
    notes: 'Dapur shift',
    meta: {
      created_at: new Date('2025-06-30T08:00:00.000Z'),
      created_by: { id: 'emp-003', name: 'Rani' },
      updated_at: new Date(),
      last_updated_by: { id: 'emp-003', name: 'Rani' },
    },
  },
  // Budi (Dapur) - Tidak aktif, shift sudah berakhir
  {
    id: "sft-emp-5",
    branch: dummyBranchList[0],
    start: new Date('2025-07-01T08:00:00.000Z'),
    end: null,
    notes: 'Dapur shift',
    meta: {
      created_at: new Date('2025-06-30T08:00:00.000Z'),
      created_by: { id: 'emp-004', name: 'Budi' },
      updated_at: new Date(),
      last_updated_by: { id: 'emp-004', name: 'Budi' },
    },
  },
  // Siti (Admin) - Tidak aktif
  // Tidak ada shift karena is_active false

  // Dian (Kasir)
  {
    id: "sft-emp-6",
    branch: dummyBranchList[1],
    start: new Date('2025-07-03T14:00:00.000Z'),
    end: null,  // Shift belum berakhir karena aktif
    notes: 'Kasir shift',
    meta: {
      created_at: new Date('2025-07-01T14:00:00.000Z'),
      created_by: { id: 'emp-007', name: 'Dian' },
      updated_at: new Date(),
      last_updated_by: { id: 'emp-007', name: 'Dian' },
    },
  },
  // Fajar (Dapur)
  {
    id: "sft-emp-7",
    branch: dummyBranchList[1],
    start: new Date('2025-07-03T15:00:00.000Z'),
    end: null,  // Shift belum berakhir karena aktif
    notes: 'Dapur shift',
    meta: {
      created_at: new Date('2025-07-01T15:00:00.000Z'),
      created_by: { id: 'emp-008', name: 'Fajar' },
      updated_at: new Date(),
      last_updated_by: { id: 'emp-008', name: 'Fajar' },
    },
  },
  // Tono (Dapur)
  {
    id: "sft-emp-8",
    branch: dummyBranchList[1],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,  // Shift belum berakhir karena aktif
    notes: 'Dapur shift',
    meta: {
      created_at: new Date('2025-07-01T16:00:00.000Z'),
      created_by: { id: 'emp-009', name: 'Tono' },
      updated_at: new Date(),
      last_updated_by: { id: 'emp-009', name: 'Tono' },
    },
  },
  // // Ayu (Admin)
  // {
  //   id: "sft-emp-9",
  //   branch: dummyBranchList[1],
  //   start: new Date('2025-07-03T17:00:00.000Z'),
  //   end: null,  // Shift belum berakhir karena aktif
  //   notes: 'Admin shift',
  //   meta: {
  //     created_at: new Date('2025-07-01T17:00:00.000Z'),
  //     created_by: { id: 'emp-010', name: 'Ayu' },
  //     updated_at: new Date(),
  //     last_updated_by: { id: 'emp-010', name: 'Ayu' },
  //   },
  // },
  // Bambang (Pemilik) - Tidak aktif, shift sudah berakhir
  {
    id: "sft-emp-10",
    branch: dummyBranchList[3],
    start: new Date('2025-07-01T08:00:00.000Z'),
    end: new Date('2025-07-01T16:00:00.000Z'),  // Shift berakhir
    notes: 'Pemilik shift',
    meta: {
      created_at: new Date('2025-06-30T08:00:00.000Z'),
      created_by: { id: 'emp-021', name: 'Bambang' },
      updated_at: new Date(),
      last_updated_by: { id: 'emp-021', name: 'Bambang' },
    },
  },
  // Yuni (Kasir)
  {
    id: "sft-emp-11",
    branch: dummyBranchList[3],
    start: new Date('2025-07-03T18:00:00.000Z'),
    end: null,  // Shift belum berakhir karena aktif
    notes: 'Kasir shift',
    meta: {
      created_at: new Date('2025-07-01T18:00:00.000Z'),
      created_by: { id: 'emp-017', name: 'Yuni' },
      updated_at: new Date(),
      last_updated_by: { id: 'emp-017', name: 'Yuni' },
    },
  }
]