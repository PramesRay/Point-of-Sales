import type { TimesheetData } from '@/types/timesheet'

const dummyTimesheetData: Record<string, TimesheetData> = {
  "branch-1": {
    open_hour: 5,
    employee: [
      { name: 'Aldi', role: 'Manajer', last_active: 5, status: 'aktif' },
      { name: 'Rina', role: 'Supervisor', last_active: 5, status: 'aktif' },
      { name: 'Budi', role: 'Pelayan', last_active: 5, status: 'aktif' },
      { name: 'Siti', role: 'Kasir', last_active: 0, status: 'offline' },
      { name: 'Joko', role: 'Koki', last_active: 0, status: 'offline' }
    ]
  },
  "branch-2": {
    open_hour: 6,
    employee: [
      { name: 'Dian', role: 'Manajer', last_active: 6, status: 'aktif' },
      { name: 'Fajar', role: 'Supervisor', last_active: 6, status: 'aktif' },
      { name: 'Tono', role: 'Pelayan', last_active: 6, status: 'aktif' },
      { name: 'Ayu', role: 'Kasir', last_active: 0, status: 'offline' },
      { name: 'Bagas', role: 'Koki', last_active: 0, status: 'offline' }
    ]
  },
  "branch-3": {
    open_hour: 4,
    employee: [
      { name: 'Lina', role: 'Manajer', last_active: 4, status: 'aktif' },
      { name: 'Rizky', role: 'Supervisor', last_active: 4, status: 'aktif' },
      { name: 'Anton', role: 'Pelayan', last_active: 4, status: 'aktif' },
      { name: 'Sari', role: 'Kasir', last_active: 0, status: 'offline' },
      { name: 'Hadi', role: 'Koki', last_active: 0, status: 'offline' }
    ]
  },
  "branch-4": {
    open_hour: 7,
    employee: [
      { name: 'Yuni', role: 'Manajer', last_active: 7, status: 'aktif' },
      { name: 'Gilang', role: 'Supervisor', last_active: 7, status: 'aktif' },
      { name: 'Nita', role: 'Pelayan', last_active: 7, status: 'aktif' },
      { name: 'Eko', role: 'Kasir', last_active: 0, status: 'offline' },
      { name: 'Bambang', role: 'Koki', last_active: 0, status: 'offline' }
    ]
  }
};

export default dummyTimesheetData;