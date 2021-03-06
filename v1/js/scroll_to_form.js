class ScrollToForm {
    constructor(form_selector) {
        document.addEventListener("DOMContentLoaded", () => {
            var hrefs = document.getElementsByTagName('a');
            for (let href of hrefs) {
                href.removeAttribute('target');
                href.addEventListener('click', function (event) {
                    event.preventDefault();
                    ScrollToForm.doScrolling(form_selector, 1000);
                });
            }
        });
    }

    static doScrolling(element, duration) {
        var startingY = window.pageYOffset
        var elementY = window.pageYOffset + document.querySelector(element).getBoundingClientRect().top
        // If element is close to page's bottom then window will scroll only to some position above the element.
        var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY
        var diff = targetY - startingY
        var easing = function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }
        var start

        if (!diff) return

        // Bootstrap our animation - it will get called right before next frame shall be rendered.
        window.requestAnimationFrame(function step(timestamp) {
            if (!start) start = timestamp
            // Elapsed miliseconds since start of scrolling.
            var time = timestamp - start
            // Get percent of completion in range [0, 1].
            var percent = Math.min(time / duration, 1)
            // Apply the easing.
            // It can cause bad-looking slow frames in browser performance tool, so be careful.
            percent = easing(percent)

            window.scrollTo(0, startingY + diff * percent)

            // Proceed with animation as long as we wanted it to.
            if (time < duration) {
                window.requestAnimationFrame(step)
            }
        })
    }
}