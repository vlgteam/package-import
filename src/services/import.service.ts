import { Inject, Injectable, Logger } from "@nestjs/common";
import { __EXCEL_READER__, __PROCESSOR_SERVICE__ } from "../constants";
import { ExcelReaderInterface } from "../strategies/excel-reader.interface";
import { AbstractStrategyParam, ImportException } from "../types";
import { ImportServiceParam } from "../types/import.param";
import { VlgImportMapper } from "./mapper.service";
import { ProccessorServiceInterface } from "./processor.service";

@Injectable()
export class VlgImportService {
  readonly logger = new Logger(`VlgImportService`);

  constructor(
    @Inject(VlgImportMapper)
    private readonly _vlgImportMapper: VlgImportMapper,
    @Inject(__EXCEL_READER__)
    private readonly _excelReader: ExcelReaderInterface,
    @Inject(__PROCESSOR_SERVICE__)
    private readonly _processorService: ProccessorServiceInterface
  ) {}

  private async __errorHandler(
    error: any,
    prefixMessage: string,
    context: Record<string, any>
  ) {
    if (error instanceof ImportException) {
      this.logger.error(`${prefixMessage}: `, JSON.stringify(error));
      await this._processorService.error(error, context);
    } else {
      this.logger.error(`${prefixMessage}: Internal Server Error`, error);
      const importError = new ImportException([
        { message: error?.message || `Internal Server Error` },
      ]);
      await this._processorService.error(importError, context);
    }
  }

  import<T extends AbstractStrategyParam>(
    params: ImportServiceParam<T>,
    context: Record<string, any> = {}
  ) {
    return new Promise(async (resolve) => {
      try {
        const readableStream = await this._excelReader.read(
          params.strategyParams
        );

        let isError = false;
        readableStream.on("data", async (chunk) => {
          let entities;
          try {
            entities = chunk.map((item: any) =>
              this._vlgImportMapper.parse(item, params.outputClass)
            );

            const result = await this._processorService.save(entities, {
              ...context,
              rows: chunk,
            });
            await this._processorService.success(result, {
              ...context,
              originalData: entities,
              rows: chunk,
            });
          } catch (error: any) {
            isError = true;
            await this.__errorHandler(
              error,
              " ReadableStream (readable event): ",
              { ...context, rows: chunk }
            );
          }
        });

        readableStream.on("end", () => {
          return resolve(!isError);
        });

        readableStream.on("error", async (error) => {
          await this.__errorHandler(
            error,
            "ReadableStream (error event): ",
            context
          );
          resolve(false);
        });
      } catch (error: any) {
        await this.__errorHandler(error, "import(): ", context);
        resolve(false);
      }
    });
  }
}
