export const handleRequest = (promise: Promise<any> | any) => {
  return promise
    .then((result: any) => {
      if (!result) {
        return [true, result];
      }
      return [undefined, result];
    })
    .catch((error: Error) => {
      return [error.message, undefined];
    });
};
