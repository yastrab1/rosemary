"use client";

import query from "@/lib/neon";
import { useEffect, useState } from "react";
import { Area, Bar, ComposedChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const dailyMessageStatsQuery =
  "SELECT \n" +
  "  DATE(TO_TIMESTAMP(timestamp)) as day,\n" +
  "  COUNT(CASE WHEN author = 'Julka' THEN 1 END) as julka_messages,\n" +
  "  COUNT(CASE WHEN author = 'Lukas Lipka' THEN 1 END) as lukas_lipka_messages\n" +
  "FROM messages \n" +
  "WHERE author IN ('Julka', 'Lukas Lipka') AND content LIKE $1\n" +
  "  AND DATE(TO_TIMESTAMP(timestamp)) >= $2::date AND DATE(TO_TIMESTAMP(timestamp)) <= $3::date\n" +
  "GROUP BY day\n" +
  "ORDER BY day\n";

const callsQuery =
  "SELECT call_date, duration_minutes FROM whatsapp_calls WHERE call_date >= $1::date AND call_date <= $2::date ORDER BY call_date";

const listMessagesQuery =
  "SELECT author, content, timestamp FROM messages " +
  "WHERE author IN ('Julka', 'Lukas Lipka') AND content LIKE $1 " +
  "AND DATE(TO_TIMESTAMP(timestamp)) >= $2::date AND DATE(TO_TIMESTAMP(timestamp)) <= $3::date " +
  "ORDER BY timestamp LIMIT 10000";

interface MessageCounts {
  day: Date;
  julka_messages: number;
  lukas_lipka_messages: number;
}

interface CallRow {
  call_date: string;
  duration_minutes: number;
}

interface Message {
  timestamp: number;
  author: string;
  content: string;
}

const chartConfig = {
  lukas: {
    label: "Lukas Lipka",
    color: "oklch(0.8 0.4 260)",
  },
  julka: {
    label: "Julka",
    color: "oklch(0.65 0.4 330)",
  },
  calls: {
    label: "Call (min)",
    color: "oklch(0.7 0.3 145)",
  },
} satisfies ChartConfig;

function constructLabels(startDate: Date, endDate: Date) {
  const labels: Date[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  while (start <= end) {
    labels.push(window.structuredClone(start));
    start.setDate(start.getDate() + 1);
  }
  return labels;
}

export function MessageChart() {
  const [chartData, setChartData] = useState<
    { date: string; lukas: number; julka: number; calls: number }[]
  >([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [queryWord, setQueryWord] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date("2026-01-07"));
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const sanitized = queryWord == "" ? "%_%" : "%" + queryWord + "%";
    const startStr = format(startDate, "yyyy-MM-dd");
    const endStr = format(endDate, "yyyy-MM-dd");

    Promise.all([
      query<MessageCounts>(dailyMessageStatsQuery, [sanitized, startStr, endStr]),
      query<CallRow>(callsQuery, [startStr, endStr]),
      query<Message>(listMessagesQuery, [sanitized, startStr, endStr]),
    ]).then(([msgData, callData, msgList]) => {
      if (!msgData[0]) {
        setChartData([]);
        setMessages([]);
        return;
      }
      const labelDates = constructLabels(msgData[0].day, msgData[msgData.length - 1].day);
      const callMap = new Map<string, number>();
      callData.forEach((c) => {
        const key = typeof c.call_date === "string" ? c.call_date.split("T")[0] : new Date(c.call_date).toISOString().split("T")[0];
        callMap.set(key, (callMap.get(key) || 0) + Number(c.duration_minutes));
      });

      setChartData(
        labelDates.map((d) => {
          const dateStr = d.toISOString().split("T")[0];
          const match = msgData.find(
            (r) => r.day.toISOString() === d.toISOString(),
          );
          return {
            date: dateStr,
            lukas: match?.lukas_lipka_messages || 0,
            julka: match?.julka_messages || 0,
            calls: callMap.get(dateStr) || 0,
          };
        }),
      );

      setMessages(
        msgList.map(
          (m) =>
            `${new Date(m.timestamp * 1000).toLocaleString()} ${m.author}: ${m.content}`,
        ),
      );
    });
  }, [queryWord, startDate, endDate]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Graf správ</CardTitle>
          <CardDescription>
            <div className="flex gap-2 items-center">
              <Input
                className="h-8 w-40"
                type="text"
                placeholder="Search..."
                value={queryWord}
                onChange={(e) => setQueryWord(e.target.value)}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-sm font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" required selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-sm font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" required selected={endDate} onSelect={setEndDate} />
                </PopoverContent>
              </Popover>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="fillLukas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-lukas)" stopOpacity={1.0} />
                  <stop offset="95%" stopColor="var(--color-lukas)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillJulka" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-julka)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-julka)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickMargin={8} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    indicator="dot"
                  />
                }
              />
              <Bar dataKey="calls" yAxisId="right" fill="var(--color-calls)" opacity={0.4} radius={[2, 2, 0, 0]} />
              <Area dataKey="julka" yAxisId="left" type="natural" fill="url(#fillJulka)" stroke="var(--color-julka)" />
              <Area dataKey="lukas" yAxisId="left" type="natural" fill="url(#fillLukas)" stroke="var(--color-lukas)" />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Naše správy</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-1 text-sm font-mono">
              {messages.map((m, i) => (
                <p key={i} className="text-muted-foreground font-[Jetbrains_Mono]">{m}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
