import type { InventoryItem } from "@/types/inventoryItem";

export const dummyInventoryItems: InventoryItem[] = [
  // Bahan Pokok
  {
    id: 'inv-001',
    name: 'Beras Cianjur',
    category: {
      id: 'cat-001',
      name: 'Bahan Pokok',
    },
    description: 'Beras putih premium untuk nasi uduk',
    quantity: 100,
    threshold: 30,
    expireDate: new Date('2025-07-01'),
  },
  {
    id: 'inv-002',
    name: 'Santan Kelapa',
    category: {
      id: 'cat-001',
      name: 'Bahan Pokok',
    },
    description: 'Santan cair segar untuk memasak nasi uduk',
    quantity: 50,
    threshold: 20,
    expireDate: new Date('2025-05-10'),
  },
  {
    id: 'inv-003',
    name: 'Daun Salam',
    category: {
      id: 'cat-001',
      name: 'Bahan Pokok',
    },
    quantity: 20,
    threshold: 5,
    expireDate: new Date('2025-05-15'),
  },
  {
    id: 'inv-004',
    name: 'Serai',
    category: {
      id: 'cat-001',
      name: 'Bahan Pokok',
    },
    quantity: 25,
    threshold: 8,
    expireDate: new Date('2025-05-18'),
  },
  {
    id: 'inv-005',
    name: 'Garam',
    category: {
      id: 'cat-001',
      name: 'Bahan Pokok',
    },
    quantity: 40,
    threshold: 10,
  },

  // Lauk
  {
    id: 'inv-006',
    name: 'Ayam Potong',
    category: {
      id: 'cat-002',
      name: 'Lauk',
    },
    description: 'Daging ayam untuk goreng atau semur',
    quantity: 30,
    threshold: 10,
    expireDate: new Date('2025-05-08'),
  },
  {
    id: 'inv-007',
    name: 'Telur Ayam',
    category: {
      id: 'cat-002',
      name: 'Lauk',
    },
    quantity: 100,
    threshold: 30,
    expireDate: new Date('2025-05-15'),
  },
  {
    id: 'inv-008',
    name: 'Tempe',
    category: {
      id: 'cat-002',
      name: 'Lauk',
    },
    quantity: 60,
    threshold: 15,
    expireDate: new Date('2025-05-09'),
  },
  {
    id: 'inv-009',
    name: 'Tahu',
    category: {
      id: 'cat-002',
      name: 'Lauk',
    },
    quantity: 45,
    threshold: 12,
    expireDate: new Date('2025-05-09'),
  },
  {
    id: 'inv-010',
    name: 'Ikan Asin',
    category: {
      id: 'cat-002',
      name: 'Lauk',
    },
    quantity: 20,
    threshold: 5,
  },

  // Pelengkap
  {
    id: 'inv-011',
    name: 'Bawang Merah Goreng',
    category: {
      id: 'cat-003',
      name: 'Pelengkap',
    },
    quantity: 15,
    threshold: 5,
  },
  {
    id: 'inv-012',
    name: 'Sambal Kacang',
    category: {
      id: 'cat-003',
      name: 'Pelengkap',
    },
    description: 'Sambal kacang khas nasi uduk',
    quantity: 10,
    threshold: 5,
    expireDate: new Date('2025-05-12'),
  },
  {
    id: 'inv-013',
    name: 'Timun',
    category: {
      id: 'cat-003',
      name: 'Pelengkap',
    },
    quantity: 30,
    threshold: 10,
    expireDate: new Date('2025-05-06'),
  },
  {
    id: 'inv-014',
    name: 'Kerupuk',
    category: {
      id: 'cat-003',
      name: 'Pelengkap',
    },
    quantity: 100,
    threshold: 20,
  },
  {
    id: 'inv-015',
    name: 'Acar',
    category: {
      id: 'cat-003',
      name: 'Pelengkap',
    },
    quantity: 15,
    threshold: 5,
    expireDate: new Date('2025-05-10'),
  },
]