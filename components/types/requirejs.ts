declare global {
    namespace NodeJS {
        interface Require {
            (dependencies: string[], callback: (...args: any[]) => void): void;
            toUrl(moduleName: string): string;
        }
    }
    interface Module {
        id: string,
        uri: string,
        config(): any,
        exports: any
    }
    interface Define {
        <T>(factory?: (require: NodeJS.Require, exports: any, module: Module) => T): void;
        <T>(dependencies: string[], factory?: (...args: any[]) => T): void;
        <T>(id: string, dependencies: string[], factory?: (...args: any[]) => T): void;
        amd: {
            multiversion: boolean;
        };
    }
    const define: Define;
    var require: NodeJS.Require;
}
export { };