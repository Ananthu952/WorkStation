import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import ServiceCategories from "../../components/landing/ServiceCategories";
import HowItWorks from "../../components/landing/HowItWorks";
import Testimonials from "../../components/landing/Testimonials";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";

export default function Landing() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <Hero />
        <ServiceCategories />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
