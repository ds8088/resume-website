export class CoreEvent<T> extends CustomEvent<T> {
    constructor(name: string, value?: T, options?: { bubbles?: boolean; composed?: boolean }) {
        super(name, {
            detail: value,
            bubbles: true,
            composed: true,

            ...(options?.bubbles !== undefined && {
                bubbles: options.bubbles,
            }),

            ...(options?.composed !== undefined && {
                composed: options.composed,
            }),
        });
    }
}

export class CoreEventContained<T> extends CoreEvent<T> {
    constructor(name: string, value?: T) {
        super(name, value, {
            bubbles: false,
            composed: false,
        });
    }
}
