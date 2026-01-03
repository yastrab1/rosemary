"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Film from "@/components/Film";

export default function Page() {
  const listFilms = useQuery(api.films.listFilms);

  const addFilm = useMutation(api.films.addFilm);

  const [filmName, setFilmName] = useState<string>("");
  return (
    <div className={"mt-10 ml-3"}>
      {listFilms?.map((film, index) => (
      <Film film={film} key={film._id}/>
      ))}
      <Input
        className={"w-50"}
        value={filmName}
        onChange={(event) => setFilmName(event.target.value)}
      ></Input>
      <Button
        onClick={() => {
          addFilm({ name: filmName });
          setFilmName("");
        }}
      >
        Add
      </Button>
    </div>
  );
}
