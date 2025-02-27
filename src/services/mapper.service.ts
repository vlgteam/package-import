import { Injectable } from "@nestjs/common";
import "reflect-metadata";
import {
  __VLG_IMPORT_PRIMITIVE_PROPERTY_DECORATOR__,
  __VLG_IMPORT_PROPERTY_DECORATOR__,
  SEPARATOR,
} from "../constants";
import { ClsType, ImportException, PropertyMetadataType } from "../types";
import { PrimitivePropertyMetadataType } from "../types/primitive-property.metadata.type";
import deepcopy = require("deepcopy");

@Injectable()
export class VlgImportMapper {
  private __transformProperty(
    data: Record<string, any>,
    metadata: PropertyMetadataType
  ) {
    return this.parse(data, metadata.type);
  }

  private _transformPrimitiveProperty(
    data: Record<string, any>,
    metadata: PrimitivePropertyMetadataType
  ) {
    if (
      metadata.type !== Date &&
      metadata.type !== Number &&
      metadata.type !== Boolean &&
      metadata.type != null
    ) {
      throw new ImportException([{ message: "Type is not allowed" }]);
    }

    if (data[metadata.name as string] == null) {
      return null;
    }

    if (metadata.type == null) {
      // Keep as default
      return deepcopy(data[metadata.name as string]);
    }

    const isArray = metadata.separator != null;
    if (metadata.type === Date) {
      return isArray
        ? data[metadata.name as string]
            .split(metadata.separator as string)
            .map((value: any) => new Date(value))
        : new Date(data[metadata.name as string]);
    } else if (metadata.type === Number) {
      return isArray
        ? data[metadata.name as string]
            .split(metadata.separator as string)
            .map((value: any) => Number(value))
        : Number(data[metadata.name as string]);
    } else if (metadata.type === Boolean) {
      return isArray
        ? data[metadata.name as string]
            .split(metadata.separator as string)
            .map(
              (value: any) =>
                value.toString().trim().toLowerCase() === "true" ||
                value.toString().trim() === "1"
            )
        : data[metadata.name as string].toString().trim().toLowerCase() ===
            "true" || data[metadata.name as string].toString().trim() === "1";
    } else {
    }
  }

  parse<T extends object>(data: Record<string, any>, cls: ClsType<T>): T {
    const instance = new cls();

    // Get marked properties
    const properties = Object.getOwnPropertyNames(cls).filter(
      (property) =>
        property.includes(__VLG_IMPORT_PROPERTY_DECORATOR__) ||
        property.includes(__VLG_IMPORT_PRIMITIVE_PROPERTY_DECORATOR__)
    );

    for (const property of properties) {
      const [propertyType, propertyInstance] = property.split(SEPARATOR);

      if (propertyType === __VLG_IMPORT_PRIMITIVE_PROPERTY_DECORATOR__) {
        const metadata: PrimitivePropertyMetadataType =
          cls[property as keyof typeof cls];
        instance[propertyInstance as keyof typeof instance] =
          this._transformPrimitiveProperty(data, metadata) as any;
      } else if (propertyType === __VLG_IMPORT_PROPERTY_DECORATOR__) {
        const metadata: PropertyMetadataType =
          cls[property as keyof typeof cls];
        instance[propertyInstance as keyof typeof instance] =
          this.__transformProperty(data, metadata) as any;
      }
    }

    return instance;
  }
}
