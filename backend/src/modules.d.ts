declare module 'config' {
  export interface MyConfigInterface {
    host: string;
    port: number;

    redis: {
      host: string;
      port: number;
    };
  }

  // @ts-ignore
  export default {} as MyConfigInterface;
}

declare function MyFunction(sid?: string): string;
declare module 'aguid' {
  export = MyFunction;
}
