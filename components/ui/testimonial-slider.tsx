"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  username: string;
  avatar: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "Viltis found the qualified candidate we needed when others could not. They grew to provide a team of 12 consultants across technical writing, pharmacovigilance, quality assurance, and biologics manufacturing.",
    name: "Kevin Furstoss",
    username: "Executive Director · GBT/Pfizer",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&h=256&fit=crop&crop=face",
  },
  {
    id: 2,
    quote:
      "Working with Viltis has been a consistently professional experience. Questions were addressed quickly, compensation was fair, and it was clear the organization genuinely cares about the consultants and clients they serve.",
    name: "Todd S.",
    username: "Biologics CMC Consultant",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face",
  },
  {
    id: 3,
    quote:
      "Viltis embedded regulatory writers ahead of our submission deadline and kept quality consistent across every module. They felt like an extension of our internal team from day one.",
    name: "Sarah M.",
    username: "Regulatory Affairs Director · Biotech Sponsor",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=face",
  },
  {
    id: 4,
    quote:
      "Their quality consultants helped us close CAPA gaps before a critical FDA inspection. The depth of life sciences expertise on the team was evident from week one.",
    name: "David L.",
    username: "VP Quality · Pharmaceutical Manufacturer",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=256&h=256&fit=crop&crop=face",
  },
  {
    id: 5,
    quote:
      "Viltis staffed our clinical operations workstream with monitors and data reviewers who understood ICH-GCP expectations and kept our study inspection-ready.",
    name: "Maria R.",
    username: "Clinical Operations Lead · Global CRO",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=face",
  },
];

const getVisibleCount = (width: number): number => {
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
};

interface TestimonialSliderProps {
  testimonials?: Testimonial[];
}

export function TestimonialSlider({ testimonials = defaultTestimonials }: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);

      const oldVisibleCount = getVisibleCount(windowWidth);
      const newVisibleCount = getVisibleCount(newWidth);

      if (oldVisibleCount !== newVisibleCount) {
        const maxIndexForNewWidth = testimonials.length - newVisibleCount;
        setCurrentIndex((prev) => Math.min(prev, Math.max(0, maxIndexForNewWidth)));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth, testimonials.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    autoPlayRef.current = setInterval(() => {
      const visibleCount = getVisibleCount(windowWidth);
      const maxIndex = testimonials.length - visibleCount;

      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          setDirection(-1);
          return prev - 1;
        }
        if (prev <= 0) {
          setDirection(1);
          return prev + 1;
        }
        return prev + direction;
      });
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, windowWidth, direction, testimonials.length]);

  const visibleCount = getVisibleCount(windowWidth);
  const maxIndex = testimonials.length - visibleCount;
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goNext = () => {
    if (canGoNext) {
      setDirection(1);
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
      pauseAutoPlay();
    }
  };

  const goPrev = () => {
    if (canGoPrev) {
      setDirection(-1);
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
      pauseAutoPlay();
    }
  };

  const handleDragEnd = (_event: unknown, info: { offset: { x: number } }) => {
    const { offset } = info;
    const swipeThreshold = 30;

    if (offset.x < -swipeThreshold && canGoNext) goNext();
    else if (offset.x > swipeThreshold && canGoPrev) goPrev();
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  return (
    <div className="testimonial-slider-root overflow-hidden px-4 py-8 sm:py-12">
      <div className="relative mx-auto max-w-6xl" ref={containerRef}>
        <div className="mb-4 flex justify-center space-x-2 sm:absolute sm:-top-14 sm:right-0 sm:mb-0 sm:justify-end">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={goPrev}
            disabled={!canGoPrev}
            className={`rounded-full p-2 transition-all duration-300 ${
              canGoPrev
                ? "border border-white/15 bg-white/5 text-teal-400 hover:bg-white/10"
                : "cursor-not-allowed bg-white/[0.03] text-white/30"
            }`}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            disabled={!canGoNext}
            className={`rounded-full p-2 transition-all duration-300 ${
              canGoNext
                ? "border border-white/15 bg-white/5 text-teal-400 hover:bg-white/10"
                : "cursor-not-allowed bg-white/[0.03] text-white/30"
            }`}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="relative overflow-hidden px-1 sm:px-0">
          <motion.div
            className="flex"
            animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
            transition={{ type: "spring", stiffness: 70, damping: 20 }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className={`w-full flex-shrink-0 p-2 ${
                  visibleCount === 3 ? "xl:w-1/3" : visibleCount === 2 ? "md:w-1/2" : "w-full"
                }`}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                whileHover={{ y: -5 }}
                style={{ cursor: "grab" }}
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-6 shadow-lg backdrop-blur-md">
                  <div className="absolute -left-4 -top-4 opacity-20">
                    <Quote size={56} className="text-teal-400" />
                  </div>
                  <div className="relative z-10 flex h-full flex-col">
                    <p className="mb-6 text-base font-medium leading-relaxed text-white/70">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="mt-auto border-t border-white/10 pt-4">
                      <div className="flex items-center">
                        <Image
                          width={48}
                          height={48}
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="h-10 w-10 rounded-full border-2 border-white/15 object-cover"
                        />
                        <div className="ml-3">
                          <h4 className="text-sm font-bold text-white sm:text-base">{testimonial.name}</h4>
                          <p className="text-xs text-white/50 sm:text-sm">{testimonial.username}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className="mx-1 focus:outline-none"
              aria-label={`Go to testimonial ${index + 1}`}
            >
              <span
                className={`block h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-teal-400" : "bg-white/25"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestimonialSlider;
