import SectionHeading from "@/components/shared/SectionHeading";

const Terms = () => (
  <div className="py-24">
    <div className="container mx-auto max-w-3xl px-4">
      <SectionHeading title="Terms & Conditions" />
      <div className="mt-12 glass-card p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">1. Service Agreement</h3>
          <p>By using RAWGEN, you agree to our managed freelance model. Projects are assigned by our team based on skill matching and availability.</p>
        </section>
        <section>
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">2. Quality Guarantee</h3>
          <p>All deliverables pass through our quality assurance process. If work does not meet agreed specifications, we will revise or reassign at no extra cost.</p>
        </section>
        <section>
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">3. Payment Terms</h3>
          <p>Payment is required upon project acceptance. Pricing is transparent and fixed — no hidden fees or bidding.</p>
        </section>
        <section>
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">4. Intellectual Property</h3>
          <p>Upon full payment, all intellectual property rights for deliverables are transferred to the client.</p>
        </section>
      </div>
    </div>
  </div>
);

export default Terms;
