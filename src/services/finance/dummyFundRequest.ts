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
    id: 'fun-req-001',
    subject: 'Restock Bahan Pokok',
    description: 'Butuh beras, santan, dan daun salam untuk stok mingguan',
    shift_warehouse_id: 'sft-wh-1',
    items: [
      { item: { id: dummyInventoryItems[0].id, name: dummyInventoryItems[0].name, purchase_price: dummyInventoryItems[0].purchase_price, unit: dummyInventoryItems[0].unit }, quantity: 50, status: 'Ditolak' },
      { item: { id: dummyInventoryItems[1].id, name: dummyInventoryItems[1].name, purchase_price: dummyInventoryItems[1].purchase_price, unit: dummyInventoryItems[1].unit }, quantity: 20, status: 'Ditolak' },
      { item: { id: dummyInventoryItems[2].id, name: dummyInventoryItems[2].name, purchase_price: dummyInventoryItems[2].purchase_price, unit: dummyInventoryItems[2].unit }, quantity: 100, status: 'Ditolak' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[0], quantity: 50 },
      { item: dummyInventoryItems[1], quantity: 20 },
      { item: dummyInventoryItems[2], quantity: 100 },
    ]),
    total_approved: 0,
    status: 'Ditolak',
    branch: dummyBranchList[0],
    approval_notes: '',
    meta: { 
      created_at: new Date('2023-05-01'), 
      created_by: { id: 'emp-001', name: 'Khodijah' },
      updated_at: new Date('2023-05-01'), 
      last_updated_by: { id: 'emp-001', name: 'Khodijah' },
    },
  },
  {
    id: 'fun-req-002',
    subject: 'Stok Pelengkap',
    description: 'Tambah sambal kacang, timun, dan kerupuk',
    shift_warehouse_id: 'sft-wh-1',
    items: [
      { item: { id: dummyInventoryItems[11].id, name: dummyInventoryItems[11].name, purchase_price: dummyInventoryItems[11].purchase_price, unit: dummyInventoryItems[11].unit }, quantity: 10, status: 'Disetujui' },
      { item: { id: dummyInventoryItems[12].id, name: dummyInventoryItems[12].name, purchase_price: dummyInventoryItems[12].purchase_price, unit: dummyInventoryItems[12].unit }, quantity: 30, status: 'Ditolak' },
      { item: { id: dummyInventoryItems[13].id, name: dummyInventoryItems[13].name, purchase_price: dummyInventoryItems[13].purchase_price, unit: dummyInventoryItems[13].unit }, quantity: 50, status: 'Ditolak' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[11], quantity: 10 },
      { item: dummyInventoryItems[12], quantity: 30 },
      { item: dummyInventoryItems[13], quantity: 50 },
    ]),
    total_approved: calcAmount([
      { item: dummyInventoryItems[11], quantity: 10 },
    ]),
    status: 'Beberapa Disetujui',
    branch: dummyBranchList[0],
    approval_notes: 'Sambal kacang sudah cukup',
    meta: { 
      created_at: new Date('2023-05-02'), 
      created_by: { id: 'emp-001', name: 'Khodijah' },
      updated_at: new Date('2023-05-04'),
      last_updated_by: { id: 'emp-001', name: 'Khodijah' },
    },
  },
  {
    id: 'fun-req-003',
    subject: 'Lauk dan Bahan Tambahan',
    description: 'Ayam potong dan telur untuk menu minggu ini',
    shift_warehouse_id: 'sft-wh-1',
    items: [
      { item: { id: dummyInventoryItems[5].id, name: dummyInventoryItems[5].name, purchase_price: dummyInventoryItems[5].purchase_price, unit: dummyInventoryItems[5].unit }, quantity: 25, status: 'Disetujui' },
      { item: { id: dummyInventoryItems[6].id, name: dummyInventoryItems[6].name, purchase_price: dummyInventoryItems[6].purchase_price, unit: dummyInventoryItems[6].unit }, quantity: 60, status: 'Ditolak' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[5], quantity: 25 },
      { item: dummyInventoryItems[6], quantity: 60 },
    ]),
    total_approved: calcAmount([
      { item: dummyInventoryItems[5], quantity: 25 },
    ]),
    status: 'Beberapa Disetujui',
    branch: dummyBranchList[0],
    approval_notes: '',
    meta: { 
      created_at: new Date('2023-05-03'), 
      created_by: { id: 'emp-001', name: 'Khodijah' },
      updated_at: new Date('2023-05-03'),
      last_updated_by: { id: 'emp-001', name: 'Khodijah' },
    },
  },
  {
    id: 'fun-req-004',
    subject: 'Stok Lauk dan Pelengkap',
    description: 'Tempe, tahu, dan bawang merah goreng',
    shift_warehouse_id: 'sft-wh-1',
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
    total_approved: null,
    status: 'Pending',
    branch: dummyBranchList[0],
    approval_notes: '',
    meta: { 
    created_at: new Date('2023-05-04'), 
    created_by: { id: 'emp-001', name: 'Khodijah' },
    updated_at: new Date('2023-05-04'),
    last_updated_by: { id: 'emp-001', name: 'Khodijah' },
    },
  },
  {
    id: 'fun-req-005',
    subject: 'Bumbu dan Lainnya',
    description: 'Garam dan acar untuk stok dapur',
    shift_warehouse_id: 'sft-wh-1',
    items: [
      { item: { id: dummyInventoryItems[4].id, name: dummyInventoryItems[4].name, purchase_price: dummyInventoryItems[4].purchase_price, unit: dummyInventoryItems[4].unit }, quantity: 20, status: 'Ditolak' },
      { item: { id: dummyInventoryItems[14].id, name: dummyInventoryItems[14].name, purchase_price: dummyInventoryItems[14].purchase_price, unit: dummyInventoryItems[14].unit }, quantity: 15, status: 'Disetujui' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[4], quantity: 20 },
      { item: dummyInventoryItems[14], quantity: 15 },
    ]),
    total_approved: calcAmount([
      { item: dummyInventoryItems[14], quantity: 15 },
    ]),
    status: 'Beberapa Disetujui',
    branch: dummyBranchList[0],
    approval_notes: 'Acar sudah cukup',
    meta: { 
    created_at: new Date('2023-05-05'), 
    created_by: { id: 'emp-001', name: 'Khodijah' },
    updated_at: new Date('2023-05-05'),
    last_updated_by: { id: 'emp-001', name: 'Khodijah' },
    },
  },
  {
    id: 'fun-req-006',
    subject: 'Penambahan Stok Bahan Pokok',
    description: 'Beras dan santan mulai menipis',
    shift_warehouse_id: 'sft-wh-1',
    items: [
      { item: { id: dummyInventoryItems[0].id, name: dummyInventoryItems[0].name, purchase_price: dummyInventoryItems[0].purchase_price, unit: dummyInventoryItems[0].unit }, quantity: 60, status: 'Pending' },
      { item: { id: dummyInventoryItems[1].id, name: dummyInventoryItems[1].name, purchase_price: dummyInventoryItems[1].purchase_price, unit: dummyInventoryItems[1].unit }, quantity: 25, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[0], quantity: 60 },
      { item: dummyInventoryItems[1], quantity: 25 },
    ]),
    total_approved: null,
    status: 'Pending',
    branch: dummyBranchList[1],
    approval_notes: '',
    meta: { 
    created_at: new Date('2023-05-06'), 
    created_by: { id: 'emp-001', name: 'Khodijah' },
    updated_at: new Date('2023-05-06'),
    last_updated_by: { id: 'emp-001', name: 'Khodijah' },
    },
  },
  {
    id: 'fun-req-007',
    subject: 'Stok Lauk dan Sayur',
    description: 'Ayam dan tempe untuk menu harian',
    shift_warehouse_id: 'sft-wh-1',
    items: [
      { item: { id: dummyInventoryItems[5].id, name: dummyInventoryItems[5].name, purchase_price: dummyInventoryItems[5].purchase_price, unit: dummyInventoryItems[5].unit }, quantity: 30, status: 'Pending' },
      { item: { id: dummyInventoryItems[7].id, name: dummyInventoryItems[7].name, purchase_price: dummyInventoryItems[7].purchase_price, unit: dummyInventoryItems[7].unit }, quantity: 50, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[5], quantity: 30 },
      { item: dummyInventoryItems[7], quantity: 50 },
    ]),
    total_approved: null,
    status: 'Pending',
    branch: dummyBranchList[1],
    approval_notes: '',
    meta: { 
    created_at: new Date('2023-05-07'), 
    created_by: { id: 'emp-001', name: 'Khodijah' },
    updated_at: new Date('2023-05-07'),
    last_updated_by: { id: 'emp-001', name: 'Khodijah' },
    },
  },
  {
    id: 'fun-req-008',
    subject: 'Penambahan Bumbu dan Pelengkap',
    description: 'Garam dan sambal kacang habis',
    shift_warehouse_id: 'sft-wh-1',
    items: [
      { item: { id: dummyInventoryItems[4].id, name: dummyInventoryItems[4].name, purchase_price: dummyInventoryItems[4].purchase_price, unit: dummyInventoryItems[4].unit }, quantity: 15, status: 'Pending' },
      { item: { id: dummyInventoryItems[11].id, name: dummyInventoryItems[11].name, purchase_price: dummyInventoryItems[11].purchase_price, unit: dummyInventoryItems[11].unit }, quantity: 20, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[4], quantity: 15 },
      { item: dummyInventoryItems[11], quantity: 20 },
    ]),
    total_approved: null,
    status: 'Pending',
    branch: dummyBranchList[1],
    approval_notes: '',
    meta: { 
    created_at: new Date('2023-05-08'), 
    created_by: { id: 'emp-001', name: 'Khodijah' },
    updated_at: new Date('2023-05-08'),
    last_updated_by: { id: 'emp-001', name: 'Khodijah' },
    },
  },
  {
    id: 'fun-req-009',
    subject: 'Bahan Pokok dan Pelengkap',
    description: 'Beras, daun salam dan kerupuk stok menipis',
    shift_warehouse_id: 'sft-wh-1',
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
    total_approved: null,
    status: 'Pending',
    branch: dummyBranchList[1],
    approval_notes: '',
    meta: { 
    created_at: new Date('2023-05-09'), 
    created_by: { id: 'emp-001', name: 'Khodijah' },
    updated_at: new Date('2023-05-09'),
    last_updated_by: { id: 'emp-001', name: 'Khodijah' },
    },
  },
  {
    id: 'fun-req-010',
    subject: 'Tambah Stok Lauk',
    description: 'Telur ayam dan ikan asin untuk persiapan menu',
    shift_warehouse_id: 'sft-wh-1',
    items: [
      { item: { id: dummyInventoryItems[6].id, name: dummyInventoryItems[6].name, purchase_price: dummyInventoryItems[6].purchase_price, unit: dummyInventoryItems[6].unit }, quantity: 70, status: 'Pending' },
      { item: { id: dummyInventoryItems[9].id, name: dummyInventoryItems[9].name, purchase_price: dummyInventoryItems[9].purchase_price, unit: dummyInventoryItems[9].unit }, quantity: 10, status: 'Pending' },
    ],
    amount: calcAmount([
      { item: dummyInventoryItems[6], quantity: 70 },
      { item: dummyInventoryItems[9], quantity: 10 },
    ]),
    total_approved: null,
    status: 'Pending',
    branch: dummyBranchList[1],
    approval_notes: '',
    meta: { 
    created_at: new Date('2023-05-10'), 
    created_by: { id: 'emp-001', name: 'Khodijah' },
    updated_at: new Date('2023-05-10'),
    last_updated_by: { id: 'emp-001', name: 'Khodijah' },
    },
  }
];

export default dummyFundRequestData;