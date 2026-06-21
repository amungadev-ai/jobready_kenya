'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X, Briefcase, GraduationCap, MapPin, Wifi, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { EmploymentType, ExperienceLevel } from '@prisma/client';
import {
  EmploymentTypeLabels,
  ExperienceLevelLabels,
  employmentTypeToSlug,
  experienceLevelToSlug,
} from '@/lib/enums';
import { TOP_COUNTIES } from '@/lib/data/counties';
import type { CategoryWithCount } from '@/lib/data/categories';

// ============================================================
// TYPES
// ============================================================

interface JobFiltersSidebarProps {
  categories: CategoryWithCount[];
}

const EMPLOYMENT_TYPES = Object.values(EmploymentType) as EmploymentType[];
const EXPERIENCE_LEVELS = Object.values(ExperienceLevel) as ExperienceLevel[];

// ============================================================
// FILTER CONTENT (shared between sidebar & sheet)
// ============================================================

function FilterContent({ categories }: JobFiltersSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ----- Local state for search input (draft — commits on form submit) -----
  const [searchValue, setSearchValue] = useState(() => searchParams.get('q') ?? '');

  // ----- Build URL helper -----
  const buildUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      // Reset page when filters change
      params.delete('page');
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [searchParams, pathname]
  );

  // ----- Handlers -----
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const url = buildUrl({ q: searchValue.trim() || null });
      router.push(url);
    },
    [searchValue, buildUrl, router]
  );

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    router.push(buildUrl({ q: null }));
  }, [buildUrl, router]);

  const toggleEmploymentType = useCallback(
    (type: EmploymentType) => {
      const currentSlug = searchParams.get('employmentType');
      const newSlug =
        currentSlug === employmentTypeToSlug(type)
          ? null
          : employmentTypeToSlug(type);
      router.push(buildUrl({ employmentType: newSlug }));
    },
    [searchParams, buildUrl, router]
  );

  const toggleExperienceLevel = useCallback(
    (level: ExperienceLevel) => {
      const currentSlug = searchParams.get('experienceLevel');
      const newSlug =
        currentSlug === experienceLevelToSlug(level)
          ? null
          : experienceLevelToSlug(level);
      router.push(buildUrl({ experienceLevel: newSlug }));
    },
    [searchParams, buildUrl, router]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      router.push(buildUrl({ category: value === '_all' ? null : value }));
    },
    [buildUrl, router]
  );

  const handleCountyChange = useCallback(
    (value: string) => {
      router.push(buildUrl({ county: value === '_all' ? null : value }));
    },
    [buildUrl, router]
  );

  const handleRemoteToggle = useCallback(
    (checked: boolean) => {
      router.push(buildUrl({ remote: checked ? 'true' : null }));
    },
    [buildUrl, router]
  );

  const handleSalaryToggle = useCallback(
    (checked: boolean) => {
      router.push(buildUrl({ salary: checked ? 'true' : null }));
    },
    [buildUrl, router]
  );

  const handleClearAll = useCallback(() => {
    setSearchValue('');
    router.push(pathname);
  }, [router, pathname]);

  // ----- Active filter count -----
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchParams.get('q')) count++;
    if (searchParams.get('employmentType')) count++;
    if (searchParams.get('experienceLevel')) count++;
    if (searchParams.get('category')) count++;
    if (searchParams.get('county')) count++;
    if (searchParams.get('remote') === 'true') count++;
    if (searchParams.get('salary') === 'true') count++;
    return count;
  }, [searchParams]);

  // ----- Current values -----
  const selectedEmploymentSlug = searchParams.get('employmentType');
  const selectedExperienceSlug = searchParams.get('experienceLevel');
  const selectedCategory = searchParams.get('category');
  const selectedCounty = searchParams.get('county');
  const isRemote = searchParams.get('remote') === 'true';
  const hasSalary = searchParams.get('salary') === 'true';

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-bold text-gray-800">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="h-5 min-w-5 justify-center rounded-full bg-emerald-100 px-1.5 text-xs font-semibold text-emerald-700"
            >
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-7 px-2 text-xs text-gray-500 hover:text-red-600"
          >
            Clear all
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      {/* Scrollable filter body */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        <Accordion
          type="multiple"
          defaultValue={['search', 'employment-type', 'experience-level', 'category', 'location', 'toggles']}
          className="w-full"
        >
          {/* ---- Search ---- */}
          <AccordionItem value="search">
            <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:no-underline">
              Search
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Job title, company..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="h-9 pl-8 pr-8 text-sm"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </form>
            </AccordionContent>
          </AccordionItem>

          {/* ---- Category ---- */}
          <AccordionItem value="category">
            <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:no-underline">
              Category
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <Select
                value={selectedCategory ?? '_all'}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger size="sm" className="w-full text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">All Categories</SelectItem>
                  {categories
                    .filter((c) => c._count.jobs > 0)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center justify-between gap-4">
                          <span>{cat.label}</span>
                          <span className="text-xs text-gray-400">
                            {cat._count.jobs}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* ---- Location ---- */}
          <AccordionItem value="location">
            <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:no-underline">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Location
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <Select
                value={selectedCounty ?? '_all'}
                onValueChange={handleCountyChange}
              >
                <SelectTrigger size="sm" className="w-full text-sm">
                  <SelectValue placeholder="All Counties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">All Counties</SelectItem>
                  {TOP_COUNTIES.map((county) => (
                    <SelectItem key={county.slug} value={county.name}>
                      {county.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* ---- Employment Type ---- */}
          <AccordionItem value="employment-type">
            <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:no-underline">
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                Employment Type
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="space-y-2">
                {EMPLOYMENT_TYPES.map((type) => {
                  const slug = employmentTypeToSlug(type);
                  const isChecked = selectedEmploymentSlug === slug;
                  return (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleEmploymentType(type)}
                      />
                      <span className="flex-1">
                        {EmploymentTypeLabels[type]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ---- Experience Level ---- */}
          <AccordionItem value="experience-level">
            <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:no-underline">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" />
                Experience Level
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="space-y-2">
                {EXPERIENCE_LEVELS.map((level) => {
                  const slug = experienceLevelToSlug(level);
                  const isChecked = selectedExperienceSlug === slug;
                  return (
                    <label
                      key={level}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleExperienceLevel(level)}
                      />
                      <span className="flex-1">
                        {ExperienceLevelLabels[level]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ---- Toggles ---- */}
          <AccordionItem value="toggles">
            <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:no-underline">
              More Filters
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="space-y-4">
                {/* Remote */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="remote-toggle"
                    className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                  >
                    <Wifi className="h-3.5 w-3.5 text-gray-400" />
                    Remote only
                  </Label>
                  <Switch
                    id="remote-toggle"
                    checked={isRemote}
                    onCheckedChange={handleRemoteToggle}
                  />
                </div>

                <Separator />

                {/* Salary disclosed */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="salary-toggle"
                    className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                  >
                    <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                    Salary disclosed
                  </Label>
                  <Switch
                    id="salary-toggle"
                    checked={hasSalary}
                    onCheckedChange={handleSalaryToggle}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Clear all button at bottom */}
      {activeFilterCount > 0 && (
        <>
          <Separator className="mt-4" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="mt-3 w-full border-red-200 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );
}

// ============================================================
// MOBILE FILTER BUTTON + SHEET
// ============================================================

function MobileFilterButton({ categories }: JobFiltersSidebarProps) {
  const searchParams = useSearchParams();

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchParams.get('q')) count++;
    if (searchParams.get('employmentType')) count++;
    if (searchParams.get('experienceLevel')) count++;
    if (searchParams.get('category')) count++;
    if (searchParams.get('county')) count++;
    if (searchParams.get('remote') === 'true') count++;
    if (searchParams.get('salary') === 'true') count++;
    return count;
  }, [searchParams]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-gray-200 bg-white"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-1 h-5 min-w-5 justify-center rounded-full bg-emerald-100 px-1.5 text-xs font-semibold text-emerald-700">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] overflow-y-auto p-0 sm:max-w-sm">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle>Job Filters</SheetTitle>
          <SheetDescription>
            Narrow down your job search with filters
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 py-3">
          <FilterContent categories={categories} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ============================================================
// EXPORTED SIDEBAR (desktop + mobile trigger)
// ============================================================

export function JobFiltersSidebar({ categories }: JobFiltersSidebarProps) {
  return (
    <>
      {/* Mobile: filter button */}
      <div className="mb-4 lg:hidden">
        <MobileFilterButton categories={categories} />
      </div>

      {/* Desktop: inline sidebar */}
      <aside className="hidden w-[280px] shrink-0 lg:block" aria-label="Job filters">
        <div className="sticky top-24 rounded-xl border border-white/60 bg-white/70 p-4 backdrop-blur-sm">
          <FilterContent categories={categories} />
        </div>
      </aside>
    </>
  );
}