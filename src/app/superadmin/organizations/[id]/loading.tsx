export default function OrganizationDetailsLoading() {
  return (
    <div className="p-8 md:p-10 h-full flex flex-col bg-background min-h-screen text-foreground animate-pulse">
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-4">
          <div className="h-4 w-32 bg-muted rounded-md mb-4"></div>
          <div className="h-10 w-64 bg-muted rounded-xl mb-2"></div>
          <div className="h-4 w-80 bg-muted rounded-md"></div>
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-xl text-center shadow-sm w-32 h-16"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="space-y-6">
          <div className="p-6 border border-border bg-card rounded-2xl shadow-sm h-40"></div>
          <div className="p-6 border border-border bg-card rounded-2xl shadow-sm h-32"></div>
        </div>

        <div className="md:col-span-2">
          <div className="p-6 border border-border bg-card rounded-2xl shadow-sm h-full min-h-[400px]">
            <div className="h-6 w-48 bg-muted rounded-md mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 w-full bg-muted/50 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
