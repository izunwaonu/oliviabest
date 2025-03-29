// "use client";

// // import type { Metadata } from "next";
// import { SessionProvider } from "next-auth/react";
// import "./globals.css";
// import { Poppins } from "next/font/google";


// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={poppins.className} >
//         <SessionProvider>{children}</SessionProvider>
//       </body>
//     </html>
//   );
// }

import ClientLayout from "./client-layout";

export const metadata = {
  title: "Oliviabest Eatery App",
  description: "All in one app for Oliviabest Eatery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}


