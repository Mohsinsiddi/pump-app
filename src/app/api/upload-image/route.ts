import fs from "fs";
import { NextResponse } from "next/server";
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
const formidable = require("formidable");

const saveFile = async (file: any) => {
  console.log(file);
  try {
    const stream = fs.createReadStream(file.filepath);
    console.log("1");
    const options = {
      pinataMetadata: {
        name: file.originalFilename,
      },
    };
    console.log("2");

    const response = await pinata.pinFileToIPFS(stream, options);
    console.log("3");

    fs.unlinkSync(file.filepath);

    return response;
  } catch (error) {
    throw error;
  }
};

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file") as Blob | null;
    console.log(file);
    if (!file) {
      return NextResponse.json(
        { error: "File blob is required." },
        { status: 400 }
      );
    }
    const response = await saveFile(file);
    const { IpfsHash } = response;

    return NextResponse.json(IpfsHash);
  } catch (error) {
    console.log(error, "ERROR_MESSAGES");
    return new NextResponse("Error", { status: 500 });
  }
}
