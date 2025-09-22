import type { ContextType } from '@lit/context';
import type { Context} from '@lit/context';
import { ContextProvider, ContextConsumer, createContext } from '@lit/context';
import type { ReactiveControllerHost } from 'lit';

class ControllerConsumer<T extends Context<unknown, unknown>, U extends ReactiveControllerHost & HTMLElement> extends ContextConsumer<
    T,
    U
> {
    private readonly def: ContextType<T>;

    constructor(host: U, context: T, def: ContextType<T>, callback?: (value: ContextType<T>) => void) {
        super(host, {
            context: context,
            subscribe: true,
            callback: callback,
        });

        this.def = def;
    }

    get val(): ContextType<T> {
        return this.value ?? this.def;
    }
}

export class Controller<T> {
    private readonly value: T;
    private readonly context: Context<unknown, T>;

    constructor(initialValue: T, contextName?: string) {
        this.context = createContext<T>(Symbol(contextName));
        this.value = initialValue;
    }

    attachProvider<U extends HTMLElement>(host: U): ContextProvider<typeof this.context, U> {
        return new ContextProvider(host, { context: this.context, initialValue: this.value });
    }

    attachConsumer(host: ReactiveControllerHost & HTMLElement, callback?: (value: T) => void) {
        return new ControllerConsumer(host, this.context, this.value, callback);
    }

    get nonReactiveValue(): T {
        return this.value;
    }
}
