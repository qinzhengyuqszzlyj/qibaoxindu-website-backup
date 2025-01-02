/*
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
(function (c, a) {
    if (typeof exports === "object" && exports) {
        a(exports)
    } else {
        var b = {};
        a(b);
        if (typeof define === "function" && define.amd) {
            define(b)
        } else {
            c.Mustache = b
        }
    }
}(this, function (w) {
    var i = RegExp.prototype.test;

    function b(y, z) {
        return i.call(y, z)
    }

    var v = /\S/;

    function x(y) {
        return !b(v, y)
    }

    var p = Object.prototype.toString;
    var t = Array.isArray || function (y) {
            return p.call(y) === "[object Array]"
        };

    function c(y) {
        return typeof y === "function"
    }

    function k(y) {
        return y.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
    }

    var o = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;"};

    function u(y) {
        return String(y).replace(/[&<>"'\/]/g, function (z) {
            return o[z]
        })
    }

    function m(y) {
        if (!t(y) || y.length !== 2) {
            throw new Error("Invalid tags: " + y)
        }
        return [new RegExp(k(y[0]) + "\\s*"), new RegExp("\\s*" + k(y[1]))]
    }

    var r = /\s*/;
    var s = /\s+/;
    var g = /\s*=/;
    var a = /\s*\}/;
    var e = /#|\^|\/|>|\{|&|=|!/;

    function q(A, N) {
        N = N || w.tags;
        A = A || "";
        if (typeof N === "string") {
            N = N.split(s)
        }
        var H = m(N);
        var B = new n(A);
        var y = [];
        var L = [];
        var z = [];
        var D = false;
        var F = false;

        function E() {
            if (D && !F) {
                while (z.length) {
                    delete L[z.pop()]
                }
            } else {
                z = []
            }
            D = false;
            F = false
        }

        var M, G, I, O, C, K;
        while (!B.eos()) {
            M = B.pos;
            I = B.scanUntil(H[0]);
            if (I) {
                for (var J = 0, P = I.length; J < P; ++J) {
                    O = I.charAt(J);
                    if (x(O)) {
                        z.push(L.length)
                    } else {
                        F = true
                    }
                    L.push(["text", O, M, M + 1]);
                    M += 1;
                    if (O === "\n") {
                        E()
                    }
                }
            }
            if (!B.scan(H[0])) {
                break
            }
            D = true;
            G = B.scan(e) || "name";
            B.scan(r);
            if (G === "=") {
                I = B.scanUntil(g);
                B.scan(g);
                B.scanUntil(H[1])
            } else {
                if (G === "{") {
                    I = B.scanUntil(new RegExp("\\s*" + k("}" + N[1])));
                    B.scan(a);
                    B.scanUntil(H[1]);
                    G = "&"
                } else {
                    I = B.scanUntil(H[1])
                }
            }
            if (!B.scan(H[1])) {
                throw new Error("Unclosed tag at " + B.pos)
            }
            C = [G, I, M, B.pos];
            L.push(C);
            if (G === "#" || G === "^") {
                y.push(C)
            } else {
                if (G === "/") {
                    K = y.pop();
                    if (!K) {
                        throw new Error('Unopened section "' + I + '" at ' + M)
                    }
                    if (K[1] !== I) {
                        throw new Error('Unclosed section "' + K[1] + '" at ' + M)
                    }
                } else {
                    if (G === "name" || G === "{" || G === "&") {
                        F = true
                    } else {
                        if (G === "=") {
                            H = m(N = I.split(s))
                        }
                    }
                }
            }
        }
        K = y.pop();
        if (K) {
            throw new Error('Unclosed section "' + K[1] + '" at ' + B.pos)
        }
        return l(j(L))
    }

    function j(C) {
        var A = [];
        var D, z;
        for (var y = 0, B = C.length; y < B; ++y) {
            D = C[y];
            if (D) {
                if (D[0] === "text" && z && z[0] === "text") {
                    z[1] += D[1];
                    z[3] = D[3]
                } else {
                    A.push(D);
                    z = D
                }
            }
        }
        return A
    }

    function l(C) {
        var F = [];
        var B = F;
        var z = [];
        var D, A;
        for (var y = 0, E = C.length; y < E; ++y) {
            D = C[y];
            switch (D[0]) {
                case"#":
                case"^":
                    B.push(D);
                    z.push(D);
                    B = D[4] = [];
                    break;
                case"/":
                    A = z.pop();
                    A[5] = D[2];
                    B = z.length > 0 ? z[z.length - 1][4] : F;
                    break;
                default:
                    B.push(D)
            }
        }
        return F
    }

    function n(y) {
        this.string = y;
        this.tail = y;
        this.pos = 0
    }

    n.prototype.eos = function () {
        return this.tail === ""
    };
    n.prototype.scan = function (y) {
        var A = this.tail.match(y);
        if (A && A.index === 0) {
            var z = A[0];
            this.tail = this.tail.substring(z.length);
            this.pos += z.length;
            return z
        }
        return ""
    };
    n.prototype.scanUntil = function (z) {
        var y = this.tail.search(z), A;
        switch (y) {
            case -1:
                A = this.tail;
                this.tail = "";
                break;
            case 0:
                A = "";
                break;
            default:
                A = this.tail.substring(0, y);
                this.tail = this.tail.substring(y)
        }
        this.pos += A.length;
        return A
    };
    function h(z, y) {
        this.view = z == null ? {} : z;
        this.cache = {".": this.view};
        this.parent = y
    }

    h.prototype.push = function (y) {
        return new h(y, this)
    };
    h.prototype.lookup = function (C) {
        var y;
        if (C in this.cache) {
            y = this.cache[C]
        } else {
            var A = this;
            while (A) {
                if (C.indexOf(".") > 0) {
                    y = A.view;
                    var z = C.split("."), B = 0;
                    while (y != null && B < z.length) {
                        y = y[z[B++]]
                    }
                } else {
                    y = A.view[C]
                }
                if (y != null) {
                    break
                }
                A = A.parent
            }
            this.cache[C] = y
        }
        if (c(y)) {
            y = y.call(this.view)
        }
        return y
    };
    function d() {
        this.cache = {}
    }

    d.prototype.clearCache = function () {
        this.cache = {}
    };
    d.prototype.parse = function (y, B) {
        var z = this.cache;
        var A = z[y];
        if (A == null) {
            A = z[y] = q(y, B)
        }
        return A
    };
    d.prototype.render = function (y, A, z) {
        var C = this.parse(y);
        var B = (A instanceof h) ? A : new h(A);
        return this.renderTokens(C, B, z, y)
    };
    d.prototype.renderTokens = function (I, z, K, A) {
        var J = "";
        var E = this;

        function y(L) {
            return E.render(L, z, K)
        }

        var B, D;
        for (var G = 0, C = I.length; G < C; ++G) {
            B = I[G];
            switch (B[0]) {
                case"#":
                    D = z.lookup(B[1]);
                    if (!D) {
                        continue
                    }
                    if (t(D)) {
                        for (var H = 0, F = D.length; H < F; ++H) {
                            J += this.renderTokens(B[4], z.push(D[H]), K, A)
                        }
                    } else {
                        if (typeof D === "object" || typeof D === "string") {
                            J += this.renderTokens(B[4], z.push(D), K, A)
                        } else {
                            if (c(D)) {
                                if (typeof A !== "string") {
                                    throw new Error("Cannot use higher-order sections without the original template")
                                }
                                D = D.call(z.view, A.slice(B[3], B[5]), y);
                                if (D != null) {
                                    J += D
                                }
                            } else {
                                J += this.renderTokens(B[4], z, K, A)
                            }
                        }
                    }
                    break;
                case"^":
                    D = z.lookup(B[1]);
                    if (!D || (t(D) && D.length === 0)) {
                        J += this.renderTokens(B[4], z, K, A)
                    }
                    break;
                case">":
                    if (!K) {
                        continue
                    }
                    D = c(K) ? K(B[1]) : K[B[1]];
                    if (D != null) {
                        J += this.renderTokens(this.parse(D), z, K, D)
                    }
                    break;
                case"&":
                    D = z.lookup(B[1]);
                    if (D != null) {
                        J += D
                    }
                    break;
                case"name":
                    D = z.lookup(B[1]);
                    if (D != null) {
                        J += w.escape(D)
                    }
                    break;
                case"text":
                    J += B[1];
                    break
            }
        }
        return J
    };
    w.name = "mustache.js";
    w.version = "0.8.1";
    w.tags = ["{{", "}}"];
    var f = new d();
    w.clearCache = function () {
        return f.clearCache()
    };
    w.parse = function (y, z) {
        return f.parse(y, z)
    };
    w.render = function (y, A, z) {
        return f.render(y, A, z)
    };
    w.to_html = function (y, A, z, B) {
        var C = w.render(y, A, z);
        if (c(B)) {
            B(C)
        } else {
            return C
        }
    };
    w.escape = u;
    w.Scanner = n;
    w.Context = h;
    w.Writer = d
}));