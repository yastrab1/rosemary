"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import query from "@/lib/neon";
import { Card } from "@/components/ui/card";
import { Heading1 } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useTheme } from "next-themes";

const SUM_QUERY = "SELECT SUM(duration_minutes) FROM whatsapp_calls";
const MAX_QUERY = "SELECT MAX(duration_minutes) FROM whatsapp_calls";

export default function Page() {

  const { setTheme } = useTheme();
  useLayoutEffect(() => {
    setTheme("light");
  }, [setTheme]);

  const [sum, setSum] = useState(0);
  const [max, setMax] = useState(0);
  useEffect(() => {
    query<{ max: number }>(MAX_QUERY, []).then((result) =>
      setMax(result[0].max),
    );
    query<{ sum: number }>(SUM_QUERY, []).then((result) =>
      setSum(result[0].sum),
    );
  }, []);
  return (
    <div
      className={
        "flex text-center justify-center flex-col bg-pink-100 h-[100vh]"
      }
    >
      <h1 className="text-4xl font-medium mt-10">Relationship wrapped</h1>
      <p>It has been an insane 2 years, hasn&#39;t it?</p>

      <p className={"mt-5"}>
        Oki, teraz po slovensky.
        <br />
        Znamenáš pre mňa naozaj veľa, rád nerdím tak som spravil túto stránku.
        <br />
        Obsahuje prevažne štatistiky a cute referencie na nás dvoch. <br />
        <br />
        Speaking of referencie, spomínala si že chodíš so mnou iba preto, že na
        mňa treba dávať pozor. <br />
        Tak tomu trochu dajme štýl s
        <Link className={"underline"} href={"/dashboard"}> ružovo-fialovou dashboard</Link>, nie?
      </p>
    </div>
  );
}
