import {
  ShoppingCartIcon,
  ReservedLineIcon
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
}

const sidebarItem: menu[] = [
  {
    title: 'Pesanan Anda',
    icon: ShoppingCartIcon,
    to: '/halaman/pesanan',
  },
  {
    title: 'Reservasi',
    icon: ReservedLineIcon,
    to: '/halaman/reservasi',
  }
];

export default sidebarItem;
