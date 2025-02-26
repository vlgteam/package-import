import { Module } from "@nestjs/common";
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from "./config.module-definition";
import { __EXCEL_READER__, __PROCESSOR_SERVICE__ } from "./constants";
import { VlgImportMapper, VlgImportService } from "./services";
import { VlgImportOptions } from "./types";

@Module({
  providers: [
    VlgImportMapper,
    VlgImportService,
    {
      provide: __EXCEL_READER__,
      useFactory: (option: VlgImportOptions) => option.strategy,
      inject: [MODULE_OPTIONS_TOKEN],
    },
    {
      provide: __PROCESSOR_SERVICE__,
      useFactory: (option: VlgImportOptions) => option.processor,
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
})
export class VlgImportModule extends ConfigurableModuleClass {}

