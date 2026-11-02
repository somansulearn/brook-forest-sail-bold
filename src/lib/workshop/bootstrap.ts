import { getDb, isBrowserDb } from "./db";
import { DEFAULT_SETTINGS, drawDefaultLogo } from "./defaults";
import { seedIfEmpty } from "./seed";

let bootPromise: Promise<void> | null = null;

export function bootstrapWorkshop(): Promise<void> {
  if (!isBrowserDb()) return Promise.resolve();
  if (!bootPromise) {
    bootPromise = (async () => {
      await getDb().open();
      await seedIfEmpty();
      const settings = await getDb().settings.get(1);
      if (settings && !settings.logoDataUrl) {
        const logo = drawDefaultLogo();
        if (logo) await getDb().settings.update(1, { logoDataUrl: logo });
      }
      if (!(await getDb().settings.get(1))) {
        await getDb().settings.put({
          ...DEFAULT_SETTINGS,
          logoDataUrl: drawDefaultLogo(),
        });
      }
    })();
  }
  return bootPromise;
}
