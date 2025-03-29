// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import Navbar from "../components/Navbar";
// import Link from "next/link";

// interface Debtor {
//   id: string;
//   name: string;
//   invoiceNo: string;
//   phoneNumber: string;
//   amountOwed: number;
//   balance: number;
//   dueDate: string;
//   user: { name: string };
// }

// export default function DebtorsPage() {
//   const { data: session } = useSession();
//   const [debtors, setDebtors] = useState<Debtor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [showDebtModal, setShowDebtModal] = useState(false);
//   const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
//   const [additionalDebt, setAdditionalDebt] = useState("");

//   useEffect(() => {
//     const fetchDebtors = async () => {
//       try {
//         const res = await fetch("/api/debtors");
//         if (!res.ok) throw new Error(`Failed to fetch debtors: ${res.statusText}`);
//         const data: Debtor[] = await res.json();
//         setDebtors(data);
//       } catch (err: any) {
//         setError(err.message || "An unexpected error occurred.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDebtors();
//   }, []);

//   const handleAddDebt = async () => {
//     if (!selectedDebtor || !additionalDebt) return;

//     try {
//       const res = await fetch(`/api/debtors/${selectedDebtor.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amountOwed: parseFloat(additionalDebt) }),
//       });

//       if (!res.ok) throw new Error("Failed to update debtor");
//       const updatedDebtor = await res.json();

//       setDebtors((prev) => prev.map((debtor) => (debtor.id === updatedDebtor.id ? updatedDebtor : debtor)));
//       setShowDebtModal(false);
//       setAdditionalDebt("");
//       setShowSuccessModal(true);
//     } catch (error) {
//       console.error("Error updating debt:", error);
//     }
//   };

//   const filteredDebtors = debtors.filter((debtor) =>
//     debtor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     debtor.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     debtor.phoneNumber.includes(searchQuery)
//   );

//   return (
//     <div className="h-screen bg-gradient-to-br from-blue-500 to-purple-600 overflow-scroll">
//       <div className="p-6 max-w-4xl mx-auto">
//       <Navbar />
//       <h1 className="text-2xl font-bold mb-4">Adding  Debit </h1>
//       <div>
//       <p className="bg-yellow-500 text-black p-4 rounded-md font-semibold mb-3 flex items-center">
//         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12l-9-9-9 9"></path>
//         </svg>
//   <span>
//     To add a new debtor who hasn't been added before, click on "Add New Debtor." 
//     If you wish to increase the debt of an existing debtor, click on "Add More Debt."
//   </span>
// </p>

//       </div>

//       {error && (
//         <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded-md">⚠️ {error}</div>
//       )}

//       <input
//         type="text"
//         placeholder="Search by name, invoice, or phone number"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="w-full p-2 border rounded-md mb-4"
//       />

//       <a href="/debtors/add-debtor">
//       <button
//         className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
//       >
//         Add New Debtor
//       </button>
//       </a>

//       {loading ? (
//         <div className="text-center text-gray-500 animate-spin w-10 h-10 mx-auto border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
//       ) : (
//         <ul className="space-y-2">
//           {filteredDebtors.map((debtor) => (
//             <li key={debtor.id} className="p-4 bg-white shadow-md rounded-md flex justify-between items-center">
//               <div>
//                 <p className="font-semibold">{debtor.name}</p>
//                 <p className="text-gray-600 text-sm">Invoice: {debtor.invoiceNo}</p>
//                 <p className="text-gray-600 text-sm">Phone Number: {debtor.phoneNumber}</p>
//                 <p className="text-gray-600 text-sm">Amount Owed: ₦{debtor.amountOwed}</p>
//                 <p className="text-gray-600 text-sm">Over Payment Bal: ₦{debtor.balance}</p>
//               </div>
//               <button
//                 className="px-3 py-1 bg-green-500 text-white rounded-md"
//                 onClick={() => {
//                   setSelectedDebtor(debtor);
//                   setShowDebtModal(true);
//                 }}
//               >
//                 Add More Debt
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}

