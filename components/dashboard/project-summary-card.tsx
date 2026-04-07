import { Card, CardContent } from "@/components/ui/card";

export function ProjectSummaryCard({
  name,
  productType,
  platform,
  audience,
  style,
  screenshotCount
}: {
  name: string;
  productType: string;
  platform: string;
  audience: string;
  style: string;
  screenshotCount: number;
}) {
  return (
    <Card className="sticky top-24">
      <CardContent className="space-y-3 p-5 text-sm">
        <h3 className="text-base font-semibold">Project summary</h3>
        <p><span className="text-muted-foreground">Name:</span> {name || "Untitled"}</p>
        <p><span className="text-muted-foreground">Type:</span> {productType || "-"}</p>
        <p><span className="text-muted-foreground">Platform:</span> {platform || "-"}</p>
        <p><span className="text-muted-foreground">Audience:</span> {audience || "-"}</p>
        <p><span className="text-muted-foreground">Style:</span> {style || "-"}</p>
        <p><span className="text-muted-foreground">Screenshots:</span> {screenshotCount}/5</p>
        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">Expected output: 5 listing screenshots + 1 promo tile + 1 hero banner.</div>
      </CardContent>
    </Card>
  );
}
