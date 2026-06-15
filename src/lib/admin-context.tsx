"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "editor";
} | null;

type AdminContextType = {
  user: AdminUser;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setUser: (user: AdminUser) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser>({
    id: "admin-1",
    email: "admin@gracecoloring.com",
    full_name: "Admin User",
    avatar_url: null,
    role: "admin",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <AdminContext.Provider value={{ user, isSidebarOpen, toggleSidebar, setUser }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
