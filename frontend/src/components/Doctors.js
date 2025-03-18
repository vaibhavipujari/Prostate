import React, { useState, useEffect } from "react";

const Collaboration = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Placeholder for image links
  const images = [
    "/colab_pictures/colab2.jpg",
    "/colab_pictures/colab3.jpg",
    "/colab_pictures/colab4.jpg",
    "/colab_pictures/colab1.jpg",
  ];

  const doctorInfo = {
    name: "Dr. Rakesh Jadhav",
    hospital: "SJS Shri Janardan Swami Hospital, Kopargaon",
    description:
      "For this project, Dr. Rakesh Jadhav provided invaluable guidance and expertise, ensuring the success of our collaboration.",
  };

  // Automatically change the slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="collaboration" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Collaboration</h2>
        <div className="relative w-full max-w-4xl mx-auto mb-8">
          {/* Slideshow */}
          <div className="overflow-hidden rounded-lg shadow-md">
            <img
              src={images[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="slideshow-image"
            />
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Static Information */}
        <div className="text-center">
          <h3 className="text-xl font-semibold">{doctorInfo.name}</h3>
          <p className="text-gray-600">{doctorInfo.hospital}</p>
          <p className="text-gray-600 max-w-3xl mx-auto">{doctorInfo.description}</p>
        </div>
      </div>
    </section>
  );
};

export default Collaboration;
