// import { NextResponse } from "next/server";
// import axios from "axios";
// import dayjs from "dayjs";

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const period = url.searchParams.get("period") || "month";

//   // Calculate start and end dates
//   const today = dayjs().format("YYYY-MM-DD");
//   let startDate, endDate;

//   switch (period) {
//     case "day":
//       startDate = endDate = today;
//       break;
//     case "week":
//       startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");
//       endDate = today;
//       break;
//     case "month":
//       startDate = dayjs().startOf("month").format("YYYY-MM-DD");
//       endDate = today;
//       break;
//     case "year":
//       startDate = dayjs().startOf("year").format("YYYY-MM-DD");
//       endDate = today;
//       break;
//     default:
//       startDate = dayjs().startOf("month").format("YYYY-MM-DD");
//       endDate = today;
//   }

//   console.log(`📡 Fetching sales from ${startDate} to ${endDate}`);

//   let allOrders: any[] = [];
//   let page = 1;
//   let fetchedOrders: any[];

//   try {
//     do {
//       const response = await axios.get(
//         `${process.env.WOOCOMMERCE_STORE_URL}/wp-json/wc/v3/orders`,
//         {
//           params: {
//             after: `${startDate}T00:00:00Z`,
//             before: `${endDate}T23:59:59Z`,
//             status: "completed,processing,pending",
//             per_page: 100,
//             page: page,
//           },
//           auth: {
//             username: process.env.WC_CONSUMER_KEY as string,
//             password: process.env.WC_CONSUMER_SECRET as string,
//           },
//           timeout: 60000, // <-- Increase timeout to 60 seconds
//         }
//       );

//       fetchedOrders = response.data;
//       allOrders = allOrders.concat(fetchedOrders);
//       page++;
//     } while (fetchedOrders.length === 100); // Continue fetching if there are more orders

//     console.log("✅ WooCommerce API Response - Total Orders Fetched:", allOrders.length);

//     // Calculate total orders, total sales, and net sales
//     const totalOrders = allOrders.length;
//     const totalSales = allOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
//     const netSales = allOrders.reduce(
//       (sum, order) => sum + (parseFloat(order.total) - parseFloat(order.discount_total || "0")),
//       0
//     );

//     console.log(`📊 Calculated Sales Data - Total Orders: ${totalOrders}, Total Sales: ${totalSales}, Net Sales: ${netSales}`);

//     return NextResponse.json({
//       total_sales: totalSales,
//       net_sales: netSales,
//       total_orders: totalOrders,
//     });
//   } catch (error: any) {
//     console.error("❌ WooCommerce API Error:", error.response?.data || error.message);
//     return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import axios from "axios";
import axiosRetry from "axios-retry";
import pLimit from "p-limit";
import dayjs from "dayjs";

// Configure axios retry
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const period = url.searchParams.get("period") || "month";

  const today = dayjs().format("YYYY-MM-DD");
  let startDate, endDate;

  switch (period) {
    case "day":
      startDate = endDate = today;
      break;
    case "week":
      startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");
      endDate = today;
      break;
    case "month":
      startDate = dayjs().startOf("month").format("YYYY-MM-DD");
      endDate = today;
      break;
    case "year":
      startDate = dayjs().startOf("year").format("YYYY-MM-DD");
      endDate = today;
      break;
    default:
      startDate = dayjs().startOf("month").format("YYYY-MM-DD");
      endDate = today;
  }

  console.log(`📡 Fetching sales from ${startDate} to ${endDate}`);

  try {
    let allOrders: any[] = [];

    if (period === "year") {
      // Break year into months and fetch in parallel with controlled concurrency
      const limit = pLimit(5); // Limit to 5 concurrent requests

      const monthlyFetches = Array.from({ length: 12 }, (_, idx) => {
        const monthStart = dayjs(startDate).add(idx, "month").startOf("month").format("YYYY-MM-DD");
        const monthEnd = dayjs(monthStart).endOf("month").format("YYYY-MM-DD");

        return limit(() => fetchOrders(monthStart, monthEnd));
      });

      const monthlyResults = await Promise.all(monthlyFetches);
      allOrders = monthlyResults.flat();
    } else {
      allOrders = await fetchOrders(startDate, endDate);
    }

    console.log("✅ WooCommerce API Response - Total Orders Fetched:", allOrders.length);

    // Calculate total orders, total sales, and net sales
    const totalOrders = allOrders.length;
    const totalSales = allOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const netSales = allOrders.reduce(
      (sum, order) => sum + (parseFloat(order.total) - parseFloat(order.discount_total || "0")),
      0
    );

    console.log(`📊 Calculated Sales Data - Total Orders: ${totalOrders}, Total Sales: ${totalSales}, Net Sales: ${netSales}`);

    return NextResponse.json({
      orders: allOrders, // Include orders array in the response
      total_sales: totalSales,
      net_sales: netSales,
      total_orders: totalOrders,
    });
  } catch (error: any) {
    console.error("❌ WooCommerce API Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 });
  }
}

// Helper function to fetch orders with pagination
async function fetchOrders(startDate: string, endDate: string): Promise<any[]> {
  let allOrders: any[] = [];
  let page = 1;
  let fetchedOrders: any[];

  do {
    const response = await axios.get(
      `${process.env.WOOCOMMERCE_STORE_URL}/wp-json/wc/v3/orders`,
      {
        params: {
          after: `${startDate}T00:00:00Z`,
          before: `${endDate}T23:59:59Z`,
          status: "completed,processing,pending",
          per_page: 100,
          page: page,
        },
        auth: {
          username: process.env.WC_CONSUMER_KEY as string,
          password: process.env.WC_CONSUMER_SECRET as string,
        },
        timeout: 60000,
      }
    );

    fetchedOrders = response.data;
    allOrders = allOrders.concat(fetchedOrders);
    page++;
  } while (fetchedOrders.length === 100);

  return allOrders;
}

