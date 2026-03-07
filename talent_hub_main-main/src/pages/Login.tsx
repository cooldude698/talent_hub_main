import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib1/supabase";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setErrorMessage(
            "📩 Please confirm your email before logging in. Check your inbox."
          );
        } else if (
          error.message.toLowerCase().includes("invalid login credentials")
        ) {
          setErrorMessage("❌ Incorrect email or password.");
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
            type: "login",
            data: {
              email: data.user?.email,
            },
          }),
        }
      ).catch(() => {
        console.log("Login notification failed");
      });

      setSuccessMessage("✅ Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

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
      setErrorMessage("Something went wrong with Google Login. Please try again.");
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
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log in to access your RAWGENN account
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

        <form className="space-y-4" onSubmit={handleLogin}>
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

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;