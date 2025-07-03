// hero-section.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TrueFocus from "@/app/components/TrueFocus/TrueFocus";
import { Baskervville } from "next/font/google";
import { cn } from "@/lib/utils";

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  variable: "--font-baskervville",
});

export default function HeroSection() {
  return (
    <section className={baskervville.className+" relative min-h-screen bg-[#F8F3EE] overflow-hidden"}>
      {/* Faded Background Text */}
      <div className="absolute top-36 inset-0 flex items-center justify-center pointer-events-none">
        <h1 className={`text-[8rem] font-baskervville md:text-[12rem] lg:text-[19rem] opacity-50 font-light bg-gradient-to-b from-[#efe6d3] via-[#ede6d3] to-[#f2ebde] text-transparent bg-clip-text tracking-widest select-none whitespace-nowrap`}>
          LAWYER
        </h1>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 pt-16 pb-2 relative h-screen flex flex-col">
        {/* Title */}
        <div className="text-center mb-2">
          <h1 className="text-[2.8rem] md:text-[3.8rem] lg:text-[4.2rem] font-light tracking-wider leading-tight text-[#2A2A2A]">
            {/* Focus on your startup’s growth – let AI handle the legal work. */}
            <TrueFocus
              sentence="Focus on your startup’s growth"
              manualMode={false}
              blurAmount={5}
              borderColor="white"
              animationDuration={0.9}
              pauseBetweenAnimations={0.7}
            />{" "}
            <span className={cn(" italic font-baskervville", baskervville.className)}>let AI handle the legal work.</span>
          </h1>
        </div>

        {/* Main Content Area with Three Columns */}
        <div className="flex-grow flex items-center justify-center relative max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-3 gap-8 items-center  w-full h-full">
            {/* Left Side - Text and Arrow */}
            <div className="flex flex-col  justify-center h-full">
              <div className="flex items-start flex-col space-x-4 mb-8">
                {/* Down Arrow */}
                <div className="flex flex-col justify-center w-[52%] items-center">
                  <div className="w-0.5 h-12 bg-[#2A2A2A] mb-2"></div>
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#2A2A2A]"></div>
                </div>

                {/* Text Content */}
                <div>
                  <p className="text-base md:text-lg font-light text-[#2A2A2A] leading-relaxed">
                    Specialist Tax Lawyers
                    <br />
                    and Business Solicitors.
                  </p>
                </div>
              </div>

              {/* Gavel Image */}
              {/* <div className="w-30 absolute bottom-[17%] left-[14%] translate-x-[-20%] translate-y-[-15%] h-20 ">
                <Image
                  src="/images/gavel.png"
                  alt="Legal Gavel"
                  width={120}
                  height={80}
                  className="object-contain"
                />
              </div> */}
            </div>

            {/* Center - Statue Image */}
            <div className="flex justify-center  w-full items-center h-full">
              <div className="relative rounded-3xl p-8 w-full max-w-md">
                <div className="relative w-full h-[500px]">
                  <Image
                    src="/images/lady-justice-statue.png"
                    alt="Lady Justice Statue"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Text and Play Button */}
            <div className="flex flex-col justify-center h-full">
              <div className="text-right mb-8">
                <p className="text-sm md:text-base font-light text-[#2A2A2A] max-w-[280px] leading-relaxed ml-auto">
                  We specialize in business law and compliance, so no matter your challenge, our expertise has you covered. Let us simplify your legal journey.
                </p>
              </div>

              {/* Play Button with Decorative Elements */}
              <div className="flex justify-end">
                <div className="relative">


                  {/* Decorative dots around the button */}
                  <div className="absolute -top-3 -right-3">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-[#2A2A2A] rounded-full"></div>
                      <div className="w-1 h-1 bg-[#2A2A2A] rounded-full"></div>
                      <div className="w-1 h-1 bg-[#2A2A2A] rounded-full"></div>
                    </div>
                    <div className="flex space-x-1 mt-1">
                      <div className="w-1 h-1 bg-[#2A2A2A] rounded-full"></div>
                      <div className="w-1 h-1 bg-[#2A2A2A] rounded-full"></div>
                      <div className="w-1 h-1 bg-[#2A2A2A] rounded-full"></div>
                    </div>
                    <div className="flex space-x-1 mt-1">
                      <div className="w-1 h-1 bg-[#2A2A2A] rounded-full"></div>
                      <div className="w-1 h-1 bg-[#2A2A2A] rounded-full"></div>
                      <div className="w-1 h-1 bg-[#2A2A2A] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Stack vertically on smaller screens */}
        <div className="lg:hidden flex-grow flex flex-col items-center justify-center space-y-8 pt-8">
          {/* Statue Image */}
          <div className="relative bg-[#E8DDD1] rounded-3xl p-6 w-full max-w-sm">
            <div className="relative w-full h-80">
              <Image
                src="/images/lady-justice-statue.png"
                alt="Lady Justice Statue"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Bottom Content for Mobile */}
          <div className="flex justify-between items-end w-full px-4">
            {/* Left Side Mobile */}
            <div className="flex items-end space-x-2">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-[#2A2A2A] mb-2"></div>
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#2A2A2A]"></div>
              </div>
              <div>
                <p className="text-sm font-light text-[#2A2A2A] leading-relaxed">
                  Specialist Family Lawyers
                  <br />
                  and Divorce Solicitors.
                </p>
              </div>
            </div>

            {/* Right Side Mobile */}
            <div className="flex items-end space-x-4">
              <div className="text-right">
                <p className="text-xs font-light text-[#2A2A2A] max-w-[200px] leading-relaxed">
                  Family law is all we do, so whatever your situation, it will
                  be familiar to us.
                </p>
              </div>
              <button className="w-12 h-12 rounded-full border-2 border-[#2A2A2A] flex items-center justify-center">
                <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
              </button>
            </div>
          </div>

          {/* Gavel Image Mobile */}
          <div className="self-start ml-8">
            <Image
              src="/images/gavel.png"
              alt="Legal Gavel"
              width={60}
              height={30}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
