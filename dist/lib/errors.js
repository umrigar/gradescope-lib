// Immutable API
/** throw exception with msg and args; use when impossible conditions occur */
export function panic(msg, ...args) {
    throw new Error(msg + args.map((a) => JSON.stringify(a)).join(', '));
}
const DEFAULT_ERR_CODE = 'UNKNOWN';
export class Err extends Error {
    code;
    options;
    constructor(message, code, options) {
        super(message);
        this.code = code;
        this.options = options;
    }
    toString() {
        const code = this.code === DEFAULT_ERR_CODE ? '' : `${this.code}: `;
        return `${code}${this.message}`;
    }
    //factory method to create an Err
    static err(e, code = DEFAULT_ERR_CODE, opts = {}) {
        const msg = (e instanceof Error) ? e.message : e.toString();
        return new Err(msg, code, opts);
    }
}
;
class OkResult {
    isOk = true;
    val;
    constructor(val) { this.val = val; }
}
class ErrResult {
    isOk = false;
    err;
    constructor(err) { this.err = err; }
}
export function okResult(val) {
    return new OkResult(val);
}
export function errResult(err) {
    return new ErrResult(err);
}
//# sourceMappingURL=errors.js.map