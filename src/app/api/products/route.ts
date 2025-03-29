import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import axios from "axios";

const API_URL = "https://sales.tcm-teska.com/wp-json/wc/v3/products";
const { WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;

// Define product type
interface Product {
  id: number;
  name: string;
  stock_status: string;
  stock_quantity: number | null;
  price: string;
 
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let allProducts: Product[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get<Product[]>(API_URL, {
        params: { per_page: 100, page }, // Fetch 100 products per request
        auth: { username: WC_CONSUMER_KEY!, password: WC_CONSUMER_SECRET! },
      });

      const products = response.data;
      allProducts = [...allProducts, ...products];

      hasMore = products.length === 100; // If less than 100, stop fetching
      page++; // Move to next page
    }

    return NextResponse.json(allProducts);
  } catch (error: any) {
    console.error(
      "Error fetching products:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
