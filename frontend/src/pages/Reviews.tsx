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
  {
    name: "Sarah Mitchell",
    service: "Web Development",
    rating: 5,
    review:
      "RAWGEN delivered a stunning website that exceeded expectations. Extremely professional process.",
  },
  {
    name: "David Chen",
    service: "Logo Design",
    rating: 5,
    review:
      "Outstanding creative quality and very smooth communication. Highly recommended.",
  },
  {
    name: "Maria Santos",
    service: "UI/UX Designing",
    rating: 5,
    review:
      "Modern, elegant and high-performing design. Truly impressive experience.",
  },
];

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

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">

        <SectionHeading
          badge="Testimonials"
          title="What Our Clients Say"
          description="Trusted by professionals worldwide."
        />

        {/* Reviews Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allReviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className="glass-card-hover p-6 cursor-pointer"
            >
              <div className="flex gap-1">
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

              <p className="mt-4 text-sm text-muted-foreground">
                "{r.review}"
              </p>

              <div className="mt-4 border-t pt-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {r.name}
                  <BadgeCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground">
                  {r.service}
                </div>
              </div>
            </motion.div>
          ))}
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