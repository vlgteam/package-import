import { ImportException } from "../types";

export abstract class ProccessorServiceInterface {
  abstract save(
    data: Array<Record<string, any>>,
    context: Record<string, any>
  ): any | Promise<any>;

  abstract success(
    data: Array<Record<string, any>>,
    context: Record<string, any>
  ): void | Promise<void>;

  abstract error(
    error: ImportException,
    context: Record<string, any>
  ): void | Promise<void>;
}
