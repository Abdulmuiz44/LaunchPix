import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyProjectsState() {
  return (
    <Card className="max-w-3xl">
      <CardContent className="space-y-4 p-8">
        <h2 className="text-xl font-semibold">Start your first LaunchPix project</h2>
        <p className="text-sm text-muted-foreground">Upload raw screenshots, choose a style direction, and generate a full launch pack. Free mode lets you preview before upgrading.</p>
        <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
          <p><strong className="text-foreground">1.</strong> Add screenshots</p>
          <p><strong className="text-foreground">2.</strong> Set style + audience</p>
          <p><strong className="text-foreground">3.</strong> Generate pack</p>
        </div>
        <Button asChild className="mt-2"><Link href="/dashboard/projects/new">Create first project</Link></Button>
      </CardContent>
    </Card>
  );
}
