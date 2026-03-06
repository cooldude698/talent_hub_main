import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/lib1/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

type ProjectStatus =
    | 'Pending'
    | 'Request Received'
    | 'Freelancer Assigned'
    | 'In Progress'
    | 'Quality Review'
    | 'Delivered';

const statusSteps: { label: ProjectStatus; description: string }[] = [
    { label: 'Request Received', description: 'We have received your project details.' },
    { label: 'Freelancer Assigned', description: 'An expert has been matched to your project.' },
    { label: 'In Progress', description: 'Work is currently underway.' },
    { label: 'Quality Review', description: 'Your project is undergoing rigorous quality checks.' },
    { label: 'Delivered', description: 'Your project has been delivered.' },
];

export const ProjectTracker = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [currentStatus, setCurrentStatus] = useState<ProjectStatus>('Pending');
    const [loading, setLoading] = useState(true);
    const [projectName, setProjectName] = useState<string>("");

    useEffect(() => {
        const fetchProjectStatus = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // First try the new 'projects' table
                const { data, error } = await supabase
                    .from('projects')
                    .select('project_name, status')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (data) {
                    setCurrentStatus((data.status || 'Pending') as ProjectStatus);
                    setProjectName(data.project_name);
                } else {
                    // Fallback to the old 'client_projects' table if no data in new table
                    if (user.email) {
                        const { data: oldData, error: oldError } = await supabase
                            .from('client_projects')
                            .select('project_title, project_name, status')
                            .eq('client_email', user.email)
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .single();
                        
                        if (oldData) {
                             setCurrentStatus((oldData.status || 'Pending') as ProjectStatus);
                             setProjectName(oldData.project_title || oldData.project_name || 'Project');
                        } else if (oldError && oldError.code !== 'PGRST116') {
                            console.error("Error fetching old project status:", oldError);
                        }
                    }
                }
            } catch (err) {
                 console.error("Error fetching project status:", err);
                 // Only show toast for actual network/server errors, not "no rows found"
                 toast({
                     title: "Notice",
                     description: "Unable to load active project status.",
                     variant: "default",
                 });
            } finally {
                setLoading(false);
            }
        };

        fetchProjectStatus();
    }, [user, toast]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If no project is found, we can either not show the tracker or show a generic message
    if (!projectName) {
        return (
            <div className="glass-card p-6 text-center">
                <h3 className="font-display font-semibold text-lg text-muted-foreground">No Active Projects</h3>
                <p className="text-sm text-muted-foreground mt-2">Submit a project to start tracking its progress.</p>
            </div>
        );
    }

    const currentStepIndex = statusSteps.findIndex(s => s.label === currentStatus);
    // Support 'Pending' status which comes before 'Request Received'
    const isPending = currentStatus === 'Pending';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 md:p-8"
        >
            <div className="mb-8">
                <h2 className="font-display text-2xl font-bold">Project Status</h2>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                    Tracking: <span className="font-medium text-foreground">{projectName}</span>
                </p>
            </div>

            <div className="relative border-l-2 border-primary/20 ml-3 md:ml-4 space-y-8">
                {statusSteps.map((step, index) => {
                    const isCompleted = isPending ? false : index <= currentStepIndex;
                    const isCurrent = isPending ? false : index === currentStepIndex;

                    return (
                        <motion.div
                            key={step.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="relative pl-8"
                        >
                            {/* Step indicator */}
                            <div
                                className={`absolute -left-[18px] top-0 p-1 rounded-full ${isCompleted ? "bg-primary" : "bg-card border-2 border-primary/30"
                                    } shadow-sm`}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                                ) : (
                                    <Circle className="w-5 h-5 text-transparent" fill="transparent" />
                                )}
                            </div>

                            {/* Step Content */}
                            <div className={`p-4 rounded-xl transition-all duration-300 ${isCurrent ? 'bg-primary/5 border border-primary/20 shadow-sm' : ''}`}>
                                <h3 className={`font-display font-semibold text-lg ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {step.label}
                                    {isCurrent && <span className="ml-3 inline-flex items-center text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3 mr-1" /> Current Phase</span>}
                                </h3>
                                <p className={`mt-1 text-sm ${isCurrent ? 'text-foreground/80' : 'text-muted-foreground/70'}`}>
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};
