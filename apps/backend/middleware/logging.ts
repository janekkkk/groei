/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from "hono";

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
  success: false;
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
  data?: any,
  result?: any,
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
  context?: Record<string, any>,
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
export const validateDataIntegrity = async (bedId: string, db: any) => {
  try {
    const bed = await db.query.bedTable.findFirst({
      where: (bedTable: any, { eq }: any) => eq(bedTable.id, bedId),
    });

    if (!bed) {
      logCriticalError(
        "Data Integrity Check",
        new Error(`Bed ${bedId} not found during integrity check`),
        { bedId },
      );
      return false;
    }

    const gridItems = await db.query.gridItemTable.findMany({
      where: (gridItemTable: any, { eq }: any) =>
        eq(gridItemTable.bedId, bedId),
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
