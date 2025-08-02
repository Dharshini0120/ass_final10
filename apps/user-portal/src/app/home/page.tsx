"use client";
import React from "react";
import AppHeader from "../../components/layout/AppHeader";
import HomeSection from "../../components/home/HeroSection";
import HomeAssessmentSection from "../../components/home/HomeAssessmentSection";
import HomeCTASection from "../../components/home/HomeCTASection";
import HomePowerfulSection from "../../components/home/HomePowerfulSection";
import HomeTestimonialSection from "../../components/home/HomeTestimonalSection";
import AppFooter from "../../components/layout/AppFooter";

interface Item {
  id?: string;
  name: string;
  description: string;
}

const HomePage = () => {
  return (
    <div>
      <AppHeader />
      <HomeSection />
      <HomeAssessmentSection />
      <HomePowerfulSection />
      <HomeTestimonialSection />
      <HomeCTASection />
      <AppFooter />
    </div>
  );
};

export default HomePage;
