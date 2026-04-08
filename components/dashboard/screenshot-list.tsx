"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import type { UploadRecord } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ScreenshotList({
  uploads,
  onDelete,
  onReorder
}: {
  uploads: UploadRecord[];
  onDelete: (id: string) => void;
  onReorder: (id: string, dir: "up" | "down") => void;
}) {
  if (!uploads.length) return <p className="text-sm text-muted-foreground">No screenshots uploaded yet.</p>;

  return (
    <div className="grid gap-3">
      {uploads.map((upload, idx) => (
        <Card key={upload.id}>
          <CardContent className="flex items-center gap-4 p-3">
            <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-border bg-muted">
              <Image src={upload.file_url} alt={upload.original_filename} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{upload.original_filename}</p>
              <p className="text-xs text-muted-foreground">{Math.round((upload.file_size ?? 0) / 1024)} KB</p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => onReorder(upload.id, "up")} disabled={idx === 0}><ArrowUp className="size-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => onReorder(upload.id, "down")} disabled={idx === uploads.length - 1}><ArrowDown className="size-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => onDelete(upload.id)}><Trash2 className="size-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
