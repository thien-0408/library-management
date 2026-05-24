import Header from '@/components/header';
import { PageSkeleton } from '@/components/skeleton_loader';

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <Header />
      <main className="app-shell-main app-shell-content page-shell mx-auto w-full max-w-7xl px-6 md:px-8 xl:px-10">
        <PageSkeleton />
      </main>
    </div>
  );
}
