!(function (e) {
  "object" == typeof exports && "object" == typeof module
    ? e(require("../../lib/codemirror"))
    : "function" == typeof define && define.amd
      ? define(["../../lib/codemirror"], e)
      : e(CodeMirror);
})(function (x) {
  "use strict";
  function k(e) {
    return new RegExp("^((" + e.join(")|(") + "))\\b");
  }
  var _ = k(["and", "or", "not", "is"]),
    v = [
      "as",
      "assert",
      "break",
      "class",
      "continue",
      "def",
      "del",
      "elif",
      "else",
      "except",
      "finally",
      "for",
      "from",
      "global",
      "if",
      "import",
      "lambda",
      "pass",
      "raise",
      "return",
      "try",
      "while",
      "with",
      "yield",
      "in",
    ],
    z = [
      "abs",
      "all",
      "any",
      "bin",
      "bool",
      "bytearray",
      "callable",
      "chr",
      "classmethod",
      "compile",
      "complex",
      "delattr",
      "dict",
      "dir",
      "divmod",
      "enumerate",
      "eval",
      "filter",
      "float",
      "format",
      "frozenset",
      "getattr",
      "globals",
      "hasattr",
      "hash",
      "help",
      "hex",
      "id",
      "input",
      "int",
      "isinstance",
      "issubclass",
      "iter",
      "len",
      "list",
      "locals",
      "map",
      "max",
      "memoryview",
      "min",
      "next",
      "object",
      "oct",
      "open",
      "ord",
      "pow",
      "property",
      "range",
      "repr",
      "reversed",
      "round",
      "set",
      "setattr",
      "slice",
      "sorted",
      "staticmethod",
      "str",
      "sum",
      "super",
      "tuple",
      "type",
      "vars",
      "zip",
      "__import__",
      "NotImplemented",
      "Ellipsis",
      "__debug__",
    ];
  function w(e) {
    return e.scopes[e.scopes.length - 1];
  }
  x.registerHelper("hintWords", "python", v.concat(z)),
    x.defineMode("python", function (t, l) {
      for (
        var s = "error",
          o = l.delimiters || l.singleDelimiters || /^[\(\)\[\]\{\}@,:`=;\.\\]/,
          a = [
            l.singleOperators,
            l.doubleOperators,
            l.doubleDelimiters,
            l.tripleDelimiters,
            l.operators ||
              /^([-+*/%\/&|^]=?|[<>=]+|\/\/=?|\*\*=?|!=|[~!@]|\.\.\.)/,
          ],
          e = 0;
        e < a.length;
        e++
      )
        a[e] || a.splice(e--, 1);
      var c,
        u,
        f = l.hangingIndent || t.indentUnit,
        n = v,
        r = z,
        p =
          (null != l.extra_keywords && (n = n.concat(l.extra_keywords)),
          null != l.extra_builtins && (r = r.concat(l.extra_builtins)),
          !(l.version && Number(l.version) < 3)),
        d =
          ((u = p
            ? ((c =
                l.identifiers ||
                /^[_A-Za-z\u00A1-\uFFFF][_A-Za-z0-9\u00A1-\uFFFF]*/),
              (n = n.concat([
                "nonlocal",
                "False",
                "True",
                "None",
                "async",
                "await",
              ])),
              (r = r.concat(["ascii", "bytes", "exec", "print"])),
              new RegExp(
                "^(([rbuf]|(br)|(rb)|(fr)|(rf))?('{3}|\"{3}|['\"]))",
                "i",
              ))
            : ((c = l.identifiers || /^[_A-Za-z][_A-Za-z0-9]*/),
              (n = n.concat(["exec", "print"])),
              (r = r.concat([
                "apply",
                "basestring",
                "buffer",
                "cmp",
                "coerce",
                "execfile",
                "file",
                "intern",
                "long",
                "raw_input",
                "reduce",
                "reload",
                "unichr",
                "unicode",
                "xrange",
                "False",
                "True",
                "None",
              ])),
              new RegExp("^(([rubf]|(ur)|(br))?('{3}|\"{3}|['\"]))", "i"))),
          k(n)),
        m = k(r);
      function i(e, t) {
        var n,
          r = e.sol() && "\\" != t.lastToken;
        return (
          r && (t.indent = e.indentation()),
          r && "py" == w(t).type
            ? ((r = w(t).offset),
              e.eatSpace()
                ? (r < (n = e.indentation())
                    ? b(t)
                    : n < r &&
                      y(e, t) &&
                      "#" != e.peek() &&
                      (t.errorToken = !0),
                  null)
                : ((n = h(e, t)), 0 < r && y(e, t) && (n += " " + s), n))
            : h(e, t)
        );
      }
      function h(e, t, n) {
        if (e.eatSpace()) return null;
        if (!n && e.match(/^#.*/)) return "comment";
        if (e.match(/^[0-9\.]/, !1)) {
          var r = !1;
          if (
            (e.match(/^[\d_]*\.\d+(e[\+\-]?\d+)?/i) && (r = !0),
            e.match(/^[\d_]+\.\d*/) && (r = !0),
            (r = e.match(/^\.\d+/) ? !0 : r))
          )
            return e.eat(/J/i), "number";
          r = !1;
          if (
            (e.match(/^0x[0-9a-f_]+/i) && (r = !0),
            e.match(/^0b[01_]+/i) && (r = !0),
            e.match(/^0o[0-7_]+/i) && (r = !0),
            e.match(/^[1-9][\d_]*(e[\+\-]?[\d_]+)?/) && (e.eat(/J/i), (r = !0)),
            (r = e.match(/^0(?![\dx])/i) ? !0 : r))
          )
            return e.eat(/L/i), "number";
        }
        if (e.match(u))
          return (
            (r = -1 !== e.current().toLowerCase().indexOf("f")),
            (t.tokenize = (
              r
                ? function (n, r) {
                    for (; 0 <= "rubf".indexOf(n.charAt(0).toLowerCase()); )
                      n = n.substr(1);
                    var i = 1 == n.length,
                      o = "string";
                    function a(e, t) {
                      for (; !e.eol(); )
                        if ((e.eatWhile(/[^'"\{\}\\]/), e.eat("\\"))) {
                          if ((e.next(), i && e.eol())) return o;
                        } else {
                          if (e.match(n)) return (t.tokenize = r), o;
                          if (e.match("{{")) return o;
                          if (e.match("{", !1))
                            return (
                              (t.tokenize = (function r(i) {
                                return function (e, t) {
                                  var n = h(e, t, !0);
                                  return (
                                    "punctuation" == n &&
                                      ("{" == e.current()
                                        ? (t.tokenize = r(i + 1))
                                        : "}" == e.current() &&
                                          (t.tokenize = 1 < i ? r(i - 1) : a)),
                                    n
                                  );
                                };
                              })(0)),
                              e.current() ? o : t.tokenize(e, t)
                            );
                          if (e.match("}}")) return o;
                          if (e.match("}")) return s;
                          e.eat(/['"]/);
                        }
                      if (i) {
                        if (l.singleLineStringErrors) return s;
                        t.tokenize = r;
                      }
                      return o;
                    }
                    return (a.isString = !0), a;
                  }
                : function (n, r) {
                    for (; 0 <= "rubf".indexOf(n.charAt(0).toLowerCase()); )
                      n = n.substr(1);
                    var i = 1 == n.length,
                      o = "string";
                    function e(e, t) {
                      for (; !e.eol(); )
                        if ((e.eatWhile(/[^'"\\]/), e.eat("\\"))) {
                          if ((e.next(), i && e.eol())) return o;
                        } else {
                          if (e.match(n)) return (t.tokenize = r), o;
                          e.eat(/['"]/);
                        }
                      if (i) {
                        if (l.singleLineStringErrors) return s;
                        t.tokenize = r;
                      }
                      return o;
                    }
                    return (e.isString = !0), e;
                  }
            )(e.current(), t.tokenize)),
            t.tokenize(e, t)
          );
        for (var i = 0; i < a.length; i++) if (e.match(a[i])) return "operator";
        return e.match(o)
          ? "punctuation"
          : "." == t.lastToken && e.match(c)
            ? "property"
            : e.match(d) || e.match(_)
              ? "keyword"
              : e.match(m)
                ? "builtin"
                : e.match(/^(self|cls)\b/)
                  ? "variable-2"
                  : e.match(c)
                    ? "def" == t.lastToken || "class" == t.lastToken
                      ? "def"
                      : "variable"
                    : (e.next(), n ? null : s);
      }
      function b(e) {
        for (; "py" != w(e).type; ) e.scopes.pop();
        e.scopes.push({
          offset: w(e).offset + t.indentUnit,
          type: "py",
          align: null,
        });
      }
      function y(e, t) {
        for (
          var n = e.indentation();
          1 < t.scopes.length && w(t).offset > n;

        ) {
          if ("py" != w(t).type) return 1;
          t.scopes.pop();
        }
        return w(t).offset != n;
      }
      function g(e, t) {
        e.sol() && ((t.beginningOfLine = !0), (t.dedent = !1));
        var n,
          r,
          i,
          o = t.tokenize(e, t),
          a = e.current();
        if (t.beginningOfLine && "@" == a)
          return e.match(c, !1) ? "meta" : p ? "operator" : s;
        if (
          (/\S/.test(a) && (t.beginningOfLine = !1),
          ("variable" != o && "builtin" != o) ||
            "meta" != t.lastToken ||
            (o = "meta"),
          ("pass" != a && "return" != a) || (t.dedent = !0),
          "lambda" == a && (t.lambda = !0),
          ":" == a &&
            !t.lambda &&
            "py" == w(t).type &&
            e.match(/^\s*(?:#|$)/, !1) &&
            b(t),
          1 == a.length && !/string|comment/.test(o))
        ) {
          var l = "[({".indexOf(a);
          if (
            (-1 != l &&
              ((n = e),
              (r = t),
              (i = "])}".slice(l, l + 1)),
              (n = n.match(/^[\s\[\{\(]*(?:#|$)/, !1) ? null : n.column() + 1),
              r.scopes.push({ offset: r.indent + f, type: i, align: n })),
            -1 != (l = "])}".indexOf(a)))
          ) {
            if (w(t).type != a) return s;
            t.indent = t.scopes.pop().offset - f;
          }
        }
        return (
          t.dedent &&
            e.eol() &&
            "py" == w(t).type &&
            1 < t.scopes.length &&
            t.scopes.pop(),
          o
        );
      }
      return {
        startState: function (e) {
          return {
            tokenize: i,
            scopes: [{ offset: e || 0, type: "py", align: null }],
            indent: e || 0,
            lastToken: null,
            lambda: !1,
            dedent: 0,
          };
        },
        token: function (e, t) {
          var n = t.errorToken,
            r = (n && (t.errorToken = !1), g(e, t));
          return (
            r &&
              "comment" != r &&
              (t.lastToken =
                "keyword" == r || "punctuation" == r ? e.current() : r),
            "punctuation" == r && (r = null),
            e.eol() && t.lambda && (t.lambda = !1),
            n ? r + " " + s : r
          );
        },
        indent: function (e, t) {
          if (e.tokenize != i) return e.tokenize.isString ? x.Pass : 0;
          var n = w(e),
            e =
              n.type == t.charAt(0) ||
              ("py" == n.type &&
                !e.dedent &&
                /^(else:|elif |except |finally:)/.test(t));
          return null != n.align
            ? n.align - (e ? 1 : 0)
            : n.offset - (e ? f : 0);
        },
        electricInput: /^\s*([\}\]\)]|else:|elif |except |finally:)$/,
        closeBrackets: { triples: "'\"" },
        lineComment: "#",
        fold: "indent",
      };
    }),
    x.defineMIME("text/x-python", "python");
  x.defineMIME("text/x-cython", {
    name: "python",
    extra_keywords:
      "by cdef cimport cpdef ctypedef enum except extern gil include nogil property public readonly struct union DEF IF ELIF ELSE".split(
        " ",
      ),
  });
});
