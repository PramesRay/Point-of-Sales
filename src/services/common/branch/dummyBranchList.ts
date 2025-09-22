import type { Branch } from "@/types/branch";
import dummyEmployee from "../employee/dummyEmployee";
import { dummyMenuSale } from "@/services/menu/dummyMenuSale";

const dummyBranchList: Branch[] = [
  {
    id: 'branch-1',
    name: 'Restoran 1',
    operational: {
      activity: {
        shift_cashier: {
          id: "sft-csr-1",
          start: new Date('2025-07-03T16:00:00.000Z'),
          end: null,
          notes: null,
          initial_cash: 100000,
          cash_in: [
            {
              subject: "Pembayaran Cash",
              amount: 500000,
            },
          ],
          cash_out: [
            {
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
              role: 'Kasir', 
            },
            updated_at: new Date(),
            last_updated_by: {
              id: 'emp-002',
              name: 'Aldi', 
              role: 'Kasir', 
            },
          },
        },
        shift_kitchen: {
          id: "sft-kch-1",
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
              role: 'Dapur', 
            },
            updated_at: new Date('2025-07-03T16:00:00.000Z'),
            last_updated_by: {
              id: 'emp-004',
              name: 'Budi', 
              role: 'Dapur', 
            },
          },
        },
        is_active: true,
        last_active: new Date(),
      },
      open_time: '17:00',
      close_time: '00:00',
    },
    description: 'Restoran dengan menu khas Indonesia.',
    address: 'Jl. Contoh No. 1, Jakarta',
    contact: '081234567890',
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: 'emp-000',
        name: 'Hermanu',
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-000',
        name: 'Hermanu',
      },
    }
  },
  {
    id: 'branch-2',
    name: 'Restoran 2',
    operational: {
      activity: {
        shift_cashier: {
          id: "sft-csr-2",
          start: new Date('2025-07-03T16:00:00.000Z'),
          end: null,
          notes: 'Shift full',
          initial_cash: 100000,
          cash_in: [
            {
              subject: "Pembayaran Cash",
              amount: 2000000,
            },
          ],
          cash_out: [
            {
              subject: "Belanja Tempe",
              quantity: 3,
              unit: "pack",
              unit_price: 10000,
            },
            {
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
              role: 'Kasir', 
            },
            updated_at: new Date(),
            last_updated_by: {
              id: 'emp-007',
              name: 'Dian', 
              role: 'Kasir', 
            },
          },
        },
        shift_kitchen: {
          id: "sft-kch-2",
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
              role: 'Dapur', 
            },
            updated_at: new Date('2025-07-04T00:00:00.000Z'),
            last_updated_by: {
              id: 'emp-008',
              name: 'Fajar', 
              role: 'Dapur', 
            },
          },
        },
        is_active: false,
        last_active: new Date('2025-07-04T00:00:00.000Z'),
      },
      open_time: '17:00',
      close_time: '00:00',
    },
    description: 'Restoran dengan suasana santai dan nyaman.',
    address: 'Jl. Contoh No. 2, Jakarta',
    contact: '081223456789',
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: 'emp-000',
        name: 'Hermanu',
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-000',
        name: 'Hermanu',
      },
    }
  },
  {
    id: 'branch-3',
    name: 'Restoran 3',
    operational: {
      activity: {
        shift_cashier: {
          id: "sft-csr-3",
          start: new Date('2025-07-03T19:00:00.000Z'),
          end: new Date('2025-07-04T00:00:00.000Z'),
          notes: 'Shift setengah hari',
          initial_cash: 100000,
          cash_in: [
            {
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
              role: 'Kasir', 
            },
            updated_at: new Date(),
            last_updated_by: {
              id: 'emp-012',
              name: 'Lina', 
              role: 'Kasir', 
            },
          },
        },
        shift_kitchen: {
          id: "sft-kch-4",
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
              role: 'Dapur', 
            },
            updated_at: new Date('2025-07-04T00:00:00.000Z'),
            last_updated_by: {
              id: 'emp-018',
              name: 'Gilang', 
              role: 'Dapur', 
            },
          },
        },
        is_active: true,
        last_active: new Date(),
      },
      open_time: '05:30',
      close_time: '09:00',
    },
    description: 'Restoran dengan menu fusion internasional.',
    address: 'Jl. Contoh No. 3, Jakarta',
    contact: '081234561234',
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: 'emp-000',
        name: 'Hermanu',
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-000',
        name: 'Hermanu',
      },
    }
  },
  {
    id: 'branch-4',
    name: 'Restoran 4',
    operational: {
      activity: {
        shift_cashier: {
          id: "sft-csr-4",
          start: new Date('2025-07-03T19:00:00.000Z'),
          end: new Date('2025-07-04T00:00:00.000Z'),
          notes: 'Shift setengah hari',
          initial_cash: 100000,
          cash_in: [
            {
              subject: "Pembayaran Cash",
              amount: 500000,
            },
          ],
          cash_out: [
            {
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
              role: 'Kasir', 
            },
            updated_at: new Date(),
            last_updated_by: {
              id: 'emp-017',
              name: 'Yuni', 
              role: 'Kasir', 
            },
          },
        },
        shift_kitchen: {
          id: "sft-kch-3",
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
              role: 'Dapur', 
            },
            updated_at: new Date('2025-07-03T16:00:00.000Z'),
            last_updated_by: {
              id: 'emp-013',
              name: 'Rizky', 
              role: 'Dapur', 
            },
          },
        },
        is_active: false,
        last_active: new Date('2025-07-03T16:00:00.000Z'),
      },
      open_time: '05:30',
      close_time: '09:00',
    },
    description: 'Restoran dengan konsep taman outdoor.',
    address: 'Jl. Contoh No. 4, Jakarta',
    contact: '081245678901',
    meta: {
      created_at: new Date('2025-07-01T10:00:00.000Z'),
      created_by: {
        id: 'emp-000',
        name: 'Hermanu',
      },
      updated_at: new Date(),
      last_updated_by: {
        id: 'emp-000',
        name: 'Hermanu',
      },
    }
  },
];

export default dummyBranchList;
