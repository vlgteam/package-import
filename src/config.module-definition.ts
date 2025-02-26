import { ConfigurableModuleBuilder } from "@nestjs/common";
import { VlgImportModule } from "./vlg-import.module";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<VlgImportModule>()
    .setClassMethodName("forRoot")
    .build();

