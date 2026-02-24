import SectionHeading from "@/components/shared/SectionHeading";

const PrivacyPolicy = () => (
  <div className="py-24">
    <div className="container mx-auto max-w-3xl px-4">
      <SectionHeading title="Privacy Policy" />
      <div className="mt-12 glass-card p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">1. Information We Collect</h3>
          <p>We collect information you provide when creating an account, submitting projects, or contacting us. This includes your name, email address, and project details.</p>
        </section>
        <section>
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">2. How We Use Your Information</h3>
          <p>Your information is used to facilitate project matching, communicate with you, and improve our services. We never sell your personal data to third parties.</p>
        </section>
        <section>
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">3. Data Security</h3>
          <p>We implement industry-standard security measures including encryption, secure authentication, and regular security audits to protect your information.</p>
        </section>
        <section>
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">4. Contact</h3>
          <p>For privacy-related inquiries, contact us at privacy@rawgen.agency.</p>
        </section>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
