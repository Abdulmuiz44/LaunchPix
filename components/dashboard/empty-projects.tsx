import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyProjectsState() {
  return (
    <Card className="max-w-2xl">
      <CardContent className="p-8">
        <h2 className="text-xl font-semibold">No projects yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">Create your first project to generate listing screenshots, promo tiles, and hero banners.</p>
        <Button asChild className="mt-6"><Link href="/dashboard/projects/new">Create new project</Link></Button>
      </CardContent>
    </Card>
  );
}
