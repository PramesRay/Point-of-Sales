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
      status: "Diproses"
    }],
    status: "Diproses",
    note: "Persiapan malam minggu",
    meta: {
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      status: "Siap"
    },
    {
      item: {
        id: dummyInventoryItems[1].id,
        name: dummyInventoryItems[1].name,
        unit: dummyInventoryItems[1].unit
      },
      quantity: 30,
      status: "Ditolak"
    }
    ],
    status: "Siap",
    note: "Stok mulai menipis",
    meta: {
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      status: "Diproses"
    }],
    status: "Diproses",
    note: "Untuk mesin kasir 2",
    meta: {
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      status: "Diproses"
    }],
    status: "Diproses",
    note: "Menu spesial hari Jumat",
    meta: {
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      status: "Diproses"
    }],
    status: "Diproses",
    note: "Alat lama rusak",
    meta: {
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      status: "Diproses"
    }],
    status: "Diproses",
    note: "Stok rutin harian",
    meta: {
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      status: "Diproses"
    }],
    status: "Diproses",
    note: "Stok habis sejak kemarin",
    meta: {
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      status: "Diproses"
    }],
    status: "Diproses",
    note: "Persediaan rendah",
    meta: {
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      status: "Diproses"
    }],
    status: "Diproses",
    note: "Untuk shift malam",
    meta: {
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      status: "Diproses"
    }],
    status: "Diproses",
    note: "Cadangan habis",
    meta: {
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
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
      created_at: new Date(),
      created_by: { id: 'emp-004', name: 'Budi'},
      updated_at: new Date(),
      last_updated_by: { id: 'emp-004', name: 'Budi'}
    }
  }
];

export default dummyStockRequestList;