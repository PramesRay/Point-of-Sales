import type { Shift } from "@/types/shift";
import dummyEmployee from "../common/employee/dummyEmployee";
import dummyBranchList from "../common/branch/dummyBranchList";

export const dummyShiftEmployee: Shift[] = [
  // Hermanu (Gudang)
  {
    id: "sft-emp-2",
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T10:00:00.000Z'),
    end: null,  // Shift belum berakhir karena aktif
    notes: 'Gudang shift',
    meta: {
      created_at: new Date('2025-07-01T11:00:00.000Z'),
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
  // Aldi (Kasir)
  {
    id: "sft-emp-3",
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T12:00:00.000Z'),
    end: null,  // Shift belum berakhir karena aktif
    notes: 'Kasir shift',
    meta: {
      created_at: new Date('2025-07-01T12:00:00.000Z'),
      created_by: {
        id: 'emp-002',
        name: 'Aldi', 
        role: 'Kasir', 
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-002',
        name: 'Aldi', 
        role: 'Kasir', 
      },
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
      created_by: {
        id: 'emp-003',
        name: 'Rani', 
        role: 'Dapur', 
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-003',
        name: 'Rani', 
        role: 'Dapur', 
      },
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
      created_by: {
        id: 'emp-004',
        name: 'Budi', 
        role: 'Dapur', 
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-004',
        name: 'Budi', 
        role: 'Dapur', 
      },
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
      created_by: {
        id: 'emp-007',
        name: 'Dian', 
        role: 'Kasir', 
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-007',
        name: 'Dian', 
        role: 'Kasir', 
      },
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
      created_by: {
        id: 'emp-008',
        name: 'Fajar', 
        role: 'Dapur', 
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-008',
        name: 'Fajar', 
        role: 'Dapur', 
      },
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
      created_by: {
        id: 'emp-009',
        name: 'Tono', 
        role: 'Dapur', 
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-009',
        name: 'Tono', 
        role: 'Dapur', 
      },
    },
  },
  // Bambang (Pemilik) - Tidak aktif, shift sudah berakhir
  {
    id: "sft-emp-10",
    branch: dummyBranchList[3],
    start: new Date('2025-07-01T08:00:00.000Z'),
    end: new Date('2025-07-01T16:00:00.000Z'),  // Shift berakhir
    notes: 'Pemilik shift',
    meta: {
      created_at: new Date('2025-06-30T08:00:00.000Z'),
      created_by: {
        id: 'emp-021',
        name: 'Bambang', 
        role: 'Pemilik', 
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-021',
        name: 'Bambang', 
        role: 'Pemilik', 
      },
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
      created_by: {
        id: 'emp-017',
        name: 'Yuni', 
        role: 'Kasir', 
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-017',
        name: 'Yuni', 
        role: 'Kasir', 
      },
    },
  }
]