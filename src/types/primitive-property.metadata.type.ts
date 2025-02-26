import { Type } from "@nestjs/common";

export interface PrimitivePropertyMetadataType {
  name: string; // Column name of table
  type?: Type<Boolean | Date | Number>; // Type
  separator?: string; // Separator not null ==> array
}
