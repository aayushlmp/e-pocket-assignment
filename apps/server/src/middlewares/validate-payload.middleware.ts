import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate, ValidatorOptions } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateReqPayload<T extends object>(
  targetClass: ClassConstructor<T>
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const instance = plainToInstance(targetClass, req.body);
    // Configure options based on the HTTP method
    const validatorOptions: ValidatorOptions =
      req.method === "PATCH" ? { skipMissingProperties: true } : {};
    const errors = await validate(instance, validatorOptions);

    if (errors.length > 0) {
      res.status(400).json({
        message: "Validation Error: Bad Request",
        errors: errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
      return;
    }

    // Replace req.body with the class instance
    req.body = instance;
    next();
  };
}
