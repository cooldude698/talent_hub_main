import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingElements from "./FloatingElements";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-screen">
    <div className="mesh-gradient fixed inset-0 -z-10" />
    <FloatingElements />
    <Navbar />
    <main className="pt-16">{children}</main>
    <Footer />
  </div>
);

export default Layout;
