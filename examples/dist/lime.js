var Lime = (function (exports) {
    'use strict';

    var Text = /** @class */ (function () {
        function Text(value) {
            this.value = value;
        }
        Text.prototype.generate = function () {
            return "<p>".concat(this.value, "</p>");
        };
        return Text;
    }());
    var Title = /** @class */ (function () {
        function Title(value) {
            this.value = value;
        }
        Title.prototype.generate = function () {
            return "<h1>".concat(this.value, "</h1>");
        };
        return Title;
    }());
    var Image = /** @class */ (function () {
        function Image(value) {
            this.value = value;
        }
        Image.prototype.generate = function () {
            return "<img width=\"200\" src=\"".concat(this.value, "\"/>");
        };
        return Image;
    }());
    var List = /** @class */ (function () {
        function List(elements) {
            this.elements = elements;
        }
        List.prototype.generate = function () {
            var value = this.elements
                .map(function (e) { return e.generate(); })
                .map(function (e) { return "<li>".concat(e, "</li>"); })
                .join("");
            return "<ul style=\"list-style-type: none;\">".concat(value, "</ul>");
        };
        return List;
    }());
    var Container = /** @class */ (function () {
        function Container() {
            var elements = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                elements[_i] = arguments[_i];
            }
            this.elements = elements;
        }
        Container.prototype.generate = function () {
            return this.elements.map(function (e) { return e.generate(); }).join("");
        };
        return Container;
    }());
    exports.SlideLayout = void 0;
    (function (SlideLayout) {
        SlideLayout[SlideLayout["SINGLE_COLUMN"] = 0] = "SINGLE_COLUMN";
        SlideLayout[SlideLayout["TWO_COLUMNS"] = 1] = "TWO_COLUMNS";
    })(exports.SlideLayout || (exports.SlideLayout = {}));
    var Slide = /** @class */ (function () {
        function Slide(layout) {
            var elements = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                elements[_i - 1] = arguments[_i];
            }
            this.layout = layout;
            this.elements = elements;
        }
        Slide.prototype.generate = function (isActive) {
            if (isActive === void 0) { isActive = false; }
            if (this.layout == exports.SlideLayout.SINGLE_COLUMN) {
                var value = this.elements.map(function (e) { return e.generate(); }).join("");
                return "<div class=\"slide ".concat(isActive ? "active" : "", "\">").concat(value, "</div>");
            }
            else if (this.layout == exports.SlideLayout.TWO_COLUMNS) {
                if (this.elements.length != 2) {
                    throw new Error("A Slide with TWO_COLUMNS layout must have 2 'Container's");
                }
                var _a = this.elements, column1 = _a[0], column2 = _a[1];
                var divCol1 = column1.generate();
                var divCol2 = column2.generate();
                divCol1 = "<div class=\"column\">".concat(divCol1, "</div>");
                divCol2 = "<div class=\"column\">".concat(divCol2, "</div>");
                var value = "<div class=\"layout-two-cols\">".concat(divCol1).concat(divCol2, "</div>");
                return "<div class=\"slide ".concat(isActive ? "active" : "", "\">").concat(value, "</div>");
            }
            return "";
        };
        return Slide;
    }());
    function scaleToFit(targetDivId) {
        return function () {
            var baseWidth = 800;
            var _a = [window.innerWidth, window.innerHeight], width = _a[0], height = _a[1];
            var potentialHeight = width * (9 / 16);
            var potentialWidth = width;
            if (potentialHeight > height) {
                potentialHeight = height;
                potentialWidth = height * (16 / 9);
            }
            var scale = potentialWidth / baseWidth;
            var wrapper = document.getElementById(targetDivId);
            if (wrapper) {
                wrapper.style.transform = "translate(-50%, -50%) scale(".concat(scale, ")");
            }
        };
    }
    function handleKeyDown(event) {
        var slides = document.getElementsByClassName("slide");
        var activeSlideIx = 0;
        for (var i = 0; i < slides.length; i++) {
            var slide = slides[i];
            if (slide.classList.contains("active")) {
                slide.classList.remove("active");
                activeSlideIx = i;
                break;
            }
        }
        if (event.key == "ArrowRight") {
            slides[(activeSlideIx + 1) % (slides.length)].classList.add("active");
        }
        else if (event.key == "ArrowLeft") {
            var x = (slides.length + activeSlideIx - 1) % (slides.length);
            slides[x].classList.add("active");
        }
        else {
            slides[activeSlideIx].classList.add("active");
        }
    }
    function generate(targetDivId, slides) {
        var value = slides.map(function (slide, ix) { return slide.generate(ix == 0); }).join("");
        var targetDiv = document.getElementById(targetDivId);
        if (targetDiv) {
            targetDiv.innerHTML = value;
            var styles = document.head.getElementsByTagName("style");
            var style = void 0;
            if (styles.length == 0) {
                style = document.createElement("style");
                document.head.appendChild(style);
            }
            else {
                style = styles.item(0);
            }
            style.textContent += "\n        html, body {\n            margin: 0;\n            padding: 0;\n            background: black;\n            width: 100%;\n            height: 100%;\n            font-family: \"Lato\", sans-serif;\n            font-weight: 400;\n            font-style: normal;\n        }\n\n        #shell {\n            position: absolute;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%) scale(1);\n            width: 800px;\n            height: 450px;\n            background: white;\n            padding-inline-start: 40px;\n            box-sizing: border-box;\n        }\n\n        ul {\n            padding-inline-start: unset;\n        }\n\n        .slide {\n            display: none;\n        }\n\n        .active {\n            display: block;\n        }\n\n        .column {\n            flex: 1;\n            width: 100%;\n        }\n\n        .layout-two-cols {\n            display: flex;\n            flex-direction: row;\n        }\n        ";
            window.addEventListener('resize', scaleToFit(targetDivId));
            window.addEventListener('load', scaleToFit(targetDivId));
            // window.addEventListener("click", handleClick)
            window.addEventListener("keydown", handleKeyDown);
        }
        else {
            console.error("Target div ".concat(targetDivId, " could not be found."));
        }
    }

    exports.Container = Container;
    exports.Image = Image;
    exports.List = List;
    exports.Slide = Slide;
    exports.Text = Text;
    exports.Title = Title;
    exports.generate = generate;

    return exports;

})({});
//# sourceMappingURL=lime.js.map
