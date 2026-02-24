import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare } from "lucide-react";
import { supabase } from "../lib1/supabase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert([
      {
        user_id: user?.id || null,
        name,
        email,
        subject,
        message,
      },
    ]);

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent 🎉",
      description: "We'll get back to you soon.",
    });

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          badge="Contact"
          title="Let's Talk"
          description="Have a project in mind? Get in touch and we'll match you with the right talent."
        />

        <div className="mx-auto mt-16 grid max-w-4xl gap-12 md:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <Mail className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold">Email Us</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                studiorawgen@gmail.com
              </p>
            </div>

            <div className="glass-card p-6">
              <MessageSquare className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold">Response Time</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We typically respond within 24 hours.
              </p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card space-y-4 p-6"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Name *
                </label>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Subject *
              </label>
              <Input
                placeholder="Project inquiry"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Message *
              </label>
              <Textarea
                placeholder="Tell us about your project..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Contact;