import type { ShiftCashier } from "@/types/shift";
import dummyEmployee from "../common/employee/dummyEmployee";
import dummyBranchList from "../common/branch/dummyBranchList";

export const dummyShiftCashier: ShiftCashier[] = [
  {
    id: "sft-csr-1",
    employee: dummyEmployee[6],
    branch: dummyBranchList[0],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    notes: null,
    initial_cash: 100000,
    cash_in: [],
    cash_out: [
      {
        subject: "Belanja Kertas Nasi",
        quantity: 3,
        unit: "pack",
        unit_price: 10000,
        amount: 30000,
      }
    ],
    total_expense: 30000,
    income: 500000,
    net_income: 470000,
    meta: {
      updated_at: new Date(),
    },
  },
  {
    id: "sft-csr-2",
    employee: dummyEmployee[6],
    branch: dummyBranchList[1],
    start: new Date('2025-07-03T16:00:00.000Z'),
    end: null,
    notes: 'Shift full',
    initial_cash: 100000,
    cash_in: [],
    cash_out: [
      {
        subject: "Belanja Tempe",
        quantity: 3,
        unit: "pack",
        unit_price: 10000,
        amount: 30000,
      },
      {
        subject: "Belanja Le Mineral",
        quantity: 2,
        unit: "pack",
        unit_price: 52000,
        amount: 104000,
      },
    ],
    total_expense: 134000,
    income: 2000000,
    net_income: 1866000,
    meta: {
      updated_at: new Date(),
    },
  },
  {
    id: "sft-csr-3",
    employee: dummyEmployee[11],
    branch: dummyBranchList[2],
    start: new Date('2025-07-03T19:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    notes: 'Shift setengah hari',
    initial_cash: 100000,
    cash_in: [],
    cash_out: [],
    total_expense: 0,
    income: 2000000,
    net_income: 2000000,
    meta: {
      updated_at: new Date(),
    },
  },
  {
    id: "sft-csr-4",
    employee: dummyEmployee[3],
    branch: dummyBranchList[3],
    start: new Date('2025-07-03T19:00:00.000Z'),
    end: new Date('2025-07-04T00:00:00.000Z'),
    notes: 'Shift setengah hari',
    initial_cash: 100000,
    cash_in: [],
    cash_out: [
      {
        subject: "Belanja Kertas Nasi",
        quantity: 3,
        unit: "pack",
        unit_price: 10000,
        amount: 30000,
      }
    ],
    total_expense: 30000,
    income: 500000,
    net_income: 470000,
    meta: {
      updated_at: new Date(),
    },
  },
]