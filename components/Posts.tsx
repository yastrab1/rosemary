import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import {Card} from "@/components/ui/card";
import {Post} from "@/components/ui/JaggedText";

export default function Content() {
    const posts = useQuery(api.posts.getAllPosts);

    if (posts === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {posts.map(post => (
                <Post key={post._id} date={new Date(Number(post.date))} attachments={post.attachments} id={post._id}>{post.content}</Post>
            ))}
        </div>
    );
}