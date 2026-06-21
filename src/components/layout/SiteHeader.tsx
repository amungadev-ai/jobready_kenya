'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Menu, ChevronDown, Briefcase, MapPin, Building2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const NAV_LINKS = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Government Jobs', href: '/jobs?type=government' },
  { label: 'Internships', href: '/jobs?employmentType=internship' },
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Career Advice', href: '/career-advice' },
] as const;

// ------------------------------------------------------------------
// Dropdown type
// ------------------------------------------------------------------
interface DropdownItem {
  label: string;
  href: string;
}

interface DropdownSection {
  title: string;
  icon?: React.ReactNode;
  items: DropdownItem[];
}

function NavDropdown({
  triggerLabel,
  sections,
}: {
  triggerLabel: string;
  sections: DropdownSection[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        className="flex items-center gap-1 text-sm font-medium text-gray-700 transition hover:text-emerald-600"
        onClick={() => setOpen(!open)}
      >
        {triggerLabel}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div className="w-[520px] rounded-xl border border-gray-200/80 bg-white p-4 shadow-xl shadow-gray-200/40">
            <div className="grid grid-cols-2 gap-4">
              {sections.map((section) => (
                <div key={section.title}>
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                    {section.icon}
                    {section.title}
                  </h4>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-2.5 py-1.5 text-sm text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    {section.items.length === 0 && (
                      <li className="px-2.5 py-2 text-xs text-gray-400">Loading...</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Header
// ------------------------------------------------------------------

export function SiteHeader() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const [counties, setCounties] = useState<DropdownItem[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, countyRes] = await Promise.all([
          fetch('/api/categories?limit=20'),
          fetch('/api/counties'),
        ]);
        if (catRes.ok) {
          const cats = await catRes.json();
          setCategories(cats.map((c: { label: string; slug: string }) => ({
            label: c.label,
            href: `/jobs/category/${c.slug}`,
          })));
        }
        if (countyRes.ok) {
          const data = await countyRes.json();
          setCounties(data.map((c: { name: string; slug: string }) => ({
            label: c.name,
            href: `/jobs/county/${c.slug}`,
          })));
        }
      } catch {
        // Use fallbacks
        setCategories([
          { label: 'IT & Software', href: '/jobs/category/it-software' },
          { label: 'Finance & Accounting', href: '/jobs/category/finance-accounting' },
          { label: 'Health & Medical', href: '/jobs/category/health-medical' },
          { label: 'Engineering', href: '/jobs/category/engineering' },
          { label: 'Education', href: '/jobs/category/education' },
          { label: 'Administration', href: '/jobs/category/administration' },
          { label: 'View All Categories', href: '/categories' },
        ]);
        setCounties([
          { label: 'Nairobi', href: '/jobs/county/nairobi' },
          { label: 'Mombasa', href: '/jobs/county/mombasa' },
          { label: 'Kisumu', href: '/jobs/county/kisumu' },
          { label: 'Nakuru', href: '/jobs/county/nakuru' },
          { label: 'Eldoret', href: '/jobs/county/uasin-gishu' },
          { label: 'View All Counties', href: '/counties' },
        ]);
      }
    }
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/jobs?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const dropdownSections: DropdownSection[] = [
    {
      title: 'Categories',
      icon: <Briefcase className="h-3.5 w-3.5" />,
      items: categories,
    },
    {
      title: 'Locations',
      icon: <MapPin className="h-3.5 w-3.5" />,
      items: counties,
    },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-emerald-700 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wide sm:text-sm">
            🇰🇪 Kenya&apos;s #1 Job Board — Find your next role
          </p>
          <div className="hidden items-center gap-4 text-xs text-emerald-100 sm:flex">
            <Link href="/jobs" className="hover:text-white transition">
              Browse Jobs
            </Link>
            <Link href="/opportunities" className="hover:text-white transition">
              Opportunities
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              JOBR
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
              KE
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 lg:flex">
            <NavDropdown triggerLabel="Browse" sections={dropdownSections} />
            {NAV_LINKS.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition hover:text-emerald-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 sm:flex">
            {/* Desktop search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-48 rounded-lg border border-gray-200 bg-gray-50/50 pl-8 pr-3 text-sm transition focus:w-64 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </form>
            <Link
              href="/post-job"
              className="rounded-full border border-emerald-600 px-4 py-1.5 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
            >
              Post a Job
            </Link>
            <Link
              href="/upload-cv"
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Upload CV
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-gray-700 hover:bg-gray-100"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <SheetHeader className="border-b border-gray-200/50 px-5 py-4">
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <span className="text-xl font-extrabold text-emerald-600">
                      JOBR
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                      KE
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col px-2 py-2">
                  <SheetClose asChild>
                    <Link
                      href="/jobs"
                      className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      All Jobs
                    </Link>
                  </SheetClose>
                  {NAV_LINKS.slice(1).map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="my-2 border-t border-gray-200/50" />
                  <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Top Categories
                  </p>
                  {categories.slice(0, 6).map((cat) => (
                    <SheetClose key={cat.href} asChild>
                      <Link
                        href={cat.href}
                        className="rounded-lg px-4 py-2.5 text-sm text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        {cat.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 border-t border-gray-200/50 px-5 py-4">
                  <SheetClose asChild>
                    <Link
                      href="/post-job"
                      className="rounded-full border border-emerald-600 px-4 py-2 text-center text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
                    >
                      Post a Job
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/upload-cv"
                      className="rounded-full bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                      Upload CV
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="border-t border-gray-200/50 px-4 py-3 lg:hidden">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Job title, skill, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-lg bg-emerald-600 px-4 hover:bg-emerald-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}