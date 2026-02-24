import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "@/data/services";

const PostProject = () => (
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

export default PostProject;
