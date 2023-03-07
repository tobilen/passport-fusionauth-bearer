import { VerifyOptions } from "jsonwebtoken";
import { Request } from "express";
import { Strategy } from "passport";

export class FusionauthBearerStrategy extends Strategy {
  constructor(opt: StrategyOptions, verify: VerifyCallback);

  constructor(opt: StrategyOptions, verify: VerifyCallbackWithRequest);

  name: string;
}

export interface StrategyOptions {
  url: string;
  loggingLevel?: "debug" | "info" | "warn" | "error";
  customLogger?: typeof console;
  issuer?: string | undefined;
  audience?: string | undefined;
  algorithms?: string[] | undefined;
  ignoreExpiration?: boolean | undefined;
  passReqToCallback?: boolean | undefined;
  jwtFromRequest?: JwtFromRequestFunction;
  jsonWebTokenOptions?: VerifyOptions | undefined;
}

export interface VerifyCallback {
  (payload: unknown, done: VerifiedCallback): void;
}

export interface VerifyCallbackWithRequest {
  (req: Request, payload: unknown, done: VerifiedCallback): void;
}

export interface VerifiedCallback {
  (error: unknown, user?: unknown, info?: unknown): void;
}

export interface JwtFromRequestFunction {
  (req: Request): string | null;
}

export default FusionauthBearerStrategy;
