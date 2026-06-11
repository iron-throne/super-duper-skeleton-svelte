// ── Request payloads ──────────────────────────────────────────────────────────

export interface UpdateUserPayload {
	name?: string;
	email?: string;
}

// ── Response shapes ───────────────────────────────────────────────────────────

export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	avatar?: string;
	createdAt: string;
	updatedAt: string;
}
