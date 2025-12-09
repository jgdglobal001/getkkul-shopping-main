export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
// Firebase storage removed - using local file storage or cloud storage alternative

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const email = formData.get("email") as string;

    if (!file || !email) {
      return NextResponse.json(
        { error: "Image file and email are required" },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Firebase storage removed - return placeholder for now
    // In production, implement cloud storage (AWS S3, Cloudinary, etc.)

    return NextResponse.json({
      success: false,
      error: "Image upload service temporarily unavailable. Firebase storage has been removed.",
      message: "Please implement alternative cloud storage solution",
    }, { status: 501 });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
