"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";

function Provider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ CRITICAL GUARD
    if (!supabase) {
      console.warn("Supabase not initialized (env missing)");
      return;
    }

    const initializeUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        if (!session) {
          console.log("No active session");
          return;
        }

        const currentUser = session.user;

        const { data: existingUsers, error: selectError } = await supabase
          .from("Users")
          .select("*")
          .eq("id", currentUser.id);

        if (selectError) {
          console.error("Select error:", selectError);
          return;
        }

        if (!existingUsers || existingUsers.length === 0) {
          const { data: insertedUser, error: insertError } = await supabase
            .from("Users")
            .insert([
              {
                id: currentUser.id,
                name: currentUser.user_metadata?.name || "",
                email: currentUser.email,
                picture: currentUser.user_metadata?.picture || "",
              },
            ])
            .select()
            .single();

          if (insertError) {
            console.error("Insert error:", insertError);
            return;
          }

          setUser(insertedUser);
        } else {
          setUser(existingUsers[0]);
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
