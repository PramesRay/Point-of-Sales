import { extend } from "lodash";
import type { IdName } from "./common";
import type { Meta, MetaDetail } from "./meta";

export interface Shift {
  id: string;
  // employee: IdName;
  branch: IdName;
  start: Date;
  end: Date | null;
  notes: string | null;
  meta: MetaDetail;
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

  total_order: number;
  completed_order: number;
  canceled_order: number;
  
  total_expense: number;
  income: number; // otomatis dari total cash_payment dan digital_payment
  net_income: number; // otomatis dari sistem income dikurangi expense
  actual_cash: number;
}

export interface ShiftKitchen extends Shift {
  quantity_menu: {
    id: string;
    name: string;
    initial: number;
    final: number;
  }[]

  total_restock_request: number;
  request_approved: number;
  request_rejected: number;

  total_order: number;
  completed_order: number;
  canceled_order: number;
}

export type ShiftWarehouse = Omit<Shift, 'branch'> & {
  total_restock_request: number;
  request_approved: number;
  request_rejected: number;

  total_stock_movement: number;
  stock_movement_in: number;
  stock_movement_out: number;
}

export interface UpdateShiftWarehousePayload {
  id: string;
  notes: string | null;
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

export type UpdateShiftKitchenPayload = {
  id: string;
  final_menu: {
    id: string;
    quantity: number;
  }[]
  notes: string | null;
}