//       {showDebtModal && selectedDebtor && (
//         <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-md shadow-md w-96 text-center">
//             <h2 className="text-xl font-bold mb-4">Add More Debt for {selectedDebtor.name}</h2>
//             <input
//               type="number"
//               placeholder="Enter amount"
//               value={additionalDebt}
//               onChange={(e) => setAdditionalDebt(e.target.value)}
//               className="w-full p-2 border rounded-md mb-4"
//             />
//             <div className="flex justify-end gap-2">
//               <button onClick={() => setShowDebtModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md">
//                 Cancel
//               </button>
//               <button onClick={handleAddDebt} className="px-4 py-2 bg-blue-500 text-white rounded-md">
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showSuccessModal && (
//         <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-md shadow-md w-96 text-center">
//             <h2 className="text-xl font-bold mb-4">Success!</h2>
//             <p className="text-gray-600">Debt added successfully.</p>
//             <button
//               onClick={() => setShowSuccessModal(false)}
//               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import Link from "next/link";

interface Debtor {
  id: string;
  name: string;
  invoiceNo: string;
  phoneNumber: string;
  amountOwed: number;
  balance: number;
  dueDate: string;
  user: { name: string };
}

export default function DebtorsPage() {
  const { data: session } = useSession();
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [additionalDebt, setAdditionalDebt] = useState("");

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const res = await fetch("/api/debtors");
        if (!res.ok) throw new Error(`Failed to fetch debtors: ${res.statusText}`);
        const data: Debtor[] = await res.json();
        setDebtors(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchDebtors();
  }, []);

  const handleAddDebt = async () => {
    if (!selectedDebtor || !additionalDebt) return;

    try {
      const res = await fetch(`/api/debtors/${selectedDebtor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountOwed: parseFloat(additionalDebt), // ✅ Send only the new amount to add
          recordTransaction: true, // ✅ Ensure transaction recording on the backend
        }),
      });

      if (!res.ok) throw new Error("Failed to update debtor");
      const updatedDebtor = await res.json();

      setDebtors((prev) =>
        prev.map((debtor) => (debtor.id === updatedDebtor.id ? updatedDebtor : debtor))
      );
      setShowDebtModal(false);
      setAdditionalDebt("");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating debt:", error);
    }
  };

  const filteredDebtors = debtors.filter((debtor) =>
    debtor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    debtor.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    debtor.phoneNumber.includes(searchQuery)
  );

  return (
    <div className="h-screen bg-gradient-to-br from-blue-500 to-purple-600 overflow-scroll">
      <div className="p-6 max-w-4xl mx-auto">
        <Navbar />
        <h1 className="text-2xl font-bold mb-4">Adding Debit</h1>
        <div>
          <p className="bg-yellow-500 text-black p-4 rounded-md font-semibold mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12l-9-9-9 9"></path>
            </svg>
            <span>
              To add a new debtor who hasn't been added before, click on "Add New Debtor." If you wish to increase the debt of an existing debtor, click on "Add More Debt."
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded-md">⚠️ {error}</div>
        )}

        <input
          type="text"
          placeholder="Search by name, invoice, or phone number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        <a href="/debtors/add-debtor">
          <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md">
            Add New Debtor
          </button>
        </a>

        {loading ? (
          <div className="text-center text-gray-500 animate-spin w-10 h-10 mx-auto border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
        ) : (
          <ul className="space-y-2">
            {filteredDebtors.map((debtor) => (
              <li key={debtor.id} className="p-4 bg-white shadow-md rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold">{debtor.name}</p>
                  <p className="text-gray-600 text-sm">Invoice: {debtor.invoiceNo}</p>
                  <p className="text-gray-600 text-sm">Phone Number: {debtor.phoneNumber}</p>
                  {/* <p className="text-gray-600 text-sm">Amount Owed: ₦{debtor.amountOwed}</p> */}
                  <p
        className={`text-sm font-semibold p-2 rounded-md text-center 
          ${debtor.amountOwed === 0 ? "bg-green-500 text-white animate-pulse" : "text-gray-600"}`}
      >
        {debtor.amountOwed === 0 ? "Completed 🎉" : `Amount Owed: ₦${debtor.amountOwed.toFixed(2)}`}
      </p>

                  <p className="text-gray-600 text-sm">Over Payment Bal: ₦{debtor.balance}</p>
                </div>
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded-md"
                  onClick={() => {
                    setSelectedDebtor(debtor);
                    setShowDebtModal(true);
                  }}
                >
                  Add More Debt
                </button>
              </li>
            ))}
          </ul>
        )}

        {showDebtModal && selectedDebtor && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96 text-center">
              <h2 className="text-xl font-bold mb-4">Add More Debt for {selectedDebtor.name}</h2>
              <input
                type="number"
                placeholder="Enter amount"
                value={additionalDebt}
                onChange={(e) => setAdditionalDebt(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowDebtModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md">
                  Cancel
                </button>
                <button onClick={handleAddDebt} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96 text-center">
              <h2 className="text-xl font-bold mb-4">Success!</h2>
              <p className="text-gray-600">Debt added successfully and recorded.</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
