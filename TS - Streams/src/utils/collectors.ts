import { TerminalOperation } from "../operations/terminal";

/**
 * example operations that collect elements
 */
export abstract class Collector<T, R> extends TerminalOperation<T, R> {

    public acknowledgeDone(): void {
        this.pipelineIsDone = true;
    }
    
}

export class ListCollector<T> extends Collector<T, T[]> {

    public constructor() {
        super();
        this.result = [];
    }

    public receive(element: T): void {
        this.result.push(element);
    }

}

export class SetCollector<T> extends Collector<T, Set<T>> {

    public constructor() {
        super();
        this.result = new Set();
    }

    public receive(element: T): void {
        this.result.add(element);
    }

}

export class MapCollector<T, V> extends Collector<T, { [key: string]: V}> {

    private keyFunction: (element: T) => string;
    private valueFunction: (element: T) => V;

    public constructor(keyFunction: (element: T) => string, valueFunction: (element: T) => V) {
        super();
        this.keyFunction = keyFunction;
        this.valueFunction = valueFunction;
        this.result = {};
    }

    public receive(element: T): void {
        this.result[this.keyFunction(element)] = this.valueFunction(element);
    }

}

export const Collectors = {
    toList: <T> () => new ListCollector<T>(),
    toSet: <T> () => new SetCollector<T>(),
    toMap: <T, V>(keyFunction: (element: T) => string, valueFunction: (element: T) => V) => new MapCollector<T, V>(keyFunction, valueFunction)
}