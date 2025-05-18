import type { StockMovement } from "@/types/inventoryItem";

export const dummyStockMovements: StockMovement[] = [
{
  id: "b5f4a84f-6376-4a79-9dc6-818638acc49a",
  name: "Nasi Uduk",
  description: "Pengeluaran dari permintaan STR-001 oleh Budi",
  quantity: 20,
  unit: "pcs",
  status: "Keluar",
  time: new Date("2025-04-28T11:00:00"),
  category: {
    id: "cat-001",
    name: "Bahan Pokok"
  },
  branch: {
    id: "branch-1",
    name: "Restoran 1"
  },
  employee: {
    id: "emp-1",
    name: "Budi"
  },
  meta: {
    createdAt: new Date("2025-04-28T11:00:00"),
    updatedAt: null
  }
},
{
  id: "16f65ecc-9d9e-4c18-a66b-e92dc75cc2e5",
  name: "Kertas Struk",
  description: "Pengeluaran dari permintaan STR-003 oleh Budi",
  quantity: 5,
  unit: "pcs",
  status: "Keluar",
  time: new Date("2025-04-27T09:15:00"),
  category: {
    id: "cat-003",
    name: "Pelengkap"
  },
  branch: {
    id: "branch-2",
    name: "Restoran 2"
  },
  employee: {
    id: "emp-1",
    name: "Budi"
  },
  meta: {
    createdAt: new Date("2025-04-27T09:15:00"),
    updatedAt: null
  }
},
{
  id: "bc31942b-17a6-45b7-9bb2-ce2b1dfbf622",
  name: "Ayam Bakar",
  description: "Pengeluaran dari permintaan STR-007 oleh Siti",
  quantity: 20,
  unit: "pcs",
  status: "Keluar",
  time: new Date("2025-04-27T15:00:00"),
  category: {
    id: "cat-002",
    name: "Lauk"
  },
  branch: {
    id: "branch-3",
    name: "Restoran 3"
  },
  employee: {
    id: "emp-2",
    name: "Siti"
  },
  meta: {
    createdAt: new Date("2025-04-27T15:00:00"),
    updatedAt: null
  }
},
{
  id: "5bf900d0-3232-4486-a0a9-9a3d70e5e9e0",
  name: "Alat Panggang",
  description: "Pengeluaran dari permintaan STR-0010 oleh Siti",
  quantity: 1,
  unit: "pcs",
  status: "Keluar",
  time: new Date("2025-04-25T09:40:00"),
  category: {
    id: "cat-003",
    name: "Pelengkap"
  },
  branch: {
    id: "branch-4",
    name: "Restoran 4"
  },
  employee: {
    id: "emp-2",
    name: "Siti"
  },
  meta: {
    createdAt: new Date("2025-04-25T09:40:00"),
    updatedAt: null
  }
},
{
  id: "d7304ab7-a93c-4028-9487-604007d8e427",
  name: "Nasi Uduk",
  description: "Pengeluaran dari permintaan STR-0011 oleh Rudi",
  quantity: 30,
  unit: "pcs",
  status: "Keluar",
  time: new Date("2025-04-28T08:10:00"),
  category: {
    id: "cat-001",
    name: "Bahan Pokok"
  },
  branch: {
    id: "branch-1",
    name: "Restoran 1"
  },
  employee: {
    id: "emp-3",
    name: "Rudi"
  },
  meta: {
    createdAt: new Date("2025-04-28T08:10:00"),
    updatedAt: null
  }
},
{
  id: "ef5dd53e-380d-4d50-a62f-1cfab12ca068",
  name: "Kertas Struk",
  description: "Pengeluaran dari permintaan STR-0013 oleh Rudi",
  quantity: 10,
  unit: "pcs",
  status: "Keluar",
  time: new Date("2025-04-27T17:00:00"),
  category: {
    id: "cat-003",
    name: "Pelengkap"
  },
  branch: {
    id: "branch-2",
    name: "Restoran 2"
  },
  employee: {
    id: "emp-3",
    name: "Rudi"
  },
  meta: {
    createdAt: new Date("2025-04-27T17:00:00"),
    updatedAt: null
  }
},
{
  id: "af21f2f4-dd78-4835-a14a-061b422814e5",
  name: "Minyak Goreng",
  description: "Pengeluaran dari permintaan STR-0014 oleh Rudi",
  quantity: 15,
  unit: "pcs",
  status: "Keluar",
  time: new Date("2025-04-26T13:00:00"),
  category: {
    id: "cat-003",
    name: "Pelengkap"
  },
  branch: {
    id: "branch-3",
    name: "Restoran 3"
  },
  employee: {
    id: "emp-3",
    name: "Rudi"
  },
  meta: {
    createdAt: new Date("2025-04-26T13:00:00"),
    updatedAt: null
  }
},
{
  id: "0d070788-aacd-432f-b08a-48f098e161b8",
  name: "Nasi Putih",
  description: "Pengeluaran dari permintaan STR-0017 oleh Dewi",
  quantity: 35,
  unit: "pcs",
  status: "Keluar",
  time: new Date("2025-04-28T14:50:00"),
  category: {
    id: "cat-001",
    name: "Bahan Pokok"
  },
  branch: {
    id: "branch-4",
    name: "Restoran 4"
  },
  employee: {
    id: "emp-4",
    name: "Dewi"
  },
  meta: {
    createdAt: new Date("2025-04-28T14:50:00"),
    updatedAt: null
  }
},
{
  id: "65954def-e466-41a8-a09a-8b1c152d6846",
  name: "Gas Elpiji",
  description: "Pengeluaran dari permintaan STR-0019 oleh Dewi",
  quantity: 3,
  unit: "pcs",
  status: "Keluar",
  time: new Date("2025-04-26T15:00:00"),
  category: {
    id: "cat-003",
    name: "Pelengkap"
  },
  branch: {
    id: "branch-1",
    name: "Restoran 1"
  },
  employee: {
    id: "emp-4",
    name: "Dewi"
  },
  meta: {
    createdAt: new Date("2025-04-26T15:00:00"),
    updatedAt: null
  }
},
{
  id: "493ac069-2829-4a23-8e63-ba6ed7d5e154",
  name: "Minyak Goreng",
  description: "Stok masuk manual oleh Budi ke Restoran 1",
  quantity: 20,
  unit: "pcs",
  status: "Masuk",
  time: new Date("2025-04-24T16:30:00"),
  category: {
    id: "cat-003",
    name: "Pelengkap"
  },
  branch: {
    id: "branch-1",
    name: "Restoran 1"
  },
  employee: {
    id: "emp-1",
    name: "Budi"
  },
  meta: {
    createdAt: new Date("2025-04-24T07:00:00"),
    updatedAt: null
  }
},
{
  id: "2c1f038c-0416-4fa2-90a6-2238fb120bca",
  name: "Kertas Struk",
  description: "Stok masuk manual oleh Siti ke Restoran 2",
  quantity: 10,
  unit: "pcs",
  status: "Masuk",
  time: new Date("2025-04-24T17:15:00"),
  category: {
    id: "cat-003",
    name: "Pelengkap"
  },
  branch: {
    id: "branch-2",
    name: "Restoran 2"
  },
  employee: {
    id: "emp-2",
    name: "Siti"
  },
  meta: {
    createdAt: new Date("2025-04-24T07:00:00"),
    updatedAt: null
  }
},
{
  id: "398dee60-8705-466f-815b-d70f87370d0e",
  name: "Lele Segar",
  description: "Stok masuk manual oleh Rudi ke Restoran 3",
  quantity: 25,
  unit: "pcs",
  status: "Masuk",
  time: new Date("2025-04-24T10:15:00"),
  category: {
    id: "cat-002",
    name: "Lauk"
  },
  branch: {
    id: "branch-3",
    name: "Restoran 3"
  },
  employee: {
    id: "emp-3",
    name: "Rudi"
  },
  meta: {
    createdAt: new Date("2025-04-24T07:00:00"),
    updatedAt: null
  }
},
{
  id: "2587e51f-d42a-4230-9c31-566315daf997",
  name: "Tempe Goreng",
  description: "Stok masuk manual oleh Dewi ke Restoran 4",
  quantity: 30,
  unit: "pcs",
  status: "Masuk",
  time: new Date("2025-04-24T11:15:00"),
  category: {
    id: "cat-002",
    name: "Lauk"
  },
  branch: {
    id: "branch-4",
    name: "Restoran 4"
  },
  employee: {
    id: "emp-4",
    name: "Dewi"
  },
  meta: {
    createdAt: new Date("2025-04-24T07:00:00"),
    updatedAt: null
  }
},
{
  id: "dad5359a-d5b9-4f75-bf5d-e5e73e2d114e",
  name: "Gas Elpiji",
  description: "Stok masuk manual oleh Budi ke Restoran 1",
  quantity: 4,
  unit: "pcs",
  status: "Masuk",
  time: new Date("2025-04-24T09:45:00"),
  category: {
    id: "cat-003",
    name: "Pelengkap"
  },
  branch: {
    id: "branch-1",
    name: "Restoran 1"
  },
  employee: {
    id: "emp-1",
    name: "Budi"
  },
  meta: {
    createdAt: new Date("2025-04-24T07:00:00"),
    updatedAt: null
  }
},
{
  id: "1548a2ec-f54c-4768-98ad-8ca111fec6e1",
  name: "Sambal",
  description: "Stok masuk manual oleh Siti ke Restoran 2",
  quantity: 15,
  unit: "pcs",
  status: "Masuk",
  time: new Date("2025-04-24T17:30:00"),
  category: {
    id: "cat-003",
    name: "Pelengkap"
  },
  branch: {
    id: "branch-2",
    name: "Restoran 2"
  },
  employee: {
    id: "emp-2",
    name: "Siti"
  },
  meta: {
    createdAt: new Date("2025-04-24T07:00:00"),
    updatedAt: null
  }
},
{
  id: "4e5f1953-ff23-4bb8-9ad3-586e0d3b8e60",
  name: "Plastik Takeaway",
  description: "Stok masuk manual oleh Rudi ke Restoran 3",
  quantity: 120,
  unit: "pcs",
  status: "Masuk",
  time: new Date("2025-04-24T12:00:00"),
  category: {
    id: "cat-003",
    name: "Pelengkap"
  },
  branch: {
    id: "branch-3",
    name: "Restoran 3"
  },
  employee: {
    id: "emp-3",
    name: "Rudi"
  },
  meta: {
    createdAt: new Date("2025-04-24T07:00:00"),
    updatedAt: null
  }
},
{
  id: "21153280-5c54-4d06-8009-30376aae2cb9",
  name: "Ayam Suwir",
  description: "Stok masuk manual oleh Dewi ke Restoran 4",
  quantity: 18,
  unit: "pcs",
  status: "Masuk",
  time: new Date("2025-04-24T14:30:00"),
  category: {
    id: "cat-002",
    name: "Lauk"
  },
  branch: {
    id: "branch-4",
    name: "Restoran 4"
  },
  employee: {
    id: "emp-4",
    name: "Dewi"
  },
  meta: {
    createdAt: new Date("2025-04-24T07:00:00"),
    updatedAt: null
  }
}
];
