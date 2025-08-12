import type { Order } from '@/types/order'
import dummyBranchList from '../common/branch/dummyBranchList';
import dummyUser from '../common/user/dummyUser';
import { dummyMenuSale } from '../menu/dummyMenuSale';

const dummyOrdersQue: Order[] = [
{
  id: "order-dfcff88c",
  branch: dummyBranchList[0],
  table_number: "10",
  customer: dummyUser[0],
  is_take_away: false,
  items: [
    {
      id: dummyMenuSale[0].id,
      name: dummyMenuSale[0].name,
      price: dummyMenuSale[0].price,
      note: '',
      quantity: 2,
      status: 'Diproses'
    },
    {
      id: dummyMenuSale[2].id,
      name: dummyMenuSale[2].name,
      price: dummyMenuSale[2].price,
      note: '',
      quantity: 3,
      status: 'Diproses'
    },
    {
      id: dummyMenuSale[0].id,
      name: dummyMenuSale[0].name,
      price: dummyMenuSale[0].price,
      note: '',
      quantity: 2,
      status: 'Tersaji'
    },
    {
      id: dummyMenuSale[4].id,
      name: dummyMenuSale[4].name,
      price: dummyMenuSale[4].price,
      note: '',
      quantity: 2,
      status: 'Diproses'
    }
  ],
  status: "Diproses",
  amount: 90000,
  payment_status: "Pending",
  meta: {
    created_at: new Date(),
    created_by: dummyUser[0],
    updated_at: new Date(),
    last_updated_by: dummyUser[0]
  }
},
{
  id: "order-3d0d43aa",
  branch: dummyBranchList[0],
  table_number: "10",
  customer: dummyUser[1],
  is_take_away: true,
  items: [
    {
      id: "menu-1",
      name: "Nasi Uduk",
      quantity: 3,
      note: "Level 2",
      price: 15000,
      status: 'Pending'
    },
    {
      id: "menu-1",
      name: "Nasi Uduk",
      quantity: 2,
      note: "Tanpa sambal",
      price: 15000,
      status: 'Pending'
    }
  ],
  status: "Pending",
  amount: 50000,
  payment_status: "Pending",
  meta: {
    created_at: new Date(),
    created_by: dummyUser[1],
    updated_at: new Date(),
    last_updated_by: dummyUser[1]
  }
},
{
  id: "order-3cd00059",
  branch: dummyBranchList[0],
  table_number: "7",
  customer: dummyUser[2],
  is_take_away: true,
  items: [
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 1,
      note: "Tanpa sambal",
      price: 15000,
      status: 'Pending'
    },
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 1,
      note: "Level 2",
      price: 15000,
      status: 'Pending'
    },
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 1,
      note: '',
      price: 15000,
      status: 'Pending'
    }
  ],
  status: "Pending",
  amount: 30000,
  payment_status: "Pending",
  meta: {
    created_at: new Date(),
    created_by: dummyUser[2],
    updated_at: new Date(),
    last_updated_by: dummyUser[2]
  }
},
{
  id: "order-aeb5b357",
  branch: dummyBranchList[0],
  table_number: "20",
  customer: dummyUser[3],
  is_take_away: false,
  items: [
    {
      id: "menu-1",
      name: "Nasi Uduk",
      quantity: 3,
      note: '',
      price: 15000,
      status: 'Pending'
    },
    {
      id: "menu-4",
      name: "Teh Manis",
      quantity: 1,
      note: "Tanpa sambal",
      price: 15000,
      status: 'Diproses'
    },
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 2,
      note: '',
      price: 15000,
      status: 'Tersaji'
    }
  ],
  status: "Diproses",
  amount: 60000,
  payment_status: "Pending",
  meta: {
    created_at: new Date(),
    created_by: dummyUser[3],
    updated_at: new Date(),
    last_updated_by: dummyUser[3]
  }
},
{
  id: "order-c13eb9b0",
  branch: dummyBranchList[0],
  table_number: "18",
  customer: dummyUser[1],
  is_take_away: false,
  items: [
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 3,
      note: "Tanpa sambal",
      price: 15000,
      status: 'Tersaji'
    },
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 3,
      note: '',
      price: 15000,
      status: 'Tersaji'
    },
    {
      id: "menu-4",
      name: "Teh Manis",
      quantity: 3,
      note: '',
      price: 15000,
      status: 'Refund'
    }
  ],
  status: "Selesai",
  amount: 90000,
  payment_status: "Selesai",
  meta: {
    created_at: new Date(),
    created_by: dummyUser[1],
    updated_at: new Date(),
    last_updated_by: dummyUser[1]
  }
}
];

export default dummyOrdersQue