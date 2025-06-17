import type { TimesheetData } from '@/types/timesheet'

const dummyTimesheetData: TimesheetData[] = [
  {
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    }, 
    open_hour: 5,
    employee: [
    { 
      id: 'emp-000',
      name: 'Aldi', 
      role: ['cashier'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Rina', 
      role: ['kitchen'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Budi', 
      role: ['kitchen'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Siti', 
      role: ['admin'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: false,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Joko', 
      role: ['owner'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: false,
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    }]
  },
  {    
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    }, 
    open_hour: 6,
    employee: [
    { 
      id: 'emp-000',
      name: 'Dian', 
      role: ['cashier'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Fajar', 
      role: ['kitchen'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Tono', 
      role: ['kitchen'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Ayu', 
      role: ['admin'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: false,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Bagas', 
      role: ['owner'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: false,
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    }]
  },
  {    
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    }, 
    open_hour: 4,
    employee: [
    { 
      id: 'emp-000',
      name: 'Lina', 
      role: ['cashier'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Rizky', 
      role: ['kitchen'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Anton', 
      role: ['kitchen'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Sari', 
      role: ['admin'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: false,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Hadi', 
      role: ['owner'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: false,
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    }]
  },
  {    
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    }, 
    open_hour: 7,
    employee: [
    { 
      id: 'emp-000',
      name: 'Yuni', 
      role: ['cashier'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Gilang', 
      role: ['kitchen'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Nita', 
      role: ['kitchen'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: true,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Eko', 
      role: ['admin'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: false,  
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    },
    { 
      id: 'emp-000',
      name: 'Bambang', 
      role: ['owner'], 
      activity: {
        last_active: new Date('2025-05-27T16:00:00'), 
        is_active: false,
        branch: {
          id: "branch-1",
          name: "Restoran 1"
        }, 
      },
      access: ['all'],
      email: 'rina.kitchen@example.com',
      assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
      meta: {
        created_at: new Date('2024-10-01T08:00:00Z'),
        updated_at: new Date('2025-05-01T09:30:00Z'),
      }
    }]
  }
]

export default dummyTimesheetData;