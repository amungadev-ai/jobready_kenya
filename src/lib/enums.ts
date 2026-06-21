import {
  EmploymentType,
  ExperienceLevel,
  EducationLevel,
  SalaryDisclosure,
  JobStatus,
  JobSource,
  OpportunityType,
  OpportunityStatus,
  FundingDisclosure,
  OrganizationType,
  OrganizationIndustry,
} from '@prisma/client';

// ============================================================
// LABEL MAPS
// ============================================================

export const EmploymentTypeLabels: Record<EmploymentType, string> = {
  [EmploymentType.FULL_TIME]: 'Full-time',
  [EmploymentType.PART_TIME]: 'Part-time',
  [EmploymentType.CONTRACT]: 'Contract',
  [EmploymentType.FREELANCE]: 'Freelance',
  [EmploymentType.INTERNSHIP]: 'Internship',
  [EmploymentType.APPRENTICESHIP]: 'Apprenticeship',
  [EmploymentType.TEMPORARY]: 'Temporary',
  [EmploymentType.CASUAL]: 'Casual',
  [EmploymentType.VOLUNTEER]: 'Volunteer',
};

export const ExperienceLevelLabels: Record<ExperienceLevel, string> = {
  [ExperienceLevel.ENTRY]: 'Entry Level',
  [ExperienceLevel.JUNIOR]: 'Junior',
  [ExperienceLevel.MID]: 'Mid Level',
  [ExperienceLevel.SENIOR]: 'Senior',
  [ExperienceLevel.LEAD]: 'Lead',
  [ExperienceLevel.EXECUTIVE]: 'Executive',
};

export const EducationLevelLabels: Record<EducationLevel, string> = {
  [EducationLevel.NONE]: 'No Requirement',
  [EducationLevel.HIGH_SCHOOL]: 'High School',
  [EducationLevel.CERTIFICATE]: 'Certificate',
  [EducationLevel.DIPLOMA]: 'Diploma',
  [EducationLevel.BACHELORS]: "Bachelor's Degree",
  [EducationLevel.MASTERS]: "Master's Degree",
  [EducationLevel.DOCTORATE]: 'Doctorate',
  [EducationLevel.PROFESSIONAL]: 'Professional Certification',
};

export const SalaryDisclosureLabels: Record<SalaryDisclosure, string> = {
  [SalaryDisclosure.NOT_DISCLOSED]: 'Not Disclosed',
  [SalaryDisclosure.NEGOTIABLE]: 'Negotiable',
  [SalaryDisclosure.COMPETITIVE]: 'Competitive',
  [SalaryDisclosure.SHOW_RANGE]: 'Show Range',
};

export const JobStatusLabels: Record<JobStatus, string> = {
  [JobStatus.ACTIVE]: 'Active',
  [JobStatus.EXPIRED]: 'Expired',
  [JobStatus.PAUSED]: 'Paused',
  [JobStatus.DRAFT]: 'Draft',
};

export const OpportunityTypeLabels: Record<OpportunityType, string> = {
  [OpportunityType.SCHOLARSHIP]: 'Scholarship',
  [OpportunityType.GRANT]: 'Grant',
  [OpportunityType.FELLOWSHIP]: 'Fellowship',
  [OpportunityType.SPONSORSHIP]: 'Sponsorship',
  [OpportunityType.MENTORSHIP]: 'Mentorship',
  [OpportunityType.COMPETITION]: 'Competition',
  [OpportunityType.CONFERENCE]: 'Conference',
  [OpportunityType.TRAINING]: 'Training',
  [OpportunityType.VOLUNTEER]: 'Volunteer',
};

export const OpportunityStatusLabels: Record<OpportunityStatus, string> = {
  [OpportunityStatus.ACTIVE]: 'Active',
  [OpportunityStatus.EXPIRED]: 'Expired',
  [OpportunityStatus.PAUSED]: 'Paused',
  [OpportunityStatus.DRAFT]: 'Draft',
};

export const FundingDisclosureLabels: Record<FundingDisclosure, string> = {
  [FundingDisclosure.NOT_DISCLOSED]: 'Not Disclosed',
  [FundingDisclosure.FULLY_FUNDED]: 'Fully Funded',
  [FundingDisclosure.PARTIALLY_FUNDED]: 'Partially Funded',
  [FundingDisclosure.SHOW_AMOUNT]: 'Show Amount',
  [FundingDisclosure.NOT_FUNDED]: 'Not Funded',
};

