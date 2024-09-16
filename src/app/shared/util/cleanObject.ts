export function cleanParams(params: { [param: string]: any }): { [param: string]: any } {
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) {
        delete params[key]; // Remove keys with undefined values
      }
    });
    return params;
  }