import "reflect-metadata";
import { __VLG_IMPORT_PROPERTY_DECORATOR__, SEPARATOR } from "../constants";
import { PropertyMetadataType } from "../types";

export function Property(propertyMetadata?: PropertyMetadataType) {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.defineProperty(
      target.constructor,
      `${__VLG_IMPORT_PROPERTY_DECORATOR__}${SEPARATOR}${propertyKey.toString()}`,
      {
        value: propertyMetadata || {},
        enumerable: true,
        configurable: false,
        writable: false,
      }
    );
  };
}
