import { Link } from 'react-router';
import studioImage from '../../assets/brand-story.png';
import Button from '../ui/Button';

const BrandStory = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 animate-slide-in-left">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-12 h-[1px] bg-gray-900"></span>
              <span className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-900">Our Story</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Crafting Excellence <br />
              <span className="text-gray-400">Since 2025</span>
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                At Shopera, we believe that fashion is more than just clothing—it's a statement of individuality. 
                Our journey began with a simple mission: to create pieces that merge contemporary aesthetics with 
                timeless elegance.
              </p>
              <p>
                Every stitch tells a story of dedication. We collaborate with the world's finest artisans to 
                source sustainable materials that not only look good but feel exceptional against your skin.
              </p>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-gray-900">10k+</span>
                <span className="text-sm text-gray-500 uppercase tracking-widest mt-1">Designs Created</span>
              </div>
              <div className="w-px bg-gray-200 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-gray-900">100%</span>
                <span className="text-sm text-gray-500 uppercase tracking-widest mt-1">Sustainable</span>
              </div>
            </div>

            <div className="mt-10">
              <Link to="/about">
                <Button 
                  variant="outline" 
                  className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  Read Full Story
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="order-1 lg:order-2 relative animate-slide-in-right">
            <div className="relative aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl">
              <img 
                src={studioImage} 
                alt="Our design studio" 
                className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gray-100 rounded-full -z-10"></div>
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-cyan-50 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
