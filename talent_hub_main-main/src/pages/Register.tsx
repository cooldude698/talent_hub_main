import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib1/supabase";
import { FcGoogle } from "react-icons/fc";
import { Check, X } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "", color: "bg-gray-200" };
    if (pass.length > 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^a-zA-Z\d]/.test(pass)) score += 1;

    if (score < 2) return { score, label: "Weak", color: "bg-red-500", text: "text-red-500", feedback: "Add numbers and special characters" };
    if (score < 4) return { score, label: "Medium", color: "bg-yellow-500", text: "text-yellow-600", feedback: "Add uppercase letters or special characters" };
    return { score, label: "Strong", color: "bg-green-500", text: "text-green-600", feedback: "Great password!" };
  };

  const strength = calculatePasswordStrength(password);

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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        setErrorMessage(error.message);
      }
    } catch (err) {
      setErrorMessage("Something went wrong with Google Registration. Please try again.");
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

        <div className="mb-6 space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
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
            {password && (
              <div className="mt-2 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full ${
                          strength.score >= level ? strength.color : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`font-medium ${strength.text}`}>
                    {strength.label}
                  </span>
                </div>
                {strength.score < 4 && (
                  <p className="text-muted-foreground">{strength.feedback}</p>
                )}
              </div>
            )}
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