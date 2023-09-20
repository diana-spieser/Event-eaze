import Hero from '../../components/LandingPage/Hero';
import FeaturesCards from '../../components/LandingPage/FeaturesCards';
import Footer from '../../components/Footer/Footer';
import LandingPageNavBar from '../../components/LandingPage/LandingPageNavBar';
import PublicEventsList from '../../components/LandingPage/PublicEvents/PublicEventsList';
import AdditionalFeatures from '../../components/LandingPage/AdditionalFeatures';


function Landing() {
  return (
    <>
      <LandingPageNavBar />
      <Hero />
      <FeaturesCards />
      <AdditionalFeatures />
      <PublicEventsList />
      <Footer />
    </>
  );
}

export default Landing;
