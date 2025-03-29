import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import dayjs from "dayjs";

// Apply axios-retry with exponential backoff
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export async function GET(req: NextRequest) {
  try {
    if (!process.env.WOOCOMMERCE_STORE_URL || !process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
      throw new Error("Missing WooCommerce API credentials in environment variables.");
    }

    const baseURL = `${process.env.WOOCOMMERCE_STORE_URL}/wp-json/wc/v3/orders`;

    // Calculate today's start and end time
    const todayStart = dayjs().startOf("day").toISOString();
    const todayEnd = dayjs().endOf("day").toISOString();

    let allOrders: any[] = [];
    let page = 1;
    let fetchedOrders: any[] = [];

    // Fetch today's orders with pagination
    do {
      const response = await axios.get(baseURL, {
        params: {
          per_page: 100, // Max per WooCommerce API
          page: page,
          order: "desc",
          after: todayStart,
          before: todayEnd,
        },
        auth: {
          username: process.env.WC_CONSUMER_KEY as string,
          password: process.env.WC_CONSUMER_SECRET as string,
        },
        timeout: 15000, // 15 seconds timeout
      });

      fetchedOrders = response.data;
      allOrders = allOrders.concat(fetchedOrders);
      page++;
    } while (fetchedOrders.length === 100); // Continue if more pages exist

    // Process order items to calculate products sold
    const productSales: Record<string, { name: string; quantity: number }> = {};

    allOrders.forEach((order) => {
      order.line_items.forEach((item: any) => {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = { name: item.name, quantity: 0 };
        }
        productSales[item.product_id].quantity += item.quantity;
      });
    });

    console.log(`✅ Products Sold Today: ${Object.keys(productSales).length}`);

    return NextResponse.json(Object.values(productSales), { status: 200 });
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error("❌ Error fetching WooCommerce orders:", axiosError.response?.data || axiosError.message);
    return NextResponse.json({ error: "Failed to fetch sales data. Try again later." }, { status: 500 });
  }
}
