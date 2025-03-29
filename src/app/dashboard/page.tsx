// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Bar } from "react-chartjs-2";
// import "chart.js/auto";
// import Image from "next/image";
// import Navbar from "../components/Navbar";

// export default function Dashboard() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [dashboardData, setDashboardData] = useState<{
//     totalDebtors: number;
//     totalPayments: number;
//     monthlyPayments: Record<string, number>;
//     overdueDebtors: { id: string; name: string; phoneNumber: string; dueDate: string; amountOwed: number }[];
//   }>({
//     totalDebtors: 0,
//     totalPayments: 0,
//     monthlyPayments: {},
//     overdueDebtors: [],
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/dashboard");
//         const data = await res.json();
//         setDashboardData(data);
//       } catch (error) {
//         console.error("Failed to fetch dashboard data", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   if (status === "loading" || loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!session) {
//     router.push("/auth/login");
//     return null;
//   }

//   const user = session.user;
//   const paymentChartData = {
//     labels: Object.keys(dashboardData?.monthlyPayments ?? {}),
//     datasets: [
//       {
//         label: "Payments Per Month",
//         data: Object.values(dashboardData?.monthlyPayments ?? {}),
//         backgroundColor: "rgba(54, 162, 235, 0.7)",
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Navbar />

//       <div className="max-w-6xl mx-auto p-4 w-full mt-11">
//         {/* Header Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
//           <Image src="/logo.png" alt="Logo" width={80} height={80} className="w-20 h-20" />
//           <div className="text-center md:text-left">
//             <h1 className="text-2xl font-bold text-blue-900">Welcome, {user?.name} 👋</h1>
//             <p className="text-gray-600 text-sm">{user?.email}</p>
//             <p className="text-gray-600 font-bold">Current Time: {currentTime.toLocaleTimeString()}</p>
//           </div>
//         </div>

//         {/* Dashboard Metrics */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
//           <Link href="/debtors" className="p-6 rounded-lg shadow-lg text-white text-center font-semibold text-lg bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105 transition-all">
//             <h2 className="text-4xl">{dashboardData?.totalDebtors}</h2>
//             <p>Total Debtors</p>
//           </Link>
//           <Link href="/payments" className="p-6 rounded-lg shadow-lg text-white text-center font-semibold text-lg bg-gradient-to-br from-red-500 to-yellow-500 hover:scale-105 transition-all">
//             <h2 className="text-4xl">₦{dashboardData?.totalPayments?.toFixed(2)}</h2>
//             <p>Total Payments</p>
//           </Link>
//         </div>

//         {/* Payment Analysis Graph */}
//         <div className="bg-white p-6 rounded-lg shadow-md mt-6">
//           <h2 className="text-xl font-bold mb-4">Monthly Payments Analysis</h2>
//           <div className="w-full h-64">
//             <Bar data={paymentChartData} />
//           </div>
//         </div>

//         {/* Overdue Debtors Table - Scrollable */}
//         <div className="bg-white p-6 rounded-lg shadow-md mt-6">
//           <h2 className="text-xl font-bold mb-4">Overdue Debts</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border border-gray-300 min-w-[600px]">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border p-3 text-left">Name</th>
//                   <th className="border p-3 text-left">Phone</th>
//                   <th className="border p-3 text-left">Due Date</th>
//                   {/* <th className="border p-3 text-left">Amount Owed</th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {dashboardData?.overdueDebtors?.length ? (
//                   dashboardData.overdueDebtors.map((debtor) => (
//                     <tr key={debtor.id} className="text-left">
//                       <td className="border p-3">{debtor.name}</td>
//                       <td className="border p-3">{debtor.phoneNumber}</td>
//                       <td className="border p-3">{new Date(debtor.dueDate).toLocaleDateString()}</td>
//                       {/* <td className="border p-3">₦{(debtor.amountOwed ?? 0).toFixed(2)}</td> */}
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={4} className="border p-3 text-center text-gray-500">No overdue debts</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Dialog, { DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Button from "@/components/ui/button";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState<{
    totalDebtors: number;
    totalPayments: number;
    monthlyPayments: Record<string, number>;
    overdueDebtors: { id: string; name: string; phoneNumber: string; dueDate: string; amountOwed: number }[];
  }>({
    totalDebtors: 0,
    totalPayments: 0,
    monthlyPayments: {},
    overdueDebtors: [],
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN" && session?.user?.role !== "EDITOR") {
      setIsModalOpen(true);
    }
  }, [status, session]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Access Denied Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(true)}>
          <DialogContent>
            <DialogTitle>
              <div className="text-red-600 text-xl font-bold">Access Denied</div>
            </DialogTitle>
            <DialogDescription>
              <div className="text-gray-700">
                Dear {session?.user?.name}, your role is <strong>{session?.user?.role}</strong>. You are not allowed to visit this page.
                Kindly contact the admin to request access.
              </div>
            </DialogDescription>
            <Button
              onClick={() => router.push("/")}
              className="bg-red-600 text-white hover:bg-red-700 w-full mt-4"
            >
              Okay
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {!isModalOpen && (
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navbar />

          <div className="max-w-6xl mx-auto p-4 w-full mt-11">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
              <Image src="/logo.png" alt="Logo" width={80} height={80} className="w-20 h-20" />
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-blue-900">Welcome, {session?.user?.name} 👋</h1>
                <p className="text-gray-600 text-sm">{session?.user?.email}</p>
                <p className="text-gray-600 font-bold">Current Time: {currentTime.toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Dashboard Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Link href="/debtors" className="p-6 rounded-lg shadow-lg text-white text-center font-semibold text-lg bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105 transition-all">
                <h2 className="text-4xl">{dashboardData?.totalDebtors}</h2>
                <p>Total Debtors</p>
              </Link>
              <Link href="/payments" className="p-6 rounded-lg shadow-lg text-white text-center font-semibold text-lg bg-gradient-to-br from-red-500 to-yellow-500 hover:scale-105 transition-all">
                <h2 className="text-4xl">₦{dashboardData?.totalPayments?.toFixed(2)}</h2>
                <p>Total Payments</p>
              </Link>
            </div>

            {/* Payment Analysis Graph */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold mb-4">Monthly Payments Analysis</h2>
              <div className="w-full h-64">
                <Bar data={{
                  labels: Object.keys(dashboardData?.monthlyPayments ?? {}),
                  datasets: [
                    {
                      label: "Payments Per Month",
                      data: Object.values(dashboardData?.monthlyPayments ?? {}),
                      backgroundColor: "rgba(54, 162, 235, 0.7)",
                    },
                  ],
                }} />
              </div>
            </div>

            {/* Overdue Debtors Table */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold mb-4">Overdue Debts</h2>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 min-w-[600px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-3 text-left">Name</th>
                      <th className="border p-3 text-left">Phone</th>
                      <th className="border p-3 text-left">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.overdueDebtors?.length ? (
                      dashboardData.overdueDebtors.map((debtor) => (
                        <tr key={debtor.id} className="text-left">
                          <td className="border p-3">{debtor.name}</td>
                          <td className="border p-3">{debtor.phoneNumber}</td>
                          <td className="border p-3">{new Date(debtor.dueDate).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="border p-3 text-center text-gray-500">No overdue debts</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
