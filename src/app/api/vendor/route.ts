import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all vendors
export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany();
    return NextResponse.json(vendors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}

// POST create a vendor
export async function POST(req: Request) {
  try {
    const { name, contact, address } = await req.json();
    if (!name) return NextResponse.json({ error: "Vendor name is required" }, { status: 400 });

    const vendor = await prisma.vendor.create({
      data: { name, contact, address },
    });

    return NextResponse.json(vendor);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 });
  }
}
