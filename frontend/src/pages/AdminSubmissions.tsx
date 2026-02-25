import { useEffect, useState } from "react";
import { supabase } from "@/lib1/supabase"; // ⚠️ Make sure this path is correct

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth error:", error);
      setLoading(false);
      return;
    }

    console.log("Logged in user:", data.user);

    // 🔐 CHANGE THIS EMAIL TO YOUR ADMIN EMAIL
    if (data.user && data.user.email === "studiorawgen@gmail.com") {
      setAuthorized(true);
      fetchSubmissions();
    } else {
      setAuthorized(false);
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("portfolio_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    }

    if (data) {
      setSubmissions(data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl">Loading Admin Panel...</h2>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl text-red-600 font-semibold">
          Access Denied — Admin Only
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Portfolio Submissions
      </h1>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-600">
          No submissions yet.
        </p>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {submissions.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-md border"
            >
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-600">{item.role}</p>

              <div className="mt-3 space-y-1">
                <p>
                  <strong>Email:</strong> {item.email}
                </p>
                <p>
                  <strong>Phone:</strong> {item.phone}
                </p>
              </div>

              <p className="mt-4 text-gray-700">
                {item.experience}
              </p>

              <p className="text-sm text-gray-400 mt-4">
                Submitted:{" "}
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}