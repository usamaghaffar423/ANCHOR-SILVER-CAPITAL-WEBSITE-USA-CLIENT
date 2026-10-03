/**
 * GHL API typed errors. Every failed call surfaces as GhlApiError so callers
 * can branch on `status` / `retryable` without parsing strings.
 */

export class GhlApiError extends Error {
  readonly status: number;
  readonly method: string;
  readonly path: string;
  readonly body: unknown;
  readonly retryable: boolean;

  constructor(init: {
    message: string;
    status: number;
    method: string;
    path: string;
    body?: unknown;
    retryable?: boolean;
    cause?: unknown;
  }) {
    super(init.message, { cause: init.cause });
    this.name = "GhlApiError";
    this.status = init.status;
    this.method = init.method;
    this.path = init.path;
    this.body = init.body;
    this.retryable = init.retryable ?? false;
  }
}

export class GhlAuthError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "GhlAuthError";
    this.cause = cause;
  }
}

export class GhlConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GhlConfigError";
  }
}

export class GhlSignatureError extends Error {
  readonly reason: string;

  constructor(reason: string) {
    super(`GHL webhook signature invalid: ${reason}`);
    this.name = "GhlSignatureError";
    this.reason = reason;
  }
}
