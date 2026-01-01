import { nanoid } from "nanoid";
import type { Request, Response, NextFunction } from "express";

export class RequestIdMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const existing = req.headers["x-request-id"];
    const requestId = typeof existing === "string" && existing.length > 0 ? existing : nanoid();
    (req as any).requestId = requestId;
    res.setHeader("x-request-id", requestId);
    next();
  }
}
