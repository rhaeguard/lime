export interface SlideElement {
    generate(): string;
}
export declare class Text implements SlideElement {
    value: string;
    constructor(value: string);
    generate(): string;
}
export declare class Title implements SlideElement {
    value: string;
    constructor(value: string);
    generate(): string;
}
export declare class Image implements SlideElement {
    value: string;
    constructor(value: string);
    generate(): string;
}
export declare class List implements SlideElement {
    elements: SlideElement[];
    constructor(elements: SlideElement[]);
    generate(): string;
}
export declare class Container implements SlideElement {
    elements: SlideElement[];
    constructor(...elements: SlideElement[]);
    generate(): string;
}
export declare enum SlideLayout {
    SINGLE_COLUMN = 0,
    TWO_COLUMNS = 1
}
export declare class Slide {
    layout: SlideLayout;
    elements: SlideElement[];
    constructor(layout: SlideLayout, ...elements: SlideElement[]);
    generate(isActive?: boolean): string;
}
export declare function generate(targetDivId: string, slides: Slide[]): void;
