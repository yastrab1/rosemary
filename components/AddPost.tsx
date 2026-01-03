import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";
import UploadAttachments from "@/components/UploadButton";
import { PopupImage } from "@/components/PopupImage";
import * as React from "react";
import { PostDatePicker } from "@/components/ui/DatePicker";

export function AddPost() {
  const addPost = useMutation(api.posts.addPost);

  const [content, setContent] = useState<string>("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [date,setDate] = useState<Date>(new Date());
  return (
    <div className={"flex flex-col gap-5 items-center "}>
      <div className={"w-[50%] min-w-75 "}>
        <Textarea
          className={" "}
          onChange={(e) => setContent(e.target.value)}
          value={content}
        ></Textarea>
        {attachments.map((attachment, index) => (
          <PopupImage url={attachment} key={index} />
        ))}
        <div className={"flex-row flex ml-5 justify-center mt-5"}>
          <div className={""}>
            <PostDatePicker date={date} setDate={setDate} />
          </div>
          <div className={"ml-5"}>
            <UploadAttachments setAttachments={setAttachments} />
          </div>
        </div>
          <Button
            className={""}
            onClick={async () => {
              addPost({
                content: content,
                attachments: attachments,
                date: BigInt(date.getTime()),
              });
              setAttachments([]);
              setContent("");
            }}
          >
            Post!
          </Button>
      </div>
    </div>
  );
}
