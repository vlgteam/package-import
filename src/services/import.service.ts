import { Inject, Injectable } from "@nestjs/common";
import {
  __EXCEL_READER__,
  __PROCESSOR_SERVICE__,
} from "../constants";
import { ExcelReaderInterface } from "../strategies/excel-reader.interface";
import { AbstractStrategyParam } from "../types";
import { ImportServiceParam } from "../types/import.param";
import { VlgImportMapper } from "./mapper.service";
import { ProccessorServiceInterface } from "./processor.service";

@Injectable()
export class VlgImportService {
  constructor(
    @Inject(VlgImportMapper)
    private readonly _vlgImportMapper: VlgImportMapper,
    @Inject(__EXCEL_READER__)
    private readonly _excelReader: ExcelReaderInterface,
    @Inject(__PROCESSOR_SERVICE__)
    private readonly _processorService: ProccessorServiceInterface
  ) {}

  import<T extends AbstractStrategyParam>(params: ImportServiceParam<T>) {
    return new Promise(async (resolve, reject) => {
      try {
        const readableStream = await this._excelReader.read(
          params.strategyParams
        );

        readableStream.on("readable", async () => {
          let chunk, result;
          try {
            while (null !== (chunk = readableStream.read())) {
              result = chunk.map((item: any) =>
                this._vlgImportMapper.parse(item, params.outputClass)
              );

              await this._processorService.save(result);
              await this._processorService.success(result);
            }
          } catch (error) {
            await this._processorService.error(result || chunk, error);
          }
        });

        readableStream.on("end", () => resolve(true));

        readableStream.on("error", async (error) => {
          await this._processorService.error(null, error);
          reject(false);
        });
      } catch (error) {
        await this._processorService.error(null, error);
        reject(false);
      }
    });
  }
}
