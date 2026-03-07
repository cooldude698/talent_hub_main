import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
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
  currency: z.string().default("USD"),
  urgency: z.string().default("Standard (Default)"),
  budget: z.coerce.number().min(0, "Budget cannot be negative").optional().or(z.literal("")),
});

const SERVICE_BASE_PRICES: Record<string, number> = {
  "UGC Videos": 300,
  "Web Development": 1500,
  "Content Writing": 150,
  "Script Writing": 200,
  "Video Editing": 250,
  "Logo Design": 200,
  "Ghost Writing": 400,
  "Graphic Design": 150,
  "Brochure Design": 250,
  "Event Management": 1000,
  "Cryptography": 2000,
  "Comic Creation": 500,
  "Filming": 800,
  "Package & Label Design": 300,
  "Voice Over": 150,
  "UI/UX Designing": 800,
  "AI Automation": 1200,
  "Other": 500,
};

const CURRENCY_RATES: Record<string, { symbol: string, rate: number }> = {
  "USD": { symbol: "$", rate: 1 },
  "INR": { symbol: "₹", rate: 83 },
  "EUR": { symbol: "€", rate: 0.92 },
  "GBP": { symbol: "£", rate: 0.79 },
};

const URGENCY_MULTIPLIERS: Record<string, number> = {
  "Standard (Default)": 1,
  "Rush (1.5x)": 1.5,
  "Urgent (2x)": 2,
};

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
      currency: "USD",
      urgency: "Standard (Default)",
      budget: "",
    },
  });

  const watchServiceType = form.watch("serviceType");
  const watchCurrency = form.watch("currency") || "USD";
  const watchUrgency = form.watch("urgency") || "Standard (Default)";

  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    if (watchServiceType) {
      const basePrice = SERVICE_BASE_PRICES[watchServiceType] || 500;
      const rate = CURRENCY_RATES[watchCurrency]?.rate || 1;
      const multiplier = URGENCY_MULTIPLIERS[watchUrgency] || 1;
      const calculated = Math.round(basePrice * rate * multiplier);
      setEstimatedCost(calculated);

      form.setValue("budget", calculated);
    } else {
      setEstimatedCost(0);
    }
  }, [watchServiceType, watchCurrency, watchUrgency, form]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    setLoading(true);

    try {
      // First try to insert into the new `projects` table
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            user_id: user.id,
            project_name: values.projectName,
            service_type: values.serviceType,
            description: `[Currency: ${values.currency}] [Timeline: ${values.urgency}]\n\n${values.description}`,
            budget: values.budget ? Number(values.budget) : null,
            status: "Pending"
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
          <h1 className="font-display text-3xl font-bold">Get a Quote</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Log in to submit your project requirements and receive a custom quote.
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
          title="Get a Custom Quote"
          description="Fill out the details below and we will send you a custom quote for your project."
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
              <p className="text-sm text-muted-foreground">Provide enough info so we can generate an accurate quote.</p>
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
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Project Timeline</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Standard (Default)">Standard Delivery</SelectItem>
                          <SelectItem value="Rush (1.5x)">Rush Delivery (1.5x Cost)</SelectItem>
                          <SelectItem value="Urgent (2x)">Urgent Delivery (2x Cost)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-primary/5 rounded-xl border border-primary/10">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Currency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-white">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
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
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel className="font-semibold text-gray-700">Your Budget</FormLabel>
                        <span className="text-primary font-bold text-lg">
                          {CURRENCY_RATES[watchCurrency]?.symbol}{Number(field.value || 0).toLocaleString()}
                        </span>
                      </div>
                      <FormControl>
                        <div className="pt-2 pb-4">
                          <Slider
                            value={[Number(field.value || 0)]}
                            min={0}
                            max={100000}
                            step={watchCurrency === "INR" ? 500 : 50}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            disabled={!watchServiceType}
                            className="my-4"
                          />
                          {!watchServiceType && (
                            <p className="text-xs text-muted-foreground mt-2">Select a service to unlock the budget slider.</p>
                          )}
                        </div>
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

              <div className="pt-4 flex flex-col items-end gap-2">
                <div className="flex justify-end w-full">
                  <Button type="button" variant="outline" className="mr-3" onClick={() => navigate('/dashboard')} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" size="lg" disabled={loading} className="px-8 shadow-md">
                    {loading ? "Submitting..." : "Get Quote"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * Note: Projects below {CURRENCY_RATES[watchCurrency]?.symbol}{Math.round(10000 / CURRENCY_RATES["INR"].rate * (CURRENCY_RATES[watchCurrency]?.rate || 1)).toLocaleString()} require 100% advance. Projects above require 50% advance.
                </p>
              </div>

            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
};

export default PostProject;
