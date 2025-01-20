import TopCategotires from "./sections/Categories";
import CompanyLogo from "./sections/Companies";
import ExploreSection from "./sections/Explore";
import FeaturedProducts from "./sections/Featured";
import Hero from "./sections/Hero";
import OurProducts from "./sections/OurProducts";

export default function HomePage() {
  return (
    <div>
      <Hero/>
      <CompanyLogo/>
      <FeaturedProducts/>
      <TopCategotires/>
      <ExploreSection/>
      <OurProducts/>
    </div>
  );
}
