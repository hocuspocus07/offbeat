"use client";

import Link from "next/link";
import { Bell, ChevronLeft, ChevronRight, Home, Users } from "lucide-react";
import SearchBarDropdown from "@/components/home/search-bar-dropdown";

export default function TopNavigation() {
  return (
    <header className="z-30 flex h-[58px] shrink-0 items-center justify-between gap-3 bg-[#121212] px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button aria-label="Go back" onClick={() => history.back()} className="grid size-8 place-items-center rounded-full text-[#aaa] hover:text-white"><ChevronLeft size={23} /></button>
          <button aria-label="Go forward" onClick={() => history.forward()} className="grid size-8 place-items-center rounded-full text-[#aaa] hover:text-white"><ChevronRight size={23} /></button>
        </div>
        <Link href="/" aria-label="Home" className="hidden size-11 shrink-0 place-items-center rounded-full bg-[#242424] text-white md:grid"><Home size={21} fill="currentColor" /></Link>
        <SearchBarDropdown />
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button aria-label="Notifications" className="grid size-8 place-items-center rounded-full text-[#aaa] hover:text-white"><Bell size={19} /></button>
        <button aria-label="Friends activity" className="hidden size-8 place-items-center rounded-full text-[#aaa] hover:text-white sm:grid"><Users size={19} /></button>
        <Link href="/account" aria-label="Account" className="grid size-10 place-items-center rounded-full bg-[#438bf4] font-semibold text-black ring-4 ring-[#242424]">O</Link>
      </div>
    </header>
  );
}
