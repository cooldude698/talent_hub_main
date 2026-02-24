import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Star, Zap } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import { services } from "@/data/services";

const stats = [
  { value: "200+", label: "Projects Delivered" },
  { value: "50+", label: "Verified Freelancers" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "24h", label: "Avg Response Time" },
];

const features = [
  { icon: Shield, title: "Curated Talent", desc: "Every freelancer is vetted and verified before joining our platform." },
  { icon: Users, title: "Managed Projects", desc: "We assign the perfect freelancer — no bidding, no chaos." },
  { icon: Star, title: "Quality Assured", desc: "Every deliverable passes our multi-step quality review process." },
  { icon: Zap, title: "Fast Delivery", desc: "Streamlined workflows mean faster turnaround without compromising quality." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Home = () => (
  <div>
    {/* Hero */}
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="mb-6 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Premium Managed Freelance Agency
          </span>
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Talent, Curated.
            <br />
            <span className="gradient-text">Quality, Guaranteed.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            RAWGEN connects you with elite, verified freelancers. No bidding wars. No guesswork. Just exceptional results, managed end-to-end.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/services">
                Explore Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className="border-y border-border/50 bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={item} className="text-center">
              <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          badge="Why Choose Us"
          title="Built for Quality, Not Quantity"
          description="RAWGEN is not another marketplace. It's a managed ecosystem where every project is handled with precision."
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item} className="glass-card-hover p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Services Preview */}
    <section className="border-t border-border/50 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          badge="Our Services"
          title="What We Deliver"
          description="From design to development, content to crypto — we've got you covered."
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.slice(0, 8).map((s) => (
            <motion.div key={s.name} variants={item} className="glass-card-hover p-5">
              <s.icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-display text-sm font-semibold">{s.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.delivery}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-10 text-center">
          <Button variant="outline" asChild>
            <Link to="/services">View All Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="glass-card mx-auto max-w-3xl p-12 text-center">
          <h2 className="font-display text-3xl font-bold">Ready to Start Your Project?</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Submit your requirements and let us match you with the perfect freelancer for the job.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
