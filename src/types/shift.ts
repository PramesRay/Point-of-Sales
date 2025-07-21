import type { IdName } from "./common";
import type { Meta } from "./meta";

export interface Shift {
  id: string;
  employee: IdName;
  branch: IdName;
  start: Date;
  end: Date | null;
  notes: string | null;
  meta: Pick<Meta, 'updated_at'>;
}

export interface ShiftCashier extends Shift {
  initial_cash: number;
  cash_in: {
    subject: string;
    amount: number;
  }[]
  cash_out: {
    subject: string;
    quantity: number;
    unit: string;
    unit_price: number;
  }[]
  cash_payment: number;
  digital_payment: number;

  digital_payment_refund: number;
  cash_payment_refund: number;
  
  total_expense: number;
  income: number; // otomatis dari total cash_payment dan digital_payment
  net_income: number; // otomatis dari sistem income dikurangi expense
  actual_cash: number;
}

export interface ShiftKitchen extends Shift {
  initial_menu: {
    id: string;
    quantity: number;
  }[]
  final_menu: {
    id: string;
    quantity: number;
  }[]
}

export interface StartShiftCashierPayload {
  branch_id: string;
  cash: number;
}

export type UpdateShiftCashierPayload = Omit<StartShiftCashierPayload, 'branch_id'> & {
  id: string;
  cash_in: {
    subject: string;
    amount: number;
  }[]
  cash_out: {
    subject: string;
    quantity: number;
    unit: string;
    unit_price: number;
  }[]
  notes: string | null;
  actual_cash: number;
}

export interface StartShiftKitchenPayload {
  branch_id: string;
  initial_menu: {
    id: string;
    quantity: number;
  }[]
}

export type UpdateShiftKitchenPayload = Omit<StartShiftKitchenPayload, 'branch_id'> & {
  id: string;
  final_menu: {
    id: string;
    quantity: number;
  }[]
  notes: string | null;
}