"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInOutButton() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (session) {
          signOut();
        } else {
          signIn(undefined, { callbackUrl: "/dashboard" });
        }
      }}
      className="px-4 py-2 text-white font-semibold rounded-md shadow-md transition 
        duration-300 ease-in-out 
        bg-blue-600 hover:bg-blue-700
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {session ? "Sign Out" : "Sign In"}
    </button>
  );
}
