"use client";

import { useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "@/app/components/InvoicePDF";

export default function InvoiceButtons({ order }: { order: any }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
        onClick={() => setShowPreview(!showPreview)}
      >
        {showPreview ? "Hide Preview" : "Show Preview"}
      </button>

      {showPreview && (
        <PDFViewer width="100%" height={400} className="mt-4 border">
          <InvoicePDF order={order} />
        </PDFViewer>
      )}

      <PDFDownloadLink document={<InvoicePDF order={order} />} fileName={`invoice_${order.id}.pdf`}>
        {({ loading }) => (
          <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md mt-2">
            {loading ? "Generating..." : "Download PDF"}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
