! function() {
    var e = {
            935: function() {
                ! function() {
                    "use strict";
                    const e = {
                        ATTRIBUTE_COMPONENT_EXPANDED: "data-cmp-expanded",
                        ACCORDION_BUTTON: "cmp-accordion__button",
                        ACCORDION_BUTTON_EXPANDED: "cmp-accordion__button--expanded",
                        ACCORDION_BUTTON_EXPAND_COLLAPSE: "cmp-button--expand-collapse-all",
                        ACCORDION_BUTTON_TEXT: "cmp-button__text",
                        ACCORDION_COLLAPSE_ALL: "accordion-collapse-all",
                        ACCORDION_ITEM: "cmp-accordion__item",
                        ACCORDION_PANEL: "cmp-accordion__panel",
                        ACCORDION_PANEL_EXPANDED: "cmp-accordion__panel-expanded",
                        ACCORDION_PANEL_HIDDEN: "cmp-accordion__panel--hidden"
                    };
                    document.addEventListener("DOMContentLoaded", (function() {
                        let t, n = !1;

                        function o(t, n) {
                            n && function(t) {
                                const n = t.closest(".accordion"),
                                    o = t.previousElementSibling.querySelector(`.${e.ACCORDION_BUTTON_EXPANDED}`);
                                n.querySelectorAll(`.${e.ACCORDION_BUTTON_EXPANDED}`).forEach((e => {
                                    e !== o && e.click()
                                }))
                            }(t);
                            const o = t.scrollHeight;
                            t.classList.remove(e.ACCORDION_PANEL_HIDDEN), t.style.height = "0px", requestAnimationFrame((() => {
                                t.style.height = `${o}px`, t.classList.add(e.ACCORDION_PANEL_EXPANDED)
                            })), t.addEventListener("transitionend", (() => {
                                t.style.height = ""
                            }), {
                                once: !0
                            })
                        }! function() {
                            const c = document.getElementById(e.ACCORDION_COLLAPSE_ALL);
                            let r = !0;
                            c ?.parentElement.classList.contains(e.ACCORDION_BUTTON_EXPAND_COLLAPSE) && (r = !1, function(n) {
                                const o = n.querySelector(`.${e.ACCORDION_BUTTON_TEXT}`),
                                    c = o ?.innerText.split("|");
                                c.length <= 1 || (t = {
                                    expand: c[0],
                                    collapse: c[1]
                                }, o.innerText = t.expand)
                            }(c)), document.querySelectorAll(`.${e.ACCORDION_PANEL}`).forEach((t => {
                                t.previousElementSibling.addEventListener("click", (() => {
                                    var n;
                                    t.classList.contains(e.ACCORDION_PANEL_EXPANDED) ? ((n = t).style.height = `${n.scrollHeight}px`, requestAnimationFrame((() => {
                                        n.style.height = "0px", n.classList.remove(e.ACCORDION_PANEL_EXPANDED)
                                    })), n.addEventListener("transitionend", (() => {
                                        n.classList.add(e.ACCORDION_PANEL_HIDDEN), n.style.height = ""
                                    }), {
                                        once: !0
                                    })) : o(t, r)
                                }))
                            })), c && c.addEventListener("click", (function() {
                                if (r) {
                                    document.querySelectorAll(`.${e.ACCORDION_BUTTON_EXPANDED}`).forEach((e => {
                                        e.click()
                                    })), c.focus()
                                } else ! function(o) {
                                    const c = document.querySelectorAll(`.${e.ACCORDION_BUTTON}`),
                                        r = {
                                            top: window.pageYOffset,
                                            left: window.pageXOffset
                                        };
                                    if (n = !n, c.forEach((t => {
                                            (n && !t.classList.contains(e.ACCORDION_BUTTON_EXPANDED) || !n && t.classList.contains(e.ACCORDION_BUTTON_EXPANDED)) && (t.click(), window.scrollTo(r.left, r.top))
                                        })), void 0 === t) return;
                                    o.querySelector(`.${e.ACCORDION_BUTTON_TEXT}`).innerText = n ? t.collapse : t.expand, o.focus()
                                }(c)
                            }))
                        }();
                        const c = window.location.hash;
                        if (c) {
                            const e = document.querySelector(c);
                            if (e) {
                                const t = e.closest(".cmp-accordion__item");
                                if (t) {
                                    const n = t.querySelector(".cmp-accordion__header > button");
                                    n && "false" === n.getAttribute("aria-expanded") && (n.click(), e.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start"
                                    }))
                                }
                            }
                        }
                    }))
                }()
            },
            841: function() {
                document.addEventListener("DOMContentLoaded", (function() {
                    function e() {
                        (function() {
                            const e = [],
                                t = document.querySelector(".cmp-carousel") ?.querySelectorAll(".cmp-carousel__item");
                            return t ? (t.forEach((t => {
                                t.querySelectorAll("img").forEach((t => {
                                    t.src && e.push(t.src)
                                })), t.querySelectorAll("*").forEach((t => {
                                    const n = window.getComputedStyle(t).backgroundImage;
                                    if (n && "none" !== n) {
                                        const t = n.match(/url\(['"]?([^'"()]+)['"]?\)/);
                                        t && t[1] && e.push(t[1])
                                    }
                                }))
                            })), e) : e
                        })().forEach((e => {
                            const t = document.createElement("link");
                            t.rel = "preload", t.as = "image", t.href = e, document.head.appendChild(t)
                        }))
                    }
                    setTimeout((() => {
                        e()
                    }), 300)
                }))
            },
            626: function() {
                ! function() {
                    "use strict";
                    document.addEventListener("DOMContentLoaded", (function() {
                        document.getElementById("find-a-doctor").addEventListener("click", (function() {
                            const e = document.querySelector('input[name="location"]'),
                                t = document.querySelector('select[name="treatment"]'),
                                n = `https://www.zimmerbiomet.com/en/find-a-doctor/results.html?location=${encodeURIComponent(e?.value||"")}&treatment=${encodeURIComponent(t?.value||"")}`;
                            window.open(n, "_blank")
                        }));
                        new URLSearchParams(window.location.search).has("find-a-doctor") && document.querySelector('.cmp-cta[data-target="find-a-doctor-modal"]').click();
                        const e = document.getElementById("find-a-doctor-modal"),
                            t = document.querySelector("header");
                        if (!e) return;
                        new MutationObserver((n => {
                            n.forEach((n => {
                                if ("attributes" === n.type && ("hidden" === n.attributeName || "aria-modal" === n.attributeName)) {
                                    !e.hasAttribute("hidden") && "true" === e.getAttribute("aria-modal") && (t.style.position = "fixed", t.style.transform = "translate(0, 0px)", document.body.style.overflow = "auto")
                                }
                            }))
                        })).observe(e, {
                            attributes: !0,
                            attributeFilter: ["hidden", "aria-modal"]
                        })
                    }))
                }()
            },
            168: function() {
                const e = document.querySelector(".cmp-container__hamburger-menu"),
                    t = document.querySelector(".cmp-container__header-navigation"),
                    n = (document.querySelector(".cmp-experiencefragment--header"), document.querySelector('.cmp-modal#find-a-doctor-modal .cmp-modal_content .cmp-form-text .cmp-form-text__text[type="text"]')),
                    o = document.querySelector("header");
                let c = !1,
                    r = "up",
                    i = 0;

                function s() {
                    c ? (o.style.position = "fixed", "up" === r ? o.style.transform = "translate(0, 0px)" : (document.querySelector("#find-a-doctor-modal .cmp-modal-header [data-close-modal]") ?.click(), o.style.transform = "translate(0, -340px)")) : (o.style.transform = "", o.style.position = "")
                }
                n.setAttribute("maxlength", 255), document.querySelectorAll(".cmp-navigation__item--level-0").forEach((e => {
                    e.addEventListener("click", (function(t) {
                        const n = e.classList.contains("nav-list-open");
                        document.querySelectorAll(".cmp-navigation__item--level-0.nav-list-open").forEach((e => e.classList.remove("nav-list-open"))), n || e.classList.add("nav-list-open")
                    }))
                })), e.addEventListener("click", (() => {
                    t.classList.toggle("open"), e.classList.toggle("open"), document.body.style.overflow = t.classList.contains("open") ? "hidden" : ""
                })), window.addEventListener("resize", (() => {
                    window.innerWidth > 960 && t.classList.contains("open") && e.classList.contains("open") && (t.classList.remove("open"), e.classList.remove("open"), document.body.style.overflow = "", t.style.top = "")
                })), window.addEventListener("scroll", (() => {
                    const e = window.scrollY;
                    c = e > 30, e > i ? setTimeout((() => {
                        r = "down", s()
                    }), 150) : e < i && setTimeout((() => {
                        r = "up", s()
                    }), 150), i = e
                }))
            },
            447: function() {
                ! function() {
                    "use strict";
                    let e, t = !1,
                        n = [];

                    function o() {
                        e.forEach((e => {
                            const t = e.label.getBoundingClientRect();
                            e.centerX = t.left + t.width / 2
                        }))
                    }

                    function c(t) {
                        let n = e[0],
                            o = Math.abs(t - n.centerX);
                        for (let c = 1; c < e.length; c++) {
                            const r = Math.abs(t - e[c].centerX);
                            r < o && (o = r, n = e[c])
                        }
                        return n
                    }

                    function r(e) {
                        if (!t) return;
                        const n = c(e.clientX);
                        n.input.checked || (n.input.checked = !0, n.input.dispatchEvent(new Event("change")))
                    }

                    function i() {
                        t && (t = !1, document.removeEventListener("pointermove", r), document.removeEventListener("pointerup", i))
                    }
                    document.addEventListener("DOMContentLoaded", (function() {
                        function s(e) {
                            const t = document.getElementById(e);
                            if (!t) return console.warn(`Container with ID '${e}' not found.`), !0;
                            const n = t.querySelectorAll(".options");
                            let o = !1;
                            return n.forEach((e => {
                                const t = e.querySelectorAll('input[type="radio"]');
                                Array.from(t).some((e => e.checked)) ? e.classList.remove("error") : (e.classList.add("error"), o = !0)
                            })), o
                        }

                        function a(e) {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                            const t = Array.from(document.querySelectorAll(".cmp-container__koos-quiz > .cmp-container > .container.responsivegrid"));
                            t.length ? t.forEach(((t, n) => {
                                n === e ? (t.style.display = "block", requestAnimationFrame((() => {
                                    t.classList.add("active")
                                }))) : (t.classList.remove("active"), setTimeout((() => {
                                    t.style.display = "none"
                                }), 400))
                            })) : console.warn("No .screen elements found.")
                        }
                        document.querySelectorAll(".cmp-form-options--radio").forEach((s => {
                            const a = Array.from(s.querySelectorAll('input[type="radio"]')).map((e => ({
                                input: e,
                                label: e.closest("label"),
                                centerX: 0
                            })));
                            void 0 === e && (e = a), n.push(a),
                                function(e) {
                                    const t = e.querySelectorAll('input[type="radio"]'),
                                        n = e;
                                    t.forEach(((o, c) => {
                                        o.addEventListener("change", (() => {
                                            const r = o.closest("label");
                                            if (r) {
                                                const i = r.getBoundingClientRect(),
                                                    s = e.getBoundingClientRect();
                                                let a = i.left + i.width / 2 - s.left;
                                                0 === c ? a = i.left - s.left : c === t.length - 1 && (a = i.left + i.width - s.left), n.style.setProperty("--fill-width", `${a}px`);
                                                const l = o.closest(".options");
                                                l && l.classList.contains("error") && l.classList.remove("error")
                                            }
                                        }))
                                    }))
                                }(s),
                                function(s, a) {
                                    s.addEventListener("pointerdown", (s => {
                                        if (0 !== s.button) return;
                                        s.preventDefault(), e = n[a], 0 === e[0].centerX && o(), t = !0;
                                        const l = c(s.clientX);
                                        l.input.checked = !0, l.input.dispatchEvent(new Event("change")), document.addEventListener("pointermove", r), document.addEventListener("pointerup", i)
                                    }))
                                }(s, n.length - 1), o(), window.addEventListener("resize", o)
                        })), a(0), document.getElementById("start-quiz") && document.getElementById("start-quiz").addEventListener("click", (() => {
                            a(1)
                        })), document.getElementById("go-to-main-screen") && document.getElementById("go-to-main-screen").addEventListener("click", (() => {
                            a(0)
                        })), document.getElementById("go-to-question-two") ?.addEventListener("click", (() => {
                            s("question-one") || a(2)
                        })), document.getElementById("back-to-question-one") ?.addEventListener("click", (() => {
                            a(1)
                        })), document.getElementById("go-to-question-three") ?.addEventListener("click", (() => {
                            s("question-two") || a(3)
                        })), document.getElementById("back-to-question-two") ?.addEventListener("click", (() => {
                            a(2)
                        })), document.getElementById("show-results") ?.addEventListener("click", (() => {
                            if (s("question-three")) return !0;
                            const e = function(e) {
                                    const t = document.querySelector(e);
                                    if (!t) return 0;
                                    const n = t.querySelectorAll('input[type="radio"]:checked');
                                    let o = 0;
                                    return n.forEach((e => {
                                        const t = parseFloat(e.value);
                                        isNaN(t) || (o += t)
                                    })), o
                                }(".cmp-container__koos-quiz"),
                                t = document.getElementById("results"),
                                n = [100, 92, 85, 80, 77, 74, 71, 69, 66, 64, 62, 60, 58, 55, 53, 51, 48, 45, 43, 40, 37, 35, 32, 29, 25, 21, 16, 9, 0][e],
                                o = t ?.querySelector("h2");
                            if (o)
                                if (o.textContent = n, document.querySelectorAll("#results h5").forEach((e => {
                                        e.style.display = "none"
                                    })), n >= 0 && n < 60) {
                                    const e = document.querySelector("h5.result-comment-one");
                                    e && (e.style.display = "block")
                                } else if (n >= 60) {
                                const e = document.querySelector("h5.result-comment-two");
                                e && (e.style.display = "block")
                            }
                            a(4)
                        })), document.getElementById("save-report") ?.addEventListener("click", (() => {
                            window.print()
                        })), document.querySelector(".cmp-container__koos-quiz") && document.body.classList.add("koos-quiz")
                    }))
                }()
            },
            590: function() {
                ! function() {
                    "use strict";
                    document.addEventListener("DOMContentLoaded", (function() {
                        document.querySelectorAll(".cmp-navigation__item--level-0 > a").forEach((e => {
                            e.setAttribute("href", "javascript:void(0);")
                        }));
                        const e = document.querySelectorAll(".cmp-container__marquee"),
                            t = window.innerWidth < 768;
                        if (t) {
                            const e = document.querySelector(".cmp-container__marquee-parent");
                            e && (e.style.overflowX = "auto", e.style.webkitOverflowScrolling = "touch", e.style.scrollBehavior = "smooth", e.style.display = "flex", e.style.gap = "20px", e.style.scrollSnapType = "x mandatory", function(e) {
                                if (!e) return;
                                if (e.nextElementSibling ?.classList.contains("custom-scrollbar")) return;
                                const t = document.createElement("div");
                                t.className = "custom-scrollbar";
                                const n = document.createElement("div");
                                n.className = "custom-scrollbar-thumb", t.appendChild(n), e.parentNode.insertBefore(t, e.nextSibling);
                                const o = () => {
                                    const o = e.scrollWidth - e.clientWidth,
                                        c = e.scrollLeft / o * 100,
                                        r = t.offsetWidth - n.offsetWidth;
                                    n.style.transform = `translateX(${r*c/100}px)`
                                };
                                e.addEventListener("scroll", o), window.addEventListener("resize", o), o()
                            }(e))
                        }
                        e.forEach((e => {
                            const n = e.closest(".cmp-container__marquee-parent"),
                                o = n && window.innerWidth >= 768 || !n;
                            if (n && t) return;
                            if (!o) return;
                            const c = Array.from(e.children).find((e => e.classList.contains("cmp-container")));
                            if (!c) return;
                            const r = "marquee-right" === c.id,
                                i = Array.from(c.children),
                                s = () => {
                                    const e = document.createDocumentFragment();
                                    i.forEach((t => {
                                        e.appendChild(t.cloneNode(!0))
                                    })), c.appendChild(e)
                                };
                            s();
                            const a = 2 * e.offsetWidth;
                            let l = 1;
                            for (; c.scrollWidth < a && l < 10;) s(), l++;
                            const d = c.scrollWidth / (l + 1);
                            let u = r ? -d : 0,
                                m = !1;
                            e.addEventListener("mouseenter", (() => m = !0)), e.addEventListener("mouseleave", (() => m = !1)), e.addEventListener("touchstart", (() => m = !0)), e.addEventListener("touchend", (() => m = !1)), requestAnimationFrame((function e() {
                                m || (r ? (u += .5, u >= 0 && (u = -d)) : (u -= .5, Math.abs(u) >= d && (u = 0)), c.style.transform = `translate3d(${u}px, 0, 0)`), requestAnimationFrame(e)
                            }))
                        }))
                    }))
                }()
            },
            513: function() {
                ! function() {
                    "use strict";

                    function e(e) {
                        const t = Array.from(document.querySelectorAll(`${e} .tabs .cmp-tabs__tablist .cmp-tabs__tab`)),
                            n = document.querySelector(`${e} .tabs .cmp-tabs__tablist`),
                            o = document.querySelectorAll(".story-card");
                        t.length && o.forEach((e => {
                            const o = () => {
                                const o = n.querySelector(".cmp-tabs__tab--active");
                                if (!o) return;
                                const c = t.indexOf(o);
                                if (e.classList.contains("story-card--previous")) {
                                    const e = 0 === c ? t.length - 1 : c - 1;
                                    t[e].click()
                                }
                                if (e.classList.contains("story-card--next")) {
                                    const e = c === t.length - 1 ? 0 : c + 1;
                                    t[e].click()
                                }
                            };
                            e.addEventListener("click", o), e.addEventListener("keydown", (e => {
                                "Enter" !== e.key && 13 !== e.keyCode || o()
                            }))
                        }))
                    }
                    document.addEventListener("DOMContentLoaded", (function() {
                        ! function() {
                            const e = ["Rachel Ramos", "David Cullity", "Michelle Levert", "Joe Matthews"],
                                t = document.querySelectorAll(".cmp-container__meet-patients .tabs .cmp-tabs__tablist .cmp-tabs__tab");
                            t.length === e.length && t.forEach(((t, n) => {
                                if (!(t instanceof HTMLElement)) return;
                                let o = "";
                                for (t.childNodes.forEach((e => {
                                        e.nodeType === Node.TEXT_NODE && (o += e.textContent.trim())
                                    })); t.firstChild;) t.removeChild(t.firstChild);
                                const c = document.createElement("span");
                                c.className = "cmp-tabs__tab-role", c.textContent = o, t.appendChild(c);
                                const r = document.createElement("span");
                                r.className = "cmp-tabs__tab-patient", r.textContent = e[n], t.appendChild(r)
                            }))
                        }(), null !== document.querySelector(".cmp-container__meet-patients") ? e(".cmp-container__meet-patients") : e("")
                    }))
                }()
            },
            628: function() {
                ! function() {
                    "use strict";
                    document.addEventListener("DOMContentLoaded", (function() {
                        document.querySelectorAll(".cmp-container__meet-patients .cmp-accordion__item .cmp-accordion__button").forEach((e => {
                            if (!e.querySelector(".close-transcript-label")) {
                                const t = document.createElement("span");
                                t.className = "close-transcript-label", t.textContent = "Hide transcript", e.appendChild(t)
                            }
                        }));
                        document.querySelectorAll(".cmp-container__meet-patients .cmp-accordion__panel").forEach((e => {
                            const t = e.querySelector(".cmp-container");
                            if (!t || e.querySelector(".transcript-scrollbar")) return;
                            t.classList.add("transcript-scrollable");
                            const n = document.createElement("div");
                            n.className = "transcript-scrollbar";
                            const o = document.createElement("div");
                            o.className = "transcript-scrollbar-thumb", n.appendChild(o), e.appendChild(n);
                            const c = () => {
                                const e = t.scrollHeight - t.clientHeight;
                                if (e <= 0) return;
                                const c = t.scrollTop / e * 100,
                                    r = n.offsetHeight - o.offsetHeight;
                                o.style.transform = `translateY(${r*c/100}px)`
                            };
                            let r = !1,
                                i = 0,
                                s = 0;
                            o.addEventListener("mousedown", (e => {
                                r = !0, i = e.clientY, s = t.scrollTop, document.body.style.userSelect = "none", e.preventDefault()
                            })), n.addEventListener("click", (e => {
                                if (e.target === o) return;
                                const c = n.getBoundingClientRect(),
                                    r = e.clientY - c.top,
                                    i = n.offsetHeight,
                                    s = o.offsetHeight,
                                    a = t.scrollHeight - t.clientHeight,
                                    l = (r - s / 2) / (i - s),
                                    d = Math.max(0, Math.min(a, l * a));
                                t.scrollTop = d
                            })), document.addEventListener("mousemove", (e => {
                                if (!r) return;
                                const c = e.clientY - i,
                                    a = n.offsetHeight - o.offsetHeight,
                                    l = t.scrollHeight - t.clientHeight,
                                    d = c / a * l;
                                t.scrollTop = Math.max(0, Math.min(l, s + d)), e.preventDefault()
                            })), document.addEventListener("mouseup", (() => {
                                r && (r = !1, document.body.style.userSelect = "")
                            })), o.addEventListener("touchstart", (e => {
                                r = !0, i = e.touches[0].clientY, s = t.scrollTop, e.preventDefault()
                            })), n.addEventListener("touchstart", (e => {
                                if (e.target === o) return;
                                const c = n.getBoundingClientRect(),
                                    r = e.touches[0].clientY - c.top,
                                    i = n.offsetHeight,
                                    s = o.offsetHeight,
                                    a = t.scrollHeight - t.clientHeight,
                                    l = (r - s / 2) / (i - s),
                                    d = Math.max(0, Math.min(a, l * a));
                                t.scrollTop = d, e.preventDefault()
                            })), document.addEventListener("touchmove", (e => {
                                if (!r) return;
                                const c = e.touches[0].clientY - i,
                                    a = n.offsetHeight - o.offsetHeight,
                                    l = t.scrollHeight - t.clientHeight,
                                    d = c / a * l;
                                t.scrollTop = Math.max(0, Math.min(l, s + d)), e.preventDefault()
                            })), document.addEventListener("touchend", (() => {
                                r && (r = !1)
                            })), t.addEventListener("scroll", c), window.addEventListener("resize", (() => {
                                c()
                            })), c()
                        }))
                    }))
                }()
            }
        },
        t = {};

    function n(o) {
        var c = t[o];
        if (void 0 !== c) return c.exports;
        var r = t[o] = {
            exports: {}
        };
        return e[o](r, r.exports, n), r.exports
    }! function() {
        "use strict";
        n(935), n(841), n(626);
        const e = {
            FOOTER_IMAGE_LINKS: ".cmp-experiencefragment--footer .cmp-container__footer-legal >.cmp-container >.container:nth-child(3) .image",
            FOOTER_IMAGE_LINK: "cmp-image__link",
            MODAL_EXIT: "cmp-modal#exit-modal",
            MODAL_EXIT_ACCEPT: ".cmp-cta#exit-modal-accept",
            ATR_MODAL_WRAPPER: "data-modal-wrapper",
            ATR_MODAL_OVERLAY: "data-modal-overlay",
            ATR_STATE: "data-state",
            ATR_CLOSE_MODAL: "data-close-modal"
        };

        function t(t) {
            const n = document.querySelector(`.${e.MODAL_EXIT}`),
                o = n.parentElement,
                c = document.createElement("div");
            c.setAttribute(e.ATR_MODAL_WRAPPER, ""), c.setAttribute(e.ATR_STATE, "opened");
            const r = document.createElement("div");
            r.setAttribute(e.ATR_MODAL_OVERLAY, ""), r.setAttribute(e.ATR_CLOSE_MODAL, ""), c.appendChild(r), o.appendChild(c), n.querySelector(e.MODAL_EXIT_ACCEPT).setAttribute("href", t), n.style.display = "block",
                function(t) {
                    const n = document.querySelector(`.${e.MODAL_EXIT}`),
                        o = n.querySelectorAll("button"),
                        c = n.querySelector("a#exit-modal-accept");

                    function r() {
                        const e = n.nextElementSibling;
                        e.remove(), n.style.display = "none", e.removeEventListener("click", r), o.forEach((e => {
                            e.removeEventListener("click", r)
                        }))
                    }
                    t.addEventListener("click", r, {
                        once: !0
                    }), o.forEach((e => {
                        e.addEventListener("click", r, {
                            once: !0
                        })
                    })), c.addEventListener("click", r, {
                        once: !0
                    })
                }(r)
        }
        document.addEventListener("DOMContentLoaded", (function() {
            document.querySelectorAll(e.FOOTER_IMAGE_LINKS).forEach((n => {
                const o = n.querySelector(`.${e.FOOTER_IMAGE_LINK}`);
                o.addEventListener("click", (e => {
                    e.preventDefault(), t(o.getAttribute("href"))
                }))
            })), document.querySelectorAll(".new.newpar.section").forEach((e => {
                e.remove()
            }))
        }));
        n(168), n(447), n(590), n(513);
        ! function() {
            const e = [".cmp-container__arthritis >.cmp-container >.container:nth-child(2) >.cmp-container >.cmp-container__light-blue-round-corners >.cmp-container >.text:nth-child(2) a", ".cmp-container__story-form >.cmp-container >.embed >.cmp-embed >.mktoForm >.mktoCaptchaDisclaimer >a:first-of-type", ".cmp-container__story-form >.cmp-container >.embed >.cmp-embed >.mktoForm >.mktoCaptchaDisclaimer >a:last-of-type", ".cmp-container__side-by-side-banner >.cmp-container >.container:nth-child(4) >.cmp-container >.aem-Grid >.container:first-child a:first-of-type", ".cmp-container__side-by-side-banner >.cmp-container >.container:nth-child(4) >.cmp-container >.aem-Grid >.container:nth-child(2) a:first-of-type"];
            document.addEventListener("DOMContentLoaded", (function() {
                setTimeout((() => {
                    e.forEach((e => {
                        const n = document.querySelector(e);
                        null !== n && n.addEventListener("click", (e => {
                            e.preventDefault(), t(n.getAttribute("href"))
                        }))
                    }))
                }), 2500)
            }))
        }();
        n(628)
    }()
}();