import type { StockRequest } from "@/types/inventory";
import { dummyInventoryItems } from "./dummyInventoryItems";

const dummyStockRequestList: StockRequest[] = [
  {
    id: 'STR-001',
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 20,
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Persiapan malam minggu",
    meta: {
      created_at: new Date("2025-04-28T10:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-28T11:00:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-002',
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: null,
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 30,
      status: "Pending"
    },
    {
      item: {
        id: dummyInventoryItems[1].id,
        name: dummyInventoryItems[1].name,
        unit: dummyInventoryItems[1].unit
      },
      quantity: 30,
      status: "Pending"
    }
    ],
    status: "Pending",
    note: "Stok mulai menipis",
    meta: {
      created_at: new Date("2025-04-28T12:30:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-28T12:30:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-003',
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 5,
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Untuk mesin kasir 2",
    meta: {
      created_at: new Date("2025-04-27T09:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-27T09:15:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-004',
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 10,
      status: "Ditolak"
    }],
    status: "Ditolak",
    note: "Sudah tersedia dari gudang",
    meta: {
      created_at: new Date("2025-04-26T11:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-26T11:45:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-005',
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: null,
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 15,
      status: "Pending"
    }],
    status: "Pending",
    note: "Stok untuk malam ini",
    meta: {
      created_at: new Date("2025-04-28T15:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-28T15:10:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },

  {
    id: 'STR-006',
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: null,
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 25,
      status: "Pending"
    }],
    status: "Pending",
    note: "Stok menipis menjelang akhir pekan",
    meta: {
      created_at: new Date("2025-04-28T11:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-28T11:00:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-007',
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 20,
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Menu spesial hari Jumat",
    meta: {
      created_at: new Date("2025-04-27T14:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-27T15:00:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-008',
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 100,
      status: "Ditolak"
    }],
    status: "Ditolak",
    note: "Stok masih aman hingga minggu depan",
    meta: {
      created_at: new Date("2025-04-26T10:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-26T10:00:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-009',
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: null,
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 40,
      status: "Pending"
    }],
    status: "Pending",
    note: "Permintaan dari dapur",
    meta: {
      created_at: new Date("2025-04-28T16:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-28T16:00:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-0010',
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 1,
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Alat lama rusak",
    meta: {
      created_at: new Date("2025-04-25T09:30:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-25T09:40:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },

  {
    id: 'STR-0011',
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 30,
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Stok rutin harian",
    meta: {
      created_at: new Date("2025-04-28T08:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-28T08:10:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-0012',
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: null,
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 20,
      status: "Pending"
    }],
    status: "Pending",
    note: "Persiapan promo malam",
    meta: {
      created_at: new Date("2025-04-28T13:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-28T13:20:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-0013',
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 10,
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Stok habis sejak kemarin",
    meta: {
      created_at: new Date("2025-04-27T17:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-27T17:00:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-0014',
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 15,
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Persediaan rendah",
    meta: {
      created_at: new Date("2025-04-26T12:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-26T13:00:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-0015',
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 25,
      status: "Ditolak"
    }],
    status: "Ditolak",
    note: "Menu ditiadakan minggu ini",
    meta: {
      created_at: new Date("2025-04-25T10:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-25T10:00:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },

  {
    id: 'STR-0016',
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: null,
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 50,
      status: "Pending"
    }],
    status: "Pending",
    note: "Stok cadangan habis",
    meta: {
      created_at: new Date("2025-04-28T09:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-28T09:50:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-0017',
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 35,
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Untuk shift malam",
    meta: {
      created_at: new Date("2025-04-28T14:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-28T14:50:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-0018',
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 10,
      status: "Ditolak"
    }],
    status: "Ditolak",
    note: "Masih cukup hingga akhir minggu",
    meta: {
      created_at: new Date("2025-04-27T08:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-27T08:50:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-0019',
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: 'sft-wh-1',
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 3,
      status: "Disetujui"
    }],
    status: "Disetujui",
    note: "Cadangan habis",
    meta: {
      created_at: new Date("2025-04-26T15:00:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-26T15:00:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  },
  {
    id: 'STR-0020',
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    },
    shift: {
      kitchen: 'sft-kch-1',
      warehouse: null,
    },
    items: [{
      item: {
        id: dummyInventoryItems[0].id,
        name: dummyInventoryItems[0].name,
        unit: dummyInventoryItems[0].unit
      },
      quantity: 200,
      status: "Pending"
    }],
    status: "Pending",
    note: "Persiapan take away akhir pekan",
    meta: {
      created_at: new Date("2025-04-25T16:30:00"),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date("2025-04-25T16:35:00"),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  }
];

export default dummyStockRequestList;