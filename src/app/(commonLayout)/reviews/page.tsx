import { getSession } from "@/action/user.action";
import ReviewsHub from "@/components/modules/review/ReviewsHub";

export default async function ReviewsHubPage() {
    const session = await getSession();
    const rawUserId =
        session?.data?.data?.user?.id ?? session?.data?.user?.id;

    const userId = typeof rawUserId === "string" ? rawUserId : undefined;

    return <ReviewsHub userId={userId} />;
}
