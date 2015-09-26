function getIdFromUrl(e) {
    return values = e.split("/"), id = values[4], id
}

function stopAnimating() {
    block = !1, document.contains(document.getElementById("previewCanvas")) && document.getElementById("previewCanvas").remove(), keepGoing = !1, iCount = 0
}

function getUrlAndLength(e) {
    for (var t = "", n = "", i = e.indexOf("storyboard_spec"), r = e.indexOf("length_seconds"), o = e[i + 18], a = 0;
        '"' != o;) t += o, a += 1, o = e[i + 18 + a];
    for (a = 0, o = e[r + 17];
        '"' != o;) n += o, a += 1, o = e[r + 17 + a];
    return [t, parseInt(n)]
}

function getImgsFromSource(e, t) {
    var n = [],
        r = new DOMParser,
        o = r.parseFromString(e, "text/html");
    if (str = o.getElementsByTagName("script")[10].innerHTML, str.indexOf("length_seconds") < 0) return stopAnimating(), n;
    var a = getUrlAndLength(str),
        s = a[1];
    b = a[0].split("|"), base = "https://i.ytimg.com/sb/" + t + "/storyboard3_L2/M", c = b[3].split("#"), sigh = c[c.length - 1];
    var m;
    for (i = 0, 60 > s ? m = 1 : 1200 > s & s > 60 ? m = 3 : (m = Math.floor(s / 240), i = 1), j = Math.floor(m / 3) + 1; i < m;) n.push(base + i + ".jpg?sigh=" + sigh), i += j;
    return n
}

function preloadImages(e, t, n) {
    for (var i, r = [], o = e.length, a = 0; a < e.length; a++) i = new Image, i.onerror = function() {
        --o, 0 == o && n(e, t)
    }, i.onload = function() {
        r.push(i), --o, 0 == o && n(e, t)
    }, i.src = e[a];
    return r
}

function initialCall() {
    $(document).on("mouseenter", ".yt-thumb-simple,.yt-uix-simple-thumb-wrap,.yt-uix-simple-thumb-related", function() {
        ga("send", "event", "img", "mouseenter"), block || (block = !0, keepGoing = !0, child = $(this).children("img[src*='ytimg.com']"), void 0 !== child.attr("src") && child.attr("src").indexOf("vi") > -1 && -1 == child.attr("src").indexOf("poster_wide") ? (url = child.attr("src"), id = getIdFromUrl(url), urlForSource = "https://www.youtube.com/watch?v=" + id, $.ajax({
            url: urlForSource,
            async: !0,
            success: function(e) {
                if (imgArray = getImgsFromSource(e, id), 0 != imgArray.length) {
                    preloadImages(imgArray, child, animate)
                }
                block = !1, keepGoing = !0
            },
            error: function() {
                block = !1
            }
        })) : stopAnimating())
    }), $(document).on("mouseleave", ".yt-thumb-simple,.yt-uix-simple-thumb-wrap,.yt-uix-simple-thumb-related", function() {
        ga("send", "event", "img", "mouseleave"), stopAnimating()
    })
}

function animate(e, t) {
    function n() {
        keepGoing && (window.requestAnimationFrame(n), r.update(), r.render())
    }

    function i(t) {
        var n = {},
            i = 0,
            r = 0,
            a = 0,
            m = t.ticksPerFrame || 0,
            u = t.numberOfFrames || 1;
        return numberOfHeight = t.numberOfHeight || 1, n.context = t.context, n.width = t.width, n.height = t.height, n.image = t.image, n.update = function() {
            a += 1, a > m && (a = 0, u - 1 > i ? i += 2 : (r += 2, i = 0), r > numberOfHeight - 1 && (r = 0, iCount += 1, iCount >= e.length && (keepGoing = !1, block = !1, document.contains(document.getElementById("previewCanvas")) && document.getElementById("previewCanvas").remove()), o.src = e[iCount % e.length], m += 30))
        }, n.render = function() {
            keepGoing && (n.context.clearRect(0, 0, n.width, n.height), n.context.drawImage(n.image, i * n.width / u, r * n.height / numberOfHeight, n.width / u, n.height / numberOfHeight, 0, 0, s, c))
        }, n
    }
    var r, o, a, s = t.attr("width"),
        c = t.attr("height"),
        a = document.createElement("canvas");
    a.id = "previewCanvas";
    a.getContext("2d");
    a.width = s, a.height = c, a.style.position = "absolute", a.style.top = 0, a.style.left = 0, $(t).parent().append(a), o = new Image, o.src = e[iCount], o.addEventListener("load", n), r = i({
        context: a.getContext("2d"),
        width: o.width,
        height: o.height,
        image: o,
        numberOfFrames: 5,
        numberOfHeight: 5,
        ticksPerFrame: 30
    })
}
initialCall(),
    function(e, t, n, i, r, o, a) {
        e.GoogleAnalyticsObject = r, e[r] = e[r] || function() {
            (e[r].q = e[r].q || []).push(arguments)
        }, e[r].l = 1 * new Date, o = t.createElement(n), a = t.getElementsByTagName(n)[0], o.async = 1, o.src = i, a.parentNode.insertBefore(o, a)
    }(window, document, "script", "//www.google-analytics.com/analytics.js", "ga"), ga("create", "UA-68124588-1", "auto");
var str, iCount = 0,
    keepGoing = !0,
    block = !1;