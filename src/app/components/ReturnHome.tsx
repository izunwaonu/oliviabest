// import Link from "next/link";

// const ReturnHomeButton = () => {
//   return (
//     <div className="flex justify-center mt-6 gap-10">
//       <Link href="/">
//         <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
//           Return Home
//         </button>
//       </Link>
//       <Link href="/users">
//         <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
//          Manage Users
//         </button>
//       </Link>
//     </div>
//   );
// };

// export default ReturnHomeButton;

import Link from "next/link"
import { Home, Users } from "lucide-react"

interface NavigationButtonsProps {
  isDarkTheme?: boolean
}

const NavigationButtons = ({ isDarkTheme = false }: NavigationButtonsProps) => {
  // Theme styles
  const styles = {
    button: isDarkTheme
      ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
      : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200",
    icon: isDarkTheme ? "text-blue-400" : "text-blue-600",
    shadow: isDarkTheme ? "shadow-md shadow-slate-900/20" : "shadow-md shadow-slate-200/50",
    text: isDarkTheme ? "text-slate-200" : "text-slate-700",
  }

  return (
    <div className="flex flex-row justify-center items-center mt-6 gap-4 w-full px-4">
      <Link href="/" className="w-full sm:w-auto">
        <button
          className={`${styles.button} ${styles.shadow} w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 sm:min-w-[160px]`}
        >
          <Home className={`w-4 h-4 ${styles.icon}`} />
          <span className={styles.text}>Home</span>
        </button>
      </Link>
      <Link href="/users" className="w-full sm:w-auto">
        <button
          className={`${styles.button} ${styles.shadow} w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 sm:min-w-[160px]`}
        >
          <Users className={`w-4 h-4 ${styles.icon}`} />
          <span className={styles.text}>Users</span>
        </button>
      </Link>
    </div>
  )
}

export default NavigationButtons

