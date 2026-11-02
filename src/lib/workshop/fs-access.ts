const HANDLE_KEY = "samriddhi-backup-dir";

type DirHandle = FileSystemDirectoryHandle & {
  queryPermission?: (desc: { mode: "readwrite" }) => Promise<PermissionState>;
  requestPermission?: (desc: { mode: "readwrite" }) => Promise<PermissionState>;
};

type PickerWindow = Window & {
  showDirectoryPicker?: (opts?: { mode?: "readwrite" }) => Promise<FileSystemDirectoryHandle>;
};

function supportsFs(): boolean {
  return typeof window !== "undefined" && "showDirectoryPicker" in window;
}

export async function pickBackupFolder(): Promise<string | null> {
  if (!supportsFs()) return null;
  const handle = await (window as PickerWindow).showDirectoryPicker?.({ mode: "readwrite" });
  if (!handle) return null;
  await idbPutHandle(handle);
  return handle.name;
}

export async function writeToBackupFolder(relativePath: string, blob: Blob): Promise<boolean> {
  try {
    const handle = (await idbGetHandle()) as DirHandle | null;
    if (!handle) return false;
    const perm = handle.queryPermission
      ? await handle.queryPermission({ mode: "readwrite" })
      : "granted";
    if (perm !== "granted") {
      const req = handle.requestPermission
        ? await handle.requestPermission({ mode: "readwrite" })
        : "denied";
      if (req !== "granted") return false;
    }
    const parts = relativePath.split("/").filter(Boolean);
    let dir: FileSystemDirectoryHandle = handle;
    for (const seg of parts.slice(0, -1)) {
      dir = await dir.getDirectoryHandle(seg, { create: true });
    }
    const fileName = parts[parts.length - 1];
    if (!fileName) return false;
    const file = await dir.getFileHandle(fileName, { create: true });
    const w = await file.createWritable();
    await w.write(blob);
    await w.close();
    return true;
  } catch {
    return false;
  }
}

function idbOpen(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("samriddhi-fs-handles", 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("handles");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPutHandle(handle: DirHandle): Promise<void> {
  const db = await idbOpen();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("handles", "readwrite");
    tx.objectStore("handles").put(handle, HANDLE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGetHandle(): Promise<DirHandle | null> {
  try {
    const db = await idbOpen();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("handles", "readonly");
      const req = tx.objectStore("handles").get(HANDLE_KEY);
      req.onsuccess = () => resolve((req.result as DirHandle) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}
