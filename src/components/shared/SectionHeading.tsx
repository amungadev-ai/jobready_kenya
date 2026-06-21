import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
}

export function SectionHeading({
  title,
  subtitle,
  viewAllHref,
  viewAllText = 'View All',
}: SectionHeadingProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-800">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm font-light text-gray-500">{subtitle}</p>
        )}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
        >
          {viewAllText}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}