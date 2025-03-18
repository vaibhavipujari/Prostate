import React from "react";

const HeroSection = ({ scrollToServices }) => {
  return (
    <section id="home" className="pt-24 bg-gradient-to-r from-green-600 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <div className="md:w-1/2 text-left" data-aos="fade-right">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Advanced Prostate Cancer Detection
          </h1>
          <p className="text-lg mb-8">
            Utilizing cutting-edge AI technology for early detection and precise diagnosis to improve patient outcomes.
          </p>
          <button
            onClick={scrollToServices}
            className="bg-white text-green-600 px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            Get Started
          </button>
        </div>

        {/* Right Content */}
        <div className="md:w-1/2 mt-8 md:mt-0" data-aos="fade-left">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800"
              alt="Medical Technology"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute bottom-4 right-4 bg-white bg-opacity-70 p-4 rounded-lg shadow">
              <p className="text-gray-700 font-medium">
                Trusted by medical professionals worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
