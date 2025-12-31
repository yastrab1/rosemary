import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PopupImage } from "@/components/PopupImage";

type TornLinedPaperCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  lineGapPx?: number; // rozostup linajok
  date: Date;
  attachments: string[];
};

const TORN_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 24" preserveAspectRatio="none"><path d="M0,14 C12,6 24,22 36,14 C48,6 60,22 72,14 C84,6 96,22 108,14 C120,6 132,22 144,14 C156,6 168,22 180,14 C198,6 210,20 240,12 L240,0 L0,0 Z" fill="black"/></svg>`;

export function TornLinedPaperCard({
  title = "Poznámky",
  children,
  className,
  lineGapPx = 22,
  date,
  attachments,
}: TornLinedPaperCardProps) {
  const lineStyle: React.CSSProperties = {
    background: `repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent ${lineGapPx}px,
      rgba(59,130,246,.22) ${lineGapPx}px,
      rgba(59,130,246,.22) ${lineGapPx + 1}px
    )`,
  };

  // “torn” okraje: 2 pseudo-elementy s maskou
  const tornMaskStyles: React.CSSProperties = {
    WebkitMaskImage: `url('${TORN_SVG}')`,
    WebkitMaskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskImage: `url('${TORN_SVG}')`,
    maskSize: "100% 100%",
    maskRepeat: "no-repeat",
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-[#fbfbf8] shadow-sm",

        // ⬇️ ONLY bottom torn edge, 20px
        "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-2 after:rotate-180 after:bg-muted",

        className,
      )}
      style={
        {
          "--tornMask": `url('${TORN_SVG}')`,
        } as React.CSSProperties
      }
    >
      {/* aplikuj masku na before/after cez inline <style> scoped ku komponentu */}

      {/* pridáme triedu, ktorú použije <style> vyššie */}
      <div className="torn-paper absolute inset-0" aria-hidden />

      {/* línie */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={lineStyle}
      />

      {/* červený margin */}
      <div className="pointer-events-none absolute inset-y-0 left-10 w-0.5 bg-red-300/70" />
      <div className={"ml-8"}>
        <CardHeader className="relative pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>

        <CardContent className="relative text-sm text-zinc-700 text-base font-[Rosemary]">
          {children}
          {attachments.map((attachment, index) => (
            <PopupImage url={attachment} key={index}/>
          ))}
        </CardContent>
      </div>
      <div className={"absolute top-1 right-5 text-cyan-700"}>
        {date.toDateString().slice(4)}
      </div>
    </Card>
  );
}
