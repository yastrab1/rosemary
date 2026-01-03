import { utapi } from "@/app/server/uploadthing";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const { slug } = await params;
  // @ts-expect-error ID is part of the table but not provable to convex
  const post = await client.query(api.posts.getPost, { id: slug });
  if (post == null) {
    return NextResponse.json(
      { message: "Deleting nonenxistent post" },
      { status: 400 },
    );
  }
  const attachments = post.attachments.filter(Boolean);

  const fileIds = attachments.map(
    (attachment: string) => attachment.split("/").pop() || "",
  );

  await utapi.deleteFiles(fileIds);

  if (token) client.setAuth(token);
  // @ts-expect-error ID is part of the table but not provable to convex
  await client.mutation(api.posts.deletePost, { id: slug });
  return new Response("ok");
  return NextResponse.json({ message: "success" }, { status: 200 });
}
