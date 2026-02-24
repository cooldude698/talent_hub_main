import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/50 bg-background">
    <div className="container mx-auto px-4 py-16">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            <span className="gradient-text">RAW</span>
            <span className="text-foreground">GEN</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Premium managed freelance agency. Curated talent, guaranteed quality.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">Platform</h4>
          <div className="flex flex-col gap-2">
            <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</Link>
            <Link to="/portfolios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolios</Link>
            <Link to="/reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</Link>
            <Link to="/post-project" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Post a Project</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">Company</h4>
          <div className="flex flex-col gap-2">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/why-rawgen" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Why RAWGEN</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
          <div className="flex flex-col gap-2">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} RAWGEN. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
