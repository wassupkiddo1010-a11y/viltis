/** Real testimonials — Google reviews provided by Viltis + viltis.com client quotes. */

export interface Testimonial {
  text: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    text: "The team was highly responsive and maintained excellent communication throughout my time with the agency. My immigration paperwork was handled flawlessly, and the employee portal made accessing pay details incredibly simple. A special thanks to Brent, who was a huge help in answering all my questions.",
    name: "Sriram Reddy",
    role: "Local Guide",
  },
  {
    text: "It has truly been a great experience to work with Bioethic Consulting the past 14+ months. I must admit that I had some trepidation in taking a consulting job; however, I'm glad I did. I felt well compensated and any questions I had were addressed quickly and with great priority. This company has a strong customer service culture and actually cares about the people that work for the organization.",
    name: "Todd Sallee",
    role: "Consultant",
  },
  {
    text: "Provide recruiting and consulting support.",
    name: "Yash Divekar",
    role: "Local Guide",
  },
  {
    text: "Viltis reached out to me to offer their services, and I replied, 'Not unless they have a qualified candidate I can hire.' They then found me the unicorn candidate I was looking for, which earned them the contract, and they even went the extra mile. After that, Viltis grew to be so successful at GBT that they provided a total team of 12 consultants who specialized in Technical Writing, Pharmacovigilance, Quality Assurance, GMP Quality Control, Product Development, Biologics CMC Analytical Development, and Biologics Manufacturing/Technical Operations. These consultants were instrumental in the company's success and its subsequent acquisition by Pfizer.",
    name: "Kevin Furstoss",
    role: "Executive Director Co-Development Launch Leader, GBT/Pfizer",
  },
];
