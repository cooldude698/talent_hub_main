import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { services } from "@/data/services";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib1/supabase";
import { useToast } from "@/components/ui/use-toast";
import SectionHeading from "@/components/shared/SectionHeading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters."),
  serviceType: z.string().min(1, "Please select a service type."),
  description: z.string().min(10, "Please provide more details about the project."),
  budget: z.coerce.number().min(10, "Please provide an estimated budget or at least 10").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const PostProject = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      serviceType: "",
      description: "",
      budget: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    setLoading(true);

    try {
      // First try to insert into the new `projects` table
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.id,
            project_name: values.projectName,
            service_type: values.serviceType,
            budget: values.budget ? Number(values.budget) : null,
            status: 'Pending'
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      // Also optionally attempt to write to client_projects to keep things backwards compatible if needed
      // but we handled the fallback on the dashboard so we primarily write here.

      toast({
        title: "Project Submitted Successfully!",
        description: "Your request has been received. We will assign an expert shortly.",
      });

      form.reset();
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Error submitting project:", error);
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in, show the lock screen
  if (!user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">Post a Project</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Log in to submit your project requirements and get matched with a verified freelancer.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/login">Log In to Continue</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  // If logged in, show the actual form
  return (
    <div className="py-24 bg-gray-50/50 min-h-[80vh]">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading
          badge="New Request"
          title="Start a New Project"
          description="Fill out the details below and we will match you with the perfect expert for the job."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 glass-card p-6 md:p-10 bg-white border border-gray-100 shadow-sm rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">Project Details</h2>
              <p className="text-sm text-muted-foreground">Provide enough info so we can assign the best talent.</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">Project Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. E-Commerce Website Redesign" className="h-12 bg-gray-50 border-gray-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Service Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                          ))}
                          <SelectItem value="AI Automation">AI Automation</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Estimated Budget ($) - Optional</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 500" className="h-12 bg-gray-50 border-gray-200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">Project Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe exactly what you are looking to build or achieve. The more details, the better!"
                        className="min-h-[150px] resize-y bg-gray-50 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-end">
                <Button type="button" variant="outline" className="mr-3" onClick={() => navigate('/dashboard')} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={loading} className="px-8 shadow-md">
                  {loading ? "Submitting..." : "Submit Project"}
                </Button>
              </div>

            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
};

export default PostProject;
