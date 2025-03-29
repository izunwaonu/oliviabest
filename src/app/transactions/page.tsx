// "use client";

// import { useEffect, useState } from "react";

// export default function TransactionHistory({ debtorId }: { debtorId: string }) {
//   const [transactions, setTransactions] = useState<
//     {
//       id: string;
//       createdAt: string;
//       user: { name: string };
//       type: "DEBT" | "PAYMENT";
//       amount: number;
//       balanceAfter: number;
//       note?: string;
//     }[]
//   >([]);

//   useEffect(() => {
//     async function fetchTransactions() {
//       const res = await fetch(`/api/transactions?debtorId=${debtorId}`);
//       const data = await res.json();
//       setTransactions(data);
//     }

//     fetchTransactions();
//   }, [debtorId]);

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md border">
//       <h2 className="text-2xl font-bold text-gray-700 mb-4">Transaction History</h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100 text-gray-600 text-sm">
//               <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
//               <th className="border border-gray-200 px-4 py-2 text-left">User</th>
//               <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
//               <th className="border border-gray-200 px-4 py-2 text-right">Amount</th>
//               <th className="border border-gray-200 px-4 py-2 text-right">Balance After</th>
//               <th className="border border-gray-200 px-4 py-2 text-left">Note</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.length > 0 ? (
//               transactions.map((tx) => (
//                 <tr key={tx.id} className="border-b border-gray-200 text-sm">
//                   <td className="px-4 py-2">{new Date(tx.createdAt).toLocaleDateString()}</td>
//                   <td className="px-4 py-2">{tx.user.name}</td>
//                   <td
//                     className={`px-4 py-2 font-semibold ${
//                       tx.type === "DEBT" ? "text-red-500" : "text-green-500"
//                     }`}
//                   >
//                     {tx.type}
//                   </td>
//                   <td className="px-4 py-2 text-right">${tx.amount.toFixed(2)}</td>
//                   <td className="px-4 py-2 text-right">${tx.balanceAfter.toFixed(2)}</td>
//                   <td className="px-4 py-2">{tx.note || "—"}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
//                   No transactions found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <button
//         onClick={() => window.print()}
//         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//       >
//         Print Transactions
//       </button>
//     </div>
//   );
// }
import React from 'react'

export default function page() {
  return (
    <div>to be updated</div>
  )
}
