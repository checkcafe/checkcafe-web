import { Footer } from "~/components/shared/footer";
import React from "react";
import { Navbar } from "./navbar";
export type CookiesType = {
  accessToken: string;
  refreshToken: string;
  role: string;
};

export function AppLayout({
  children,
  cookie,
}: {
  children: React.ReactNode;
  cookie: CookiesType | null;
}) {
  return (
    <>
      <Navbar cookie={cookie} />
      {children}
      <Footer />
    </>
  );
}
