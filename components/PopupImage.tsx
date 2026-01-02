import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function PopupImage({url}:{url:string}) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Image src={url} alt={""} width={100} height={100} className="mt-2" />
        </DialogTrigger>
        <DialogContent className="min-w-[70%]">
          <VisuallyHidden>
            <DialogTitle asChild>
              <Label htmlFor="image-url">Image</Label>
            </DialogTitle>
          </VisuallyHidden>
          <Image
            src={url}
            alt={""}
            width={1920}
            height={1200}
            className="mt-2"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
