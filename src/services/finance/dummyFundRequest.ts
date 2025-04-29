import type { FundRequest } from '@/types/finance';

/**
 * Dummy fund request data per branch
 */
const dummyFundRequestData: FundRequest[] = [
  { request: 'Belanja Bahan',           name: 'Khodijah', price: 1500000, date: new Date('2022-07-25'), status: 'Pending', branchId: 'branch-1', branchName: 'Restoran 1' },
  { request: 'Belanja Kebutuhan Dapur', name: 'Teddy',    price:   50000, date: new Date('2022-07-24'), status: 'Pending', branchId: 'branch-1', branchName: 'Restoran 1' },
  { request: 'Print Banner',            name: 'Ozi',      price:   50000, date: new Date('2022-07-23'), status: 'Pending', branchId: 'branch-1', branchName: 'Restoran 1' },
  { request: 'Transportasi',            name: 'Ujang',    price:  200000, date: new Date('2022-07-22'), status: 'Ditolak', branchId: 'branch-1', branchName: 'Restoran 1' },
  { request: 'Belanja Kertas Resi',     name: 'Silmi',    price:   50000, date: new Date('2022-07-21'), status: 'Disetujui', branchId: 'branch-1', branchName: 'Restoran 1' },
  { request: 'Belanja Bahan',           name: 'Rina',     price: 1400000, date: new Date('2022-07-26'), status: 'Pending', branchId: 'branch-2', branchName: 'Restoran 2' },
  { request: 'Perbaikan Peralatan',     name: 'Dian',     price:  800000, date: new Date('2022-07-25'), status: 'Pending', branchId: 'branch-2', branchName: 'Restoran 2' },
  { request: 'Print Menu',              name: 'Bagas',    price:   30000, date: new Date('2022-07-24'), status: 'Disetujui', branchId: 'branch-2', branchName: 'Restoran 2' },
  { request: 'Transportasi',            name: 'Fajar',    price:  150000, date: new Date('2022-07-23'), status: 'Pending', branchId: 'branch-2', branchName: 'Restoran 2' },
  { request: 'Lain-lain',               name: 'Ayu',      price:   70000, date: new Date('2022-07-22'), status: 'Ditolak', branchId: 'branch-2', branchName: 'Restoran 2' },
  { request: 'Belanja Bahan',           name: 'Anton',    price: 1600000, date: new Date('2022-07-27'), status: 'Pending', branchId: 'branch-3', branchName: 'Restoran 3' },
  { request: 'Belanja Bumbu',           name: 'Lina',     price:   90000, date: new Date('2022-07-26'), status: 'Disetujui', branchId: 'branch-3', branchName: 'Restoran 3' },
  { request: 'Transportasi',            name: 'Hadi',     price:  120000, date: new Date('2022-07-25'), status: 'Pending', branchId: 'branch-3', branchName: 'Restoran 3' },
  { request: 'Cetak Struk',             name: 'Sari',     price:   40000, date: new Date('2022-07-24'), status: 'Disetujui', branchId: 'branch-3', branchName: 'Restoran 3' },
  { request: 'Lain-lain',               name: 'Rizky',    price:   60000, date: new Date('2022-07-23'), status: 'Ditolak', branchId: 'branch-3', branchName: 'Restoran 3' },
  { request: 'Belanja Bahan',           name: 'Yuni',     price: 1550000, date: new Date('2022-07-28'), status: 'Pending', branchId: 'branch-4', branchName: 'Restoran 4' },
  { request: 'Perbaikan Peralatan',     name: 'Gilang',   price:  950000, date: new Date('2022-07-27'), status: 'Pending', branchId: 'branch-4', branchName: 'Restoran 4' },
  { request: 'Cetak Brosur',            name: 'Nita',     price:   45000, date: new Date('2022-07-26'), status: 'Disetujui', branchId: 'branch-4', branchName: 'Restoran 4' },
  { request: 'Transportasi',            name: 'Eko',      price:  130000, date: new Date('2022-07-25'), status: 'Pending', branchId: 'branch-4', branchName: 'Restoran 4' },
  { request: 'Lain-lain',               name: 'Bambang',  price:   80000, date: new Date('2022-07-24'), status: 'Ditolak', branchId: 'branch-4', branchName: 'Restoran 4' }
];

export default dummyFundRequestData;
