"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Routes } from "@/constants/Routes";
import FileUpload from "@/components/fileupload/FileUpload";
import DisplayFiles from "@/components/fileupload/DisplayFiles";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col bg-background p-6 gap-6">
      {/* Top Half - Start New Meet & File Upload */}
      <div className="flex w-full h-[30%] gap-6">
        {/* Start New Meet */}
        <div className="w-1/4 flex flex-col items-center justify-center p-6 shadow-lg rounded-lg bg-background border border-border">
          <Link href={Routes.meet}>
            <Button
              variant="outline"
              size="lg"
              className="flex flex-row items-center justify-center"
            >
              <Plus className="w-6 h-6 " />
              <div>Start Interview</div>
            </Button>
          </Link>
        </div>

        {/* File Upload */}
        <div className="w-1/4  shadow-lg rounded-lg bg-background border border-border flex flex-col items-center justify-center">
          <FileUpload />
        </div>
      </div>

      {/* Bottom Half - Document List */}
      <div className="w-full h-[70%] shadow-lg rounded-lg bg-background border border-border overflow-y-auto">
        <DisplayFiles />
      </div>
    </div>
  );
}
