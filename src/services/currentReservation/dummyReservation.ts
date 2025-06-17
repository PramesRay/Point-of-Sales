import type { Reservation } from '@/types/reservation'

const dummyReservationData: Reservation[] = [
  {
    id: 'rsv-001',
    branch: { id: 'branch-1', name: 'Restoran 1' },
    customer: { name: "Khodijah", phone: "08123456789" },
    time: new Date("2025-05-29T18:00:00"),
    status: "Pending",
    people: 4,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-002',
    branch: { id: 'branch-1', name: 'Restoran 1' },
    customer: { name: "Siti", phone: "081212121212" },
    time: new Date("2025-05-29T20:00:00"),
    status: "Pending",
    people: 6,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-003',
    branch: { id: 'branch-1', name: 'Restoran 1' },
    customer: { name: "Budi", phone: "081313131313" },
    time: new Date("2025-05-29T18:30:00"),
    status: "Disetujui",
    people: 5,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-004',
    branch: { id: 'branch-1', name: 'Restoran 1' },
    customer: { name: "Rina", phone: "081414141414" },
    time: new Date("2025-05-29T19:00:00"),
    status: "Ditolak",
    people: 4,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-005',
    branch: { id: 'branch-2', name: 'Restoran 2'},
    customer: { name: "Dewi", phone: "082222222222" },
    time: new Date("2025-05-29T18:00:00"),
    status: "Pending",
    people: 6,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-006',
    branch: { id: 'branch-2', name: 'Restoran 2'},
    customer: { name: "Fajar", phone: "083333333333" },
    time: new Date("2025-05-29T19:00:00"),
    status: "Pending",
    people: 5,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-007',
    branch: { id: 'branch-2', name: 'Restoran 2'},
    customer: { name: "Gita", phone: "084444444444" },
    time: new Date("2025-05-29T20:00:00"),
    status: "Disetujui",
    people: 4,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-008',
    branch: { id: 'branch-2', name: 'Restoran 2'},
    customer: { name: "Hendra", phone: "085555555555" },
    time: new Date("2025-05-29T18:30:00"),
    status: "Ditolak",
    people: 5,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-009',
    branch: { id: 'branch-2', name: 'Restoran 2'},
    customer: { name: "Indah", phone: "086666666666" },
    time: new Date("2025-05-29T19:30:00"),
    status: "Pending",
    people: 5,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-010',
    branch: { id: 'branch-2', name: 'Restoran 2'},
    customer: { name: "Joko", phone: "087777777777" },
    time: new Date("2025-05-29T18:00:00"),
    status: "Pending",
    people: 5,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-011',
    branch: { id: 'branch-3', name: 'Restoran 3'},
    customer: { name: "Kiki", phone: "088888888888" },
    time: new Date("2025-05-29T19:00:00"),
    status: "Disetujui",
    people: 4,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-012',
    branch: { id: 'branch-3', name: 'Restoran 3'},
    customer: { name: "Lina", phone: "089999999999" },
    time: new Date("2025-05-29T20:00:00"),
    status: "Ditolak",
    people: 6,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-013',
    branch: { id: 'branch-3', name: 'Restoran 3'},
    customer: { name: "Maman", phone: "080000000000" },
    time: new Date("2025-05-29T18:30:00"),
    status: "Pending",
    people: 5,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-014',
    branch: { id: 'branch-3', name: 'Restoran 3'},
    customer: { name: "Nina", phone: "081111111111" },
    time: new Date("2025-05-29T19:30:00"),
    status: "Disetujui",
    people: 4,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-015',
    branch: { id: 'branch-3', name: 'Restoran 3'},
    customer: { name: "Oki", phone: "082121212121" },
    time: new Date("2025-05-29T18:00:00"),
    status: "Ditolak",
    people: 6,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-016',
    branch: { id: 'branch-4', name: 'Restoran 4'},
    customer: { name: "Putri", phone: "083232323232" },
    time: new Date("2025-05-29T19:00:00"),
    status: "Pending",
    people: 4,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-017',
    branch: { id: 'branch-4', name: 'Restoran 4'},
    customer: { name: "Qori", phone: "084343434343" },
    time: new Date("2025-05-29T20:00:00"),
    status: "Disetujui",
    people: 5,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-018',
    branch: { id: 'branch-4', name: 'Restoran 4'},
    customer: { name: "Rama", phone: "085454545454" },
    time: new Date("2025-05-29T18:30:00"),
    status: "Pending",
    people: 5,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-019',
    branch: { id: 'branch-4', name: 'Restoran 4'},
    customer: { name: "Salsa", phone: "086565656565" },
    time: new Date("2025-05-29T19:30:00"),
    status: "Ditolak",
    people: 6,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
  {
    id: 'rsv-020',
    branch: { id: 'branch-1', name: 'Restoran 1' },
    customer: { name: "Ahmad", phone: "081987654321" },
    time: new Date("2025-05-29T19:30:00"),
    status: "Pending",
    people: 5,
    notes: '',
    meta: {
      created_at: new Date('2025-05-29T14:00:00'),
      updated_at: new Date('2025-05-29T14:00:00')
    }
  },
]

export default dummyReservationData
