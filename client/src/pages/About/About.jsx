import {
    BuildingOffice2Icon,
    GlobeAmericasIcon,
    HeartIcon,
    SparklesIcon,
    TrophyIcon,
    UsersIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router";
import heroImg1 from '../../assets/sports-hero-1.png';

export default function About() {
  const stats = [
    { label: 'Years of Excellence', value: '25+', icon: TrophyIcon },
    { label: 'Global Locations', value: '50+', icon: GlobeAmericasIcon },
    { label: 'Happy Athletes', value: '1M+', icon: UsersIcon },
    { label: 'Team Members', value: '500+', icon: BuildingOffice2Icon },
  ];

  const values = [
    {
      title: 'Performance First',
      description: 'We believe in pushing boundaries. Our gear is designed to help you achieve your personal best.',
      icon: TrophyIcon,
    },
    {
      title: 'Community Focused',
      description: 'Sports unite us. We support local leagues, school programs, and grassroots athletics globally.',
      icon: UsersIcon,
    },
    {
      title: 'Sustainable Innovation',
      description: 'Protecting our playground. We leverage eco-friendly materials and sustainable manufacturing.',
      icon: GlobeAmericasIcon,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900 isolation-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 z-0"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20 animate-fade-in-down">
            <SparklesIcon className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-200 font-medium text-sm tracking-wide uppercase">Since 2000</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Empowering Every <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Athlete's Journey</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-300 leading-relaxed mb-10">
            At Athletora, we don't just sell equipment; we fuel passions. From the weekend warrior to the pro athlete, we provide the gear that makes the difference.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-cyan-600">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-3xl opacity-20 blur-lg transform -rotate-2"></div>
                <img 
                  src={heroImg1} 
                  alt="Athletora Team" 
                  className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
                />
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-sm font-bold text-cyan-600 uppercase tracking-widest mb-3">Our Story</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Built by Athletes, For Athletes</h3>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  Athletora started with a simple idea: better gear leads to better performance. Founded by a group of former professional athletes, we saw a gap in the market for high-quality, specialized sports equipment that was accessible to everyone.
                </p>
                <p>
                  For over two decades, we've remained true to that original vision. Every product we curate passes our rigorous "Athlete Approved" testing process. We're not just a store; we're performance partners.
                </p>
                <div className="pt-4">
                   <Link to="/products" className="inline-flex items-center text-cyan-700 font-bold hover:text-cyan-800 transition-colors">
                    Explore our collection 
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-cyan-600 uppercase tracking-widest mb-3">Our Core Values</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">What Drives Us Forward</h3>
            <p className="text-lg text-slate-600">
              We're committed to more than just commerce. These are the principles that guide every decision we make at Athletora.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-cyan-500/30">
                  <value.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h4>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
