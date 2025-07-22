import type { Shift } from "@/types/shift";
import dummyEmployee from "../common/employee/dummyEmployee";
import dummyBranchList from "../common/branch/dummyBranchList";

export const dummyShiftEmployee: Shift[] = [
  {
    id: "sft-emp-1",
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    notes: null,
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: dummyEmployee[6].id,
        name: dummyEmployee[6].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[6].id,
        name: dummyEmployee[6].name
      },
    },
  },
  {
    id: "sft-emp-2",
    branch: dummyBranchList[1],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    notes: 'Shift full',
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: dummyEmployee[9].id,
        name: dummyEmployee[9].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[9].id,
        name: dummyEmployee[9].name
      },
    },
  },
  {
    id: "sft-emp-3",
    branch: dummyBranchList[2],
    start: new Date('2025-07-03T19:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    notes: 'Shift setengah hari',
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: dummyEmployee[11].id,
        name: dummyEmployee[11].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[11].id,
        name: dummyEmployee[11].name
      },
    },
  },
  {
    id: "sft-emp-4",
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T19:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    notes: 'Shift setengah hari',
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: dummyEmployee[3].id,
        name: dummyEmployee[3].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[3].id,
        name: dummyEmployee[3].name
      },
    },
  },
  {
    id: "sft-emp-5",
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    notes: null,
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: dummyEmployee[0].id,
        name: dummyEmployee[0].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[0].id,
        name: dummyEmployee[0].name
      },
    },
  },
  {
    id: "sft-emp-6",
    branch: dummyBranchList[1],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    notes: null,
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: dummyEmployee[1].id,
        name: dummyEmployee[1].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[1].id,
        name: dummyEmployee[1].name
      },
    },
  },
  {
    id: "sft-emp-7",
    branch: dummyBranchList[2],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    notes: null,
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: dummyEmployee[2].id,
        name: dummyEmployee[2].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[2].id,
        name: dummyEmployee[2].name
      },
    },
  },
  {
    id: "sft-emp-8",
    branch: dummyBranchList[3],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    notes: null,
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: dummyEmployee[3].id,
        name: dummyEmployee[3].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[3].id,
        name: dummyEmployee[3].name
      },
    },
  }
]