import type { FundRequest } from '@/types/finance';
import { dummyInventoryItems } from '../inventory/dummyInventoryItems';
import dummyBranchList from '../common/branch/dummyBranchList';
import type { InventoryItem } from '@/types/inventory';

// Helper fungsi hitung total
function calcAmount(items: { item: InventoryItem; quantity: number }[]) {
  return items.reduce((acc, curr) => {
    if (!curr.item.purchase_price || !curr.item.unit) return acc;
    
    const price = curr.item.purchase_price;

    if (!price) return acc; // jika harga unit tidak ditemukan, skip
    
    return acc + price * curr.quantity;
  }, 0);
}


const dummyFundRequestData: FundRequest[] = [
  {
    id: 'fun-req/001',
    subject: 'Restock Bahan Pokok',
    notes: 'Butuh beras, santan, dan daun salam untuk stok mingguan',
    employee: { id: 'emp-001', name: 'Khodijah' },
    items: [
      { item: { id: dummyInventoryItems[0].id, name: dummyInventoryItems[0].name, purchase_price: dummyInventoryItems[0].purchase_price, unit: dummyInventoryItems[0].unit }, quantity: 50, status: 'Pending' },
      { item: { id: dummyInventoryItems[1].id, name: dummyInventoryItems[1].name, purchase_price: dummyInventoryItems[1].purchase_price, unit: dummyInventoryItems[1].unit }, quantity: 20, status: 'Pending' },
      { item: { id: dummyInventoryItems[2].id, name: dummyInventoryItems[2].name, purchase_price: dummyInventoryItems[2].purchase_price, unit: dummyInventoryItems[2].unit }, quantity: 100, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[0], quantity: 50 },
      { item: dummyInventoryItems[1], quantity: 20 },
      { item: dummyInventoryItems[2], quantity: 100 },
    ]),
    status: 'Pending',
    branch: dummyBranchList[0],
    approvement: { by: [{ id: '', name: '' }], note: '' },
    meta: { created_at: new Date('2023-05-01'), updated_at: new Date('2023-05-01') },
  },
  {
    id: 'fun-req/002',
    subject: 'Stok Pelengkap',
    notes: 'Tambah sambal kacang, timun, dan kerupuk',
    employee: { id: 'emp-002', name: 'Teddy' },
    items: [
      { item: { id: dummyInventoryItems[11].id, name: dummyInventoryItems[11].name, purchase_price: dummyInventoryItems[11].purchase_price, unit: dummyInventoryItems[11].unit }, quantity: 10, status: 'Disetujui' },
      { item: { id: dummyInventoryItems[12].id, name: dummyInventoryItems[12].name, purchase_price: dummyInventoryItems[12].purchase_price, unit: dummyInventoryItems[12].unit }, quantity: 30, status: 'Pending' },
      { item: { id: dummyInventoryItems[13].id, name: dummyInventoryItems[13].name, purchase_price: dummyInventoryItems[13].purchase_price, unit: dummyInventoryItems[13].unit }, quantity: 50, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[11], quantity: 10 },
      { item: dummyInventoryItems[12], quantity: 30 },
      { item: dummyInventoryItems[13], quantity: 50 },
    ]),
    status: 'Beberapa Disetujui',
    branch: dummyBranchList[0],
    approvement: { by: [{ id: 'mgr-002', name: 'Manajer Restoran 2' }], note: 'Sambal kacang sudah cukup' },
    meta: { created_at: new Date('2023-05-02'), updated_at: new Date('2023-05-04') },
  },
  {
    id: 'fun-req/003',
    subject: 'Lauk dan Bahan Tambahan',
    notes: 'Ayam potong dan telur untuk menu minggu ini',
    employee: { id: 'emp-003', name: 'Ozi' },
    items: [
      { item: { id: dummyInventoryItems[5].id, name: dummyInventoryItems[5].name, purchase_price: dummyInventoryItems[5].purchase_price, unit: dummyInventoryItems[5].unit }, quantity: 25, status: 'Disetujui' },
      { item: { id: dummyInventoryItems[6].id, name: dummyInventoryItems[6].name, purchase_price: dummyInventoryItems[6].purchase_price, unit: dummyInventoryItems[6].unit }, quantity: 60, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[5], quantity: 25 },
      { item: dummyInventoryItems[6], quantity: 60 },
    ]),
    status: 'Beberapa Disetujui',
    branch: dummyBranchList[0],
    approvement: { by: [{ id: 'mgr-001', name: 'Manajer Restoran 1' }], note: '' },
    meta: { created_at: new Date('2023-05-03'), updated_at: new Date('2023-05-03') },
  },
  {
    id: 'fun-req/004',
    subject: 'Stok Lauk dan Pelengkap',
    notes: 'Tempe, tahu, dan bawang merah goreng',
    employee: { id: 'emp-004', name: 'Ujang' },
    items: [
      { item: { id: dummyInventoryItems[7].id, name: dummyInventoryItems[7].name, purchase_price: dummyInventoryItems[7].purchase_price, unit: dummyInventoryItems[7].unit }, quantity: 40, status: 'Pending' },
      { item: { id: dummyInventoryItems[8].id, name: dummyInventoryItems[8].name, purchase_price: dummyInventoryItems[8].purchase_price, unit: dummyInventoryItems[8].unit }, quantity: 30, status: 'Pending' },
      { item: { id: dummyInventoryItems[10].id, name: dummyInventoryItems[10].name, purchase_price: dummyInventoryItems[10].purchase_price, unit: dummyInventoryItems[10].unit }, quantity: 10, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[7], quantity: 40 },
      { item: dummyInventoryItems[8], quantity: 30 },
      { item: dummyInventoryItems[10], quantity: 10 },
    ]),
    status: 'Pending',
    branch: dummyBranchList[0],
    approvement: { by: [{ id: '', name: '' }], note: '' },
    meta: { created_at: new Date('2023-05-04'), updated_at: new Date('2023-05-04') },
  },
  {
    id: 'fun-req/005',
    subject: 'Bumbu dan Lainnya',
    notes: 'Garam dan acar untuk stok dapur',
    employee: { id: 'emp-005', name: 'Silmi' },
    items: [
      { item: { id: dummyInventoryItems[4].id, name: dummyInventoryItems[4].name, purchase_price: dummyInventoryItems[4].purchase_price, unit: dummyInventoryItems[4].unit }, quantity: 20, status: 'Pending' },
      { item: { id: dummyInventoryItems[14].id, name: dummyInventoryItems[14].name, purchase_price: dummyInventoryItems[14].purchase_price, unit: dummyInventoryItems[14].unit }, quantity: 15, status: 'Disetujui' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[4], quantity: 20 },
      { item: dummyInventoryItems[14], quantity: 15 },
    ]),
    status: 'Beberapa Disetujui',
    branch: dummyBranchList[0],
    approvement: { by: [{ id: 'mgr-002', name: 'Manajer Restoran 2' }], note: 'Acar sudah cukup' },
    meta: { created_at: new Date('2023-05-05'), updated_at: new Date('2023-05-05') },
  },
  {
    id: 'fun-req/006',
    subject: 'Penambahan Stok Bahan Pokok',
    notes: 'Beras dan santan mulai menipis',
    employee: { id: 'emp-006', name: 'Rina' },
    items: [
      { item: { id: dummyInventoryItems[0].id, name: dummyInventoryItems[0].name, purchase_price: dummyInventoryItems[0].purchase_price, unit: dummyInventoryItems[0].unit }, quantity: 60, status: 'Pending' },
      { item: { id: dummyInventoryItems[1].id, name: dummyInventoryItems[1].name, purchase_price: dummyInventoryItems[1].purchase_price, unit: dummyInventoryItems[1].unit }, quantity: 25, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[0], quantity: 60 },
      { item: dummyInventoryItems[1], quantity: 25 },
    ]),
    status: 'Pending',
    branch: dummyBranchList[1],
    approvement: { by: [{ id: '', name: '' }], note: '' },
    meta: { created_at: new Date('2023-05-06'), updated_at: new Date('2023-05-06') },
  },
  {
    id: 'fun-req/007',
    subject: 'Stok Lauk dan Sayur',
    notes: 'Ayam dan tempe untuk menu harian',
    employee: { id: 'emp-007', name: 'Dian' },
    items: [
      { item: { id: dummyInventoryItems[5].id, name: dummyInventoryItems[5].name, purchase_price: dummyInventoryItems[5].purchase_price, unit: dummyInventoryItems[5].unit }, quantity: 30, status: 'Pending' },
      { item: { id: dummyInventoryItems[7].id, name: dummyInventoryItems[7].name, purchase_price: dummyInventoryItems[7].purchase_price, unit: dummyInventoryItems[7].unit }, quantity: 50, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[5], quantity: 30 },
      { item: dummyInventoryItems[7], quantity: 50 },
    ]),
    status: 'Pending',
    branch: dummyBranchList[1],
    approvement: { by: [{ id: '', name: '' }], note: '' },
    meta: { created_at: new Date('2023-05-07'), updated_at: new Date('2023-05-07') },
  },
  {
    id: 'fun-req/008',
    subject: 'Penambahan Bumbu dan Pelengkap',
    notes: 'Garam dan sambal kacang habis',
    employee: { id: 'emp-008', name: 'Bagas' },
    items: [
      { item: { id: dummyInventoryItems[4].id, name: dummyInventoryItems[4].name, purchase_price: dummyInventoryItems[4].purchase_price, unit: dummyInventoryItems[4].unit }, quantity: 15, status: 'Pending' },
      { item: { id: dummyInventoryItems[11].id, name: dummyInventoryItems[11].name, purchase_price: dummyInventoryItems[11].purchase_price, unit: dummyInventoryItems[11].unit }, quantity: 20, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[4], quantity: 15 },
      { item: dummyInventoryItems[11], quantity: 20 },
    ]),
    status: 'Pending',
    branch: dummyBranchList[1],
    approvement: { by: [{ id: '', name: '' }], note: '' },
    meta: { created_at: new Date('2023-05-08'), updated_at: new Date('2023-05-08') },
  },
  {
    id: 'fun-req/009',
    subject: 'Bahan Pokok dan Pelengkap',
    notes: 'Beras, daun salam dan kerupuk stok menipis',
    employee: { id: 'emp-009', name: 'Fajar' },
    items: [
      { item: { id: dummyInventoryItems[0].id, name: dummyInventoryItems[0].name, purchase_price: dummyInventoryItems[0].purchase_price, unit: dummyInventoryItems[0].unit }, quantity: 40, status: 'Pending' },
      { item: { id: dummyInventoryItems[2].id, name: dummyInventoryItems[2].name, purchase_price: dummyInventoryItems[2].purchase_price, unit: dummyInventoryItems[2].unit }, quantity: 80, status: 'Pending' },
      { item: { id: dummyInventoryItems[13].id, name: dummyInventoryItems[13].name, purchase_price: dummyInventoryItems[13].purchase_price, unit: dummyInventoryItems[13].unit }, quantity: 30, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[0], quantity: 40 },
      { item: dummyInventoryItems[2], quantity: 80 },
      { item: dummyInventoryItems[13], quantity: 30 },
    ]),
    status: 'Pending',
    branch: dummyBranchList[1],
    approvement: { by: [{ id: '', name: '' }], note: '' },
    meta: { created_at: new Date('2023-05-09'), updated_at: new Date('2023-05-09') },
  },
  {
    id: 'fun-req/010',
    subject: 'Tambah Stok Lauk',
    notes: 'Telur ayam dan ikan asin untuk persiapan menu',
    employee: { id: 'emp-010', name: 'Ayu' },
    items: [
      { item: { id: dummyInventoryItems[6].id, name: dummyInventoryItems[6].name, purchase_price: dummyInventoryItems[6].purchase_price, unit: dummyInventoryItems[6].unit }, quantity: 70, status: 'Pending' },
      { item: { id: dummyInventoryItems[9].id, name: dummyInventoryItems[9].name, purchase_price: dummyInventoryItems[9].purchase_price, unit: dummyInventoryItems[9].unit }, quantity: 10, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[6], quantity: 70 },
      { item: dummyInventoryItems[9], quantity: 10 },
    ]),
    status: 'Pending',
    branch: dummyBranchList[1],
    approvement: { by: [{ id: '', name: '' }], note: '' },
    meta: { created_at: new Date('2023-05-10'), updated_at: new Date('2023-05-10') },
  }
];

export default dummyFundRequestData;