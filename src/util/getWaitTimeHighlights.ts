import { Json } from "@/lib/database.types";

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
  tokenCount: number;
  totalSlotHours: number;
}

export const getWaitTimeData = (data: Data): Record<string, PositionData> => {
  const result: Record<string, PositionData> = {};

  for (const positionKey in data) {
    const positionNumber = parseInt(positionKey.split("_")[1]); // Extract position number from positionKey
    const highlights = data[positionKey];
    if (highlights) {
      const tokenCount = highlights.length;
      const totalSlotHours = highlights.reduce(
        (acc: number, highlight: Highlight) => acc + highlight.slot_hours,
        0
      );

      result[positionNumber.toString()] = {
        tokenCount,
        totalSlotHours,
      };
    } else {
      result[positionNumber.toString()] = {
        tokenCount: 0,
        totalSlotHours: 0,
      };
    }
  }

  return result;
};
