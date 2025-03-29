// import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// // Define styles
// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "#fff",
//     padding: 30,
//     position: "relative",
//   },
//   watermarkContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: -1,
//   },
//   watermark: {
//     width: "70%",
//     opacity: 0.07,
//   },
//   header: {
//     textAlign: "center",
//     paddingBottom: 10,
//     borderBottomWidth: 2,
//     borderBottomColor: "#007bff",
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#ff1493",
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     marginBottom: 5,
//     alignSelf: "center",
//   },
//   address: {
//     fontSize: 10,
//     color: "#555",
//     marginTop: 5,
//     textAlign: "center",
//   },
//   contactInfo: {
//     fontSize: 10,
//     textAlign: "center",
//     color: "#007bff",
//     textDecoration: "underline",
//   },
//   phone: {
//     fontSize: 10,
//     textAlign: "center",
//     color: "#ff1493",
//   },
//   section: {
//     marginVertical: 10,
//     padding: 10,
//     borderRadius: 5,
//     backgroundColor: "#f3f4f6",
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   combinedSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#e0f7fa",
//     padding: 10,
//     borderRadius: 5,
//   },
//   sectionText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#007bff",
//   },
//   table: {
//     flexDirection: "column",
//     width: "100%",
//     marginTop: 10,
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//     paddingVertical: 5,
//   },
//   tableHeader: {
//     backgroundColor: "#007bff",
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   tableCell: {
//     flex: 1,
//     padding: 5,
//     fontSize: 10,
//     textAlign: "center",
//   },
//   footer: {
//     marginTop: 20,
//     textAlign: "center",
//     fontSize: 10,
//     color: "#555",
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//     paddingTop: 10,
//   },
//   footerContainer: {
//     marginTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//     paddingTop: 10,
//     textAlign: "center",
//   },
//   signatories: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 15,
//   },
//   signatureBlock: {
//     alignItems: "center",
//     width: "45%",
//   },
//   signatureLine: {
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   signatureText: {
//     fontSize: 10,
//     color: "#555",
//     marginTop: 3,
//   },
//   oddRow: {
//     backgroundColor: "#f1f8ff",
//   },
//   evenRow: {
//     backgroundColor: "#ffffff",
//   },
// });

// // Define TypeScript types for order props
// interface OrderItem {
//   quantity: number;
//   name: string;
//   unit_price: string;
//   total_price: string;
// }

// interface Order {
//   id: string;
//   date: string;
//   status: string;
//   customer: string;
//   notes: string;
//   processedBy: string;
//   items: OrderItem[];
// }

// const InvoicePDF = ({ order }: { order: Order }) => {
//   const grandTotal = order.items.reduce((sum, item) => sum + parseFloat(item.total_price) || 0, 0);

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Watermark Background */}
//         <View style={styles.watermarkContainer}>
//           <Image src="/logo.png" style={styles.watermark} />
//         </View>

//         {/* Letterhead */}
//         <View style={styles.header}>
//           <Image src="/logo.png" style={styles.logo} />
//           <Text style={styles.title}>TCM NNEWI (WAREHOUSE)</Text>
//           <Text style={styles.address}>19B Abo Street, (Behind St. Peter Claver Catholic Church),</Text>
//           <Text style={styles.address}>Nnewichi, Nnewi, AN, 435101, Nigeria</Text>
//           <Text style={styles.phone}>Phone: 08137063722</Text>
//           <Text style={styles.contactInfo}>Email: info@tcm-teska.com</Text>
//         </View>

//         {/* Invoice and Customer Details Combined */}
//         <View style={styles.combinedSection}>
//           <View>
//             <Text style={styles.sectionText}>Invoice - Order #{order.id}</Text>
//             <Text style={styles.phone}>Date: {order.date}</Text>
//             <Text style={styles.phone}>Status: {order.status}</Text>
//           </View>
//           <View>
//             <Text style={styles.sectionText}>Customer: {order.customer}</Text>
//             <Text style={styles.phone}>Notes: {order.notes}</Text>
//             <Text style={styles.phone}>Processed by: {order.processedBy}</Text>
//           </View>
//         </View>

//         {/* Items Table */}
//         <View style={styles.section}>
//           <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Order Items</Text>
//           <View style={[styles.tableRow, styles.tableHeader]}>
//             <Text style={styles.tableCell}>Check</Text>
//             <Text style={styles.tableCell}>Quantity</Text>
//             <Text style={styles.tableCell}>Item Name</Text>
//             <Text style={styles.tableCell}>Unit Price (NGN)</Text>
//             <Text style={styles.tableCell}>Total Price (NGN)</Text>
//           </View>
//           {order.items.map((item: OrderItem, index: number) => (
//             <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
//               <Text style={styles.tableCell}>{""}</Text> {/* Empty column for "Check" */}
//               <Text style={styles.tableCell}>{item.quantity}</Text>
//               <Text style={styles.tableCell}>{item.name}</Text>
//               <Text style={styles.tableCell}>{parseFloat(item.unit_price).toLocaleString()}</Text>
//               <Text style={styles.tableCell}>{parseFloat(item.total_price).toLocaleString()}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Grand Total */}
//         <View style={styles.section}>
//           <Text style={{ fontWeight: "bold", textAlign: "right" }}>
//             Grand Total: NGN {grandTotal.toLocaleString()}
//           </Text>
//         </View>

//         {/* Footer */}
//         <View style={styles.footerContainer}>
//           {/* Signatories Section */}
//           <View style={styles.signatories}>
//             <View style={styles.signatureBlock}>
//               <Text style={styles.signatureLine}>________________________</Text>
//               <Text style={styles.signatureText}>Supplier's Signature</Text>
//             </View>
//             <View style={styles.signatureBlock}>
//               <Text style={styles.signatureLine}>________________________</Text>
//               <Text style={styles.signatureText}>Confirmer's Signature</Text>
//             </View>
//           </View>
//           <Text style={styles.footer}>Thank you for your purchase!</Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default InvoicePDF;

import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// Define styles
const getPaymentLabel = (payment: any): string => {
  if (!payment) return "Unknown"; // Handle missing payment object

  const method = payment.method?.trim().toLowerCase();
  const type = payment.type?.trim();

  if (method === "swipe machine") return "POS/Transfer"; // ✅ FIXED: Swipe Machine 
  if (method === "other" || type === "O") return "Debit"; // ✅ FIXED: "Others" → Debit

  const paymentMethodMapping: Record<string, string> = {
    C: "Cash",
    CC: "Credit Card",
    B: "Bank Transfer",
    P: "PayPal",
  };

  return paymentMethodMapping[type] || type || "Unknown";
};


const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 30,
    position: "relative",
  },
  watermarkContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  watermark: {
    width: "70%",
    opacity: 0.07,
  },
  header: {
    textAlign: "center",
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff1493",
  },

  footer: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 12,
        color: "#555",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingTop: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 5,
    alignSelf: "center",
  },
  address: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
    textAlign: "center",
  },
  contactInfo: {
    fontSize: 12,
    textAlign: "center",
    color: "#007bff",
    textDecoration: "underline",
  },
  phone: {
    fontSize: 12,
    textAlign: "center",
    color: "#ff1493",
  },
  combinedSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#e0f7fa",
    borderRadius: 5,
  },
  leftColumn: {
    width: "50%",
    paddingRight: 10,
  },
  rightColumn: {
    width: "50%",
    paddingLeft: 10,
  },
  sectionText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#007bff",
  },
  section: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  table: {
    flexDirection: "column",
    width: "100%",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
    fontSize: 13,
    textAlign: "center",
  },
  checkColumn: {
    width: "8%",
  },
  quantityColumn: {
    width: "10%",
  },
  itemNameColumn: {
    width: "42%",
  },
  priceColumn: {
    width: "20%",
  },
  totalColumn: {
    width: "20%",
  },
  totalQuantityRow: {
    fontSize: 13,
    fontWeight: "bold",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#000",
    textAlign: "right",
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    color: "#ff1493",
    backgroundColor: "#ffe6f2",
    padding: 10,
    borderRadius: 5,
  },
  paymentDetails: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    textAlign: "right",
    borderColor: "#4caf50",
  },
  footerContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    textAlign: "center",
  },
  paymentSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 5,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 5,
  },
  paymentText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 3,
  },
  paymentLabel: {
    fontWeight: "bold",
  },
  paymentNote: {
    fontSize: 12,
    color: "#555",
  },
  signatories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  signatureBlock: {
    alignItems: "center",
    width: "45%",
  },
  signatureLine: {
    fontSize: 14,
    fontWeight: "bold",
  },
  signatureText: {
    fontSize: 12,
    color: "#555",
    marginTop: 3,
  },
});

