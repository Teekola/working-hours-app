import { ComponentProps } from "react";

import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ButtonLoadingProps = ComponentProps<typeof Button>;
export function ButtonLoading({ children, ...props }: ButtonLoadingProps) {
   return (
      <Button disabled {...props}>
         <Loader2Icon className="animate-spin" />
         {children}
      </Button>
   );
}
