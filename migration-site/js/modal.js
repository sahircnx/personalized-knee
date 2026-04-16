document.addEventListener('DOMContentLoaded', function() {
    // a.open-in-modal
    document.querySelectorAll('a.open-in-modal').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = document.getElementById('image-link-modal');
            if (modal) modal.style.display = 'block';
        });
    });

    // #image-link-modal span.close
    const closeSpan = document.querySelector('#image-link-modal span.close');
    if (closeSpan) {
        closeSpan.addEventListener('click', function() {
            const modal = document.getElementById('image-link-modal');
            if (modal) modal.style.display = 'none';
        });
    }

    // a.open-in-window
    document.querySelectorAll('a.open-in-window').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(this.getAttribute('href'), "newwindow", "width=1500, height=800");
        });
    });

    // window.onclick for closing modal
    window.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'image-link-modal') {
            e.target.style.display = 'none';
        }
    });
});

(function(c, m) {
    "object" == typeof exports ? module.exports = m : c.kAccComponentLib = m
})("object" == typeof window ? window : this, function(c, m, r) {
    var A = {},
        k = function(b, e) {
            var d = b.getAttribute("data-component"),
                n = ["data", d, "group"].join("-");
            if (b.hasAttribute(n)) e = b.getAttribute(n);
            else {
                for (; 0 < c.querySelectorAll("[" + n + '="' + e + '"]').length;) e++;
                b.setAttribute(n, e)
            }
            return ["panel", "trigger"].forEach(function(w) {
                var t = b.querySelectorAll("[data-" + w + "]");
                if (0 !== t.length) {
                    var x = p(t[0], 0);
                    t.forEach(function(u) {
                        p(u, 0) === x && (u.setAttribute(["data", w, d].join("-"), ""), u.hasAttribute(n) || u.setAttribute(n, e))
                    })
                }
            }), e
        },
        B = function(b) {
            var e = "data-" + m + "-group";
            e = "[data-trigger][" + e + '="' + b.getAttribute(e) + '"]';
            var d = [];
            return b.querySelectorAll(e).forEach(function(n) {
                d.push({
                    state: n.getAttribute("data-state"),
                    element: n
                })
            }), 0 === d.length && d.push({
                state: b.getAttribute("data-state"),
                element: b
            }), d
        },
        y = function(b) {
            return b[0].toUpperCase() + b.slice(1)
        },
        p = function(b, e) {
            return null === b.parentNode ? e :
                (e++, p(b.parentNode, e))
        };
    return {
        defineHooks: function(b, e) {
            b.forEach(function(d) {
                var n = "object" == typeof r && "function" == typeof r[d];
                if (void 0 === e[d]) e[d] = n ? r[d] : function() {};
                else if (n) {
                    var w = e[d];
                    e[d] = function(t, x, u, a) {
                        r[d](t, x, u, a);
                        w(t, x, u, a)
                    }
                }
            });
            A = e
        },
        execHook: function(b, e, d, n, w) {
            var t = b + y(e),
                x = B(d);
            "function" == typeof A[t] && A[t](d, x, n, w);
            b = m + y(b) + y(e);
            d = {
                component: d,
                state: x,
                component_config: n,
                trigger: w
            };
            "function" == typeof window.CustomEvent && (d = new CustomEvent(b, {
                bubbles: !0,
                detail: d
            }), c.dispatchEvent(d))
        },
        getAttribute: function(b, e, d) {
            b = b.getAttribute(e);
            if (null == b && d && void 0 !== d.defaultValue) return d.defaultValue;
            if (d && void 0 !== d.valid) {
                if (-1 < d.valid.indexOf(b)) return b;
                if (void 0 !== d.defaultValue) return d.defaultValue
            }
            return b
        },
        getUniqueId: function(b) {
            for (var e = b, d = 0; null !== c.getElementById(e);) e = b + "-" + ++d;
            return e
        },
        tagComponents: function(b) {
            var e = 0;
            c.querySelectorAll(b).forEach(function(d) {
                e = k(d, e)
            })
        },
        tagComponent: k,
        getState: B,
        isDOM: function(b) {
            return "undefined" != typeof Element && (b instanceof Element ||
                b instanceof HTMLDocument)
        }
    }
});

