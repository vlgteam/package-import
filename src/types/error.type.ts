interface ErrorLine {
  row?: number;
  data?: Record<string, any>;
  message: string;
}

export class ImportException extends Error {
  constructor(readonly __payload: ErrorLine[]) {
    super();
  }

  get payload() {
    return this.__payload;
  }
}
