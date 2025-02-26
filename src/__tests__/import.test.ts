import { Test } from "@nestjs/testing";
import * as fs from "fs";
import { PrimitiveProperty } from "../decorators/primitive-property.decorator";
import { VlgImportService } from "../services";
import { ExcelReaderBufferStrategy } from "../strategies";
import { BufferFileStrategyParam, VlgImportOptions } from "../types";
import { VlgImportModule } from "../vlg-import.module";
import { MockModule, ProcessorMockService } from "./__mocks__";

describe("VlgImportService", () => {
  let importService: VlgImportService;
  let mockProcessor: ProcessorMockService;
  let buffer = Buffer.from(fs.readFileSync(__dirname + "/__dumps__/test.xlsm"));

  class Record {
    @PrimitiveProperty({ name: "Name" })
    name?: string;

    @PrimitiveProperty({ name: "project_progress_id", type: Number })
    projectProgressId?: number;
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        VlgImportModule.forRootAsync({
          useFactory(processor: ProcessorMockService): VlgImportOptions {
            return {
              strategy: new ExcelReaderBufferStrategy(),
              processor,
            };
          },
          imports: [MockModule],
          inject: [ProcessorMockService],
        }),
      ],
    }).compile();

    importService = moduleRef.get(VlgImportService);
    mockProcessor = moduleRef.get(ProcessorMockService);
  });

  it("should be defined", async () => {
    await importService.import<BufferFileStrategyParam>({
      strategyParams: {
        sheet: "TEST",
        buffer,
      },
      outputClass: Record,
    });

    expect(mockProcessor?.result.length).toBe(1);
    expect(mockProcessor?.result[0].name).toBe("name test");
    expect(mockProcessor?.result[0].projectProgressId).toBe(12);
  });
});
