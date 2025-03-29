
// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import InvoiceButtons from "@/app/components/InvoiceButtons";
// import dayjs from "dayjs";


// export default function OrderDetails() {
//   const { id } = useParams();
//   const [order, setOrder] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [processedByName, setProcessedByName] = useState<string>("Unknown");
//   const router = useRouter();

//   useEffect(() => {
//     if (!id) return;

//     axios
//         .get(`/api/orders/${id}`)
//         .then(async (res) => {
//             const orderData = res.data;
//             console.log("🔹 Full Order Data:", orderData);
//             setOrder(orderData);
//             setIsLoading(false);

//             // Extract Processed By ID safely & convert to number
//             const processedById = Number(orderData?._vtp_processed_by) || null;
//             const customFields = orderData?._vtp_custom_fields || {};

            

//             // Check if customFields already has the name
//             const processedByIdStr = processedById ? processedById.toString() : "";
//             const customFieldName = processedByIdStr ? customFields?.[processedByIdStr] : undefined;
            
//             if (customFieldName) {
//                 setProcessedByName(customFieldName);
//                 return;
//             }

//             if (processedById) {
//                 try {
//                     // Fetch WooCommerce Customers
//                     const wcUsersResponse = await axios.get(`/wp-json/wc/v3/customers`);
                    

//                     const wcUsers: { id: number; first_name: string; last_name: string }[] = wcUsersResponse.data || [];
//                     const matchedWCUser = wcUsers.find(user => user.id === processedById);

//                     if (matchedWCUser) {
//                         console.log(`✅ Matched WooCommerce User for ID ${processedById}:`, matchedWCUser);
//                         setProcessedByName(`${matchedWCUser.first_name} ${matchedWCUser.last_name}`);
//                         return;
//                     }

//                     // Fetch WordPress Users (if not found in WooCommerce)
//                     const wpUsersResponse = await axios.get(`/wp-json/wp/v2/users`);
                   

//                     const wpUsers: { id: number; name: string }[] = wpUsersResponse.data || [];
//                     const matchedWPUser = wpUsers.find(user => user.id === processedById);

//                     if (matchedWPUser) {
//                         console.log(`✅ Matched WordPress User for ID ${processedById}:`, matchedWPUser);
//                         setProcessedByName(matchedWPUser.name);
//                     } else {
//                         console.warn(`⚠️ No user found for ID ${processedById}`);
//                         setProcessedByName(`User ID: ${processedById}`);
//                     }
//                 } catch (userError) {
//                     console.warn("⚠️ Error fetching users:", userError);
//                     setProcessedByName(`User ID: ${processedById}`);
//                 }
//             } else {
//                 setProcessedByName("User ID: Unknown");
//             }
//         })
//         .catch((err) => {
//             console.error("❌ Error fetching order:", err);
//             setError("Failed to fetch order details.");
//             setIsLoading(false);
//         });
// }, [id]);

  
  
  
  
  

//   if (isLoading) {
//     return <p className="text-center text-gray-500 mt-10">Loading...</p>;
//   }

//   if (error || !order || !order.items) {
//     return <p className="text-center text-red-500 mt-10">{error || "Error loading order details."}</p>;
//   }

//   // Payment Method Mapping
//   const getPaymentLabel = (payment: any): string => {
//     if (!payment) return "Cash"; // Handle missing payment object

//     const method = payment.method?.trim().toLowerCase();
//     const type = payment.type?.trim();

//     if (method === "swipe machine") return "POS/Transfer"; // ✅ FIXED: Swipe Machine 
//     if (method === "other" || type === "O") return "Debit"; // ✅ FIXED: "Others" → Debit
//     if (method === "cash" || type === "C") return "Cash"; // ✅ FIXED: "cash" → Cash

//     const paymentMethodMapping: Record<string, string> = {
//       C: "Cash",
//       CC: "Credit Card",
//       B: "Bank Transfer",
//       P: "PayPal",
//     };