export const OrganizationTypeLabels: Record<OrganizationType, string> = {
  [OrganizationType.PRIVATE_COMPANY]: 'Private Company',
  [OrganizationType.PUBLIC_LISTED_COMPANY]: 'Public Listed Company',
  [OrganizationType.NATIONAL_GOVERNMENT]: 'National Government',
  [OrganizationType.COUNTY_GOVERNMENT]: 'County Government',
  [OrganizationType.STATE_CORPORATION]: 'State Corporation',
  [OrganizationType.REGULATORY_AUTHORITY]: 'Regulatory Authority',
  [OrganizationType.NGO_LOCAL]: 'Local NGO',
  [OrganizationType.NGO_INTERNATIONAL]: 'International NGO',
  [OrganizationType.UNIVERSITY]: 'University',
  [OrganizationType.TVET_INSTITUTION]: 'TVET Institution',
  [OrganizationType.PRIMARY_SECONDARY_SCHOOL]: 'Primary/Secondary School',
  [OrganizationType.FOUNDATION]: 'Foundation',
  [OrganizationType.EMBASSY_DIPLOMATIC]: 'Embassy / Diplomatic',
  [OrganizationType.RELIGIOUS_ORGANIZATION]: 'Religious Organization',
  [OrganizationType.COOPERATIVE_SOCIETY]: 'Cooperative Society',
  [OrganizationType.STARTUP]: 'Startup',
};

export const OrganizationIndustryLabels: Record<OrganizationIndustry, string> = {
  [OrganizationIndustry.AGRICULTURE]: 'Agriculture',
  [OrganizationIndustry.AUTOMOTIVE]: 'Automotive',
  [OrganizationIndustry.AVIATION]: 'Aviation',
  [OrganizationIndustry.BANKING]: 'Banking',
  [OrganizationIndustry.CONSTRUCTION]: 'Construction',
  [OrganizationIndustry.CONSULTING]: 'Consulting',
  [OrganizationIndustry.CONSUMER_GOODS]: 'Consumer Goods',
  [OrganizationIndustry.EDUCATION]: 'Education',
  [OrganizationIndustry.ENERGY]: 'Energy',
  [OrganizationIndustry.ENVIRONMENT]: 'Environment',
  [OrganizationIndustry.FINTECH]: 'Fintech',
  [OrganizationIndustry.FOOD_BEVERAGE]: 'Food & Beverage',
  [OrganizationIndustry.GOVERNMENT_PUBLIC_ADMIN]: 'Government & Public Admin',
  [OrganizationIndustry.HEALTHCARE]: 'Healthcare',
  [OrganizationIndustry.HOSPITALITY_TOURISM]: 'Hospitality & Tourism',
  [OrganizationIndustry.HUMAN_RESOURCES]: 'Human Resources',
  [OrganizationIndustry.INFORMATION_TECHNOLOGY]: 'IT & Software',
  [OrganizationIndustry.INSURANCE]: 'Insurance',
  [OrganizationIndustry.INTERNATIONAL_DEVELOPMENT]: 'International Development',
  [OrganizationIndustry.LEGAL]: 'Legal',
  [OrganizationIndustry.LOGISTICS_SUPPLY_CHAIN]: 'Logistics & Supply Chain',
  [OrganizationIndustry.MANUFACTURING]: 'Manufacturing',
  [OrganizationIndustry.MARKETING_ADVERTISING]: 'Marketing & Advertising',
  [OrganizationIndustry.MEDIA_ENTERTAINMENT]: 'Media & Entertainment',
  [OrganizationIndustry.MINING]: 'Mining',
  [OrganizationIndustry.NON_PROFIT]: 'Non-Profit',
  [OrganizationIndustry.PHARMACEUTICAL]: 'Pharmaceutical',
  [OrganizationIndustry.REAL_ESTATE]: 'Real Estate',
  [OrganizationIndustry.RESEARCH]: 'Research',
  [OrganizationIndustry.RETAIL]: 'Retail',
  [OrganizationIndustry.SECURITY_DEFENSE]: 'Security & Defense',
  [OrganizationIndustry.SPORTS]: 'Sports',
  [OrganizationIndustry.TELECOMMUNICATIONS]: 'Telecommunications',
  [OrganizationIndustry.TEXTILES_APPAREL]: 'Textiles & Apparel',
  [OrganizationIndustry.WATER_SANITATION]: 'Water & Sanitation',
};

// ============================================================
// SLUG ↔ ENUM CONVERSIONS
// ============================================================

const enumToSlug = (enumValue: string): string =>
  enumValue.toLowerCase().replace(/_/g, '-');

