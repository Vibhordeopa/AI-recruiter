"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";

function Provider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ HARD GUARD (this fixes your crash)
    if (!supabase) {
      console.warn("Supabase client not initialized yet");
      return;
    }

    const initializeUser = async () => {
      try {
        const { data: { session }, error } =
          await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          return;
        }

        if (!session) return;

        const currentUser = session.user;

        const { data: existingUsers, error: selectError } =
          await supabase
            .from("Users")
            .select("*")
            .eq("id", currentUser.id)
            .single();

        if (selectError && selectError.code !== "PGRST116") {
          console.error(selectError);
          return;
        }

        if (!existingUsers) {
          const { data: insertedUser, error: insertError } =
            await supabase
              .from("Users")
              .insert({
                id: currentUser.id,
                name: currentUser.user_metadata?.name || "",
                email: currentUser.email,
                picture: currentUser.user_metadata?.picture || "",
              })
              .select()
              .single();

          if (insertError) {
            console.error(insertError);
            return;
          }

          setUser(insertedUser);
        } else {
          setUser(existingUsers);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
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
