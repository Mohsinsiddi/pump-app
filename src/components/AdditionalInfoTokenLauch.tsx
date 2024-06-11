"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "./ui/input";
type CollapsibleAdOnTokenlaunchProps = {
  setTwitter: React.Dispatch<React.SetStateAction<string | null>>;
  setTelegram: React.Dispatch<React.SetStateAction<string | null>>;
  setDiscord: React.Dispatch<React.SetStateAction<string | null>>;
  setWebsite: React.Dispatch<React.SetStateAction<string | null>>;
};

export function CollapsibleAdOnTokenlaunch({
  setDiscord,
  setTelegram,
  setTwitter,
  setWebsite,
}: CollapsibleAdOnTokenlaunchProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className=" w-full max-w-sm space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">Fill Additinal Info</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-2">
        <div className="">
          <Input
            type="text"
            placeholder="Website"
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div className="">
          <Input
            type="text"
            placeholder="Twitter"
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>
        <div className="">
          <Input
            type="text"
            placeholder="Telegram"
            onChange={(e) => setTelegram(e.target.value)}
          />
        </div>
        <div className="">
          <Input
            type="text"
            placeholder="Discord"
            onChange={(e) => setDiscord(e.target.value)}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
