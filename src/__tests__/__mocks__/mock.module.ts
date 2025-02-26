import { Module } from "@nestjs/common";
import { ProcessorMockService } from "./processor.mock";

@Module({
  imports: [],
  controllers: [],
  providers: [ProcessorMockService],
  exports: [ProcessorMockService],
})
export class MockModule {}
