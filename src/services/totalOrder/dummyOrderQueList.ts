import type { Order } from '@/types/order'

const dummyOrdersQue: Order[] = [
{
  id: "order-dfcff88c",
  branch: {
    id: "branch-1",
    name: "Restoran 1"
  },
  employee: {
    id: "emp-1",
    name: "Budi"
  },
  table_number: "10",
  customer: {
    id: "cust-2",
    name: "Bu Ani",
    phone: "08123456789"
  },
  is_take_away: false,
  items: [
    {
      id: "menu-3",
      name: "Sambal",
      quantity: 2,
      note: '',
      price: 15000
    },
    {
      id: "menu-3",
      name: "Sambal",
      quantity: 3,
      note: '',
      price: 15000
    },
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 2,
      note: '',
      price: 15000
    },
    {
      id: "menu-3",
      name: "Sambal",
      quantity: 2,
      note: "",
      price: 15000
    }
  ],
  status: "Diproses",
  amount: 90000,
  payment_status: "Pending",
  meta: {
    createdAt: new Date ("2025-04-28T12:00:00"),
    updatedAt: new Date ("2025-04-28T12:30:00")
  }
},
{
  id: "order-3d0d43aa",
  branch: {
    id: "branch-2",
    name: "Restoran 2"
  },
  employee: {
    id: "emp-1",
    name: "Budi"
  },
  table_number: "10",
  customer: {
    id: "cust-2",
    name: "Bu Ani",
    phone: "08123456789"
  },
  is_take_away: true,
  items: [
    {
      id: "menu-1",
      name: "Nasi Uduk",
      quantity: 3,
      note: "Level 2",
      price: 15000
    },
    {
      id: "menu-1",
      name: "Nasi Uduk",
      quantity: 2,
      note: "Tanpa sambal",
      price: 15000
    }
  ],
  status: "Pending",
  amount: 50000,
  payment_status: "Pending",
  meta: {
    createdAt: new Date ("2025-04-28T12:00:00"),
    updatedAt: new Date ("2025-04-28T12:30:00")
  }
},
{
  id: "order-3cd00059",
  branch: {
    id: "branch-3",
    name: "Restoran 3"
  },
  employee: {
    id: "emp-1",
    name: "Budi"
  },
  table_number: "7",
  customer: {
    id: "cust-2",
    name: "Bu Ani",
    phone: "08123456789"
  },
  is_take_away: true,
  items: [
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 1,
      note: "Tanpa sambal",
      price: 15000
    },
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 1,
      note: "Level 2",
      price: 15000
    },
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 1,
      note: '',
      price: 15000
    }
  ],
  status: "Pending",
  amount: 30000,
  payment_status: "Pending",
  meta: {
    createdAt: new Date ("2025-04-28T12:00:00"),
    updatedAt: new Date ("2025-04-28T12:30:00")
  }
},
{
  id: "order-aeb5b357",
  branch: {
    id: "branch-4",
    name: "Restoran 4"
  },
  employee: {
    id: "emp-2",
    name: "Siti"
  },
  table_number: "20",
  customer: {
    id: "cust-1",
    name: "Pak Joko",
    phone: "08123456789"
  },
  is_take_away: false,
  items: [
    {
      id: "menu-1",
      name: "Nasi Uduk",
      quantity: 3,
      note: '',
      price: 15000
    },
    {
      id: "menu-4",
      name: "Teh Manis",
      quantity: 1,
      note: "Tanpa sambal",
      price: 15000
    },
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 2,
      note: '',
      price: 15000
    }
  ],
  status: "Diproses",
  amount: 60000,
  payment_status: "Pending",
  meta: {
    createdAt: new Date ("2025-04-28T12:00:00"),
    updatedAt: new Date ("2025-04-28T12:30:00")
  }
},
{
  id: "order-c13eb9b0",
  branch: {
    id: "branch-1",
    name: "Restoran 1"
  },
  employee: {
    id: "emp-2",
    name: "Siti"
  },
  table_number: "18",
  customer: {
    id: "cust-1",
    name: "Pak Joko",
    phone: "08123456789"
  },
  is_take_away: false,
  items: [
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 3,
      note: "Tanpa sambal",
      price: 15000
    },
    {
      id: "menu-2",
      name: "Ayam Goreng",
      quantity: 3,
      note: '',
      price: 15000
    },
    {
      id: "menu-4",
      name: "Teh Manis",
      quantity: 3,
      note: '',
      price: 15000
    }
  ],
  status: "Selesai",
  amount: 90000,
  payment_status: "Selesai",
  meta: {
    createdAt: new Date ("2025-04-28T12:00:00"),
    updatedAt: new Date ("2025-04-28T12:30:00")
  }
}
];

export default dummyOrdersQue