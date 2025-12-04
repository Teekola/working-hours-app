import { ComponentProps } from "react";

import { Button } from "./button";
import Link from "next/link";

type ButtonLinkProps = ComponentProps<typeof Link> &
   ComponentProps<typeof Button>;

export function ButtonLink({
   disabled,
   href,
   children,
   ...props
}: Readonly<ButtonLinkProps>) {
   return (
      <Button disabled={disabled} asChild={!disabled} {...props}>
         {!disabled ? <Link href={href}>{children}</Link> : <>{children}</>}
      </Button>
   );
}
