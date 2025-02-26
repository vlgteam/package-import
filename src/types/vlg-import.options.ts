import { ProccessorServiceInterface } from "../services";
import { ExcelReaderInterface } from "../strategies/excel-reader.interface";

export interface VlgImportOptions {
  strategy: ExcelReaderInterface;
  processor: ProccessorServiceInterface;
}
