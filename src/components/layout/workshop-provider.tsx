import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { bootstrapWorkshop } from "@/lib/workshop/bootstrap";

type Ctx = { ready: boolean; error: string | null };

const WorkshopCtx = createContext<Ctx>({ ready: false, error: null });

if (typeof indexedDB !== "undefined") {
  void bootstrapWorkshop();
}

export function WorkshopProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    bootstrapWorkshop()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not open workshop data.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-semibold">Workshop data could not open</h1>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <WorkshopCtx.Provider value={{ ready, error }}>
      {children}
    </WorkshopCtx.Provider>
  );
}

export function useWorkshopReady() {
  return useContext(WorkshopCtx);
}