(function(c, m) {
    var r = "object" == typeof modal_debug_hooks ? modal_debug_hooks : {};
    "object" == typeof exports ? module.exports = m(c.document, r, c.kAccComponentLib) : c.modal = m(c.document, r, c.kAccComponentLib)
})("object" == typeof window ? window : this, function(c, m, r) {
    function A(a) {
        k.defineHooks("beforeInit afterInit beforeOpen afterOpen beforeClose afterClose".split(" "), a)
    }
    var k = new r(c, "modal", m),
        B = k.isDOM(c),
        y = [],
        p = [],
        b = function(a) {
            var g;
            "true" !== a.getAttribute("data-initialized") &&
                "modal" === a.getAttribute("data-component") && (k.tagComponent(a, 0), g = u(a), k.execHook("before", "init", a, g), a.setAttribute("data-initialized", "true"), a.setAttribute("data-state", "closed"), k.execHook("after", "init", a, g))
        };
    m = function(a) {
        var g = a.target;
        g.hasAttribute("data-target") || g.hasAttribute("data-target-content") ? (e(g), a.preventDefault()) : g.hasAttribute("data-close-modal") && (n(), a.preventDefault())
    };
    r = function(a) {
        var g = p[p.length - 1];
        if (g) {
            var l = !1;
            "function" == typeof a.preventDefault && (l = !0);
            if (27 ===
                a.keyCode) g = l, n(), g && a.preventDefault();
            else if (9 === a.keyCode) {
                var f = [].slice.call(g.querySelectorAll('button:not([hidden]):not([disabled]), [href]:not([hidden]), input:not([hidden]):not([type="hidden"]):not([disabled]), select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), [tabindex="0"]:not([hidden]):not([disabled]), summary:not([hidden]), [contenteditable]:not([hidden]), audio[controls]:not([hidden]), video[controls]:not([hidden])'));
                0 <= f.indexOf(a.target) && (a.shiftKey ?
                    a.target === f[0] && (l && a.preventDefault(), f[f.length - 1].focus()) : a.target === f[f.length - 1] && (l && a.preventDefault(), f[0].focus())); - 1 === f.indexOf(a.target) && (l && a.preventDefault(), 0 === f.length ? g.focus : f[0].focus())
            }
        }
    };
    var e = function(a) {
            var g, l, f;
            if ("opened" !== a.getAttribute("data-state") && "true" === a.getAttribute("data-initialized") && "modal" === a.getAttribute("data-component")) {
                var q = a.getAttribute("data-modal-group");
                var v = u(a);
                var h = a.hasAttribute("data-target-content") ? (g = c.getElementById(a.getAttribute("data-target-content")),
                    (l = g.cloneNode(!0)).id = k.getUniqueId(g.id + "-modal"), c.body.appendChild(l), l) : c.getElementById(a.getAttribute("data-target"));
                k.execHook("before", "open", a, v, a);
                y.push(a);
                p.push(h);
                h.setAttribute("role", "dialog");
                h.setAttribute("aria-modal", "true");
                h.setAttribute("tabindex", "0");
                h.removeAttribute("hidden");
                h.removeAttribute("aria-hidden");
                h.setAttribute("data-modal-panel", "");
                h.setAttribute("data-modal-group", q);
                var C;
                "true" === v.create_close_button && ((C = c.createElement("button")).setAttribute("data-close-modal",
                    ""), C.setAttribute("aria-label", v.close_button_label), C.setAttribute("data-modal-group", q), C.innerText = v.close_button_label, h.appendChild(C));
                g = h.querySelector("[data-label]");
                null !== g && (g.hasAttribute("id") ? f = g.getAttribute("id") : (f = k.getUniqueId(h.id + "-label"), g.setAttribute("id", f)), h.setAttribute("aria-labelledby", f));
                (f = c.createElement("div")).setAttribute("data-modal-wrapper", "");
                f.setAttribute("data-state", "opened");
                f.setAttribute("data-modal-group", q);
                h.parentNode.insertBefore(f, h);
                f.appendChild(h);
                var z = "auto" === (z = getComputedStyle(p[p.length - 1]).zIndex) ? 0 : parseInt(z, 10);
                z += p.length;
                q = c.createElement("div");
                z = (q.style.zIndex = z, q.setAttribute("data-modal-overlay", ""), q.setAttribute("data-modal-group", a.getAttribute("data-modal-group")), "true" === v.overlay_will_close && q.setAttribute("data-close-modal", ""), q);
                h.style.zIndex = z.style.zIndex;
                h.closest("[data-modal-wrapper]").insertBefore(z, h);
                a.setAttribute("data-state", "opened");
                t();
                d(h, v.focus_delay);
                k.execHook("after", "open", a, v, a)
            }
        },
        d = function(a,
            g) {
            0 < g ? setTimeout(function() {
                a.focus()
            }, g) : a.focus()
        },
        n = function() {
            var a, g, l, f = y[y.length - 1];
            if (f) {
                var q = p[p.length - 1];
                var v = u(f);
                k.execHook("before", "close", f, v, f);
                y.pop();
                p.pop();
                (a = !!f.hasAttribute("data-target-content")) || ("data-modal-group data-modal-panel role aria-modal tabindex hidden aria-labelledby aria-describedby".split(" ").forEach(function(h) {
                    q.removeAttribute(h)
                }), q.setAttribute("hidden", ""));
                null !== (g = q.querySelector('[data-modal-group="' + f.getAttribute("data-modal-group") + '"]')) &&
                    g.remove();
                x(q.closest("[data-modal-wrapper]"));
                q.previousElementSibling.remove();
                a && q.remove();
                0 < p.length ? t() : c.querySelectorAll("body > *:not(script)").forEach(function(h) {
                    h.removeAttribute("aria-hidden")
                });
                v.return_focus_to ? w(c.querySelector(v.return_focus_to)) : f.offsetWidth || f.offsetHeight || f.getClientRects().length ? f.focus() : (l = ["main", "[role=main]", "body"].filter(function(h) {
                    return c.querySelector(h)
                }).map(function(h) {
                    return c.querySelector(h)
                }), w(l[0]));
                f.setAttribute("data-state", "closed");
                k.execHook("after", "close", f, v, f)
            }
        },
        w = function(a) {
            a.hasAttribute("tabindex") ? a.focus() : (a.setAttribute("tabindex", "-1"), a.focus(), a.removeAttribute("tabindex"))
        },
        t = function() {
            var a = p[p.length - 1];
            c.querySelectorAll("body > *:not(script)").forEach(function(g) {
                var l;
                a: {
                    for (l = a.parentNode; null != l;) {
                        if (l == g) {
                            l = !0;
                            break a
                        }
                        l = l.parentNode
                    }
                    l = !1
                }
                l ? g.removeAttribute("aria-hidden") : g.setAttribute("aria-hidden", "true")
            })
        },
        x = function(a) {
            for (; a.firstChild;) a.parentNode.insertBefore(a.firstChild, a);
            a.remove()
        },
        u = function(a) {
            a = {
                autoinit: k.getAttribute(a, "data-autoinit", {
                    defaultValue: "true",
                    valid: ["true", "false"]
                }),
                create_close_button: k.getAttribute(a, "data-create-close-button", {
                    defaultValue: "true",
                    valid: ["true", "false"]
                }),
                close_button_label: k.getAttribute(a, "data-close-button-label", {
                    defaultValue: "Close"
                }),
                overlay_will_close: k.getAttribute(a, "data-overlay-will-close", {
                    defaultValue: "true",
                    valid: ["true", "false"]
                }),
                return_focus_to: k.getAttribute(a, "data-return-focus-to", {
                    defaultValue: ""
                }),
                focus_delay: k.getAttribute(a,
                    "data-modal-focus-delay", {
                        defaultValue: 0
                    })
            };
            return "" === a.close_button_label && (a.close_button_label = "Close"), a.focus_delay = parseInt(a.focus_delay, 10) || 0, 0 > a.focus_delay && (a.focus_delay = 0), a
        };
    return A({}), B && (c.addEventListener("click", m, !1), c.addEventListener("keydown", r, !1), k.tagComponents('[data-component="modal"]'), c.querySelectorAll('[data-component="modal"]').forEach(function(a) {
        "true" === u(a).autoinit && b(a)
    })), {
        init: function(a) {
            B && b(a)
        },
        open: function(a) {
            B && e(a)
        },
        close: n,
        closeAll: function() {
            for (; y.length;) n()
        },
        defineHooks: A,
        keyHandler: r
    }
});

