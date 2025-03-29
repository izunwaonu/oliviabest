"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      {/* Animated colorful ring */}
      <motion.div
        className="absolute w-40 h-40 rounded-full"
        initial={{ opacity: 0.5, scale: 1 }}
        animate={{ 
          scale: [1, 1.3, 1], 
          opacity: [0.5, 1, 0.5],
          rotate: [0, 360],
          background: [
            "conic-gradient(from 0deg, red, yellow, green, cyan, blue, magenta, red)",
            "conic-gradient(from 90deg, red, yellow, green, cyan, blue, magenta, red)",
            "conic-gradient(from 180deg, red, yellow, green, cyan, blue, magenta, red)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.2, 1], opacity: 1, rotate: [0, 360] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center relative"
      >
        <Image
          src="/logo.png"
          alt="."
          width={120}
          height={120}
          className="rounded-full shadow-lg"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 text-lg font-semibold text-blue-700"
        >
  
        </motion.p>
      </motion.div>
    </div>
  );
}
