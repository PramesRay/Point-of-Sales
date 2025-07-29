import dummyBranchList from "../branch/dummyBranchList";
import type { Employee } from "@/types/employee";

const dummyEmployee: Employee[] = [
  {
    id: 'emp-000',
    name: 'Hermanu',
    role: 'Admin',
    access: ['all'],
    email: 'hermanu.admin@example.com',
    assigned_branch: dummyBranchList,
    activity: {
      shift_emp_id: null,
      shift_op_id: null,
      is_active: true,
      branch: dummyBranchList[0],
      last_active: new Date('2025-05-01T09:30:00Z'),
    },
    meta: {
      created_at: new Date('2024-10-01T08:00:00Z'),
      updated_at: new Date('2025-05-01T09:30:00Z'),
    }
  },
  {
    id: 'emp-001',
    name: 'Hermanu',
    role: 'Gudang',
    access: ['all'],
    email: 'hermanu.admin@example.com',
    assigned_branch: dummyBranchList,
    activity: {
      shift_emp_id: 'sft-emp-2',
      shift_op_id: 'sft-wh-1',
      is_active: true,
      branch: dummyBranchList[0],
      last_active: new Date('2025-05-01T09:30:00Z'),
    },
    meta: {
      created_at: new Date('2024-10-01T08:00:00Z'),
      updated_at: new Date('2025-05-01T09:30:00Z'),
    }
  },
  { 
  id: 'emp-002',
  name: 'Aldi', 
  role: 'Kasir', 
  access: ['all'],
  email: 'aldi.kitchen@example.com',
  assigned_branch: [dummyBranchList[0], dummyBranchList[1]],
  activity: {
    shift_emp_id: 'sft-emp-3',
    shift_op_id: 'sft-csr-1',
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: dummyBranchList[0]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-003',
  name: 'Rani', 
  role: 'Dapur', 
  access: ['all'],
  email: 'rani.kitchen@example.com',
  assigned_branch: [dummyBranchList[0]],
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-004',
  name: 'Budi', 
  role: 'Dapur', 
  access: ['all'],
  email: 'budi.kitchen@example.com',
  assigned_branch: [dummyBranchList[0]],
  activity: {
    shift_emp_id: 'sft-emp-5',
    shift_op_id: 'sft-kch-1',
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: dummyBranchList[0]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-005',
  name: 'Siti', 
  role: 'Admin', 
  access: ['all'],
  email: 'siti.kitchen@example.com',
  assigned_branch: dummyBranchList,
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-005',
  name: 'Siti', 
  role: 'Gudang', 
  access: ['all'],
  email: 'siti.kitchen@example.com',
  assigned_branch: dummyBranchList,
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-006',
  name: 'Joko', 
  role: 'Pemilik', 
  access: ['all'],
  email: 'joko.kitchen@example.com',
  assigned_branch: [dummyBranchList[1]],
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-007',
  name: 'Dian', 
  role: 'Kasir', 
  access: ['all'],
  email: 'dian.kitchen@example.com',
  assigned_branch: [dummyBranchList[1]],
  activity: {
    shift_emp_id: 'sft-emp-6',
    shift_op_id: 'sft-csr-1',
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,
    branch: dummyBranchList[1]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-008',
  name: 'Fajar', 
  role: 'Dapur', 
  access: ['all'],
  email: 'fajar.kitchen@example.com',
  assigned_branch: [dummyBranchList[1]],
  activity: {
    shift_emp_id: 'sft-emp-7',
    shift_op_id: 'sft-wh-1',
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-009',
  name: 'Tono', 
  role: 'Dapur', 
  access: ['all'],
  email: 'tono.kitchen@example.com',
  assigned_branch: [dummyBranchList[1]],
  activity: {
    shift_emp_id: 'sft-emp-8',
    shift_op_id: 'sft-wh-1',
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-010',
  name: 'Ayu', 
  role: 'Admin', 
  access: ['all'],
  email: 'ayu.kitchen@example.com',
  assigned_branch: [dummyBranchList[1]],
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: dummyBranchList[1]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-010',
  name: 'Ayu', 
  role: 'Gudang', 
  access: ['all'],
  email: 'ayu.kitchen@example.com',
  assigned_branch: [dummyBranchList[1]],
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-011',
  name: 'Bagas', 
  role: 'Pemilik', 
  access: ['all'],
  email: 'bagas.kitchen@example.com',
  assigned_branch: [dummyBranchList[2]],
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-012',
  name: 'Lina', 
  role: 'Kasir', 
  access: ['all'],
  email: 'lina.kitchen@example.com',
  assigned_branch: [dummyBranchList[2]],
  activity: {
    shift_emp_id: null,
    shift_op_id: 'sft-csr-1',
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: dummyBranchList[2]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-013',
  name: 'Rizky', 
  role: 'Dapur', 
  access: ['all'],
  email: 'rizky.kitchen@example.com',
  assigned_branch: [dummyBranchList[2]],
  activity: {
    shift_emp_id: null,
    shift_op_id: 'sft-wh-1',
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-014',
  name: 'Anton', 
  role: 'Dapur', 
  access: ['all'],
  email: 'anton.kitchen@example.com',
  assigned_branch: [dummyBranchList[2]],
  activity: {
    shift_emp_id: null,
    shift_op_id: 'sft-wh-1',
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-015',
  name: 'Sari', 
  role: 'Admin', 
  access: ['all'],
  email: 'sari.kitchen@example.com',
  assigned_branch: [dummyBranchList[2]],
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-015',
  name: 'Sari', 
  role: 'Gudang', 
  access: ['all'],
  email: 'sari.kitchen@example.com',
  assigned_branch: [dummyBranchList[2]],
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-016',
  name: 'Hadi', 
  role: 'Pemilik', 
  access: ['all'],
  email: 'hadi.kitchen@example.com',
  assigned_branch: [dummyBranchList[3]],
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-017',
  name: 'Yuni', 
  role: 'Kasir', 
  access: ['all'],
  email: 'yuni.kitchen@example.com',
  assigned_branch: [dummyBranchList[3]],
  activity: {
    shift_emp_id: null,
    shift_op_id: 'sft-csr-1',
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: dummyBranchList[3]
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-018',
  name: 'Gilang', 
  role: 'Dapur', 
  access: ['all'],
  email: 'gilang.kitchen@example.com',
  assigned_branch: [dummyBranchList[3]],
  activity: {
    shift_emp_id: null,
    shift_op_id: 'sft-wh-1',
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-019',
  name: 'Nita', 
  role: 'Dapur', 
  access: ['all'],
  email: 'nita.kitchen@example.com',
  assigned_branch: [dummyBranchList[3]],
  activity: {
    shift_emp_id: null,
    shift_op_id: 'sft-wh-1',
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: true,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-020',
  name: 'Eko', 
  role: 'Admin', 
  access: ['all'],
  email: 'eko.kitchen@example.com',
  assigned_branch: [dummyBranchList[3]],
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-020',
  name: 'Eko', 
  role: 'Gudang', 
  access: ['all'],
  email: 'eko.kitchen@example.com',
  assigned_branch: [dummyBranchList[3]],
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,  
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
},
{ 
  id: 'emp-021',
  name: 'Bambang', 
  role: 'Pemilik', 
  access: ['all'],
  email: 'bambang.kitchen@example.com',
  assigned_branch: [dummyBranchList[3]],
  activity: {
    shift_emp_id: null,
    shift_op_id: null,
    last_active: new Date('2025-05-27T16:00:00'), 
    is_active: false,
    branch: null
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
}]

export default dummyEmployee