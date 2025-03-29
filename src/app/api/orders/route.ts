
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";

// Apply axios-retry with exponential backoff
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export async function GET(req: NextRequest) {
  try {
    // Ensure environment variables are set
    if (!process.env.WOOCOMMERCE_STORE_URL || !process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
      throw new Error("Missing WooCommerce API credentials in environment variables.");
    }

    const baseURL = `${process.env.WOOCOMMERCE_STORE_URL}/wp-json/wc/v3/orders`;

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const searchQuery = searchParams.get("search") || "";

    // Build API request parameters
    const params: any = {
      per_page: 50, // Pagination: 50 orders per page
      page: page,
      order: "desc",
    };

    // Add search filter
    if (searchQuery) {
      params.search = searchQuery;
    }

    // Fetch orders from WooCommerce
    const response = await axios.get(baseURL, {
      params,
      auth: {
        username: process.env.WC_CONSUMER_KEY as string,
        password: process.env.WC_CONSUMER_SECRET as string,
      },
      timeout: 15000, // 15 seconds timeout
    });

    const ordersData = response.data;

    // Format orders for frontend
    const orders = ordersData.map((order: any) => ({
      id: order.id,
      customer: `${order.billing.first_name} ${order.billing.last_name}`.trim() || "Guest",
      total: order.total,
      currency: order.currency,
      date: new Date(order.date_created).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      status: order.status,
    }));

    console.log(`✅ Orders Fetched: ${orders.length}`);

    return NextResponse.json({ orders, total: response.headers["x-wp-total"] }, { status: 200 });
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error("❌ Error fetching WooCommerce orders:", axiosError.response?.data || axiosError.message);
    return NextResponse.json({ error: "Failed to fetch orders. Try again later." }, { status: 500 });
  }
}
