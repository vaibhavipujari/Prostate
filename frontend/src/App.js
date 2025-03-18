import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import Services from "./components/Services";
import Doctors from "./components/Doctors";
import About from "./components/About";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Results from "./components/Results"; // Import the Results page
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";

const App = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Create refs for scrolling
  const servicesRef = useRef(null);

  // State for managing modals
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Function to scroll to the Services section
  const scrollToServices = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Layout with Navbar and Footer
  const LayoutWithNavbar = ({ children }) => (
    <>
      <Navbar onLoginClick={() => setShowLoginModal(true)} />
      {children}
      <Footer />
      <LoginModal show={showLoginModal} closeModal={() => setShowLoginModal(false)} />
    </>
  );

  return (
    <Router>
      <Routes>
        {/* Main Landing Page */}
        <Route
          path="/"
          element={
            <LayoutWithNavbar>
              <HeroSection scrollToServices={scrollToServices} />
              <Features />
              <Services ref={servicesRef} />
              <Doctors />
              <About />
            </LayoutWithNavbar>
          }
        />

        {/* Results Page with Navbar */}
        <Route
          path="/results"
          element={
            <LayoutWithNavbar>
              <Results />
            </LayoutWithNavbar>
          }
        />

        {/* profile page */}
        <Route
          path="/profile"
          element={
            <LayoutWithNavbar>
              <Profile />
            </LayoutWithNavbar>
          }
        />

        {/* Signup Page without Navbar */}
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
