// import { NextRequest, NextResponse } from "next/server";
// import axios, { AxiosError } from "axios";
// import axiosRetry from "axios-retry";

// // Apply axios-retry with exponential backoff
// axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> } // ✅ Ensure params is a Promise
// ) {
//   try {
//     if (
//       !process.env.WOOCOMMERCE_STORE_URL ||
//       !process.env.WC_CONSUMER_KEY ||
//       !process.env.WC_CONSUMER_SECRET
//     ) {
//       throw new Error("Missing WooCommerce API credentials in environment variables.");
//     }

//     const { id } = await params; // ✅ Await params properly
//     const baseURL = `${process.env.WOOCOMMERCE_STORE_URL}/wp-json/wc/v3/orders/${id}`;

//     // Fetch order details from WooCommerce
//     const response = await axios.get(baseURL, {
//       auth: {
//         username: process.env.WC_CONSUMER_KEY as string,
//         password: process.env.WC_CONSUMER_SECRET as string,
//       },
//       timeout: 15000, // 15 seconds timeout
//     });

//     const order = response.data;

//     // Format order details
//     const orderDetails = {
//       id: order.id,
//       customer: `${order.billing.first_name} ${order.billing.last_name}`.trim() || "Guest",
//       total: order.total,
//       currency: order.currency,
//       date: new Date(order.date_created).toLocaleString("en-US", {
//         month: "short",
//         day: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       }),
//       status: order.status,
//       items: order.line_items.map((item: any) => ({
//         name: item.name,
//         quantity: item.quantity,
//         unit_price: item.price,
//         total_price: item.total,
//       })),
//       notes: order.customer_note || "No notes",
//     };

//     console.log(`✅ Order Fetched: ID ${id}`);

//     return NextResponse.json(orderDetails, { status: 200 });
//   } catch (error: unknown) {
//     const axiosError = error as AxiosError;
//     console.error("❌ Error fetching order:", axiosError.response?.data || axiosError.message);
//     return NextResponse.json(
//       { error: "Order not found or failed to fetch." },
//       { status: 404 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";

// Apply axios-retry with exponential backoff
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (
      !process.env.WOOCOMMERCE_STORE_URL ||
      !process.env.WC_CONSUMER_KEY ||
      !process.env.WC_CONSUMER_SECRET
    ) {
      throw new Error("Missing WooCommerce API credentials in environment variables.");
    }

    const { id } = await params;
    const baseURL = `${process.env.WOOCOMMERCE_STORE_URL}/wp-json/wc/v3/orders/${id}`;

   

    const response = await axios.get(baseURL, {
      auth: {
        username: process.env.WC_CONSUMER_KEY as string,
        password: process.env.WC_CONSUMER_SECRET as string,
      },
      timeout: 15000,
    });

    const order = response.data;

    if (!order || !order.meta_data) {
      console.error(`⚠️ Order ${id} found but metadata is missing!`);
      return NextResponse.json(
        { error: "Order found but metadata is missing." },
        { status: 404 }
      );
    }

    // Log full metadata for debugging
    // console.log(`✅ Order Fetched: ID ${id}`);
    // console.log("📜 Full Order Metadata:", JSON.stringify(order.meta_data, null, 2));

    // Convert metadata into a key-value map
    const metaDataMap = Object.fromEntries(order.meta_data.map((item: any) => [item.key, item.value]));

    // Log extracted metadata
    console.log("🔎 Extracted Metadata:", metaDataMap);

    // Processed By ID and Name
    const processedById = metaDataMap["_vtp_processed_by"] || "Unknown";
    const customFields = metaDataMap["_vtp_custom_fields"] || {};
    const processedByName = customFields[processedById] || `User ID: ${processedById}`;
    console.log(`🆔 Processed By ID: ${processedById}`);
    console.log(`👤 Processed By: ${processedByName}`);

    // Extract and format payment details
    const paymentList = metaDataMap["_vtp_payment_list"] || [];
    const formattedPayments = paymentList.map((payment: any) => ({
      method: payment.name === "Other" && payment.payment_note ? payment.payment_note : payment.name,
      amount: payment.amount,
      is_paid: payment.is_paid === "Y",
    }));
    console.log("💳 Payment Details:", formattedPayments);

    // Format order details
    const orderDetails = {
      id: order.id,
      customer: `${order.billing.first_name} ${order.billing.last_name}`.trim() || "Guest",
      phone: order.billing.phone || "No phone",
      email: order.billing.email || "No email",
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
      items: order.line_items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total,
      })),
      order_note: metaDataMap["_vtp_order_note"] || "No notes",
      payments: formattedPayments, // ✅ Fixed payment extraction
      processed_by: processedByName,
    };

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error("❌ Error fetching order:", axiosError.response?.data || axiosError.message);
    return NextResponse.json(
      { error: "Order not found or failed to fetch." },
      { status: 404 }
    );
  }
}
