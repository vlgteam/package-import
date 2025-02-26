import { ProccessorServiceInterface } from "../../services";

export class ProcessorMockService implements ProccessorServiceInterface {
  result: Array<Record<string, any>> = [];

  save(data: Array<Record<string, any>>): void | Promise<void> {
    this.result = data;
  }
  success(data: Array<Record<string, any>>): void | Promise<void> {}
  error(data: Array<Record<string, any>>, error: any): void | Promise<void> {}
}
