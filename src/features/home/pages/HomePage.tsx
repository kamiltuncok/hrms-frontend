import { HeroSection } from '../components/HeroSection';
import { FeaturedJobs } from '../components/FeaturedJobs';
import { CategoriesSection } from '../components/CategoriesSection';
import { HowItWorksSection } from '../components/HowItWorks';
import { TopCompaniesSection } from '../components/TopCompanies';
import { CallToActionSection } from '../components/CTASection';

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedJobs />
      <CategoriesSection />
      <HowItWorksSection />
      <TopCompaniesSection />
      <CallToActionSection />
    </div>
  );
}
