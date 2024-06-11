"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { CollapsibleAdOnTokenlaunch } from "./AdditionalInfoTokenLauch";
import { fetchUsers } from "@/action/users";
import { createToken, fetchTokens } from "@/action/tokens";
import { fetchTrades } from "@/action/trades";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createTokenOnSolana } from "@/lib/smart-contract/solana/instructions/createToken";
import { GLOBAL_DECIMAL } from "@/lib/smart-contract/solana/constants";
import useStore from "@/app/store/useStore";
import { toast as sonnerTasot, ExternalToast } from "sonner";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { getHighlightingPriceHelper } from "@/util/solana/getHighlightingPriceHelper";

const MAX_FILE_SIZE = 1024 * 1024 * 10;

const FormSchema = z.object({
  token_name: z.string().min(2, {
    message: "token_name must be at least 2 characters.",
  }),
  token_ticker: z.string().min(2, {
    message: "token_ticker must be at least 2 characters.",
  }),
  token_description: z.string().min(2, {
    message: "token_description must be at least 2 characters.",
  }),
  image: z.any(),
  highlight_token_config: z.boolean(),
  highlight_position: z.coerce.number().lte(11, "Must be 11 and less"),
  slot_hours: z.coerce.number().lte(4, "Must be 4 and less"),
  terms_and_cond: z.string(),
});

export function TokenLaunchForm() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<any>();
  const [ipfsImageUrl, setIPFSImageURL] = useState("");
  const [twitter, setTwitter] = useState<string | null>(null);
  const [telegram, setTelegram] = useState<string | null>(null);
  const [discord, setDiscord] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const [file, setFile] = useState("");
  const connection = useConnection();
  const wallet = useWallet();

  const {
    toggleCreateTokenProgressbarFlag,
    setIsAvailablePositionFlag,
    setCreateTokenData,
  } = useStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      token_name: "",
      token_ticker: "",
      token_description: "",
      image: undefined,
      highlight_token_config: false,
      highlight_position: 0,
      terms_and_cond: "",
      slot_hours: 0,
    },
  });
  const highlight_token_config = form.watch("highlight_token_config");
  const terms_and_cond = form.watch("terms_and_cond");

  const uploadFile = async (fileToUpload: any) => {
    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);
      const metadata = JSON.stringify({
        name: `File name`,
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();

      const IMG_IPFS_URL = `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
      setIPFSImageURL(IMG_IPFS_URL);
    } catch (e) {
      console.log(e);
      alert("Trouble uploading file");
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!wallet.publicKey) {
      sonnerTasot.success(`Connect your wallet first`, {
        duration: 5000,
        className: "z-20",
      });
      return;
    }

    const metadataformData = new FormData();
    metadataformData.append("name", data.token_name);
    metadataformData.append("symbol", data.token_ticker);
    metadataformData.append("description", data.token_description);
    metadataformData.append("image", ipfsImageUrl);

    if (twitter) {
      metadataformData.append("twitter", twitter);
    }
    if (telegram) {
      metadataformData.append("telegram", telegram);
    }
    if (discord) {
      metadataformData.append("discord", discord);
    }
    if (website) {
      metadataformData.append("website", website);
    }

    const rank_price = getHighlightingPriceHelper(
      Number(data.highlight_position)
    );
    const total_cost = rank_price * Number(data.slot_hours);

    setCreateTokenData({
      name: data.token_name,
      decimal: 6,
      description: data.token_description,
      symbol: data.token_ticker,
      formData: metadataformData,
      image: ipfsImageUrl,
      desired_number_hours: data.slot_hours.toString(),
      desired_position: data.highlight_position.toString(),
      highlight_token_config,
      total_cost,
    });

    await new Promise((f) => setTimeout(f, 0.5 * 1000));

    toggleCreateTokenProgressbarFlag();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full max-w-sm items-center gap-1 space-y-3"
      >
        <FormField
          control={form.control}
          name="token_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Name</FormLabel>
              <FormControl>
                <Input placeholder="Token Name" {...field} />
              </FormControl>
              <FormDescription>This is your Token name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="token_ticker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Ticker</FormLabel>
              <FormControl>
                <Input placeholder="Token Ticker" {...field} />
              </FormControl>
              <FormDescription>This is your Token Symbol.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="token_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your message here." {...field} />
              </FormControl>
              <FormDescription>This is your Token Description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Logo</FormLabel>
              <FormControl>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id="image"
                    type="file"
                    {...field}
                    onChange={(e) => {
                      uploadFile(e.target.files?.[0]);
                      const fileSize = e.target.files?.[0]?.size;
                      if (fileSize! > MAX_FILE_SIZE) {
                        toast({
                          title: "Image size limit exceeds",
                          description: (
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                              <code className="text-white">
                                Image size exceeds limit of 10 MB
                              </code>
                            </pre>
                          ),
                        });
                      } else {
                        const file = e.target.files?.[0];

                        const reader = new FileReader();
                        if (file) {
                          reader.onload = () => {
                            setImagePreview(reader.result);
                          };
                          reader.readAsDataURL(file);
                          form.clearErrors("image"); // Clear image errors when a valid image is selected
                          setSelectedImage(e.target.files?.[0] || null);
                        }
                      }
                    }}
                    accept="image/png, image/jpeg, image/webp, image/gif"
                  />
                  {imagePreview && (
                    <div className="flex justify-center items-center">
                      <Image
                        className="mr-2 w-300 h-auto text-white rounded-md p-2 border border-neutral-700"
                        width={108}
                        height={108}
                        src={imagePreview}
                        alt="Image Preview"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>This is your Token Image logo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="highlight_token_config"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-1">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Highlighting Token</FormLabel>
                <FormDescription>
                  Enable Token to be on main page for more people to see and
                  trade
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {highlight_token_config && (
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="highlight_position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex justify-between">
                      <div className="flex justify-center items-center">
                        Token Highlight Position
                      </div>
                      <div>
                        <Button
                          onClick={() => setIsAvailablePositionFlag(true)}
                          type="button"
                        >
                          Avl. Positions
                        </Button>
                      </div>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Desired Position" {...field} />
                  </FormControl>
                  <FormDescription>
                    Thie will be the highlight position of your token on hero
                    section
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slot_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex justify-between">
                      <div className="flex justify-center items-center">
                        Slot Hours
                      </div>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Desired number of hours" {...field} />
                  </FormControl>
                  <FormDescription>
                    Number of hour token details will be displayed on hero
                    section
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <CollapsibleAdOnTokenlaunch
          setTwitter={setTwitter}
          setTelegram={setTelegram}
          setDiscord={setDiscord}
          setWebsite={setWebsite}
        />
        <FormField
          control={form.control}
          name="terms_and_cond"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="items-top flex space-x-2">
                  <Checkbox
                    id="terms1"
                    {...field}
                    onClick={() => setIsChecked((prev) => !prev)}
                    className="h-4 w-4"
                  />
                  <div className="grid gap-1 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </label>
                    <p className="text-sm text-muted-foreground">
                      You agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Thie will be the highlight position of your token on hero
                section
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="hover:bg-[#262f64]"
          type="submit"
          disabled={ipfsImageUrl === ""}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
