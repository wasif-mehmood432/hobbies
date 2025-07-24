import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StatsSection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const categories = [
    "Håndværk",
    "Havearbejde",
    "Fotografi",
    "Musikundervisning",
    "Madlavning",
    "Kunst og Design",
    "IT og Teknologi",
    "Personlig Træning",
    "Skønhed og Velvære",
    "Sprogundervisning"
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const speed = 1; // Lower = slower scroll
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    const scroll = () => {
      if (!scrollContainer || isHovered) return;
      if (scrollContainer.scrollLeft >= maxScroll) {
        scrollContainer.scrollLeft = 0;
        scrollAmount = 0;
      } else {
        scrollAmount += speed;
        scrollContainer.scrollLeft = scrollAmount;
      }
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="bg-white text-black py-16 p-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold mb-4">
          Over 30 Kategorier
        </h2>
  
        <div className="mt-10">
          <h4 className="text-2xl font-bold text-pink-600 mb-4">Alle Kategorier</h4>

          {/* Auto-Scrolling Carousel with pause on hover */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 px-2 py-4 scrollbar-hide transition-all duration-300"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => navigate("/service")}
                className="flex-shrink-0 bg-[#dc44bb] text-white px-6 py-2 hover:text-black rounded-full hover:bg-gray-100 transition-colors font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
