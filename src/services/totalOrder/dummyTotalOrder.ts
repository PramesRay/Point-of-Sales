import type { TotalOrder } from '@/types/order'

const dummyTotalOrder: Record<string, TotalOrder> = {
  "branch-1": {
    current: 12,
    week: [12, 8, 5, 14],
    month: [11, 6, 9, 13, 8, 14, 4, 7]
  },
  "branch-2": {
    current: 14,
    week: [14, 10, 7, 12],
    month: [9, 7, 11, 15, 6, 12, 5, 10]
  },
  "branch-3": {
    current: 13,
    week: [13, 9, 8, 15],
    month: [10, 5, 13, 14, 8, 9, 7, 12]
  },
  "branch-4": {
    current: 15,
    week: [15, 7, 12, 9],
    month: [8, 6, 10, 12, 7, 13, 5, 9]
  }
};

export default dummyTotalOrder;