//     return paymentMethodMapping[type] || type || "Unknown";
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-6">
//       <button
//         onClick={() => router.push("/orders")}
//         className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//       >
//         ← Back to Orders
//       </button>
//       {/* Order Card */}
//       <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 border border-gray-200">
//         <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4">
//           Invoice - Order #{order.id}
//         </h1>
//         <p className="text-gray-600">
//           Status: <span className="font-semibold text-green-600">{order.status}</span>
//         </p>
//         <p className="text-gray-600">
//           Date: <span className="font-semibold">{dayjs(order.date).format("MMM DD, YYYY - hh:mm A")}</span>
//         </p>

//         {/* Customer Details */}
//         <div className="mt-4 sm:mt-6 p-4 bg-gray-100 rounded-lg">
//           <h2 className="text-lg sm:text-xl font-semibold text-blue-600">Customer Details</h2>
//           <p className="text-gray-700">
//             <span className="font-medium">Name:</span> {order.customer || "N/A"}
//           </p>
//           <p className="text-gray-700">
//             <span className="font-medium">Phone:</span> {order.phone || "No Phone Provided"}
//           </p>
//           <p className="text-gray-700">
//             <span className="font-medium">Order Note:</span> {order.order_note || "N/A"}
//           </p>
//           {/* <p className="text-gray-700">
//             <span className="font-medium">Processed by:</span> {processedByName}
//           </p> */}
//         </div>

//         {/* Payment Details */}
//         <div className="mt-4 sm:mt-6 p-4 bg-gray-100 rounded-lg">
//           <h2 className="text-lg sm:text-xl font-semibold text-blue-600">Payment Details</h2>
//           {order.payments && order.payments.length > 0 ? (
//             order.payments.map((payment: any, index: number) => (
//               <p key={index} className="text-gray-700">
//                 <span className="font-medium">{getPaymentLabel(payment)}:</span> NGN{payment.amount.toFixed(2)}
//                 {payment.type === "O" && (
//                   <span className="text-gray-500"> (Note: {payment.payment_note || "No Note Provided"})</span>
//                 )}
//               </p>
//             ))
//           ) : (
//             <p className="text-gray-700">No payment details available</p>
//           )}
//         </div>

