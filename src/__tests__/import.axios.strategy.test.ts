import { Test } from "@nestjs/testing";
import { PrimitiveProperty } from "../decorators/primitive-property.decorator";
import { VlgImportService } from "../services";
import { ExcelReaderAxiosStrategy } from "../strategies/excel-reader.axios.strategy";
import { AxiosStrategyParam, VlgImportOptions } from "../types";
import { VlgImportModule } from "../vlg-import.module";
import { MockModule, ProcessorMockService } from "./__mocks__";

describe("ExcelReaderAxiosStrategy", () => {
  let importService: VlgImportService;
  let mockProcessor: ProcessorMockService;

  class Record {
    @PrimitiveProperty({ name: "Tên hành vi tích cực (Tiếng Việt)" })
    behavior?: string;

    @PrimitiveProperty({ name: "Giá trị cốt lõi" })
    coreValue?: string;
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        VlgImportModule.forRootAsync({
          useFactory(processor: ProcessorMockService): VlgImportOptions {
            return {
              strategy: new ExcelReaderAxiosStrategy(),
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

  it("onSave", async () => {
    const result = await importService.import<AxiosStrategyParam>({
      strategyParams: {
        sheet: "Hành vi tích cực",
        url: "https://vlu-gw.vinc6.dev/api/report/file-info/wbs-behaviors-1.xlsx",
      },
      outputClass: Record,
    });

    expect(mockProcessor?.result.length).toBe(38);
    expect(result).toBeTruthy();
  });

  it("onSuccess", async () => {
    const result = await importService.import<AxiosStrategyParam>({
      strategyParams: {
        sheet: "Hành vi tích cực",
        url: "https://vlu-gw.vinc6.dev/api/report/file-info/wbs-behaviors-1.xlsx",
      },
      outputClass: Record,
    });

    expect(mockProcessor?.onSuccessContext.originalData).not.toBeUndefined();
    expect(mockProcessor?.onSuccessContext.rows).not.toBeUndefined();
    expect(mockProcessor?.onSucessCall).toBeTruthy();
    expect(result).toBeTruthy();
  });

  it("onError", async () => {
    const result = await importService.import<AxiosStrategyParam>({
      strategyParams: {
        sheet: "ABC",
        url: "https://vlu-gw.vinc6.dev/api/report/file-info/wbs-behaviors-1.xlsx",
      },
      outputClass: Record,
    });

    expect(mockProcessor?.onErrorCall).toBeTruthy();
    expect(result).toBeFalsy();
  });
});
