// /types/wooTypes.ts

export interface Order {
    id: number;
    status: string;
    total: string;
    currency: string;
    date_created: string;
    billing: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
  }
  
  export interface SalesData {
    total_sales: string;
    total_orders: number;
    total_refunds: string;
    net_sales: string;
  }
  