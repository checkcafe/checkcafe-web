import { Footer } from "~/components/shared/footer";
import { Navbar } from "~/components/shared/navbar";
import { Toaster } from "~/components/ui/toaster"

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
      <Toaster />
    </>
  );
}
