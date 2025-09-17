import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const ButtonLoadingState: React.FC<{ children: React.ReactNode; loading?: boolean }> = ({ 
  children, 
  loading = false 
}) => (
  <>
    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    {children}
  </>
);

export const PageLoadingState: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export const EmptyState: React.FC<{ 
  title: string; 
  description: string; 
  action?: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ title, description, action, icon }) => (
  <div className="text-center py-12">
    {icon && <div className="mb-4 flex justify-center">{icon}</div>}
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4 max-w-md mx-auto">{description}</p>
    {action}
  </div>
);