import { JobCard } from '@/components/shared/JobCard';
import { SectionHeading } from '@/components/shared/SectionHeading';
import type { JobWithOrg } from '@/lib/data/jobs';

interface FeaturedJobsCarouselProps {
  jobs: JobWithOrg[];
}

export function FeaturedJobsCarousel({ jobs }: FeaturedJobsCarouselProps) {
  if (jobs.length === 0) return null;

  return (
    <section className="mb-8">
      <SectionHeading
        title="Featured Jobs"
        subtitle="Handpicked opportunities from top employers"
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            slug={job.slug}
            organizationName={job.organization?.orgName}
            organizationLogoUrl={job.organization?.orgLogoUrl}
            organizationSlug={job.organization?.orgSlug}
            locationCity={job.locationCity}
            locationCounty={job.locationCounty}
            employmentType={job.employmentType}
            experienceLevel={job.experienceLevel}
            salaryMin={job.salaryMin}
            salaryMax={job.salaryMax}
            salaryDisclosure={job.salaryDisclosure}
            salaryCurrency={job.salaryCurrency}
            datePosted={job.datePosted}
            deadline={job.deadline}
            isRemote={job.isRemote}
            isFeatured={job.isFeatured}
          />
        ))}
      </div>
    </section>
  );
}