import axios from "axios";
import * as ExcelJS from "exceljs";
import { Readable } from "stream";
import { AxiosStrategyParam, ImportException } from "../types";
import { ExcelReaderInterface } from "./excel-reader.interface";

export class ExcelReaderAxiosStrategy extends ExcelReaderInterface {
  private __endStream(stream: Readable) {
    stream.push(null);
  }

  private __pushStream(stream: Readable, rows: Array<Record<string, any>>) {
    stream.push(rows);
    rows.length = 0;
  }

  private __isNotEmptyRow(row: any) {
    if (row == null || row.values == null) {
      return false;
    }

    return row.values.some(
      (cell: any) => cell !== null && cell !== undefined && cell !== ""
    );
  }

  private async readStream(
    config: AxiosStrategyParam,
    stream: Readable,
    workbookReader: ExcelJS.stream.xlsx.WorkbookReader
  ) {
    const bulkSize = 16;
    const rows = [];
    const headers: string[] = [];

    let isSheetFound = false;
    let rowCursorIndex = 1;

    for await (const worksheet of workbookReader) {
      const sheetName = (worksheet as any).name;
      if (sheetName !== config.sheet) {
        continue;
      } else {
        isSheetFound = true;
      }

      for await (const row of worksheet) {
        if (rowCursorIndex === 1) {
          row.eachCell((cell: any) => headers.push(cell.text));
          rowCursorIndex = rowCursorIndex + 1;
          continue;
        }

        if (this.__isNotEmptyRow(row)) {
          const record: Record<string, any> = {
            row: row.number,
          };
          row.eachCell((cell: any, colNumber: number) => {
            record[headers[colNumber - 1]] = cell.text;
          });

          rows.push(record);
        } else {
          // Empty row ==> break
          break;
        }

        if (rows.length >= bulkSize) {
          this.__pushStream(stream, rows);
        }

        rowCursorIndex = rowCursorIndex + 1;
      }

      if (rows.length > 0) {
        this.__pushStream(stream, rows);
      }

      if (isSheetFound) {
        break;
      }
    }

    if (!isSheetFound) {
      stream.emit(
        "error",
        new ImportException([{ message: `Sheet ${config.sheet} not found` }])
      );
    }

    if (rows.length > 0) {
      this.__pushStream(stream, rows);
    }

    this.__endStream(stream);
  }

  async read(config: AxiosStrategyParam): Promise<Readable> {
    try {
      const response = await axios({
        method: "get",
        url: config.url,
        responseType: "stream",
      });

      // Create stream
      const stream = new Readable({
        objectMode: true,
        read: () => {
          this.readStream(config, stream, workbookReader);
        },
      });
      // Create reader
      const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(
        response.data,
        {}
      );

      return stream;
    } catch (error) {
      throw error;
    }
  }
}
