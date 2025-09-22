import type { StockRequestSummary } from "@/types/inventory";

const dummyStockRequestSummary: StockRequestSummary[] = [
  {
    branch: {
      id: "all",
      name: "Semua Cabang"
    },
    summary: {
      request: 54,
      week: [54, 34, 32, 50],
      month: [38, 24, 43, 54, 29, 48, 21, 38]
    }
  },
  {
    branch: {
      id: "branch-1",
      name: "Restoran 1"
    },
    summary: {
      request: 12,
      week: [12, 8, 5, 14],
      month: [11, 6, 9, 13, 8, 14, 4, 7]
    }
  },
  {
    branch: {
      id: "branch-2",
      name: "Restoran 2"
    },
    summary: {
      request: 14,
      week: [14, 10, 7, 12],
      month: [9, 7, 11, 15, 6, 12, 5, 10]
    }
  },
  {
    branch: {
      id: "branch-3",
      name: "Restoran 3"
    },
    summary: {
      request: 13,
      week: [13, 9, 8, 15],
      month: [10, 5, 13, 14, 8, 9, 7, 12]
    }
  },
  {
    branch: {
      id: "branch-4",
      name: "Restoran 4"
    },
    summary: {
      request: 15,
      week: [15, 7, 12, 9],
      month: [8, 6, 10, 12, 7, 13, 5, 9]
    }
  }
];

export default dummyStockRequestSummary;