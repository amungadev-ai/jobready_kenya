'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollContainer({ children, className }: ScrollContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative flex items-center">
      {/* Left button — hidden on mobile, shown on md+ hover */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={cn(
          'scroll-btn absolute left-0 z-10 ml-1 hidden md:flex',
          !canScrollLeft && 'pointer-events-none opacity-30'
        )}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className={cn(
          'no-scrollbar flex w-full flex-nowrap overflow-x-auto py-4 px-8 sm:px-10',
          className
        )}
      >
        {children}
      </div>

      {/* Right button — hidden on mobile, shown on md+ hover */}
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={cn(
          'scroll-btn absolute right-0 z-10 mr-1 hidden md:flex',
          !canScrollRight && 'pointer-events-none opacity-30'
        )}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}