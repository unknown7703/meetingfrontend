"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export default function SummaryPage() {
  const { data: session } = useSession();
  const [summaries, setSummaries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSummaries = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_FASTAPI_URL}/getsummary`,
        {
          params: { userId: session.user.id },
        }
      );
      setSummaries(response.data.summaries);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, [session]);

  return (
    <div className="min-h-screen p-6 bg-background space-y-4">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Summaries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : summaries.length > 0 ? (
            summaries.map((summary, index) => (
              <Card key={index} className="p-4 shadow-md border border-border">
                <CardContent>{summary}</CardContent>
              </Card>
            ))
          ) : (
            <p>No summaries found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