const slugToEnum = <T extends Record<string, string>>(
  slug: string,
  enumObj: T
): T[keyof T] | undefined => {
  const key = Object.keys(enumObj).find(
    (k) => enumToSlug(k) === slug.toLowerCase()
  );
  return key ? (enumObj[key] as T[keyof T]) : undefined;
};

// Employment type slug helpers
export const employmentTypeToSlug = (type: EmploymentType): string =>
  enumToSlug(type);

export const slugToEmploymentType = (slug: string): EmploymentType | undefined =>
  slugToEnum(slug, EmploymentType);

// Experience level slug helpers
export const experienceLevelToSlug = (level: ExperienceLevel): string =>
  enumToSlug(level);

export const slugToExperienceLevel = (slug: string): ExperienceLevel | undefined =>
  slugToEnum(slug, ExperienceLevel);

// Opportunity type slug helpers
export const opportunityTypeToSlug = (type: OpportunityType): string =>
  enumToSlug(type);

export const slugToOpportunityType = (slug: string): OpportunityType | undefined =>
  slugToEnum(slug, OpportunityType);

// Organization type slug helpers
export const organizationTypeToSlug = (type: OrganizationType): string =>
  enumToSlug(type);

export const slugToOrganizationType = (slug: string): OrganizationType | undefined =>
  slugToEnum(slug, OrganizationType);

// ============================================================
// BADGE COLOR MAPPINGS
// ============================================================

export const EmploymentTypeColors: Record<EmploymentType, string> = {
  [EmploymentType.FULL_TIME]: 'bg-green-50 text-green-700 border-green-200',
  [EmploymentType.PART_TIME]: 'bg-blue-50 text-blue-700 border-blue-200',
  [EmploymentType.CONTRACT]: 'bg-amber-50 text-amber-700 border-amber-200',
  [EmploymentType.INTERNSHIP]: 'bg-purple-50 text-purple-700 border-purple-200',
  [EmploymentType.FREELANCE]: 'bg-teal-50 text-teal-700 border-teal-200',
  [EmploymentType.APPRENTICESHIP]: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  [EmploymentType.TEMPORARY]: 'bg-slate-50 text-slate-700 border-slate-200',
  [EmploymentType.CASUAL]: 'bg-orange-50 text-orange-700 border-orange-200',
  [EmploymentType.VOLUNTEER]: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const ExperienceLevelColors: Record<ExperienceLevel, string> = {
  [ExperienceLevel.ENTRY]: 'bg-slate-50 text-slate-700 border-slate-200',
  [ExperienceLevel.JUNIOR]: 'bg-blue-50 text-blue-700 border-blue-200',
  [ExperienceLevel.MID]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [ExperienceLevel.SENIOR]: 'bg-purple-50 text-purple-700 border-purple-200',
  [ExperienceLevel.LEAD]: 'bg-amber-50 text-amber-700 border-amber-200',
  [ExperienceLevel.EXECUTIVE]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const OpportunityTypeColors: Record<OpportunityType, string> = {
  [OpportunityType.SCHOLARSHIP]: 'bg-blue-50 text-blue-700 border-blue-200',
  [OpportunityType.GRANT]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [OpportunityType.FELLOWSHIP]: 'bg-purple-50 text-purple-700 border-purple-200',
  [OpportunityType.SPONSORSHIP]: 'bg-teal-50 text-teal-700 border-teal-200',
  [OpportunityType.MENTORSHIP]: 'bg-amber-50 text-amber-700 border-amber-200',
  [OpportunityType.COMPETITION]: 'bg-rose-50 text-rose-700 border-rose-200',
  [OpportunityType.CONFERENCE]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [OpportunityType.TRAINING]: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  [OpportunityType.VOLUNTEER]: 'bg-orange-50 text-orange-700 border-orange-200',
};

// ============================================================
// LABEL LOOKUP HELPERS
// ============================================================

export const getEmploymentTypeLabel = (type: EmploymentType): string =>
  EmploymentTypeLabels[type] ?? type;

export const getExperienceLevelLabel = (level: ExperienceLevel): string =>
  ExperienceLevelLabels[level] ?? level;

export const getEducationLevelLabel = (level: EducationLevel): string =>
  EducationLevelLabels[level] ?? level;

export const getOpportunityTypeLabel = (type: OpportunityType): string =>
  OpportunityTypeLabels[type] ?? type;

export const getOrganizationTypeLabel = (type: OrganizationType): string =>
  OrganizationTypeLabels[type] ?? type;

export const getOrganizationIndustryLabel = (industry: OrganizationIndustry): string =>
  OrganizationIndustryLabels[industry] ?? industry;