import { dummyMenuSale } from "@/services/menu/dummyMenuSale";
import dummyBranchList from "../branch/dummyBranchList";
import type { Employee } from "@/types/employee";

const dummyEmployee: Employee[] = [
  {
    id: 'emp-000',
    uid: 'emp-000',
    name: 'Hermanu',
    role: 'admin',
    email: 'hermanu.admin@example.com',
    assigned_branch: dummyBranchList[0],
    activity: {
      shift_emp: null,
      shift_op: null,
      is_active: true,
      branch: null,
      last_active: new Date('2025-05-01T09:30:00Z'),
    },
    meta: {
      created_at: new Date('2024-10-01T08:00:00Z'),
      updated_at: new Date('2025-05-01T09:30:00Z'),
    }
  },
  {
    id: 'emp-001',
    uid: 'emp-001',
    name: 'Hermanu',
    role: 'gudang',
    email: 'hermanu.admin@example.com',
    assigned_branch: dummyBranchList[0],
    activity: {
      shift_emp: {
        id: "sft-emp-2",
        branch: dummyBranchList[0],
        start: new Date('2025-07-03T10:00:00.000Z'),
        end: null,  // Shift belum berakhir karena aktif
        notes: 'Gudang shift',
        meta: {
          created_at: new Date('2025-07-01T11:00:00.000Z'),
          created_by: {
            id: 'emp-001',
            name: 'Hermanu',
            role: 'gudang',
          },
          updated_at: new Date(),
          last_updated_by: {
            id: 'emp-001',
            name: 'Hermanu',
            role: 'gudang',
          },
        },
      },
      shift_op: {
        id: "sft-wh-1",
        start: new Date('2025-07-03T00:00:00.000Z'),
        end: new Date('2025-07-03T23:59:59.000Z'),
        notes: "Shift warehouse pertama pada hari ini",
        
        total_restock_request: 20,  // Total permintaan restock
        request_approved: 18,  // Permintaan restock yang disetujui
        request_rejected: 2,  // Permintaan restock yang ditolak
        total_stock_movement: 100,  // Total pergerakan stok
        stock_movement_in: 60,  // Stok masuk
        stock_movement_out: 40,  // Stok keluar
        meta: {
          created_at: new Date('2025-07-01T10:00:00.000Z'),
          created_by: {
            id: 'emp-001',
            name: 'Hermanu',
            role: 'gudang',
          },
          updated_at: new Date(),
          last_updated_by: {
            id: 'emp-001',
            name: 'Hermanu',
            role: 'gudang',
          },
        },
      },
      is_active: true,
      branch: dummyBranchList[0],
      last_active: new Date('2025-05-01T09:30:00Z'),
    },
    meta: {
      created_at: new Date('2024-10-01T08:00:00Z'),
      updated_at: new Date('2025-05-01T09:30:00Z'),
    }
  },
  { 
  id: 'emp-002',
  uid: 'emp-002',
  name: 'Aldi', 
  role: 'kasir', 
  email: 'aldi.kitchen@example.com',
  assigned_branch: dummyBranchList[0],
  activity: {
    shift_emp: {
      id: "sft-emp-3",
      branch: dummyBranchList[0],
      start: new Date('2025-07-03T12:00:00.000Z'),
      end: null,  // Shift belum berakhir karena aktif
      notes: 'Kasir shift',
      meta: {
        created_at: new Date('2025-07-01T12:00:00.000Z'),
        created_by: {
          id: 'emp-002',
          name: 'Aldi', 
          role: 'kasir', 
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-002',
          name: 'Aldi', 
          role: 'kasir', 
        },
      },
    },
    shift_op: {
      id: "sft-csr-1",
      branch: dummyBranchList[0],
      start: new Date('2025-07-03T16:00:00.000Z'),
      end: null,
      notes: null,
      initial_cash: 100000,
      cash_in: [
        {
          id: 'cash-in-001',
          subject: "Pembayaran Cash",
          amount: 500000,
        },
      ],
      cash_out: [
        {
          id: 'cash-out-001',
          subject: "Belanja Kertas Nasi",
          quantity: 3,
          unit: "pack",
          unit_price: 10000,
        }
      ],
      cash_payment: 500000,
      digital_payment: 0,
      digital_payment_refund: 0,
      cash_payment_refund: 0,
      total_expense: 30000,
      income: 500000,
      net_income: 470000,
      actual_cash: 100000 + 500000 - 30000,
      total_order: 100,  // Total order
      completed_order: 90,
      canceled_order: 10,  // Canceled order
      meta: {
        created_at: new Date('2025-07-01T10:00:00.000Z'),
        created_by: {
          id: 'emp-002',
          name: 'Aldi', 
          role: 'kasir', 
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-002',
          name: 'Aldi', 
          role: 'kasir', 
        },
      },
    },
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: dummyBranchList[0]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-003',
  uid: 'emp-003',
  name: 'Rani', 
  role: 'dapur', 
  email: 'rani.kitchen@example.com',
  assigned_branch: dummyBranchList[0],
  activity: {
    shift_emp: {
      id: "sft-emp-4",
      branch: dummyBranchList[0],
      start: new Date('2025-07-01T08:00:00.000Z'),
      end: new Date('2025-07-01T16:00:00.000Z'),  // Shift berakhir
      notes: 'Dapur shift',
      meta: {
        created_at: new Date('2025-06-30T08:00:00.000Z'),
        created_by: {
          id: 'emp-003',
          name: 'Rani', 
          role: 'dapur',
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-003',
          name: 'Rani', 
          role: 'dapur',
        },
      },
    },
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-004',
  uid: 'emp-004',
  name: 'Budi', 
  role: 'dapur', 
  email: 'budi.kitchen@example.com',
  assigned_branch: dummyBranchList[0],
  activity: {
    shift_emp: {
      id: "sft-emp-5",
      branch: dummyBranchList[0],
      start: new Date('2025-07-01T08:00:00.000Z'),
      end: null,
      notes: 'Dapur shift',
      meta: {
        created_at: new Date('2025-06-30T08:00:00.000Z'),
        created_by: {
          id: 'emp-004',
          name: 'Budi', 
          role: 'dapur', 
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-004',
          name: 'Budi', 
          role: 'dapur', 
        },
      },
    },
    shift_op: {
      id: "sft-kch-1",
      branch: dummyBranchList[0],
      start: new Date('2025-07-03T16:00:00.000Z'),
      end: null,
      quantity_menu: dummyMenuSale.map(item => ({
        id: item.id,
        name: item.name,
        initial: 100,
        final: item.threshold
      })),
      total_restock_request: 0,  // Contoh restock request
      request_approved: 0,
      request_rejected: 0,
      total_order: 100,  // Total order
      completed_order: 90,
      canceled_order: 10,  // Canceled order
      notes: "test",
      meta: {
        created_at: new Date('2025-07-03T16:00:00.000Z'),
        created_by: {
          id: 'emp-004',
          name: 'Budi', 
          role: 'dapur', 
        },
        updated_at: new Date('2025-07-03T16:00:00.000Z'),
        last_updated_by: {
          id: 'emp-004',
          name: 'Budi', 
          role: 'dapur', 
        },
      },
    },
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: dummyBranchList[0]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-005',
  uid: 'emp-005',
  name: 'Siti', 
  role: 'admin', 
  email: 'siti.kitchen@example.com',
  assigned_branch: dummyBranchList[0],
  activity: {
    shift_emp: null,
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-005',
  uid: 'emp-005',
  name: 'Siti', 
  role: 'gudang', 
  email: 'siti.kitchen@example.com',
  assigned_branch: dummyBranchList[0],
  activity: {
    shift_emp: null,
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-006',
  uid: 'emp-006',
  name: 'Joko', 
  role: 'pemilik', 
  email: 'joko.kitchen@example.com',
  assigned_branch: dummyBranchList[1],
  activity: {
    shift_emp: null,
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-007',
  uid: 'emp-007',
  name: 'Dian', 
  role: 'kasir', 
  email: 'dian.kitchen@example.com',
  assigned_branch: dummyBranchList[1],
  activity: {
    shift_emp: {
      id: "sft-emp-6",
      branch: dummyBranchList[1],
      start: new Date('2025-07-03T14:00:00.000Z'),
      end: null,  // Shift belum berakhir karena aktif
      notes: 'Kasir shift',
      meta: {
        created_at: new Date('2025-07-01T14:00:00.000Z'),
        created_by: {
          id: 'emp-007',
          name: 'Dian', 
          role: 'kasir', 
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-007',
          name: 'Dian', 
          role: 'kasir', 
        },
      },
    },
    shift_op: {
      id: "sft-csr-2",
      branch: dummyBranchList[1],
      start: new Date('2025-07-03T16:00:00.000Z'),
      end: null,
      notes: 'Shift full',
      initial_cash: 100000,
      cash_in: [
        {
          id: 'cash-in-002',
          subject: "Pembayaran Cash",
          amount: 2000000,
        },
      ],
      cash_out: [
        {
          id: 'cash-out-002',
          subject: "Belanja Tempe",
          quantity: 3,
          unit: "pack",
          unit_price: 10000,
        },
        {
          id: 'cash-out-003',
          subject: "Belanja Le Mineral",
          quantity: 2,
          unit: "pack",
          unit_price: 52000,
        },
      ],
      cash_payment: 2000000,
      digital_payment: 0,
      digital_payment_refund: 0,
      cash_payment_refund: 0,
      total_expense: 134000,
      income: 2000000,
      net_income: 1866000,
      actual_cash: 100000 + 2000000 - 134000,
      total_order: 150,  // Total order
      completed_order: 135,
      canceled_order: 15,  // Canceled order
      meta: {
        created_at: new Date('2025-07-01T10:00:00.000Z'),
        created_by: {
          id: 'emp-007',
          name: 'Dian', 
          role: 'kasir', 
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-007',
          name: 'Dian', 
          role: 'kasir', 
        },
      },
    },
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,
    branch: dummyBranchList[1]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-008',
  uid: 'emp-008',
  name: 'Fajar', 
  role: 'dapur', 
  email: 'fajar.kitchen@example.com',
  assigned_branch: dummyBranchList[1],
  activity: {
    shift_emp: {
      id: "sft-emp-7",
      branch: dummyBranchList[1],
      start: new Date('2025-07-03T15:00:00.000Z'),
      end: null,  // Shift belum berakhir karena aktif
      notes: 'Dapur shift',
      meta: {
        created_at: new Date('2025-07-01T15:00:00.000Z'),
        created_by: {
          id: 'emp-008',
          name: 'Fajar', 
          role: 'dapur', 
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-008',
          name: 'Fajar', 
          role: 'dapur', 
        },
      },
    },
    shift_op: {
      id: "sft-kch-2",
      branch: dummyBranchList[1],
      start: new Date('2025-07-03T16:00:00.000Z'),
      end: new Date('2025-07-04T00:00:00.000Z'),
      quantity_menu: dummyMenuSale.map(item => ({
        id: item.id,
        name: item.name,
        initial: 100,
        final: item.threshold
      })),
      total_restock_request: 3,  // Contoh restock request
      request_approved: 3,
      request_rejected: 0,
      total_order: 150,  // Total order
      completed_order: 135,
      canceled_order: 15,  // Canceled order
      notes: null,
      meta: {
        created_at: new Date('2025-07-03T16:00:00.000Z'),
        created_by: {
          id: 'emp-008',
          name: 'Fajar', 
          role: 'dapur', 
        },
        updated_at: new Date('2025-07-04T00:00:00.000Z'),
        last_updated_by: {
          id: 'emp-008',
          name: 'Fajar', 
          role: 'dapur', 
        },
      },
    },
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-009',
  uid: 'emp-009',
  name: 'Tono', 
  role: 'dapur', 
  email: 'tono.kitchen@example.com',
  assigned_branch: dummyBranchList[1],
  activity: {
    shift_emp: {
      id: "sft-emp-8",
      branch: dummyBranchList[1],
      start: new Date('2025-07-03T16:00:00.000Z'),
      end: null,  // Shift belum berakhir karena aktif
      notes: 'Dapur shift',
      meta: {
        created_at: new Date('2025-07-01T16:00:00.000Z'),
        created_by: {
          id: 'emp-009',
          name: 'Tono', 
          role: 'dapur', 
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-009',
          name: 'Tono', 
          role: 'dapur', 
        },
      },
    },
    shift_op: {
      id: "sft-kch-1",
      branch: dummyBranchList[0],
      start: new Date('2025-07-03T16:00:00.000Z'),
      end: null,
      quantity_menu: dummyMenuSale.map(item => ({
        id: item.id,
        name: item.name,
        initial: 100,
        final: item.threshold
      })),
      total_restock_request: 0,  // Contoh restock request
      request_approved: 0,
      request_rejected: 0,
      total_order: 100,  // Total order
      completed_order: 90,
      canceled_order: 10,  // Canceled order
      notes: "test",
      meta: {
        created_at: new Date('2025-07-03T16:00:00.000Z'),
        created_by: {
          id: 'emp-004',
          name: 'Budi', 
          role: 'dapur', 
        },
        updated_at: new Date('2025-07-03T16:00:00.000Z'),
        last_updated_by: {
          id: 'emp-004',
          name: 'Budi', 
          role: 'dapur', 
        },
      },
    },
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-010',
  uid: 'emp-010',
  name: 'Ayu', 
  role: 'admin', 
  email: 'ayu.kitchen@example.com',
  assigned_branch: dummyBranchList[1],
  activity: {
    shift_emp: null,
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: dummyBranchList[1]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-010',
  uid: 'emp-010',
  name: 'Ayu', 
  role: 'gudang', 
  email: 'ayu.kitchen@example.com',
  assigned_branch: dummyBranchList[1],
  activity: {
    shift_emp: null,
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-011',
  uid: 'emp-011',
  name: 'Bagas', 
  role: 'pemilik', 
  email: 'bagas.kitchen@example.com',
  assigned_branch: dummyBranchList[2],
  activity: {
    shift_emp: null,
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-012',
  uid: 'emp-012',
  name: 'Lina', 
  role: 'kasir', 
  email: 'lina.kitchen@example.com',
  assigned_branch: dummyBranchList[2],
  activity: {
    shift_emp: null,
    shift_op: {
      id: "sft-csr-3",
      branch: dummyBranchList[2],
      start: new Date('2025-07-03T19:00:00.000Z'),
      end: new Date('2025-07-04T00:00:00.000Z'),
      notes: 'Shift setengah hari',
      initial_cash: 100000,
      cash_in: [
        {
          id: 'cash-in-003',
          subject: "Pembayaran Cash",
          amount: 2000000,
        },
      ],
      cash_out: [],
      cash_payment: 2000000,
      digital_payment: 0,
      digital_payment_refund: 0,
      cash_payment_refund: 0,
      total_expense: 0,
      income: 2000000,
      net_income: 2000000,
      actual_cash: 100000 + 2000000,
      total_order: 120,  // Total order
      completed_order: 115,
      canceled_order: 5,  // Canceled order
      meta: {
        created_at: new Date('2025-07-01T10:00:00.000Z'),
        created_by: {
          id: 'emp-012',
          name: 'Lina', 
          role: 'kasir', 
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-012',
          name: 'Lina', 
          role: 'kasir', 
        },
      },
    },
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: dummyBranchList[2]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-013',
  uid: 'emp-013',
  name: 'Rizky', 
  role: 'dapur', 
  email: 'rizky.kitchen@example.com',
  assigned_branch: dummyBranchList[2],
  activity: {
    shift_emp: null,
    shift_op: {
      id: "sft-kch-3",
      branch: dummyBranchList[2],
      start: new Date('2025-07-03T16:00:00.000Z'),
      end: null,
      quantity_menu: dummyMenuSale.map(item => ({
        id: item.id,
        name: item.name,
        initial: 100,
        final: item.threshold
      })),
      total_restock_request: 2,  // Contoh restock request
      request_approved: 1,
      request_rejected: 1,
      total_order: 120,  // Total order
      completed_order: 115,
      canceled_order: 5,  // Canceled order
      notes: null,
      meta: {
        created_at: new Date('2025-07-03T16:00:00.000Z'),
        created_by: {
          id: 'emp-013',
          name: 'Rizky', 
          role: 'dapur', 
        },
        updated_at: new Date('2025-07-03T16:00:00.000Z'),
        last_updated_by: {
          id: 'emp-013',
          name: 'Rizky', 
          role: 'dapur', 
        },
      },
    },
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-014',
  uid: 'emp-014',
  name: 'Anton', 
  role: 'dapur', 
  email: 'anton.kitchen@example.com',
  assigned_branch: dummyBranchList[2],
  activity: {
    shift_emp: null,
    shift_op: {
      id: "sft-kch-3",
      branch: dummyBranchList[2],
      start: new Date('2025-07-03T16:00:00.000Z'),
      end: null,
      quantity_menu: dummyMenuSale.map(item => ({
        id: item.id,
        name: item.name,
        initial: 100,
        final: item.threshold
      })),
      total_restock_request: 2,  // Contoh restock request
      request_approved: 1,
      request_rejected: 1,
      total_order: 120,  // Total order
      completed_order: 115,
      canceled_order: 5,  // Canceled order
      notes: null,
      meta: {
        created_at: new Date('2025-07-03T16:00:00.000Z'),
        created_by: {
          id: 'emp-013',
          name: 'Rizky', 
          role: 'dapur', 
        },
        updated_at: new Date('2025-07-03T16:00:00.000Z'),
        last_updated_by: {
          id: 'emp-013',
          name: 'Rizky', 
          role: 'dapur', 
        },
      },
    },
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-015',
  uid: 'emp-015',
  name: 'Sari', 
  role: 'admin', 
  email: 'sari.kitchen@example.com',
  assigned_branch: dummyBranchList[2],
  activity: {
    shift_emp: null,
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-022',
  uid: 'emp-022',
  name: 'Sari', 
  role: 'gudang', 
  email: 'sari.kitchen@example.com',
  assigned_branch: dummyBranchList[2],
  activity: {
    shift_emp: null,
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-016',
  uid: 'emp-016',
  name: 'Hadi', 
  role: 'pemilik', 
  email: 'hadi.kitchen@example.com',
  assigned_branch: dummyBranchList[3],
  activity: {
    shift_emp: null,
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-017',
  uid: 'emp-017',
  name: 'Yuni', 
  role: 'kasir', 
  email: 'yuni.kitchen@example.com',
  assigned_branch: dummyBranchList[3],
  activity: {
    shift_emp: {
      id: "sft-emp-11",
      branch: dummyBranchList[3],
      start: new Date('2025-07-03T18:00:00.000Z'),
      end: null,  // Shift belum berakhir karena aktif
      notes: 'Kasir shift',
      meta: {
        created_at: new Date('2025-07-01T18:00:00.000Z'),
        created_by: {
          id: 'emp-017',
          name: 'Yuni', 
          role: 'kasir', 
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-017',
          name: 'Yuni', 
          role: 'kasir', 
        },
      },
    },
    shift_op: {
      id: "sft-csr-4",
      branch: dummyBranchList[3],
      start: new Date('2025-07-03T19:00:00.000Z'),
      end: new Date('2025-07-04T00:00:00.000Z'),
      notes: 'Shift setengah hari',
      initial_cash: 100000,
      cash_in: [
        {
          id: 'cash-in-004',
          subject: "Pembayaran Cash",
          amount: 500000,
        },
      ],
      cash_out: [
        {
          id: 'cash-out-004',
          subject: "Belanja Kertas Nasi",
          quantity: 3,
          unit: "pack",
          unit_price: 10000,
        }
      ],
      cash_payment: 500000,
      digital_payment: 0,
      digital_payment_refund: 0,
      cash_payment_refund: 0,
      total_expense: 30000,
      income: 500000,
      net_income: 470000,
      actual_cash: 100000 + 500000 - 30000,
      total_order: 80,  // Total order
      completed_order: 72,
      canceled_order: 8,  // Canceled order
      meta: {
        created_at: new Date('2025-07-01T10:00:00.000Z'),
        created_by: {
          id: 'emp-017',
          name: 'Yuni', 
          role: 'kasir', 
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-017',
          name: 'Yuni', 
          role: 'kasir', 
        },
      },
    },
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: dummyBranchList[3]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-018',
  uid: 'emp-018',
  name: 'Gilang', 
  role: 'dapur', 
  email: 'gilang.kitchen@example.com',
  assigned_branch: dummyBranchList[3],
  activity: {
    shift_emp: null,
    shift_op: {
      id: "sft-kch-4",
      branch: dummyBranchList[3],
      start: new Date('2025-07-03T16:00:00.000Z'),
      end: new Date('2025-07-04T00:00:00.000Z'),
      quantity_menu: dummyMenuSale.map(item => ({
        id: item.id,
        name: item.name,
        initial: 100,
        final: item.threshold
      })),
      total_restock_request: 0,  // Contoh restock request
      request_approved: 0,
      request_rejected: 0,
      total_order: 80,  // Total order
      completed_order: 72,
      canceled_order: 8,  // Canceled order
      notes: null,
      meta: {
        created_at: new Date('2025-07-03T16:00:00.000Z'),
        created_by: {
          id: 'emp-018',
          name: 'Gilang', 
          role: 'dapur', 
        },
        updated_at: new Date('2025-07-04T00:00:00.000Z'),
        last_updated_by: {
          id: 'emp-018',
          name: 'Gilang', 
          role: 'dapur', 
        },
      },
    },
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-019',
  uid: 'emp-019',
  name: 'Nita', 
  role: 'dapur', 
  email: 'nita.kitchen@example.com',
  assigned_branch: dummyBranchList[3],
  activity: {
    shift_emp: null,
    shift_op: {
      id: "sft-kch-4",
      branch: dummyBranchList[3],
      start: new Date('2025-07-03T16:00:00.000Z'),
      end: new Date('2025-07-04T00:00:00.000Z'),
      quantity_menu: dummyMenuSale.map(item => ({
        id: item.id,
        name: item.name,
        initial: 100,
        final: item.threshold
      })),
      total_restock_request: 0,  // Contoh restock request
      request_approved: 0,
      request_rejected: 0,
      total_order: 80,  // Total order
      completed_order: 72,
      canceled_order: 8,  // Canceled order
      notes: null,
      meta: {
        created_at: new Date('2025-07-03T16:00:00.000Z'),
        created_by: {
          id: 'emp-018',
          name: 'Gilang', 
          role: 'dapur', 
        },
        updated_at: new Date('2025-07-04T00:00:00.000Z'),
        last_updated_by: {
          id: 'emp-018',
          name: 'Gilang', 
          role: 'dapur', 
        },
      },
    },
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-020',
  uid: 'emp-020',
  name: 'Eko', 
  role: 'admin', 
  email: 'eko.kitchen@example.com',
  assigned_branch: dummyBranchList[3],
  activity: {
    shift_emp: null,
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-020',
  uid: 'emp-020',
  name: 'Eko', 
  role: 'gudang', 
  email: 'eko.kitchen@example.com',
  assigned_branch: dummyBranchList[3],
  activity: {
    shift_emp: null,
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-021',
  uid: 'emp-021',
  name: 'Bambang', 
  role: 'pemilik', 
  email: 'bambang.kitchen@example.com',
  assigned_branch: dummyBranchList[3],
  activity: {
    shift_emp: {
      id: "sft-emp-10",
      branch: dummyBranchList[3],
      start: new Date('2025-07-01T08:00:00.000Z'),
      end: new Date('2025-07-01T16:00:00.000Z'),  // Shift berakhir
      notes: 'Pemilik shift',
      meta: {
        created_at: new Date('2025-06-30T08:00:00.000Z'),
        created_by: {
          id: 'emp-021',
          name: 'Bambang', 
          role: 'pemilik', 
        },
        updated_at: new Date(),
        last_updated_by: {
          id: 'emp-021',
          name: 'Bambang', 
          role: 'pemilik', 
        },
      },
    },
    shift_op: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
}]

export default dummyEmployee