import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CreditCard, Briefcase, Activity, CalendarDays, ExternalLink, Settings, LogOut, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/lib1/supabase";
import { ProjectTracker } from "@/components/ProjectTracker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import SectionHeading from "@/components/shared/SectionHeading";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.email) {
      fetchUserProjects(user.email);
    } else {
      checkUser();
    }
  }, [user]);

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

    try {
      // First try to fetch from the new projects table if it exists and has data
      const { data: newProjectsData, error: newError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (newProjectsData && newProjectsData.length > 0) {
        setProjects(newProjectsData);
      } else {
        // Fallback to old client_projects table for backwards compatibility
        const { data, error } = await supabase
          .from("client_projects")
          .select("*")
          .eq("client_email", email)
          .order("created_at", { ascending: false });

        if (error) console.error("Fetch error old table:", error);
        if (data) setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeProjectsCount = projects.filter(p => p.status !== 'Completed' && p.status !== 'Delivered').length;
  const completedProjectsCount = projects.filter(p => p.status === 'Completed' || p.status === 'Delivered').length;

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email || 'user'}`} />
              <AvatarFallback>{(user?.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
                Welcome back, {user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Client')}
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5" />
                Client Portal
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href="/post-project">Request Quote</a>
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card-hover bg-white p-6 rounded-2xl border-l-4 border-l-primary shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Projects</p>
                <h3 className="text-3xl font-bold font-display mt-2 text-gray-900">{activeProjectsCount}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg"><Activity className="w-6 h-6 text-primary" /></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card-hover bg-white p-6 rounded-2xl border-l-4 border-l-green-500 shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <h3 className="text-3xl font-bold font-display mt-2 text-gray-900">{completedProjectsCount}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg"><CheckCircle2 className="w-6 h-6 text-green-600" /></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card-hover bg-white p-6 rounded-2xl border-l-4 border-l-blue-500 shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Recent Activity</p>
                <h3 className="text-xl font-bold font-display mt-2 text-gray-900 line-clamp-1">
                  {projects[0]?.project_title || projects[0]?.project_name || 'No Activity'}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg"><Clock className="w-6 h-6 text-blue-600" /></div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white p-1 rounded-lg shadow-sm border border-gray-100 w-full justify-start h-auto overflow-x-auto hidden-scrollbar">
            <TabsTrigger value="overview" className="px-6 py-2.5 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">Overview</TabsTrigger>
            <TabsTrigger value="projects" className="px-6 py-2.5 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">All Projects</TabsTrigger>
            <TabsTrigger value="invoices" className="px-6 py-2.5 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">Invoices</TabsTrigger>
            <TabsTrigger value="settings" className="px-6 py-2.5 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0 outline-none space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Live Tracker Column */}
              <div className="lg:col-span-1 border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden h-fit">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Live Tracker</h3>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
                <div className="p-0 sm:p-2 bg-white">
                  <ProjectTracker />
                </div>
              </div>

              {/* Recent Projects Column */}
              <div className="lg:col-span-2 border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden h-fit">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Recent Projects</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('projects')} className="text-primary hover:bg-primary/5">View All</Button>
                </div>
                <div className="p-6">
                  {projects.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                      <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <h4 className="text-gray-900 font-medium">No projects yet</h4>
                      <p className="text-gray-500 text-sm mt-1 mb-4">You haven't requested any quotes.</p>
                      <Button size="sm" asChild><a href="/post-project">Request a Quote</a></Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.slice(0, 3).map((project, idx) => (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={project.id || idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all bg-white group cursor-pointer">
                          <div className="flex items-start gap-4">
                            <div className="hidden sm:flex h-10 w-10 rounded-full bg-primary/10 items-center justify-center shrink-0">
                              <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {project.project_title || project.project_name || 'Untitled Project'}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                {project.description || project.service_type || 'No description available'}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                <span className="flex items-center"><CalendarDays className="h-3 w-3 mr-1" /> {project.created_at ? format(new Date(project.created_at), 'MMM dd, yyyy') : 'Unknown Date'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${(project.status === "Completed" || project.status === "Delivered")
                              ? "bg-green-50 text-green-700 border-green-200"
                              : project.status === "In Progress"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }`}>
                              {project.status || "Pending"}
                            </span>
                            {project.progress !== undefined && (
                              <span className="text-xs font-medium text-gray-500">{project.progress}%</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-0 outline-none">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, idx) => (
                  <div key={project.id || idx} className="border border-gray-200 rounded-xl p-5 hover:border-primary/40 transition-colors bg-white flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-10 w-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-gray-600" />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${(project.status === "Completed" || project.status === "Delivered")
                          ? "bg-green-50 text-green-700 border-green-200"
                          : project.status === "In Progress"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}>
                          {project.status || "Pending"}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">
                        {project.project_title || project.project_name || 'Untitled Project'}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {project.description || project.service_type || 'No description available'}
                      </p>
                    </div>

                    <div>
                      {project.progress !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-500">Progress</span>
                            <span className="font-medium text-gray-900">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                          </div>
                        </div>
                      )}
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                        <span>Started {project.created_at ? format(new Date(project.created_at), 'MMM dd, yyyy') : 'Unknown Date'}</span>
                        <Button variant="ghost" size="sm" className="h-8 text-primary px-2">Details</Button>
                      </div>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <p className="text-gray-500">No projects found.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="mt-0 outline-none">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-500 flex flex-col items-center">
              <CreditCard className="h-16 w-16 text-gray-200 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Invoices Yet</h3>
              <p>Invoices and billing history will appear here once your projects are billed.</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0 outline-none">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
              <h3 className="text-lg font-medium text-gray-900 mb-6 border-b pb-4">Account Settings</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Email Address</p>
                  <p className="text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Linked Provider</p>
                  <p className="text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 capitalize">{user?.app_metadata?.provider || 'Email'}</p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <Button variant="destructive" className="w-full sm:w-auto" onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/";
                  }}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}