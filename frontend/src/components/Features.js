import React from "react";

const Features = () => {
  const features = [
    { icon: "bi-cpu", title: "AI-Powered Analysis", description: "State-of-the-art machine learning algorithms for precise detection" },
    { icon: "bi-clock-history", title: "Rapid Results", description: "Get detailed analysis reports within minutes" },
    { icon: "bi-shield-check", title: "HIPAA Compliant", description: "Secure storage and processing of medical data" },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card p-6 rounded-lg shadow-lg"
              data-aos="fade-up" // You can change this to any AOS animation type like "fade-left", "zoom-in", etc.
              data-aos-delay={100 * index} // Delay animations by index to stagger the animation effect
            >
              <i className={`bi ${feature.icon} text-4xl text-green-600 mb-4`}></i>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
