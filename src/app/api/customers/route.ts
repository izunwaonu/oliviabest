import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import axios from "axios";

const API_URL = "https://sales.tcm-teska.com/wp-json/wc/v3/customers";
const { WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await axios.get(API_URL, {
      auth: { username: WC_CONSUMER_KEY!, password: WC_CONSUMER_SECRET! },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
