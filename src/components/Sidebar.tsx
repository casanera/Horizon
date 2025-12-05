"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Radio, Trees, ShieldCheck, Wind, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { name: "Обзор", href: "/", icon: LayoutDashboard },
  { name: "ЭкоМонитор", href: "/eco", icon: Radio },
  { name: "Зеленый Город", href: "/green", icon: Trees },
  { name: "Безопасность", href: "/security", icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-72 flex-col border-r border-slate-800 bg-horizon-bg text-horizon-text">
      {/* логотайпчик */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
          <Wind className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide">Горизонт</h1>
          <p className="text-xs text-horizon-muted">Умная платформа</p>
        </div>
      </div>

      {/* Меню */}
      <div className="flex-1 py-6">
        <nav className="flex flex-col gap-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Профиль  */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>КД</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-medium">Кирилл Д.</p>
            <p className="truncate text-xs text-slate-400">Администратор</p>
          </div>
          <Settings className="ml-auto h-4 w-4 text-slate-500 cursor-pointer hover:text-white" />
        </div>
      </div>
    </div>
  );
}