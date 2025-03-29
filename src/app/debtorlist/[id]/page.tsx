
import Navbar from "@/app/components/Navbar";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function DebtorTransactionsPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ Ensure params is a Promise
}) {
  const { id: debtorId } = await params; // ✅ Await params properly

  if (!debtorId) {
    return notFound();
  }

  // Fetch debtor and all transaction history
  const debtor = await prisma.debtor.findUnique({
    where: { id: debtorId },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
    },
  });

  if (!debtor) {
    return <p className="text-red-500 text-center">Debtor not found</p>;
  }

  // Calculate overpayment dynamically
  const totalOverpayment = debtor.transactions.reduce((sum, transaction) => {
    return sum + (transaction.overpayment || 0);
  }, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <Navbar/>
      
      {/* HEADER - Debtor Information */}
      <div className="text-center mb-6 mt-11">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Transaction History</h2>
        <p className="text-gray-600 text-lg">{debtor.name}</p>
        <p className="text-gray-500 text-sm">Phone: {debtor.phoneNumber || "N/A"}</p>
        <div className="mt-4 flex justify-center space-x-4">
          <p className="text-green-600 font-semibold text-lg">
            Remaining Balance: ₦{debtor.amountOwed.toFixed(2)}
          </p>
          <p className="text-blue-600 font-semibold text-lg">
            Overpayment: ₦{debtor.balance ? debtor.balance.toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end space-x-4 mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700">
          Export to PDF
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700">
          Print
        </button>
      </div>

      {/* TABLE - Transaction History */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
              <th className="border p-3">Type</th>
              <th className="border p-3">Amount</th>
              <th className="border p-3">Balance After</th>
              <th className="border p-3">Overpayment</th>
              <th className="border p-3">Method</th>
              <th className="border p-3">Recorded By</th>
              <th className="border p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {debtor.transactions.length > 0 ? (
              debtor.transactions.map((transaction) => (
                <tr key={transaction.id} className="text-gray-700 even:bg-gray-50 hover:bg-gray-100">
                  <td className="border p-3">
                    <span
                      className={`px-2 py-1 rounded-md text-white ${
                        transaction.type === "PAYMENT" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {transaction.type === "PAYMENT" ? "Payment" : "Debt Added"}
                    </span>
                  </td>
                  <td className="border p-3">₦{transaction.amount.toFixed(2)}</td>
                  <td className="border p-3">₦{transaction.balanceAfter.toFixed(2)}</td>
                  <td className="border p-3">
                    {transaction.overpayment ? `₦${transaction.overpayment.toFixed(2)}` : "—"}
                  </td>
                  <td className="border p-3">{transaction.paymentMethod || "N/A"}</td>
                  <td className="border p-3">{transaction.user?.name || "Unknown"}</td>
                  <td className="border p-3">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="border p-3 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
