import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib1/supabase";

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    // ✅ STEP 1: Create user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    try {
      // ✅ STEP 2: Notify admin about registration
      await fetch(
        "https://sjuesewvbdqkdwywhhdt.supabase.co/functions/v1/notify-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "register",
            data: {
              email,
              fullName,
            },
          }),
        }
      );
    } catch (err) {
      console.log("Registration email notification failed:", err);
    }

    // ✅ STEP 3: Auto login user
    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      alert(loginError.message);
      setLoading(false);
      return;
    }

    setLoading(false);

    // ✅ STEP 4: Redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md glass-card p-8"
      >
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join RAWGEN to access premium freelance services.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Full Name
            </label>
            <Input
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline"
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;