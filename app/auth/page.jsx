"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/services/supabaseClient";

export default function Login() {
  const signInWithGoogle = async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      console.error("Supabase client is null");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      console.error("OAuth error:", error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border rounded-xl p-8 flex flex-col items-center">
        <Image src="/logo.png" alt="logo" width={160} height={80} />
        <p className="text-gray-500 mt-2">Sign in with Google</p>
        <Button className="mt-6 w-full" onClick={signInWithGoogle}>
          Login with Google
        </Button>
      </div>
    </div>
  );
}
