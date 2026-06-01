"use client";

import { useState } from "react";
import { TestimonialCard } from "@/components/ui/testimonial-cards";

const testimonials = [
  {
    id: 1,
    testimonial:
      "Viltis found the qualified candidate we needed when others could not. They grew to provide a team of 12 consultants across technical writing, pharmacovigilance, quality assurance, and biologics manufacturing—each instrumental to our program success and subsequent acquisition.",
    author: "Kevin Furstoss - Executive Director, Co-Development Launch Leader · GBT/Pfizer",
    imageSrc:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&h=256&fit=crop&crop=face",
  },
  {
    id: 2,
    testimonial:
      "Working with Viltis has been a consistently professional experience. Questions were addressed quickly, compensation was fair, and it was clear the organization genuinely cares about the consultants and clients they serve.",
    author: "Todd S. - Biologics CMC Consultant",
    imageSrc:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face",
  },
  {
    id: 3,
    testimonial:
      "Viltis embedded regulatory writers ahead of our submission deadline and kept quality consistent across every module. They felt like an extension of our internal team from day one.",
    author: "Sarah M. - Regulatory Affairs Director · Biotech Sponsor",
    imageSrc:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=face",
  },
];

type CardPosition = "front" | "middle" | "back";

function ShuffleCards() {
  const [positions, setPositions] = useState<CardPosition[]>(["front", "middle", "back"]);

  const handleShuffle = () => {
    const newPositions = [...positions];
    newPositions.unshift(newPositions.pop() as CardPosition);
    setPositions(newPositions);
  };

  return (
    <div className="grid min-h-[520px] w-full place-content-center overflow-hidden px-8 py-24 text-slate-50">
      <div className="relative -ml-[100px] h-[450px] w-[350px] md:-ml-[175px]">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            {...testimonial}
            handleShuffle={handleShuffle}
            position={positions[index]}
          />
        ))}
      </div>
    </div>
  );
}

export { ShuffleCards };
