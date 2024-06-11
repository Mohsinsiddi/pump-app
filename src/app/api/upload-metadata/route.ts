import { NextResponse, NextRequest } from "next/server";
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const name: String | null = data.get("name") as unknown as String;
    const symbol: String | null = data.get("symbol") as unknown as String;

    const description: String | null = data.get(
      "description"
    ) as unknown as String;

    const image: String | null = data.get("image") as unknown as String;

    const twitter: String | null = data.get("twitter") as unknown as String;
    const discord: String | null = data.get("discord") as unknown as String;
    const telegram: String | null = data.get("telegram") as unknown as String;
    const website: String | null = data.get("website") as unknown as String;

    let init_json = {
      name,
      symbol,
      description,
      image,
      createdOn: "Syphon Launchpad",
    };
    let metadata_json = init_json;
    if (twitter) {
      Object.assign(metadata_json, { twitter });
    }
    if (discord) {
      Object.assign(metadata_json, { discord });
    }

    if (telegram) {
      Object.assign(metadata_json, { telegram });
    }

    if (website) {
      Object.assign(metadata_json, { website });
    }

    const res = await pinata.pinJSONToIPFS(metadata_json);

    return NextResponse.json({ ipfsHash: res.IpfsHash }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
