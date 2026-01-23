"use client"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import React from 'react'
import { getSupabaseClient } from "@/services/supabaseClient";

import { HandHeart } from 'lucide-react'


function Login () {

  // Here We used To sign in with google ..

  const signInWithGoogle = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error("Supabase client not available");
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
    <div className = 'flex flex-col justify-center items-center h-screen'>
      <div className = 'flex flex-col items-center border rounded-2xl p-8'>
        <Image src = {'/logo.png'} alt = "logo"   width = {100} height = {100} className = 'w-[180px] mb-2' />
        <div className='flex items-center flex-col '>
          <Image src = {'/login.png'} alt = {'login'} width = {600} height = {400} className = 'w-[400px] h=[250px] rounded-2xl' />
          <h2 className="text-2xl font-bold mt-5 ">Welcome to AiCruiter</h2>
          <p className="text-gray-500">Sign-in with google authentication</p>
          <Button className='mt-7 w-full' onClick = {signInWithGoogle} >Login with google</Button>
        </div>
      </div>
    </div>
  )
}

export default Login;