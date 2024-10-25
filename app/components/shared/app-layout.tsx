import { Outlet } from "@remix-run/react";

import { Navbar } from "~/components/shared/navbar";
import { Footer } from "~/components/shared/footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
