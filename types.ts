export interface Host {
  id: string;
  name: string;
  accounts: string[];
}

export interface MonthlyTarget {
  id: string; // Composite key: `${hostId}-${year}-${month}`
  hostId: string;
  year: number;
  month: number; // 0-11 for Jan-Dec
  target: number;
  prize: string;
}

export interface SaleRecord {
  id: string;
  hostId: string;
  accountName: string;
  initialSales: number;
  finalSales: number;
  session: string;
  duration: string;
  date: string; // ISO string format
}
