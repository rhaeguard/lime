export interface SlideElement {
    generate(): string;
}

export class Text implements SlideElement {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    generate(): string {
        return `<p>${this.value}</p>`
    }
}

export class Title implements SlideElement {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    generate(): string {
        return `<h1>${this.value}</h1>`
    }
}

export class Image implements SlideElement {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    generate(): string {
        return `<img width="200" src="${this.value}"/>`
    }
}

export class List implements SlideElement {
    elements: SlideElement[];

    constructor(elements: SlideElement[]) {
        this.elements = elements;
    }

    generate(): string {
        const value = this.elements
            .map(e => e.generate())
            .map(e => `<li>${e}</li>`)
            .join("")
        return `<ul style="list-style-type: none;">${value}</ul>`
    }
}

export class Container implements SlideElement {
    elements: SlideElement[];

    constructor(...elements: SlideElement[]) {
        this.elements = elements;
    }

    generate(): string {
        return this.elements.map(e => e.generate()).join("")
    }

}

export enum SlideLayout {
    SINGLE_COLUMN,
    TWO_COLUMNS
}

export class Slide {
    layout: SlideLayout;
    elements: SlideElement[];

    constructor(layout: SlideLayout, ...elements: SlideElement[]) {
        this.layout = layout;
        this.elements = elements
    }

    generate(isActive: boolean = false) {
        if (this.layout == SlideLayout.SINGLE_COLUMN) {
            const value = this.elements.map(e => e.generate()).join("")
            return `<div class="slide ${isActive ? "active" : ""}">${value}</div>`
        } else if (this.layout == SlideLayout.TWO_COLUMNS) {
            if (this.elements.length != 2) {
                throw new Error(`A Slide with TWO_COLUMNS layout must have 2 'Container's`)
            }
            const [column1, column2] = this.elements;

            let divCol1 = column1.generate()
            let divCol2 = column2.generate()

            divCol1 = `<div class="column">${divCol1}</div>`
            divCol2 = `<div class="column">${divCol2}</div>`

            const value = `<div class="layout-two-cols">${divCol1}${divCol2}</div>`

            return `<div class="slide ${isActive ? "active" : ""}">${value}</div>`
        }
        return ""
    }
}

function scaleToFit(targetDivId: string) {
    return function () {
        const baseWidth = 800;
        const baseHeight = 450;

        const [width, height] = [window.innerWidth, window.innerHeight]

        let potentialHeight = width * (9 / 16)
        let potentialWidth = width;

        if (potentialHeight > height) {
            potentialHeight = height
            potentialWidth = height * (16 / 9)
        }

        const scale = potentialWidth / baseWidth;

        const wrapper = document.getElementById(targetDivId);
        if (wrapper) {
            wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
    }
}

function handleClick() {
    const slides = document.getElementsByClassName("slide");
    let activeSlideIx = 0;
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (slide.classList.contains("active")) {
            slide.classList.remove("active")
            activeSlideIx = i;
            break;
        }
    }

    slides[(activeSlideIx + 1) % (slides.length)].classList.add("active")
}

function handleKeyDown(event: KeyboardEvent) {
    const slides = document.getElementsByClassName("slide");
    let activeSlideIx = 0;
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (slide.classList.contains("active")) {
            slide.classList.remove("active")
            activeSlideIx = i;
            break;
        }
    }

    if (event.key == "ArrowRight") {
        slides[(activeSlideIx + 1) % (slides.length)].classList.add("active")
    } else if (event.key == "ArrowLeft") {
        const x = (slides.length + activeSlideIx - 1) % (slides.length)
        slides[x].classList.add("active")
    } else {
        slides[activeSlideIx].classList.add("active")
    }

}

export function generate(targetDivId: string, slides: Slide[]) {
    const value = slides.map((slide, ix) => slide.generate(ix == 0)).join("")

    const targetDiv = document.getElementById(targetDivId)
    if (targetDiv) {
        targetDiv.innerHTML = value;

        const styles = document.head.getElementsByTagName("style")
        let style: HTMLStyleElement;
        if (styles.length == 0) {
            style = document.createElement("style");
            document.head.appendChild(style)
        } else {
            style = styles.item(0)!
        }

        style.textContent += `
        html, body {
            margin: 0;
            padding: 0;
            background: black;
            width: 100%;
            height: 100%;
            font-family: "Lato", sans-serif;
            font-weight: 400;
            font-style: normal;
        }

        #shell {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            width: 800px;
            height: 450px;
            background: white;
            padding-inline-start: 40px;
            box-sizing: border-box;
        }

        ul {
            padding-inline-start: unset;
        }

        .slide {
            display: none;
        }

        .active {
            display: block;
        }

        .column {
            flex: 1;
            width: 100%;
        }

        .layout-two-cols {
            display: flex;
            flex-direction: row;
        }
        `;

        window.addEventListener('resize', scaleToFit(targetDivId));
        window.addEventListener('load', scaleToFit(targetDivId));
        // window.addEventListener("click", handleClick)
        window.addEventListener("keydown", handleKeyDown)
    } else {
        console.error(`Target div ${targetDivId} could not be found.`)
    }
}