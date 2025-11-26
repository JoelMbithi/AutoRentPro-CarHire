"use client";
import React from "react";

const Edition = () => {
  return (
    <>
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
        .animate-fade-in-left { animation: fade-in-left 1s ease-out forwards; }
        .animate-fade-in-right { animation: fade-in-right 1s ease-out forwards; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
      `}</style>

      <div
        className="w-full min-h-[200vh] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white px-6 py-20 relative overflow-hidden"
        style={{ backgroundImage: "url('/display.png')" }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        
        {/* Main Hero Section */}
        <div className="text-center z-10 mb-20 transition-all duration-700 hover:scale-105">
          <h1 className="text-4xl sm:text-6xl font-bold drop-shadow-lg text-center mb-6 animate-fade-in-up">
            Premium Car Rental Experience
          </h1>
          <p className="text-lg sm:text-xl mt-4 max-w-2xl text-center drop-shadow-md mx-auto opacity-0 animate-fade-in-up animation-delay-300">
            Explore our luxury, comfort and performance cars — ready for your next journey.
          </p>
          <button className="mt-8 bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-110 transition-all duration-300 opacity-0 animate-fade-in-up animation-delay-500">
            Explore Now
          </button>
        </div>

        {/* Grid Layout for Multiple Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto z-10 w-full">
          
          {/* Section 1 - Top Left */}
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in-left">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-orange-400 drop-shadow-md">
              🚗 Luxury Fleet
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Discover our exclusive collection of premium vehicles, from sleek sedans to powerful SUVs. 
              Each car is meticulously maintained and equipped with the latest amenities for your comfort.
            </p>
          </div>

          {/* Section 2 - Top Right */}
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in-right">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-orange-400 drop-shadow-md">
              ⭐ Unmatched Service
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Experience white-glove service with personalized attention. Our dedicated team ensures 
              every detail is perfect, from delivery to return, making your rental experience seamless.
            </p>
          </div>

          {/* Section 3 - Bottom Left */}
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in-left animation-delay-400">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-orange-400 drop-shadow-md">
              💰 Flexible Plans
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Choose from daily, weekly, or monthly rental options tailored to your needs. 
              Competitive pricing with no hidden fees and comprehensive insurance coverage included.
            </p>
          </div>

          {/* Section 4 - Bottom Right */}
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in-right animation-delay-400">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-orange-400 drop-shadow-md">
              🌍 Nationwide Coverage
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Pick up and drop off at multiple locations across the country. 
              Perfect for business trips, vacations, or special occasions wherever you go.
            </p>
          </div>
        </div>

        {/* Additional Center Section */}
        <div className="mt-16 text-center z-10 max-w-6xl mx-auto bg-gradient-to-r from-orange-600/20 via-red-600/20 to-purple-600/20 p-10 rounded-3xl border border-orange-400/30 backdrop-blur-sm transition-all duration-700 hover:scale-[1.02] opacity-0 animate-fade-in-up animation-delay-600">
  <h2 className="text-3xl sm:text-5xl font-bold mb-8 text-white drop-shadow-lg bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
    Why Choose AutoRentPro?
  </h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {/* Feature 1 */}
    <div className="bg-black/20 p-4 rounded-xl border border-white/10 hover:border-orange-400/50 transition-all duration-300">
      <div className="text-3xl mb-3">🏆</div>
      <h3 className="text-xl font-bold text-orange-300 mb-2">Award Winning</h3>
      <p className="text-gray-200 text-sm">
        5-time winner of "Best Luxury Rental Service" with 50,000+ satisfied customers
      </p>
    </div>

    {/* Feature 2 */}
    <div className="bg-black/20 p-4 rounded-xl border border-white/10 hover:border-orange-400/50 transition-all duration-300">
      <div className="text-3xl mb-3">🛡️</div>
      <h3 className="text-xl font-bold text-orange-300 mb-2">Fully Insured</h3>
      <p className="text-gray-200 text-sm">
        Comprehensive coverage with zero deductibles and 24/7 roadside assistance
      </p>
    </div>

    {/* Feature 3 */}
    <div className="bg-black/20 p-4 rounded-xl border border-white/10 hover:border-orange-400/50 transition-all duration-300">
      <div className="text-3xl mb-3">⚡</div>
      <h3 className="text-xl font-bold text-orange-300 mb-2">Instant Booking</h3>
      <p className="text-gray-200 text-sm">
        Reserve your dream car in 2 minutes with our streamlined digital process
      </p>
    </div>

    {/* Feature 4 */}
    <div className="bg-black/20 p-4 rounded-xl border border-white/10 hover:border-orange-400/50 transition-all duration-300">
      <div className="text-3xl mb-3">🌍</div>
      <h3 className="text-xl font-bold text-orange-300 mb-2">Global Network</h3>
      <p className="text-gray-200 text-sm">
        Pick up and drop off at 200+ locations across 25 countries worldwide
      </p>
    </div>
  </div>

  <div className="text-left space-y-6">
    <p className="text-xl text-gray-100 leading-relaxed drop-shadow-md">
      With <span className="text-orange-300 font-semibold">over a decade of excellence</span> in premium car rentals, we've perfected the art of luxury mobility. Our commitment goes beyond just providing vehicles - we deliver <span className="text-orange-300 font-semibold">unforgettable experiences</span>.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      <div className="space-y-3">
        <h4 className="text-lg font-bold text-orange-300 flex items-center">
          <span className="mr-2"></span> Premium Vehicle Maintenance
        </h4>
        <p className="text-gray-200 text-sm">
          Each vehicle undergoes 150-point inspection before every rental. We maintain our fleet to manufacturer standards with detailed service records.
        </p>

        <h4 className="text-lg font-bold text-orange-300 flex items-center">
          <span className="mr-2"></span> Personalized Concierge
        </h4>
        <p className="text-gray-200 text-sm">
          Dedicated account manager for corporate clients and VIP service for all customers. We remember your preferences for repeat bookings.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-bold text-orange-300 flex items-center">
          <span className="mr-2"></span> Flexible Cancellation
        </h4>
        <p className="text-gray-200 text-sm">
          Free cancellation up to 24 hours before pickup. No hidden fees or surprise charges - our pricing is completely transparent.
        </p>

        <h4 className="text-lg font-bold text-orange-300 flex items-center">
          <span className="mr-2"></span> Latest Technology
        </h4>
        <p className="text-gray-200 text-sm">
          All vehicles equipped with GPS, premium sound systems, and the latest safety features including 360° cameras and collision avoidance.
        </p>
      </div>
    </div>

    <div className="bg-black/30 p-6 rounded-xl border border-orange-500/20 mt-6">
      <h4 className="text-2xl font-bold text-white mb-4 text-center">Our Promise</h4>
      <p className="text-gray-100 text-lg text-center italic">
        "We don't just rent cars - we deliver confidence, comfort, and class. From the moment you book until you return the keys, 
        experience the <span className="text-orange-300 font-semibold">AutoRentPro difference</span> that keeps our customers coming back year after year."
      </p>
    </div>

    {/* Stats Section */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-400">98%</div>
        <div className="text-gray-300 text-sm">Customer Satisfaction</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-400">50K+</div>
        <div className="text-gray-300 text-sm">Happy Customers</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-400">24/7</div>
        <div className="text-gray-300 text-sm">Support Available</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-400">200+</div>
        <div className="text-gray-300 text-sm">Luxury Vehicles</div>
      </div>
    </div>
  </div>

  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
    <button className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
      📞 Book Consultation
    </button>
    <button className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
      ⭐ Read Reviews
    </button>
  </div>
</div>
      </div>
    </>
  );
};

export default Edition;