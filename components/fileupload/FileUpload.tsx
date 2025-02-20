"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import axios from "axios";

const FileUpload = () => {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file || !session?.user?.id || !session.accessToken) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", session.user.id);
    formData.append("access_token", session.accessToken); // Add access_token

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className=" rounded-md shadow-sm">
      <h2 className="text-lg font-bold mb-4">Upload resume</h2>
      <Input type="file" onChange={handleFileChange} className="mb-4" />
      <Button onClick={handleFileUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default FileUpload;
