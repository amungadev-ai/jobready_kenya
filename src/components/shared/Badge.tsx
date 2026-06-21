import { EmploymentType, ExperienceLevel } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import {
  EmploymentTypeLabels,
  ExperienceLevelLabels,
  EmploymentTypeColors,
  ExperienceLevelColors,
} from '@/lib/enums';

// ============================================================
// EMPLOYMENT TYPE BADGE
// ============================================================

interface EmploymentTypeBadgeProps {
  type: EmploymentType;
  className?: string;
}

export function EmploymentTypeBadge({ type, className }: EmploymentTypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${EmploymentTypeColors[type]} ${className ?? ''}`}
    >
      {EmploymentTypeLabels[type]}
    </Badge>
  );
}

// ============================================================
// EXPERIENCE LEVEL BADGE
// ============================================================

interface ExperienceLevelBadgeProps {
  level: ExperienceLevel;
  className?: string;
}

export function ExperienceLevelBadge({ level, className }: ExperienceLevelBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${ExperienceLevelColors[level]} ${className ?? ''}`}
    >
      {ExperienceLevelLabels[level]}
    </Badge>
  );
}

// ============================================================
// RE-EXPORT BASE BADGE
// ============================================================

export { Badge } from '@/components/ui/badge';