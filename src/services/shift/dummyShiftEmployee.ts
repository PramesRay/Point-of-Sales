import type { Shift } from "@/types/shift";
import dummyEmployee from "../common/employee/dummyEmployee";
import dummyBranchList from "../common/branch/dummyBranchList";

export const dummyShiftEmployee: Shift[] = [
  {
    id: "sft-emp-1",
    employee: dummyEmployee[6],
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    notes: null,
    meta: {
      updated_at: new Date(),
    },
  },
  {
    id: "sft-emp-2",
    employee: dummyEmployee[9],
    branch: dummyBranchList[1],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    notes: 'Shift full',
    meta: {
      updated_at: new Date(),
    },
  },
  {
    id: "sft-emp-3",
    employee: dummyEmployee[11],
    branch: dummyBranchList[2],
    start: new Date('2025-07-03T19:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    notes: 'Shift setengah hari',
    meta: {
      updated_at: new Date(),
    },
  },
  {
    id: "sft-emp-4",
    employee: dummyEmployee[3],
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T19:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    notes: 'Shift setengah hari',
    meta: {
      updated_at: new Date(),
    },
  },
  {
    id: "sft-emp-5",
    employee: dummyEmployee[0],
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    notes: null,
    meta: {
      updated_at: new Date(),
    },
  },
  {
    id: "sft-emp-6",
    employee: dummyEmployee[1],
    branch: dummyBranchList[1],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    notes: null,
    meta: {
      updated_at: new Date(),
    },
  },
  {
    id: "sft-emp-7",
    employee: dummyEmployee[2],
    branch: dummyBranchList[2],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    notes: null,
    meta: {
      updated_at: new Date(),
    },
  },
  {
    id: "sft-emp-8",
    employee: dummyEmployee[3],
    branch: dummyBranchList[3],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    notes: null,
    meta: {
      updated_at: new Date(),
    },
  }
]