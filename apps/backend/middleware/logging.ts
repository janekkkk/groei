/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Context } from "hono";

// Define log entry interfaces
interface RequestLogEntry {
  userAgent: string;
  clientIP: string;
  timestamp: number;
}

interface ResponseLogEntry {
  status: number;
  duration: number;
  success: boolean;
}

interface ErrorLogEntry extends ResponseLogEntry {
  error: string;
  stack?: string;
}

// Enhanced logging middleware for production debugging
export const bedLoggingMiddleware = async (
  c: Context,
  next: () => Promise<void>,
) => {
  const start: number = Date.now();
  const method: string = c.req.method;
  const url: string = c.req.url;
  const userAgent: string = c.req.header("user-agent") || "unknown";
  const clientIP: string = c.req.header("x-forwarded-for") || "unknown";

  // Log incoming request
  console.log(`[${new Date().toISOString()}] ${method} ${url}`, {
    userAgent,
    clientIP,
    timestamp: start,
  } satisfies RequestLogEntry);

  try {
    await next();

    // Log successful response
    const end: number = Date.now();
    const status: number = c.res.status;
    console.log(
      `[${new Date().toISOString()}] ${method} ${url} - ${status} (${end - start}ms)`,
      {
        status,
        duration: end - start,
        success: true,
      } satisfies ResponseLogEntry,
    );
  } catch (error: unknown) {
    // Log error
    const end: number = Date.now();
    console.error(
      `[${new Date().toISOString()}] ${method} ${url} - ERROR (${end - start}ms)`,
      {
        status: 500,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        duration: end - start,
        success: false,
      } satisfies ErrorLogEntry,
    );
    throw error;
  }
};

// Database operation logger
export const logDatabaseOperation = (
  operation: string,
  table: string,
  data?: unknown,
  result?: unknown,
) => {
  console.log(`[DB] ${operation} on ${table}`, {
    operation,
    table,
    timestamp: new Date().toISOString(),
    data: data ? JSON.stringify(data) : undefined,
    result: result ? JSON.stringify(result) : undefined,
  });
};

// Critical error logger for production
export const logCriticalError = (
  operation: string,
  error: Error,
  context?: Record<string, unknown>,
) => {
  console.error(`[CRITICAL] ${operation} failed`, {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    level: "CRITICAL",
  });

  // In production, you might want to send this to an external monitoring service
  // like Sentry, LogRocket, or your own monitoring system
};

// Data integrity validator
export const validateDataIntegrity = async (bedId: string, db: unknown) => {
  try {
    // biome-ignore lint/suspicious/noExplicitAny: Drizzle requires any for db operations
    const bed = await (db as any).query.bedTable.findFirst({
      // biome-ignore lint/suspicious/noExplicitAny: Drizzle callback requires any types
      where: (bedTable: any, { eq }: any) => {
        return eq(bedTable.id, bedId);
      },
    });

    if (!bed) {
      logCriticalError(
        "Data Integrity Check",
        new Error(`Bed ${bedId} not found during integrity check`),
        { bedId },
      );
      return false;
    }

    // biome-ignore lint/suspicious/noExplicitAny: Drizzle requires any for db operations
    const gridItems = await (db as any).query.gridItemTable.findMany({
      // biome-ignore lint/suspicious/noExplicitAny: Drizzle callback requires any types
      where: (gridItemTable: any, { eq }: any) => {
        return eq(gridItemTable.bedId, bedId);
      },
    });

    console.log(`[INTEGRITY] Bed ${bedId} has ${gridItems.length} grid items`);
    return true;
  } catch (error) {
    logCriticalError(
      "Data Integrity Check",
      error instanceof Error ? error : new Error(String(error)),
      { bedId },
    );
    return false;
  }
};
