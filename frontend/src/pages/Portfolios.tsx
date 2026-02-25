import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/lib1/supabase";

interface Portfolio {
  id: number;
  name: string;
  role: string;
  skills: string;
  bio: string;
  image: string;
}

const portfolios: Portfolio[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Talent ${i + 1}`,
  role: ["Full Stack Developer", "UI/UX Designer", "AI Engineer"][i % 3],
  skills: ["React, Node", "Figma, UX", "ML, Python"][i % 3],
  bio: "Experienced professional delivering scalable and high-quality digital solutions.",
  image: `https://i.pravatar.cc/300?img=${i + 15}`,
}));

export default function Portfolios() {
  const [selected, setSelected] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    experience: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("portfolio_submissions")
      .insert([formData]);

    if (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Send Email Notification to Admin
      await fetch(
        "https://sjuesewvbdqkdwywhhdt.supabase.co/functions/v1/notify-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "portfolio",
            data: {
              name: formData.name,
              email: formData.email,
              role: formData.role,
            },
          }),
        }
      );
    } catch (err) {
      console.log("Email notification failed:", err);
    }

    setLoading(false);
    setSuccess(true);

    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      experience: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#f8faff] to-[#e0f2fe] py-20 px-6">

      {/* PORTFOLIOS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {portfolios.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -8 }}
            onClick={() => setSelected(p)}
            className="backdrop-blur-xl bg-white/40 border border-white/30 shadow-xl rounded-3xl p-6 cursor-pointer hover:shadow-2xl transition"
          >
            <div className="text-center">
              <img
                src={p.image}
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-indigo-600 text-sm">{p.role}</p>
              <p className="text-gray-600 text-xs mt-2">{p.skills}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SUBMIT SECTION */}
      <div className="max-w-3xl mx-auto mt-24 backdrop-blur-xl bg-white/50 border border-white/40 shadow-xl rounded-3xl p-10">

        <h2 className="text-2xl font-bold text-center mb-8">
          Submit Your Portfolio
        </h2>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-green-600 font-medium mb-6"
            >
              ✅ Portfolio submitted successfully.  
              <br />
              We’ll get back to you shortly.
            </motion.div>
          )}
        </AnimatePresence>

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none"
            />

            <input
              type="text"
              placeholder="Role / Expertise"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none"
            />

            <textarea
              placeholder="Describe your experience and work..."
              rows={4}
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              {loading ? "Submitting..." : "Submit Portfolio"}
            </button>

          </form>
        )}
      </div>

      {/* PROFILE MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-white/40 backdrop-blur-xl flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-10 shadow-2xl max-w-xl w-full relative"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6"
              >
                <X size={28} />
              </button>

              <div className="text-center">
                <img
                  src={selected.image}
                  className="w-28 h-28 rounded-full mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold">{selected.name}</h2>
                <p className="text-indigo-600">{selected.role}</p>
                <p className="text-gray-600 mt-4">{selected.bio}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}