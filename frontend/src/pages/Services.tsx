import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/shared/SectionHeading";
import { services } from "@/data/services";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Services = () => (
  <div className="py-24">
    <div className="container mx-auto px-4">
      <SectionHeading
        badge="Services"
        title="Everything You Need, Under One Roof"
        description="16 premium services delivered by curated, verified professionals."
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {services.map((s) => (
          <motion.div key={s.name} variants={item} className="glass-card-hover flex flex-col p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold">{s.name}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            <div className="mt-4 flex items-center border-t border-border/50 pt-4 text-xs text-muted-foreground">
              <span>Delivery: {s.delivery}</span>
            </div>
            <Button size="sm" className="mt-4 w-full" asChild>
              <Link to="/contact">Request Service</Link>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
);

export default Services;
