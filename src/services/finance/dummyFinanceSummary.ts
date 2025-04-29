import type { FinanceSummary } from '@/types/finance';

const dummyFinanceSummary: FinanceSummary[] = [
  {
    branchId: 'all',
    branchName: 'Semua Cabang',
    income: 4800000, // Total pendapatan dari semua cabang
    expense: {
      totalExpense: {
        today: 9104000,
        week: 47000000,
        month: 213000000,
        year: 2600000000
      },
      chartData: {
        today: {
          categories: ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'],
          series: [
            { name: 'Belanja Stok', data: [500, 800, 700, 1000, 1400, 1500, 1800, 2100] },
            { name: 'Lain-lain', data: [200, 300, 250, 400, 600, 650, 700, 800] }
          ]
        },
        week: {
          categories: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
          series: [
            { name: 'Belanja Stok', data: [2000, 2500, 2100, 2400, 2800, 3000, 3300] },
            { name: 'Lain-lain', data: [1000, 1100, 1200, 1300, 1400, 1500, 1600] }
          ]
        },
        month: {
          categories: ['Minggu 1','Minggu 2','Minggu 3','Minggu 4'],
          series: [
            { name: 'Belanja Stok', data: [10000, 11500, 10800, 12600] },
            { name: 'Lain-lain', data: [5000, 5500, 5300, 6000] }
          ]
        },
        year: {
          categories: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
          series: [
            { name: 'Belanja Stok', data: [15000, 17000, 18000, 20000, 22000, 24000, 26000, 28000, 30000, 32000, 34000, 36000] },
            { name: 'Lain-lain', data: [8000, 8500, 9000, 9500, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000] }
          ]
        }
      }
    },
    order: {
      current: 50, // Total order dari semua cabang
      week: [50, 40, 30, 60],
      month: [45, 35, 50, 60, 55, 70, 60, 65]
    }
  },
  {
    branchId: 'branch-1',
    branchName: 'Restoran 1',
    income: 1000000,
    expense: {
      totalExpense: {
        today: 2324000,
        week: 12500000,
        month: 54000000,
        year: 650000000
      },
      chartData: {
        today: {
          categories: ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'],
          series: [
            { name: 'Belanja Stok', data: [120, 240, 180, 300, 450, 500, 650, 700] },
            { name: 'Lain-lain', data: [80,  160, 120, 200, 300, 350, 400, 450] }
          ]
        },
        week: {
          categories: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
          series: [
            { name: 'Belanja Stok', data: [1000, 1200, 900, 1100, 1300, 1400, 1500] },
            { name: 'Lain-lain', data: [600,  650,  700,  750,  800,  850,  900] }
          ]
        },
        month: {
          categories: ['Minggu 1','Minggu 2','Minggu 3','Minggu 4'],
          series: [
            { name: 'Belanja Stok', data: [4000, 4500, 4200, 4800] },
            { name: 'Lain-lain', data: [2000, 2200, 2100, 2300] }
          ]
        },
        year: {
          categories: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
          series: [
            { name: 'Belanja Stok', data: [5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 10500] },
            { name: 'Lain-lain', data: [2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600] }
          ]
        }
      }
    },
    order: {
      current: 12,
      week: [12, 8, 5, 14],
      month: [11, 6, 9, 13, 8, 14, 4, 7]
    }
  },
  {
    branchId: 'branch-2',
    branchName: 'Restoran 2',
    income: 1500000,
    expense: {
      totalExpense: {
        today: 1823000,
        week: 11500000,
        month: 48000000,
        year: 620000000
      },
      chartData: {
        today: {
          categories: ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'],
          series: [
            { name: 'Belanja Stok', data: [100, 230, 180, 290, 440, 510, 620, 710] },
            { name: 'Lain-lain', data: [90,  150, 130, 210, 310, 360, 410, 460] }
          ]
        },
        week: {
          categories: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
          series: [
            { name: 'Belanja Stok', data: [900, 1100, 850, 1200, 1250, 1350, 1450] },
            { name: 'Lain-lain', data: [550, 600, 650, 700, 750, 800, 850] }
          ]
        },
        month: {
          categories: ['Minggu 1','Minggu 2','Minggu 3','Minggu 4'],
          series: [
            { name: 'Belanja Stok', data: [3800, 4200, 4000, 4600] },
            { name: 'Lain-lain', data: [1800, 2000, 1950, 2200] }
          ]
        },
        year: {
          categories: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
          series: [
            { name: 'Belanja Stok', data: [4800, 5300, 5800, 6300, 6800, 7300, 7800, 8300, 8800, 9300, 9800, 10300] },
            { name: 'Lain-lain', data: [2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500] }
          ]
        }
      }
    },
    order: {
      current: 15,
      week: [14, 10, 6, 12],
      month: [12, 7, 10, 14, 9, 13, 5, 8]
    }
  },
  {
    branchId: 'branch-3',
    branchName: 'Restoran 3',
    income: 900000,
    expense: {
      totalExpense: {
        today: 2624000,
        week: 13500000,
        month: 58000000,
        year: 670000000
      },
      chartData: {
        today: {
          categories: ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'],
          series: [
            { name: 'Belanja Stok', data: [140, 260, 200, 320, 460, 520, 660, 720] },
            { name: 'Lain-lain', data: [100, 180, 140, 220, 330, 380, 420, 480] }
          ]
        },
        week: {
          categories: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
          series: [
            { name: 'Belanja Stok', data: [1100, 1300, 900, 1400, 1500, 1600, 1700] },
            { name: 'Lain-lain', data: [700, 750, 800, 850, 900, 950, 1000] }
          ]
        },
        month: {
          categories: ['Minggu 1','Minggu 2','Minggu 3','Minggu 4'],
          series: [
            { name: 'Belanja Stok', data: [4200, 4600, 4400, 5000] },
            { name: 'Lain-lain', data: [2100, 2300, 2200, 2400] }
          ]
        },
        year: {
          categories: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
          series: [
            { name: 'Belanja Stok', data: [5200, 5700, 6200, 6700, 7200, 7700, 8200, 8700, 9200, 9700, 10200, 10700] },
            { name: 'Lain-lain', data: [2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700] }
          ]
        }
      }
    },
    order: {
      current: 10,
      week: [9, 7, 4, 11],
      month: [10, 5, 8, 12, 7, 11, 3, 6]
    }
  },
  {
    branchId: 'branch-4',
    branchName: 'Restoran 4',
    income: 1100000,
    expense: {
      totalExpense: {
        today: 2024000,
        week: 10500000,
        month: 50000000,
        year: 600000000
      },
      chartData: {
        today: {
          categories: ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'],
          series: [
            { name: 'Belanja Stok', data: [90, 220, 160, 280, 430, 480, 600, 650] },
            { name: 'Lain-lain', data: [70, 140, 110, 190, 260, 300, 350, 390] }
          ]
        },
        week: {
          categories: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
          series: [
            { name: 'Belanja Stok', data: [800, 1000, 700, 1200, 1300, 1400, 1500] },
            { name: 'Lain-lain', data: [500, 550, 600, 650, 700, 750, 800] }
          ]
        },
        month: {
          categories: ['Minggu 1','Minggu 2','Minggu 3','Minggu 4'],
          series: [
            { name: 'Belanja Stok', data: [3600, 4000, 3800, 4400] },
            { name: 'Lain-lain', data: [1700, 1900, 1800, 2000] }
          ]
        },
        year: {
          categories: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
          series: [
            { name: 'Belanja Stok', data: [4700, 5200, 5700, 6200, 6700, 7200, 7700, 8200, 8700, 9200, 9700, 10200] },
            { name: 'Lain-lain', data: [2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400] }
          ]
        }
      }
    },
    order: {
      current: 14,
      week: [13, 9, 6, 13],
      month: [9, 4, 7, 11, 6, 12, 2, 5]
    }
  }
];

export default dummyFinanceSummary;