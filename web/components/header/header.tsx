"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";
import packageJson from "../../package.json";
import LoginComponent from "../login/login-component";
import ModalSobreComponent from "../modal-sobre/modal";
import { Separator } from "../ui/separator";

export function Header() {
  return (
    <header className="flex flex-col items-start justify-start">
      <NavigationMenu className="max-w-full w-full justify-start">
        <div id="logo" className="flex items-center space-x-2 ">
          <div className="flex items-start">
            <h1 className="text-2xl font-extralight tracking-wider">
              Clipe Awards
            </h1>
            <span className="text-muted-foreground text-xs">
              v{packageJson.version}
            </span>
          </div>
          <Separator orientation="vertical" />
        </div>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Clipes
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem className="cursor-pointer">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <ModalSobreComponent />
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        <div className="ml-auto">
          <LoginComponent />
        </div>
      </NavigationMenu>
      <Separator className="my-4" />
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
