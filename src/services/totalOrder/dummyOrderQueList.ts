import type { Order } from '@/types/order'
import dummyBranchList from '../common/branch/dummyBranchList';
import dummyEmployee from '../common/employee/dummyEmployee';
import { dummyMenuSale } from '../menu/dummyMenuSale';

const dummyOrdersQue: Order[] = [
{
  id: "order-dfcff88c",
  shift: {
    employee: 'sft-emp-1',
    cashier: 'sft-csr-1',
    kitchen: 'sft-kch-1',
  },
  branch: dummyBranchList[0],
  table_number: "10",
  customer: {
    name: "Bu Ani",
    phone: "08123456789"
  },
  is_take_away: false,
  items: [
    {
      id: 'ord-itm-wiaugd87g9',
      item_id: dummyMenuSale[0].id,
      name: dummyMenuSale[0].name,
      price: dummyMenuSale[0].price,
      note: '',
      quantity: 2,
      status: 'Pending'
    },
    {
      id: 'ord-itm-idj1892dh2',
      item_id: dummyMenuSale[2].id,
      name: dummyMenuSale[2].name,
      price: dummyMenuSale[2].price,
      note: '',
      quantity: 3,
      status: 'Diproses'
    },
    {
      id: 'ord-itm-012jd1nu9e',
      item_id: dummyMenuSale[0].id,
      name: dummyMenuSale[0].name,
      price: dummyMenuSale[0].price,
      note: '',
      quantity: 2,
      status: 'Tersaji'
    },
    {
      id: 'ord-itm-jf9u40jdaf',
      item_id: dummyMenuSale[4].id,
      name: dummyMenuSale[4].name,
      price: dummyMenuSale[4].price,
      note: '',
      quantity: 2,
      status: 'Pending'
    }
  ],
  status: "Diproses",
  amount: 90000,
  payment_status: "Pending",
  meta: {
    created_at: new Date(),
    created_by: dummyEmployee[2],
    updated_at: new Date(),
    last_updated_by: dummyEmployee[2]
  }
},
{
  id: "order-3d0d43aa",
  shift: {
    employee: 'sft-emp-1',
    cashier: 'sft-csr-1',
    kitchen: 'sft-kch-1',
  },
  branch: dummyBranchList[0],
  table_number: "10",
  customer: {
    name: "Bu Ani",
    phone: "08123456789"
  },
  is_take_away: true,
  items: [
    {
      id: 'ord-itm-091j20fj1ioew',
      item_id: dummyMenuSale[0].id,
      name: dummyMenuSale[0].name,
      price: dummyMenuSale[0].price,
      note: '',
      quantity: 2,
      status: 'Pending'
    },
    {
      id: 'ord-itm-190dj28d9iuow',
      item_id: dummyMenuSale[1].id,
      name: dummyMenuSale[1].name,
      price: dummyMenuSale[1].price,
      note: '',
      quantity: 3,
      status: 'Diproses'
    },
    {
      id: 'ord-itm-d1piowndmpq',
      item_id: dummyMenuSale[2].id,
      name: dummyMenuSale[2].name,
      price: dummyMenuSale[2].price,
      note: 'Goreng Garing',
      quantity: 2,
      status: 'Tersaji'
    },
    {
      id: 'ord-itm-10ouinowe',
      item_id: dummyMenuSale[4].id,
      name: dummyMenuSale[4].name,
      price: dummyMenuSale[4].price,
      note: '',
      quantity: 2,
      status: 'Pending'
    }
  ],
  status: "Pending",
  amount: 50000,
  payment_status: "Pending",
  meta: {
    created_at: new Date(),
    created_by: dummyEmployee[2],
    updated_at: new Date(),
    last_updated_by: dummyEmployee[2]
  }
},
{
  id: "order-3cd00059",
  shift: {
    employee: 'sft-emp-1',
    cashier: 'sft-csr-1',
    kitchen: 'sft-kch-1',
  },
  branch: dummyBranchList[0],
  table_number: "7",
  customer: {
    name: "Bu Ani",
    phone: "08123456789"
  },
  is_take_away: true,
  items: [
    {
      id: 'ord-itm-awocklnap',
      item_id: dummyMenuSale[0].id,
      name: dummyMenuSale[0].name,
      price: dummyMenuSale[0].price,
      note: '',
      quantity: 2,
      status: 'Pending'
    },
    {
      id: 'ord-itm-j9iucw0sdc',
      item_id: dummyMenuSale[5].id,
      name: dummyMenuSale[5].name,
      price: dummyMenuSale[5].price,
      note: '',
      quantity: 3,
      status: 'Diproses'
    },
    {
      id: 'ord-itm-kjioncjsapa',
      item_id: dummyMenuSale[6].id,
      name: dummyMenuSale[6].name,
      price: dummyMenuSale[6].price,
      note: '',
      quantity: 2,
      status: 'Tersaji'
    },
  ],
  status: "Pending",
  amount: 30000,
  payment_status: "Pending",
  meta: {
    created_at: new Date(),
    created_by: dummyEmployee[2],
    updated_at: new Date(),
    last_updated_by: dummyEmployee[2]
  }
},
{
  id: "order-aeb5b357",
  shift: {
    employee: 'sft-emp-1',
    cashier: 'sft-csr-1',
    kitchen: 'sft-kch-1',
  },
  branch: dummyBranchList[0],
  table_number: "20",
  customer: {
    name: "Pak Joko",
    phone: "08123456789"
  },
  is_take_away: false,
  items: [
    {
      id: 'ord-itm-c910inowcd',
      item_id: dummyMenuSale[0].id,
      name: dummyMenuSale[0].name,
      price: dummyMenuSale[0].price,
      note: '',
      quantity: 2,
      status: 'Pending'
    },
    {
      id: 'ord-itm-jcnoidiojacl',
      item_id: dummyMenuSale[2].id,
      name: dummyMenuSale[2].name,
      price: dummyMenuSale[2].price,
      note: '',
      quantity: 3,
      status: 'Diproses'
    },
  ],
  status: "Diproses",
  amount: 60000,
  payment_status: "Pending",
  meta: {
    created_at: new Date(),
    created_by: dummyEmployee[2],
    updated_at: new Date(),
    last_updated_by: dummyEmployee[2]
  }
},
{
  id: "order-c13eb9b0",
  shift: {
    employee: 'sft-emp-1',
    cashier: 'sft-csr-1',
    kitchen: 'sft-kch-1',
  },
  branch: dummyBranchList[0],
  table_number: "18",
  customer: {
    name: "Pak Joko",
    phone: "08123456789"
  },
  is_take_away: false,
  items: [
    {
      id: 'ord-itm-djihoqwjkdq',
      item_id: dummyMenuSale[0].id,
      name: dummyMenuSale[0].name,
      price: dummyMenuSale[0].price,
      note: '',
      quantity: 2,
      status: 'Pending'
    },
    {
      id: 'ord-itm-acjpionspka',
      item_id: dummyMenuSale[2].id,
      name: dummyMenuSale[2].name,
      price: dummyMenuSale[2].price,
      note: 'Digoreng Garing',
      quantity: 3,
      status: 'Diproses'
    },
    {
      id: 'ord-itm-casiojnclka',
      item_id: dummyMenuSale[2].id,
      name: dummyMenuSale[2].name,
      price: dummyMenuSale[2].price,
      note: 'Digoreng Sebentar',
      quantity: 2,
      status: 'Tersaji'
    },
    {
      id: 'ord-itm-c19iwonkjqlmd',
      item_id: dummyMenuSale[10].id,
      name: dummyMenuSale[10].name,
      price: dummyMenuSale[10].price,
      note: '',
      quantity: 2,
      status: 'Pending'
    }
  ],
  status: "Selesai",
  amount: 90000,
  payment_status: "Lunas",
  meta: {
    created_at: new Date(),
    created_by: dummyEmployee[2],
    updated_at: new Date(),
    last_updated_by: dummyEmployee[2]
  }
}
];

export default dummyOrdersQue