import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BenefitItem {
  title: string;
  description: string;
}

interface BenefitsCardProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  imageUrl?: string;
  imageAlt?: string;
  benefits?: BenefitItem[];
  onButtonClick?: () => void;
}

const defaultBenefits: BenefitItem[] = [
  {
    title: "Legal representation",
    description:
      "This can include criminal defense, civil litigation, and various legal specializations.",
  },
  {
    title: "Allegations",
    description: "You have a right to know every detail of the allegations.",
  },
  {
    title: "Support",
    description: "Our team is available 24/7 to provide help and support.",
  },
];

const BenefitsCard: React.FC<BenefitsCardProps> = ({
  title = "WHAT BENEFITS WILL YOU GET FROM US?",
  subtitle = "We provide high quality law service for you with best integrated people.",
  benefits = defaultBenefits,
  onButtonClick,
}) => {
  return (
    <section className="bg-[#261B1A] text-stone-100 py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Section - Text Content */}
          <div className="lg:col-span-4 flex items-start h-full flex-col justify-center space-y-6">
            <h1 className="font-baskervville text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight tracking-wide text-stone-100 uppercase">
              {title}
            </h1>

            <p className="font-montserrat text-stone-300 text-base sm:text-lg leading-relaxed max-w-md">
              {subtitle}
            </p>

            <div className="pt-4">
              <button className="relative h-8 group flex items-center px-8 py-2  bg-stone-200 text-amber-950  text-md font-normal font-baskervville cursor-pointer overflow-hidden transition-colors duration-300 select-none">
                <Link className="z-10" href="/login">
                  Find Attorney
                </Link>
                <span className="absolute left-0 w-[9em] aspect-square bg-[#261B1A] opacity-100 rounded-[100%] -translate-x-32"></span>
                <span className="absolute right-0 w-[9em] aspect-square bg-[#261B1A] opacity-100 rounded-[100%] translate-x-32"></span>
              </button>
            </div>
          </div>

          {/* Center Section - Image */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative">
              {/* Background paper effect */}
              <div className="absolute inset-0 bg-stone-100 transform rotate-3 shadow-xl"></div>

              {/* Main image container */}
              <div className="relative bg-stone-100 overflow-hidden  shadow-2xl">
                {/* Set explicit height for the image container to avoid height: 0 issue */}
                <div className="relative w-full max-w-sm mx-auto aspect-[3/4] min-h-[350px]">
                  <Image
                    src="/images/LEGALEASE.png"
                    alt="a lawyer/ca"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={100}
                    className="object-cover object-center w-full h-full rounded-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Benefits */}
          <div className="lg:col-span-4 space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-montserrat font-semibold text-lg text-stone-100">
                  {benefit.title}
                </h3>
                <p className="font-montserrat text-stone-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsCard;
