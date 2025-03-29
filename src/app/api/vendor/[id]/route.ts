// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// // PUT - Update vendor
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const { name, contact, address } = await req.json();
//     const updatedVendor = await prisma.vendor.update({
//       where: { id: params.id },
//       data: { name, contact, address },
//     });

//     return NextResponse.json(updatedVendor);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 });
//   }
// }

// // DELETE - Remove vendor
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await prisma.vendor.delete({ where: { id: params.id } });
//     return NextResponse.json({ message: "Vendor deleted" });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ PUT - Update vendor
export async function PUT(req: Request, { params }: { params: Record<string, string> }) {
  try {
    const { name, contact, address } = await req.json();
    
    const updatedVendor = await prisma.vendor.update({
      where: { id: params.id }, // ✅ Fixed: Ensures correct `params` structure
      data: { name, contact, address },
    });

    return NextResponse.json(updatedVendor);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 });
  }
}

// ✅ DELETE - Remove vendor
export async function DELETE(req: Request, { params }: { params: Record<string, string> }) {
  try {
    await prisma.vendor.delete({
      where: { id: params.id }, // ✅ Fixed: Ensures correct `params` structure
    });

    return NextResponse.json({ message: "Vendor deleted" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 });
  }
}
