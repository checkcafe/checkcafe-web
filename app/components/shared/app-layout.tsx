import { Footer } from "~/components/shared/footer";
import React from "react";
import { Navbar } from "./navbar";
import { User } from "~/lib/auth";
export type CookiesType = {
  accessToken: string;
  refreshToken: string;
  role: string;
};

export function AppLayout({
  children,
  cookie,
  user
}: {
  children: React.ReactNode;
  cookie: CookiesType | null;
  user: User | null;
}) {
  return (
    <>
      <Navbar cookie={cookie} user={user} />
      {children}
      <Footer />
    </>
  );
}
