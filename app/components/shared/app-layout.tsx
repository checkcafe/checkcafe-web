import React from "react";
import { Navbar } from "~/components/shared/navbar";
import { Footer } from "~/components/shared/footer";
import { Toaster } from "../ui/sonner";

export function AppLayout({
  children,
  cookie,
}: {
  children: React.ReactNode;
  cookie: string;
}) {
  return (
    <>
      <Navbar cookie={cookie} />
      {children}
      <Toaster />
      <Footer />
    </>
  );
}
