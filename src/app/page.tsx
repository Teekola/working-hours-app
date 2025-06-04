import { AuthButton } from "@/components/auth-button";
import { LogoLink } from "@/components/logo-link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
   return (
      <main className="flex min-h-screen flex-col items-center">
         <div className="flex w-full flex-1 flex-col items-center gap-20">
            <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
               <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5">
                  <LogoLink />
                  <AuthButton />
               </div>
            </nav>

            <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs">
               <ThemeSwitcher />
            </footer>
         </div>
      </main>
   );
}
