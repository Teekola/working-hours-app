import { AuthButton } from "@/components/auth-button";
import { LogoLink } from "@/components/logo-link";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <main className="flex min-h-screen flex-col items-center">
         <div className="flex w-full flex-1 flex-col items-center">
            <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
               <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
                  <LogoLink />
                  <Suspense fallback={<Skeleton className="h-9 w-20" />}>
                     <AuthButton />
                  </Suspense>
               </div>
            </nav>
            <div className="flex w-full max-w-5xl flex-1 flex-col gap-20 p-5">
               <Suspense
                  fallback={
                     <Skeleton className="max-w-xl mx-auto h-full w-full flex-1" />
                  }
               >
                  {children}
               </Suspense>
            </div>
         </div>
      </main>
   );
}
