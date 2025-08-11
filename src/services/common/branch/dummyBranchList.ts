import type { Branch } from "@/types/branch";

const dummyBranchList: Branch[] = [
  {
    id: 'branch-1',
    name: 'Restoran 1',
    operational: {
      is_active: true,
      open_time: '17:00',
      close_time: '00:00',
    },
    description: 'Restoran dengan menu khas Indonesia.',
    address: 'Jl. Contoh No. 1, Jakarta',
    contact: '081234567890',
    meta: {
      created_at: new Date(),
      updated_at: new Date(),
    }
  },
  {
    id: 'branch-2',
    name: 'Restoran 2',
    operational: {
      is_active: true,
      open_time: '17:00',
      close_time: '00:00',
    },
    description: 'Restoran dengan suasana santai dan nyaman.',
    address: 'Jl. Contoh No. 2, Jakarta',
    contact: '081223456789',
    meta: {
      created_at: new Date(),
      updated_at: new Date(),
    }
  },
  {
    id: 'branch-3',
    name: 'Restoran 3',
    operational: {
      is_active: true,
      open_time: '05:30',
      close_time: '09:00',
    },
    description: 'Restoran dengan menu fusion internasional.',
    address: 'Jl. Contoh No. 3, Jakarta',
    contact: '081234561234',
    meta: {
      created_at: new Date(),
      updated_at: new Date(),
    }
  },
  {
    id: 'branch-4',
    name: 'Restoran 4',
    operational: {
    is_active: true,
      open_time: '05:30',
      close_time: '09:00',
    },
    description: 'Restoran dengan konsep taman outdoor.',
    address: 'Jl. Contoh No. 4, Jakarta',
    contact: '081245678901',
    meta: {
      created_at: new Date(),
      updated_at: new Date(),
    }
  },
  {
    id: 'branch-5',
    name: 'Restoran 5',
    operational: {
      is_active: false,
      open_time: '09:30',
      close_time: '22:00',
    },
    description: 'Restoran dengan menu vegetarian dan vegan.',
    address: 'Jl. Contoh No. 5, Jakarta',
    contact: '081256789012',
    meta: {
      created_at: new Date(),
      updated_at: new Date(),
    }
  }
];

export default dummyBranchList;