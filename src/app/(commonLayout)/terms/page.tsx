export const metadata = {
    title: "Terms and Conditions | MediStore",
    description: "Terms and Conditions for using MediStore services.",
};

export default function TermsPage() {
    return (
        <div className="section-padding py-12 lg:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Terms & Conditions</h1>
                
                <div className="space-y-8 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
                        <p>
                            Welcome to MediStore. By accessing our website and using our services, you agree to be bound by the following Terms and Conditions. Please read them carefully.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">2. User Accounts</h2>
                        <p>
                            To use certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">3. Medical Disclaimer</h2>
                        <p>
                            The content on MediStore is for informational purposes only. We do not provide medical advice. Always consult with a qualified healthcare professional before starting any treatment or medication.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">4. Prescription Policy</h2>
                        <p>
                            Medicines that require a prescription will only be dispensed upon the upload of a valid prescription from a registered medical practitioner. We reserve the right to cancel orders if the prescription is found to be invalid.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">5. Delivery & Returns</h2>
                        <p>
                            We aim to deliver within the specified timeframes, but delays may occur due to unforeseen circumstances. Returns are accepted within 24 hours only for incorrect or damaged products.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
