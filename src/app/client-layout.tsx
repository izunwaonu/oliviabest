"use client";

import "../app/globals.css"; // Import global styles
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Loader from "../components/Loader";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
      });
    }
  }, []);

  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}

function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ["/auth/login", "/auth/register"];
  const isPublicRoute = publicRoutes.includes(pathname || "");

  useEffect(() => {
    if (!isPublicRoute && status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router, isPublicRoute]);

  if (status === "loading" && !isPublicRoute) {
    return <Loader />; 
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!session) return null;

  return <>{children}</>;
}
