import {
  BookIcon,
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
    title: 'Halaman',
    icon: BookIcon,
    to: '/',
    children: [
      {
        title: 'Pesanan Anda',
        icon: ShoppingCartIcon,
        to: '?show-only=pesanan',
      },
      {
        title: 'Reservasi',
        icon: ReservedLineIcon,
        to: '?show-only=reservasi',
      }
    ]
  },

];

export default sidebarItem;
