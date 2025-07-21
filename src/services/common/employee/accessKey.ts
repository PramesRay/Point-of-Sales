export const accessMatrix = {
  Pemilik: [
    {
      feature: 'active-employee',
      label: 'Karyawan Aktif',
      actions: ['r:active-employee'],
    },
    {
      feature: 'timesheet',
      label: 'Timesheet',
      actions: ['r:timesheet', 'u:timesheet'],
    },
    {
      feature: 'reservation',
      label: 'Reservasi',
      actions: ['c:reservation', 'r:reservation', 'u:reservation', 'd:reservation'],
    },
    {
      feature: 'branch',
      label: 'Cabang',
      actions: ['c:branch', 'r:branch', 'u:branch', 'd:branch'],
    },
    {
      feature: 'employee',
      label: 'Karyawan',
      actions: ['c:employee', 'r:employee', 'u:employee', 'd:employee'],
    },
  ],

  Bendahara: [
    {
      feature: 'finance-report',
      label: 'Laporan Keuangan',
      actions: ['r:total-all-income', 'r:total-income', 'r:total-order', 'r:total-expense'],
    },
    {
      feature: 'transaction',
      label: 'Transaksi',
      actions: ['c:transaction', 'r:transaction', 'u:transaction', 'd:transaction'],
    },
    {
      feature: 'fund-request',
      label: 'Permintaan Dana',
      actions: ['c:fund-request', 'r:fund-request', 'u:fund-request', 'd:fund-request'],
    },
  ],

  Gudang: [
    {
      feature: 'active-stock-request',
      label: 'Permintaan Stok Aktif',
      actions: ['r:active-stock-request'],
    },
    {
      feature: 'stock-request',
      label: 'Permintaan Stok',
      actions: ['c:stock-request', 'r:stock-request', 'u:stock-request', 'd:stock-request'],
    },
    {
      feature: 'stock',
      label: 'Stok',
      actions: ['c:stock', 'r:stock', 'u:stock', 'd:stock'],
    },
    {
      feature: 'stock-category',
      label: 'Kategori Stok',
      actions: ['c:stock-category', 'r:stock-category', 'u:stock-category', 'd:stock-category'],
    },
    {
      feature: 'stock-movement',
      label: 'Pergerakan Stok',
      actions: ['c:stock-movement', 'r:stock-movement', 'u:stock-movement', 'd:stock-movement'],
    },
  ],

  Dapur: [
    {
      feature: 'active-order',
      label: 'Pesanan Aktif',
      actions: ['r:active-order'],
    },
    {
      feature: 'order',
      label: 'Pesanan',
      actions: ['c:order', 'u:order', 'd:order'],
    },
    {
      feature: 'order-que',
      label: 'Antrian Pesanan',
      actions: ['r:order-que'],
    },
    {
      feature: 'order-history',
      label: 'Riwayat Pesanan',
      actions: ['r:order-history', 'u:order-history', 'd:order-history'],
    },
    {
      feature: 'menu',
      label: 'Menu',
      actions: ['c:menu', 'r:menu', 'u:menu', 'd:menu'],
    },
    {
      feature: 'menu-category',
      label: 'Kategori Menu',
      actions: ['c:menu-category', 'r:menu-category', 'u:menu-category', 'd:menu-category'],
    },
  ],

  Global: [
    {
      feature: 'all',
      label: 'Akses Semua',
      actions: ['all'],
    },
  ],
}