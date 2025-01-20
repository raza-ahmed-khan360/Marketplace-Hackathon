import type { NextPage } from 'next';
import CardGrid from '../../components/CardProducts';

const OurProducts: NextPage = () => {
  return (
    <section className="w-auto py-12 font-inter">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl lg:text-[32px] font-semibold capitalize mb-12 text-gray-scales-black text-center">
          Our Products
        </h2>
        <CardGrid />
      </div>
    </section>
  );
};

export default OurProducts;
