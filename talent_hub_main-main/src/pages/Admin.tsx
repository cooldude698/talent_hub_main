import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const Admin = () => (
  <div className="flex min-h-[80vh] items-center justify-center py-24">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <ShieldCheck className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        This area is restricted to authorized administrators only.
      </p>
    </motion.div>
  </div>
);

export default Admin;
