import type { NextPage } from 'next';
import Image from "next/image";

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}
  
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="bg-light-grey p-12 w-full flex flex-col font-inter items-start space-y-3">
      <Image 
        className="w-6 h-6 overflow-hidden" 
        width={24} 
        height={24} 
        alt={title} 
        src={icon} 
      />
      <div className="text-xl font-inter leading-[140%] text-teal">{title}</div>
      <div className="text-base leading-[150%]">{description}</div>
    </div>
);
  
const Features: NextPage = () => {
    const features = [
      {
        icon: "/About/Delivery.svg",
        title: "Next day as standard",
        description: "Order before 3pm and get your order the next day as standard"
      },
      {
        icon: "/About/Checkmark--outline.svg",
        title: "Made by true artisans",
        description: "Handmade crafted goods made with real passion and craftmanship"
      },
      {
        icon: "/About/Purchase.svg",
        title: "Unbeatable prices",
        description: "For our materials and quality you won't find better prices anywhere"
      },
      {
        icon: "/About/Sprout.svg",
        title: "Recycled packaging",
        description: "We use 100% recycled to ensure our footprint is more manageable"
      }
    ];
  
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-center font-inter text-[32px] leading-[110%] font-semibold text-gray-scales-black mb-12">
          What makes our Brand Different
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    );
};

export default Features;
