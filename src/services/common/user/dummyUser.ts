import type { Employee } from '@/types/employee'

export const dummyUser: Employee = {
  id: 'emp-001',
  name: 'Rina Ayu',
  email: 'rina.kitchen@example.com',
  role: ['admin'],
  access: ['all'],
  assigned_branch: [{ id: 'branch-1', name: 'Restoran 1' }],
  activity: {
    is_active: true,
    branch: { id: 'branch-1', name: 'Restoran 1' },
    last_active: new Date('2025-05-01T09:30:00Z'),
  },
  meta: {
    created_at: new Date('2024-10-01T08:00:00Z'),
    updated_at: new Date('2025-05-01T09:30:00Z'),
  }
}