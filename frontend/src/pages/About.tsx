import { motion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { Target, Eye, Users } from "lucide-react";

const values = [
  { icon: Target, title: "Our Mission", desc: "To redefine freelancing by building a curated ecosystem where quality is the default, not the exception." },
  { icon: Eye, title: "Our Vision", desc: "A world where businesses access top-tier talent without the noise, chaos, and uncertainty of open marketplaces." },
  { icon: Users, title: "Our Team", desc: "We're a small, focused team of project managers, quality analysts, and industry specialists dedicated to your success." },
];

const About = () => (
  <div className="py-24">
    <div className="container mx-auto px-4">
      <SectionHeading
        badge="About"
        title="The Agency Behind the Platform"
        description="RAWGEN was founded on a simple belief: talent should be discovered, not auctioned."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mt-16 max-w-3xl glass-card p-8 md:p-12"
      >
        <p className="text-muted-foreground leading-relaxed">
          Unlike open marketplaces where anyone can list their services, RAWGEN operates as a managed agency. Every freelancer on our platform is hand-picked, verified, and continuously evaluated. When you submit a project, our team reviews your requirements and assigns the most qualified professional — no bidding, no price wars.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Every deliverable passes through our quality assurance process before reaching you. We believe in transparent pricing, verified reviews, and a commitment to excellence that sets us apart.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <v.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold">{v.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default About;
