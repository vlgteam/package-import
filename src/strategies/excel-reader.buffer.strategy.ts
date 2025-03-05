import * as ExcelJS from "exceljs";
import { Readable } from "stream";
import { BufferFileStrategyParam, ImportException } from "../types";
import { ExcelReaderInterface } from "./excel-reader.interface";

export class ExcelReaderBufferStrategy extends ExcelReaderInterface {
  async read(config: BufferFileStrategyParam) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(config.buffer);

    const sheet = workbook.worksheets.find(
      (sheet) => sheet.name === config.sheet
    );

    if (sheet == null) {
      throw new ImportException([
        { message: `Sheet ${config.sheet} not found` },
      ]);
    }

    let rowCursorIndex = 2;
    let eof = false;
    const headers: string[] = [];

    sheet.getRow(1).eachCell((cell: any) => {
      headers.push(cell.text.toString().trim());
    });

    return new Readable({
      objectMode: true,
      read(size: number) {
        if (eof) {
          this.push(null);
          return;
        }

        if (size <= 0) {
          this.emit(
            "error",
            new ImportException([{ message: "Size must be greater than 0" }])
          );
        }

        const rows = (sheet.getRows(rowCursorIndex, size) || []).filter(
          (row: any) =>
            row.values.some(
              (cell: any) => cell !== null && cell !== undefined && cell !== ""
            )
        );

        if (rows == null || rows.length < size) {
          eof = true;
        }
        const result: Array<Record<string, any>> = [];
        for (const row of rows || []) {
          const record: Record<string, any> = {
            row: row.number,
          };

          row.eachCell((cell: any, colNumber: number) => {
            record[headers[colNumber - 1]] = cell.text;
          });

          result.push(record);
        }

        this.push(result);
        rowCursorIndex = rowCursorIndex + size;
      },
    });
  }
}
