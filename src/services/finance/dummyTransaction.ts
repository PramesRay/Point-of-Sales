import type { Branch } from '@/types/branch';
import type { Transaction } from '@/types/finance';

/**
 * Dummy transaction data per branch
 */
const dummyTransactionData: Transaction[] = [
    { name: 'Pelanggan', type: 'income', subject: 'Pemesanan Menu', price: 150000, date: new Date('2022-07-25'), branchId: 'branch-1', branchName: 'Restoran 1' },
    { name: 'Pelanggan', type: 'income', subject: 'Pemesanan Minuman', price:  75000, date: new Date('2022-07-25'), branchId: 'branch-1', branchName: 'Restoran 1' },
    { name: 'Pegawai', type: 'expense', subject: 'Belanja Stok', price: 500000, date: new Date('2022-07-24'), branchId: 'branch-1', branchName: 'Restoran 1' },
    { name: 'Pegawai', type: 'expense', subject: 'Pengadaan Peralatan', price: 200000, date: new Date('2022-07-23'), branchId: 'branch-1', branchName: 'Restoran 1' },
    { name: 'Pegawai', type: 'expense', subject: 'Lain-lain', price: 100000, date: new Date('2022-07-22'), branchId: 'branch-1', branchName: 'Restoran 1' },
    { name: 'Pelanggan', type: 'income', subject: 'Pemesanan Paket A', price: 180000, date: new Date('2022-07-26'), branchId: 'branch-2', branchName: 'Restoran 2' },
    { name: 'Pelanggan', type: 'income', subject: 'Pemesanan Paket B', price: 120000, date: new Date('2022-07-26'), branchId: 'branch-2', branchName: 'Restoran 2' },
    { name: 'Pegawai', type: 'expense', subject: 'Belanja Bahan Baku', price: 450000, date: new Date('2022-07-25'), branchId: 'branch-2', branchName: 'Restoran 2' },
    { name: 'Pegawai', type: 'expense', subject: 'Perbaikan Mesin', price: 250000, date: new Date('2022-07-24'), branchId: 'branch-2', branchName: 'Restoran 2' },
    { name: 'Pegawai', type: 'expense', subject: 'Lain-lain', price:  90000, date: new Date('2022-07-23'), branchId: 'branch-2', branchName: 'Restoran 2' },
    { name: 'Pelanggan', type: 'income', subject: 'Pemesanan Family Pack', price: 300000, date: new Date('2022-07-27'), branchId: 'branch-3', branchName: 'Restoran 3' },
    { name: 'Pelanggan', type: 'income', subject: 'Pemesanan Dessert', price:  50000, date: new Date('2022-07-27'), branchId: 'branch-3', branchName: 'Restoran 3' },
    { name: 'Pegawai', type: 'expense', subject: 'Belanja Stok', price: 520000, date: new Date('2022-07-26'), branchId: 'branch-3', branchName: 'Restoran 3' },
    { name: 'Pegawai', type: 'expense', subject: 'Transportasi', price: 150000, date: new Date('2022-07-25'), branchId: 'branch-3', branchName: 'Restoran 3' },
    { name: 'Pegawai', type: 'expense', subject: 'Lain-lain', price: 120000, date: new Date('2022-07-24'), branchId: 'branch-3', branchName: 'Restoran 3' },
    { name: 'Pelanggan', type: 'income', subject: 'Pemesanan ala Carte', price: 200000, date: new Date('2022-07-28'), branchId: 'branch-4', branchName: 'Restoran 4' },
    { name: 'Pelanggan', type: 'income', subject: 'Pemesanan Buffet', price: 500000, date: new Date('2022-07-28'), branchId: 'branch-4', branchName: 'Restoran 4' },
    { name: 'Pegawai', type: 'expense', subject: 'Belanja Stok', price: 480000, date: new Date('2022-07-27'), branchId: 'branch-4', branchName: 'Restoran 4' },
    { name: 'Pegawai', type: 'expense', subject: 'Perawatan Gudang', price: 220000, date: new Date('2022-07-26'), branchId: 'branch-4', branchName: 'Restoran 4' },
    { name: 'Pegawai', type: 'expense', subject: 'Lain-lain', price: 110000, date: new Date('2022-07-25'), branchId: 'branch-4', branchName: 'Restoran 4' }
];

export default dummyTransactionData;