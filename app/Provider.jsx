"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { getSupabaseClient } from "@/services/supabaseClient";

import React, { useContext, useEffect, useState } from "react";

function Provider({ children }) {
  const [user, setUser] = useState(null);
useEffect(() => {
  if (!supabase) return;

  const initializeUser = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);
      return;
    }

    if (!session) {
      console.log("No active session");
      return;
    }

    const currentUser = session.user;
    setUser(currentUser);
  };

  initializeUser();
}, []);

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  return useContext(UserDetailContext);
};
