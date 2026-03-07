import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import SectionHeading from "@/components/shared/SectionHeading";
import { Star, BadgeCheck, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib1/supabase";

interface Review {
  id?: string;
  name: string;
  service: string;
  rating: number;
  review: string;
}

const featuredReviews: Review[] = [
  { name: "Sarah Mitchell", service: "Web Development", rating: 5, review: "RAWGENN delivered a stunning website that exceeded expectations. Extremely professional process." },
  { name: "David Chen", service: "Logo Design", rating: 5, review: "Outstanding creative quality and very smooth communication. Highly recommended." },
  { name: "Maria Santos", service: "UI/UX Designing", rating: 5, review: "Modern, elegant and high-performing design. Truly impressive experience." },
  { name: "James Wilson", service: "Content Writing", rating: 5, review: "The copy was engaging, SEO-optimized, and captured our brand voice perfectly." },
  { name: "Priya Sharma", service: "AI Automation", rating: 5, review: "They automated our entire workflow, saving us 20 hours a week. Phenomenal ROI." },
  { name: "Michael Chang", service: "Video Editing", rating: 5, review: "Crisp edits, great pacing, and delivered ahead of schedule. Will definitely hire again." },
  { name: "Emma Thompson", service: "Ghost Writing", rating: 5, review: "They turned my rough ideas into an absolute masterpiece of an article. Highly skilled." },
  { name: "Ahmed Hassan", service: "Event Management", rating: 5, review: "Every single detail of our corporate event was flawless. RAWGENN took all the stress away." },
  { name: "Olivia Martinez", service: "Graphic Design", rating: 5, review: "The visual assets they created for our ad campaign doubled our click-through rate." },
  { name: "Lucas Silva", service: "Voice Over", rating: 5, review: "A clear, professional, and commanding voice that gave our presentation exactly what it needed." },
  { name: "Sophia Lee", service: "Script Writing", rating: 5, review: "The script they wrote for our podcast was engaging, funny, and hit all the right beats." },
  { name: "Daniel Kim", service: "Brochure Design", rating: 5, review: "Our new brochures look incredibly premium. The team really understood our luxury branding." }
];

const floatingReviewsAnim = {
  hidden: { y: 0, opacity: 0 },
  visible: (custom: { delay: number; duration: number }) => ({
    y: 900,
    opacity: [0, 1, 1, 0],
    transition: {
      duration: custom.duration,
      ease: "linear",
      repeat: Infinity,
      delay: custom.delay,
      times: [0, 0.1, 0.9, 1],
    },
  }),
};

const Reviews = () => {
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    text: "",
  });

  const [dbReviews, setDbReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🔥 Fetch approved reviews
  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (data) setDbReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !formData.name.trim() || !formData.text.trim()) {
      toast({
        title: "Missing fields",
        description: "Please complete all fields and select a rating.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("reviews").insert([
      {
        name: formData.name,
        service: formData.service,
        rating,
        review: formData.text,
        approved: false,
      },
    ]);

    setLoading(false);

    if (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    triggerConfetti();
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3500);

    setRating(0);
    setFormData({ name: "", service: "", text: "" });
  };

  const allReviews = [...featuredReviews, ...dbReviews];
  const displayReviews = allReviews.slice(0, 12); // Max 12 reviews as requested

  // Split reviews into 3 columns for a clean masonry-style floating effect
  const cols = [[], [], []] as Review[][];
  displayReviews.forEach((r, i) => {
    cols[i % 3].push(r);
  });

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">

        <SectionHeading
          badge="Testimonials"
          title="What Our Clients Say"
          description="Trusted by professionals worldwide."
        />

        {/* Floating Reviews Animation */}
        <div className="mt-16 mx-auto max-w-6xl relative h-[600px] overflow-hidden rounded-3xl border border-glass-border bg-card/10 backdrop-blur-sm">
          {/* Top and bottom gradient fades for smoothness */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/90 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/90 to-transparent z-10 pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full px-4 md:px-8">
            {cols.map((colReviews, colIndex) => {
              // Slightly different speeds for an organic feel
              const duration = [28, 32, 30][colIndex];

              return (
                <div key={colIndex} className="relative h-full w-full hidden md:block first:block">
                  {colReviews.map((r, i) => {
                    // Stagger the start time perfectly so they never overlap
                    const delay = -(i * (duration / colReviews.length));

                    return (
                      <motion.div
                        key={`${r.name}-${i}`}
                        custom={{ delay, duration }}
                        variants={floatingReviewsAnim}
                        initial="hidden"
                        animate="visible"
                        className="absolute w-full glass-card p-6 md:p-8 cursor-default shadow-md bg-background/80 hover:bg-background transition-colors border border-primary/5"
                        style={{ top: "-30%" }}
                      >
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`h-4 w-4 ${j < r.rating
                                  ? "fill-accent text-accent"
                                  : "text-muted-foreground/30"
                                }`}
                            />
                          ))}
                        </div>

                        <p className="text-sm md:text-base italic text-foreground/90 leading-relaxed">
                          "{r.review}"
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-sm font-semibold">
                              {r.name}
                              <BadgeCheck className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {r.service}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-2xl"
        >
          <SectionHeading
            badge="Share Your Experience"
            title="Leave a Review"
            description="Your feedback helps us improve."
          />

          <form onSubmit={handleSubmit} className="mt-10 glass-card space-y-6 p-8">

            <Input
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Input
              placeholder="Service Taken"
              value={formData.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
              }
            />

            {/* Stars */}
            <div className="flex gap-2 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    className={`h-8 w-8 transition ${i < (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                      }`}
                  />
                </motion.button>
              ))}
            </div>

            <Textarea
              placeholder="Write your review..."
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Review"}
              <Send className="ml-2 h-4 w-4" />
            </Button>

          </form>

          {/* Success Animation */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 text-center p-6 rounded-xl bg-green-500/10 border border-green-500"
              >
                <Sparkles className="mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-green-600">
                  Review Submitted Successfully!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Thank you for sharing your experience 💚
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      </div>
    </div>
  );
};

export default Reviews;