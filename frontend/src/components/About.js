import React from "react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800"
            alt="Medical Facility"
            className="rounded-lg shadow-xl"
          />
        </div>
        <div className="md:w-1/2 md:pl-12">
          <h2 className="text-3xl font-bold mb-6">About ProCare</h2>
          <p className="text-gray-600 mb-4">
            ProCare is at the forefront of prostate cancer detection technology. Our AI-powered platform combines advanced machine
            learning algorithms with medical expertise to provide accurate and timely diagnoses.
          </p>
          <p className="text-gray-600">
            Working with leading hospitals and research institutions, we've developed a system that helps healthcare providers make
            informed decisions and improve patient outcomes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