// Define TypeScript types for order props
interface OrderItem {
  quantity: number;
  name: string;
  unit_price: string;
  total_price: string;
}

interface Payment {
  type: string;
  amount: number;
  payment_note?: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  customer: string;
  phone: string; // Added phone number
  notes: string;
  processedBy: string;
  items: OrderItem[];
  payments?: Payment[]; // Added payments property
}


const InvoicePDF = ({ order }: { order: Order }) => {
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = order.items.reduce((sum, item) => sum + parseFloat(item.total_price) || 0, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark Background */}
        <View style={styles.watermarkContainer}>
          <Image src="/logo.png" style={styles.watermark} />
        </View>

        {/* Letterhead */}
        <View style={styles.header}>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.title}>TCM NNEWI (WAREHOUSE)</Text>
          <Text style={styles.address}>19B Abo Street, (Behind St. Peter Claver Catholic Church),</Text>
          <Text style={styles.address}>Nnewichi, Nnewi, AN, 435101, Nigeria</Text>
          <Text style={styles.phone}>Phone: 08137063722</Text>
          <Text style={styles.contactInfo}>Email: info@tcm-teska.com</Text>
        </View>

        {/* Invoice and Customer Details */}
        <View style={styles.combinedSection}>
          <View style={styles.leftColumn}>
            <Text style={styles.paymentTitle}>Customer: {order.customer}</Text>
            <Text style={styles.paymentNote}>Phone Number: {order.phone}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.paymentTitle}>Invoice - Order #{order.id}</Text>
            <Text style={styles.paymentNote}>Date: {order.date}</Text>

          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Order Items</Text>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.checkColumn]}>✔</Text>
            <Text style={[styles.tableCell, styles.quantityColumn]}>Qty</Text>
            <Text style={[styles.tableCell, styles.itemNameColumn]}>Item Name</Text>
            <Text style={[styles.tableCell, styles.priceColumn]}>Unit Price</Text>
            <Text style={[styles.tableCell, styles.totalColumn]}>Total Price</Text>
          </View>
          {order.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.checkColumn]}>{""}</Text>
              <Text style={[styles.tableCell, styles.quantityColumn]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.itemNameColumn]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.priceColumn]}>{item.unit_price}</Text>
              <Text style={[styles.tableCell, styles.totalColumn]}>{item.total_price}</Text>
            </View>
          ))}
          <Text style={styles.totalQuantityRow}>Total Quantity: {totalQuantity}</Text>
        </View>

        {/* Grand Total */}
        <Text style={styles.grandTotal}>Grand Total: NGN {grandTotal.toLocaleString()}</Text>

        {/* Payment Details Section */}
