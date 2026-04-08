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
  if (!uploads.length) {
    return <p className="text-sm text-muted-foreground">No screenshots uploaded yet.</p>;
  }

  return (
    <div className="grid gap-3">
      {uploads.map((upload, idx) => (
        <Card key={upload.id} className="overflow-hidden">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="relative h-24 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted sm:h-20 sm:w-32">
              <Image src={upload.file_url} alt={upload.original_filename} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{upload.original_filename}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{Math.round((upload.file_size ?? 0) / 1024)} KB · position {idx + 1}</p>
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
