import { Navbar } from "~/components/shared/navbar";
import { Footer } from "~/components/shared/footer";

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
      <Footer />
    </>
  );
}
