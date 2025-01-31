import type { NextPage } from 'next';
import Image from "next/image";

const CompanyLogo: NextPage = () => {
    const logos = [
        { src: "/homepage/Companies/zapier.png", alt: "zapier", width: 85, height: 87 },
        { src: "/homepage/Companies/pipedrive.png", alt: "pipedrive", width: 107, height: 109 },
        { src: "/homepage/Companies/cibbank.png", alt: "cibbank", width: 135, height: 139 },
        { src: "/homepage/Companies/Z.png", alt: "Z", width: 63, height: 65 },
        { src: "/homepage/Companies/burnt-toast.png", alt: "burnt toast", width: 98, height: 101 },
        { src: "/homepage/Companies/pandadoc.png", alt: "panda doc", width: 113, height: 115 },
        { src: "/homepage/Companies/moz.png", alt: "moz", width: 84, height: 87 }
    ];
 
    return (
        <section className="w-full py-12 font-inter bg-gray-scales-white">
            <div className="container mx-auto px-4 lg:px-20">
                <h2 className="text-2xl md:text-4xl lg:text-[32px] font-semibold text-gray-scales-black text-center mb-12">
                    Our Partners
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12">
                    {logos.map((logo) => (
                        <div 
                            key={logo.alt} 
                            className="flex items-center justify-center w-1/3 sm:w-1/4 md:w-auto"
                        >
                            <Image 
                                className="object-contain cursor-pointer max-w-[120px] md:max-w-none opacity-60 hover:opacity-100 transition-opacity" 
                                width={logo.width} 
                                height={logo.height} 
                                alt={logo.alt} 
                                src={logo.src} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CompanyLogo;
