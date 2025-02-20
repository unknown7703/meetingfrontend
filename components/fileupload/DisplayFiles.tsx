"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DisplayFiles() {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/getfiles`, {
        params: { userId },
      });
      setFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get user ID from session and fetch files on component load or page reload
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUserId(session.user.id as string);
    }
  }, [status, session]);

  useEffect(() => {
    if (userId) {
      fetchFiles();
    }
  }, [userId]);

  return (
    <Card className="p-4 space-y-4 h-full">
      <CardHeader>
        <CardTitle>Your Resume</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button onClick={fetchFiles} disabled={loading}>
            {loading ? "Loading..." : "Fetch Files"}
          </Button>
        </div>
        <ul className="space-y-2">
          {files.length > 0 ? (
            files.map((file, index) => (
              <li key={index}>
                <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {file}
                </a>
              </li>
            ))
          ) : (
            <p>No files found.</p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
