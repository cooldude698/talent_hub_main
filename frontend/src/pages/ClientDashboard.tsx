import { useEffect, useState } from "react";
import { supabase } from "@/lib1/supabase";

export default function ClientDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/login";
      return;
    }

    fetchUserProjects(data.user.email);
  };

  const fetchUserProjects = async (email: string | undefined) => {
    if (!email) return;

    const { data, error } = await supabase
      .from("client_projects") // ✅ CORRECT TABLE
      .select("*")
      .eq("client_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    }

    if (data) {
      setProjects(data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        Client Project Dashboard
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {projects.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            No active projects found.
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-xl shadow border"
            >
              <h2 className="text-xl font-semibold">
                {project.project_title}
              </h2>

              <p className="mt-2 text-gray-600">
                {project.description}
              </p>

              {/* Status Badge */}
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    project.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : project.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {project.status || "Pending"}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1">
                  Progress: {project.progress || 0}%
                </p>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Created:{" "}
                {new Date(project.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}