//         {/* Invoice Buttons */}
//         <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4">
//           <InvoiceButtons order={order} />
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import InvoiceButtons from "@/app/components/InvoiceButtons"
import dayjs from "dayjs"
import { ArrowLeft, Loader2, Sun, Moon } from "lucide-react"

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processedByName, setProcessedByName] = useState<string>("Unknown")
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!id) return

    axios
      .get(`/api/orders/${id}`)
      .then(async (res) => {
        const orderData = res.data
        console.log("🔹 Full Order Data:", orderData)
        setOrder(orderData)
        setIsLoading(false)

        // Extract Processed By ID safely & convert to number
        const processedById = Number(orderData?._vtp_processed_by) || null
        const customFields = orderData?._vtp_custom_fields || {}

        // Check if customFields already has the name
        const processedByIdStr = processedById ? processedById.toString() : ""
        const customFieldName = processedByIdStr ? customFields?.[processedByIdStr] : undefined

        if (customFieldName) {
          setProcessedByName(customFieldName)
          return
        }

        if (processedById) {
          try {
            // Fetch WooCommerce Customers
            const wcUsersResponse = await axios.get(`/wp-json/wc/v3/customers`)

            const wcUsers: { id: number; first_name: string; last_name: string }[] = wcUsersResponse.data || []
            const matchedWCUser = wcUsers.find((user) => user.id === processedById)

            if (matchedWCUser) {
              console.log(`✅ Matched WooCommerce User for ID ${processedById}:`, matchedWCUser)
              setProcessedByName(`${matchedWCUser.first_name} ${matchedWCUser.last_name}`)
              return
            }

            // Fetch WordPress Users (if not found in WooCommerce)
            const wpUsersResponse = await axios.get(`/wp-json/wp/v2/users`)

            const wpUsers: { id: number; name: string }[] = wpUsersResponse.data || []
            const matchedWPUser = wpUsers.find((user) => user.id === processedById)

            if (matchedWPUser) {
              console.log(`✅ Matched WordPress User for ID ${processedById}:`, matchedWPUser)
              setProcessedByName(matchedWPUser.name)
            } else {
              console.warn(`⚠️ No user found for ID ${processedById}`)
              setProcessedByName(`User ID: ${processedById}`)
            }
          } catch (userError) {
            console.warn("⚠️ Error fetching users:", userError)
            setProcessedByName(`User ID: ${processedById}`)
          }
        } else {
          setProcessedByName("User ID: Unknown")
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching order:", err)
        setError("Failed to fetch order details.")
        setIsLoading(false)
      })
  }, [id])

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  // Payment Method Mapping
  const getPaymentLabel = (payment: any): string => {
    if (!payment) return "Cash" // Handle missing payment object

    const method = payment.method?.trim().toLowerCase()
    const type = payment.type?.trim()

    if (method === "swipe machine") return "POS/Transfer" // ✅ FIXED: Swipe Machine
    if (method === "other" || type === "O") return "Debit" // ✅ FIXED: "Others" → Debit
    if (method === "cash" || type === "C") return "Cash" // ✅ FIXED: "cash" → Cash

    const paymentMethodMapping: Record<string, string> = {
      C: "Cash",
      CC: "Credit Card",
      B: "Bank Transfer",
      P: "PayPal",
    }

    return paymentMethodMapping[type] || type || "Unknown"
  }

  // Theme-dependent styles
  const bgColor = isDarkTheme
    ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    : "bg-gradient-to-br from-slate-100 via-white to-slate-100"

  const cardBg = isDarkTheme ? "bg-slate-800/50 border-slate-700" : "bg-white/80 border-slate-200"

  const sectionBg = isDarkTheme ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200"

  const textColor = isDarkTheme ? "text-white" : "text-slate-800"
  const subtextColor = isDarkTheme ? "text-slate-300" : "text-slate-600"
  const headingColor = isDarkTheme ? "text-rose-400" : "text-rose-600"
  const subheadingColor = isDarkTheme ? "text-blue-400" : "text-blue-600"
  const borderColor = isDarkTheme ? "border-slate-600" : "border-slate-200"
  const buttonBg = isDarkTheme
    ? "bg-slate-700 hover:bg-slate-600 text-white"
    : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-200"

  if (isLoading) {
    return (
      <div className={`${bgColor} min-h-screen flex items-center justify-center transition-colors duration-300`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={`animate-spin ${headingColor} w-10 h-10`} />
          <p className={`${textColor} text-lg`}>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order || !order.items) {
    return (
      <div className={`${bgColor} min-h-screen flex items-center justify-center p-4 transition-colors duration-300`}>
        <div className={`${cardBg} rounded-xl p-6 max-w-md text-center shadow-lg border`}>
          <p className={`${isDarkTheme ? "text-red-400" : "text-red-600"} text-lg font-medium mb-4`}>
            {error || "Error loading order details."}
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-lg font-medium"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  // Get status color based on order status
  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || ""

    if (statusLower.includes("complete")) return isDarkTheme ? "text-green-400" : "text-green-600"
    if (statusLower.includes("pending")) return isDarkTheme ? "text-amber-400" : "text-amber-600"
    if (statusLower.includes("process")) return isDarkTheme ? "text-blue-400" : "text-blue-600"
    if (statusLower.includes("cancel")) return isDarkTheme ? "text-red-400" : "text-red-600"

    return textColor
  }

  return (
    <div className={`${bgColor} min-h-screen transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.push("/orders")}
            className={`px-4 py-2 ${buttonBg} rounded-lg flex items-center gap-2 transition-colors`}
          >
            <ArrowLeft size={18} />
            Back to Orders
          </button>

          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full ${buttonBg} transition-colors`}
            aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Order Card */}
        <div className={`${cardBg} shadow-lg rounded-xl p-4 sm:p-6 border transition-colors duration-300`}>
          <h1 className={`text-2xl sm:text-3xl font-bold ${headingColor} mb-4 transition-colors duration-300`}>
            Invoice - Order #{order.id}
          </h1>
          <p className={subtextColor}>
            Status: <span className={`font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
          </p>
          <p className={subtextColor}>
            Date: <span className="font-semibold">{dayjs(order.date).format("MMM DD, YYYY - hh:mm A")}</span>
          </p>

          {/* Customer Details */}
          <div className={`mt-6 p-4 ${sectionBg} rounded-lg border transition-colors duration-300`}>
            <h2 className={`text-lg sm:text-xl font-semibold ${subheadingColor} mb-3 transition-colors duration-300`}>
              Customer Details
            </h2>
            <div className="space-y-2">
              <p className={subtextColor}>
                <span className={`font-medium ${textColor}`}>Name:</span> {order.customer || "N/A"}
              </p>
              <p className={subtextColor}>
                <span className={`font-medium ${textColor}`}>Phone:</span> {order.phone || "No Phone Provided"}
              </p>
              <p className={subtextColor}>
                <span className={`font-medium ${textColor}`}>Order Note:</span> {order.order_note || "N/A"}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className={`mt-6 p-4 ${sectionBg} rounded-lg border transition-colors duration-300`}>
            <h2 className={`text-lg sm:text-xl font-semibold ${subheadingColor} mb-3 transition-colors duration-300`}>
              Payment Details
            </h2>
            {order.payments && order.payments.length > 0 ? (
              <div className="space-y-2">
                {order.payments.map((payment: any, index: number) => (
                  <p key={index} className={subtextColor}>
                    <span className={`font-medium ${textColor}`}>{getPaymentLabel(payment)}:</span> NGN{" "}
                    {payment.amount.toFixed(2)}
                    {payment.type === "O" && (
                      <span className={isDarkTheme ? "text-slate-400" : "text-slate-500"}>
                        {" "}
                        (Note: {payment.payment_note || "No Note Provided"})
                      </span>
                    )}
                  </p>
                ))}
              </div>
            ) : (
              <p className={subtextColor}>No payment details available</p>
            )}
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className={`mt-6 ${sectionBg} rounded-lg overflow-hidden border transition-colors duration-300`}>
              <h2
                className={`text-lg sm:text-xl font-semibold ${subheadingColor} p-4 border-b ${borderColor} transition-colors duration-300`}
              >
                Order Items
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${borderColor}`}>
                      <th className={`p-4 text-left font-medium ${subtextColor}`}>Item</th>
                      <th className={`p-4 text-center font-medium ${subtextColor}`}>Quantity</th>
                      <th className={`p-4 text-right font-medium ${subtextColor}`}>Price</th>
                      <th className={`p-4 text-right font-medium ${subtextColor}`}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className={`border-b ${borderColor} ${isDarkTheme ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}
                      >
                        <td className={`p-4 ${textColor}`}>{item.name}</td>
                        <td className={`p-4 text-center ${subtextColor}`}>{item.quantity}</td>
                        <td className={`p-4 text-right ${subtextColor}`}>NGN {Number(item.price).toFixed(2)}</td>
                        <td className={`p-4 text-right font-medium ${textColor}`}>
                          NGN {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className={isDarkTheme ? "bg-slate-700/30" : "bg-slate-50"}>
                      <td colSpan={2} className="p-4"></td>
                      <td className={`p-4 text-right font-medium ${textColor}`}>Total:</td>
                      <td className={`p-4 text-right font-medium ${textColor}`}>
                        NGN {Number(order.total || 0).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Invoice Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <InvoiceButtons order={order} />
          </div>
        </div>
      </div>
    </div>
  )
}


