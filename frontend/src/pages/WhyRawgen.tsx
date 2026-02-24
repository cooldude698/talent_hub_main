import { motion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { Check, X } from "lucide-react";

const comparisons = [
  { feature: "Curated, verified freelancers", rawgen: true, others: false },
  { feature: "No bidding or price wars", rawgen: true, others: false },
  { feature: "Managed project assignment", rawgen: true, others: false },
  { feature: "Multi-step quality assurance", rawgen: true, others: false },
  { feature: "Verified & moderated reviews", rawgen: true, others: false },
  { feature: "Transparent, fixed pricing", rawgen: true, others: false },
  { feature: "Exclusive portfolio access", rawgen: true, others: false },
  { feature: "Dedicated project manager", rawgen: true, others: false },
  { feature: "Anyone can sign up as freelancer", rawgen: false, others: true },
  { feature: "Race-to-the-bottom pricing", rawgen: false, others: true },
];

const WhyRawgen = () => (
  <div className="py-24">
    <div className="container mx-auto px-4">
      <SectionHeading
        badge="Comparison"
        title="Why Choose RAWGEN?"
        description="We're not another marketplace. Here's what sets us apart from platforms like Fiverr and Upwork."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-xl border border-border"
      >
        <div className="grid grid-cols-3 border-b border-border bg-card/80 p-4 text-sm font-semibold">
          <span>Feature</span>
          <span className="text-center text-primary">RAWGEN</span>
          <span className="text-center text-muted-foreground">Others</span>
        </div>
        {comparisons.map((c, i) => (
          <div key={i} className="grid grid-cols-3 border-b border-border/50 p-4 text-sm last:border-0">
            <span className="text-muted-foreground">{c.feature}</span>
            <span className="flex justify-center">
              {c.rawgen ? <Check className="h-5 w-5 text-primary" /> : <X className="h-5 w-5 text-muted-foreground/40" />}
            </span>
            <span className="flex justify-center">
              {c.others ? <Check className="h-5 w-5 text-muted-foreground/60" /> : <X className="h-5 w-5 text-muted-foreground/40" />}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
);

export default WhyRawgen;
