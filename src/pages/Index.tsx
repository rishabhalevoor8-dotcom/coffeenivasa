import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { MenuShowcase } from '@/components/home/MenuShowcase';
import { BestSellers } from '@/components/home/BestSellers';
import { AboutPreview } from '@/components/home/AboutPreview';
import { Testimonials } from '@/components/home/Testimonials';
import { LocationSection } from '@/components/home/LocationSection';
import { StaffAccessBar } from '@/components/home/StaffAccessBar';

const Index = () => {
  return (
    <Layout>
      <StaffAccessBar />
      <HeroSection />
      <MenuShowcase />
      <BestSellers />
      <AboutPreview />
      <Testimonials />
      <LocationSection />
    </Layout>
  );
};

export default Index;
