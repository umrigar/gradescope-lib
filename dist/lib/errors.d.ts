/** throw exception with msg and args; use when impossible conditions occur */
export declare function panic(msg: string, ...args: any): never;
/** An error consists of a message, a code and possible options */
/** Error options must have an error 'code'.  They may also have other
 *  optional properties like 'widget' specifying the ID of the widget
 *  causing the error.
 */
export type ErrOptions = Record<string, string>;
export declare class Err extends Error {
    readonly code: string;
    readonly options: ErrOptions;
    private constructor();
    toString(): string;
    static err(e: string | Error | Object, code?: string, opts?: ErrOptions): Err;
}
declare class OkResult<T> {
    readonly isOk: true;
    val: T;
    constructor(val: T);
}
declare class ErrResult<E> {
    readonly isOk: false;
    err: E;
    constructor(err: E);
}
export type Result<T, E> = OkResult<T> | ErrResult<E>;
export declare function okResult<T, E>(val: T): Result<T, E>;
export declare function errResult<T, E>(err: E): Result<T, E>;
export {};
//# sourceMappingURL=errors.d.ts.map