import { UploadCloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function UploadPlaceholder() {
  return (
    <Card>
      <CardContent className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center">
        <UploadCloud className="size-8 text-muted-foreground" />
        <p className="mt-4 font-medium">Upload raw screenshots</p>
        <p className="mt-1 text-sm text-muted-foreground">PNG or JPG up to 10MB each. Deterministic templates are applied after upload.</p>
      </CardContent>
    </Card>
  );
}
