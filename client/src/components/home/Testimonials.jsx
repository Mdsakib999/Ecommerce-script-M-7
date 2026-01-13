import { StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Fashion Blogger',
    rating: 5,
    text: "The quality of the fabrics is simply outstanding. I've never felt so confident wearing a brand before. Athletora has completely transformed my wardrobe!",
    initials: 'SM'
  },
  {
    id: 2,
    name: 'James Carter',
    role: 'Verified Buyer',
    rating: 5,
    text: "Incredible attention to detail. The shipping was faster than expected, and the packaging felt like opening a luxury gift. Highly recommended.",
    initials: 'JC'
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Influencer',
    rating: 4,
    text: "Love the modern designs! The customer service team was super helpful when I needed to exchange a size. Will definitely be shopping here again.",
    initials: 'ED'
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by Thousands</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-6 h-6" />
              ))}
            </div>
            <span className="text-gray-600 font-medium">4.9/5 Average Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 relative border border-gray-100 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-8 text-9xl leading-none text-gray-100 font-serif opacity-50 select-none">
                "
              </div>

              <div className="relative z-10">
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5" />
                  ))}
                </div>
                
                <p className="text-gray-600 text-lg mb-8 italic leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-cyan-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
