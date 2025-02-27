import { AbstractStrategyParam } from "./buffer.strategy.param";

export interface AxiosStrategyParam extends AbstractStrategyParam {
  sheet: string;
  url: string;
}
