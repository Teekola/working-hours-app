import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export function PageHeading({
   children,
   ...props
}: PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) {
   return (
      <h1 {...props} className={cn("text-2xl font-bold", props.className)}>
         {children}
      </h1>
   );
}