window.addEventListener('load', function() {
    var lastDataHref = null;
    document.querySelectorAll('button[data-component="modal"]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (this.getAttribute('data-href')) {
                lastDataHref = this.getAttribute('data-href');
            }
        });
    });

    document.addEventListener("modalBeforeOpen", function(m) {
        const component = m.detail.component;
        if (component.hasAttribute("data-href")) {
            const href = m.detail.trigger.getAttribute("data-href");
            const acceptBtn = document.getElementById("exit-modal-accept");
            if (acceptBtn) acceptBtn.setAttribute("href", href);
            
            const exitButtons = document.querySelector(".cmp-exit-buttons");
            if (exitButtons) {
                exitButtons.removeAttribute("hidden");
                const exitLink = exitButtons.querySelector("a");
                if (exitLink && lastDataHref) exitLink.setAttribute("href", lastDataHref);
            }
        }
        
        document.querySelectorAll(".cmp-exit-buttons a").forEach(function(a) {
            a.addEventListener('click', function() {
                if (window.modal) modal.closeAll();
            });
        });
    });

    document.addEventListener("modalAfterOpen", function(m) {
        document.body.style.overflow = "hidden";
        document.querySelectorAll('button[data-component="modal"]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (this.getAttribute("data-href") && window.modal) modal.closeAll();
            });
        });
    });

    document.addEventListener("modalAfterClose", function(m) {
        document.body.style.overflow = "visible";
        const exitButtons = document.querySelector(".cmp-modal .cmp-exit-buttons");
        if (exitButtons) exitButtons.setAttribute("hidden", "true");
    });
});
