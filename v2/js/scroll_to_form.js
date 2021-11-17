function DoScrolling(element, duration) {
    var startingY = window.pageYOffset
    var elementY = window.pageYOffset + element.getBoundingClientRect().top
    var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY
    var diff = targetY - startingY
    var easing = function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }
    var start
    if (!diff) return
    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp
        var time = timestamp - start
        var percent = Math.min(time / duration, 1)
        percent = easing(percent)
        window.scrollTo(0, startingY + diff * percent)
        if (time < duration) {
            window.requestAnimationFrame(step)
        }
    })
}

function EnableScroll(element) {
    var a_tags = document.getElementsByTagName('a');
    for (let a of a_tags) {
        a.removeAttribute('target');
        a.removeAttribute('onclick');
        a.href = "";
        a.addEventListener('click', function (event) {
            event.preventDefault();
            DoScrolling(element, 1000);
        });
    }
}

function InitScrollToForm() {
    setTimeout(() => {
        var script = document.querySelector('[src="https://legixcode.github.io/cpa-forms/v2/js/scroll_to_form.js"]');
        if (script.hasAttribute('form_id')) {
            var form_id = script.getAttribute('form_id');
            console.log(form_id);
            var form = document.getElementById(form_id);
            if (form)
                return EnableScroll(form);
            console.warn('Invalid form id');
        }
        var forms = document.getElementsByTagName('form');
        for (var i = forms.length - 1; i >= 0; i--) {
            if (forms[i].querySelector('[name="phone"]')) {
                return EnableScroll(forms[i]);
            }
        }
        console.warn('Form not found');
    }, 1000);
}

document.addEventListener("DOMContentLoaded", InitScrollToForm);
if (document.readyState === "complete") InitScrollToForm();