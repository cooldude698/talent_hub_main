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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Create user in Supabase
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
        if (error.message.toLowerCase().includes("rate limit")) {
          setErrorMessage(
            "⚠️ Too many attempts. Please wait a few minutes before trying again."
          );
        } else if (
          error.message.toLowerCase().includes("already registered")
        ) {
          setErrorMessage("This email is already registered. Try logging in.");
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      // 🔔 Notify admin (NON BLOCKING)
      fetch(
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
      ).catch(() => {
        console.log("Admin notification failed");
      });

      // ✅ If email confirmation is enabled
      if (!data.session) {
        setSuccessMessage(
          "✅ Account created successfully! Please check your email to confirm your account before logging in."
        );
        return;
      }

      // ✅ If confirmation is disabled (dev mode)
      navigate("/dashboard");

    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Join RAWGENN to access premium freelance services.
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

          {errorMessage && (
            <p className="text-sm text-red-500 text-center">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-sm text-green-500 text-center">
              {successMessage}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;