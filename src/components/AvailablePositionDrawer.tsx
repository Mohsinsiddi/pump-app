"use client";
import * as React from "react";
import { Minus, Plus } from "lucide-react";
import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useStore from "@/app/store/useStore";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Json } from "@/lib/database.types";
import { getWaitTimeData } from "@/util/getWaitTimeHighlights";

type AvailablePositionDrawerType = {
  data: Data | Json | null;
};

interface Highlight {
  id: number;
  position: number;
  token_id: string;
  created_at: string;
  price_paid: number;
  slot_hours: number;
  start_time: string;
  creator_address: string;
  highlight_signature: string;
}

interface Data {
  [key: string]: Highlight[] | null;
}

interface PositionData {
  position: number;
  tokenCount: number;
  totalSlotHours: number;
}
export function AvailablePositionDrawer({ data }: AvailablePositionDrawerType) {
  const [tokenCount, setTokenCount] = React.useState(10);
  const [highlightWaitTimeData, setHighlightWaitTimeData] =
    React.useState<PositionData[]>();

  function onClick(adjustment: number) {
    setTokenCount(Math.max(200, Math.min(400, tokenCount + adjustment)));
  }

  const { isAvailablePosition, setIsAvailablePositionFlag } = useStore();

  React.useEffect(() => {
    const extracted_data = getWaitTimeData(data as Data);
    const waitTimeDataArray = Object.entries(extracted_data).map(
      ([key, value]) => ({
        position: parseInt(key),
        ...value,
      })
    );
    setHighlightWaitTimeData(waitTimeDataArray);
  }, []);

  return (
    <Drawer
      open={isAvailablePosition}
      onClose={() => setIsAvailablePositionFlag(false)}
    >
      <DrawerContent className="bg-[#070815] text-white p-4">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="">
            <DrawerTitle className="flex justify-center">
              Available Highlight Positions
            </DrawerTitle>
            <DrawerDescription className="flex justify-center">
              Every char bar represents, top value - total number of waitinng
              hours in queue and inside top value - total number of token
              launches in queue
            </DrawerDescription>
          </DrawerHeader>
          <div className="">
            <div className="mt-1 h-[360px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
                className={"bg-slate-500"}
              >
                <BarChart data={highlightWaitTimeData} className="text-white">
                  <XAxis
                    type="number"
                    dataKey="position"
                    stroke="#white"
                    scale="linear"
                  />

                  <Tooltip
                    contentStyle={{
                      height: "100",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="tokenCount"
                    style={
                      {
                        fill: "hsl(var(--foreground))",
                        opacity: 0.9,
                      } as React.CSSProperties
                    }
                  >
                    <LabelList
                      dataKey="tokenCount"
                      position="insideTop"
                      style={{ fill: "white" }}
                    />
                    <LabelList
                      dataKey="totalSlotHours"
                      position="top"
                      style={{ fill: "white" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="text-black"
                onClick={() => setIsAvailablePositionFlag(false)}
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
