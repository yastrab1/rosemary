import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import {Card} from "@/components/ui/card";
import {TornLinedPaperCard} from "@/components/ui/JaggedText";

export default function Content() {
    const posts = useQuery(api.myFunctions.getAllPosts);

    if (posts === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <ul>
            {posts.map(post => (
                <TornLinedPaperCard key={post._id} date={new Date(Number(post.date))} attachments={post.attachments}>{post.content}</TornLinedPaperCard>
            ))}
        </ul>
    );
}