import type { Menu } from '@/types/menu';
import { dummyMenuCategories } from './dummyMenuCategories';

export const dummyMenus: Menu[] = [
  // Minuman
  {
    id: 'menu-1',
    name: 'Es Teh Manis',
    price: 5000,
    quantity: 100,
    category: dummyMenuCategories[0],
  },
  {
    id: 'menu-2',
    name: 'Kopi Hitam',
    price: 8000,
    quantity: 100,
    category: dummyMenuCategories[0],
  },
  {
    id: 'menu-3',
    name: 'Jus Alpukat',
    price: 15000,
    quantity: 50,
    category: dummyMenuCategories[0],
  },
  {
    id: 'menu-4',
    name: 'Matcha Latte',
    price: 18000,
    quantity: 40,
    category: dummyMenuCategories[0],
  },
  {
    id: 'menu-5',
    name: 'Susu Jahe',
    price: 10000,
    quantity: 70,
    category: dummyMenuCategories[0],
  },

  // Makanan
  {
    id: 'menu-6',
    name: 'Nasi Goreng Spesial',
    price: 25000,
    quantity: 80,
    category: dummyMenuCategories[1],
  },
  {
    id: 'menu-7',
    name: 'Ayam Geprek',
    price: 20000,
    quantity: 90,
    category: dummyMenuCategories[1],
  },
  {
    id: 'menu-8',
    name: 'Mie Goreng Jawa',
    price: 18000,
    quantity: 85,
    category: dummyMenuCategories[1],
  },
  {
    id: 'menu-9',
    name: 'Sate Ayam',
    price: 22000,
    quantity: 60,
    category: dummyMenuCategories[1],
  },
  {
    id: 'menu-10',
    name: 'Bakso Kuah Pedas',
    price: 17000,
    quantity: 75,
    category: dummyMenuCategories[1],
  },

  // Dessert
  {
    id: 'menu-11',
    name: 'Pisang Bakar Keju',
    price: 12000,
    quantity: 40,
    category: dummyMenuCategories[2],
  },
  {
    id: 'menu-12',
    name: 'Es Krim Vanila',
    price: 10000,
    quantity: 50,
    category: dummyMenuCategories[2],
  },
  {
    id: 'menu-13',
    name: 'Pudding Cokelat',
    price: 8000,
    quantity: 45,
    category: dummyMenuCategories[2],
  },
  {
    id: 'menu-14',
    name: 'Roti Bakar Cokelat',
    price: 11000,
    quantity: 60,
    category: dummyMenuCategories[2],
  },
  {
    id: 'menu-15',
    name: 'Kue Lapis',
    price: 9000,
    quantity: 70,
    category: dummyMenuCategories[2],
  },
];
