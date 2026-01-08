import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router';
import ProductCard from '../ProductCard';

const NewArrivals = ({ products }) => {
  // Sort by createdAt desc and take top 4
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="animate-fade-in-up">
            <span className="text-cyan-600 font-semibold tracking-wider text-sm uppercase mb-2 block">Just Landed</span>
            <h2 className="text-4xl font-bold text-gray-900">New Arrivals</h2>
          </div>
          <Link to="/products" className="group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="flex items-center gap-2 text-gray-600 group-hover:text-cyan-600 transition-colors font-medium">
              View Collection
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivals.map((product, index) => (
            <div 
              key={product._id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
