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

    // Format order data
    const formatDateTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    const orders = allOrders.map((order: any) => ({
      id: order.id,
      customer: `${order.billing.first_name} ${order.billing.last_name}`.trim() || "Guest",
      items: order.line_items 
        ? order.line_items.map((item: any) => `${item.name} (${item.quantity})`).join(", ") 
        : "No Items",
      total: order.total,
      currency: order.currency,
      date: formatDateTime(order.date_created),
    }));
    console.log(`✅ Today's Orders Fetched: ${orders.length}`);

    return NextResponse.json(orders, { status: 200 });
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error("❌ Error fetching WooCommerce orders:", axiosError.response?.data || axiosError.message);
    return NextResponse.json({ error: "Failed to fetch orders. Try again later." }, { status: 500 });
  }
}
