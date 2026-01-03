import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { useMemo, useState } from "react";
import { listFilms } from "@/convex/films";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Trash } from "@hugeicons/core-free-icons";
import { Id } from "@/convex/_generated/dataModel";

export default function Film({film}:{film:{_id:Id<"films">,name:string,watched:boolean}}) {
  const watchFilm = useMutation(api.films.markWatched);
  const deleteFilm = useMutation(api.films.deleteFilm)
  const [optimistic, setOptimistic] = useState<boolean|null>(film.watched);



  const displayed = useMemo(() => {
    return optimistic
  }, [optimistic]);
  return <div key={film._id} className={"flex items-center gap-3 mt-1"}>
    <Checkbox
      id={film._id}
      checked={displayed ?? film.watched}
      onCheckedChange={async (checked) => {
        const next = Boolean(checked);
        const prev = film.watched;

        setOptimistic(!optimistic);
        try {
          // ak máš "markWatched" len na true, tak sem daj { watched: next } a sprav setWatched mutation
          await watchFilm({ id: film._id });
          // success -> overlay preč (už príde z query)

        } catch {
          // rollback
          setOptimistic((o) => (prev));
        }
      }}
    />
    <Label htmlFor={film._id} className={" text-xl"}>
      {film.name}
    </Label>
    <HugeiconsIcon icon={Trash} className={"ml-1"} onClick={()=> deleteFilm({id:film._id})}/>
  </div>;
}