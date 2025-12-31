import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";
import UploadAttachments from "@/components/UploadButton";
import { PopupImage } from "@/components/PopupImage";
import * as React from "react";

export function AddPost({
  setPostContent,
  setPostAttachment,
  content,
  attachments,
}: {
  setPostContent: Dispatch<SetStateAction<string>>;
  setPostAttachment: Dispatch<SetStateAction<string[]>>;
  content: string;
  attachments: string[];
}) {
  const addPost = useMutation(api.myFunctions.addPost);
  return (
    <div>
      <Button
        onClick={async () => {
          addPost({
            content: content,
            attachments: attachments,
            date: BigInt(Date.now()),
          });
          setPostAttachment([]);
          setPostContent("");
        }}
      >
        Post!
      </Button>
      <Textarea onChange={(e) => setPostContent(e.target.value)}></Textarea>
      {attachments.map((attachment, index) => (
        <PopupImage url={attachment} key={index} />
      ))}
      <UploadAttachments setAttachments={setPostAttachment} />
    </div>
  );
}
