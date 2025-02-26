import {
  __VLG_IMPORT_PRIMITIVE_PROPERTY_DECORATOR__,
  SEPARATOR,
} from "../constants";
import { PrimitivePropertyMetadataType } from "../types";

export function PrimitiveProperty(
  primitivePropertyMetadata?: PrimitivePropertyMetadataType
) {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.defineProperty(
      target.constructor,
      `${__VLG_IMPORT_PRIMITIVE_PROPERTY_DECORATOR__}${SEPARATOR}${propertyKey.toString()}`,
      {
        value: primitivePropertyMetadata || {},
        enumerable: true,
        configurable: false,
        writable: false,
      }
    );
  };
}
