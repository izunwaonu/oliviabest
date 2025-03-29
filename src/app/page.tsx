// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import Dialog, { DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import  Button  from "@/components/ui/button";
// import InstallButton from "@/app/components/InstallButton";

// export default function LandingPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex flex-col items-center justify-center p-4">
//       <div className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700">
//       <InstallButton />
//       </div>

//       {/* Logo */}
//       <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
//         <Image src="/logo.png" alt="Oliviabest Eatery Logo" width={150} height={150} className="mb-8 rounded-full" />
//         <h2 className="text-xl text-white justify-center items-center font-bold mb-4 font-poppins">Oliviabest Eatery APP</h2>
//       </motion.div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
//         {/* Sales Analysis */}
//         <motion.a
//           href="/dashboardtwo"
//           className="bg-white rounded-2xl shadow-lg p-6 text-center hover:scale-105 transform transition duration-300 cursor-pointer"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <h3 className="text-2xl font-bold text-purple-600 mb-2">Sales Analysis</h3>
//           <p className="text-gray-600">Analyze sales data, trends, and performance metrics to optimize your business.</p>
//         </motion.a>

//         {/* Debtor's Analysis */}
//         <motion.a
//           href="/dashboard"
//           className="bg-white rounded-2xl shadow-lg p-6 text-center hover:scale-105 transform transition duration-300 cursor-pointer"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
//           <h3 className="text-2xl font-bold text-blue-600 mb-2">Debtor's Analysis</h3>
//           <p className="text-gray-600">Add debtors, record payments, and print transaction histories with ease.</p>
//         </motion.a>

//         {/* Invoicing */}
//         <motion.a
//         href="/orders"
//           className="bg-white rounded-2xl shadow-lg p-6 text-center hover:scale-105 transform transition duration-300 cursor-pointer"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//         >
//           <h3 className="text-2xl font-bold text-green-600 mb-2">Invoicing</h3>
//           <p className="text-gray-600">Generate invoices for every order (Now active).</p>
//         </motion.a>
//       </div>

//       {/* Modal for Invoicing */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent>
//           <DialogTitle>🚧 Coming Soon!</DialogTitle>
//           <DialogDescription>
//             We're working hard on the Invoicing feature. Stay tuned!
//           </DialogDescription>
//           <Button onClick={() => setIsModalOpen(false)} className="bg-blue-600 text-white hover:bg-blue-700">
//             Close
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import  Dialog  from "@/components/ui/dialog"
import Button  from "@/components/ui/button"
import InstallButton from "@/app/components/InstallButton"
import { ChevronRight, BarChart3, Users, FileText, Sun, Moon } from "lucide-react"

// This would typically come from your authentication system


