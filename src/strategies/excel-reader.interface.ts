import { Readable } from "stream";
import { AbstractStrategyParam } from "../types";

export abstract class ExcelReaderInterface {
  abstract read(config: AbstractStrategyParam): Readable | Promise<Readable>;
}
