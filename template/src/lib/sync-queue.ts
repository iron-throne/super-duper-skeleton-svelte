import type { IAPIQueuePayload } from '$lib/types';
import { openDB } from "idb";

const DB_NAME = 'offline-db';
const STORE_NAME = 'request-queue';

async function getDB() {
	return openDB(DB_NAME, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, {
					keyPath: 'id',
					autoIncrement: true
				});
			}
		}
	});
}

export async function addToQueue(request: IAPIQueuePayload) {
	console.log("[SYNC] Adding request to queue:", request);
	const db = await getDB();
	if (!db) return;
	const modifiedRequest = await serializeFormData(request);
	await db.add(STORE_NAME, {
		...modifiedRequest,
		retries: 0,
		createdAt: Date.now()
	});

	await triggerSync();
}

async function triggerSync() {
	if (!('serviceWorker' in navigator)) return;
	const sendProcessQueueMessage = async () => {
		// navigator.serviceWorker.ready ensures the worker is active
		const registration = await navigator.serviceWorker.ready;
		const worker = registration.active;

		if (worker) {
			worker.postMessage({ type: 'PROCESS_QUEUE' });
		} else {
			console.error('[SYNC] Service Worker active state not found');
		}
	};

	if ('SyncManager' in window) {
		const sw = await navigator.serviceWorker.ready;
		try {
			await (sw as ServiceWorkerRegistration & {
				sync: { register(tag: string): Promise<void> };
			}).sync.register('sync-queue');
			console.log('[SYNC] Background sync registered');
		} catch (error) {
			console.warn('[SYNC] Background sync registration failed', error);
		}
	}

	if (navigator.onLine) {
		await sendProcessQueueMessage();
	} else {
		window.addEventListener('online', sendProcessQueueMessage, { once: true });
	}
}

function serializeFormData(request: IAPIQueuePayload): IAPIQueuePayload {
	if (request.data instanceof FormData) {
		const formDataObj: Record<string, any> = {};
		for (const [key, value] of request.data.entries()) {
			formDataObj[key] = value instanceof File ? {
				__file: true,
				name: value.name,
				type: value.type,
				size: value.size,
				lastModified: value.lastModified,
				data: value, // store the File directly if IndexedDB supports Blob
			} : value;
		}
		return { ...request, data: formDataObj, isFormData: true };

	}
	return request;
}
