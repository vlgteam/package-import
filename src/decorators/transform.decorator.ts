import { __VLG_TRANSFORM_DECORATOR__, SEPARATOR } from "../constants";
import { TransformMetadataType } from "../types";

export function PropertyTransform(
  propertyTransformMetadata?: TransformMetadataType
) {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.defineProperty(
      target.constructor,
      `${__VLG_TRANSFORM_DECORATOR__}${SEPARATOR}${propertyKey.toString()}`,
      {
        value: propertyTransformMetadata || {},
        enumerable: true,
        configurable: false,
        writable: false,
      }
    );
  };
}
