import { Property } from "../decorators";
import { PrimitiveProperty } from "../decorators/primitive-property.decorator";
import { VlgImportMapper } from "../services";

describe("MapperService", () => {
  let mapper = new VlgImportMapper();

  describe("PrimitiveType", () => {
    it("Boolean", async () => {
      const data = {
        "test-1": "True",
        "test-2": "true",
        "test-3": "1",
        "test-4": 1,
        "test-5": "random value",
      };

      class A {
        @PrimitiveProperty({ name: "test-1", type: Boolean })
        test1?: Boolean;

        @PrimitiveProperty({ name: "test-2", type: Boolean })
        test2?: Boolean;

        @PrimitiveProperty({ name: "test-3", type: Boolean })
        test3?: Boolean;

        @PrimitiveProperty({ name: "test-4", type: Boolean })
        test4?: Boolean;

        @PrimitiveProperty({ name: "test-5", type: Boolean })
        test5?: Boolean;
      }

      const result = mapper.parse(data, A);

      expect(result.test1).toBe(true);
      expect(result.test2).toBe(true);
      expect(result.test3).toBe(true);
      expect(result.test4).toBe(true);
      expect(result.test5).toBe(false);
    });

    it("Number", async () => {
      const data = {
        "test-1": "1",
        "test-2": "-1.2",
        "test-3": 1.5,
        "test-4": { a: 1, b: 2 },
      };

      class A {
        @PrimitiveProperty({ name: "test-1", type: Number })
        test1?: Number;

        @PrimitiveProperty({ name: "test-2", type: Number })
        test2?: Number;

        @PrimitiveProperty({ name: "test-3", type: Number })
        test3?: Number;

        @PrimitiveProperty({ name: "test-4", type: Number })
        test4?: Number;
      }

      const result = mapper.parse(data, A);

      expect(result.test1).toBe(1);
      expect(result.test2).toBe(-1.2);
      expect(result.test3).toBe(1.5);
      expect(Number.isNaN(result.test4)).toBe(true);
    });

    it("Date", async () => {
      const data = {
        "test-1": "2024/05/05",
      };

      class A {
        @PrimitiveProperty({ name: "test-1", type: Date })
        test1?: Date;
      }

      const result = mapper.parse(data, A);
      expect(result.test1?.getTime()).toBe(new Date("2024/05/05").getTime());
    });

    it("No type", async () => {
      const data = {
        "test-1": { a: 1, b: 2 },
      };

      class A {
        @PrimitiveProperty({ name: "test-1" })
        test1?: any;
      }

      // Copy
      const result = mapper.parse(data, A);
      expect(result.test1).toEqual({ a: 1, b: 2 });

      // Deep copy
      data["test-1"].a = 1.5;
      expect(result.test1.a).toEqual(1);
    });

    it("Name not found", async () => {
      const data = {
        "test-1": "abc",
      };

      class A {
        @PrimitiveProperty({ name: "test-1234" })
        test1?: any;
      }

      // Copy
      const result = mapper.parse(data, A);
      expect(result.test1).toEqual(null);
    });

    it("Array boolean", async () => {
      const data = {
        "test-1": "true, 1, false",
      };

      class A {
        @PrimitiveProperty({ name: "test-1", type: Boolean, separator: "," })
        test1?: boolean[];
      }

      // Copy
      const result = mapper.parse(data, A);
      expect(result.test1).toEqual([true, true, false]);
    });

    it("Array boolean wrong separator", async () => {
      const data = {
        "test-1": "true, 1, false",
      };

      class A {
        @PrimitiveProperty({ name: "test-1", type: Boolean, separator: "." })
        test1?: boolean[];
      }

      // Copy
      const result = mapper.parse(data, A);
      expect(result.test1).toEqual([false]); // split ==> "true, 1, false" !== "true" && "true, 1, false" !== "1"
    });

    it("Array number", async () => {
      const data = {
        "test-1": "1.2; 5; abc",
      };

      class A {
        @PrimitiveProperty({ name: "test-1", type: Number, separator: ";" })
        test1?: number[];
      }

      // Copy
      const result = mapper.parse(data, A);
      expect(result.test1?.[0]).toEqual(1.2);
      expect(result.test1?.[1]).toEqual(5);
      expect(Number.isNaN(result.test1?.[2])).toBeTruthy();
    });

    it("Array number wrong separator", async () => {
      const data = {
        "test-1": "1.2; 5; abc",
      };

      class A {
        @PrimitiveProperty({ name: "test-1", type: Number, separator: "-" })
        test1?: number[];
      }

      // Copy
      const result = mapper.parse(data, A);
      expect(Number.isNaN(result.test1?.[0])).toBeTruthy();
    });

    it("Array date", async () => {
      const data = {
        "test-1": "2025/01/01, 2026/01/01",
      };

      class A {
        @PrimitiveProperty({ name: "test-1", type: Date, separator: "," })
        test1?: Date[];
      }

      // Copy
      const result = mapper.parse(data, A);
      expect(result.test1?.[0].getTime()).toBe(
        new Date("2025/01/01").getTime()
      );
      expect(result.test1?.[1].getTime()).toBe(
        new Date("2026/01/01").getTime()
      );
    });
  });

  describe("Property", () => {
    it("Nested type", async () => {
      const data = {
        "test-1": "True",
      };

      class B {
        @PrimitiveProperty({ type: Boolean, name: "test-1" })
        test1?: boolean;
      }

      class A {
        @Property({ type: B })
        b?: B;
      }

      const result = mapper.parse(data, A);
      expect(result.b).not.toBeNull();
      expect(result.b?.test1).toBe(true);
    });
  });
});
