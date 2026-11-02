//#region node_modules/.nitro/vite/services/ssr/assets/fs-access-Cws59sC1.js
var HANDLE_KEY = "samriddhi-backup-dir";
function supportsFs() {
	return typeof window !== "undefined" && "showDirectoryPicker" in window;
}
async function pickBackupFolder() {
	if (!supportsFs()) return null;
	const handle = await window.showDirectoryPicker?.({ mode: "readwrite" });
	if (!handle) return null;
	await idbPutHandle(handle);
	return handle.name;
}
async function writeToBackupFolder(relativePath, blob) {
	try {
		const handle = await idbGetHandle();
		if (!handle) return false;
		if ((handle.queryPermission ? await handle.queryPermission({ mode: "readwrite" }) : "granted") !== "granted") {
			if ((handle.requestPermission ? await handle.requestPermission({ mode: "readwrite" }) : "denied") !== "granted") return false;
		}
		const parts = relativePath.split("/").filter(Boolean);
		let dir = handle;
		for (const seg of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(seg, { create: true });
		const fileName = parts[parts.length - 1];
		if (!fileName) return false;
		const w = await (await dir.getFileHandle(fileName, { create: true })).createWritable();
		await w.write(blob);
		await w.close();
		return true;
	} catch {
		return false;
	}
}
function idbOpen() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open("samriddhi-fs-handles", 1);
		req.onupgradeneeded = () => {
			req.result.createObjectStore("handles");
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function idbPutHandle(handle) {
	const db = await idbOpen();
	await new Promise((resolve, reject) => {
		const tx = db.transaction("handles", "readwrite");
		tx.objectStore("handles").put(handle, HANDLE_KEY);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}
async function idbGetHandle() {
	try {
		const db = await idbOpen();
		return await new Promise((resolve, reject) => {
			const req = db.transaction("handles", "readonly").objectStore("handles").get(HANDLE_KEY);
			req.onsuccess = () => resolve(req.result ?? null);
			req.onerror = () => reject(req.error);
		});
	} catch {
		return null;
	}
}
//#endregion
export { writeToBackupFolder as n, pickBackupFolder as t };
