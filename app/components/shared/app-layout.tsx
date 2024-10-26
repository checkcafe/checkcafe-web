import React from "react";
import { Navbar } from "~/components/shared/navbar";
import { Footer } from "~/components/shared/footer";

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
