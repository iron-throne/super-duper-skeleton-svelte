// SvelteKit client hooks - run in the browser
// Handle client-side errors and navigation events

import type { HandleClientError } from '@sveltejs/kit';
/**
 * Global client-side error handler
 * Catches unhandled errors in load functions and components
 */
export const handleError: HandleClientError = ({ error, event }) => {
  // In production, send to error tracking
  console.error('Client error:', error, 'URL:', event.url.pathname);

  return {
    message: 'Something went wrong. Please refresh and try again.',
    code: 'CLIENT_HOOK_ERROR'
  };
};
