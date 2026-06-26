import React from 'react';
import DestinationsHero from '../../components/destinations/DestinationsHero';
import CountryGrid from '../../components/destinations/CountryGrid';
import WhyWorkAbroad from '../../components/destinations/WhyWorkAbroad';
import JobCategorySection from '../../components/destinations/JobCategorySection';
import Testimonials from '../../components/destinations/Testimonials';

export default function DestinationsPage() {
  return (
    <main>
      <DestinationsHero />
      <CountryGrid />
      <WhyWorkAbroad />
      <Testimonials />
      {/* <JobCategorySection /> */}
    </main>
  );
}
