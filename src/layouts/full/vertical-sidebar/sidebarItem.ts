import type { AccessKey, UserRole } from '@/types/employee';
import {
  CircleIcon,
  WindmillIcon,
  TypographyIcon,
  ShadowIcon,
  PaletteIcon,
  KeyIcon,
  BugIcon,
  DashboardIcon,
  BrandChromeIcon,
  HelpIcon,
  ReportMoneyIcon,
  ZoomMoneyIcon,
  BuildingWarehouseIcon,
  ToolsKitchenIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  requiredRoles?: UserRole[]; 
  requiredAccess?: AccessKey[];
}

const sidebarItem: menu[] = [
  { header: 'Halaman' },
  {
    title: 'Bendahara',
    icon: ZoomMoneyIcon,
    to: '/dashboard/bendahara',
    requiredRoles: ['admin', 'pemilik', 'bendahara'],
    requiredAccess: [ 'all',
      'r:total-all-income',
      'r:total-income',
      'r:total-order',
      'r:total-expense',
      'c:transaction',
      'r:transaction',
      'u:transaction',
      'd:transaction',
      'c:fund-request',
      'r:fund-request',
      'u:fund-request',
      'd:fund-request',
    ],
    children: [
      {
        title: 'Rekapitulasi Keuangan',
        icon: CircleIcon,
        to: '/dashboard/bendahara?show-only=rekapitulasi-keuangan',
        requiredRoles: ['admin', 'pemilik', 'bendahara'],
        requiredAccess: [ 'all',
          'r:total-all-income',
          'r:total-income',
          'r:total-order',
          'r:total-expense'
        ]
      },
      {
        title: 'Permintaan Dana',
        icon: CircleIcon,
        to: '/dashboard/bendahara?show-only=permintaan-dana',
        requiredRoles: ['admin', 'pemilik', 'bendahara'],
        requiredAccess: [ 'all',
          'c:fund-request',
          'r:fund-request',
          'u:fund-request',
          'd:fund-request',
        ]
      },
      {
        title: 'Shift',
        icon: CircleIcon,
        to: '/dashboard/bendahara?show-only=shift',
        requiredRoles: ['admin', 'pemilik', 'bendahara'],
        requiredAccess: [ 'all',
          'c:transaction',
          'r:transaction',
          'u:transaction',
          'd:transaction',
        ]
      }
    ]
  },
  {
    title: 'Pemilik',
    icon: DashboardIcon,
    to: '/dashboard/pemilik',
    requiredRoles: ['admin', 'pemilik'],
    requiredAccess: [ 'all',
      'r:active-employee',
      'r:timesheet',
      'u:timesheet',
      'c:reservation',
      'r:reservation',
      'u:reservation',
      'd:reservation',
      'c:branch',
      'r:branch',
      'u:branch',
      'd:branch',
      'c:employee',
      'r:employee',
      'u:employee',
      'd:employee'
    ],
    children: [
      {
        title: 'Aktifitas Karyawan',
        icon: CircleIcon,
        to: '/dashboard/pemilik?show-only=aktifitas-karyawan',
        requiredRoles: ['admin', 'pemilik'],
        requiredAccess: [ 'all',
          'r:active-employee',
          'r:timesheet',
          'u:timesheet',
        ]
      },
      {
        title: 'Shift',
        icon: CircleIcon,
        to: '/dashboard/pemilik?show-only=shift',
        requiredRoles: ['admin', 'pemilik'],
        requiredAccess: [ 'all',
          'c:branch',
          'r:branch',
          'u:branch',
          'd:branch',
          'c:employee',
          'r:employee',
          'u:employee',
          'd:employee'
        ]
      },
      {
        title: 'Reservasi',
        icon: CircleIcon,
        to: '/dashboard/pemilik?show-only=reservasi',
        requiredRoles: ['admin', 'pemilik'],
        requiredAccess: [ 'all',
          'c:reservation',
          'r:reservation',
          'u:reservation',
          'd:reservation',
        ]
      },
      {
        title: 'Manajemen',
        icon: CircleIcon,
        to: '/dashboard/pemilik?show-only=manajemen',
        requiredRoles: ['admin', 'pemilik']
      }
    ]
  },
  {
    title: 'Kasir',
    icon: ReportMoneyIcon,
    to: '/halaman/kasir',
    requiredRoles: ['admin', 'pemilik', 'kasir'],
    requiredAccess: [ 'all',
      'r:active-order',
      'c:order',
      'u:order',
      'd:order',
      'r:order-que',
      'r:order-history',
      'u:order-history',
      'd:order-history',
    ],
    // children: [
    //   {
    //     title: 'Rekapitulasi Pesanan',
    //     icon: CircleIcon,
    //     to: '/halaman/kasir?show-only=rekapitulasi-pesanan',
    //     requiredRoles: ['admin', 'pemilik', 'Kasir'],
    //     requiredAccess: [ 'all',
    //       'r:active-order',
    //     ]
    //   },
    //   {
    //     title: 'Pesanan',
    //     icon: CircleIcon,
    //     to: '/halaman/kasir?show-only=pesanan',
    //     requiredRoles: ['admin', 'pemilik', 'Kasir'],
    //     requiredAccess: [ 'all',
    //       'c:order',
    //       'u:order',
    //       'd:order',
    //       'r:order-que',
    //       'r:order-history',
    //       'u:order-history',
    //       'd:order-history',
    //     ]
    //   }
    // ]
  },
  {
    title: 'Gudang',
    icon: BuildingWarehouseIcon,
    to: '/halaman/gudang',
    requiredRoles: ['admin', 'pemilik', 'gudang'],
    requiredAccess: [ 'all',
      'r:active-stock-request',
      'c:stock-request',
      'r:stock-request',
      'u:stock-request',
      'd:stock-request',
      'c:stock',
      'r:stock',
      'u:stock',
      'd:stock',
      'c:stock-category',
      'r:stock-category',
      'u:stock-category',
      'd:stock-category',
      'c:stock-movement',
      'r:stock-movement',
      'u:stock-movement',
      'd:stock-movement',
      'c:fund-request',
      'r:fund-request'
    ],
    children: [
      {
        title: 'Rekapitulasi Gudang',
        icon: CircleIcon,
        to: '/halaman/gudang?show-only=rekapitulasi-gudang',
        requiredRoles: ['admin', 'pemilik', 'gudang'],
        requiredAccess: [ 'all',
          'r:active-stock-request',
        ]
      },
      {
        title: 'Permintaan Persediaan',
        icon: CircleIcon,
        to: '/halaman/gudang?show-only=permintaan-persediaan',
        requiredRoles: ['admin', 'pemilik', 'gudang'],
        requiredAccess: [ 'all',
          'r:active-stock-request',
          'c:stock-request',
          'r:stock-request',
          'u:stock-request',
          'd:stock-request',
        ]
      },
      {
        title: 'Persediaan',
        icon: CircleIcon,
        to: '/halaman/gudang?show-only=persediaan',
        requiredRoles: ['admin', 'pemilik', 'gudang'],
        requiredAccess: [ 'all',
          'c:stock',
          'r:stock',
          'u:stock',
          'd:stock',
          'c:stock-category',
          'r:stock-category',
          'u:stock-category',
          'd:stock-category',
        ]
      },
      {
        title: 'Mutasi Persediaan',
        icon: CircleIcon,
        to: '/halaman/gudang?show-only=mutasi-stok',
        requiredRoles: ['admin', 'pemilik', 'gudang'],
        requiredAccess: [ 'all',
          'c:stock-movement',
          'r:stock-movement',
          'u:stock-movement',
          'd:stock-movement',
        ]
      },
      {
        title: 'Permintaan Dana',
        icon: CircleIcon,
        to: '/halaman/gudang?show-only=permintaan-dana',
        requiredRoles: ['admin', 'pemilik', 'gudang'],
        requiredAccess: [ 'all',
          'c:fund-request',
          'r:fund-request',
        ]
      }
    ]
  },
  {
    title: 'Dapur',
    icon: ToolsKitchenIcon,
    to: '/halaman/dapur',
    requiredRoles: ['admin', 'pemilik', 'dapur'],
    requiredAccess: [ 'all',
      'r:active-order',
      'c:order',
      'u:order',
      'd:order',
      'r:order-que',
      'r:order-history',
      'u:order-history',
      'd:order-history',
      'c:menu',
      'r:menu',
      'u:menu',
      'd:menu',
      'c:menu-category',
      'r:menu-category',
      'u:menu-category',
      'd:menu-category',
      'c:stock-request',
      'r:stock-request'
    ],
    children: [
      {
        title: 'Pesanan',
        icon: CircleIcon,
        to: '/halaman/dapur?show-only=pesanan',
        requiredRoles: ['admin', 'pemilik', 'dapur'],
        requiredAccess: [ 'all',
          'c:order',
          'u:order',
          'd:order',
          'r:order-que',
          'r:order-history',
          'u:order-history',
          'd:order-history',
        ]
      },
      {
        title: 'Permintaan Persediaan',
        icon: CircleIcon,
        to: '/halaman/dapur?show-only=permintaan-persediaan',
        requiredRoles: ['admin', 'pemilik', 'dapur'],
        requiredAccess: [ 'all',
          'c:stock-request',
          'r:stock-request',
        ]
      }
    ]
  },
  // { divider: true },
  // { header: 'Lainnya' },
  // {
  //   title: 'Autentikasi',
  //   icon: KeyIcon,
  //   to: '/auth',
  //   children: [
  //     {
  //       title: 'Login',
  //       icon: CircleIcon,
  //       to: '/login'
  //     },
  //     {
  //       title: 'Register',
  //       icon: CircleIcon,
  //       to: '/register'
  //     }
  //   ]
  // },
  // { divider: true },
  // { header: 'Perawatan' },
  // {
  //   title: 'Error 404',
  //   icon: BugIcon,
  //   to: '/error'
  // },
  
  // { divider: true },
  // {
  //   title: 'Halaman Contoh',
  //   icon: BrandChromeIcon,
  //   to: '/starter'
  // },
  // {
  //   title: 'Dokumentasi',
  //   icon: HelpIcon,
  //   to: 'https://codedthemes.gitbook.io/berry-vuetify/',
  //   type: 'external'
  // }
];

export default sidebarItem;
