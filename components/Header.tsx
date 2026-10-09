'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export default function Header() {
  const { itemCount, openCart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-8 pb-4">
      {/* Logo */}
      <div className="mb-6">
        <Link href="/" className="inline-block">
          <img src="/logo.png" alt="O Z W V L D" className="w-60 h-8" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-center gap-6">
        <Link
          href="/"
          className="text-sm tracking-wider text-accent hover:text-hover transition-colors"
        >
          home
        </Link>
        <Link
          href="/bv-pl-oz-26"
          className="text-sm tracking-wider text-accent hover:text-hover transition-colors"
        >
          bv.pl.oz.26
        </Link>
        <Link
          href="/create-001"
          className="text-sm tracking-wider text-accent hover:text-hover transition-colors"
        >
          create.001
        </Link>
        <Link
          href="/info"
          className="text-sm tracking-wider text-accent hover:text-hover transition-colors"
        >
          info
        </Link>
        <Link
          href="/explore"
          className="text-sm tracking-wider text-accent hover:text-hover transition-colors"
        >
          explore
        </Link>
        
        {/* Cart Icon */}
        <button
          onClick={openCart}
          className="relative text-accent hover:text-hover transition-colors"
          aria-label="Open cart"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          
          {/* Item Counter */}
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}