<View style={styles.paymentSection}>
  <Text style={styles.paymentTitle}>Payment Details</Text>
  {order.payments && order.payments.length > 0 ? (
    order.payments.map((payment: any, index: number) => (
      <Text key={index} style={styles.paymentText}>
        <Text style={styles.paymentLabel}>{getPaymentLabel(payment)}:</Text> NGN{payment.amount.toFixed(2)}
        {payment.type === "O" && (
          <Text style={styles.paymentNote}> (Note: {payment.payment_note || "No Note Provided"})</Text>
        )}
      </Text>
    ))
  ) : (
    <Text style={styles.paymentText}>No payment details available</Text>
  )}
</View>

        
//         {/* Footer */}
//         <View style={styles.footerContainer}>
//           {/* Signatories Section */}
//           <View style={styles.signatories}>
//             <View style={styles.signatureBlock}>
//               <Text style={styles.signatureLine}>________________________</Text>
//               <Text style={styles.signatureText}>Supplier's Signature</Text>
//             </View>
//             <View style={styles.signatureBlock}>
//               <Text style={styles.signatureLine}>________________________</Text>
//               <Text style={styles.signatureText}>Confirmer's Signature</Text>
//             </View>
//           </View>
//           <Text style={styles.footer}>Thank you for your patronage, and may you remain blessed.</Text>
//         </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
