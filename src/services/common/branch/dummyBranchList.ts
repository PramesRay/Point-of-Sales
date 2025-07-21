import type { Branch } from "@/types/branch";
import dummyEmployee from "../employee/dummyEmployee";

const dummyBranchList: Branch[] = [
  {
    id: 'branch-1',
    name: 'Restoran 1',
    operational: {
      activity: {
        is_open: true,
        opened_at: new Date('2025-06-18T09:00:00'),
        opened_by: {
          id: 'emp-001',
          name: 'Rina Ayu'
        },
      },
      open_time: '17:00',
      close_time: '00:00',
    },
    description: 'Restoran dengan menu khas Indonesia.',
    address: 'Jl. Contoh No. 1, Jakarta',
    contact: '081234567890',
  },
  {
    id: 'branch-2',
    name: 'Restoran 2',
    operational: {
      activity: {
        is_open: false,
        opened_at: null,
        opened_by: null,
      },
      open_time: '17:00',
      close_time: '00:00',
    },
    description: 'Restoran dengan suasana santai dan nyaman.',
    address: 'Jl. Contoh No. 2, Jakarta',
    contact: '081223456789',
  },
  {
    id: 'branch-3',
    name: 'Restoran 3',
    operational: {
      activity: {
        is_open: true,
        opened_at: new Date('2025-06-18T08:30:00'),
        opened_by: {
          id: 'emp-011',
          name: 'Bagas'
        },
      },
      open_time: '05:30',
      close_time: '09:00',
    },
    description: 'Restoran dengan menu fusion internasional.',
    address: 'Jl. Contoh No. 3, Jakarta',
    contact: '081234561234',
  },
  {
    id: 'branch-4',
    name: 'Restoran 4',
    operational: {
      activity: {
        is_open: true,
        opened_at: new Date('2025-06-18T10:00:00'),
        opened_by: {
          id: 'emp-016',
          name: 'Hadi'
        },
      },
      open_time: '05:30',
      close_time: '09:00',
    },
    description: 'Restoran dengan konsep taman outdoor.',
    address: 'Jl. Contoh No. 4, Jakarta',
    contact: '081245678901',
  },
];

export default dummyBranchList;
