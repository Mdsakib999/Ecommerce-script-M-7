import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import bgImage from '../../assets/offer-banner.png';
import Button from '../ui/Button';

const OfferBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set deadline to 2 days from now
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 2);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = deadline - now;

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gray-900 overflow-hidden relative">
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent" />
      
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl animate-scale-in">
          <span className="inline-block px-3 py-1 bg-red-500 text-white font-bold text-xs tracking-widest uppercase rounded mb-4">
            Limited Time Offer
          </span>
          <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Flash Sale <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">
              50% OFF All Accessories
            </span>
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Upgrade your style with our premium accessories collection. 
            Don't miss out on these exclusive deals before time runs out!
          </p>

          <div className="flex gap-4 mb-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                  <span className="text-2xl font-bold text-white">
                    {value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-2 uppercase block tracking-wider">
                  {unit}
                </span>
              </div>
            ))}
          </div>

          <Link to="/products">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 border-none shadow-xl transform transition-all duration-300"
            >
              Shop the Sale
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