export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [greeting, setGreeting] = useState("Welcome")

  useEffect(() => {
    const getCurrentGreeting = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) return "Good morning"
      if (hour >= 12 && hour < 18) return "Good afternoon"
      return "Good evening"
    }

    setGreeting(getCurrentGreeting())
  }, [])

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  // Theme-dependent styles
  const styles = {
    background: isDarkTheme
      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      : "bg-gradient-to-br from-slate-100 via-white to-slate-100",
    text: isDarkTheme ? "text-white" : "text-slate-800",
    subtext: isDarkTheme ? "text-slate-300" : "text-slate-600",
    footerText: isDarkTheme ? "text-slate-400" : "text-slate-500",
    card: isDarkTheme ? "bg-slate-800/50 border-slate-700" : "bg-white/80 border-slate-200",
    cardHover: isDarkTheme ? "hover:bg-slate-700/50" : "hover:bg-white",
    modalBg: isDarkTheme ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200",
    modalText: isDarkTheme ? "text-slate-300" : "text-slate-600",
  }

  return (
    <div
      className={`min-h-screen ${styles.background} flex flex-col items-center p-4 sm:p-6 md:p-8 transition-colors duration-300`}
    >
      {/* Header */}
      <div className="w-full max-w-7xl flex justify-between items-center mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/30 rounded-full blur-md"></div>
            <Image
              src="/logo.png"
              alt="Oliviabest Eatery Logo"
              width={60}
              height={60}
              className="rounded-full relative z-10 border-2 border-rose-500/50"
            />
          </div>
          <h1 className={`text-xl md:text-2xl font-bold ${styles.text} hidden sm:block`}>Oliviabest Eatery</h1>
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDarkTheme ? "bg-slate-700 text-yellow-400" : "bg-slate-200 text-slate-700"} transition-colors duration-300`}
            aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <InstallButton  />
          </motion.div>
        </div>
      </div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10 md:mb-16"
      >
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${styles.text} mb-4`}>
          <span className="text-rose-500">{greeting}</span>
        </h2>
        <p className={`${styles.subtext} max-w-2xl mx-auto text-lg`}>
          Welcome to Oliviabest Eatery
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl"
      >
        {/* Sales Analysis */}
        <motion.div variants={itemVariants}>
          <a href="/dashboardtwo" className="group block h-full">
            <div
              className={`${styles.card} backdrop-blur-lg rounded-2xl overflow-hidden border shadow-xl h-full transition-all duration-300 hover:shadow-rose-500/20 hover:border-rose-500/30 ${styles.cardHover}`}
            >
              <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="bg-gradient-to-br from-rose-500 to-rose-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-500/20">
                  <BarChart3 className="text-white h-7 w-7" />
                </div>
                <h3 className={`text-2xl font-bold ${styles.text} mb-3`}>Sales Analysis</h3>
                <p className={`${styles.subtext} mb-6 flex-grow`}>
                  Analyze sales data, trends, and performance metrics to optimize your business decisions.
                </p>
                <div className="flex items-center text-rose-500 font-medium group-hover:text-rose-600 transition-colors">
                  <span>Explore</span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>
        </motion.div>

        {/* Debtor's Analysis */}
        <motion.div variants={itemVariants}>
          <a href="/dashboard" className="group block h-full">
            <div
              className={`${styles.card} backdrop-blur-lg rounded-2xl overflow-hidden border shadow-xl h-full transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500/30 ${styles.cardHover}`}
            >
              <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
                  <Users className="text-white h-7 w-7" />
                </div>
                <h3 className={`text-2xl font-bold ${styles.text} mb-3`}>Debtor's Analysis</h3>
                <p className={`${styles.subtext} mb-6 flex-grow`}>
                  Add debtors, record payments, and print transaction histories with ease and efficiency.
                </p>
                <div className="flex items-center text-cyan-500 font-medium group-hover:text-cyan-600 transition-colors">
                  <span>Explore</span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>
        </motion.div>

        {/* Invoicing */}
        <motion.div variants={itemVariants}>
          <a href="/orders" className="group block h-full">
            <div
              className={`${styles.card} backdrop-blur-lg rounded-2xl overflow-hidden border shadow-xl h-full transition-all duration-300 hover:shadow-amber-500/20 hover:border-amber-500/30 ${styles.cardHover}`}
            >
              <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                  <FileText className="text-white h-7 w-7" />
                </div>
                <h3 className={`text-2xl font-bold ${styles.text} mb-3`}>Invoicing</h3>
                <p className={`${styles.subtext} mb-6 flex-grow`}>
                  Generate professional invoices for every order with our easy-to-use invoicing system.
                </p>
                <div className="flex items-center text-amber-500 font-medium group-hover:text-amber-600 transition-colors">
                  <span>Explore</span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className={`mt-12 md:mt-16 text-center ${styles.footerText} text-sm`}
      >
        <p>© {new Date().getFullYear()} Oliviabest Eatery. All rights reserved.</p>
      </motion.div>

      {/* Modal for Invoicing */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`${styles.modalBg} rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden border`}>
            <div className="bg-gradient-to-r from-rose-500 to-amber-500 p-4">
              <div className="flex items-center gap-2 text-xl text-white">
                <span className="text-2xl">🚧</span> Coming Soon!
              </div>
            </div>
            <div className="p-6">
              <div className={`text-center py-4 ${styles.modalText}`}>
                We're working hard on enhancing the Invoicing feature. Stay tuned for updates!
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:opacity-90"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

