"use client";

import { UploadButton } from "@/lib/uploadthing";
import imageCompression from "browser-image-compression";
import { Dispatch, SetStateAction } from "react";
export default function UploadAttachments({
  setAttachments,
}: {setAttachments:Dispatch<SetStateAction<string[]>>}) {
  return (

      <UploadButton className={"inline"}
        endpoint="imageUploader"
        onBeforeUploadBegin={async (files) => {
          const result = [];
          for (const file of files) {
            result.push(
              await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
              }),
            );
          }
          return result;
        }}
        onClientUploadComplete={(res) => {
          res.forEach((file) => {
            setAttachments((e) => [...e, file.ufsUrl]);
          });
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
  );
}
