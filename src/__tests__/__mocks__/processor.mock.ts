import { ProccessorServiceInterface } from "../../services";

export class ProcessorMockService implements ProccessorServiceInterface {
  result: Array<Record<string, any>> = [];
  onSucessCall = false;
  onErrorCall = false;

  onSaveContext: Record<string, any> = {};
  onSuccessContext: Record<string, any> = {};
  onErrorContext: Record<string, any> = {};

  save(
    data: Array<Record<string, any>>,
    context: Record<string, any>
  ): void | Promise<void> {
    this.result = [...this.result, ...data];
    this.onSaveContext = context;
  }

  success(
    data: Array<Record<string, any>>,
    context: Record<string, any>
  ): void | Promise<void> {
    this.onSucessCall = true;
    this.onSuccessContext = context;
  }

  error(error: any, context: Record<string, any>): void | Promise<void> {
    this.onErrorCall = true;
    this.onErrorContext = context;
  }
}
