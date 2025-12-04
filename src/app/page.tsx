import { AuthButton } from "@/components/auth-button";
import { LogoLink } from "@/components/logo-link";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Home() {
   return (
      <main className="flex  flex-col items-center">
         <div className="flex w-full flex-1 flex-col items-center gap-20">
            <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
               <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5">
                  <LogoLink />
                  <Suspense fallback={<Skeleton className="h-9 w-20" />}>
                     <AuthButton />
                  </Suspense>
               </div>
            </nav>
         </div>
      </main>
   );
}
