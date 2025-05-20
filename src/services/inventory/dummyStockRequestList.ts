import type { StockRequestList } from "@/types/inventory";

const dummyStockRequestList: StockRequestList[] = [
  {
    id: 'STR-001',
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    },
    employee: { 
      id: "",
      name: "Budi" },
    items: [{
      item: {
        id: "",
        name: "Nasi Uduk",
        quantity: 20,
        unit: "pcs"
      },
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Persiapan malam minggu",
    time: {
      createdAt: new Date("2025-04-28T10:00:00"),
      updatedAt: new Date("2025-04-28T11:00:00")
    }
  },
  {
    id: 'STR-002',
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    },
    employee: { 
      id: "",
      name: "Budi" },
    items: [{
      item: {
        id: "",
        name: "Ayam Goreng",
        quantity: 30,
        unit: "pcs"
      },
      status: "Pending"
    },
    {
      item: {
        id: "",
        name: "Bebek Goreng",
        quantity: 30,
        unit: "pcs"
      },
      status: "Pending"
    }
    ],
    status: "Pending",
    note: "Stok mulai menipis",
    time: {
      createdAt: new Date("2025-04-28T12:30:00"),
      updatedAt: null
    }
  },
  {
    id: 'STR-003',
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    },
    employee: { 
      id: "",
      name: "Budi" },
    items: [{
      item: {
        id: "",
        name: "Kertas Struk",
        quantity: 5,
        unit: "pcs"
      },
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Untuk mesin kasir 2",
    time: {
      createdAt: new Date("2025-04-27T09:00:00"),
      updatedAt: new Date("2025-04-27T09:15:00")
    }
  },
  {
    id: 'STR-004',
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    },
    employee: { 
      id: "",
      name: "Budi" },
    items: [{
      item: {
        id: "",
        name: "Minyak Goreng",
        quantity: 10,
        unit: "pcs"
      },
      status: "Ditolak"
    }],
    status: "Ditolak",
    note: "Sudah tersedia dari gudang",
    time: {
      createdAt: new Date("2025-04-26T11:00:00"),
      updatedAt: new Date("2025-04-26T11:45:00")
    }
  },
  {
    id: 'STR-005',
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    },
    employee: { 
      id: "",
      name: "Budi" },
    items: [{
      item: {
        id: "",
        name: "Lele Segar",
        quantity: 15,
        unit: "pcs"
      },
      status: "Pending"
    }],
    status: "Pending",
    note: "Stok untuk malam ini",
    time: {
      createdAt: new Date("2025-04-28T15:00:00"),
      updatedAt: new Date("2025-04-28T15:10:00")
    }
  },

  {
    id: 'STR-006',
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    },
    employee: { 
      id: "",
      name: "Siti" },
    items: [{
      item: {
        id: "",
        name: "Nasi Putih",
        quantity: 25,
        unit: "pcs"
      },
      status: "Pending"
    }],
    status: "Pending",
    note: "Stok menipis menjelang akhir pekan",
    time: {
      createdAt: new Date("2025-04-28T11:00:00"),
      updatedAt: null
    }
  },
  {
    id: 'STR-007',
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    },
    employee: { 
      id: "",
      name: "Siti" },
    items: [{
      item: {
        id: "",
        name: "Ayam Bakar",
        quantity: 20,
        unit: "pcs"
      },
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Menu spesial hari Jumat",
    time: {
      createdAt: new Date("2025-04-27T14:00:00"),
      updatedAt: new Date("2025-04-27T15:00:00")
    }
  },
  {
    id: 'STR-008',
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    },
    employee: { 
      id: "",
      name: "Siti" },
    items: [{
      item: {
        id: "",
        name: "Plastik Takeaway",
        quantity: 100,
        unit: "pcs"
      },
      status: "Ditolak"
    }],
    status: "Ditolak",
    note: "Stok masih aman hingga minggu depan",
    time: {
      createdAt: new Date("2025-04-26T10:00:00"),
      updatedAt: null
    }
  },
  {
    id: 'STR-009',
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    },
    employee: { 
      id: "",
      name: "Siti" },
    items: [{
      item: {
        id: "",
        name: "Tahu Goreng",
        quantity: 40,
        unit: "pcs"
      },
      status: "Pending"
    }],
    status: "Pending",
    note: "Permintaan dari dapur",
    time: {
      createdAt: new Date("2025-04-28T16:00:00"),
      updatedAt: null
    }
  },
  {
    id: 'STR-0010',
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    },
    employee: { 
      id: "",
      name: "Siti" },
    items: [{
      item: {
        id: "",
        name: "Alat Panggang",
        quantity: 1,
        unit: "pcs"
      },
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Alat lama rusak",
    time: {
      createdAt: new Date("2025-04-25T09:30:00"),
      updatedAt: new Date("2025-04-25T09:40:00")
    }
  },

  {
    id: 'STR-0011',
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    },
    employee: { 
      id: "",
      name: "Rudi" },
    items: [{
      item: {
        id: "",
        name: "Nasi Uduk",
        quantity: 30,
        unit: "pcs"
      },
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Stok rutin harian",
    time: {
      createdAt: new Date("2025-04-28T08:00:00"),
      updatedAt: new Date("2025-04-28T08:10:00")
    }
  },
  {
    id: 'STR-0012',
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    },
    employee: { 
      id: "",
      name: "Rudi" },
    items: [{
      item: {
        id: "",
        name: "Lele Goreng",
        quantity: 20,
        unit: "pcs"
      },
      status: "Pending"
    }],
    status: "Pending",
    note: "Persiapan promo malam",
    time: {
      createdAt: new Date("2025-04-28T13:00:00"),
      updatedAt: new Date("2025-04-28T13:20:00")
    }
  },
  {
    id: 'STR-0013',
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    },
    employee: { 
      id: "",
      name: "Rudi" },
    items: [{
      item: {
        id: "",
        name: "Kertas Struk",
        quantity: 10,
        unit: "pcs"
      },
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Stok habis sejak kemarin",
    time: {
      createdAt: new Date("2025-04-27T17:00:00"),
      updatedAt: null
    }
  },
  {
    id: 'STR-0014',
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    },
    employee: { 
      id: "",
      name: "Rudi" },
    items: [{
      item: {
        id: "",
        name: "Minyak Goreng",
        quantity: 15,
        unit: "pcs"
      },
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Persediaan rendah",
    time: {
      createdAt: new Date("2025-04-26T12:00:00"),
      updatedAt: new Date("2025-04-26T13:00:00")
    }
  },
  {
    id: 'STR-0015',
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    },
    employee: { 
      id: "",
      name: "Rudi" },
    items: [{
      item: {
        id: "",
        name: "Ayam Suwir",
        quantity: 25,
        unit: "pcs"
      },
      status: "Ditolak"
    }],
    status: "Ditolak",
    note: "Menu ditiadakan minggu ini",
    time: {
      createdAt: new Date("2025-04-25T10:00:00"),
      updatedAt: null
    }
  },

  {
    id: 'STR-0016',
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    },
    employee: { 
      id: "",
      name: "Dewi" },
    items: [{
      item: {
        id: "",
        name: "Tempe Goreng",
        quantity: 50,
        unit: "pcs"
      },
      status: "Pending"
    }],
    status: "Pending",
    note: "Stok cadangan habis",
    time: {
      createdAt: new Date("2025-04-28T09:00:00"),
      updatedAt: new Date("2025-04-28T09:50:00")
    }
  },
  {
    id: 'STR-0017',
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    },
    employee: { 
      id: "",
      name: "Dewi" },
    items: [{
      item: {
        id: "",
        name: "Nasi Putih",
        quantity: 35,
        unit: "pcs"
      },
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Untuk shift malam",
    time: {
      createdAt: new Date("2025-04-28T14:00:00"),
      updatedAt: new Date("2025-04-28T14:50:00")
    }
  },
  {
    id: 'STR-0018',
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    },
    employee: { 
      id: "",
      name: "Dewi" },
    items: [{
      item: {
        id: "",
        name: "Sambal",
        quantity: 10,
        unit: "pcs"
      },
      status: "Ditolak"
    }],
    status: "Ditolak",
    note: "Masih cukup hingga akhir minggu",
    time: {
      createdAt: new Date("2025-04-27T08:00:00"),
      updatedAt: new Date("2025-04-27T08:50:00")
    }
  },
  {
    id: 'STR-0019',
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    },
    employee: { 
      id: "",
      name: "Dewi" },
    items: [{
      item: {
        id: "",
        name: "Gas Elpiji",
        quantity: 3,
        unit: "pcs"
      },
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Cadangan habis",
    time: {
      createdAt: new Date("2025-04-26T15:00:00"),
      updatedAt: null
    }
  },
  {
    id: 'STR-0020',
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    },
    employee: { 
      id: "",
      name: "Dewi" },
    items: [{
      item: {
        id: "",
        name: "Sendok Plastik",
        quantity: 200,
        unit: "pcs"
      },
      status: "Pending"
    }],
    status: "Pending",
    note: "Persiapan take away akhir pekan",
    time: {
      createdAt: new Date("2025-04-25T16:30:00"),
      updatedAt: new Date("2025-04-25T16:35:00")
    }
  }
];

export default dummyStockRequestList;