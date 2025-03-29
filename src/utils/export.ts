"use client";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ✅ Function to Load Image as Base64
async function getBase64Image(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to load logo:", error);
    return null; // Return null if the logo fails to load
  }
}

// ✅ Define Types for Payment & Debtor
interface Payment {
  id: string;
  amount: number;
  paidAt: string;
  user: { name: string };
}

interface Debtor {
  id: string;
  name: string;
  invoiceNo: string;
  amountOwed: number;
  payments: Payment[];
}

// ✅ Function to Generate PDF for Payment History
export async function exportPaymentHistoryToPDF(debtor: Debtor) {
  const doc = new jsPDF();

  // ✅ Load Logo as Base64
  const imgData = await getBase64Image("/logo.png");

  // ✅ Add Company Logo
  if (imgData) {
    doc.addImage(imgData, "PNG", 15, 10, 30, 30);
  }

  // ✅ Company Header
  doc.setFontSize(14);
  doc.text("TCM-TESKA", 60, 20);
  doc.setFontSize(10);
  doc.text("19 B, Abo Street, (Behind St. Peter Claver's Catholic Church)", 60, 27);
  doc.text("Nnewi Ichi, Nnewi, AN, 435101, NG", 60, 34);
  doc.text("08137063722 | info@tcm-teska.com", 60, 41);

  // ✅ Payment History Title
  doc.setFontSize(14);
  doc.text(`Payment History for ${debtor.name}`, 15, 55);
  doc.setFontSize(12);
  doc.text(`Invoice No: ${debtor.invoiceNo}`, 15, 62);
  doc.text(`Remaining Balance: ₦${debtor.amountOwed.toFixed(2)}`, 15, 70);

  // ✅ Table Headers
  const tableColumn = ["Amount Paid", "Paid On", "Recorded By"];
  const tableRows: any[] = [];

  // ✅ Fill Table Rows
  debtor.payments.forEach((payment) => {
    const rowData = [
      `₦${payment.amount.toFixed(2)}`,
      new Date(payment.paidAt).toLocaleDateString(),
      payment.user.name,
    ];
    tableRows.push(rowData);
  });

  // ✅ Create Table
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 85,
  });

  // ✅ Save PDF
  doc.save(`Payment_History_${debtor.name}.pdf`);
}

// ✅ Function to Print Payment History
export async function printPaymentHistory(debtor: Debtor) {
  const doc = new jsPDF();

  // ✅ Load Logo as Base64
  const imgData = await getBase64Image("/logo.png");

  // ✅ Add Company Logo
  if (imgData) {
    doc.addImage(imgData, "PNG", 15, 10, 30, 30);
  }

  // ✅ Company Header
  doc.setFontSize(14);
  doc.text("TCM-TESKA", 60, 20);
  doc.setFontSize(10);
  doc.text("19 B, Abo Street, (Behind St. Peter Claver's Catholic Church)", 60, 27);
  doc.text("Nnewi Ichi, Nnewi, AN, 435101, NG", 60, 34);
  doc.text("08137063722 | info@tcm-teska.com", 60, 41);

  // ✅ Payment History Title
  doc.setFontSize(14);
  doc.text(`Payment History for ${debtor.name}`, 15, 55);
  doc.setFontSize(12);
  doc.text(`Invoice No: ${debtor.invoiceNo}`, 15, 62);
  doc.text(`Remaining Balance: ₦${debtor.amountOwed.toFixed(2)}`, 15, 70);

  // ✅ Table Headers
  const tableColumn = ["Amount Paid", "Paid On", "Recorded By"];
  const tableRows: any[] = [];

  // ✅ Fill Table Rows
  debtor.payments.forEach((payment) => {
    const rowData = [
      `₦${payment.amount.toFixed(2)}`,
      new Date(payment.paidAt).toLocaleDateString(),
      payment.user.name,
    ];
    tableRows.push(rowData);
  });

  // ✅ Create Table
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 85,
  });

  // ✅ Print PDF Instead of Saving
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
}
