var forms = document.getElementsByTagName('form');
for (let form of forms)
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        window.onpopstate = function () {
            console.log(location);
            window.location.reload();
        }
        e.target.style.position = 'relative';
        e.target.insertAdjacentHTML('afterbegin', '<div id="formloader_wrapper" class="formloader_wrapper"><div id="formloader" class="formloader"></div></div>');
        var data = new FormData(e.target);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", e.target.action, true);
        xhr.onreadystatechange = function () {//Вызывает функцию при смене состояния.
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                if (e.target.id) {
                    var link = window.location.href.split('#')[0];
                    window.history.pushState({ EVENT: "MIXER" }, "", link + '#' + e.target.id);
                    window.history.pushState({ EVENT: "MIXER" }, "", link + '#' + e.target.id);
                }
                else
                    window.history.pushState({ EVENT: "MIXER" }, "", window.location);
                document.open();
                document.write(this.responseText);
                document.close();
                window.scrollTo(0, 0);
                window.onpopstate = function (event_popstate) {
                    window.location.reload();
                }
            } else if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
                document.getElementById('formloader_wrapper').remove();
            }
        }
        xhr.send(data);
    });
var css = '#formloader_wrapper.formloader_wrapper{background:rgba(255,255,255,0.7) !important;position:absolute;left:0;right:0;top:0;bottom:0;} #formloader.formloader{animation:spin 1s infinite linear;background:transparent !important;border:solid 2vmin transparent;border-radius:50%;border-right-color:#09f;border-top-color:#09f;box-sizing:border-box;height:20vmin;left:calc(50% - 10vmin);position:absolute;top:calc(50% - 10vmin);width:20vmin;z-index:1}@keyframes spin{100%{transform:rotate(360deg)}}',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

head.appendChild(style);

if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

if (window.location.hash.indexOf('#') !== -1) {
    var id = window.location.hash.split('#')[1];
    var element = document.getElementById(id);
    if (element) {
        var startingY = window.pageYOffset
        var elementY = window.pageYOffset + element.getBoundingClientRect().top
        var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY
        var diff = targetY - startingY
        var easing = function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }
        var start
        if (diff)
            window.requestAnimationFrame(function step(timestamp) {
                if (!start) start = timestamp
                var time = timestamp - start
                var percent = Math.min(time / 1000, 1)
                percent = easing(percent)
                window.scrollTo(0, startingY + diff * percent)
                if (time < 1000) {
                    window.requestAnimationFrame(step)
                }
            });
    }
}