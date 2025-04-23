import type { TimesheetData } from '@/types/timesheet'

const dummyTimesheetData: Record<string, TimesheetData> = {
  "branch-1": {
    open_hour: 5,
    employee: [
      { name: 'Aldi', role: 'Manajer', active_hour: 5, status: 'aktif' },
      { name: 'Rina', role: 'Supervisor', active_hour: 5, status: 'aktif' },
      { name: 'Budi', role: 'Pelayan', active_hour: 5, status: 'aktif' },
      { name: 'Siti', role: 'Kasir', active_hour: 0, status: 'offline' },
      { name: 'Joko', role: 'Koki', active_hour: 0, status: 'offline' }
    ]
  },
  "branch-2": {
    open_hour: 6,
    employee: [
      { name: 'Dian', role: 'Manajer', active_hour: 6, status: 'aktif' },
      { name: 'Fajar', role: 'Supervisor', active_hour: 6, status: 'aktif' },
      { name: 'Tono', role: 'Pelayan', active_hour: 6, status: 'aktif' },
      { name: 'Ayu', role: 'Kasir', active_hour: 0, status: 'offline' },
      { name: 'Bagas', role: 'Koki', active_hour: 0, status: 'offline' }
    ]
  },
  "branch-3": {
    open_hour: 4,
    employee: [
      { name: 'Lina', role: 'Manajer', active_hour: 4, status: 'aktif' },
      { name: 'Rizky', role: 'Supervisor', active_hour: 4, status: 'aktif' },
      { name: 'Anton', role: 'Pelayan', active_hour: 4, status: 'aktif' },
      { name: 'Sari', role: 'Kasir', active_hour: 0, status: 'offline' },
      { name: 'Hadi', role: 'Koki', active_hour: 0, status: 'offline' }
    ]
  },
  "branch-4": {
    open_hour: 7,
    employee: [
      { name: 'Yuni', role: 'Manajer', active_hour: 7, status: 'aktif' },
      { name: 'Gilang', role: 'Supervisor', active_hour: 7, status: 'aktif' },
      { name: 'Nita', role: 'Pelayan', active_hour: 7, status: 'aktif' },
      { name: 'Eko', role: 'Kasir', active_hour: 0, status: 'offline' },
      { name: 'Bambang', role: 'Koki', active_hour: 0, status: 'offline' }
    ]
  }
};

export default dummyTimesheetData;