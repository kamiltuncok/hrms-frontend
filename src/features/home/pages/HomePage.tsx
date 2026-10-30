import { HeroSection } from '../components/HeroSection';
import { FeaturedJobs } from '../components/FeaturedJobs';
import { TopCompaniesSection } from '../components/TopCompanies';
import { CallToActionSection } from '../components/CTASection';

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#101319]">
      <HeroSection />
      <FeaturedJobs />
      <TopCompaniesSection />
      <CallToActionSection />
    </div>
  );
}
