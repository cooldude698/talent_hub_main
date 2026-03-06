import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { services } from "@/data/services";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { saveLead } from "@/lib1/saveLead";
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
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  serviceType: z.string().min(1, "Please select a service type."),
  message: z.string().min(10, "Message must be at least 10 characters."),
  preferredTechStack: z.string().optional(),
  figmaLink: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  currentManualWorkflow: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const defaultService = searchParams.get("service") || "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      serviceType: defaultService,
      message: "",
      preferredTechStack: "",
      figmaLink: "",
      currentManualWorkflow: "",
    },
  });

  // Re-run if searchParams change dynamically without full page reload
  useEffect(() => {
    if (defaultService) {
      form.setValue("serviceType", defaultService);
    }
  }, [defaultService, form]);

  const selectedServiceType = useWatch({
    control: form.control,
    name: "serviceType",
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    const leadData = {
      user_id: user?.id || null,
      name: values.name,
      email: values.email,
      subject: values.subject,
      service_type: values.serviceType,
      message: values.message,
      // Store dynamic fields in a structured way or just map directly to columns if they exist.
      // Often these are stored in a jsonb `metadata` column or specific columns.
      // Assuming `saveLead` takes arbitrary JSON, we pass it all.
      preferred_tech_stack: values.preferredTechStack || null,
      figma_link: values.figmaLink || null,
      current_manual_workflow: values.currentManualWorkflow || null,
    };

    const result = await saveLead(leadData);

    setLoading(false);

    if (result && result.error) {
      // Note: saveLead returning error inside data conditionally could be handled here
      // Assuming saveLead suppresses error or logs it as per its current implementation
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent 🎉",
      description: "We'll get back to you soon.",
    });

    form.reset();
  };

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          badge="Contact"
          title="Let's Talk"
          description="Have a project in mind? Get in touch and we'll match you with the right talent."
        />

        <div className="mx-auto mt-16 grid max-w-4xl gap-12 md:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <Mail className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold">Email Us</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                studiorawgenn@gmail.com
              </p>
            </div>

            <div className="glass-card p-6">
              <MessageSquare className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold">Response Time</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We typically respond within 24 hours.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background">
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

                {selectedServiceType === "Web Development" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <FormField
                      control={form.control}
                      name="preferredTechStack"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Tech Stack</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. React, Next.js, Node" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="figmaLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Figma Link</FormLabel>
                          <FormControl>
                            <Input placeholder="https://figma.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {selectedServiceType === "AI Automation" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <FormField
                      control={form.control}
                      name="currentManualWorkflow"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Manual Workflow</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the process you want to automate..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject *</FormLabel>
                      <FormControl>
                        <Input placeholder="Project inquiry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your project..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;