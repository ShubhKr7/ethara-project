export default function SuperAdminProjectBoardLoading() {
  return (
    <div className="p-8 md:p-10 h-full flex flex-col bg-background min-h-screen animate-pulse">
      <div className="mb-6">
        <div className="h-4 w-32 bg-muted rounded-md"></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6 shrink-0">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="h-10 w-64 bg-muted rounded-xl"></div>
          <div className="h-4 w-96 bg-muted rounded-md"></div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-background"></div>
            ))}
          </div>
          <div className="h-8 w-20 bg-muted rounded-2xl"></div>
          <div className="h-8 w-32 bg-muted rounded-2xl"></div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 pb-4 overflow-hidden">
        {[1, 2, 3].map((col) => (
          <div key={col} className="flex flex-col rounded-[2rem] border border-border bg-muted/10 min-w-[320px] max-w-[320px] p-6">
            <div className="h-6 w-32 bg-muted rounded-md mb-6"></div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 w-full bg-card rounded-2xl border border-border"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
