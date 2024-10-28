import { Footer } from "~/components/shared/footer";
import { Navbar } from "~/components/shared/navbar";
import { Toaster } from "~/components/ui/toaster"
import { UserProfile } from "~/lib/profile-http-request";

export function AppLayout({
  children,
  user,
  token
}: {
  children: React.ReactNode;
  user: Partial<UserProfile> | null;
  token:string|null
}) {
  return (
    <>
      <Navbar  user={user}
          token={token}
          />
      {children}
      <Footer />
      <Toaster />
    </>
  );
}
