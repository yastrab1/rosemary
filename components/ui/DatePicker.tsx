"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarIcon } from "@hugeicons/core-free-icons";
import { Dispatch, SetStateAction } from "react";

export function PostDatePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}) {
  return (
    <Popover >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <HugeiconsIcon icon={CalendarIcon} className="mr-2" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar required={true} mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
