import type { H3Error, H3Event } from 'h3';

/**
 * Throw error as JSON response
 * @param event H3Event
 * @param error H3Error
 */
export function sendErrorServer(event: H3Event, error: Partial<H3Error>) {
  const message = error.message ? error.message : error.statusMessage ? error.statusMessage : 'Internal Server Error';
  const err: Partial<H3Error> = {
    name: error?.name ?? 'UnknownError',
    statusCode: error?.statusCode ?? 500,
    data: {
      ...(error.data as Record<string, any>),
      message,
    },
    unhandled: false,
    message,
  };

  return sendError(event, createError(err));
}
