import type { Order } from '@/types/order'

export const dummyKitchenOrders: Order[] = [
{
  id: "order-dfcff88c",
  branch: {
    id: "branch-1",
    name: "Restoran A"
  },
  employee: {
    id: "emp-1",
    name: "Budi"
  },
  table_number: "10",
  customer: {
    id: "cust-2",
    name: "Bu Ani"
  },
  is_take_away: false,
  items: [
    {
      id: "item-d8e10fbd",
      menu: {
        id: "menu-3",
        name: "Sambal"
      },
      name: "Sambal",
      quantity: 2,
      note: '',
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    },
    {
      id: "item-0a006b3e",
      menu: {
        id: "menu-3",
        name: "Sambal"
      },
      name: "Sambal",
      quantity: 3,
      note: '',
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    },
    {
      id: "item-7dade676",
      menu: {
        id: "menu-2",
        name: "Ayam Goreng"
      },
      name: "Ayam Goreng",
      quantity: 2,
      note: '',
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    },
    {
      id: "item-2f02968b",
      menu: {
        id: "menu-3",
        name: "Sambal"
      },
      name: "Sambal",
      quantity: 2,
      note: "Tanpa sambal",
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    }
  ],
  status: "Siap Saji",
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
    id: "branch-1",
    name: "Restoran A"
  },
  employee: {
    id: "emp-1",
    name: "Budi"
  },
  table_number: "10",
  customer: {
    id: "cust-2",
    name: "Bu Ani"
  },
  is_take_away: true,
  items: [
    {
      id: "item-8be49550",
      menu: {
        id: "menu-1",
        name: "Nasi Uduk"
      },
      name: "Nasi Uduk",
      quantity: 3,
      note: "Level 2",
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    },
    {
      id: "item-5571147d",
      menu: {
        id: "menu-1",
        name: "Nasi Uduk"
      },
      name: "Nasi Uduk",
      quantity: 2,
      note: "Tanpa sambal",
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
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
    id: "branch-1",
    name: "Restoran A"
  },
  employee: {
    id: "emp-1",
    name: "Budi"
  },
  table_number: "7",
  customer: {
    id: "cust-2",
    name: "Bu Ani"
  },
  is_take_away: true,
  items: [
    {
      id: "item-916fe474",
      menu: {
        id: "menu-2",
        name: "Ayam Goreng"
      },
      name: "Ayam Goreng",
      quantity: 1,
      note: "Tanpa sambal",
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    },
    {
      id: "item-dcd65a11",
      menu: {
        id: "menu-2",
        name: "Ayam Goreng"
      },
      name: "Ayam Goreng",
      quantity: 1,
      note: "Level 2",
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    },
    {
      id: "item-256eba6f",
      menu: {
        id: "menu-2",
        name: "Ayam Goreng"
      },
      name: "Ayam Goreng",
      quantity: 1,
      note: '',
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    }
  ],
  status: "Pending",
  amount: 30000,
  payment_status: "Selesai",
  meta: {
    createdAt: new Date ("2025-04-28T12:00:00"),
    updatedAt: new Date ("2025-04-28T12:30:00")
  }
},
{
  id: "order-aeb5b357",
  branch: {
    id: "branch-1",
    name: "Restoran A"
  },
  employee: {
    id: "emp-2",
    name: "Siti"
  },
  table_number: "20",
  customer: {
    id: "cust-1",
    name: "Pak Joko"
  },
  is_take_away: false,
  items: [
    {
      id: "item-d2d6dd82",
      menu: {
        id: "menu-1",
        name: "Nasi Uduk"
      },
      name: "Nasi Uduk",
      quantity: 3,
      note: '',
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    },
    {
      id: "item-f29c53b9",
      menu: {
        id: "menu-4",
        name: "Teh Manis"
      },
      name: "Teh Manis",
      quantity: 1,
      note: "Tanpa sambal",
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    },
    {
      id: "item-812f9c43",
      menu: {
        id: "menu-2",
        name: "Ayam Goreng"
      },
      name: "Ayam Goreng",
      quantity: 2,
      note: '',
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    }
  ],
  status: "Diproses",
  amount: 60000,
  payment_status: "Batal",
  meta: {
    createdAt: new Date ("2025-04-28T12:00:00"),
    updatedAt: new Date ("2025-04-28T12:30:00")
  }
},
{
  id: "order-c13eb9b0",
  branch: {
    id: "branch-1",
    name: "Restoran A"
  },
  employee: {
    id: "emp-2",
    name: "Siti"
  },
  table_number: "18",
  customer: {
    id: "cust-1",
    name: "Pak Joko"
  },
  is_take_away: false,
  items: [
    {
      id: "item-d086deb6",
      menu: {
        id: "menu-2",
        name: "Ayam Goreng"
      },
      name: "Ayam Goreng",
      quantity: 3,
      note: "Tanpa sambal",
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    },
    {
      id: "item-f9da1084",
      menu: {
        id: "menu-2",
        name: "Ayam Goreng"
      },
      name: "Ayam Goreng",
      quantity: 3,
      note: '',
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    },
    {
      id: "item-b4c0fd90",
      menu: {
        id: "menu-4",
        name: "Teh Manis"
      },
      name: "Teh Manis",
      quantity: 3,
      note: '',
      meta: {
        createdAt: new Date ("2025-04-28T12:00:00"),
        updatedAt: new Date ("2025-04-28T12:30:00")
      }
    }
  ],
  status: "Siap Saji",
  amount: 90000,
  payment_status: "Selesai",
  meta: {
    createdAt: new Date ("2025-04-28T12:00:00"),
    updatedAt: new Date ("2025-04-28T12:30:00")
  }
}
];
