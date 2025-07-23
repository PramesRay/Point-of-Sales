import type { ShiftCashier } from "@/types/shift";
import dummyEmployee from "../common/employee/dummyEmployee";
import dummyBranchList from "../common/branch/dummyBranchList";

export const dummyShiftCashier: ShiftCashier[] = [
  {
    id: "sft-csr-1",
    branch: dummyBranchList[0],
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
        id: dummyEmployee[6].id,
        name: dummyEmployee[6].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[6].id,
        name: dummyEmployee[6].name
      },
    },
  },
  {
    id: "sft-csr-2",
    branch: dummyBranchList[1],
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
        id: dummyEmployee[6].id,
        name: dummyEmployee[6].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[6].id,
        name: dummyEmployee[6].name
      },
    },
  },
  {
    id: "sft-csr-3",
    branch: dummyBranchList[2],
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
        id: dummyEmployee[11].id,
        name: dummyEmployee[11].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[11].id,
        name: dummyEmployee[11].name
      },
    },
  },
  {
    id: "sft-csr-4",
    branch: dummyBranchList[3],
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
        id: dummyEmployee[3].id,
        name: dummyEmployee[3].name
      },
      updated_at: new Date(),
      last_updated_by: {
        id: dummyEmployee[3].id,
        name: dummyEmployee[3].name
      },
    },
  },
]