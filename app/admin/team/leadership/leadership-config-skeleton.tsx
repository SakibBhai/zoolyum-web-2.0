import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LeadershipConfigSkeleton() {
  return (
    <div className="space-y-6">
      {/* Info Card Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Cards Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
