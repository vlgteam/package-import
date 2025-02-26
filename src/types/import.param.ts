import { AbstractStrategyParam } from "./buffer.strategy.param";
import { ClsType } from "./cls.type";

export interface ImportServiceParam<T extends AbstractStrategyParam> {
  strategyParams: T;
  outputClass: ClsType<any>;
}
