"use client";

import { Popover } from "@base-ui/react/popover";
import { ChevronDownIcon, LayoutGridIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { toolsByCategory } from "@/lib/tools";
import { cn } from "@/lib/utils";

const GROUPS = toolsByCategory();

function shortName(name: string): string {
  return name.replace(/^Gerador de /, "");
}

export function GeneratorsMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "group gap-2",
        )}
      >
        <LayoutGridIcon className="size-4" />
        Geradores
        <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-aria-expanded:rotate-180" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner side="bottom" align="end" sideOffset={8} className="z-50">
          <Popover.Popup className="z-50 w-[min(92vw,44rem)] origin-(--transform-origin) rounded-2xl bg-popover p-4 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:p-5">
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="px-2 font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
                    {group.label}
                  </p>
                  <ul className="mt-1.5 space-y-0.5">
                    {group.tools.map((tool) => {
                      const active = pathname === tool.href;
                      return (
                        <li key={tool.id}>
                          <Link
                            href={tool.href}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "block rounded-lg px-2 py-1.5 text-sm transition-colors",
                              active
                                ? "bg-muted font-medium text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {shortName(tool.name)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
