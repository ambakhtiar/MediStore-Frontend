import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
    title: "Contact Us | MediStore",
    description: "Get in touch with the MediStore support team.",
};

export default function ContactPage() {
    return (
        <div className="section-padding py-12 lg:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Get in <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Have a question about your order, our products, or anything else? Our team is ready to answer all your questions.
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-10">
                    {/* Contact Info */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Email</p>
                                        <p className="text-muted-foreground text-sm">support@medistore.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Phone</p>
                                        <p className="text-muted-foreground text-sm">+880 1700-000000</p>
                                        <p className="text-muted-foreground text-sm">Available 24/7</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Address</p>
                                        <p className="text-muted-foreground text-sm">Level 4, Tech Plaza<br />Banani, Dhaka 1213<br />Bangladesh</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-3 p-8 rounded-2xl bg-card border border-border shadow-sm">
                        <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">First Name</label>
                                    <input type="text" className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none transition-all" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last Name</label>
                                    <input type="text" className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none transition-all" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <input type="email" className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none transition-all" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <textarea rows={4} className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="button" className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
