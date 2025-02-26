export interface AbstractStrategyParam {}

export interface BufferFileStrategyParam extends AbstractStrategyParam {
  sheet: string;
  buffer: Buffer;
}
