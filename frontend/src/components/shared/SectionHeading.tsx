import { motion } from "framer-motion";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
}

const SectionHeading = ({ badge, title, description, center = true }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={center ? "text-center" : ""}
  >
    {badge && (
      <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        {badge}
      </span>
    )}
    <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
    {description && (
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{description}</p>
    )}
  </motion.div>
);

export default SectionHeading;
