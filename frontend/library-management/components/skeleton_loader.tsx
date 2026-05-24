import React from 'react';

const skeletonBase = 'animate-pulse rounded-xl bg-surface-variant/70';

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`${skeletonBase} ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <SkeletonBlock className="h-12 w-72 max-w-full" />
        <SkeletonBlock className="h-5 w-[32rem] max-w-full" />
      </div>
      <SkeletonBlock className="h-24 w-full rounded-2xl" />
      <CardGridSkeleton />
    </div>
  );
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-outline-variant/40 bg-white p-4 shadow-sm">
          <SkeletonBlock className="aspect-[4/5] w-full rounded-xl" />
          <div className="mt-4 space-y-3">
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-6 w-full" />
            <SkeletonBlock className="h-4 w-1/2" />
            <SkeletonBlock className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-outline-variant bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 space-y-4">
              <div className="flex gap-3">
                <SkeletonBlock className="h-6 w-24 rounded-full" />
                <SkeletonBlock className="h-6 w-28 rounded-full" />
              </div>
              <SkeletonBlock className="h-8 w-2/3" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
            <SkeletonBlock className="h-11 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-sm">
      <div className="grid grid-cols-4 gap-4 border-b border-outline-variant bg-surface-container-low p-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-4 w-24" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 border-b border-outline-variant/70 p-5 last:border-b-0">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-5 w-24" />
          <SkeletonBlock className="h-5 w-20" />
          <SkeletonBlock className="h-9 w-28 justify-self-end" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-outline-variant bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <SkeletonBlock className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-8 w-64" />
            <SkeletonBlock className="h-4 w-80 max-w-full" />
          </div>
          <SkeletonBlock className="h-11 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <ListSkeleton count={2} />
        </div>
        <ListSkeleton count={3} />
      </div>
    </div>
  );
}
