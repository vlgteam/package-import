export abstract class ProccessorServiceInterface {
  abstract save(data: Array<Record<string, any>>): void | Promise<void>;

  abstract success(data: Array<Record<string, any>>): void | Promise<void>;

  abstract error(
    data: Array<Record<string, any>> | null,
    error: any
  ): void | Promise<void>;
}
