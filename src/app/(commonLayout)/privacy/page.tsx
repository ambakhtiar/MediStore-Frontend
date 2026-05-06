export const metadata = {
    title: "Privacy Policy | MediStore",
    description: "Privacy Policy for MediStore users.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="section-padding py-12 lg:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
                
                <div className="space-y-8 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
                        <p>
                            We collect information that you provide directly to us, such as your name, email address, phone number, shipping address, and prescription documents when you register or make a purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
                        <p>
                            We use the collected information to process and fulfill your orders, provide customer support, send transactional notifications, and improve our platform&apos;s security and functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Security</h2>
                        <p>
                            We implement strict security measures to protect your personal information and health data. Sensitive data, such as passwords and payment details, are encrypted using industry-standard protocols.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">4. Sharing Your Information</h2>
                        <p>
                            We do not sell your personal data. We only share necessary information with our verified sellers and delivery partners strictly for the purpose of fulfilling your order.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
                        <p>
                            You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
