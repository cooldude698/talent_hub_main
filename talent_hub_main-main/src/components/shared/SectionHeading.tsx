import { motion } from "framer-motion";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
  lightText?: boolean;
}

const SectionHeading = ({ badge, title, description, center = true, lightText = false }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={center ? "text-center" : ""}
  >
    {badge && (
      <span className={`mb-4 inline-block rounded-full border px-3 py-1 text-xs font-medium ${lightText ? 'border-white/30 bg-white/10 text-white' : 'border-primary/30 bg-primary/10 text-primary'}`}>
        {badge}
      </span>
    )}
    <h2 className={`font-display text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl ${lightText ? 'text-white' : ''}`}>{title}</h2>
    {description && (
      <p className={`mx-auto mt-4 max-w-2xl text-sm md:text-base ${lightText ? 'text-white/80' : 'text-muted-foreground'}`}>{description}</p>
    )}
  </motion.div>
);

export default SectionHeading;
