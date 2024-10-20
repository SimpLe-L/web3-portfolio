"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IMenuItem } from "@/types"

import { cn } from "@/lib/utils";

const MenuItem = ({ item }: { item: IMenuItem }) => {
  const pathname = usePathname();
  return (
    <Link href={item.path} className={cn("p-[10px] text-[--secondry-text] flex items-center rounded-[10px] hover:scale-105 hover:bg-[#2e374a] transform transition", `${pathname === item.path && 'bg-[#2e374a]'}`)}>
      {item.icon}
      {item.title}
    </Link>
  );
};

export default MenuItem;