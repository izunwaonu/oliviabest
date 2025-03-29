"use client";

import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "@/app/components/InvoicePDF";
import { useEffect, useState } from "react";
import axios from "axios";

export default function InvoicePage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    axios.get(`/api/orders/${params.id}`).then((res) => {
      setOrder(res.data);
    });
  }, [params.id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Invoice Preview</h1>
      <PDFViewer width="100%" height={600} className="border">
        <InvoicePDF order={order} />
      </PDFViewer>
    </div>
  );
}
