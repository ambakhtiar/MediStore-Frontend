import Link from "next/link";
import {
    Pill,
    Heart,
    Baby,
    Eye,
    Brain,
    Bone,
    Thermometer,
    Droplets,
    ArrowRight,
} from "lucide-react";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types";

// Fallback icon/color map for common category names
const CATEGORY_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    default:    { icon: Pill,        color: "text-primary",     bg: "bg-primary/10" },
    cardiac:    { icon: Heart,       color: "text-rose-500",    bg: "bg-rose-50 dark:bg-rose-950/30" },
    pediatric:  { icon: Baby,        color: "text-sky-500",     bg: "bg-sky-50 dark:bg-sky-950/30" },
    eye:        { icon: Eye,         color: "text-violet-500",  bg: "bg-violet-50 dark:bg-violet-950/30" },
    neuro:      { icon: Brain,       color: "text-indigo-500",  bg: "bg-indigo-50 dark:bg-indigo-950/30" },
    ortho:      { icon: Bone,        color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-950/30" },
    fever:      { icon: Thermometer, color: "text-orange-500",  bg: "bg-orange-50 dark:bg-orange-950/30" },
    blood:      { icon: Droplets,    color: "text-red-500",     bg: "bg-red-50 dark:bg-red-950/30" },
};

function getCategoryMeta(name: string) {
    const lower = name.toLowerCase();
    for (const key of Object.keys(CATEGORY_META)) {
        if (key !== "default" && lower.includes(key)) return CATEGORY_META[key];
    }
    return CATEGORY_META.default;
}

// Placeholder categories shown when API returns empty
const PLACEHOLDER_CATEGORIES: Category[] = [
    { id: "1", name: "Cardiac Care",     slug: "cardiac",   description: "Heart & circulation medicines", isPrescriptionRequired: true,  createdAt: "", updatedAt: "" },
    { id: "2", name: "Pediatrics",       slug: "pediatric", description: "Safe medicines for children",  isPrescriptionRequired: false, createdAt: "", updatedAt: "" },
    { id: "3", name: "Eye Care",         slug: "eye",       description: "Eye drops & ointments",        isPrescriptionRequired: false, createdAt: "", updatedAt: "" },
    { id: "4", name: "Neurology",        slug: "neuro",     description: "Brain & nerve treatments",      isPrescriptionRequired: true,  createdAt: "", updatedAt: "" },
    { id: "5", name: "Orthopaedic",      slug: "ortho",     description: "Bone, joint & muscle care",    isPrescriptionRequired: false, createdAt: "", updatedAt: "" },
    { id: "6", name: "Fever & Pain",     slug: "fever",     description: "Analgesics & antipyretics",    isPrescriptionRequired: false, createdAt: "", updatedAt: "" },
    { id: "7", name: "Blood Health",     slug: "blood",     description: "Haematology medicines",        isPrescriptionRequired: true,  createdAt: "", updatedAt: "" },
    { id: "8", name: "General Medicine", slug: "general",   description: "Everyday health products",     isPrescriptionRequired: false, createdAt: "", updatedAt: "" },
];

export default async function CategoriesSection() {
    const res = await categoryService.getAll();
    const raw: Category[] = (res.data as { data?: Category[] })?.data ?? [];
    const categories = raw.length >= 4 ? raw.slice(0, 8) : PLACEHOLDER_CATEGORIES;

    return (
        <section className="section-padding section-screen">
            <div className="container-app">
            {/* Header */}
            <div className="flex items-end justify-between mb-8 gap-4">
                <div>
                    <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">
                        Browse by Category
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Shop by Category
                    </h2>
                </div>
                <Link
                    href="/shop"
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
                >
                    All Categories
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {categories.map((cat) => {
                    const { icon: Icon, color, bg } = getCategoryMeta(cat.name);
                    return (
                        <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug ?? cat.id}`}
                            className="group flex flex-col items-center text-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-card-foreground leading-tight line-clamp-2">
                                    {cat.name}
                                </p>
                                {cat.isPrescriptionRequired && (
                                    <span className="mt-1 inline-block text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                                        Rx
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
            </div>
        </section>
    );
}
