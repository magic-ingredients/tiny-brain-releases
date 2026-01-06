var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/balanced-match/index.js"(exports, module) {
    "use strict";
    module.exports = balanced;
    function balanced(a, b, str) {
      if (a instanceof RegExp) a = maybeMatch(a, str);
      if (b instanceof RegExp) b = maybeMatch(b, str);
      var r = range(a, b, str);
      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }
    balanced.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        if (a === b) {
          return [ai, bi];
        }
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str.indexOf(b, i + 1);
          }
          i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
  }
});

// packages/tiny-brain-core/node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "packages/tiny-brain-core/node_modules/brace-expansion/index.js"(exports, module) {
    var balanced = require_balanced_match();
    module.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str) {
      if (!str)
        return [];
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand2(escapeBraces(str), true).map(unescapeBraces);
    }
    function embrace(str) {
      return "{" + str + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand2(str, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str);
      if (!m) return [str];
      var pre = m.pre;
      var post = m.post.length ? expand2(m.post, false) : [""];
      if (/\$$/.test(m.pre)) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + "{" + m.body + "}" + post[k];
          expansions.push(expansion);
        }
      } else {
        var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
        var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
        var isSequence = isNumericSequence || isAlphaSequence;
        var isOptions = m.body.indexOf(",") >= 0;
        if (!isSequence && !isOptions) {
          if (m.post.match(/,(?!,).*\}/)) {
            str = m.pre + "{" + m.body + escClose + m.post;
            return expand2(str);
          }
          return [str];
        }
        var n;
        if (isSequence) {
          n = m.body.split(/\.\./);
        } else {
          n = parseCommaParts(m.body);
          if (n.length === 1) {
            n = expand2(n[0], false).map(embrace);
            if (n.length === 1) {
              return post.map(function(p) {
                return m.pre + n[0] + p;
              });
            }
          }
        }
        var N;
        if (isSequence) {
          var x = numeric(n[0]);
          var y = numeric(n[1]);
          var width = Math.max(n[0].length, n[1].length);
          var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
          var test = lte;
          var reverse = y < x;
          if (reverse) {
            incr *= -1;
            test = gte;
          }
          var pad = n.some(isPadded);
          N = [];
          for (var i = x; test(i, y); i += incr) {
            var c;
            if (isAlphaSequence) {
              c = String.fromCharCode(i);
              if (c === "\\")
                c = "";
            } else {
              c = String(i);
              if (pad) {
                var need = width - c.length;
                if (need > 0) {
                  var z = new Array(need + 1).join("0");
                  if (i < 0)
                    c = "-" + z + c.slice(1);
                  else
                    c = z + c;
                }
              }
            }
            N.push(c);
          }
        } else {
          N = [];
          for (var j = 0; j < n.length; j++) {
            N.push.apply(N, expand2(n[j], false));
          }
        }
        for (var j = 0; j < N.length; j++) {
          for (var k = 0; k < post.length; k++) {
            var expansion = pre + N[j] + post[k];
            if (!isTop || isSequence || expansion)
              expansions.push(expansion);
          }
        }
      }
      return expansions;
    }
  }
});

// node_modules/@hono/node-server/dist/index.mjs
import { createServer as createServerHTTP } from "http";
import { Http2ServerRequest as Http2ServerRequest2 } from "http2";
import { Http2ServerRequest } from "http2";
import { Readable } from "stream";
import crypto from "crypto";
var RequestError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "RequestError";
  }
};
var toRequestError = (e) => {
  if (e instanceof RequestError) {
    return e;
  }
  return new RequestError(e.message, { cause: e });
};
var GlobalRequest = global.Request;
var Request2 = class extends GlobalRequest {
  constructor(input, options) {
    if (typeof input === "object" && getRequestCache in input) {
      input = input[getRequestCache]();
    }
    if (typeof options?.body?.getReader !== "undefined") {
      ;
      options.duplex ??= "half";
    }
    super(input, options);
  }
};
var newHeadersFromIncoming = (incoming) => {
  const headerRecord = [];
  const rawHeaders = incoming.rawHeaders;
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const { [i]: key, [i + 1]: value } = rawHeaders;
    if (key.charCodeAt(0) !== /*:*/
    58) {
      headerRecord.push([key, value]);
    }
  }
  return new Headers(headerRecord);
};
var wrapBodyStream = Symbol("wrapBodyStream");
var newRequestFromIncoming = (method, url, headers, incoming, abortController) => {
  const init = {
    method,
    headers,
    signal: abortController.signal
  };
  if (method === "TRACE") {
    init.method = "GET";
    const req = new Request2(url, init);
    Object.defineProperty(req, "method", {
      get() {
        return "TRACE";
      }
    });
    return req;
  }
  if (!(method === "GET" || method === "HEAD")) {
    if ("rawBody" in incoming && incoming.rawBody instanceof Buffer) {
      init.body = new ReadableStream({
        start(controller) {
          controller.enqueue(incoming.rawBody);
          controller.close();
        }
      });
    } else if (incoming[wrapBodyStream]) {
      let reader;
      init.body = new ReadableStream({
        async pull(controller) {
          try {
            reader ||= Readable.toWeb(incoming).getReader();
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
            } else {
              controller.enqueue(value);
            }
          } catch (error) {
            controller.error(error);
          }
        }
      });
    } else {
      init.body = Readable.toWeb(incoming);
    }
  }
  return new Request2(url, init);
};
var getRequestCache = Symbol("getRequestCache");
var requestCache = Symbol("requestCache");
var incomingKey = Symbol("incomingKey");
var urlKey = Symbol("urlKey");
var headersKey = Symbol("headersKey");
var abortControllerKey = Symbol("abortControllerKey");
var getAbortController = Symbol("getAbortController");
var requestPrototype = {
  get method() {
    return this[incomingKey].method || "GET";
  },
  get url() {
    return this[urlKey];
  },
  get headers() {
    return this[headersKey] ||= newHeadersFromIncoming(this[incomingKey]);
  },
  [getAbortController]() {
    this[getRequestCache]();
    return this[abortControllerKey];
  },
  [getRequestCache]() {
    this[abortControllerKey] ||= new AbortController();
    return this[requestCache] ||= newRequestFromIncoming(
      this.method,
      this[urlKey],
      this.headers,
      this[incomingKey],
      this[abortControllerKey]
    );
  }
};
[
  "body",
  "bodyUsed",
  "cache",
  "credentials",
  "destination",
  "integrity",
  "mode",
  "redirect",
  "referrer",
  "referrerPolicy",
  "signal",
  "keepalive"
].forEach((k) => {
  Object.defineProperty(requestPrototype, k, {
    get() {
      return this[getRequestCache]()[k];
    }
  });
});
["arrayBuffer", "blob", "clone", "formData", "json", "text"].forEach((k) => {
  Object.defineProperty(requestPrototype, k, {
    value: function() {
      return this[getRequestCache]()[k]();
    }
  });
});
Object.setPrototypeOf(requestPrototype, Request2.prototype);
var newRequest = (incoming, defaultHostname) => {
  const req = Object.create(requestPrototype);
  req[incomingKey] = incoming;
  const incomingUrl = incoming.url || "";
  if (incomingUrl[0] !== "/" && // short-circuit for performance. most requests are relative URL.
  (incomingUrl.startsWith("http://") || incomingUrl.startsWith("https://"))) {
    if (incoming instanceof Http2ServerRequest) {
      throw new RequestError("Absolute URL for :path is not allowed in HTTP/2");
    }
    try {
      const url2 = new URL(incomingUrl);
      req[urlKey] = url2.href;
    } catch (e) {
      throw new RequestError("Invalid absolute URL", { cause: e });
    }
    return req;
  }
  const host = (incoming instanceof Http2ServerRequest ? incoming.authority : incoming.headers.host) || defaultHostname;
  if (!host) {
    throw new RequestError("Missing host header");
  }
  let scheme;
  if (incoming instanceof Http2ServerRequest) {
    scheme = incoming.scheme;
    if (!(scheme === "http" || scheme === "https")) {
      throw new RequestError("Unsupported scheme");
    }
  } else {
    scheme = incoming.socket && incoming.socket.encrypted ? "https" : "http";
  }
  const url = new URL(`${scheme}://${host}${incomingUrl}`);
  if (url.hostname.length !== host.length && url.hostname !== host.replace(/:\d+$/, "")) {
    throw new RequestError("Invalid host header");
  }
  req[urlKey] = url.href;
  return req;
};
var responseCache = Symbol("responseCache");
var getResponseCache = Symbol("getResponseCache");
var cacheKey = Symbol("cache");
var GlobalResponse = global.Response;
var Response2 = class _Response {
  #body;
  #init;
  [getResponseCache]() {
    delete this[cacheKey];
    return this[responseCache] ||= new GlobalResponse(this.#body, this.#init);
  }
  constructor(body, init) {
    let headers;
    this.#body = body;
    if (init instanceof _Response) {
      const cachedGlobalResponse = init[responseCache];
      if (cachedGlobalResponse) {
        this.#init = cachedGlobalResponse;
        this[getResponseCache]();
        return;
      } else {
        this.#init = init.#init;
        headers = new Headers(init.#init.headers);
      }
    } else {
      this.#init = init;
    }
    if (typeof body === "string" || typeof body?.getReader !== "undefined" || body instanceof Blob || body instanceof Uint8Array) {
      headers ||= init?.headers || { "content-type": "text/plain; charset=UTF-8" };
      this[cacheKey] = [init?.status || 200, body, headers];
    }
  }
  get headers() {
    const cache = this[cacheKey];
    if (cache) {
      if (!(cache[2] instanceof Headers)) {
        cache[2] = new Headers(cache[2]);
      }
      return cache[2];
    }
    return this[getResponseCache]().headers;
  }
  get status() {
    return this[cacheKey]?.[0] ?? this[getResponseCache]().status;
  }
  get ok() {
    const status = this.status;
    return status >= 200 && status < 300;
  }
};
["body", "bodyUsed", "redirected", "statusText", "trailers", "type", "url"].forEach((k) => {
  Object.defineProperty(Response2.prototype, k, {
    get() {
      return this[getResponseCache]()[k];
    }
  });
});
["arrayBuffer", "blob", "clone", "formData", "json", "text"].forEach((k) => {
  Object.defineProperty(Response2.prototype, k, {
    value: function() {
      return this[getResponseCache]()[k]();
    }
  });
});
Object.setPrototypeOf(Response2, GlobalResponse);
Object.setPrototypeOf(Response2.prototype, GlobalResponse.prototype);
async function readWithoutBlocking(readPromise) {
  return Promise.race([readPromise, Promise.resolve().then(() => Promise.resolve(void 0))]);
}
function writeFromReadableStreamDefaultReader(reader, writable, currentReadPromise) {
  const cancel = (error) => {
    reader.cancel(error).catch(() => {
    });
  };
  writable.on("close", cancel);
  writable.on("error", cancel);
  (currentReadPromise ?? reader.read()).then(flow, handleStreamError);
  return reader.closed.finally(() => {
    writable.off("close", cancel);
    writable.off("error", cancel);
  });
  function handleStreamError(error) {
    if (error) {
      writable.destroy(error);
    }
  }
  function onDrain() {
    reader.read().then(flow, handleStreamError);
  }
  function flow({ done, value }) {
    try {
      if (done) {
        writable.end();
      } else if (!writable.write(value)) {
        writable.once("drain", onDrain);
      } else {
        return reader.read().then(flow, handleStreamError);
      }
    } catch (e) {
      handleStreamError(e);
    }
  }
}
function writeFromReadableStream(stream2, writable) {
  if (stream2.locked) {
    throw new TypeError("ReadableStream is locked.");
  } else if (writable.destroyed) {
    return;
  }
  return writeFromReadableStreamDefaultReader(stream2.getReader(), writable);
}
var buildOutgoingHttpHeaders = (headers) => {
  const res = {};
  if (!(headers instanceof Headers)) {
    headers = new Headers(headers ?? void 0);
  }
  const cookies = [];
  for (const [k, v] of headers) {
    if (k === "set-cookie") {
      cookies.push(v);
    } else {
      res[k] = v;
    }
  }
  if (cookies.length > 0) {
    res["set-cookie"] = cookies;
  }
  res["content-type"] ??= "text/plain; charset=UTF-8";
  return res;
};
var X_ALREADY_SENT = "x-hono-already-sent";
var webFetch = global.fetch;
if (typeof global.crypto === "undefined") {
  global.crypto = crypto;
}
global.fetch = (info, init) => {
  init = {
    // Disable compression handling so people can return the result of a fetch
    // directly in the loader without messing with the Content-Encoding header.
    compress: false,
    ...init
  };
  return webFetch(info, init);
};
var outgoingEnded = Symbol("outgoingEnded");
var handleRequestError = () => new Response(null, {
  status: 400
});
var handleFetchError = (e) => new Response(null, {
  status: e instanceof Error && (e.name === "TimeoutError" || e.constructor.name === "TimeoutError") ? 504 : 500
});
var handleResponseError = (e, outgoing) => {
  const err = e instanceof Error ? e : new Error("unknown error", { cause: e });
  if (err.code === "ERR_STREAM_PREMATURE_CLOSE") {
    console.info("The user aborted a request.");
  } else {
    console.error(e);
    if (!outgoing.headersSent) {
      outgoing.writeHead(500, { "Content-Type": "text/plain" });
    }
    outgoing.end(`Error: ${err.message}`);
    outgoing.destroy(err);
  }
};
var flushHeaders = (outgoing) => {
  if ("flushHeaders" in outgoing && outgoing.writable) {
    outgoing.flushHeaders();
  }
};
var responseViaCache = async (res, outgoing) => {
  let [status, body, header] = res[cacheKey];
  if (header instanceof Headers) {
    header = buildOutgoingHttpHeaders(header);
  }
  if (typeof body === "string") {
    header["Content-Length"] = Buffer.byteLength(body);
  } else if (body instanceof Uint8Array) {
    header["Content-Length"] = body.byteLength;
  } else if (body instanceof Blob) {
    header["Content-Length"] = body.size;
  }
  outgoing.writeHead(status, header);
  if (typeof body === "string" || body instanceof Uint8Array) {
    outgoing.end(body);
  } else if (body instanceof Blob) {
    outgoing.end(new Uint8Array(await body.arrayBuffer()));
  } else {
    flushHeaders(outgoing);
    await writeFromReadableStream(body, outgoing)?.catch(
      (e) => handleResponseError(e, outgoing)
    );
  }
  ;
  outgoing[outgoingEnded]?.();
};
var isPromise = (res) => typeof res.then === "function";
var responseViaResponseObject = async (res, outgoing, options = {}) => {
  if (isPromise(res)) {
    if (options.errorHandler) {
      try {
        res = await res;
      } catch (err) {
        const errRes = await options.errorHandler(err);
        if (!errRes) {
          return;
        }
        res = errRes;
      }
    } else {
      res = await res.catch(handleFetchError);
    }
  }
  if (cacheKey in res) {
    return responseViaCache(res, outgoing);
  }
  const resHeaderRecord = buildOutgoingHttpHeaders(res.headers);
  if (res.body) {
    const reader = res.body.getReader();
    const values = [];
    let done = false;
    let currentReadPromise = void 0;
    if (resHeaderRecord["transfer-encoding"] !== "chunked") {
      let maxReadCount = 2;
      for (let i = 0; i < maxReadCount; i++) {
        currentReadPromise ||= reader.read();
        const chunk2 = await readWithoutBlocking(currentReadPromise).catch((e) => {
          console.error(e);
          done = true;
        });
        if (!chunk2) {
          if (i === 1) {
            await new Promise((resolve2) => setTimeout(resolve2));
            maxReadCount = 3;
            continue;
          }
          break;
        }
        currentReadPromise = void 0;
        if (chunk2.value) {
          values.push(chunk2.value);
        }
        if (chunk2.done) {
          done = true;
          break;
        }
      }
      if (done && !("content-length" in resHeaderRecord)) {
        resHeaderRecord["content-length"] = values.reduce((acc, value) => acc + value.length, 0);
      }
    }
    outgoing.writeHead(res.status, resHeaderRecord);
    values.forEach((value) => {
      ;
      outgoing.write(value);
    });
    if (done) {
      outgoing.end();
    } else {
      if (values.length === 0) {
        flushHeaders(outgoing);
      }
      await writeFromReadableStreamDefaultReader(reader, outgoing, currentReadPromise);
    }
  } else if (resHeaderRecord[X_ALREADY_SENT]) {
  } else {
    outgoing.writeHead(res.status, resHeaderRecord);
    outgoing.end();
  }
  ;
  outgoing[outgoingEnded]?.();
};
var getRequestListener = (fetchCallback, options = {}) => {
  const autoCleanupIncoming = options.autoCleanupIncoming ?? true;
  if (options.overrideGlobalObjects !== false && global.Request !== Request2) {
    Object.defineProperty(global, "Request", {
      value: Request2
    });
    Object.defineProperty(global, "Response", {
      value: Response2
    });
  }
  return async (incoming, outgoing) => {
    let res, req;
    try {
      req = newRequest(incoming, options.hostname);
      let incomingEnded = !autoCleanupIncoming || incoming.method === "GET" || incoming.method === "HEAD";
      if (!incomingEnded) {
        ;
        incoming[wrapBodyStream] = true;
        incoming.on("end", () => {
          incomingEnded = true;
        });
        if (incoming instanceof Http2ServerRequest2) {
          ;
          outgoing[outgoingEnded] = () => {
            if (!incomingEnded) {
              setTimeout(() => {
                if (!incomingEnded) {
                  setTimeout(() => {
                    incoming.destroy();
                    outgoing.destroy();
                  });
                }
              });
            }
          };
        }
      }
      outgoing.on("close", () => {
        const abortController = req[abortControllerKey];
        if (abortController) {
          if (incoming.errored) {
            req[abortControllerKey].abort(incoming.errored.toString());
          } else if (!outgoing.writableFinished) {
            req[abortControllerKey].abort("Client connection prematurely closed.");
          }
        }
        if (!incomingEnded) {
          setTimeout(() => {
            if (!incomingEnded) {
              setTimeout(() => {
                incoming.destroy();
              });
            }
          });
        }
      });
      res = fetchCallback(req, { incoming, outgoing });
      if (cacheKey in res) {
        return responseViaCache(res, outgoing);
      }
    } catch (e) {
      if (!res) {
        if (options.errorHandler) {
          res = await options.errorHandler(req ? e : toRequestError(e));
          if (!res) {
            return;
          }
        } else if (!req) {
          res = handleRequestError();
        } else {
          res = handleFetchError(e);
        }
      } else {
        return handleResponseError(e, outgoing);
      }
    }
    try {
      return await responseViaResponseObject(res, outgoing, options);
    } catch (e) {
      return handleResponseError(e, outgoing);
    }
  };
};
var createAdaptorServer = (options) => {
  const fetchCallback = options.fetch;
  const requestListener = getRequestListener(fetchCallback, {
    hostname: options.hostname,
    overrideGlobalObjects: options.overrideGlobalObjects,
    autoCleanupIncoming: options.autoCleanupIncoming
  });
  const createServer = options.createServer || createServerHTTP;
  const server = createServer(options.serverOptions || {}, requestListener);
  return server;
};
var serve = (options, listeningListener) => {
  const server = createAdaptorServer(options);
  server.listen(options?.port ?? 3e3, options.hostname, () => {
    const serverInfo = server.address();
    listeningListener && listeningListener(serverInfo);
  });
  return server;
};

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError2 = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError2 = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError2)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path12) => {
  const paths = path12.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path: path12 } = extractGroupsFromPath(routePath);
  const paths = splitPath(path12);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path12) => {
  const groups = [];
  path12 = path12.replace(/\{[^}]+\}/g, (match3, index) => {
    const mark = `@${index}`;
    groups.push([mark, match3]);
    return mark;
  });
  return { groups, path: path12 };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match3 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match3) {
    const cacheKey2 = `${label}#${next}`;
    if (!patternCache[cacheKey2]) {
      if (match3[2]) {
        patternCache[cacheKey2] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey2, match3[1], new RegExp(`^${match3[2]}(?=/${next})`)] : [label, match3[1], new RegExp(`^${match3[2]}$`)];
      } else {
        patternCache[cacheKey2] = [label, match3[1], true];
      }
    }
    return patternCache[cacheKey2];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match3) => {
      try {
        return decoder(match3);
      } catch {
        return match3;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path12 = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path12.includes("%25") ? path12.replace(/%25/g, "%2525") : path12);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path12) => {
  if (path12.charCodeAt(path12.length - 1) !== 63 || !path12.includes(":")) {
    return null;
  }
  const segments = path12.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path12 = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path12;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var Context = class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path12, ...handlers) => {
      for (const p of [path12].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path12, app) {
    const subApp = this.basePath(path12);
    app.routes.map((r) => {
      let handler;
      if (app.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path12) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path12);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path12, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path12);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path12, "*"), handler);
    return this;
  }
  #addRoute(method, path12, handler) {
    method = method.toUpperCase();
    path12 = mergePath(this._basePath, path12);
    const r = { basePath: this._basePath, path: path12, method, handler };
    this.router.add(method, path12, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path12 = this.getPath(request, { env });
    const matchResult = this.router.match(method, path12);
    const c = new Context(request, {
      path: path12,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path12) {
  const matchers = this.buildAllMatchers();
  const match22 = (method2, path22) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path22];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path22.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  };
  this.match = match22;
  return match22(method, path12);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path12, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path12 = path12.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path12.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path12) {
  return wildcardRegExpCache[path12] ??= new RegExp(
    path12 === "*" ? "" : `^${path12.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path12, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path12] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path12, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path12) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path12) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path12)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path12, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path12 === "/*") {
      path12 = "*";
    }
    const paramCount = (path12.match(/\/:/g) || []).length;
    if (/\*$/.test(path12)) {
      const re = buildWildcardRegExp(path12);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path12] ||= findMiddleware(middleware[m], path12) || findMiddleware(middleware[METHOD_NAME_ALL], path12) || [];
        });
      } else {
        middleware[method][path12] ||= findMiddleware(middleware[method], path12) || findMiddleware(middleware[METHOD_NAME_ALL], path12) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path12) || [path12];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path22 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path22] ||= [
            ...findMiddleware(middleware[m], path22) || findMiddleware(middleware[METHOD_NAME_ALL], path22) || []
          ];
          routes[m][path22].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path12) => [path12, r[method][path12]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path12) => [path12, r[METHOD_NAME_ALL][path12]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path12, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path12, handler]);
  }
  match(method, path12) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path12);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path12, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path12);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path12) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path12);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path12, handler) {
    const results = checkOptionalParameter(path12);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path12, handler);
  }
  match(method, path12) {
    return this.#node.search(method, path12);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const defaults2 = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults2,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  };
};

// node_modules/hono/dist/utils/mime.js
var getMimeType = (filename, mimes = baseMimes) => {
  const regexp = /\.([a-zA-Z0-9]+?)$/;
  const match3 = filename.match(regexp);
  if (!match3) {
    return;
  }
  let mimeType = mimes[match3[1]];
  if (mimeType && mimeType.startsWith("text")) {
    mimeType += "; charset=utf-8";
  }
  return mimeType;
};
var _baseMimes = {
  aac: "audio/aac",
  avi: "video/x-msvideo",
  avif: "image/avif",
  av1: "video/av1",
  bin: "application/octet-stream",
  bmp: "image/bmp",
  css: "text/css",
  csv: "text/csv",
  eot: "application/vnd.ms-fontobject",
  epub: "application/epub+zip",
  gif: "image/gif",
  gz: "application/gzip",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  ics: "text/calendar",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  jsonld: "application/ld+json",
  map: "application/json",
  mid: "audio/x-midi",
  midi: "audio/x-midi",
  mjs: "text/javascript",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  mpeg: "video/mpeg",
  oga: "audio/ogg",
  ogv: "video/ogg",
  ogx: "application/ogg",
  opus: "audio/opus",
  otf: "font/otf",
  pdf: "application/pdf",
  png: "image/png",
  rtf: "application/rtf",
  svg: "image/svg+xml",
  tif: "image/tiff",
  tiff: "image/tiff",
  ts: "video/mp2t",
  ttf: "font/ttf",
  txt: "text/plain",
  wasm: "application/wasm",
  webm: "video/webm",
  weba: "audio/webm",
  webmanifest: "application/manifest+json",
  webp: "image/webp",
  woff: "font/woff",
  woff2: "font/woff2",
  xhtml: "application/xhtml+xml",
  xml: "application/xml",
  zip: "application/zip",
  "3gp": "video/3gpp",
  "3g2": "video/3gpp2",
  gltf: "model/gltf+json",
  glb: "model/gltf-binary"
};
var baseMimes = _baseMimes;

// node_modules/@hono/node-server/dist/serve-static.mjs
import { createReadStream, statSync, existsSync } from "fs";
import { join } from "path";
var COMPRESSIBLE_CONTENT_TYPE_REGEX = /^\s*(?:text\/[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i;
var ENCODINGS = {
  br: ".br",
  zstd: ".zst",
  gzip: ".gz"
};
var ENCODINGS_ORDERED_KEYS = Object.keys(ENCODINGS);
var createStreamBody = (stream2) => {
  const body = new ReadableStream({
    start(controller) {
      stream2.on("data", (chunk2) => {
        controller.enqueue(chunk2);
      });
      stream2.on("error", (err) => {
        controller.error(err);
      });
      stream2.on("end", () => {
        controller.close();
      });
    },
    cancel() {
      stream2.destroy();
    }
  });
  return body;
};
var getStats = (path12) => {
  let stats;
  try {
    stats = statSync(path12);
  } catch {
  }
  return stats;
};
var serveStatic = (options = { root: "" }) => {
  const root = options.root || "";
  const optionPath = options.path;
  if (root !== "" && !existsSync(root)) {
    console.error(`serveStatic: root path '${root}' is not found, are you sure it's correct?`);
  }
  return async (c, next) => {
    if (c.finalized) {
      return next();
    }
    let filename;
    if (optionPath) {
      filename = optionPath;
    } else {
      try {
        filename = decodeURIComponent(c.req.path);
        if (/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(filename)) {
          throw new Error();
        }
      } catch {
        await options.onNotFound?.(c.req.path, c);
        return next();
      }
    }
    let path12 = join(
      root,
      !optionPath && options.rewriteRequestPath ? options.rewriteRequestPath(filename, c) : filename
    );
    let stats = getStats(path12);
    if (stats && stats.isDirectory()) {
      const indexFile = options.index ?? "index.html";
      path12 = join(path12, indexFile);
      stats = getStats(path12);
    }
    if (!stats) {
      await options.onNotFound?.(path12, c);
      return next();
    }
    const mimeType = getMimeType(path12);
    c.header("Content-Type", mimeType || "application/octet-stream");
    if (options.precompressed && (!mimeType || COMPRESSIBLE_CONTENT_TYPE_REGEX.test(mimeType))) {
      const acceptEncodingSet = new Set(
        c.req.header("Accept-Encoding")?.split(",").map((encoding) => encoding.trim())
      );
      for (const encoding of ENCODINGS_ORDERED_KEYS) {
        if (!acceptEncodingSet.has(encoding)) {
          continue;
        }
        const precompressedStats = getStats(path12 + ENCODINGS[encoding]);
        if (precompressedStats) {
          c.header("Content-Encoding", encoding);
          c.header("Vary", "Accept-Encoding", { append: true });
          stats = precompressedStats;
          path12 = path12 + ENCODINGS[encoding];
          break;
        }
      }
    }
    let result;
    const size = stats.size;
    const range = c.req.header("range") || "";
    if (c.req.method == "HEAD" || c.req.method == "OPTIONS") {
      c.header("Content-Length", size.toString());
      c.status(200);
      result = c.body(null);
    } else if (!range) {
      c.header("Content-Length", size.toString());
      result = c.body(createStreamBody(createReadStream(path12)), 200);
    } else {
      c.header("Accept-Ranges", "bytes");
      c.header("Date", stats.birthtime.toUTCString());
      const parts = range.replace(/bytes=/, "").split("-", 2);
      const start = parseInt(parts[0], 10) || 0;
      let end = parseInt(parts[1], 10) || size - 1;
      if (size < end - start + 1) {
        end = size - 1;
      }
      const chunksize = end - start + 1;
      const stream2 = createReadStream(path12, { start, end });
      c.header("Content-Length", chunksize.toString());
      c.header("Content-Range", `bytes ${start}-${end}/${stats.size}`);
      result = c.body(createStreamBody(stream2), 206);
    }
    await options.onFound?.(path12, c);
    return result;
  };
};

// packages/tiny-brain-dashboard/server/app.ts
import path9 from "node:path";
import { fileURLToPath as fileURLToPath3 } from "node:url";
import fs8 from "node:fs";

// packages/tiny-brain-core/src/types/result.ts
var ResultHelpers = {
  ok(data) {
    return { success: true, data };
  },
  err(error) {
    return { success: false, error };
  },
  isOk(result) {
    return result.success === true;
  },
  isErr(result) {
    return result.success === false;
  },
  map(result, fn) {
    if (result.success) {
      return { success: true, data: fn(result.data) };
    }
    return result;
  },
  mapErr(result, fn) {
    if (!result.success) {
      return { success: false, error: fn(result.error) };
    }
    return result;
  },
  unwrap(result) {
    if (result.success) {
      return result.data;
    }
    throw result.error;
  },
  unwrapOr(result, defaultValue) {
    if (result.success) {
      return result.data;
    }
    return defaultValue;
  }
};

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first2, second) => {
    return {
      ...first2,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path: path12, errorMaps, issueData } = params;
  const fullPath = [...path12, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path12, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path12;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types2, params) => {
  return new ZodUnion({
    options: types2,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first2, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first2,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first2,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;

// packages/tiny-brain-core/src/types/quality.ts
var QualityCategory = {
  Security: "Security",
  Reliability: "Reliability",
  Performance: "Performance",
  Maintainability: "Maintainability",
  Testing: "Testing",
  Architecture: "Architecture",
  Documentation: "Documentation",
  Operations: "Operations"
};
var CATEGORY_WEIGHTS = {
  [QualityCategory.Security]: 15,
  [QualityCategory.Reliability]: 10,
  [QualityCategory.Performance]: 10,
  [QualityCategory.Maintainability]: 5,
  [QualityCategory.Testing]: 5,
  [QualityCategory.Architecture]: 5,
  [QualityCategory.Documentation]: 3,
  [QualityCategory.Operations]: 3
};
var QualityGrade = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  F: "F"
};
var GRADE_THRESHOLDS = {
  [QualityGrade.A]: 90,
  [QualityGrade.B]: 80,
  [QualityGrade.C]: 70,
  [QualityGrade.D]: 60,
  [QualityGrade.F]: 0
};
var QualityIssueSchema = external_exports.object({
  /** Issue category */
  category: external_exports.enum([
    "Security",
    "Reliability",
    "Performance",
    "Maintainability",
    "Testing",
    "Architecture",
    "Documentation",
    "Operations"
  ]),
  /** Issue severity */
  severity: external_exports.enum(["critical", "major", "minor", "info"]),
  /** File path where issue was found */
  file: external_exports.string(),
  /** Line number (optional) */
  line: external_exports.number().optional(),
  /** Issue description */
  message: external_exports.string(),
  /** Suggested fix (optional) */
  suggestion: external_exports.string().optional()
});
var QualityRunSummarySchema = external_exports.object({
  /** Unique run identifier (YYYY-MM-DD-quality) */
  runId: external_exports.string(),
  /** Run date (ISO string) */
  date: external_exports.string(),
  /** Quality score (0-100) */
  score: external_exports.number().min(0).max(100),
  /** Quality grade (A-F) */
  grade: external_exports.enum(["A", "B", "C", "D", "F"]),
  /** Total number of issues found */
  issueCount: external_exports.number().min(0)
});
var QualityRunResultSchema = external_exports.object({
  /** Unique run identifier (YYYY-MM-DD-quality) */
  runId: external_exports.string(),
  /** Run date (ISO string) */
  date: external_exports.string(),
  /** Quality score (0-100) */
  score: external_exports.number().min(0).max(100),
  /** Quality grade (A-F) */
  grade: external_exports.enum(["A", "B", "C", "D", "F"]),
  /** All issues found during analysis */
  issues: external_exports.array(QualityIssueSchema),
  /** Issue counts by category */
  issuesByCategory: external_exports.record(external_exports.string(), external_exports.number()),
  /** Prioritized recommendations for improvement */
  recommendations: external_exports.array(external_exports.string()),
  /** Repository context detected during analysis */
  context: external_exports.object({
    languages: external_exports.array(external_exports.string()).optional(),
    frameworks: external_exports.array(external_exports.string()).optional(),
    projectType: external_exports.string().optional()
  }).optional()
});
var SaveQualityRunInputSchema = external_exports.object({
  /** Quality score (0-100) */
  score: external_exports.number().min(0).max(100),
  /** Quality grade (A-F) */
  grade: external_exports.enum(["A", "B", "C", "D", "F"]),
  /** All issues found during analysis */
  issues: external_exports.array(QualityIssueSchema),
  /** Prioritized recommendations for improvement */
  recommendations: external_exports.array(external_exports.string()),
  /** Repository context (optional) */
  context: external_exports.object({
    languages: external_exports.array(external_exports.string()).optional(),
    frameworks: external_exports.array(external_exports.string()).optional(),
    projectType: external_exports.string().optional()
  }).optional()
});

// packages/tiny-brain-core/src/config/service-urls.ts
var PRODUCTION_URLS = {
  TBS: "https://tiny-brain-service.vercel.app",
  TBR: "https://tiny-brain-remote.vercel.app"
};
function getTBRUrl() {
  return process.env.TBR_URL || PRODUCTION_URLS.TBR;
}

// packages/tiny-brain-core/src/services/base-service.ts
var BaseService = class {
  context;
  storage;
  logger;
  userId;
  sessionId;
  activePersona;
  constructor(context) {
    this.context = context;
    this.storage = context.storage;
    this.logger = context.logger;
    this.userId = context.userId;
    this.sessionId = context.sessionId;
    this.activePersona = context.activePersona;
  }
  /**
   * Validate that an active persona is set
   */
  requireActivePersona() {
    if (!this.activePersona?.id) {
      throw new Error("No active persona found. Operations require an active persona.");
    }
    return this.activePersona.id;
  }
  /**
   * Log with context
   */
  log(level, message, data) {
    const logData = {
      ...data,
      userId: this.userId,
      sessionId: this.sessionId,
      activePersona: this.activePersona?.id
    };
    switch (level) {
      case "debug":
        this.logger.debug(message, logData);
        break;
      case "info":
        this.logger.info(message, logData);
        break;
      case "warn":
        this.logger.warn(message, logData);
        break;
      case "error":
        this.logger.error(message, logData);
        break;
    }
  }
};

// packages/tiny-brain-core/src/modules/persona/persona-markdown.ts
var SYSTEM_BLOCK_START = "<!-- SYSTEM-BLOCK-START -->";
var SYSTEM_BLOCK_END = "<!-- SYSTEM-BLOCK-END -->";
var USER_BLOCK_START = "<!-- USER-BLOCK-START -->";
var USER_BLOCK_END = "<!-- USER-BLOCK-END -->";
function parsePersonaMarkdown(markdown) {
  const nameMatch = markdown.match(/^#\s+(.+)$/m);
  const name = nameMatch ? nameMatch[1].trim() : "Unknown";
  const systemBlock = extractBlock(markdown, SYSTEM_BLOCK_START, SYSTEM_BLOCK_END);
  const system = systemBlock ? parseSystemBlock(systemBlock) : null;
  const userBlock = extractBlock(markdown, USER_BLOCK_START, USER_BLOCK_END);
  const user = userBlock ? parseUserBlock(userBlock) : null;
  return { name, system, user };
}
function extractBlock(content, startMarker, endMarker) {
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);
  if (startIndex === -1 || endIndex === -1) {
    return null;
  }
  return content.substring(startIndex + startMarker.length, endIndex).trim();
}
function parseSystemBlock(content) {
  const metadata = parseMetadataSection(content, "System Metadata");
  const rules = parseRulesSection(content, "System Rules");
  const details = parseDetailsSection(content, "System Details");
  return {
    metadata: {
      name: metadata["Name"] || "",
      description: metadata["Description"] || "",
      version: metadata["Version"] || "",
      lastUpdated: metadata["Last Updated"] || ""
    },
    rules,
    details
  };
}
function parseUserBlock(content) {
  const metadata = parseMetadataSection(content, "User Metadata");
  const rules = parseRulesSection(content, "User Rules");
  const details = parseDetailsSection(content, "User Details");
  return {
    metadata: {
      created: metadata["Created"] || "",
      modified: metadata["Modified"] || "",
      ...metadata
    },
    rules,
    details
  };
}
function parseMetadataSection(content, sectionName) {
  const sectionRegex = new RegExp(`##\\s+${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`, "i");
  const match3 = content.match(sectionRegex);
  if (!match3) return {};
  const metadata = {};
  const lines = match3[1].split("\n");
  for (const line of lines) {
    const metaMatch = line.match(/^[-*]\s*([^:]+):\s*(.+)$/);
    if (metaMatch) {
      metadata[metaMatch[1].trim()] = metaMatch[2].trim();
    }
  }
  return metadata;
}
function parseRulesSection(content, sectionName) {
  const sectionRegex = new RegExp(`##\\s+${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`, "i");
  const match3 = content.match(sectionRegex);
  if (!match3) return [];
  const rules = [];
  const lines = match3[1].split("\n");
  for (const line of lines) {
    const ruleMatch = line.match(/^[-*]\s+(.+)$/);
    if (ruleMatch) {
      rules.push(ruleMatch[1].trim());
    }
  }
  return rules;
}
function parseDetailsSection(content, sectionName) {
  const sectionRegex = new RegExp(`##\\s+${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+(?:System|User)|$)`, "i");
  const match3 = content.match(sectionRegex);
  if (!match3) return {};
  const details = {};
  const detailsContent = match3[1];
  const subsectionRegex = /###\s+(.+)\n([\s\S]*?)(?=\n###|$)/g;
  let subsectionMatch;
  while ((subsectionMatch = subsectionRegex.exec(detailsContent)) !== null) {
    const subsectionName = subsectionMatch[1].trim();
    const subsectionContent = subsectionMatch[2].trim();
    details[subsectionName.toLowerCase()] = subsectionContent;
  }
  return details;
}

// packages/tiny-brain-core/src/services/persona/persona-service.ts
var PersonaService = class extends BaseService {
  /**
   * Transform ParsedPersona to Persona domain object
   */
  transformParsedToPersona(parsed, personaName) {
    const systemMetadata = {
      name: parsed.system?.metadata?.name || personaName,
      description: parsed.system?.metadata?.description || "",
      version: parsed.system?.metadata?.version || "1.0.0",
      lastUpdated: parsed.system?.metadata?.lastUpdated || (/* @__PURE__ */ new Date()).toISOString(),
      category: parsed.system?.metadata?.category,
      subcategory: parsed.system?.metadata?.subcategory,
      tags: parsed.system?.metadata?.tags?.split(",").map((t) => t.trim())
    };
    const userMetadata = {
      created: parsed.user?.metadata?.created || (/* @__PURE__ */ new Date()).toISOString(),
      lastUpdated: parsed.user?.metadata?.modified || (/* @__PURE__ */ new Date()).toISOString(),
      source: parsed.user?.metadata?.source
    };
    const systemDetails = parsed.system?.details ? Object.entries(parsed.system.details).map(([key, value]) => `### ${key}
${value}`).join("\n\n") : "";
    const userDetails = parsed.user?.details ? Object.entries(parsed.user.details).map(([key, value]) => `### ${key}
${value}`).join("\n\n") : "";
    return {
      system: {
        metadata: systemMetadata,
        rules: parsed.system?.rules || [],
        details: systemDetails,
        get path() {
          return `${systemMetadata.category || "default"}/${systemMetadata.subcategory || "general"}/${systemMetadata.name}`;
        }
      },
      user: {
        metadata: userMetadata,
        rules: parsed.user?.rules || [],
        details: userDetails
      },
      get path() {
        return this.system.path;
      }
    };
  }
  /**
   * Load a persona with support for brief/full modes
   * - brief: Returns name, parsed Persona, and metadata only (for card display)
   * - full: Returns everything including files, plans, insights (for detail view)
   *
   * @param args.personaName - Name of the persona to load
   * @param args.mode - Loading mode: 'brief' | 'full' (default: 'full')
   */
  async loadPersona(args) {
    const mode = args.mode || "full";
    let name = args.personaName;
    if (!name) {
      throw new Error("Persona name is required");
    }
    let isArchived = false;
    if (name.endsWith(" (archived)")) {
      isArchived = true;
      name = name.slice(0, -11);
    }
    const personaPath = isArchived ? `__archived__/${name}` : name;
    const profileContent = await this.storage.getPersonaFile(
      personaPath,
      "profile.md",
      this.userId
    );
    if (!profileContent) {
      return null;
    }
    const parsed = parsePersonaMarkdown(profileContent);
    const persona = this.transformParsedToPersona(parsed, name);
    let metadata = null;
    const metadataRaw = await this.storage.getPersonaFile(
      personaPath,
      "metadata.json",
      this.userId
    );
    if (metadataRaw) {
      try {
        metadata = JSON.parse(metadataRaw);
      } catch (error) {
        this.log("warn", `Failed to parse metadata.json for persona ${name}:`, error);
      }
    }
    if (mode === "brief") {
      return {
        name,
        persona,
        metadata
      };
    }
    const result = {
      name,
      persona,
      metadata,
      files: [],
      plans: [],
      planCount: 0,
      insights: null,
      memoryFileCount: 0
    };
    try {
      const files = await this.storage.listPersonaFiles(personaPath, this.userId);
      result.files = files;
      const insightsRaw = await this.storage.getPersonaFile(
        personaPath,
        "insights.json",
        this.userId
      );
      if (insightsRaw) {
        try {
          result.insights = JSON.parse(insightsRaw);
        } catch (error) {
          this.log("warn", `Failed to parse insights.json for persona ${name}:`, error);
        }
      }
      const planFiles = files.filter(
        (file) => (file.startsWith("plans/active/") || file.startsWith("plans/archived/")) && file.endsWith(".json")
      );
      result.planCount = planFiles.length;
      const sortedPlanFiles = planFiles.sort((a, b) => b.localeCompare(a));
      const recentPlanFiles = sortedPlanFiles.slice(0, 5);
      for (const planFile of recentPlanFiles) {
        try {
          const planContent = await this.storage.getPersonaFile(personaPath, planFile, this.userId);
          if (planContent) {
            const plan = JSON.parse(planContent);
            result.plans?.push({
              fileName: planFile,
              name: plan.title || plan.name || "Unnamed Plan",
              overview: plan.overview || "",
              currentStatus: plan.currentStatus?.summary || plan.status || "unknown",
              lastUpdated: plan.lastUpdated,
              phases: plan.phases || []
            });
          }
        } catch (error) {
          this.log("warn", `Failed to parse plan file ${planFile} for persona ${name}:`, error);
        }
      }
      const memoryFiles = files.filter(
        (file) => file.startsWith("memory/") && file.endsWith(".json")
      );
      result.memoryFileCount = memoryFiles.length;
      return result;
    } catch (error) {
      this.log("error", `Failed to load full context for persona ${name}:`, error);
      return {
        name,
        persona,
        metadata,
        files: [],
        plans: [],
        planCount: 0,
        insights: null,
        memoryFileCount: 0
      };
    }
  }
  /**
   * Create a new persona with full directory structure (backward compatibility)
   * Supports both patterns:
   * - Legacy: createPersona() with context.input
   * - New: createPersona(args) with explicit args
   */
  async createPersona(args) {
    await this.create(args.personaName, args.profile);
  }
  /**
   * Create a new persona with profile and optional metadata
   */
  async create(personaName, profileOrPersona, metadata) {
    if (!personaName) {
      throw new Error("Persona name is required");
    }
    let profileContent;
    if (typeof profileOrPersona === "string") {
      profileContent = profileOrPersona;
    } else if ("systemBlock" in profileOrPersona) {
      profileContent = profileOrPersona.systemBlock;
    } else {
      profileContent = JSON.stringify(profileOrPersona, null, 2);
    }
    if (!profileContent) {
      throw new Error("Profile is required");
    }
    const existing = await this.loadPersona({ personaName });
    if (existing) {
      throw new Error(`Persona "${personaName}" already exists`);
    }
    await this.storage.createPersonaDirectories(personaName, this.userId);
    await this.createPersonaFiles(personaName, profileContent);
    if (metadata) {
      const metadataString = typeof metadata === "string" ? metadata : JSON.stringify(metadata, null, 2);
      await this.storage.storePersonaFile(personaName, "metadata.json", metadataString, this.userId);
    }
    await this.createDirectoryReadmeFiles(personaName);
    return parsePersonaMarkdown(profileContent);
  }
  /**
   * Update an existing persona profile (backward compatibility)
   * Supports both patterns:
   * - Legacy: savePersona() with context.input
   * - New: savePersona(args) with explicit args
   */
  async savePersona(args) {
    await this.save(args.personaName, args.profile);
  }
  /**
   * Save a persona with profile and optional metadata
   */
  async save(personaName, profileOrPersona, metadata) {
    if (!personaName) {
      throw new Error("Persona name is required");
    }
    let profileContent;
    if (typeof profileOrPersona === "string") {
      profileContent = profileOrPersona;
    } else if ("systemBlock" in profileOrPersona) {
      profileContent = profileOrPersona.systemBlock;
    } else {
      profileContent = JSON.stringify(profileOrPersona, null, 2);
    }
    if (!profileContent) {
      throw new Error("Profile is required");
    }
    const existing = await this.loadPersona({ personaName });
    if (!existing) {
      throw new Error(
        `Persona "${personaName}" does not exist. Use createPersona to create a new persona.`
      );
    }
    await this.storage.storePersonaFile(personaName, "profile.md", profileContent, this.userId);
    if (metadata) {
      const metadataString = typeof metadata === "string" ? metadata : JSON.stringify(metadata, null, 2);
      await this.storage.storePersonaFile(personaName, "metadata.json", metadataString, this.userId);
    } else {
      const metadataContent = await this.storage.getPersonaFile(personaName, "metadata.json", this.userId);
      if (metadataContent) {
        try {
          const existingMetadata = JSON.parse(metadataContent);
          existingMetadata.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
          await this.storage.storePersonaFile(
            personaName,
            "metadata.json",
            JSON.stringify(existingMetadata, null, 2),
            this.userId
          );
        } catch {
        }
      }
    }
  }
  /**
   * Update insights file directly
   * Supports both patterns:
   * - Legacy: updateInsights() with context.input
   * - New: updateInsights(args) with explicit args
   */
  async updateInsights(args) {
    const name = args.personaName;
    const updates = args.insights;
    if (!name) {
      throw new Error("Persona name is required");
    }
    if (!updates) {
      throw new Error("Insights updates are required");
    }
    const persona = await this.loadPersona({ personaName: name });
    if (!persona) {
      throw new Error(`Persona "${name}" not found`);
    }
    const currentInsights = persona.insights || {
      insights: [],
      patterns: [],
      preferences: [],
      expertise: [],
      totalLearnings: 0,
      lastLearningDate: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (updates.insights) {
      currentInsights.insights = [.../* @__PURE__ */ new Set([...currentInsights.insights, ...updates.insights])];
    }
    if (updates.patterns) {
      currentInsights.patterns = [.../* @__PURE__ */ new Set([...currentInsights.patterns, ...updates.patterns])];
    }
    if (updates.preferences) {
      currentInsights.preferences = [
        .../* @__PURE__ */ new Set([...currentInsights.preferences, ...updates.preferences])
      ];
    }
    if (updates.expertise) {
      currentInsights.expertise = [
        .../* @__PURE__ */ new Set([...currentInsights.expertise, ...updates.expertise])
      ];
    }
    currentInsights.totalLearnings = currentInsights.totalLearnings + 1;
    currentInsights.lastLearningDate = (/* @__PURE__ */ new Date()).toISOString();
    await this.storage.storePersonaFile(
      name,
      "insights.json",
      JSON.stringify(currentInsights, null, 2),
      this.userId
    );
    if (persona.metadata) {
      persona.metadata.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      await this.storage.storePersonaFile(
        name,
        "metadata.json",
        JSON.stringify(persona.metadata, null, 2),
        this.userId
      );
    }
  }
  /**
   * Create initial persona files
   */
  async createPersonaFiles(name, profileContent) {
    await this.storage.storePersonaFile(name, "profile.md", profileContent, this.userId);
    const initialInsights = {
      insights: [],
      patterns: [],
      preferences: [],
      expertise: [],
      totalLearnings: 0,
      lastLearningDate: (/* @__PURE__ */ new Date()).toISOString()
    };
    await this.storage.storePersonaFile(
      name,
      "insights.json",
      JSON.stringify(initialInsights, null, 2),
      this.userId
    );
    const initialMetadata = {
      version: "1.0",
      generator: "tiny-brain",
      encoding: "utf-8",
      totalInteractions: 0,
      lastInteraction: (/* @__PURE__ */ new Date()).toISOString(),
      averageSessionLength: 0,
      tags: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    };
    await this.storage.storePersonaFile(
      name,
      "metadata.json",
      JSON.stringify(initialMetadata, null, 2),
      this.userId
    );
  }
  /**
   * Create README files in persona subdirectories
   */
  async createDirectoryReadmeFiles(name) {
    const plansReadme = `# Plans Directory

This directory stores planning documents and task lists for the ${name} persona.

Plans are created using the planning tools and stored here for future reference.`;
    await this.storage.storePersonaFile(name, "plans/README.md", plansReadme, this.userId);
  }
  /**
   * Archive a persona to prevent accidental deletion
   * Supports both patterns:
   * - Legacy: archivePersona() with context.input
   * - New: archivePersona(args) with explicit args
   */
  async archivePersona(args) {
    const name = args.personaName;
    const reason = args.reason || "No reason provided";
    if (!name) {
      throw new Error("Persona name is required");
    }
    const persona = await this.loadPersona({ personaName: name });
    if (!persona) {
      throw new Error(`Persona "${name}" not found`);
    }
    let metadata = {};
    const existingMetadata = await this.storage.getPersonaFile(name, "metadata.json", this.userId);
    if (existingMetadata) {
      try {
        metadata = JSON.parse(existingMetadata);
      } catch {
      }
    }
    metadata.archived_at = (/* @__PURE__ */ new Date()).toISOString();
    await this.storage.storePersonaFile(
      name,
      "metadata.json",
      JSON.stringify(metadata, null, 2),
      this.userId
    );
    await this.storage.createPersonaDirectories("__archived__", this.userId);
    const files = await this.storage.listPersonaFiles(name, this.userId);
    for (const fileName of files) {
      const content = await this.storage.getPersonaFile(name, fileName, this.userId);
      if (content) {
        await this.storage.storePersonaFile(`__archived__/${name}`, fileName, content, this.userId);
      }
    }
    const archiveMetadata = {
      originalName: name,
      archivedAt: (/* @__PURE__ */ new Date()).toISOString(),
      reason,
      archivedBy: this.userId || "unknown"
    };
    await this.storage.storePersonaFile(
      `__archived__/${name}`,
      "archive-metadata.json",
      JSON.stringify(archiveMetadata, null, 2),
      this.userId
    );
    await this.storage.deletePersona(name, this.userId);
  }
  /**
   * Rename a persona by copying all data to new name and deleting old
   * Supports both patterns:
   * - Legacy: renamePersona() with context.input
   * - New: renamePersona(args) with explicit args
   */
  async renamePersona(args) {
    const oldName = args.personaName;
    const newName = args.newPersonaName;
    if (!oldName) {
      throw new Error("Current persona name is required");
    }
    if (!newName) {
      throw new Error("New persona name is required");
    }
    if (oldName === newName) {
      throw new Error("New name must be different from current name");
    }
    const oldPersona = await this.loadPersona({ personaName: oldName });
    if (!oldPersona) {
      throw new Error(`Persona "${oldName}" not found`);
    }
    const existingNew = await this.loadPersona({ personaName: newName });
    if (existingNew) {
      throw new Error(`Persona "${newName}" already exists`);
    }
    await this.storage.createPersonaDirectories(newName, this.userId);
    const files = await this.storage.listPersonaFiles(oldName, this.userId);
    for (const fileName of files) {
      const content = await this.storage.getPersonaFile(oldName, fileName, this.userId);
      if (content) {
        let updatedContent = content;
        if (fileName.includes("README.md")) {
          updatedContent = content.replace(new RegExp(`\\b${oldName}\\b`, "g"), newName);
        }
        await this.storage.storePersonaFile(newName, fileName, updatedContent, this.userId);
      }
    }
    const metadataContent = await this.storage.getPersonaFile(
      newName,
      "metadata.json",
      this.userId
    );
    if (metadataContent) {
      try {
        const metadata = JSON.parse(metadataContent);
        metadata.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
        await this.storage.storePersonaFile(
          newName,
          "metadata.json",
          JSON.stringify(metadata, null, 2),
          this.userId
        );
      } catch {
      }
    }
    await this.storage.deletePersona(oldName, this.userId);
  }
  /**
   * List all personas for the user
   * Supports both patterns:
   * - Legacy: listPersonas() with context.input
   * - New: listPersonas(args) with explicit args
   */
  async listPersonas(args) {
    const includeArchived = args?.includeArchived || false;
    const allPersonas = await this.storage.listPersonas(this.userId);
    const activePersonas = allPersonas.filter((persona) => persona !== "__archived__");
    if (!includeArchived) {
      return activePersonas;
    }
    const archivedPersonas = [];
    if (allPersonas.includes("__archived__")) {
      try {
        const archivedFiles = await this.storage.listPersonaFiles("__archived__", this.userId);
        const archivedPersonaNames = /* @__PURE__ */ new Set();
        for (const filePath of archivedFiles) {
          const parts = filePath.split("/");
          if (parts.length > 1) {
            archivedPersonaNames.add(parts[0]);
          }
        }
        archivedPersonaNames.forEach((name) => {
          archivedPersonas.push(`${name} (archived)`);
        });
      } catch (error) {
        this.logger?.debug("Error accessing __archived__ directory", { error });
      }
    }
    return [...activePersonas, ...archivedPersonas];
  }
  /**
   * List all files for a specific persona
   * Supports both patterns:
   * - Legacy: listPersonaFiles() with context.input
   * - New: listPersonaFiles(args) with explicit args
   */
  async listPersonaFiles(args) {
    const name = args.personaName;
    if (!name) {
      throw new Error("Persona name is required");
    }
    return await this.storage.listPersonaFiles(name, this.userId);
  }
  /**
   * Check if a persona exists
   */
  async personaExists(args) {
    const name = args.personaName;
    if (!name) {
      throw new Error("Persona name is required");
    }
    const personas = await this.listPersonas();
    return personas.includes(name);
  }
  /**
   * Load specific persona file content
   * Supports both patterns:
   * - Legacy: loadPersonaFile() with context.input
   * - New: loadPersonaFile(args) with explicit args
   */
  async loadPersonaFile(args) {
    const name = args.personaName;
    const fileName = args.fileName;
    if (!name) {
      throw new Error("Persona name is required");
    }
    if (!fileName) {
      throw new Error("File name is required");
    }
    return await this.storage.getPersonaFile(name, fileName, this.userId);
  }
  /**
   * Load persona insights data
   * Supports both patterns:
   * - Legacy: loadPersonaInsights() with context.input
   * - New: loadPersonaInsights(args) with explicit args
   */
  async loadPersonaInsights(args) {
    const name = args.personaName;
    if (!name) {
      throw new Error("Persona name is required");
    }
    const insightsRaw = await this.loadPersonaFile({ personaName: name, fileName: "insights.json" });
    if (!insightsRaw) {
      return null;
    }
    try {
      return JSON.parse(insightsRaw);
    } catch (error) {
      this.log("warn", `Failed to parse insights.json for persona ${name}:`, error);
      return null;
    }
  }
  /**
   * Load persona metadata
   * Supports both patterns:
   * - Legacy: loadPersonaMetadata() with context.input
   * - New: loadPersonaMetadata(args) with explicit args
   */
  async loadPersonaMetadata(args) {
    const name = args.personaName;
    if (!name) {
      throw new Error("Persona name is required");
    }
    const metadataRaw = await this.loadPersonaFile({ personaName: name, fileName: "metadata.json" });
    if (!metadataRaw) {
      return null;
    }
    try {
      return JSON.parse(metadataRaw);
    } catch (error) {
      this.log("warn", `Failed to parse metadata.json for persona ${name}:`, error);
      return null;
    }
  }
  /**
   * Migrate existing archived personas from old naming convention to new __archived__ directory
   */
  async migrateArchivedPersonas() {
    const allPersonas = await this.storage.listPersonas(this.userId);
    const migrated = [];
    const errors = [];
    const oldArchivedPersonas = allPersonas.filter(
      (persona) => persona.includes("-archived-") && persona !== "__archived__"
    );
    if (oldArchivedPersonas.length === 0) {
      return { migrated, errors };
    }
    await this.storage.createPersonaDirectories("__archived__", this.userId);
    for (const oldPersonaName of oldArchivedPersonas) {
      try {
        const match3 = oldPersonaName.match(/^(.+)-archived-\d{4}-\d{2}-\d{2}T/);
        if (!match3) {
          errors.push(`Could not parse original name from: ${oldPersonaName}`);
          continue;
        }
        const originalName = match3[1];
        const files = await this.storage.listPersonaFiles(oldPersonaName, this.userId);
        for (const fileName of files) {
          const content = await this.storage.getPersonaFile(oldPersonaName, fileName, this.userId);
          if (content) {
            await this.storage.storePersonaFile(
              `__archived__/${originalName}`,
              fileName,
              content,
              this.userId
            );
          }
        }
        await this.storage.deletePersona(oldPersonaName, this.userId);
        migrated.push(`${oldPersonaName} \u2192 __archived__/${originalName}`);
        this.logger?.info("Migrated archived persona", {
          old: oldPersonaName,
          new: `__archived__/${originalName}`
        });
      } catch (error) {
        const errorMsg = `Failed to migrate ${oldPersonaName}: ${error instanceof Error ? error.message : "Unknown error"}`;
        errors.push(errorMsg);
        this.logger?.error("Migration failed", { persona: oldPersonaName, error });
      }
    }
    return { migrated, errors };
  }
  /**
   * List personas with mode support (local, library, or all)
   * This is a placeholder that will be extended by the local package
   * to include library persona fetching
   */
  async listPersonasWithMode(mode = "all") {
    if (mode === "library") {
      return [];
    }
    const localPersonas = await this.listPersonas({ includeArchived: false });
    const activePersona = this.context.activePersona?.id;
    return localPersonas.map((name) => ({
      name,
      source: "local",
      isActive: name === activePersona,
      description: void 0
      // Will be populated from metadata if available
    }));
  }
  /**
   * Resolve name conflicts for library personas
   * If a local persona exists with the desired name, append :library
   */
  async resolveLibraryPersonaName(desiredName) {
    const existing = await this.loadPersona({ personaName: desiredName });
    if (!existing) {
      return desiredName;
    }
    const libraryName = `${desiredName}:library`;
    const libraryExists = await this.loadPersona({ personaName: libraryName });
    if (!libraryExists) {
      return libraryName;
    }
    let attempt = 2;
    let newName = `${desiredName}:library-${attempt}`;
    while (await this.loadPersona({ personaName: newName })) {
      attempt++;
      newName = `${desiredName}:library-${attempt}`;
    }
    return newName;
  }
  /**
   * Create a local persona from library content
   * Adds USER-BLOCK and tracks library source in metadata
   */
  async importLibraryPersona(libraryPersona, forceName) {
    const localName = forceName || await this.resolveLibraryPersonaName(libraryPersona.name);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const profileContent = `# ${localName}

${libraryPersona.profile}

<!-- USER-BLOCK-START -->
## User Metadata
- Created: ${now}
- Modified: ${now}
- Source: Library (${libraryPersona.id} v${libraryPersona.version})

## User Rules
<!-- User can add custom rules here -->

## User Details
<!-- User can add custom details here -->
<!-- USER-BLOCK-END -->`;
    await this.createPersona({
      personaName: localName,
      profile: profileContent
    });
    const metadata = {
      id: localName,
      name: localName,
      description: libraryPersona.description,
      created: now,
      lastUpdated: now,
      sourceLibrary: {
        id: libraryPersona.id,
        name: libraryPersona.name,
        version: libraryPersona.version,
        importedAt: now
      }
    };
    await this.storage.storePersonaFile(
      localName,
      "metadata.json",
      JSON.stringify(metadata, null, 2),
      this.userId
    );
    return localName;
  }
};

// packages/tiny-brain-core/src/modules/planning/phase-extractor.ts
async function extractFeaturesFromText(text) {
  try {
    const features = [];
    const lines = text.split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();
      let match3 = trimmedLine.match(/^\d+\.\s+(.+)$/);
      if (match3) {
        features.push(match3[1].trim());
        continue;
      }
      match3 = trimmedLine.match(/(?:Feature|Step|Stage)\s*\d+[:.]?\s*(.+)/i);
      if (match3) {
        features.push(match3[1].trim());
        continue;
      }
      match3 = trimmedLine.match(/^[-*]\s+Feature\s*[:.]?\s*(.+)$/i);
      if (match3) {
        features.push(match3[1].trim());
        continue;
      }
      match3 = trimmedLine.match(/^(?:Week|Day|Part|Section)\s*\d+[:.]\s*(.+)$/i);
      if (match3) {
        features.push(match3[1].trim());
        continue;
      }
      match3 = trimmedLine.match(/^(?:[IVXLCDM]+|[A-Z])[:.)]\s+(.+)$/);
      if (match3) {
        features.push(match3[1].trim());
        continue;
      }
      match3 = trimmedLine.match(
        /^[-*•]\s+(Planning|Research|Design|Develop|Test|Deploy|Review|Prepare|Execute|Implement|Build|Create|Analyze|Setup|Configure)\s+(.+)$/i
      );
      if (match3) {
        features.push(`${match3[1]} ${match3[2]}`.trim());
        continue;
      }
    }
    if (features.length === 0) {
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.match(/^(then|next|after|finally)/i)) {
          const feature = trimmedLine.replace(/^(then|next|after|finally)\s*/i, "").trim();
          if (feature) features.push(feature);
        }
        if (trimmedLine.length > 3 && trimmedLine.length < 50 && trimmedLine.endsWith(":")) {
          features.push(trimmedLine.slice(0, -1).trim());
        }
      }
    }
    if (features.length === 0) {
      features.push("Initial Planning and Setup");
    }
    return ResultHelpers.ok(features);
  } catch (error) {
    return ResultHelpers.err(
      new Error(
        `Failed to extract features: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
  }
}

// packages/tiny-brain-core/src/modules/planning/plan-formatter.ts
async function generateStatusReport(plan) {
  try {
    const state = plan.currentState;
    const lines = [];
    lines.push(`\u{1F4CB} **${plan.title}**`);
    lines.push(
      `Progress: ${state.overallProgress.percentComplete}% (${state.overallProgress.completedFeatures}/${state.overallProgress.totalFeatures} features, ${state.overallProgress.completedTasks}/${state.overallProgress.totalTasks} tasks)`
    );
    lines.push("");
    if (state.feature && state.featureTitle) {
      const currentFeature = plan.features?.find((f) => f.number === state.feature);
      if (currentFeature && currentFeature.tasks) {
        const featureCompleted = currentFeature.tasks.filter((t) => t.status === "completed").length;
        const featureTotal = currentFeature.tasks.length;
        const featurePercent = featureTotal > 0 ? Math.round(featureCompleted / featureTotal * 100) : 0;
        lines.push(`\u{1F504} Current Feature: ${state.featureTitle}`);
        if (featureTotal > 0) {
          lines.push(`   Feature Progress: ${featurePercent}% (${featureCompleted}/${featureTotal} tasks)`);
        }
        if (state.workRemaining.currentFeatureTasks > 0) {
          lines.push(`   Remaining tasks: ${state.workRemaining.currentFeatureTasks}`);
        }
      } else {
        lines.push(`\u{1F504} Current Feature: ${state.featureTitle}`);
      }
      lines.push("");
    }
    if (state.nextAction) {
      lines.push("\u27A1\uFE0F Next Action:");
      lines.push(`   ${state.nextAction.description}`);
      if (state.nextAction.priority) {
        lines.push(`   Priority: ${state.nextAction.priority}`);
      }
      if (state.nextAction.estimatedHours) {
        lines.push(`   Estimated: ${state.nextAction.estimatedHours} hours`);
      }
      lines.push("");
    }
    if (state.blockers?.length) {
      lines.push("\u{1F6AB} Blockers:");
      state.blockers.forEach((blocker) => {
        lines.push(`   - ${blocker.description} (${blocker.severity})`);
      });
      lines.push("");
    }
    if (state.workRemaining?.pendingFeatures && state.workRemaining.pendingFeatures.length > 0) {
      lines.push("\u{1F4C5} Upcoming Features:");
      state.workRemaining.pendingFeatures.slice(0, 3).forEach((feature) => {
        lines.push(`   - ${feature}`);
      });
      if (state.workRemaining.pendingFeatures.length > 3) {
        lines.push(`   ... and ${state.workRemaining.pendingFeatures.length - 3} more`);
      }
    }
    return ResultHelpers.ok(lines.join("\n"));
  } catch (error) {
    return ResultHelpers.err(
      new Error(
        `Failed to generate status report: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
  }
}
async function formatPlan(plan, options = {}) {
  try {
    const lines = [];
    lines.push(`# ${plan.title}`);
    lines.push("");
    lines.push(`**Status:** ${plan.status}`);
    lines.push(`**Created:** ${new Date(plan.created).toLocaleDateString()}`);
    lines.push(`**Last Updated:** ${new Date(plan.lastUpdated).toLocaleDateString()}`);
    lines.push("");
    lines.push("## Overview");
    lines.push(plan.overview);
    lines.push("");
    lines.push("## Current Status");
    lines.push(`Feature ${plan.currentState.feature}: ${plan.currentState.featureTitle}`);
    lines.push(`Overall Progress: ${plan.currentState.overallProgress.percentComplete}%`);
    if (plan.currentState.nextAction) {
      lines.push("");
      lines.push("### Next Action");
      lines.push(`- ${plan.currentState.nextAction.description}`);
    }
    if (plan.currentState.blockers?.length) {
      lines.push("");
      lines.push("### Blockers");
      plan.currentState.blockers.forEach((blocker) => {
        lines.push(`- ${blocker.description} (${blocker.severity})`);
      });
    }
    lines.push("");
    lines.push("## Features");
    lines.push("");
    if (plan.features) {
      plan.features.forEach((feature) => {
        lines.push(`### Feature ${feature.number}: ${feature.title} [${feature.status}]`);
        if (feature.description) {
          lines.push(feature.description);
        }
        if (feature.tasks && feature.tasks.length > 0) {
          lines.push("");
          lines.push("**Tasks:**");
          const maxTasks = options.maxTasksPerFeature || feature.tasks.length;
          const tasksToShow = feature.tasks.slice(0, maxTasks);
          tasksToShow.forEach((task) => {
            const checkbox = task.status === "completed" ? "[x]" : "[ ]";
            lines.push(`- ${checkbox} ${task.description}`);
          });
          if (feature.tasks.length > maxTasks) {
            lines.push(`... and ${feature.tasks.length - maxTasks} more tasks`);
          }
        }
        lines.push("");
      });
    }
    if (options.includeStats) {
      lines.push("## Statistics");
      lines.push(`- Total Features: ${plan.features?.length || 0}`);
      lines.push(`- Total Tasks: ${plan.currentState.overallProgress.totalTasks}`);
      lines.push(`- Completed Tasks: ${plan.currentState.overallProgress.completedTasks}`);
      lines.push(`- Completion Rate: ${plan.currentState.overallProgress.percentComplete}%`);
    }
    return ResultHelpers.ok(lines.join("\n"));
  } catch (error) {
    return ResultHelpers.err(
      new Error(`Failed to format plan: ${error instanceof Error ? error.message : "Unknown error"}`)
    );
  }
}
async function formatPlanStructure(plan) {
  try {
    const structure = {
      id: plan.id,
      title: plan.title,
      features: (plan.features || []).map((feature) => ({
        number: feature.number,
        title: feature.title,
        status: feature.status,
        tasks: (feature.tasks || []).map((task) => ({
          id: task.id,
          description: task.description,
          status: task.status
        }))
      }))
    };
    return ResultHelpers.ok(JSON.stringify(structure, null, 2));
  } catch (error) {
    return ResultHelpers.err(
      new Error(
        `Failed to format plan structure: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
  }
}

// packages/tiny-brain-core/src/modules/planning/plan-updater.ts
async function applyBulkUpdates(input) {
  try {
    let updatedPlan = JSON.parse(JSON.stringify(input.plan));
    const changes = {};
    if (input.updates.overview !== void 0) {
      updatedPlan.overview = input.updates.overview;
      changes.overviewUpdated = true;
    }
    if (input.updates.addFeature) {
      const newFeature = {
        id: `feature-${updatedPlan.features.length + 1}`,
        number: updatedPlan.features.length + 1,
        title: input.updates.addFeature.title,
        description: input.updates.addFeature.description || "",
        status: "defined",
        tasks: [],
        taskSummary: {
          total: 0,
          completed: 0,
          remaining: 0
        }
      };
      updatedPlan.features.push(newFeature);
      changes.featureAdded = newFeature;
    }
    if (input.updates.updateFeature || input.updates.updateFeatures) {
      changes.featuresUpdated = [];
    }
    if (input.updates.updateFeature) {
      const result = await applyFeatureUpdate(updatedPlan, input.updates.updateFeature, changes);
      if (!result.success) {
        return result;
      }
      updatedPlan = result.data.plan;
    }
    if (input.updates.updateFeatures) {
      for (const featureUpdate of input.updates.updateFeatures) {
        const result = await applyFeatureUpdate(updatedPlan, featureUpdate, changes);
        if (!result.success) {
          return result;
        }
        updatedPlan = result.data.plan;
      }
    }
    updatedPlan.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    updatedPlan.currentState = calculateCurrentState(updatedPlan);
    const progressPercent = updatedPlan.currentState.overallProgress.percentComplete;
    if (progressPercent === 0) {
      updatedPlan.status = "not_started";
    } else if (progressPercent === 100) {
      updatedPlan.status = "complete";
    } else {
      updatedPlan.status = "in_progress";
    }
    if (updatedPlan.metadata) {
      updatedPlan.metadata.totalFeatures = updatedPlan.features.length;
      updatedPlan.metadata.completedFeatures = updatedPlan.features.filter((f) => f.status === "completed").length;
      updatedPlan.metadata.totalTasks = updatedPlan.features.reduce((sum, f) => sum + f.tasks.length, 0);
      updatedPlan.metadata.completedTasks = updatedPlan.features.reduce((sum, f) => sum + f.tasks.filter((t) => t.status === "completed").length, 0);
    }
    return ResultHelpers.ok({ plan: updatedPlan, changes });
  } catch (error) {
    return ResultHelpers.err(
      new Error(
        `Failed to apply bulk updates: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
  }
}
async function applyFeatureUpdate(plan, update, bulkChanges) {
  try {
    const feature = plan.features.find((f) => f.number === update.featureNumber);
    if (!feature) {
      return ResultHelpers.err(new Error(`Feature ${update.featureNumber} not found`));
    }
    const featureChanges = {
      feature,
      tasksAdded: [],
      tasksCompleted: []
    };
    const oldStatus = feature.status;
    if (update.status) {
      if (update.status === "completed" && feature.tasks.length > 0) {
        const hasIncompleteTasks = feature.tasks.some((t) => t.status !== "completed");
        if (hasIncompleteTasks) {
          return ResultHelpers.err(
            new Error(
              `Cannot mark feature ${update.featureNumber} as completed: feature has incomplete tasks`
            )
          );
        }
      }
      feature.status = update.status;
    }
    if (update.addTask) {
      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        description: update.addTask,
        status: "defined",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      feature.tasks.push(newTask);
      featureChanges.tasksAdded.push(newTask);
    }
    if (update.addTasks && update.addTasks.length > 0) {
      for (const taskDescription of update.addTasks) {
        const newTask = {
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          description: taskDescription,
          status: "defined",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        feature.tasks.push(newTask);
        featureChanges.tasksAdded.push(newTask);
      }
    }
    if (update.updateTask) {
      const task = feature.tasks.find((t) => t.id === update.updateTask?.id);
      if (task) {
        if (update.updateTask.status !== void 0) {
          const wasCompleted = task.status === "completed";
          task.status = update.updateTask.status;
          if (task.status === "completed" && !wasCompleted) {
            task.completedAt = (/* @__PURE__ */ new Date()).toISOString();
            featureChanges.tasksCompleted.push(task);
          }
        }
        if (update.updateTask.testCommitSha !== void 0) {
          task.testCommitSha = update.updateTask.testCommitSha;
        }
        if (update.updateTask.testCommittedAt !== void 0) {
          task.testCommittedAt = update.updateTask.testCommittedAt;
        }
        if (update.updateTask.commitSha !== void 0) {
          task.commitSha = update.updateTask.commitSha;
        }
        if (update.updateTask.committedAt !== void 0) {
          task.committedAt = update.updateTask.committedAt;
        }
        if (update.updateTask.refactorCommitSha !== void 0) {
          task.refactorCommitSha = update.updateTask.refactorCommitSha;
        }
        if (update.updateTask.refactorCommittedAt !== void 0) {
          task.refactorCommittedAt = update.updateTask.refactorCommittedAt;
        }
      }
    }
    if (feature.tasks.length > 0) {
      const allCompleted = feature.tasks.every((t) => t.status === "completed");
      const someStarted = feature.tasks.some((t) => t.status === "tested" || t.status === "completed");
      if (allCompleted && feature.status !== "completed") {
        feature.status = "completed";
      } else if (someStarted && feature.status === "defined") {
        feature.status = "tested";
      }
    }
    const completedCount = feature.tasks.filter((t) => t.status === "completed").length;
    feature.taskSummary = {
      total: feature.tasks.length,
      completed: completedCount,
      remaining: feature.tasks.length - completedCount,
      nextTask: feature.tasks.find((t) => t.status !== "completed")?.description
    };
    if (feature.status !== oldStatus) {
      featureChanges.statusChanged = true;
      featureChanges.oldStatus = oldStatus;
      featureChanges.newStatus = feature.status;
    }
    if (featureChanges.tasksAdded.length > 0 || featureChanges.tasksCompleted.length > 0 || featureChanges.statusChanged) {
      if (bulkChanges.featuresUpdated) {
        bulkChanges.featuresUpdated.push(featureChanges);
      }
    }
    return ResultHelpers.ok({ plan });
  } catch (error) {
    return ResultHelpers.err(
      new Error(
        `Failed to apply feature update: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
  }
}
function calculateCurrentState(plan) {
  const isTaskDone = (status) => status === "completed" || status === "superseded";
  const isFeatureDone = (status) => status === "completed" || status === "superseded";
  const completedFeatures = plan.features.filter((f) => isFeatureDone(f.status)).length;
  const totalFeatures = plan.features.length;
  const completedTasks = plan.features.reduce(
    (sum, feature) => sum + feature.tasks.filter((t) => isTaskDone(t.status)).length,
    0
  );
  const totalTasks = plan.features.reduce((sum, feature) => sum + feature.tasks.length, 0);
  const percentComplete = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0;
  const currentFeature = plan.features.find((f) => f.status === "tested") || plan.features.find((f) => f.status === "defined") || plan.features[plan.features.length - 1];
  const currentFeatureNumber = currentFeature?.number || 1;
  const currentFeatureTitle = currentFeature?.title || "";
  let nextAction;
  if (currentFeature) {
    const nextTask = currentFeature.tasks.find((t) => !isTaskDone(t.status));
    if (nextTask) {
      nextAction = {
        featureId: currentFeature.id,
        taskId: nextTask.id,
        description: nextTask.description,
        priority: nextTask.priority,
        estimatedHours: nextTask.estimatedHours
      };
    }
  }
  const pendingFeatures = plan.features.filter((f) => f.status === "defined").map((f) => f.title);
  const currentFeatureTasks = currentFeature ? currentFeature.tasks.filter((t) => t.status !== "completed").length : 0;
  return {
    feature: currentFeatureNumber,
    featureTitle: currentFeatureTitle,
    overallProgress: {
      completedFeatures,
      totalFeatures,
      completedTasks,
      totalTasks,
      percentComplete
    },
    workRemaining: {
      pendingFeatures,
      currentFeatureTasks,
      futureFeatureTasks: plan.features.filter((f) => f.status === "defined" && f.number > currentFeatureNumber).reduce((sum, f) => sum + f.tasks.length, 0)
    },
    nextAction,
    blockers: []
  };
}

// packages/tiny-brain-core/src/modules/planning/prd-template.ts
function generatePRDFrontmatter(frontmatter) {
  return `---
id: ${frontmatter.id}
title: ${frontmatter.title}
version: ${frontmatter.version}
status: ${frontmatter.status}
created: ${frontmatter.created}
updated: ${frontmatter.updated}
author: ${frontmatter.author}
---`;
}
function generateFeaturesSection(features) {
  if (features.length === 0) {
    return `## Features and Functionality

*No features defined yet.*`;
  }
  const featureLinks = features.map((feature, index) => {
    const statusEmoji = feature.status === "completed" ? "\u2705" : feature.status === "tested" ? "\u{1F504}" : "\u{1F4CB}";
    return `### Feature ${index + 1}: ${feature.title}
**File**: [${feature.filePath}](${feature.filePath})
**Status**: ${statusEmoji} ${feature.status}
**Description**: [Add description]`;
  }).join("\n\n");
  return `## Features and Functionality

${featureLinks}`;
}
function generatePRD(options) {
  const {
    frontmatter,
    purpose = "Define the purpose and goals of this product/feature.",
    userNeeds = "Describe target audience and user stories.",
    features = [],
    design = "Describe design approach, wireframes, and UX considerations.",
    releaseCriteria = "Define functional, usability, and technical requirements.",
    successMetrics = "Define KPIs to measure success.",
    constraints = "List technical constraints, dependencies, and limitations."
  } = options;
  const frontmatterYaml = generatePRDFrontmatter(frontmatter);
  const featuresSection = generateFeaturesSection(features);
  return `${frontmatterYaml}

# ${frontmatter.title}

## Purpose and Goals

${purpose}

## User Needs

${userNeeds}

${featuresSection}

## Design and User Experience

${design}

## Release Criteria

${releaseCriteria}

## Success Metrics (KPIs)

${successMetrics}

## Constraints and Dependencies

${constraints}
`;
}

// packages/tiny-brain-core/src/modules/planning/feature-template.ts
function generateFeatureFrontmatter(frontmatter) {
  return `---
id: ${frontmatter.id}
prd_id: ${frontmatter.prd_id}
title: ${frontmatter.title}
status: ${frontmatter.status}
created: ${frontmatter.created}
updated: ${frontmatter.updated}
---`;
}
function generateTasksSection(tasks) {
  if (tasks.length === 0) {
    return `## Tasks

*No tasks defined yet.*`;
  }
  const taskList = tasks.map((task, index) => {
    const taskNumber = index + 1;
    const commitInfo = task.commitSha ? ` (${task.commitSha.substring(0, 7)})` : "";
    const statusEmoji = task.status === "completed" ? "\u2705" : task.status === "tested" ? "\u{1F504}" : "\u{1F4CB}";
    return `### ${taskNumber}. ${task.description}${commitInfo}
${statusEmoji} **Status**: ${task.status}

**Files to modify**: [List files]

**Expected changes**: [Describe changes]`;
  }).join("\n\n");
  return `## Tasks

${taskList}`;
}
function generateAcceptanceCriteriaSection(criteria) {
  if (criteria.length === 0) {
    return `## Acceptance Criteria

- Define success criteria for this feature`;
  }
  const criteriaList = criteria.map((criterion) => `- ${criterion}`).join("\n");
  return `## Acceptance Criteria

${criteriaList}`;
}
function generateDependenciesSection(dependencies) {
  if (dependencies.length === 0) {
    return `## Dependencies

- None (foundational feature)`;
  }
  const depList = dependencies.map((dep) => `- ${dep}`).join("\n");
  return `## Dependencies

${depList}`;
}
function generateFeature(options) {
  const {
    frontmatter,
    description = "Describe the feature and its implementation approach.",
    acceptanceCriteria = [],
    tasks = [],
    dependencies = [],
    testingStrategy = "Describe testing approach (unit tests, integration tests, etc.)"
  } = options;
  const frontmatterYaml = generateFeatureFrontmatter(frontmatter);
  const criteriaSection = generateAcceptanceCriteriaSection(acceptanceCriteria);
  const tasksSection = generateTasksSection(tasks);
  const depsSection = generateDependenciesSection(dependencies);
  return `${frontmatterYaml}

# Feature: ${frontmatter.title}

## Description

${description}

${criteriaSection}

${tasksSection}

${depsSection}

## Testing Strategy

${testingStrategy}
`;
}

// packages/tiny-brain-core/src/services/planning/planning-service.ts
import { promises as fs } from "fs";
import path2 from "path";

// packages/tiny-brain-core/node_modules/minimatch/dist/esm/index.js
var import_brace_expansion = __toESM(require_brace_expansion(), 1);

// packages/tiny-brain-core/node_modules/minimatch/dist/esm/assert-valid-pattern.js
var MAX_PATTERN_LENGTH = 1024 * 64;
var assertValidPattern = (pattern) => {
  if (typeof pattern !== "string") {
    throw new TypeError("invalid pattern");
  }
  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError("pattern is too long");
  }
};

// packages/tiny-brain-core/node_modules/minimatch/dist/esm/brace-expressions.js
var posixClasses = {
  "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", true],
  "[:alpha:]": ["\\p{L}\\p{Nl}", true],
  "[:ascii:]": ["\\x00-\\x7f", false],
  "[:blank:]": ["\\p{Zs}\\t", true],
  "[:cntrl:]": ["\\p{Cc}", true],
  "[:digit:]": ["\\p{Nd}", true],
  "[:graph:]": ["\\p{Z}\\p{C}", true, true],
  "[:lower:]": ["\\p{Ll}", true],
  "[:print:]": ["\\p{C}", true],
  "[:punct:]": ["\\p{P}", true],
  "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", true],
  "[:upper:]": ["\\p{Lu}", true],
  "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", true],
  "[:xdigit:]": ["A-Fa-f0-9", false]
};
var braceEscape = (s) => s.replace(/[[\]\\-]/g, "\\$&");
var regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var rangesToString = (ranges) => ranges.join("");
var parseClass = (glob2, position) => {
  const pos = position;
  if (glob2.charAt(pos) !== "[") {
    throw new Error("not in a brace expression");
  }
  const ranges = [];
  const negs = [];
  let i = pos + 1;
  let sawStart = false;
  let uflag = false;
  let escaping = false;
  let negate = false;
  let endPos = pos;
  let rangeStart = "";
  WHILE: while (i < glob2.length) {
    const c = glob2.charAt(i);
    if ((c === "!" || c === "^") && i === pos + 1) {
      negate = true;
      i++;
      continue;
    }
    if (c === "]" && sawStart && !escaping) {
      endPos = i + 1;
      break;
    }
    sawStart = true;
    if (c === "\\") {
      if (!escaping) {
        escaping = true;
        i++;
        continue;
      }
    }
    if (c === "[" && !escaping) {
      for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
        if (glob2.startsWith(cls, i)) {
          if (rangeStart) {
            return ["$.", false, glob2.length - pos, true];
          }
          i += cls.length;
          if (neg)
            negs.push(unip);
          else
            ranges.push(unip);
          uflag = uflag || u;
          continue WHILE;
        }
      }
    }
    escaping = false;
    if (rangeStart) {
      if (c > rangeStart) {
        ranges.push(braceEscape(rangeStart) + "-" + braceEscape(c));
      } else if (c === rangeStart) {
        ranges.push(braceEscape(c));
      }
      rangeStart = "";
      i++;
      continue;
    }
    if (glob2.startsWith("-]", i + 1)) {
      ranges.push(braceEscape(c + "-"));
      i += 2;
      continue;
    }
    if (glob2.startsWith("-", i + 1)) {
      rangeStart = c;
      i += 2;
      continue;
    }
    ranges.push(braceEscape(c));
    i++;
  }
  if (endPos < i) {
    return ["", false, 0, false];
  }
  if (!ranges.length && !negs.length) {
    return ["$.", false, glob2.length - pos, true];
  }
  if (negs.length === 0 && ranges.length === 1 && /^\\?.$/.test(ranges[0]) && !negate) {
    const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
    return [regexpEscape(r), false, endPos - pos, false];
  }
  const sranges = "[" + (negate ? "^" : "") + rangesToString(ranges) + "]";
  const snegs = "[" + (negate ? "" : "^") + rangesToString(negs) + "]";
  const comb = ranges.length && negs.length ? "(" + sranges + "|" + snegs + ")" : ranges.length ? sranges : snegs;
  return [comb, uflag, endPos - pos, true];
};

// packages/tiny-brain-core/node_modules/minimatch/dist/esm/unescape.js
var unescape = (s, { windowsPathsNoEscape = false } = {}) => {
  return windowsPathsNoEscape ? s.replace(/\[([^\/\\])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2").replace(/\\([^\/])/g, "$1");
};

// packages/tiny-brain-core/node_modules/minimatch/dist/esm/ast.js
var types = /* @__PURE__ */ new Set(["!", "?", "+", "*", "@"]);
var isExtglobType = (c) => types.has(c);
var startNoTraversal = "(?!(?:^|/)\\.\\.?(?:$|/))";
var startNoDot = "(?!\\.)";
var addPatternStart = /* @__PURE__ */ new Set(["[", "."]);
var justDots = /* @__PURE__ */ new Set(["..", "."]);
var reSpecials = new Set("().*{}+?[]^$\\!");
var regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var qmark = "[^/]";
var star = qmark + "*?";
var starNoEmpty = qmark + "+?";
var AST = class _AST {
  type;
  #root;
  #hasMagic;
  #uflag = false;
  #parts = [];
  #parent;
  #parentIndex;
  #negs;
  #filledNegs = false;
  #options;
  #toString;
  // set to true if it's an extglob with no children
  // (which really means one child of '')
  #emptyExt = false;
  constructor(type, parent, options = {}) {
    this.type = type;
    if (type)
      this.#hasMagic = true;
    this.#parent = parent;
    this.#root = this.#parent ? this.#parent.#root : this;
    this.#options = this.#root === this ? options : this.#root.#options;
    this.#negs = this.#root === this ? [] : this.#root.#negs;
    if (type === "!" && !this.#root.#filledNegs)
      this.#negs.push(this);
    this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
  }
  get hasMagic() {
    if (this.#hasMagic !== void 0)
      return this.#hasMagic;
    for (const p of this.#parts) {
      if (typeof p === "string")
        continue;
      if (p.type || p.hasMagic)
        return this.#hasMagic = true;
    }
    return this.#hasMagic;
  }
  // reconstructs the pattern
  toString() {
    if (this.#toString !== void 0)
      return this.#toString;
    if (!this.type) {
      return this.#toString = this.#parts.map((p) => String(p)).join("");
    } else {
      return this.#toString = this.type + "(" + this.#parts.map((p) => String(p)).join("|") + ")";
    }
  }
  #fillNegs() {
    if (this !== this.#root)
      throw new Error("should only call on root");
    if (this.#filledNegs)
      return this;
    this.toString();
    this.#filledNegs = true;
    let n;
    while (n = this.#negs.pop()) {
      if (n.type !== "!")
        continue;
      let p = n;
      let pp = p.#parent;
      while (pp) {
        for (let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) {
          for (const part of n.#parts) {
            if (typeof part === "string") {
              throw new Error("string part in extglob AST??");
            }
            part.copyIn(pp.#parts[i]);
          }
        }
        p = pp;
        pp = p.#parent;
      }
    }
    return this;
  }
  push(...parts) {
    for (const p of parts) {
      if (p === "")
        continue;
      if (typeof p !== "string" && !(p instanceof _AST && p.#parent === this)) {
        throw new Error("invalid part: " + p);
      }
      this.#parts.push(p);
    }
  }
  toJSON() {
    const ret = this.type === null ? this.#parts.slice().map((p) => typeof p === "string" ? p : p.toJSON()) : [this.type, ...this.#parts.map((p) => p.toJSON())];
    if (this.isStart() && !this.type)
      ret.unshift([]);
    if (this.isEnd() && (this === this.#root || this.#root.#filledNegs && this.#parent?.type === "!")) {
      ret.push({});
    }
    return ret;
  }
  isStart() {
    if (this.#root === this)
      return true;
    if (!this.#parent?.isStart())
      return false;
    if (this.#parentIndex === 0)
      return true;
    const p = this.#parent;
    for (let i = 0; i < this.#parentIndex; i++) {
      const pp = p.#parts[i];
      if (!(pp instanceof _AST && pp.type === "!")) {
        return false;
      }
    }
    return true;
  }
  isEnd() {
    if (this.#root === this)
      return true;
    if (this.#parent?.type === "!")
      return true;
    if (!this.#parent?.isEnd())
      return false;
    if (!this.type)
      return this.#parent?.isEnd();
    const pl = this.#parent ? this.#parent.#parts.length : 0;
    return this.#parentIndex === pl - 1;
  }
  copyIn(part) {
    if (typeof part === "string")
      this.push(part);
    else
      this.push(part.clone(this));
  }
  clone(parent) {
    const c = new _AST(this.type, parent);
    for (const p of this.#parts) {
      c.copyIn(p);
    }
    return c;
  }
  static #parseAST(str, ast, pos, opt) {
    let escaping = false;
    let inBrace = false;
    let braceStart = -1;
    let braceNeg = false;
    if (ast.type === null) {
      let i2 = pos;
      let acc2 = "";
      while (i2 < str.length) {
        const c = str.charAt(i2++);
        if (escaping || c === "\\") {
          escaping = !escaping;
          acc2 += c;
          continue;
        }
        if (inBrace) {
          if (i2 === braceStart + 1) {
            if (c === "^" || c === "!") {
              braceNeg = true;
            }
          } else if (c === "]" && !(i2 === braceStart + 2 && braceNeg)) {
            inBrace = false;
          }
          acc2 += c;
          continue;
        } else if (c === "[") {
          inBrace = true;
          braceStart = i2;
          braceNeg = false;
          acc2 += c;
          continue;
        }
        if (!opt.noext && isExtglobType(c) && str.charAt(i2) === "(") {
          ast.push(acc2);
          acc2 = "";
          const ext2 = new _AST(c, ast);
          i2 = _AST.#parseAST(str, ext2, i2, opt);
          ast.push(ext2);
          continue;
        }
        acc2 += c;
      }
      ast.push(acc2);
      return i2;
    }
    let i = pos + 1;
    let part = new _AST(null, ast);
    const parts = [];
    let acc = "";
    while (i < str.length) {
      const c = str.charAt(i++);
      if (escaping || c === "\\") {
        escaping = !escaping;
        acc += c;
        continue;
      }
      if (inBrace) {
        if (i === braceStart + 1) {
          if (c === "^" || c === "!") {
            braceNeg = true;
          }
        } else if (c === "]" && !(i === braceStart + 2 && braceNeg)) {
          inBrace = false;
        }
        acc += c;
        continue;
      } else if (c === "[") {
        inBrace = true;
        braceStart = i;
        braceNeg = false;
        acc += c;
        continue;
      }
      if (isExtglobType(c) && str.charAt(i) === "(") {
        part.push(acc);
        acc = "";
        const ext2 = new _AST(c, part);
        part.push(ext2);
        i = _AST.#parseAST(str, ext2, i, opt);
        continue;
      }
      if (c === "|") {
        part.push(acc);
        acc = "";
        parts.push(part);
        part = new _AST(null, ast);
        continue;
      }
      if (c === ")") {
        if (acc === "" && ast.#parts.length === 0) {
          ast.#emptyExt = true;
        }
        part.push(acc);
        acc = "";
        ast.push(...parts, part);
        return i;
      }
      acc += c;
    }
    ast.type = null;
    ast.#hasMagic = void 0;
    ast.#parts = [str.substring(pos - 1)];
    return i;
  }
  static fromGlob(pattern, options = {}) {
    const ast = new _AST(null, void 0, options);
    _AST.#parseAST(pattern, ast, 0, options);
    return ast;
  }
  // returns the regular expression if there's magic, or the unescaped
  // string if not.
  toMMPattern() {
    if (this !== this.#root)
      return this.#root.toMMPattern();
    const glob2 = this.toString();
    const [re, body, hasMagic2, uflag] = this.toRegExpSource();
    const anyMagic = hasMagic2 || this.#hasMagic || this.#options.nocase && !this.#options.nocaseMagicOnly && glob2.toUpperCase() !== glob2.toLowerCase();
    if (!anyMagic) {
      return body;
    }
    const flags = (this.#options.nocase ? "i" : "") + (uflag ? "u" : "");
    return Object.assign(new RegExp(`^${re}$`, flags), {
      _src: re,
      _glob: glob2
    });
  }
  get options() {
    return this.#options;
  }
  // returns the string match, the regexp source, whether there's magic
  // in the regexp (so a regular expression is required) and whether or
  // not the uflag is needed for the regular expression (for posix classes)
  // TODO: instead of injecting the start/end at this point, just return
  // the BODY of the regexp, along with the start/end portions suitable
  // for binding the start/end in either a joined full-path makeRe context
  // (where we bind to (^|/), or a standalone matchPart context (where
  // we bind to ^, and not /).  Otherwise slashes get duped!
  //
  // In part-matching mode, the start is:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: ^(?!\.\.?$)
  // - if dots allowed or not possible: ^
  // - if dots possible and not allowed: ^(?!\.)
  // end is:
  // - if not isEnd(): nothing
  // - else: $
  //
  // In full-path matching mode, we put the slash at the START of the
  // pattern, so start is:
  // - if first pattern: same as part-matching mode
  // - if not isStart(): nothing
  // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
  // - if dots allowed or not possible: /
  // - if dots possible and not allowed: /(?!\.)
  // end is:
  // - if last pattern, same as part-matching mode
  // - else nothing
  //
  // Always put the (?:$|/) on negated tails, though, because that has to be
  // there to bind the end of the negated pattern portion, and it's easier to
  // just stick it in now rather than try to inject it later in the middle of
  // the pattern.
  //
  // We can just always return the same end, and leave it up to the caller
  // to know whether it's going to be used joined or in parts.
  // And, if the start is adjusted slightly, can do the same there:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
  // - if dots allowed or not possible: (?:/|^)
  // - if dots possible and not allowed: (?:/|^)(?!\.)
  //
  // But it's better to have a simpler binding without a conditional, for
  // performance, so probably better to return both start options.
  //
  // Then the caller just ignores the end if it's not the first pattern,
  // and the start always gets applied.
  //
  // But that's always going to be $ if it's the ending pattern, or nothing,
  // so the caller can just attach $ at the end of the pattern when building.
  //
  // So the todo is:
  // - better detect what kind of start is needed
  // - return both flavors of starting pattern
  // - attach $ at the end of the pattern when creating the actual RegExp
  //
  // Ah, but wait, no, that all only applies to the root when the first pattern
  // is not an extglob. If the first pattern IS an extglob, then we need all
  // that dot prevention biz to live in the extglob portions, because eg
  // +(*|.x*) can match .xy but not .yx.
  //
  // So, return the two flavors if it's #root and the first child is not an
  // AST, otherwise leave it to the child AST to handle it, and there,
  // use the (?:^|/) style of start binding.
  //
  // Even simplified further:
  // - Since the start for a join is eg /(?!\.) and the start for a part
  // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
  // or start or whatever) and prepend ^ or / at the Regexp construction.
  toRegExpSource(allowDot) {
    const dot = allowDot ?? !!this.#options.dot;
    if (this.#root === this)
      this.#fillNegs();
    if (!this.type) {
      const noEmpty = this.isStart() && this.isEnd();
      const src = this.#parts.map((p) => {
        const [re, _, hasMagic2, uflag] = typeof p === "string" ? _AST.#parseGlob(p, this.#hasMagic, noEmpty) : p.toRegExpSource(allowDot);
        this.#hasMagic = this.#hasMagic || hasMagic2;
        this.#uflag = this.#uflag || uflag;
        return re;
      }).join("");
      let start2 = "";
      if (this.isStart()) {
        if (typeof this.#parts[0] === "string") {
          const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
          if (!dotTravAllowed) {
            const aps = addPatternStart;
            const needNoTrav = (
              // dots are allowed, and the pattern starts with [ or .
              dot && aps.has(src.charAt(0)) || // the pattern starts with \., and then [ or .
              src.startsWith("\\.") && aps.has(src.charAt(2)) || // the pattern starts with \.\., and then [ or .
              src.startsWith("\\.\\.") && aps.has(src.charAt(4))
            );
            const needNoDot = !dot && !allowDot && aps.has(src.charAt(0));
            start2 = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : "";
          }
        }
      }
      let end = "";
      if (this.isEnd() && this.#root.#filledNegs && this.#parent?.type === "!") {
        end = "(?:$|\\/)";
      }
      const final2 = start2 + src + end;
      return [
        final2,
        unescape(src),
        this.#hasMagic = !!this.#hasMagic,
        this.#uflag
      ];
    }
    const repeated = this.type === "*" || this.type === "+";
    const start = this.type === "!" ? "(?:(?!(?:" : "(?:";
    let body = this.#partsToRegExp(dot);
    if (this.isStart() && this.isEnd() && !body && this.type !== "!") {
      const s = this.toString();
      this.#parts = [s];
      this.type = null;
      this.#hasMagic = void 0;
      return [s, unescape(this.toString()), false, false];
    }
    let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot ? "" : this.#partsToRegExp(true);
    if (bodyDotAllowed === body) {
      bodyDotAllowed = "";
    }
    if (bodyDotAllowed) {
      body = `(?:${body})(?:${bodyDotAllowed})*?`;
    }
    let final = "";
    if (this.type === "!" && this.#emptyExt) {
      final = (this.isStart() && !dot ? startNoDot : "") + starNoEmpty;
    } else {
      const close = this.type === "!" ? (
        // !() must match something,but !(x) can match ''
        "))" + (this.isStart() && !dot && !allowDot ? startNoDot : "") + star + ")"
      ) : this.type === "@" ? ")" : this.type === "?" ? ")?" : this.type === "+" && bodyDotAllowed ? ")" : this.type === "*" && bodyDotAllowed ? `)?` : `)${this.type}`;
      final = start + body + close;
    }
    return [
      final,
      unescape(body),
      this.#hasMagic = !!this.#hasMagic,
      this.#uflag
    ];
  }
  #partsToRegExp(dot) {
    return this.#parts.map((p) => {
      if (typeof p === "string") {
        throw new Error("string type in extglob ast??");
      }
      const [re, _, _hasMagic, uflag] = p.toRegExpSource(dot);
      this.#uflag = this.#uflag || uflag;
      return re;
    }).filter((p) => !(this.isStart() && this.isEnd()) || !!p).join("|");
  }
  static #parseGlob(glob2, hasMagic2, noEmpty = false) {
    let escaping = false;
    let re = "";
    let uflag = false;
    for (let i = 0; i < glob2.length; i++) {
      const c = glob2.charAt(i);
      if (escaping) {
        escaping = false;
        re += (reSpecials.has(c) ? "\\" : "") + c;
        continue;
      }
      if (c === "\\") {
        if (i === glob2.length - 1) {
          re += "\\\\";
        } else {
          escaping = true;
        }
        continue;
      }
      if (c === "[") {
        const [src, needUflag, consumed, magic] = parseClass(glob2, i);
        if (consumed) {
          re += src;
          uflag = uflag || needUflag;
          i += consumed - 1;
          hasMagic2 = hasMagic2 || magic;
          continue;
        }
      }
      if (c === "*") {
        if (noEmpty && glob2 === "*")
          re += starNoEmpty;
        else
          re += star;
        hasMagic2 = true;
        continue;
      }
      if (c === "?") {
        re += qmark;
        hasMagic2 = true;
        continue;
      }
      re += regExpEscape(c);
    }
    return [re, unescape(glob2), !!hasMagic2, uflag];
  }
};

// packages/tiny-brain-core/node_modules/minimatch/dist/esm/escape.js
var escape = (s, { windowsPathsNoEscape = false } = {}) => {
  return windowsPathsNoEscape ? s.replace(/[?*()[\]]/g, "[$&]") : s.replace(/[?*()[\]\\]/g, "\\$&");
};

// packages/tiny-brain-core/node_modules/minimatch/dist/esm/index.js
var minimatch = (p, pattern, options = {}) => {
  assertValidPattern(pattern);
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false;
  }
  return new Minimatch(pattern, options).match(p);
};
var starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
var starDotExtTest = (ext2) => (f) => !f.startsWith(".") && f.endsWith(ext2);
var starDotExtTestDot = (ext2) => (f) => f.endsWith(ext2);
var starDotExtTestNocase = (ext2) => {
  ext2 = ext2.toLowerCase();
  return (f) => !f.startsWith(".") && f.toLowerCase().endsWith(ext2);
};
var starDotExtTestNocaseDot = (ext2) => {
  ext2 = ext2.toLowerCase();
  return (f) => f.toLowerCase().endsWith(ext2);
};
var starDotStarRE = /^\*+\.\*+$/;
var starDotStarTest = (f) => !f.startsWith(".") && f.includes(".");
var starDotStarTestDot = (f) => f !== "." && f !== ".." && f.includes(".");
var dotStarRE = /^\.\*+$/;
var dotStarTest = (f) => f !== "." && f !== ".." && f.startsWith(".");
var starRE = /^\*+$/;
var starTest = (f) => f.length !== 0 && !f.startsWith(".");
var starTestDot = (f) => f.length !== 0 && f !== "." && f !== "..";
var qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
var qmarksTestNocase = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExt([$0]);
  if (!ext2)
    return noext;
  ext2 = ext2.toLowerCase();
  return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
};
var qmarksTestNocaseDot = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExtDot([$0]);
  if (!ext2)
    return noext;
  ext2 = ext2.toLowerCase();
  return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
};
var qmarksTestDot = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExtDot([$0]);
  return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
};
var qmarksTest = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExt([$0]);
  return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
};
var qmarksTestNoExt = ([$0]) => {
  const len = $0.length;
  return (f) => f.length === len && !f.startsWith(".");
};
var qmarksTestNoExtDot = ([$0]) => {
  const len = $0.length;
  return (f) => f.length === len && f !== "." && f !== "..";
};
var defaultPlatform = typeof process === "object" && process ? typeof process.env === "object" && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix";
var path = {
  win32: { sep: "\\" },
  posix: { sep: "/" }
};
var sep = defaultPlatform === "win32" ? path.win32.sep : path.posix.sep;
minimatch.sep = sep;
var GLOBSTAR = Symbol("globstar **");
minimatch.GLOBSTAR = GLOBSTAR;
var qmark2 = "[^/]";
var star2 = qmark2 + "*?";
var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
var filter = (pattern, options = {}) => (p) => minimatch(p, pattern, options);
minimatch.filter = filter;
var ext = (a, b = {}) => Object.assign({}, a, b);
var defaults = (def) => {
  if (!def || typeof def !== "object" || !Object.keys(def).length) {
    return minimatch;
  }
  const orig = minimatch;
  const m = (p, pattern, options = {}) => orig(p, pattern, ext(def, options));
  return Object.assign(m, {
    Minimatch: class Minimatch extends orig.Minimatch {
      constructor(pattern, options = {}) {
        super(pattern, ext(def, options));
      }
      static defaults(options) {
        return orig.defaults(ext(def, options)).Minimatch;
      }
    },
    AST: class AST extends orig.AST {
      /* c8 ignore start */
      constructor(type, parent, options = {}) {
        super(type, parent, ext(def, options));
      }
      /* c8 ignore stop */
      static fromGlob(pattern, options = {}) {
        return orig.AST.fromGlob(pattern, ext(def, options));
      }
    },
    unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
    escape: (s, options = {}) => orig.escape(s, ext(def, options)),
    filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
    defaults: (options) => orig.defaults(ext(def, options)),
    makeRe: (pattern, options = {}) => orig.makeRe(pattern, ext(def, options)),
    braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
    match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
    sep: orig.sep,
    GLOBSTAR
  });
};
minimatch.defaults = defaults;
var braceExpand = (pattern, options = {}) => {
  assertValidPattern(pattern);
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    return [pattern];
  }
  return (0, import_brace_expansion.default)(pattern);
};
minimatch.braceExpand = braceExpand;
var makeRe = (pattern, options = {}) => new Minimatch(pattern, options).makeRe();
minimatch.makeRe = makeRe;
var match2 = (list, pattern, options = {}) => {
  const mm = new Minimatch(pattern, options);
  list = list.filter((f) => mm.match(f));
  if (mm.options.nonull && !list.length) {
    list.push(pattern);
  }
  return list;
};
minimatch.match = match2;
var globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
var regExpEscape2 = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var Minimatch = class {
  options;
  set;
  pattern;
  windowsPathsNoEscape;
  nonegate;
  negate;
  comment;
  empty;
  preserveMultipleSlashes;
  partial;
  globSet;
  globParts;
  nocase;
  isWindows;
  platform;
  windowsNoMagicRoot;
  regexp;
  constructor(pattern, options = {}) {
    assertValidPattern(pattern);
    options = options || {};
    this.options = options;
    this.pattern = pattern;
    this.platform = options.platform || defaultPlatform;
    this.isWindows = this.platform === "win32";
    this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
    if (this.windowsPathsNoEscape) {
      this.pattern = this.pattern.replace(/\\/g, "/");
    }
    this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
    this.regexp = null;
    this.negate = false;
    this.nonegate = !!options.nonegate;
    this.comment = false;
    this.empty = false;
    this.partial = !!options.partial;
    this.nocase = !!this.options.nocase;
    this.windowsNoMagicRoot = options.windowsNoMagicRoot !== void 0 ? options.windowsNoMagicRoot : !!(this.isWindows && this.nocase);
    this.globSet = [];
    this.globParts = [];
    this.set = [];
    this.make();
  }
  hasMagic() {
    if (this.options.magicalBraces && this.set.length > 1) {
      return true;
    }
    for (const pattern of this.set) {
      for (const part of pattern) {
        if (typeof part !== "string")
          return true;
      }
    }
    return false;
  }
  debug(..._) {
  }
  make() {
    const pattern = this.pattern;
    const options = this.options;
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    this.globSet = [...new Set(this.braceExpand())];
    if (options.debug) {
      this.debug = (...args) => console.error(...args);
    }
    this.debug(this.pattern, this.globSet);
    const rawGlobParts = this.globSet.map((s) => this.slashSplit(s));
    this.globParts = this.preprocess(rawGlobParts);
    this.debug(this.pattern, this.globParts);
    let set = this.globParts.map((s, _, __) => {
      if (this.isWindows && this.windowsNoMagicRoot) {
        const isUNC = s[0] === "" && s[1] === "" && (s[2] === "?" || !globMagic.test(s[2])) && !globMagic.test(s[3]);
        const isDrive = /^[a-z]:/i.test(s[0]);
        if (isUNC) {
          return [...s.slice(0, 4), ...s.slice(4).map((ss) => this.parse(ss))];
        } else if (isDrive) {
          return [s[0], ...s.slice(1).map((ss) => this.parse(ss))];
        }
      }
      return s.map((ss) => this.parse(ss));
    });
    this.debug(this.pattern, set);
    this.set = set.filter((s) => s.indexOf(false) === -1);
    if (this.isWindows) {
      for (let i = 0; i < this.set.length; i++) {
        const p = this.set[i];
        if (p[0] === "" && p[1] === "" && this.globParts[i][2] === "?" && typeof p[3] === "string" && /^[a-z]:$/i.test(p[3])) {
          p[2] = "?";
        }
      }
    }
    this.debug(this.pattern, this.set);
  }
  // various transforms to equivalent pattern sets that are
  // faster to process in a filesystem walk.  The goal is to
  // eliminate what we can, and push all ** patterns as far
  // to the right as possible, even if it increases the number
  // of patterns that we have to process.
  preprocess(globParts) {
    if (this.options.noglobstar) {
      for (let i = 0; i < globParts.length; i++) {
        for (let j = 0; j < globParts[i].length; j++) {
          if (globParts[i][j] === "**") {
            globParts[i][j] = "*";
          }
        }
      }
    }
    const { optimizationLevel = 1 } = this.options;
    if (optimizationLevel >= 2) {
      globParts = this.firstPhasePreProcess(globParts);
      globParts = this.secondPhasePreProcess(globParts);
    } else if (optimizationLevel >= 1) {
      globParts = this.levelOneOptimize(globParts);
    } else {
      globParts = this.adjascentGlobstarOptimize(globParts);
    }
    return globParts;
  }
  // just get rid of adjascent ** portions
  adjascentGlobstarOptimize(globParts) {
    return globParts.map((parts) => {
      let gs = -1;
      while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
        let i = gs;
        while (parts[i + 1] === "**") {
          i++;
        }
        if (i !== gs) {
          parts.splice(gs, i - gs);
        }
      }
      return parts;
    });
  }
  // get rid of adjascent ** and resolve .. portions
  levelOneOptimize(globParts) {
    return globParts.map((parts) => {
      parts = parts.reduce((set, part) => {
        const prev = set[set.length - 1];
        if (part === "**" && prev === "**") {
          return set;
        }
        if (part === "..") {
          if (prev && prev !== ".." && prev !== "." && prev !== "**") {
            set.pop();
            return set;
          }
        }
        set.push(part);
        return set;
      }, []);
      return parts.length === 0 ? [""] : parts;
    });
  }
  levelTwoFileOptimize(parts) {
    if (!Array.isArray(parts)) {
      parts = this.slashSplit(parts);
    }
    let didSomething = false;
    do {
      didSomething = false;
      if (!this.preserveMultipleSlashes) {
        for (let i = 1; i < parts.length - 1; i++) {
          const p = parts[i];
          if (i === 1 && p === "" && parts[0] === "")
            continue;
          if (p === "." || p === "") {
            didSomething = true;
            parts.splice(i, 1);
            i--;
          }
        }
        if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
          didSomething = true;
          parts.pop();
        }
      }
      let dd = 0;
      while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
        const p = parts[dd - 1];
        if (p && p !== "." && p !== ".." && p !== "**") {
          didSomething = true;
          parts.splice(dd - 1, 2);
          dd -= 2;
        }
      }
    } while (didSomething);
    return parts.length === 0 ? [""] : parts;
  }
  // First phase: single-pattern processing
  // <pre> is 1 or more portions
  // <rest> is 1 or more portions
  // <p> is any portion other than ., .., '', or **
  // <e> is . or ''
  //
  // **/.. is *brutal* for filesystem walking performance, because
  // it effectively resets the recursive walk each time it occurs,
  // and ** cannot be reduced out by a .. pattern part like a regexp
  // or most strings (other than .., ., and '') can be.
  //
  // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
  // <pre>/<e>/<rest> -> <pre>/<rest>
  // <pre>/<p>/../<rest> -> <pre>/<rest>
  // **/**/<rest> -> **/<rest>
  //
  // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
  // this WOULD be allowed if ** did follow symlinks, or * didn't
  firstPhasePreProcess(globParts) {
    let didSomething = false;
    do {
      didSomething = false;
      for (let parts of globParts) {
        let gs = -1;
        while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
          let gss = gs;
          while (parts[gss + 1] === "**") {
            gss++;
          }
          if (gss > gs) {
            parts.splice(gs + 1, gss - gs);
          }
          let next = parts[gs + 1];
          const p = parts[gs + 2];
          const p2 = parts[gs + 3];
          if (next !== "..")
            continue;
          if (!p || p === "." || p === ".." || !p2 || p2 === "." || p2 === "..") {
            continue;
          }
          didSomething = true;
          parts.splice(gs, 1);
          const other = parts.slice(0);
          other[gs] = "**";
          globParts.push(other);
          gs--;
        }
        if (!this.preserveMultipleSlashes) {
          for (let i = 1; i < parts.length - 1; i++) {
            const p = parts[i];
            if (i === 1 && p === "" && parts[0] === "")
              continue;
            if (p === "." || p === "") {
              didSomething = true;
              parts.splice(i, 1);
              i--;
            }
          }
          if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
            didSomething = true;
            parts.pop();
          }
        }
        let dd = 0;
        while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
          const p = parts[dd - 1];
          if (p && p !== "." && p !== ".." && p !== "**") {
            didSomething = true;
            const needDot = dd === 1 && parts[dd + 1] === "**";
            const splin = needDot ? ["."] : [];
            parts.splice(dd - 1, 2, ...splin);
            if (parts.length === 0)
              parts.push("");
            dd -= 2;
          }
        }
      }
    } while (didSomething);
    return globParts;
  }
  // second phase: multi-pattern dedupes
  // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
  // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
  // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
  //
  // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
  // ^-- not valid because ** doens't follow symlinks
  secondPhasePreProcess(globParts) {
    for (let i = 0; i < globParts.length - 1; i++) {
      for (let j = i + 1; j < globParts.length; j++) {
        const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
        if (matched) {
          globParts[i] = [];
          globParts[j] = matched;
          break;
        }
      }
    }
    return globParts.filter((gs) => gs.length);
  }
  partsMatch(a, b, emptyGSMatch = false) {
    let ai = 0;
    let bi = 0;
    let result = [];
    let which = "";
    while (ai < a.length && bi < b.length) {
      if (a[ai] === b[bi]) {
        result.push(which === "b" ? b[bi] : a[ai]);
        ai++;
        bi++;
      } else if (emptyGSMatch && a[ai] === "**" && b[bi] === a[ai + 1]) {
        result.push(a[ai]);
        ai++;
      } else if (emptyGSMatch && b[bi] === "**" && a[ai] === b[bi + 1]) {
        result.push(b[bi]);
        bi++;
      } else if (a[ai] === "*" && b[bi] && (this.options.dot || !b[bi].startsWith(".")) && b[bi] !== "**") {
        if (which === "b")
          return false;
        which = "a";
        result.push(a[ai]);
        ai++;
        bi++;
      } else if (b[bi] === "*" && a[ai] && (this.options.dot || !a[ai].startsWith(".")) && a[ai] !== "**") {
        if (which === "a")
          return false;
        which = "b";
        result.push(b[bi]);
        ai++;
        bi++;
      } else {
        return false;
      }
    }
    return a.length === b.length && result;
  }
  parseNegate() {
    if (this.nonegate)
      return;
    const pattern = this.pattern;
    let negate = false;
    let negateOffset = 0;
    for (let i = 0; i < pattern.length && pattern.charAt(i) === "!"; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset)
      this.pattern = pattern.slice(negateOffset);
    this.negate = negate;
  }
  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne(file, pattern, partial = false) {
    const options = this.options;
    if (this.isWindows) {
      const fileDrive = typeof file[0] === "string" && /^[a-z]:$/i.test(file[0]);
      const fileUNC = !fileDrive && file[0] === "" && file[1] === "" && file[2] === "?" && /^[a-z]:$/i.test(file[3]);
      const patternDrive = typeof pattern[0] === "string" && /^[a-z]:$/i.test(pattern[0]);
      const patternUNC = !patternDrive && pattern[0] === "" && pattern[1] === "" && pattern[2] === "?" && typeof pattern[3] === "string" && /^[a-z]:$/i.test(pattern[3]);
      const fdi = fileUNC ? 3 : fileDrive ? 0 : void 0;
      const pdi = patternUNC ? 3 : patternDrive ? 0 : void 0;
      if (typeof fdi === "number" && typeof pdi === "number") {
        const [fd, pd] = [file[fdi], pattern[pdi]];
        if (fd.toLowerCase() === pd.toLowerCase()) {
          pattern[pdi] = fd;
          if (pdi > fdi) {
            pattern = pattern.slice(pdi);
          } else if (fdi > pdi) {
            file = file.slice(fdi);
          }
        }
      }
    }
    const { optimizationLevel = 1 } = this.options;
    if (optimizationLevel >= 2) {
      file = this.levelTwoFileOptimize(file);
    }
    this.debug("matchOne", this, { file, pattern });
    this.debug("matchOne", file.length, pattern.length);
    for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      this.debug("matchOne loop");
      var p = pattern[pi];
      var f = file[fi];
      this.debug(pattern, p, f);
      if (p === false) {
        return false;
      }
      if (p === GLOBSTAR) {
        this.debug("GLOBSTAR", [pattern, p, f]);
        var fr = fi;
        var pr = pi + 1;
        if (pr === pl) {
          this.debug("** at the end");
          for (; fi < fl; fi++) {
            if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
              return false;
          }
          return true;
        }
        while (fr < fl) {
          var swallowee = file[fr];
          this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
          if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
            this.debug("globstar found match!", fr, fl, swallowee);
            return true;
          } else {
            if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
              this.debug("dot detected!", file, fr, pattern, pr);
              break;
            }
            this.debug("globstar swallow a segment, and continue");
            fr++;
          }
        }
        if (partial) {
          this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
          if (fr === fl) {
            return true;
          }
        }
        return false;
      }
      let hit;
      if (typeof p === "string") {
        hit = f === p;
        this.debug("string match", p, f, hit);
      } else {
        hit = p.test(f);
        this.debug("pattern match", p, f, hit);
      }
      if (!hit)
        return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      return fi === fl - 1 && file[fi] === "";
    } else {
      throw new Error("wtf?");
    }
  }
  braceExpand() {
    return braceExpand(this.pattern, this.options);
  }
  parse(pattern) {
    assertValidPattern(pattern);
    const options = this.options;
    if (pattern === "**")
      return GLOBSTAR;
    if (pattern === "")
      return "";
    let m;
    let fastTest = null;
    if (m = pattern.match(starRE)) {
      fastTest = options.dot ? starTestDot : starTest;
    } else if (m = pattern.match(starDotExtRE)) {
      fastTest = (options.nocase ? options.dot ? starDotExtTestNocaseDot : starDotExtTestNocase : options.dot ? starDotExtTestDot : starDotExtTest)(m[1]);
    } else if (m = pattern.match(qmarksRE)) {
      fastTest = (options.nocase ? options.dot ? qmarksTestNocaseDot : qmarksTestNocase : options.dot ? qmarksTestDot : qmarksTest)(m);
    } else if (m = pattern.match(starDotStarRE)) {
      fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
    } else if (m = pattern.match(dotStarRE)) {
      fastTest = dotStarTest;
    }
    const re = AST.fromGlob(pattern, this.options).toMMPattern();
    if (fastTest && typeof re === "object") {
      Reflect.defineProperty(re, "test", { value: fastTest });
    }
    return re;
  }
  makeRe() {
    if (this.regexp || this.regexp === false)
      return this.regexp;
    const set = this.set;
    if (!set.length) {
      this.regexp = false;
      return this.regexp;
    }
    const options = this.options;
    const twoStar = options.noglobstar ? star2 : options.dot ? twoStarDot : twoStarNoDot;
    const flags = new Set(options.nocase ? ["i"] : []);
    let re = set.map((pattern) => {
      const pp = pattern.map((p) => {
        if (p instanceof RegExp) {
          for (const f of p.flags.split(""))
            flags.add(f);
        }
        return typeof p === "string" ? regExpEscape2(p) : p === GLOBSTAR ? GLOBSTAR : p._src;
      });
      pp.forEach((p, i) => {
        const next = pp[i + 1];
        const prev = pp[i - 1];
        if (p !== GLOBSTAR || prev === GLOBSTAR) {
          return;
        }
        if (prev === void 0) {
          if (next !== void 0 && next !== GLOBSTAR) {
            pp[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + next;
          } else {
            pp[i] = twoStar;
          }
        } else if (next === void 0) {
          pp[i - 1] = prev + "(?:\\/|" + twoStar + ")?";
        } else if (next !== GLOBSTAR) {
          pp[i - 1] = prev + "(?:\\/|\\/" + twoStar + "\\/)" + next;
          pp[i + 1] = GLOBSTAR;
        }
      });
      return pp.filter((p) => p !== GLOBSTAR).join("/");
    }).join("|");
    const [open, close] = set.length > 1 ? ["(?:", ")"] : ["", ""];
    re = "^" + open + re + close + "$";
    if (this.negate)
      re = "^(?!" + re + ").+$";
    try {
      this.regexp = new RegExp(re, [...flags].join(""));
    } catch (ex) {
      this.regexp = false;
    }
    return this.regexp;
  }
  slashSplit(p) {
    if (this.preserveMultipleSlashes) {
      return p.split("/");
    } else if (this.isWindows && /^\/\/[^\/]+/.test(p)) {
      return ["", ...p.split(/\/+/)];
    } else {
      return p.split(/\/+/);
    }
  }
  match(f, partial = this.partial) {
    this.debug("match", f, this.pattern);
    if (this.comment) {
      return false;
    }
    if (this.empty) {
      return f === "";
    }
    if (f === "/" && partial) {
      return true;
    }
    const options = this.options;
    if (this.isWindows) {
      f = f.split("\\").join("/");
    }
    const ff = this.slashSplit(f);
    this.debug(this.pattern, "split", ff);
    const set = this.set;
    this.debug(this.pattern, "set", set);
    let filename = ff[ff.length - 1];
    if (!filename) {
      for (let i = ff.length - 2; !filename && i >= 0; i--) {
        filename = ff[i];
      }
    }
    for (let i = 0; i < set.length; i++) {
      const pattern = set[i];
      let file = ff;
      if (options.matchBase && pattern.length === 1) {
        file = [filename];
      }
      const hit = this.matchOne(file, pattern, partial);
      if (hit) {
        if (options.flipNegate) {
          return true;
        }
        return !this.negate;
      }
    }
    if (options.flipNegate) {
      return false;
    }
    return this.negate;
  }
  static defaults(def) {
    return minimatch.defaults(def).Minimatch;
  }
};
minimatch.AST = AST;
minimatch.Minimatch = Minimatch;
minimatch.escape = escape;
minimatch.unescape = unescape;

// packages/tiny-brain-core/node_modules/glob/dist/esm/glob.js
import { fileURLToPath as fileURLToPath2 } from "node:url";

// node_modules/lru-cache/dist/esm/index.js
var perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
var warned = /* @__PURE__ */ new Set();
var PROCESS = typeof process === "object" && !!process ? process : {};
var emitWarning = (msg, type, code, fn) => {
  typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
};
var AC = globalThis.AbortController;
var AS = globalThis.AbortSignal;
if (typeof AC === "undefined") {
  AS = class AbortSignal {
    onabort;
    _onabort = [];
    reason;
    aborted = false;
    addEventListener(_, fn) {
      this._onabort.push(fn);
    }
  };
  AC = class AbortController {
    constructor() {
      warnACPolyfill();
    }
    signal = new AS();
    abort(reason) {
      if (this.signal.aborted)
        return;
      this.signal.reason = reason;
      this.signal.aborted = true;
      for (const fn of this.signal._onabort) {
        fn(reason);
      }
      this.signal.onabort?.(reason);
    }
  };
  let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1";
  const warnACPolyfill = () => {
    if (!printACPolyfillWarning)
      return;
    printACPolyfillWarning = false;
    emitWarning("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
  };
}
var shouldWarn = (code) => !warned.has(code);
var TYPE = Symbol("type");
var isPosInt = (n) => n && n === Math.floor(n) && n > 0 && isFinite(n);
var getUintArray = (max) => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
var ZeroArray = class extends Array {
  constructor(size) {
    super(size);
    this.fill(0);
  }
};
var Stack = class _Stack {
  heap;
  length;
  // private constructor
  static #constructing = false;
  static create(max) {
    const HeapCls = getUintArray(max);
    if (!HeapCls)
      return [];
    _Stack.#constructing = true;
    const s = new _Stack(max, HeapCls);
    _Stack.#constructing = false;
    return s;
  }
  constructor(max, HeapCls) {
    if (!_Stack.#constructing) {
      throw new TypeError("instantiate Stack using Stack.create(n)");
    }
    this.heap = new HeapCls(max);
    this.length = 0;
  }
  push(n) {
    this.heap[this.length++] = n;
  }
  pop() {
    return this.heap[--this.length];
  }
};
var LRUCache = class _LRUCache {
  // options that cannot be changed without disaster
  #max;
  #maxSize;
  #dispose;
  #disposeAfter;
  #fetchMethod;
  #memoMethod;
  /**
   * {@link LRUCache.OptionsBase.ttl}
   */
  ttl;
  /**
   * {@link LRUCache.OptionsBase.ttlResolution}
   */
  ttlResolution;
  /**
   * {@link LRUCache.OptionsBase.ttlAutopurge}
   */
  ttlAutopurge;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnGet}
   */
  updateAgeOnGet;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnHas}
   */
  updateAgeOnHas;
  /**
   * {@link LRUCache.OptionsBase.allowStale}
   */
  allowStale;
  /**
   * {@link LRUCache.OptionsBase.noDisposeOnSet}
   */
  noDisposeOnSet;
  /**
   * {@link LRUCache.OptionsBase.noUpdateTTL}
   */
  noUpdateTTL;
  /**
   * {@link LRUCache.OptionsBase.maxEntrySize}
   */
  maxEntrySize;
  /**
   * {@link LRUCache.OptionsBase.sizeCalculation}
   */
  sizeCalculation;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
   */
  noDeleteOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
   */
  noDeleteOnStaleGet;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
   */
  allowStaleOnFetchAbort;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
   */
  allowStaleOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.ignoreFetchAbort}
   */
  ignoreFetchAbort;
  // computed properties
  #size;
  #calculatedSize;
  #keyMap;
  #keyList;
  #valList;
  #next;
  #prev;
  #head;
  #tail;
  #free;
  #disposed;
  #sizes;
  #starts;
  #ttls;
  #hasDispose;
  #hasFetchMethod;
  #hasDisposeAfter;
  /**
   * Do not call this method unless you need to inspect the
   * inner workings of the cache.  If anything returned by this
   * object is modified in any way, strange breakage may occur.
   *
   * These fields are private for a reason!
   *
   * @internal
   */
  static unsafeExposeInternals(c) {
    return {
      // properties
      starts: c.#starts,
      ttls: c.#ttls,
      sizes: c.#sizes,
      keyMap: c.#keyMap,
      keyList: c.#keyList,
      valList: c.#valList,
      next: c.#next,
      prev: c.#prev,
      get head() {
        return c.#head;
      },
      get tail() {
        return c.#tail;
      },
      free: c.#free,
      // methods
      isBackgroundFetch: (p) => c.#isBackgroundFetch(p),
      backgroundFetch: (k, index, options, context) => c.#backgroundFetch(k, index, options, context),
      moveToTail: (index) => c.#moveToTail(index),
      indexes: (options) => c.#indexes(options),
      rindexes: (options) => c.#rindexes(options),
      isStale: (index) => c.#isStale(index)
    };
  }
  // Protected read-only members
  /**
   * {@link LRUCache.OptionsBase.max} (read-only)
   */
  get max() {
    return this.#max;
  }
  /**
   * {@link LRUCache.OptionsBase.maxSize} (read-only)
   */
  get maxSize() {
    return this.#maxSize;
  }
  /**
   * The total computed size of items in the cache (read-only)
   */
  get calculatedSize() {
    return this.#calculatedSize;
  }
  /**
   * The number of items stored in the cache (read-only)
   */
  get size() {
    return this.#size;
  }
  /**
   * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
   */
  get fetchMethod() {
    return this.#fetchMethod;
  }
  get memoMethod() {
    return this.#memoMethod;
  }
  /**
   * {@link LRUCache.OptionsBase.dispose} (read-only)
   */
  get dispose() {
    return this.#dispose;
  }
  /**
   * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
   */
  get disposeAfter() {
    return this.#disposeAfter;
  }
  constructor(options) {
    const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, memoMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
    if (max !== 0 && !isPosInt(max)) {
      throw new TypeError("max option must be a nonnegative integer");
    }
    const UintArray = max ? getUintArray(max) : Array;
    if (!UintArray) {
      throw new Error("invalid max value: " + max);
    }
    this.#max = max;
    this.#maxSize = maxSize;
    this.maxEntrySize = maxEntrySize || this.#maxSize;
    this.sizeCalculation = sizeCalculation;
    if (this.sizeCalculation) {
      if (!this.#maxSize && !this.maxEntrySize) {
        throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
      }
      if (typeof this.sizeCalculation !== "function") {
        throw new TypeError("sizeCalculation set to non-function");
      }
    }
    if (memoMethod !== void 0 && typeof memoMethod !== "function") {
      throw new TypeError("memoMethod must be a function if defined");
    }
    this.#memoMethod = memoMethod;
    if (fetchMethod !== void 0 && typeof fetchMethod !== "function") {
      throw new TypeError("fetchMethod must be a function if specified");
    }
    this.#fetchMethod = fetchMethod;
    this.#hasFetchMethod = !!fetchMethod;
    this.#keyMap = /* @__PURE__ */ new Map();
    this.#keyList = new Array(max).fill(void 0);
    this.#valList = new Array(max).fill(void 0);
    this.#next = new UintArray(max);
    this.#prev = new UintArray(max);
    this.#head = 0;
    this.#tail = 0;
    this.#free = Stack.create(max);
    this.#size = 0;
    this.#calculatedSize = 0;
    if (typeof dispose === "function") {
      this.#dispose = dispose;
    }
    if (typeof disposeAfter === "function") {
      this.#disposeAfter = disposeAfter;
      this.#disposed = [];
    } else {
      this.#disposeAfter = void 0;
      this.#disposed = void 0;
    }
    this.#hasDispose = !!this.#dispose;
    this.#hasDisposeAfter = !!this.#disposeAfter;
    this.noDisposeOnSet = !!noDisposeOnSet;
    this.noUpdateTTL = !!noUpdateTTL;
    this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
    this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
    this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
    this.ignoreFetchAbort = !!ignoreFetchAbort;
    if (this.maxEntrySize !== 0) {
      if (this.#maxSize !== 0) {
        if (!isPosInt(this.#maxSize)) {
          throw new TypeError("maxSize must be a positive integer if specified");
        }
      }
      if (!isPosInt(this.maxEntrySize)) {
        throw new TypeError("maxEntrySize must be a positive integer if specified");
      }
      this.#initializeSizeTracking();
    }
    this.allowStale = !!allowStale;
    this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
    this.updateAgeOnGet = !!updateAgeOnGet;
    this.updateAgeOnHas = !!updateAgeOnHas;
    this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
    this.ttlAutopurge = !!ttlAutopurge;
    this.ttl = ttl || 0;
    if (this.ttl) {
      if (!isPosInt(this.ttl)) {
        throw new TypeError("ttl must be a positive integer if specified");
      }
      this.#initializeTTLTracking();
    }
    if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
      throw new TypeError("At least one of max, maxSize, or ttl is required");
    }
    if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
      const code = "LRU_CACHE_UNBOUNDED";
      if (shouldWarn(code)) {
        warned.add(code);
        const msg = "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.";
        emitWarning(msg, "UnboundedCacheWarning", code, _LRUCache);
      }
    }
  }
  /**
   * Return the number of ms left in the item's TTL. If item is not in cache,
   * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
   */
  getRemainingTTL(key) {
    return this.#keyMap.has(key) ? Infinity : 0;
  }
  #initializeTTLTracking() {
    const ttls = new ZeroArray(this.#max);
    const starts = new ZeroArray(this.#max);
    this.#ttls = ttls;
    this.#starts = starts;
    this.#setItemTTL = (index, ttl, start = perf.now()) => {
      starts[index] = ttl !== 0 ? start : 0;
      ttls[index] = ttl;
      if (ttl !== 0 && this.ttlAutopurge) {
        const t = setTimeout(() => {
          if (this.#isStale(index)) {
            this.#delete(this.#keyList[index], "expire");
          }
        }, ttl + 1);
        if (t.unref) {
          t.unref();
        }
      }
    };
    this.#updateItemAge = (index) => {
      starts[index] = ttls[index] !== 0 ? perf.now() : 0;
    };
    this.#statusTTL = (status, index) => {
      if (ttls[index]) {
        const ttl = ttls[index];
        const start = starts[index];
        if (!ttl || !start)
          return;
        status.ttl = ttl;
        status.start = start;
        status.now = cachedNow || getNow();
        const age = status.now - start;
        status.remainingTTL = ttl - age;
      }
    };
    let cachedNow = 0;
    const getNow = () => {
      const n = perf.now();
      if (this.ttlResolution > 0) {
        cachedNow = n;
        const t = setTimeout(() => cachedNow = 0, this.ttlResolution);
        if (t.unref) {
          t.unref();
        }
      }
      return n;
    };
    this.getRemainingTTL = (key) => {
      const index = this.#keyMap.get(key);
      if (index === void 0) {
        return 0;
      }
      const ttl = ttls[index];
      const start = starts[index];
      if (!ttl || !start) {
        return Infinity;
      }
      const age = (cachedNow || getNow()) - start;
      return ttl - age;
    };
    this.#isStale = (index) => {
      const s = starts[index];
      const t = ttls[index];
      return !!t && !!s && (cachedNow || getNow()) - s > t;
    };
  }
  // conditionally set private methods related to TTL
  #updateItemAge = () => {
  };
  #statusTTL = () => {
  };
  #setItemTTL = () => {
  };
  /* c8 ignore stop */
  #isStale = () => false;
  #initializeSizeTracking() {
    const sizes = new ZeroArray(this.#max);
    this.#calculatedSize = 0;
    this.#sizes = sizes;
    this.#removeItemSize = (index) => {
      this.#calculatedSize -= sizes[index];
      sizes[index] = 0;
    };
    this.#requireSize = (k, v, size, sizeCalculation) => {
      if (this.#isBackgroundFetch(v)) {
        return 0;
      }
      if (!isPosInt(size)) {
        if (sizeCalculation) {
          if (typeof sizeCalculation !== "function") {
            throw new TypeError("sizeCalculation must be a function");
          }
          size = sizeCalculation(v, k);
          if (!isPosInt(size)) {
            throw new TypeError("sizeCalculation return invalid (expect positive integer)");
          }
        } else {
          throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
        }
      }
      return size;
    };
    this.#addItemSize = (index, size, status) => {
      sizes[index] = size;
      if (this.#maxSize) {
        const maxSize = this.#maxSize - sizes[index];
        while (this.#calculatedSize > maxSize) {
          this.#evict(true);
        }
      }
      this.#calculatedSize += sizes[index];
      if (status) {
        status.entrySize = size;
        status.totalCalculatedSize = this.#calculatedSize;
      }
    };
  }
  #removeItemSize = (_i) => {
  };
  #addItemSize = (_i, _s, _st) => {
  };
  #requireSize = (_k, _v, size, sizeCalculation) => {
    if (size || sizeCalculation) {
      throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
    }
    return 0;
  };
  *#indexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i = this.#tail; true; ) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#head) {
          break;
        } else {
          i = this.#prev[i];
        }
      }
    }
  }
  *#rindexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i = this.#head; true; ) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#tail) {
          break;
        } else {
          i = this.#next[i];
        }
      }
    }
  }
  #isValidIndex(index) {
    return index !== void 0 && this.#keyMap.get(this.#keyList[index]) === index;
  }
  /**
   * Return a generator yielding `[key, value]` pairs,
   * in order from most recently used to least recently used.
   */
  *entries() {
    for (const i of this.#indexes()) {
      if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [this.#keyList[i], this.#valList[i]];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.entries}
   *
   * Return a generator yielding `[key, value]` pairs,
   * in order from least recently used to most recently used.
   */
  *rentries() {
    for (const i of this.#rindexes()) {
      if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [this.#keyList[i], this.#valList[i]];
      }
    }
  }
  /**
   * Return a generator yielding the keys in the cache,
   * in order from most recently used to least recently used.
   */
  *keys() {
    for (const i of this.#indexes()) {
      const k = this.#keyList[i];
      if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.keys}
   *
   * Return a generator yielding the keys in the cache,
   * in order from least recently used to most recently used.
   */
  *rkeys() {
    for (const i of this.#rindexes()) {
      const k = this.#keyList[i];
      if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Return a generator yielding the values in the cache,
   * in order from most recently used to least recently used.
   */
  *values() {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.values}
   *
   * Return a generator yielding the values in the cache,
   * in order from least recently used to most recently used.
   */
  *rvalues() {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Iterating over the cache itself yields the same results as
   * {@link LRUCache.entries}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * A String value that is used in the creation of the default string
   * description of an object. Called by the built-in method
   * `Object.prototype.toString`.
   */
  [Symbol.toStringTag] = "LRUCache";
  /**
   * Find a value for which the supplied fn method returns a truthy value,
   * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
   */
  find(fn, getOptions = {}) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      if (fn(value, this.#keyList[i], this)) {
        return this.get(this.#keyList[i], getOptions);
      }
    }
  }
  /**
   * Call the supplied function on each item in the cache, in order from most
   * recently used to least recently used.
   *
   * `fn` is called as `fn(value, key, cache)`.
   *
   * If `thisp` is provided, function will be called in the `this`-context of
   * the provided object, or the cache if no `thisp` object is provided.
   *
   * Does not update age or recenty of use, or iterate over stale values.
   */
  forEach(fn, thisp = this) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * The same as {@link LRUCache.forEach} but items are iterated over in
   * reverse order.  (ie, less recently used items are iterated over first.)
   */
  rforEach(fn, thisp = this) {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * Delete any stale entries. Returns true if anything was removed,
   * false otherwise.
   */
  purgeStale() {
    let deleted = false;
    for (const i of this.#rindexes({ allowStale: true })) {
      if (this.#isStale(i)) {
        this.#delete(this.#keyList[i], "expire");
        deleted = true;
      }
    }
    return deleted;
  }
  /**
   * Get the extended info about a given entry, to get its value, size, and
   * TTL info simultaneously. Returns `undefined` if the key is not present.
   *
   * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
   * serialization, the `start` value is always the current timestamp, and the
   * `ttl` is a calculated remaining time to live (negative if expired).
   *
   * Always returns stale values, if their info is found in the cache, so be
   * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
   * if relevant.
   */
  info(key) {
    const i = this.#keyMap.get(key);
    if (i === void 0)
      return void 0;
    const v = this.#valList[i];
    const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
    if (value === void 0)
      return void 0;
    const entry = { value };
    if (this.#ttls && this.#starts) {
      const ttl = this.#ttls[i];
      const start = this.#starts[i];
      if (ttl && start) {
        const remain = ttl - (perf.now() - start);
        entry.ttl = remain;
        entry.start = Date.now();
      }
    }
    if (this.#sizes) {
      entry.size = this.#sizes[i];
    }
    return entry;
  }
  /**
   * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
   * passed to {@link LRLUCache#load}.
   *
   * The `start` fields are calculated relative to a portable `Date.now()`
   * timestamp, even if `performance.now()` is available.
   *
   * Stale entries are always included in the `dump`, even if
   * {@link LRUCache.OptionsBase.allowStale} is false.
   *
   * Note: this returns an actual array, not a generator, so it can be more
   * easily passed around.
   */
  dump() {
    const arr = [];
    for (const i of this.#indexes({ allowStale: true })) {
      const key = this.#keyList[i];
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0 || key === void 0)
        continue;
      const entry = { value };
      if (this.#ttls && this.#starts) {
        entry.ttl = this.#ttls[i];
        const age = perf.now() - this.#starts[i];
        entry.start = Math.floor(Date.now() - age);
      }
      if (this.#sizes) {
        entry.size = this.#sizes[i];
      }
      arr.unshift([key, entry]);
    }
    return arr;
  }
  /**
   * Reset the cache and load in the items in entries in the order listed.
   *
   * The shape of the resulting cache may be different if the same options are
   * not used in both caches.
   *
   * The `start` fields are assumed to be calculated relative to a portable
   * `Date.now()` timestamp, even if `performance.now()` is available.
   */
  load(arr) {
    this.clear();
    for (const [key, entry] of arr) {
      if (entry.start) {
        const age = Date.now() - entry.start;
        entry.start = perf.now() - age;
      }
      this.set(key, entry.value, entry);
    }
  }
  /**
   * Add a value to the cache.
   *
   * Note: if `undefined` is specified as a value, this is an alias for
   * {@link LRUCache#delete}
   *
   * Fields on the {@link LRUCache.SetOptions} options param will override
   * their corresponding values in the constructor options for the scope
   * of this single `set()` operation.
   *
   * If `start` is provided, then that will set the effective start
   * time for the TTL calculation. Note that this must be a previous
   * value of `performance.now()` if supported, or a previous value of
   * `Date.now()` if not.
   *
   * Options object may also include `size`, which will prevent
   * calling the `sizeCalculation` function and just use the specified
   * number if it is a positive integer, and `noDisposeOnSet` which
   * will prevent calling a `dispose` function in the case of
   * overwrites.
   *
   * If the `size` (or return value of `sizeCalculation`) for a given
   * entry is greater than `maxEntrySize`, then the item will not be
   * added to the cache.
   *
   * Will update the recency of the entry.
   *
   * If the value is `undefined`, then this is an alias for
   * `cache.delete(key)`. `undefined` is never stored in the cache.
   */
  set(k, v, setOptions = {}) {
    if (v === void 0) {
      this.delete(k);
      return this;
    }
    const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
    let { noUpdateTTL = this.noUpdateTTL } = setOptions;
    const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
    if (this.maxEntrySize && size > this.maxEntrySize) {
      if (status) {
        status.set = "miss";
        status.maxEntrySizeExceeded = true;
      }
      this.#delete(k, "set");
      return this;
    }
    let index = this.#size === 0 ? void 0 : this.#keyMap.get(k);
    if (index === void 0) {
      index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
      this.#keyList[index] = k;
      this.#valList[index] = v;
      this.#keyMap.set(k, index);
      this.#next[this.#tail] = index;
      this.#prev[index] = this.#tail;
      this.#tail = index;
      this.#size++;
      this.#addItemSize(index, size, status);
      if (status)
        status.set = "add";
      noUpdateTTL = false;
    } else {
      this.#moveToTail(index);
      const oldVal = this.#valList[index];
      if (v !== oldVal) {
        if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
          oldVal.__abortController.abort(new Error("replaced"));
          const { __staleWhileFetching: s } = oldVal;
          if (s !== void 0 && !noDisposeOnSet) {
            if (this.#hasDispose) {
              this.#dispose?.(s, k, "set");
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([s, k, "set"]);
            }
          }
        } else if (!noDisposeOnSet) {
          if (this.#hasDispose) {
            this.#dispose?.(oldVal, k, "set");
          }
          if (this.#hasDisposeAfter) {
            this.#disposed?.push([oldVal, k, "set"]);
          }
        }
        this.#removeItemSize(index);
        this.#addItemSize(index, size, status);
        this.#valList[index] = v;
        if (status) {
          status.set = "replace";
          const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
          if (oldValue !== void 0)
            status.oldValue = oldValue;
        }
      } else if (status) {
        status.set = "update";
      }
    }
    if (ttl !== 0 && !this.#ttls) {
      this.#initializeTTLTracking();
    }
    if (this.#ttls) {
      if (!noUpdateTTL) {
        this.#setItemTTL(index, ttl, start);
      }
      if (status)
        this.#statusTTL(status, index);
    }
    if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return this;
  }
  /**
   * Evict the least recently used item, returning its value or
   * `undefined` if cache is empty.
   */
  pop() {
    try {
      while (this.#size) {
        const val = this.#valList[this.#head];
        this.#evict(true);
        if (this.#isBackgroundFetch(val)) {
          if (val.__staleWhileFetching) {
            return val.__staleWhileFetching;
          }
        } else if (val !== void 0) {
          return val;
        }
      }
    } finally {
      if (this.#hasDisposeAfter && this.#disposed) {
        const dt = this.#disposed;
        let task;
        while (task = dt?.shift()) {
          this.#disposeAfter?.(...task);
        }
      }
    }
  }
  #evict(free) {
    const head = this.#head;
    const k = this.#keyList[head];
    const v = this.#valList[head];
    if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
      v.__abortController.abort(new Error("evicted"));
    } else if (this.#hasDispose || this.#hasDisposeAfter) {
      if (this.#hasDispose) {
        this.#dispose?.(v, k, "evict");
      }
      if (this.#hasDisposeAfter) {
        this.#disposed?.push([v, k, "evict"]);
      }
    }
    this.#removeItemSize(head);
    if (free) {
      this.#keyList[head] = void 0;
      this.#valList[head] = void 0;
      this.#free.push(head);
    }
    if (this.#size === 1) {
      this.#head = this.#tail = 0;
      this.#free.length = 0;
    } else {
      this.#head = this.#next[head];
    }
    this.#keyMap.delete(k);
    this.#size--;
    return head;
  }
  /**
   * Check if a key is in the cache, without updating the recency of use.
   * Will return false if the item is stale, even though it is technically
   * in the cache.
   *
   * Check if a key is in the cache, without updating the recency of
   * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
   * to `true` in either the options or the constructor.
   *
   * Will return `false` if the item is stale, even though it is technically in
   * the cache. The difference can be determined (if it matters) by using a
   * `status` argument, and inspecting the `has` field.
   *
   * Will not update item age unless
   * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
   */
  has(k, hasOptions = {}) {
    const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
    const index = this.#keyMap.get(k);
    if (index !== void 0) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === void 0) {
        return false;
      }
      if (!this.#isStale(index)) {
        if (updateAgeOnHas) {
          this.#updateItemAge(index);
        }
        if (status) {
          status.has = "hit";
          this.#statusTTL(status, index);
        }
        return true;
      } else if (status) {
        status.has = "stale";
        this.#statusTTL(status, index);
      }
    } else if (status) {
      status.has = "miss";
    }
    return false;
  }
  /**
   * Like {@link LRUCache#get} but doesn't update recency or delete stale
   * items.
   *
   * Returns `undefined` if the item is stale, unless
   * {@link LRUCache.OptionsBase.allowStale} is set.
   */
  peek(k, peekOptions = {}) {
    const { allowStale = this.allowStale } = peekOptions;
    const index = this.#keyMap.get(k);
    if (index === void 0 || !allowStale && this.#isStale(index)) {
      return;
    }
    const v = this.#valList[index];
    return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
  }
  #backgroundFetch(k, index, options, context) {
    const v = index === void 0 ? void 0 : this.#valList[index];
    if (this.#isBackgroundFetch(v)) {
      return v;
    }
    const ac = new AC();
    const { signal } = options;
    signal?.addEventListener("abort", () => ac.abort(signal.reason), {
      signal: ac.signal
    });
    const fetchOpts = {
      signal: ac.signal,
      options,
      context
    };
    const cb = (v2, updateCache = false) => {
      const { aborted } = ac.signal;
      const ignoreAbort = options.ignoreFetchAbort && v2 !== void 0;
      if (options.status) {
        if (aborted && !updateCache) {
          options.status.fetchAborted = true;
          options.status.fetchError = ac.signal.reason;
          if (ignoreAbort)
            options.status.fetchAbortIgnored = true;
        } else {
          options.status.fetchResolved = true;
        }
      }
      if (aborted && !ignoreAbort && !updateCache) {
        return fetchFail(ac.signal.reason);
      }
      const bf2 = p;
      if (this.#valList[index] === p) {
        if (v2 === void 0) {
          if (bf2.__staleWhileFetching) {
            this.#valList[index] = bf2.__staleWhileFetching;
          } else {
            this.#delete(k, "fetch");
          }
        } else {
          if (options.status)
            options.status.fetchUpdated = true;
          this.set(k, v2, fetchOpts.options);
        }
      }
      return v2;
    };
    const eb = (er) => {
      if (options.status) {
        options.status.fetchRejected = true;
        options.status.fetchError = er;
      }
      return fetchFail(er);
    };
    const fetchFail = (er) => {
      const { aborted } = ac.signal;
      const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
      const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
      const noDelete = allowStale || options.noDeleteOnFetchRejection;
      const bf2 = p;
      if (this.#valList[index] === p) {
        const del = !noDelete || bf2.__staleWhileFetching === void 0;
        if (del) {
          this.#delete(k, "fetch");
        } else if (!allowStaleAborted) {
          this.#valList[index] = bf2.__staleWhileFetching;
        }
      }
      if (allowStale) {
        if (options.status && bf2.__staleWhileFetching !== void 0) {
          options.status.returnedStale = true;
        }
        return bf2.__staleWhileFetching;
      } else if (bf2.__returned === bf2) {
        throw er;
      }
    };
    const pcall = (res, rej) => {
      const fmp = this.#fetchMethod?.(k, v, fetchOpts);
      if (fmp && fmp instanceof Promise) {
        fmp.then((v2) => res(v2 === void 0 ? void 0 : v2), rej);
      }
      ac.signal.addEventListener("abort", () => {
        if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
          res(void 0);
          if (options.allowStaleOnFetchAbort) {
            res = (v2) => cb(v2, true);
          }
        }
      });
    };
    if (options.status)
      options.status.fetchDispatched = true;
    const p = new Promise(pcall).then(cb, eb);
    const bf = Object.assign(p, {
      __abortController: ac,
      __staleWhileFetching: v,
      __returned: void 0
    });
    if (index === void 0) {
      this.set(k, bf, { ...fetchOpts.options, status: void 0 });
      index = this.#keyMap.get(k);
    } else {
      this.#valList[index] = bf;
    }
    return bf;
  }
  #isBackgroundFetch(p) {
    if (!this.#hasFetchMethod)
      return false;
    const b = p;
    return !!b && b instanceof Promise && b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AC;
  }
  async fetch(k, fetchOptions = {}) {
    const {
      // get options
      allowStale = this.allowStale,
      updateAgeOnGet = this.updateAgeOnGet,
      noDeleteOnStaleGet = this.noDeleteOnStaleGet,
      // set options
      ttl = this.ttl,
      noDisposeOnSet = this.noDisposeOnSet,
      size = 0,
      sizeCalculation = this.sizeCalculation,
      noUpdateTTL = this.noUpdateTTL,
      // fetch exclusive options
      noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
      allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
      ignoreFetchAbort = this.ignoreFetchAbort,
      allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
      context,
      forceRefresh = false,
      status,
      signal
    } = fetchOptions;
    if (!this.#hasFetchMethod) {
      if (status)
        status.fetch = "get";
      return this.get(k, {
        allowStale,
        updateAgeOnGet,
        noDeleteOnStaleGet,
        status
      });
    }
    const options = {
      allowStale,
      updateAgeOnGet,
      noDeleteOnStaleGet,
      ttl,
      noDisposeOnSet,
      size,
      sizeCalculation,
      noUpdateTTL,
      noDeleteOnFetchRejection,
      allowStaleOnFetchRejection,
      allowStaleOnFetchAbort,
      ignoreFetchAbort,
      status,
      signal
    };
    let index = this.#keyMap.get(k);
    if (index === void 0) {
      if (status)
        status.fetch = "miss";
      const p = this.#backgroundFetch(k, index, options, context);
      return p.__returned = p;
    } else {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        const stale = allowStale && v.__staleWhileFetching !== void 0;
        if (status) {
          status.fetch = "inflight";
          if (stale)
            status.returnedStale = true;
        }
        return stale ? v.__staleWhileFetching : v.__returned = v;
      }
      const isStale = this.#isStale(index);
      if (!forceRefresh && !isStale) {
        if (status)
          status.fetch = "hit";
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        if (status)
          this.#statusTTL(status, index);
        return v;
      }
      const p = this.#backgroundFetch(k, index, options, context);
      const hasStale = p.__staleWhileFetching !== void 0;
      const staleVal = hasStale && allowStale;
      if (status) {
        status.fetch = isStale ? "stale" : "refresh";
        if (staleVal && isStale)
          status.returnedStale = true;
      }
      return staleVal ? p.__staleWhileFetching : p.__returned = p;
    }
  }
  async forceFetch(k, fetchOptions = {}) {
    const v = await this.fetch(k, fetchOptions);
    if (v === void 0)
      throw new Error("fetch() returned undefined");
    return v;
  }
  memo(k, memoOptions = {}) {
    const memoMethod = this.#memoMethod;
    if (!memoMethod) {
      throw new Error("no memoMethod provided to constructor");
    }
    const { context, forceRefresh, ...options } = memoOptions;
    const v = this.get(k, options);
    if (!forceRefresh && v !== void 0)
      return v;
    const vv = memoMethod(k, v, {
      options,
      context
    });
    this.set(k, vv, options);
    return vv;
  }
  /**
   * Return a value from the cache. Will update the recency of the cache
   * entry found.
   *
   * If the key is not found, get() will return `undefined`.
   */
  get(k, getOptions = {}) {
    const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
    const index = this.#keyMap.get(k);
    if (index !== void 0) {
      const value = this.#valList[index];
      const fetching = this.#isBackgroundFetch(value);
      if (status)
        this.#statusTTL(status, index);
      if (this.#isStale(index)) {
        if (status)
          status.get = "stale";
        if (!fetching) {
          if (!noDeleteOnStaleGet) {
            this.#delete(k, "expire");
          }
          if (status && allowStale)
            status.returnedStale = true;
          return allowStale ? value : void 0;
        } else {
          if (status && allowStale && value.__staleWhileFetching !== void 0) {
            status.returnedStale = true;
          }
          return allowStale ? value.__staleWhileFetching : void 0;
        }
      } else {
        if (status)
          status.get = "hit";
        if (fetching) {
          return value.__staleWhileFetching;
        }
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        return value;
      }
    } else if (status) {
      status.get = "miss";
    }
  }
  #connect(p, n) {
    this.#prev[n] = p;
    this.#next[p] = n;
  }
  #moveToTail(index) {
    if (index !== this.#tail) {
      if (index === this.#head) {
        this.#head = this.#next[index];
      } else {
        this.#connect(this.#prev[index], this.#next[index]);
      }
      this.#connect(this.#tail, index);
      this.#tail = index;
    }
  }
  /**
   * Deletes a key out of the cache.
   *
   * Returns true if the key was deleted, false otherwise.
   */
  delete(k) {
    return this.#delete(k, "delete");
  }
  #delete(k, reason) {
    let deleted = false;
    if (this.#size !== 0) {
      const index = this.#keyMap.get(k);
      if (index !== void 0) {
        deleted = true;
        if (this.#size === 1) {
          this.#clear(reason);
        } else {
          this.#removeItemSize(index);
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error("deleted"));
          } else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
              this.#dispose?.(v, k, reason);
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([v, k, reason]);
            }
          }
          this.#keyMap.delete(k);
          this.#keyList[index] = void 0;
          this.#valList[index] = void 0;
          if (index === this.#tail) {
            this.#tail = this.#prev[index];
          } else if (index === this.#head) {
            this.#head = this.#next[index];
          } else {
            const pi = this.#prev[index];
            this.#next[pi] = this.#next[index];
            const ni = this.#next[index];
            this.#prev[ni] = this.#prev[index];
          }
          this.#size--;
          this.#free.push(index);
        }
      }
    }
    if (this.#hasDisposeAfter && this.#disposed?.length) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return deleted;
  }
  /**
   * Clear the cache entirely, throwing away all values.
   */
  clear() {
    return this.#clear("delete");
  }
  #clear(reason) {
    for (const index of this.#rindexes({ allowStale: true })) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        v.__abortController.abort(new Error("deleted"));
      } else {
        const k = this.#keyList[index];
        if (this.#hasDispose) {
          this.#dispose?.(v, k, reason);
        }
        if (this.#hasDisposeAfter) {
          this.#disposed?.push([v, k, reason]);
        }
      }
    }
    this.#keyMap.clear();
    this.#valList.fill(void 0);
    this.#keyList.fill(void 0);
    if (this.#ttls && this.#starts) {
      this.#ttls.fill(0);
      this.#starts.fill(0);
    }
    if (this.#sizes) {
      this.#sizes.fill(0);
    }
    this.#head = 0;
    this.#tail = 0;
    this.#free.length = 0;
    this.#calculatedSize = 0;
    this.#size = 0;
    if (this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
  }
};

// node_modules/path-scurry/dist/esm/index.js
import { posix, win32 } from "node:path";
import { fileURLToPath } from "node:url";
import { lstatSync, readdir as readdirCB, readdirSync, readlinkSync, realpathSync as rps } from "fs";
import * as actualFS from "node:fs";
import { lstat, readdir, readlink, realpath } from "node:fs/promises";

// node_modules/minipass/dist/esm/index.js
import { EventEmitter } from "node:events";
import Stream from "node:stream";
import { StringDecoder } from "node:string_decoder";
var proc = typeof process === "object" && process ? process : {
  stdout: null,
  stderr: null
};
var isStream = (s) => !!s && typeof s === "object" && (s instanceof Minipass || s instanceof Stream || isReadable(s) || isWritable(s));
var isReadable = (s) => !!s && typeof s === "object" && s instanceof EventEmitter && typeof s.pipe === "function" && // node core Writable streams have a pipe() method, but it throws
s.pipe !== Stream.Writable.prototype.pipe;
var isWritable = (s) => !!s && typeof s === "object" && s instanceof EventEmitter && typeof s.write === "function" && typeof s.end === "function";
var EOF = Symbol("EOF");
var MAYBE_EMIT_END = Symbol("maybeEmitEnd");
var EMITTED_END = Symbol("emittedEnd");
var EMITTING_END = Symbol("emittingEnd");
var EMITTED_ERROR = Symbol("emittedError");
var CLOSED = Symbol("closed");
var READ = Symbol("read");
var FLUSH = Symbol("flush");
var FLUSHCHUNK = Symbol("flushChunk");
var ENCODING = Symbol("encoding");
var DECODER = Symbol("decoder");
var FLOWING = Symbol("flowing");
var PAUSED = Symbol("paused");
var RESUME = Symbol("resume");
var BUFFER = Symbol("buffer");
var PIPES = Symbol("pipes");
var BUFFERLENGTH = Symbol("bufferLength");
var BUFFERPUSH = Symbol("bufferPush");
var BUFFERSHIFT = Symbol("bufferShift");
var OBJECTMODE = Symbol("objectMode");
var DESTROYED = Symbol("destroyed");
var ERROR = Symbol("error");
var EMITDATA = Symbol("emitData");
var EMITEND = Symbol("emitEnd");
var EMITEND2 = Symbol("emitEnd2");
var ASYNC = Symbol("async");
var ABORT = Symbol("abort");
var ABORTED = Symbol("aborted");
var SIGNAL = Symbol("signal");
var DATALISTENERS = Symbol("dataListeners");
var DISCARDED = Symbol("discarded");
var defer = (fn) => Promise.resolve().then(fn);
var nodefer = (fn) => fn();
var isEndish = (ev) => ev === "end" || ev === "finish" || ev === "prefinish";
var isArrayBufferLike = (b) => b instanceof ArrayBuffer || !!b && typeof b === "object" && b.constructor && b.constructor.name === "ArrayBuffer" && b.byteLength >= 0;
var isArrayBufferView = (b) => !Buffer.isBuffer(b) && ArrayBuffer.isView(b);
var Pipe = class {
  src;
  dest;
  opts;
  ondrain;
  constructor(src, dest, opts) {
    this.src = src;
    this.dest = dest;
    this.opts = opts;
    this.ondrain = () => src[RESUME]();
    this.dest.on("drain", this.ondrain);
  }
  unpipe() {
    this.dest.removeListener("drain", this.ondrain);
  }
  // only here for the prototype
  /* c8 ignore start */
  proxyErrors(_er) {
  }
  /* c8 ignore stop */
  end() {
    this.unpipe();
    if (this.opts.end)
      this.dest.end();
  }
};
var PipeProxyErrors = class extends Pipe {
  unpipe() {
    this.src.removeListener("error", this.proxyErrors);
    super.unpipe();
  }
  constructor(src, dest, opts) {
    super(src, dest, opts);
    this.proxyErrors = (er) => dest.emit("error", er);
    src.on("error", this.proxyErrors);
  }
};
var isObjectModeOptions = (o) => !!o.objectMode;
var isEncodingOptions = (o) => !o.objectMode && !!o.encoding && o.encoding !== "buffer";
var Minipass = class extends EventEmitter {
  [FLOWING] = false;
  [PAUSED] = false;
  [PIPES] = [];
  [BUFFER] = [];
  [OBJECTMODE];
  [ENCODING];
  [ASYNC];
  [DECODER];
  [EOF] = false;
  [EMITTED_END] = false;
  [EMITTING_END] = false;
  [CLOSED] = false;
  [EMITTED_ERROR] = null;
  [BUFFERLENGTH] = 0;
  [DESTROYED] = false;
  [SIGNAL];
  [ABORTED] = false;
  [DATALISTENERS] = 0;
  [DISCARDED] = false;
  /**
   * true if the stream can be written
   */
  writable = true;
  /**
   * true if the stream can be read
   */
  readable = true;
  /**
   * If `RType` is Buffer, then options do not need to be provided.
   * Otherwise, an options object must be provided to specify either
   * {@link Minipass.SharedOptions.objectMode} or
   * {@link Minipass.SharedOptions.encoding}, as appropriate.
   */
  constructor(...args) {
    const options = args[0] || {};
    super();
    if (options.objectMode && typeof options.encoding === "string") {
      throw new TypeError("Encoding and objectMode may not be used together");
    }
    if (isObjectModeOptions(options)) {
      this[OBJECTMODE] = true;
      this[ENCODING] = null;
    } else if (isEncodingOptions(options)) {
      this[ENCODING] = options.encoding;
      this[OBJECTMODE] = false;
    } else {
      this[OBJECTMODE] = false;
      this[ENCODING] = null;
    }
    this[ASYNC] = !!options.async;
    this[DECODER] = this[ENCODING] ? new StringDecoder(this[ENCODING]) : null;
    if (options && options.debugExposeBuffer === true) {
      Object.defineProperty(this, "buffer", { get: () => this[BUFFER] });
    }
    if (options && options.debugExposePipes === true) {
      Object.defineProperty(this, "pipes", { get: () => this[PIPES] });
    }
    const { signal } = options;
    if (signal) {
      this[SIGNAL] = signal;
      if (signal.aborted) {
        this[ABORT]();
      } else {
        signal.addEventListener("abort", () => this[ABORT]());
      }
    }
  }
  /**
   * The amount of data stored in the buffer waiting to be read.
   *
   * For Buffer strings, this will be the total byte length.
   * For string encoding streams, this will be the string character length,
   * according to JavaScript's `string.length` logic.
   * For objectMode streams, this is a count of the items waiting to be
   * emitted.
   */
  get bufferLength() {
    return this[BUFFERLENGTH];
  }
  /**
   * The `BufferEncoding` currently in use, or `null`
   */
  get encoding() {
    return this[ENCODING];
  }
  /**
   * @deprecated - This is a read only property
   */
  set encoding(_enc) {
    throw new Error("Encoding must be set at instantiation time");
  }
  /**
   * @deprecated - Encoding may only be set at instantiation time
   */
  setEncoding(_enc) {
    throw new Error("Encoding must be set at instantiation time");
  }
  /**
   * True if this is an objectMode stream
   */
  get objectMode() {
    return this[OBJECTMODE];
  }
  /**
   * @deprecated - This is a read-only property
   */
  set objectMode(_om) {
    throw new Error("objectMode must be set at instantiation time");
  }
  /**
   * true if this is an async stream
   */
  get ["async"]() {
    return this[ASYNC];
  }
  /**
   * Set to true to make this stream async.
   *
   * Once set, it cannot be unset, as this would potentially cause incorrect
   * behavior.  Ie, a sync stream can be made async, but an async stream
   * cannot be safely made sync.
   */
  set ["async"](a) {
    this[ASYNC] = this[ASYNC] || !!a;
  }
  // drop everything and get out of the flow completely
  [ABORT]() {
    this[ABORTED] = true;
    this.emit("abort", this[SIGNAL]?.reason);
    this.destroy(this[SIGNAL]?.reason);
  }
  /**
   * True if the stream has been aborted.
   */
  get aborted() {
    return this[ABORTED];
  }
  /**
   * No-op setter. Stream aborted status is set via the AbortSignal provided
   * in the constructor options.
   */
  set aborted(_) {
  }
  write(chunk2, encoding, cb) {
    if (this[ABORTED])
      return false;
    if (this[EOF])
      throw new Error("write after end");
    if (this[DESTROYED]) {
      this.emit("error", Object.assign(new Error("Cannot call write after a stream was destroyed"), { code: "ERR_STREAM_DESTROYED" }));
      return true;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = "utf8";
    }
    if (!encoding)
      encoding = "utf8";
    const fn = this[ASYNC] ? defer : nodefer;
    if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk2)) {
      if (isArrayBufferView(chunk2)) {
        chunk2 = Buffer.from(chunk2.buffer, chunk2.byteOffset, chunk2.byteLength);
      } else if (isArrayBufferLike(chunk2)) {
        chunk2 = Buffer.from(chunk2);
      } else if (typeof chunk2 !== "string") {
        throw new Error("Non-contiguous data written to non-objectMode stream");
      }
    }
    if (this[OBJECTMODE]) {
      if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
        this[FLUSH](true);
      if (this[FLOWING])
        this.emit("data", chunk2);
      else
        this[BUFFERPUSH](chunk2);
      if (this[BUFFERLENGTH] !== 0)
        this.emit("readable");
      if (cb)
        fn(cb);
      return this[FLOWING];
    }
    if (!chunk2.length) {
      if (this[BUFFERLENGTH] !== 0)
        this.emit("readable");
      if (cb)
        fn(cb);
      return this[FLOWING];
    }
    if (typeof chunk2 === "string" && // unless it is a string already ready for us to use
    !(encoding === this[ENCODING] && !this[DECODER]?.lastNeed)) {
      chunk2 = Buffer.from(chunk2, encoding);
    }
    if (Buffer.isBuffer(chunk2) && this[ENCODING]) {
      chunk2 = this[DECODER].write(chunk2);
    }
    if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
      this[FLUSH](true);
    if (this[FLOWING])
      this.emit("data", chunk2);
    else
      this[BUFFERPUSH](chunk2);
    if (this[BUFFERLENGTH] !== 0)
      this.emit("readable");
    if (cb)
      fn(cb);
    return this[FLOWING];
  }
  /**
   * Low-level explicit read method.
   *
   * In objectMode, the argument is ignored, and one item is returned if
   * available.
   *
   * `n` is the number of bytes (or in the case of encoding streams,
   * characters) to consume. If `n` is not provided, then the entire buffer
   * is returned, or `null` is returned if no data is available.
   *
   * If `n` is greater that the amount of data in the internal buffer,
   * then `null` is returned.
   */
  read(n) {
    if (this[DESTROYED])
      return null;
    this[DISCARDED] = false;
    if (this[BUFFERLENGTH] === 0 || n === 0 || n && n > this[BUFFERLENGTH]) {
      this[MAYBE_EMIT_END]();
      return null;
    }
    if (this[OBJECTMODE])
      n = null;
    if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
      this[BUFFER] = [
        this[ENCODING] ? this[BUFFER].join("") : Buffer.concat(this[BUFFER], this[BUFFERLENGTH])
      ];
    }
    const ret = this[READ](n || null, this[BUFFER][0]);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [READ](n, chunk2) {
    if (this[OBJECTMODE])
      this[BUFFERSHIFT]();
    else {
      const c = chunk2;
      if (n === c.length || n === null)
        this[BUFFERSHIFT]();
      else if (typeof c === "string") {
        this[BUFFER][0] = c.slice(n);
        chunk2 = c.slice(0, n);
        this[BUFFERLENGTH] -= n;
      } else {
        this[BUFFER][0] = c.subarray(n);
        chunk2 = c.subarray(0, n);
        this[BUFFERLENGTH] -= n;
      }
    }
    this.emit("data", chunk2);
    if (!this[BUFFER].length && !this[EOF])
      this.emit("drain");
    return chunk2;
  }
  end(chunk2, encoding, cb) {
    if (typeof chunk2 === "function") {
      cb = chunk2;
      chunk2 = void 0;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = "utf8";
    }
    if (chunk2 !== void 0)
      this.write(chunk2, encoding);
    if (cb)
      this.once("end", cb);
    this[EOF] = true;
    this.writable = false;
    if (this[FLOWING] || !this[PAUSED])
      this[MAYBE_EMIT_END]();
    return this;
  }
  // don't let the internal resume be overwritten
  [RESUME]() {
    if (this[DESTROYED])
      return;
    if (!this[DATALISTENERS] && !this[PIPES].length) {
      this[DISCARDED] = true;
    }
    this[PAUSED] = false;
    this[FLOWING] = true;
    this.emit("resume");
    if (this[BUFFER].length)
      this[FLUSH]();
    else if (this[EOF])
      this[MAYBE_EMIT_END]();
    else
      this.emit("drain");
  }
  /**
   * Resume the stream if it is currently in a paused state
   *
   * If called when there are no pipe destinations or `data` event listeners,
   * this will place the stream in a "discarded" state, where all data will
   * be thrown away. The discarded state is removed if a pipe destination or
   * data handler is added, if pause() is called, or if any synchronous or
   * asynchronous iteration is started.
   */
  resume() {
    return this[RESUME]();
  }
  /**
   * Pause the stream
   */
  pause() {
    this[FLOWING] = false;
    this[PAUSED] = true;
    this[DISCARDED] = false;
  }
  /**
   * true if the stream has been forcibly destroyed
   */
  get destroyed() {
    return this[DESTROYED];
  }
  /**
   * true if the stream is currently in a flowing state, meaning that
   * any writes will be immediately emitted.
   */
  get flowing() {
    return this[FLOWING];
  }
  /**
   * true if the stream is currently in a paused state
   */
  get paused() {
    return this[PAUSED];
  }
  [BUFFERPUSH](chunk2) {
    if (this[OBJECTMODE])
      this[BUFFERLENGTH] += 1;
    else
      this[BUFFERLENGTH] += chunk2.length;
    this[BUFFER].push(chunk2);
  }
  [BUFFERSHIFT]() {
    if (this[OBJECTMODE])
      this[BUFFERLENGTH] -= 1;
    else
      this[BUFFERLENGTH] -= this[BUFFER][0].length;
    return this[BUFFER].shift();
  }
  [FLUSH](noDrain = false) {
    do {
    } while (this[FLUSHCHUNK](this[BUFFERSHIFT]()) && this[BUFFER].length);
    if (!noDrain && !this[BUFFER].length && !this[EOF])
      this.emit("drain");
  }
  [FLUSHCHUNK](chunk2) {
    this.emit("data", chunk2);
    return this[FLOWING];
  }
  /**
   * Pipe all data emitted by this stream into the destination provided.
   *
   * Triggers the flow of data.
   */
  pipe(dest, opts) {
    if (this[DESTROYED])
      return dest;
    this[DISCARDED] = false;
    const ended = this[EMITTED_END];
    opts = opts || {};
    if (dest === proc.stdout || dest === proc.stderr)
      opts.end = false;
    else
      opts.end = opts.end !== false;
    opts.proxyErrors = !!opts.proxyErrors;
    if (ended) {
      if (opts.end)
        dest.end();
    } else {
      this[PIPES].push(!opts.proxyErrors ? new Pipe(this, dest, opts) : new PipeProxyErrors(this, dest, opts));
      if (this[ASYNC])
        defer(() => this[RESUME]());
      else
        this[RESUME]();
    }
    return dest;
  }
  /**
   * Fully unhook a piped destination stream.
   *
   * If the destination stream was the only consumer of this stream (ie,
   * there are no other piped destinations or `'data'` event listeners)
   * then the flow of data will stop until there is another consumer or
   * {@link Minipass#resume} is explicitly called.
   */
  unpipe(dest) {
    const p = this[PIPES].find((p2) => p2.dest === dest);
    if (p) {
      if (this[PIPES].length === 1) {
        if (this[FLOWING] && this[DATALISTENERS] === 0) {
          this[FLOWING] = false;
        }
        this[PIPES] = [];
      } else
        this[PIPES].splice(this[PIPES].indexOf(p), 1);
      p.unpipe();
    }
  }
  /**
   * Alias for {@link Minipass#on}
   */
  addListener(ev, handler) {
    return this.on(ev, handler);
  }
  /**
   * Mostly identical to `EventEmitter.on`, with the following
   * behavior differences to prevent data loss and unnecessary hangs:
   *
   * - Adding a 'data' event handler will trigger the flow of data
   *
   * - Adding a 'readable' event handler when there is data waiting to be read
   *   will cause 'readable' to be emitted immediately.
   *
   * - Adding an 'endish' event handler ('end', 'finish', etc.) which has
   *   already passed will cause the event to be emitted immediately and all
   *   handlers removed.
   *
   * - Adding an 'error' event handler after an error has been emitted will
   *   cause the event to be re-emitted immediately with the error previously
   *   raised.
   */
  on(ev, handler) {
    const ret = super.on(ev, handler);
    if (ev === "data") {
      this[DISCARDED] = false;
      this[DATALISTENERS]++;
      if (!this[PIPES].length && !this[FLOWING]) {
        this[RESUME]();
      }
    } else if (ev === "readable" && this[BUFFERLENGTH] !== 0) {
      super.emit("readable");
    } else if (isEndish(ev) && this[EMITTED_END]) {
      super.emit(ev);
      this.removeAllListeners(ev);
    } else if (ev === "error" && this[EMITTED_ERROR]) {
      const h = handler;
      if (this[ASYNC])
        defer(() => h.call(this, this[EMITTED_ERROR]));
      else
        h.call(this, this[EMITTED_ERROR]);
    }
    return ret;
  }
  /**
   * Alias for {@link Minipass#off}
   */
  removeListener(ev, handler) {
    return this.off(ev, handler);
  }
  /**
   * Mostly identical to `EventEmitter.off`
   *
   * If a 'data' event handler is removed, and it was the last consumer
   * (ie, there are no pipe destinations or other 'data' event listeners),
   * then the flow of data will stop until there is another consumer or
   * {@link Minipass#resume} is explicitly called.
   */
  off(ev, handler) {
    const ret = super.off(ev, handler);
    if (ev === "data") {
      this[DATALISTENERS] = this.listeners("data").length;
      if (this[DATALISTENERS] === 0 && !this[DISCARDED] && !this[PIPES].length) {
        this[FLOWING] = false;
      }
    }
    return ret;
  }
  /**
   * Mostly identical to `EventEmitter.removeAllListeners`
   *
   * If all 'data' event handlers are removed, and they were the last consumer
   * (ie, there are no pipe destinations), then the flow of data will stop
   * until there is another consumer or {@link Minipass#resume} is explicitly
   * called.
   */
  removeAllListeners(ev) {
    const ret = super.removeAllListeners(ev);
    if (ev === "data" || ev === void 0) {
      this[DATALISTENERS] = 0;
      if (!this[DISCARDED] && !this[PIPES].length) {
        this[FLOWING] = false;
      }
    }
    return ret;
  }
  /**
   * true if the 'end' event has been emitted
   */
  get emittedEnd() {
    return this[EMITTED_END];
  }
  [MAYBE_EMIT_END]() {
    if (!this[EMITTING_END] && !this[EMITTED_END] && !this[DESTROYED] && this[BUFFER].length === 0 && this[EOF]) {
      this[EMITTING_END] = true;
      this.emit("end");
      this.emit("prefinish");
      this.emit("finish");
      if (this[CLOSED])
        this.emit("close");
      this[EMITTING_END] = false;
    }
  }
  /**
   * Mostly identical to `EventEmitter.emit`, with the following
   * behavior differences to prevent data loss and unnecessary hangs:
   *
   * If the stream has been destroyed, and the event is something other
   * than 'close' or 'error', then `false` is returned and no handlers
   * are called.
   *
   * If the event is 'end', and has already been emitted, then the event
   * is ignored. If the stream is in a paused or non-flowing state, then
   * the event will be deferred until data flow resumes. If the stream is
   * async, then handlers will be called on the next tick rather than
   * immediately.
   *
   * If the event is 'close', and 'end' has not yet been emitted, then
   * the event will be deferred until after 'end' is emitted.
   *
   * If the event is 'error', and an AbortSignal was provided for the stream,
   * and there are no listeners, then the event is ignored, matching the
   * behavior of node core streams in the presense of an AbortSignal.
   *
   * If the event is 'finish' or 'prefinish', then all listeners will be
   * removed after emitting the event, to prevent double-firing.
   */
  emit(ev, ...args) {
    const data = args[0];
    if (ev !== "error" && ev !== "close" && ev !== DESTROYED && this[DESTROYED]) {
      return false;
    } else if (ev === "data") {
      return !this[OBJECTMODE] && !data ? false : this[ASYNC] ? (defer(() => this[EMITDATA](data)), true) : this[EMITDATA](data);
    } else if (ev === "end") {
      return this[EMITEND]();
    } else if (ev === "close") {
      this[CLOSED] = true;
      if (!this[EMITTED_END] && !this[DESTROYED])
        return false;
      const ret2 = super.emit("close");
      this.removeAllListeners("close");
      return ret2;
    } else if (ev === "error") {
      this[EMITTED_ERROR] = data;
      super.emit(ERROR, data);
      const ret2 = !this[SIGNAL] || this.listeners("error").length ? super.emit("error", data) : false;
      this[MAYBE_EMIT_END]();
      return ret2;
    } else if (ev === "resume") {
      const ret2 = super.emit("resume");
      this[MAYBE_EMIT_END]();
      return ret2;
    } else if (ev === "finish" || ev === "prefinish") {
      const ret2 = super.emit(ev);
      this.removeAllListeners(ev);
      return ret2;
    }
    const ret = super.emit(ev, ...args);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [EMITDATA](data) {
    for (const p of this[PIPES]) {
      if (p.dest.write(data) === false)
        this.pause();
    }
    const ret = this[DISCARDED] ? false : super.emit("data", data);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [EMITEND]() {
    if (this[EMITTED_END])
      return false;
    this[EMITTED_END] = true;
    this.readable = false;
    return this[ASYNC] ? (defer(() => this[EMITEND2]()), true) : this[EMITEND2]();
  }
  [EMITEND2]() {
    if (this[DECODER]) {
      const data = this[DECODER].end();
      if (data) {
        for (const p of this[PIPES]) {
          p.dest.write(data);
        }
        if (!this[DISCARDED])
          super.emit("data", data);
      }
    }
    for (const p of this[PIPES]) {
      p.end();
    }
    const ret = super.emit("end");
    this.removeAllListeners("end");
    return ret;
  }
  /**
   * Return a Promise that resolves to an array of all emitted data once
   * the stream ends.
   */
  async collect() {
    const buf = Object.assign([], {
      dataLength: 0
    });
    if (!this[OBJECTMODE])
      buf.dataLength = 0;
    const p = this.promise();
    this.on("data", (c) => {
      buf.push(c);
      if (!this[OBJECTMODE])
        buf.dataLength += c.length;
    });
    await p;
    return buf;
  }
  /**
   * Return a Promise that resolves to the concatenation of all emitted data
   * once the stream ends.
   *
   * Not allowed on objectMode streams.
   */
  async concat() {
    if (this[OBJECTMODE]) {
      throw new Error("cannot concat in objectMode");
    }
    const buf = await this.collect();
    return this[ENCODING] ? buf.join("") : Buffer.concat(buf, buf.dataLength);
  }
  /**
   * Return a void Promise that resolves once the stream ends.
   */
  async promise() {
    return new Promise((resolve2, reject) => {
      this.on(DESTROYED, () => reject(new Error("stream destroyed")));
      this.on("error", (er) => reject(er));
      this.on("end", () => resolve2());
    });
  }
  /**
   * Asynchronous `for await of` iteration.
   *
   * This will continue emitting all chunks until the stream terminates.
   */
  [Symbol.asyncIterator]() {
    this[DISCARDED] = false;
    let stopped = false;
    const stop = async () => {
      this.pause();
      stopped = true;
      return { value: void 0, done: true };
    };
    const next = () => {
      if (stopped)
        return stop();
      const res = this.read();
      if (res !== null)
        return Promise.resolve({ done: false, value: res });
      if (this[EOF])
        return stop();
      let resolve2;
      let reject;
      const onerr = (er) => {
        this.off("data", ondata);
        this.off("end", onend);
        this.off(DESTROYED, ondestroy);
        stop();
        reject(er);
      };
      const ondata = (value) => {
        this.off("error", onerr);
        this.off("end", onend);
        this.off(DESTROYED, ondestroy);
        this.pause();
        resolve2({ value, done: !!this[EOF] });
      };
      const onend = () => {
        this.off("error", onerr);
        this.off("data", ondata);
        this.off(DESTROYED, ondestroy);
        stop();
        resolve2({ done: true, value: void 0 });
      };
      const ondestroy = () => onerr(new Error("stream destroyed"));
      return new Promise((res2, rej) => {
        reject = rej;
        resolve2 = res2;
        this.once(DESTROYED, ondestroy);
        this.once("error", onerr);
        this.once("end", onend);
        this.once("data", ondata);
      });
    };
    return {
      next,
      throw: stop,
      return: stop,
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  /**
   * Synchronous `for of` iteration.
   *
   * The iteration will terminate when the internal buffer runs out, even
   * if the stream has not yet terminated.
   */
  [Symbol.iterator]() {
    this[DISCARDED] = false;
    let stopped = false;
    const stop = () => {
      this.pause();
      this.off(ERROR, stop);
      this.off(DESTROYED, stop);
      this.off("end", stop);
      stopped = true;
      return { done: true, value: void 0 };
    };
    const next = () => {
      if (stopped)
        return stop();
      const value = this.read();
      return value === null ? stop() : { done: false, value };
    };
    this.once("end", stop);
    this.once(ERROR, stop);
    this.once(DESTROYED, stop);
    return {
      next,
      throw: stop,
      return: stop,
      [Symbol.iterator]() {
        return this;
      }
    };
  }
  /**
   * Destroy a stream, preventing it from being used for any further purpose.
   *
   * If the stream has a `close()` method, then it will be called on
   * destruction.
   *
   * After destruction, any attempt to write data, read data, or emit most
   * events will be ignored.
   *
   * If an error argument is provided, then it will be emitted in an
   * 'error' event.
   */
  destroy(er) {
    if (this[DESTROYED]) {
      if (er)
        this.emit("error", er);
      else
        this.emit(DESTROYED);
      return this;
    }
    this[DESTROYED] = true;
    this[DISCARDED] = true;
    this[BUFFER].length = 0;
    this[BUFFERLENGTH] = 0;
    const wc = this;
    if (typeof wc.close === "function" && !this[CLOSED])
      wc.close();
    if (er)
      this.emit("error", er);
    else
      this.emit(DESTROYED);
    return this;
  }
  /**
   * Alias for {@link isStream}
   *
   * Former export location, maintained for backwards compatibility.
   *
   * @deprecated
   */
  static get isStream() {
    return isStream;
  }
};

// node_modules/path-scurry/dist/esm/index.js
var realpathSync = rps.native;
var defaultFS = {
  lstatSync,
  readdir: readdirCB,
  readdirSync,
  readlinkSync,
  realpathSync,
  promises: {
    lstat,
    readdir,
    readlink,
    realpath
  }
};
var fsFromOption = (fsOption) => !fsOption || fsOption === defaultFS || fsOption === actualFS ? defaultFS : {
  ...defaultFS,
  ...fsOption,
  promises: {
    ...defaultFS.promises,
    ...fsOption.promises || {}
  }
};
var uncDriveRegexp = /^\\\\\?\\([a-z]:)\\?$/i;
var uncToDrive = (rootPath) => rootPath.replace(/\//g, "\\").replace(uncDriveRegexp, "$1\\");
var eitherSep = /[\\\/]/;
var UNKNOWN = 0;
var IFIFO = 1;
var IFCHR = 2;
var IFDIR = 4;
var IFBLK = 6;
var IFREG = 8;
var IFLNK = 10;
var IFSOCK = 12;
var IFMT = 15;
var IFMT_UNKNOWN = ~IFMT;
var READDIR_CALLED = 16;
var LSTAT_CALLED = 32;
var ENOTDIR = 64;
var ENOENT = 128;
var ENOREADLINK = 256;
var ENOREALPATH = 512;
var ENOCHILD = ENOTDIR | ENOENT | ENOREALPATH;
var TYPEMASK = 1023;
var entToType = (s) => s.isFile() ? IFREG : s.isDirectory() ? IFDIR : s.isSymbolicLink() ? IFLNK : s.isCharacterDevice() ? IFCHR : s.isBlockDevice() ? IFBLK : s.isSocket() ? IFSOCK : s.isFIFO() ? IFIFO : UNKNOWN;
var normalizeCache = /* @__PURE__ */ new Map();
var normalize = (s) => {
  const c = normalizeCache.get(s);
  if (c)
    return c;
  const n = s.normalize("NFKD");
  normalizeCache.set(s, n);
  return n;
};
var normalizeNocaseCache = /* @__PURE__ */ new Map();
var normalizeNocase = (s) => {
  const c = normalizeNocaseCache.get(s);
  if (c)
    return c;
  const n = normalize(s.toLowerCase());
  normalizeNocaseCache.set(s, n);
  return n;
};
var ResolveCache = class extends LRUCache {
  constructor() {
    super({ max: 256 });
  }
};
var ChildrenCache = class extends LRUCache {
  constructor(maxSize = 16 * 1024) {
    super({
      maxSize,
      // parent + children
      sizeCalculation: (a) => a.length + 1
    });
  }
};
var setAsCwd = Symbol("PathScurry setAsCwd");
var PathBase = class {
  /**
   * the basename of this path
   *
   * **Important**: *always* test the path name against any test string
   * usingthe {@link isNamed} method, and not by directly comparing this
   * string. Otherwise, unicode path strings that the system sees as identical
   * will not be properly treated as the same path, leading to incorrect
   * behavior and possible security issues.
   */
  name;
  /**
   * the Path entry corresponding to the path root.
   *
   * @internal
   */
  root;
  /**
   * All roots found within the current PathScurry family
   *
   * @internal
   */
  roots;
  /**
   * a reference to the parent path, or undefined in the case of root entries
   *
   * @internal
   */
  parent;
  /**
   * boolean indicating whether paths are compared case-insensitively
   * @internal
   */
  nocase;
  /**
   * boolean indicating that this path is the current working directory
   * of the PathScurry collection that contains it.
   */
  isCWD = false;
  // potential default fs override
  #fs;
  // Stats fields
  #dev;
  get dev() {
    return this.#dev;
  }
  #mode;
  get mode() {
    return this.#mode;
  }
  #nlink;
  get nlink() {
    return this.#nlink;
  }
  #uid;
  get uid() {
    return this.#uid;
  }
  #gid;
  get gid() {
    return this.#gid;
  }
  #rdev;
  get rdev() {
    return this.#rdev;
  }
  #blksize;
  get blksize() {
    return this.#blksize;
  }
  #ino;
  get ino() {
    return this.#ino;
  }
  #size;
  get size() {
    return this.#size;
  }
  #blocks;
  get blocks() {
    return this.#blocks;
  }
  #atimeMs;
  get atimeMs() {
    return this.#atimeMs;
  }
  #mtimeMs;
  get mtimeMs() {
    return this.#mtimeMs;
  }
  #ctimeMs;
  get ctimeMs() {
    return this.#ctimeMs;
  }
  #birthtimeMs;
  get birthtimeMs() {
    return this.#birthtimeMs;
  }
  #atime;
  get atime() {
    return this.#atime;
  }
  #mtime;
  get mtime() {
    return this.#mtime;
  }
  #ctime;
  get ctime() {
    return this.#ctime;
  }
  #birthtime;
  get birthtime() {
    return this.#birthtime;
  }
  #matchName;
  #depth;
  #fullpath;
  #fullpathPosix;
  #relative;
  #relativePosix;
  #type;
  #children;
  #linkTarget;
  #realpath;
  /**
   * This property is for compatibility with the Dirent class as of
   * Node v20, where Dirent['parentPath'] refers to the path of the
   * directory that was passed to readdir. For root entries, it's the path
   * to the entry itself.
   */
  get parentPath() {
    return (this.parent || this).fullpath();
  }
  /**
   * Deprecated alias for Dirent['parentPath'] Somewhat counterintuitively,
   * this property refers to the *parent* path, not the path object itself.
   */
  get path() {
    return this.parentPath;
  }
  /**
   * Do not create new Path objects directly.  They should always be accessed
   * via the PathScurry class or other methods on the Path class.
   *
   * @internal
   */
  constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
    this.name = name;
    this.#matchName = nocase ? normalizeNocase(name) : normalize(name);
    this.#type = type & TYPEMASK;
    this.nocase = nocase;
    this.roots = roots;
    this.root = root || this;
    this.#children = children;
    this.#fullpath = opts.fullpath;
    this.#relative = opts.relative;
    this.#relativePosix = opts.relativePosix;
    this.parent = opts.parent;
    if (this.parent) {
      this.#fs = this.parent.#fs;
    } else {
      this.#fs = fsFromOption(opts.fs);
    }
  }
  /**
   * Returns the depth of the Path object from its root.
   *
   * For example, a path at `/foo/bar` would have a depth of 2.
   */
  depth() {
    if (this.#depth !== void 0)
      return this.#depth;
    if (!this.parent)
      return this.#depth = 0;
    return this.#depth = this.parent.depth() + 1;
  }
  /**
   * @internal
   */
  childrenCache() {
    return this.#children;
  }
  /**
   * Get the Path object referenced by the string path, resolved from this Path
   */
  resolve(path12) {
    if (!path12) {
      return this;
    }
    const rootPath = this.getRootString(path12);
    const dir = path12.substring(rootPath.length);
    const dirParts = dir.split(this.splitSep);
    const result = rootPath ? this.getRoot(rootPath).#resolveParts(dirParts) : this.#resolveParts(dirParts);
    return result;
  }
  #resolveParts(dirParts) {
    let p = this;
    for (const part of dirParts) {
      p = p.child(part);
    }
    return p;
  }
  /**
   * Returns the cached children Path objects, if still available.  If they
   * have fallen out of the cache, then returns an empty array, and resets the
   * READDIR_CALLED bit, so that future calls to readdir() will require an fs
   * lookup.
   *
   * @internal
   */
  children() {
    const cached = this.#children.get(this);
    if (cached) {
      return cached;
    }
    const children = Object.assign([], { provisional: 0 });
    this.#children.set(this, children);
    this.#type &= ~READDIR_CALLED;
    return children;
  }
  /**
   * Resolves a path portion and returns or creates the child Path.
   *
   * Returns `this` if pathPart is `''` or `'.'`, or `parent` if pathPart is
   * `'..'`.
   *
   * This should not be called directly.  If `pathPart` contains any path
   * separators, it will lead to unsafe undefined behavior.
   *
   * Use `Path.resolve()` instead.
   *
   * @internal
   */
  child(pathPart, opts) {
    if (pathPart === "" || pathPart === ".") {
      return this;
    }
    if (pathPart === "..") {
      return this.parent || this;
    }
    const children = this.children();
    const name = this.nocase ? normalizeNocase(pathPart) : normalize(pathPart);
    for (const p of children) {
      if (p.#matchName === name) {
        return p;
      }
    }
    const s = this.parent ? this.sep : "";
    const fullpath = this.#fullpath ? this.#fullpath + s + pathPart : void 0;
    const pchild = this.newChild(pathPart, UNKNOWN, {
      ...opts,
      parent: this,
      fullpath
    });
    if (!this.canReaddir()) {
      pchild.#type |= ENOENT;
    }
    children.push(pchild);
    return pchild;
  }
  /**
   * The relative path from the cwd. If it does not share an ancestor with
   * the cwd, then this ends up being equivalent to the fullpath()
   */
  relative() {
    if (this.isCWD)
      return "";
    if (this.#relative !== void 0) {
      return this.#relative;
    }
    const name = this.name;
    const p = this.parent;
    if (!p) {
      return this.#relative = this.name;
    }
    const pv = p.relative();
    return pv + (!pv || !p.parent ? "" : this.sep) + name;
  }
  /**
   * The relative path from the cwd, using / as the path separator.
   * If it does not share an ancestor with
   * the cwd, then this ends up being equivalent to the fullpathPosix()
   * On posix systems, this is identical to relative().
   */
  relativePosix() {
    if (this.sep === "/")
      return this.relative();
    if (this.isCWD)
      return "";
    if (this.#relativePosix !== void 0)
      return this.#relativePosix;
    const name = this.name;
    const p = this.parent;
    if (!p) {
      return this.#relativePosix = this.fullpathPosix();
    }
    const pv = p.relativePosix();
    return pv + (!pv || !p.parent ? "" : "/") + name;
  }
  /**
   * The fully resolved path string for this Path entry
   */
  fullpath() {
    if (this.#fullpath !== void 0) {
      return this.#fullpath;
    }
    const name = this.name;
    const p = this.parent;
    if (!p) {
      return this.#fullpath = this.name;
    }
    const pv = p.fullpath();
    const fp = pv + (!p.parent ? "" : this.sep) + name;
    return this.#fullpath = fp;
  }
  /**
   * On platforms other than windows, this is identical to fullpath.
   *
   * On windows, this is overridden to return the forward-slash form of the
   * full UNC path.
   */
  fullpathPosix() {
    if (this.#fullpathPosix !== void 0)
      return this.#fullpathPosix;
    if (this.sep === "/")
      return this.#fullpathPosix = this.fullpath();
    if (!this.parent) {
      const p2 = this.fullpath().replace(/\\/g, "/");
      if (/^[a-z]:\//i.test(p2)) {
        return this.#fullpathPosix = `//?/${p2}`;
      } else {
        return this.#fullpathPosix = p2;
      }
    }
    const p = this.parent;
    const pfpp = p.fullpathPosix();
    const fpp = pfpp + (!pfpp || !p.parent ? "" : "/") + this.name;
    return this.#fullpathPosix = fpp;
  }
  /**
   * Is the Path of an unknown type?
   *
   * Note that we might know *something* about it if there has been a previous
   * filesystem operation, for example that it does not exist, or is not a
   * link, or whether it has child entries.
   */
  isUnknown() {
    return (this.#type & IFMT) === UNKNOWN;
  }
  isType(type) {
    return this[`is${type}`]();
  }
  getType() {
    return this.isUnknown() ? "Unknown" : this.isDirectory() ? "Directory" : this.isFile() ? "File" : this.isSymbolicLink() ? "SymbolicLink" : this.isFIFO() ? "FIFO" : this.isCharacterDevice() ? "CharacterDevice" : this.isBlockDevice() ? "BlockDevice" : (
      /* c8 ignore start */
      this.isSocket() ? "Socket" : "Unknown"
    );
  }
  /**
   * Is the Path a regular file?
   */
  isFile() {
    return (this.#type & IFMT) === IFREG;
  }
  /**
   * Is the Path a directory?
   */
  isDirectory() {
    return (this.#type & IFMT) === IFDIR;
  }
  /**
   * Is the path a character device?
   */
  isCharacterDevice() {
    return (this.#type & IFMT) === IFCHR;
  }
  /**
   * Is the path a block device?
   */
  isBlockDevice() {
    return (this.#type & IFMT) === IFBLK;
  }
  /**
   * Is the path a FIFO pipe?
   */
  isFIFO() {
    return (this.#type & IFMT) === IFIFO;
  }
  /**
   * Is the path a socket?
   */
  isSocket() {
    return (this.#type & IFMT) === IFSOCK;
  }
  /**
   * Is the path a symbolic link?
   */
  isSymbolicLink() {
    return (this.#type & IFLNK) === IFLNK;
  }
  /**
   * Return the entry if it has been subject of a successful lstat, or
   * undefined otherwise.
   *
   * Does not read the filesystem, so an undefined result *could* simply
   * mean that we haven't called lstat on it.
   */
  lstatCached() {
    return this.#type & LSTAT_CALLED ? this : void 0;
  }
  /**
   * Return the cached link target if the entry has been the subject of a
   * successful readlink, or undefined otherwise.
   *
   * Does not read the filesystem, so an undefined result *could* just mean we
   * don't have any cached data. Only use it if you are very sure that a
   * readlink() has been called at some point.
   */
  readlinkCached() {
    return this.#linkTarget;
  }
  /**
   * Returns the cached realpath target if the entry has been the subject
   * of a successful realpath, or undefined otherwise.
   *
   * Does not read the filesystem, so an undefined result *could* just mean we
   * don't have any cached data. Only use it if you are very sure that a
   * realpath() has been called at some point.
   */
  realpathCached() {
    return this.#realpath;
  }
  /**
   * Returns the cached child Path entries array if the entry has been the
   * subject of a successful readdir(), or [] otherwise.
   *
   * Does not read the filesystem, so an empty array *could* just mean we
   * don't have any cached data. Only use it if you are very sure that a
   * readdir() has been called recently enough to still be valid.
   */
  readdirCached() {
    const children = this.children();
    return children.slice(0, children.provisional);
  }
  /**
   * Return true if it's worth trying to readlink.  Ie, we don't (yet) have
   * any indication that readlink will definitely fail.
   *
   * Returns false if the path is known to not be a symlink, if a previous
   * readlink failed, or if the entry does not exist.
   */
  canReadlink() {
    if (this.#linkTarget)
      return true;
    if (!this.parent)
      return false;
    const ifmt = this.#type & IFMT;
    return !(ifmt !== UNKNOWN && ifmt !== IFLNK || this.#type & ENOREADLINK || this.#type & ENOENT);
  }
  /**
   * Return true if readdir has previously been successfully called on this
   * path, indicating that cachedReaddir() is likely valid.
   */
  calledReaddir() {
    return !!(this.#type & READDIR_CALLED);
  }
  /**
   * Returns true if the path is known to not exist. That is, a previous lstat
   * or readdir failed to verify its existence when that would have been
   * expected, or a parent entry was marked either enoent or enotdir.
   */
  isENOENT() {
    return !!(this.#type & ENOENT);
  }
  /**
   * Return true if the path is a match for the given path name.  This handles
   * case sensitivity and unicode normalization.
   *
   * Note: even on case-sensitive systems, it is **not** safe to test the
   * equality of the `.name` property to determine whether a given pathname
   * matches, due to unicode normalization mismatches.
   *
   * Always use this method instead of testing the `path.name` property
   * directly.
   */
  isNamed(n) {
    return !this.nocase ? this.#matchName === normalize(n) : this.#matchName === normalizeNocase(n);
  }
  /**
   * Return the Path object corresponding to the target of a symbolic link.
   *
   * If the Path is not a symbolic link, or if the readlink call fails for any
   * reason, `undefined` is returned.
   *
   * Result is cached, and thus may be outdated if the filesystem is mutated.
   */
  async readlink() {
    const target = this.#linkTarget;
    if (target) {
      return target;
    }
    if (!this.canReadlink()) {
      return void 0;
    }
    if (!this.parent) {
      return void 0;
    }
    try {
      const read = await this.#fs.promises.readlink(this.fullpath());
      const linkTarget = (await this.parent.realpath())?.resolve(read);
      if (linkTarget) {
        return this.#linkTarget = linkTarget;
      }
    } catch (er) {
      this.#readlinkFail(er.code);
      return void 0;
    }
  }
  /**
   * Synchronous {@link PathBase.readlink}
   */
  readlinkSync() {
    const target = this.#linkTarget;
    if (target) {
      return target;
    }
    if (!this.canReadlink()) {
      return void 0;
    }
    if (!this.parent) {
      return void 0;
    }
    try {
      const read = this.#fs.readlinkSync(this.fullpath());
      const linkTarget = this.parent.realpathSync()?.resolve(read);
      if (linkTarget) {
        return this.#linkTarget = linkTarget;
      }
    } catch (er) {
      this.#readlinkFail(er.code);
      return void 0;
    }
  }
  #readdirSuccess(children) {
    this.#type |= READDIR_CALLED;
    for (let p = children.provisional; p < children.length; p++) {
      const c = children[p];
      if (c)
        c.#markENOENT();
    }
  }
  #markENOENT() {
    if (this.#type & ENOENT)
      return;
    this.#type = (this.#type | ENOENT) & IFMT_UNKNOWN;
    this.#markChildrenENOENT();
  }
  #markChildrenENOENT() {
    const children = this.children();
    children.provisional = 0;
    for (const p of children) {
      p.#markENOENT();
    }
  }
  #markENOREALPATH() {
    this.#type |= ENOREALPATH;
    this.#markENOTDIR();
  }
  // save the information when we know the entry is not a dir
  #markENOTDIR() {
    if (this.#type & ENOTDIR)
      return;
    let t = this.#type;
    if ((t & IFMT) === IFDIR)
      t &= IFMT_UNKNOWN;
    this.#type = t | ENOTDIR;
    this.#markChildrenENOENT();
  }
  #readdirFail(code = "") {
    if (code === "ENOTDIR" || code === "EPERM") {
      this.#markENOTDIR();
    } else if (code === "ENOENT") {
      this.#markENOENT();
    } else {
      this.children().provisional = 0;
    }
  }
  #lstatFail(code = "") {
    if (code === "ENOTDIR") {
      const p = this.parent;
      p.#markENOTDIR();
    } else if (code === "ENOENT") {
      this.#markENOENT();
    }
  }
  #readlinkFail(code = "") {
    let ter = this.#type;
    ter |= ENOREADLINK;
    if (code === "ENOENT")
      ter |= ENOENT;
    if (code === "EINVAL" || code === "UNKNOWN") {
      ter &= IFMT_UNKNOWN;
    }
    this.#type = ter;
    if (code === "ENOTDIR" && this.parent) {
      this.parent.#markENOTDIR();
    }
  }
  #readdirAddChild(e, c) {
    return this.#readdirMaybePromoteChild(e, c) || this.#readdirAddNewChild(e, c);
  }
  #readdirAddNewChild(e, c) {
    const type = entToType(e);
    const child = this.newChild(e.name, type, { parent: this });
    const ifmt = child.#type & IFMT;
    if (ifmt !== IFDIR && ifmt !== IFLNK && ifmt !== UNKNOWN) {
      child.#type |= ENOTDIR;
    }
    c.unshift(child);
    c.provisional++;
    return child;
  }
  #readdirMaybePromoteChild(e, c) {
    for (let p = c.provisional; p < c.length; p++) {
      const pchild = c[p];
      const name = this.nocase ? normalizeNocase(e.name) : normalize(e.name);
      if (name !== pchild.#matchName) {
        continue;
      }
      return this.#readdirPromoteChild(e, pchild, p, c);
    }
  }
  #readdirPromoteChild(e, p, index, c) {
    const v = p.name;
    p.#type = p.#type & IFMT_UNKNOWN | entToType(e);
    if (v !== e.name)
      p.name = e.name;
    if (index !== c.provisional) {
      if (index === c.length - 1)
        c.pop();
      else
        c.splice(index, 1);
      c.unshift(p);
    }
    c.provisional++;
    return p;
  }
  /**
   * Call lstat() on this Path, and update all known information that can be
   * determined.
   *
   * Note that unlike `fs.lstat()`, the returned value does not contain some
   * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
   * information is required, you will need to call `fs.lstat` yourself.
   *
   * If the Path refers to a nonexistent file, or if the lstat call fails for
   * any reason, `undefined` is returned.  Otherwise the updated Path object is
   * returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   */
  async lstat() {
    if ((this.#type & ENOENT) === 0) {
      try {
        this.#applyStat(await this.#fs.promises.lstat(this.fullpath()));
        return this;
      } catch (er) {
        this.#lstatFail(er.code);
      }
    }
  }
  /**
   * synchronous {@link PathBase.lstat}
   */
  lstatSync() {
    if ((this.#type & ENOENT) === 0) {
      try {
        this.#applyStat(this.#fs.lstatSync(this.fullpath()));
        return this;
      } catch (er) {
        this.#lstatFail(er.code);
      }
    }
  }
  #applyStat(st) {
    const { atime, atimeMs, birthtime, birthtimeMs, blksize, blocks, ctime, ctimeMs, dev, gid, ino, mode, mtime, mtimeMs, nlink, rdev, size, uid } = st;
    this.#atime = atime;
    this.#atimeMs = atimeMs;
    this.#birthtime = birthtime;
    this.#birthtimeMs = birthtimeMs;
    this.#blksize = blksize;
    this.#blocks = blocks;
    this.#ctime = ctime;
    this.#ctimeMs = ctimeMs;
    this.#dev = dev;
    this.#gid = gid;
    this.#ino = ino;
    this.#mode = mode;
    this.#mtime = mtime;
    this.#mtimeMs = mtimeMs;
    this.#nlink = nlink;
    this.#rdev = rdev;
    this.#size = size;
    this.#uid = uid;
    const ifmt = entToType(st);
    this.#type = this.#type & IFMT_UNKNOWN | ifmt | LSTAT_CALLED;
    if (ifmt !== UNKNOWN && ifmt !== IFDIR && ifmt !== IFLNK) {
      this.#type |= ENOTDIR;
    }
  }
  #onReaddirCB = [];
  #readdirCBInFlight = false;
  #callOnReaddirCB(children) {
    this.#readdirCBInFlight = false;
    const cbs = this.#onReaddirCB.slice();
    this.#onReaddirCB.length = 0;
    cbs.forEach((cb) => cb(null, children));
  }
  /**
   * Standard node-style callback interface to get list of directory entries.
   *
   * If the Path cannot or does not contain any children, then an empty array
   * is returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   *
   * @param cb The callback called with (er, entries).  Note that the `er`
   * param is somewhat extraneous, as all readdir() errors are handled and
   * simply result in an empty set of entries being returned.
   * @param allowZalgo Boolean indicating that immediately known results should
   * *not* be deferred with `queueMicrotask`. Defaults to `false`. Release
   * zalgo at your peril, the dark pony lord is devious and unforgiving.
   */
  readdirCB(cb, allowZalgo = false) {
    if (!this.canReaddir()) {
      if (allowZalgo)
        cb(null, []);
      else
        queueMicrotask(() => cb(null, []));
      return;
    }
    const children = this.children();
    if (this.calledReaddir()) {
      const c = children.slice(0, children.provisional);
      if (allowZalgo)
        cb(null, c);
      else
        queueMicrotask(() => cb(null, c));
      return;
    }
    this.#onReaddirCB.push(cb);
    if (this.#readdirCBInFlight) {
      return;
    }
    this.#readdirCBInFlight = true;
    const fullpath = this.fullpath();
    this.#fs.readdir(fullpath, { withFileTypes: true }, (er, entries) => {
      if (er) {
        this.#readdirFail(er.code);
        children.provisional = 0;
      } else {
        for (const e of entries) {
          this.#readdirAddChild(e, children);
        }
        this.#readdirSuccess(children);
      }
      this.#callOnReaddirCB(children.slice(0, children.provisional));
      return;
    });
  }
  #asyncReaddirInFlight;
  /**
   * Return an array of known child entries.
   *
   * If the Path cannot or does not contain any children, then an empty array
   * is returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   */
  async readdir() {
    if (!this.canReaddir()) {
      return [];
    }
    const children = this.children();
    if (this.calledReaddir()) {
      return children.slice(0, children.provisional);
    }
    const fullpath = this.fullpath();
    if (this.#asyncReaddirInFlight) {
      await this.#asyncReaddirInFlight;
    } else {
      let resolve2 = () => {
      };
      this.#asyncReaddirInFlight = new Promise((res) => resolve2 = res);
      try {
        for (const e of await this.#fs.promises.readdir(fullpath, {
          withFileTypes: true
        })) {
          this.#readdirAddChild(e, children);
        }
        this.#readdirSuccess(children);
      } catch (er) {
        this.#readdirFail(er.code);
        children.provisional = 0;
      }
      this.#asyncReaddirInFlight = void 0;
      resolve2();
    }
    return children.slice(0, children.provisional);
  }
  /**
   * synchronous {@link PathBase.readdir}
   */
  readdirSync() {
    if (!this.canReaddir()) {
      return [];
    }
    const children = this.children();
    if (this.calledReaddir()) {
      return children.slice(0, children.provisional);
    }
    const fullpath = this.fullpath();
    try {
      for (const e of this.#fs.readdirSync(fullpath, {
        withFileTypes: true
      })) {
        this.#readdirAddChild(e, children);
      }
      this.#readdirSuccess(children);
    } catch (er) {
      this.#readdirFail(er.code);
      children.provisional = 0;
    }
    return children.slice(0, children.provisional);
  }
  canReaddir() {
    if (this.#type & ENOCHILD)
      return false;
    const ifmt = IFMT & this.#type;
    if (!(ifmt === UNKNOWN || ifmt === IFDIR || ifmt === IFLNK)) {
      return false;
    }
    return true;
  }
  shouldWalk(dirs, walkFilter) {
    return (this.#type & IFDIR) === IFDIR && !(this.#type & ENOCHILD) && !dirs.has(this) && (!walkFilter || walkFilter(this));
  }
  /**
   * Return the Path object corresponding to path as resolved
   * by realpath(3).
   *
   * If the realpath call fails for any reason, `undefined` is returned.
   *
   * Result is cached, and thus may be outdated if the filesystem is mutated.
   * On success, returns a Path object.
   */
  async realpath() {
    if (this.#realpath)
      return this.#realpath;
    if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
      return void 0;
    try {
      const rp = await this.#fs.promises.realpath(this.fullpath());
      return this.#realpath = this.resolve(rp);
    } catch (_) {
      this.#markENOREALPATH();
    }
  }
  /**
   * Synchronous {@link realpath}
   */
  realpathSync() {
    if (this.#realpath)
      return this.#realpath;
    if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
      return void 0;
    try {
      const rp = this.#fs.realpathSync(this.fullpath());
      return this.#realpath = this.resolve(rp);
    } catch (_) {
      this.#markENOREALPATH();
    }
  }
  /**
   * Internal method to mark this Path object as the scurry cwd,
   * called by {@link PathScurry#chdir}
   *
   * @internal
   */
  [setAsCwd](oldCwd) {
    if (oldCwd === this)
      return;
    oldCwd.isCWD = false;
    this.isCWD = true;
    const changed = /* @__PURE__ */ new Set([]);
    let rp = [];
    let p = this;
    while (p && p.parent) {
      changed.add(p);
      p.#relative = rp.join(this.sep);
      p.#relativePosix = rp.join("/");
      p = p.parent;
      rp.push("..");
    }
    p = oldCwd;
    while (p && p.parent && !changed.has(p)) {
      p.#relative = void 0;
      p.#relativePosix = void 0;
      p = p.parent;
    }
  }
};
var PathWin32 = class _PathWin32 extends PathBase {
  /**
   * Separator for generating path strings.
   */
  sep = "\\";
  /**
   * Separator for parsing path strings.
   */
  splitSep = eitherSep;
  /**
   * Do not create new Path objects directly.  They should always be accessed
   * via the PathScurry class or other methods on the Path class.
   *
   * @internal
   */
  constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
    super(name, type, root, roots, nocase, children, opts);
  }
  /**
   * @internal
   */
  newChild(name, type = UNKNOWN, opts = {}) {
    return new _PathWin32(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
  }
  /**
   * @internal
   */
  getRootString(path12) {
    return win32.parse(path12).root;
  }
  /**
   * @internal
   */
  getRoot(rootPath) {
    rootPath = uncToDrive(rootPath.toUpperCase());
    if (rootPath === this.root.name) {
      return this.root;
    }
    for (const [compare, root] of Object.entries(this.roots)) {
      if (this.sameRoot(rootPath, compare)) {
        return this.roots[rootPath] = root;
      }
    }
    return this.roots[rootPath] = new PathScurryWin32(rootPath, this).root;
  }
  /**
   * @internal
   */
  sameRoot(rootPath, compare = this.root.name) {
    rootPath = rootPath.toUpperCase().replace(/\//g, "\\").replace(uncDriveRegexp, "$1\\");
    return rootPath === compare;
  }
};
var PathPosix = class _PathPosix extends PathBase {
  /**
   * separator for parsing path strings
   */
  splitSep = "/";
  /**
   * separator for generating path strings
   */
  sep = "/";
  /**
   * Do not create new Path objects directly.  They should always be accessed
   * via the PathScurry class or other methods on the Path class.
   *
   * @internal
   */
  constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
    super(name, type, root, roots, nocase, children, opts);
  }
  /**
   * @internal
   */
  getRootString(path12) {
    return path12.startsWith("/") ? "/" : "";
  }
  /**
   * @internal
   */
  getRoot(_rootPath) {
    return this.root;
  }
  /**
   * @internal
   */
  newChild(name, type = UNKNOWN, opts = {}) {
    return new _PathPosix(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
  }
};
var PathScurryBase = class {
  /**
   * The root Path entry for the current working directory of this Scurry
   */
  root;
  /**
   * The string path for the root of this Scurry's current working directory
   */
  rootPath;
  /**
   * A collection of all roots encountered, referenced by rootPath
   */
  roots;
  /**
   * The Path entry corresponding to this PathScurry's current working directory.
   */
  cwd;
  #resolveCache;
  #resolvePosixCache;
  #children;
  /**
   * Perform path comparisons case-insensitively.
   *
   * Defaults true on Darwin and Windows systems, false elsewhere.
   */
  nocase;
  #fs;
  /**
   * This class should not be instantiated directly.
   *
   * Use PathScurryWin32, PathScurryDarwin, PathScurryPosix, or PathScurry
   *
   * @internal
   */
  constructor(cwd = process.cwd(), pathImpl, sep2, { nocase, childrenCacheSize = 16 * 1024, fs: fs11 = defaultFS } = {}) {
    this.#fs = fsFromOption(fs11);
    if (cwd instanceof URL || cwd.startsWith("file://")) {
      cwd = fileURLToPath(cwd);
    }
    const cwdPath = pathImpl.resolve(cwd);
    this.roots = /* @__PURE__ */ Object.create(null);
    this.rootPath = this.parseRootPath(cwdPath);
    this.#resolveCache = new ResolveCache();
    this.#resolvePosixCache = new ResolveCache();
    this.#children = new ChildrenCache(childrenCacheSize);
    const split = cwdPath.substring(this.rootPath.length).split(sep2);
    if (split.length === 1 && !split[0]) {
      split.pop();
    }
    if (nocase === void 0) {
      throw new TypeError("must provide nocase setting to PathScurryBase ctor");
    }
    this.nocase = nocase;
    this.root = this.newRoot(this.#fs);
    this.roots[this.rootPath] = this.root;
    let prev = this.root;
    let len = split.length - 1;
    const joinSep = pathImpl.sep;
    let abs = this.rootPath;
    let sawFirst = false;
    for (const part of split) {
      const l = len--;
      prev = prev.child(part, {
        relative: new Array(l).fill("..").join(joinSep),
        relativePosix: new Array(l).fill("..").join("/"),
        fullpath: abs += (sawFirst ? "" : joinSep) + part
      });
      sawFirst = true;
    }
    this.cwd = prev;
  }
  /**
   * Get the depth of a provided path, string, or the cwd
   */
  depth(path12 = this.cwd) {
    if (typeof path12 === "string") {
      path12 = this.cwd.resolve(path12);
    }
    return path12.depth();
  }
  /**
   * Return the cache of child entries.  Exposed so subclasses can create
   * child Path objects in a platform-specific way.
   *
   * @internal
   */
  childrenCache() {
    return this.#children;
  }
  /**
   * Resolve one or more path strings to a resolved string
   *
   * Same interface as require('path').resolve.
   *
   * Much faster than path.resolve() when called multiple times for the same
   * path, because the resolved Path objects are cached.  Much slower
   * otherwise.
   */
  resolve(...paths) {
    let r = "";
    for (let i = paths.length - 1; i >= 0; i--) {
      const p = paths[i];
      if (!p || p === ".")
        continue;
      r = r ? `${p}/${r}` : p;
      if (this.isAbsolute(p)) {
        break;
      }
    }
    const cached = this.#resolveCache.get(r);
    if (cached !== void 0) {
      return cached;
    }
    const result = this.cwd.resolve(r).fullpath();
    this.#resolveCache.set(r, result);
    return result;
  }
  /**
   * Resolve one or more path strings to a resolved string, returning
   * the posix path.  Identical to .resolve() on posix systems, but on
   * windows will return a forward-slash separated UNC path.
   *
   * Same interface as require('path').resolve.
   *
   * Much faster than path.resolve() when called multiple times for the same
   * path, because the resolved Path objects are cached.  Much slower
   * otherwise.
   */
  resolvePosix(...paths) {
    let r = "";
    for (let i = paths.length - 1; i >= 0; i--) {
      const p = paths[i];
      if (!p || p === ".")
        continue;
      r = r ? `${p}/${r}` : p;
      if (this.isAbsolute(p)) {
        break;
      }
    }
    const cached = this.#resolvePosixCache.get(r);
    if (cached !== void 0) {
      return cached;
    }
    const result = this.cwd.resolve(r).fullpathPosix();
    this.#resolvePosixCache.set(r, result);
    return result;
  }
  /**
   * find the relative path from the cwd to the supplied path string or entry
   */
  relative(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.relative();
  }
  /**
   * find the relative path from the cwd to the supplied path string or
   * entry, using / as the path delimiter, even on Windows.
   */
  relativePosix(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.relativePosix();
  }
  /**
   * Return the basename for the provided string or Path object
   */
  basename(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.name;
  }
  /**
   * Return the dirname for the provided string or Path object
   */
  dirname(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return (entry.parent || entry).fullpath();
  }
  async readdir(entry = this.cwd, opts = {
    withFileTypes: true
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes } = opts;
    if (!entry.canReaddir()) {
      return [];
    } else {
      const p = await entry.readdir();
      return withFileTypes ? p : p.map((e) => e.name);
    }
  }
  readdirSync(entry = this.cwd, opts = {
    withFileTypes: true
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true } = opts;
    if (!entry.canReaddir()) {
      return [];
    } else if (withFileTypes) {
      return entry.readdirSync();
    } else {
      return entry.readdirSync().map((e) => e.name);
    }
  }
  /**
   * Call lstat() on the string or Path object, and update all known
   * information that can be determined.
   *
   * Note that unlike `fs.lstat()`, the returned value does not contain some
   * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
   * information is required, you will need to call `fs.lstat` yourself.
   *
   * If the Path refers to a nonexistent file, or if the lstat call fails for
   * any reason, `undefined` is returned.  Otherwise the updated Path object is
   * returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   */
  async lstat(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.lstat();
  }
  /**
   * synchronous {@link PathScurryBase.lstat}
   */
  lstatSync(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.lstatSync();
  }
  async readlink(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = await entry.readlink();
    return withFileTypes ? e : e?.fullpath();
  }
  readlinkSync(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = entry.readlinkSync();
    return withFileTypes ? e : e?.fullpath();
  }
  async realpath(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = await entry.realpath();
    return withFileTypes ? e : e?.fullpath();
  }
  realpathSync(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = entry.realpathSync();
    return withFileTypes ? e : e?.fullpath();
  }
  async walk(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = [];
    if (!filter2 || filter2(entry)) {
      results.push(withFileTypes ? entry : entry.fullpath());
    }
    const dirs = /* @__PURE__ */ new Set();
    const walk = (dir, cb) => {
      dirs.add(dir);
      dir.readdirCB((er, entries) => {
        if (er) {
          return cb(er);
        }
        let len = entries.length;
        if (!len)
          return cb();
        const next = () => {
          if (--len === 0) {
            cb();
          }
        };
        for (const e of entries) {
          if (!filter2 || filter2(e)) {
            results.push(withFileTypes ? e : e.fullpath());
          }
          if (follow && e.isSymbolicLink()) {
            e.realpath().then((r) => r?.isUnknown() ? r.lstat() : r).then((r) => r?.shouldWalk(dirs, walkFilter) ? walk(r, next) : next());
          } else {
            if (e.shouldWalk(dirs, walkFilter)) {
              walk(e, next);
            } else {
              next();
            }
          }
        }
      }, true);
    };
    const start = entry;
    return new Promise((res, rej) => {
      walk(start, (er) => {
        if (er)
          return rej(er);
        res(results);
      });
    });
  }
  walkSync(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = [];
    if (!filter2 || filter2(entry)) {
      results.push(withFileTypes ? entry : entry.fullpath());
    }
    const dirs = /* @__PURE__ */ new Set([entry]);
    for (const dir of dirs) {
      const entries = dir.readdirSync();
      for (const e of entries) {
        if (!filter2 || filter2(e)) {
          results.push(withFileTypes ? e : e.fullpath());
        }
        let r = e;
        if (e.isSymbolicLink()) {
          if (!(follow && (r = e.realpathSync())))
            continue;
          if (r.isUnknown())
            r.lstatSync();
        }
        if (r.shouldWalk(dirs, walkFilter)) {
          dirs.add(r);
        }
      }
    }
    return results;
  }
  /**
   * Support for `for await`
   *
   * Alias for {@link PathScurryBase.iterate}
   *
   * Note: As of Node 19, this is very slow, compared to other methods of
   * walking.  Consider using {@link PathScurryBase.stream} if memory overhead
   * and backpressure are concerns, or {@link PathScurryBase.walk} if not.
   */
  [Symbol.asyncIterator]() {
    return this.iterate();
  }
  iterate(entry = this.cwd, options = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      options = entry;
      entry = this.cwd;
    }
    return this.stream(entry, options)[Symbol.asyncIterator]();
  }
  /**
   * Iterating over a PathScurry performs a synchronous walk.
   *
   * Alias for {@link PathScurryBase.iterateSync}
   */
  [Symbol.iterator]() {
    return this.iterateSync();
  }
  *iterateSync(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    if (!filter2 || filter2(entry)) {
      yield withFileTypes ? entry : entry.fullpath();
    }
    const dirs = /* @__PURE__ */ new Set([entry]);
    for (const dir of dirs) {
      const entries = dir.readdirSync();
      for (const e of entries) {
        if (!filter2 || filter2(e)) {
          yield withFileTypes ? e : e.fullpath();
        }
        let r = e;
        if (e.isSymbolicLink()) {
          if (!(follow && (r = e.realpathSync())))
            continue;
          if (r.isUnknown())
            r.lstatSync();
        }
        if (r.shouldWalk(dirs, walkFilter)) {
          dirs.add(r);
        }
      }
    }
  }
  stream(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = new Minipass({ objectMode: true });
    if (!filter2 || filter2(entry)) {
      results.write(withFileTypes ? entry : entry.fullpath());
    }
    const dirs = /* @__PURE__ */ new Set();
    const queue = [entry];
    let processing = 0;
    const process2 = () => {
      let paused = false;
      while (!paused) {
        const dir = queue.shift();
        if (!dir) {
          if (processing === 0)
            results.end();
          return;
        }
        processing++;
        dirs.add(dir);
        const onReaddir = (er, entries, didRealpaths = false) => {
          if (er)
            return results.emit("error", er);
          if (follow && !didRealpaths) {
            const promises2 = [];
            for (const e of entries) {
              if (e.isSymbolicLink()) {
                promises2.push(e.realpath().then((r) => r?.isUnknown() ? r.lstat() : r));
              }
            }
            if (promises2.length) {
              Promise.all(promises2).then(() => onReaddir(null, entries, true));
              return;
            }
          }
          for (const e of entries) {
            if (e && (!filter2 || filter2(e))) {
              if (!results.write(withFileTypes ? e : e.fullpath())) {
                paused = true;
              }
            }
          }
          processing--;
          for (const e of entries) {
            const r = e.realpathCached() || e;
            if (r.shouldWalk(dirs, walkFilter)) {
              queue.push(r);
            }
          }
          if (paused && !results.flowing) {
            results.once("drain", process2);
          } else if (!sync2) {
            process2();
          }
        };
        let sync2 = true;
        dir.readdirCB(onReaddir, true);
        sync2 = false;
      }
    };
    process2();
    return results;
  }
  streamSync(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = new Minipass({ objectMode: true });
    const dirs = /* @__PURE__ */ new Set();
    if (!filter2 || filter2(entry)) {
      results.write(withFileTypes ? entry : entry.fullpath());
    }
    const queue = [entry];
    let processing = 0;
    const process2 = () => {
      let paused = false;
      while (!paused) {
        const dir = queue.shift();
        if (!dir) {
          if (processing === 0)
            results.end();
          return;
        }
        processing++;
        dirs.add(dir);
        const entries = dir.readdirSync();
        for (const e of entries) {
          if (!filter2 || filter2(e)) {
            if (!results.write(withFileTypes ? e : e.fullpath())) {
              paused = true;
            }
          }
        }
        processing--;
        for (const e of entries) {
          let r = e;
          if (e.isSymbolicLink()) {
            if (!(follow && (r = e.realpathSync())))
              continue;
            if (r.isUnknown())
              r.lstatSync();
          }
          if (r.shouldWalk(dirs, walkFilter)) {
            queue.push(r);
          }
        }
      }
      if (paused && !results.flowing)
        results.once("drain", process2);
    };
    process2();
    return results;
  }
  chdir(path12 = this.cwd) {
    const oldCwd = this.cwd;
    this.cwd = typeof path12 === "string" ? this.cwd.resolve(path12) : path12;
    this.cwd[setAsCwd](oldCwd);
  }
};
var PathScurryWin32 = class extends PathScurryBase {
  /**
   * separator for generating path strings
   */
  sep = "\\";
  constructor(cwd = process.cwd(), opts = {}) {
    const { nocase = true } = opts;
    super(cwd, win32, "\\", { ...opts, nocase });
    this.nocase = nocase;
    for (let p = this.cwd; p; p = p.parent) {
      p.nocase = this.nocase;
    }
  }
  /**
   * @internal
   */
  parseRootPath(dir) {
    return win32.parse(dir).root.toUpperCase();
  }
  /**
   * @internal
   */
  newRoot(fs11) {
    return new PathWin32(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), { fs: fs11 });
  }
  /**
   * Return true if the provided path string is an absolute path
   */
  isAbsolute(p) {
    return p.startsWith("/") || p.startsWith("\\") || /^[a-z]:(\/|\\)/i.test(p);
  }
};
var PathScurryPosix = class extends PathScurryBase {
  /**
   * separator for generating path strings
   */
  sep = "/";
  constructor(cwd = process.cwd(), opts = {}) {
    const { nocase = false } = opts;
    super(cwd, posix, "/", { ...opts, nocase });
    this.nocase = nocase;
  }
  /**
   * @internal
   */
  parseRootPath(_dir) {
    return "/";
  }
  /**
   * @internal
   */
  newRoot(fs11) {
    return new PathPosix(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), { fs: fs11 });
  }
  /**
   * Return true if the provided path string is an absolute path
   */
  isAbsolute(p) {
    return p.startsWith("/");
  }
};
var PathScurryDarwin = class extends PathScurryPosix {
  constructor(cwd = process.cwd(), opts = {}) {
    const { nocase = true } = opts;
    super(cwd, { ...opts, nocase });
  }
};
var Path = process.platform === "win32" ? PathWin32 : PathPosix;
var PathScurry = process.platform === "win32" ? PathScurryWin32 : process.platform === "darwin" ? PathScurryDarwin : PathScurryPosix;

// packages/tiny-brain-core/node_modules/glob/dist/esm/pattern.js
var isPatternList = (pl) => pl.length >= 1;
var isGlobList = (gl) => gl.length >= 1;
var Pattern = class _Pattern {
  #patternList;
  #globList;
  #index;
  length;
  #platform;
  #rest;
  #globString;
  #isDrive;
  #isUNC;
  #isAbsolute;
  #followGlobstar = true;
  constructor(patternList, globList, index, platform) {
    if (!isPatternList(patternList)) {
      throw new TypeError("empty pattern list");
    }
    if (!isGlobList(globList)) {
      throw new TypeError("empty glob list");
    }
    if (globList.length !== patternList.length) {
      throw new TypeError("mismatched pattern list and glob list lengths");
    }
    this.length = patternList.length;
    if (index < 0 || index >= this.length) {
      throw new TypeError("index out of range");
    }
    this.#patternList = patternList;
    this.#globList = globList;
    this.#index = index;
    this.#platform = platform;
    if (this.#index === 0) {
      if (this.isUNC()) {
        const [p0, p1, p2, p3, ...prest] = this.#patternList;
        const [g0, g1, g2, g3, ...grest] = this.#globList;
        if (prest[0] === "") {
          prest.shift();
          grest.shift();
        }
        const p = [p0, p1, p2, p3, ""].join("/");
        const g = [g0, g1, g2, g3, ""].join("/");
        this.#patternList = [p, ...prest];
        this.#globList = [g, ...grest];
        this.length = this.#patternList.length;
      } else if (this.isDrive() || this.isAbsolute()) {
        const [p1, ...prest] = this.#patternList;
        const [g1, ...grest] = this.#globList;
        if (prest[0] === "") {
          prest.shift();
          grest.shift();
        }
        const p = p1 + "/";
        const g = g1 + "/";
        this.#patternList = [p, ...prest];
        this.#globList = [g, ...grest];
        this.length = this.#patternList.length;
      }
    }
  }
  /**
   * The first entry in the parsed list of patterns
   */
  pattern() {
    return this.#patternList[this.#index];
  }
  /**
   * true of if pattern() returns a string
   */
  isString() {
    return typeof this.#patternList[this.#index] === "string";
  }
  /**
   * true of if pattern() returns GLOBSTAR
   */
  isGlobstar() {
    return this.#patternList[this.#index] === GLOBSTAR;
  }
  /**
   * true if pattern() returns a regexp
   */
  isRegExp() {
    return this.#patternList[this.#index] instanceof RegExp;
  }
  /**
   * The /-joined set of glob parts that make up this pattern
   */
  globString() {
    return this.#globString = this.#globString || (this.#index === 0 ? this.isAbsolute() ? this.#globList[0] + this.#globList.slice(1).join("/") : this.#globList.join("/") : this.#globList.slice(this.#index).join("/"));
  }
  /**
   * true if there are more pattern parts after this one
   */
  hasMore() {
    return this.length > this.#index + 1;
  }
  /**
   * The rest of the pattern after this part, or null if this is the end
   */
  rest() {
    if (this.#rest !== void 0)
      return this.#rest;
    if (!this.hasMore())
      return this.#rest = null;
    this.#rest = new _Pattern(this.#patternList, this.#globList, this.#index + 1, this.#platform);
    this.#rest.#isAbsolute = this.#isAbsolute;
    this.#rest.#isUNC = this.#isUNC;
    this.#rest.#isDrive = this.#isDrive;
    return this.#rest;
  }
  /**
   * true if the pattern represents a //unc/path/ on windows
   */
  isUNC() {
    const pl = this.#patternList;
    return this.#isUNC !== void 0 ? this.#isUNC : this.#isUNC = this.#platform === "win32" && this.#index === 0 && pl[0] === "" && pl[1] === "" && typeof pl[2] === "string" && !!pl[2] && typeof pl[3] === "string" && !!pl[3];
  }
  // pattern like C:/...
  // split = ['C:', ...]
  // XXX: would be nice to handle patterns like `c:*` to test the cwd
  // in c: for *, but I don't know of a way to even figure out what that
  // cwd is without actually chdir'ing into it?
  /**
   * True if the pattern starts with a drive letter on Windows
   */
  isDrive() {
    const pl = this.#patternList;
    return this.#isDrive !== void 0 ? this.#isDrive : this.#isDrive = this.#platform === "win32" && this.#index === 0 && this.length > 1 && typeof pl[0] === "string" && /^[a-z]:$/i.test(pl[0]);
  }
  // pattern = '/' or '/...' or '/x/...'
  // split = ['', ''] or ['', ...] or ['', 'x', ...]
  // Drive and UNC both considered absolute on windows
  /**
   * True if the pattern is rooted on an absolute path
   */
  isAbsolute() {
    const pl = this.#patternList;
    return this.#isAbsolute !== void 0 ? this.#isAbsolute : this.#isAbsolute = pl[0] === "" && pl.length > 1 || this.isDrive() || this.isUNC();
  }
  /**
   * consume the root of the pattern, and return it
   */
  root() {
    const p = this.#patternList[0];
    return typeof p === "string" && this.isAbsolute() && this.#index === 0 ? p : "";
  }
  /**
   * Check to see if the current globstar pattern is allowed to follow
   * a symbolic link.
   */
  checkFollowGlobstar() {
    return !(this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar);
  }
  /**
   * Mark that the current globstar pattern is following a symbolic link
   */
  markFollowGlobstar() {
    if (this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar)
      return false;
    this.#followGlobstar = false;
    return true;
  }
};

// packages/tiny-brain-core/node_modules/glob/dist/esm/ignore.js
var defaultPlatform2 = typeof process === "object" && process && typeof process.platform === "string" ? process.platform : "linux";
var Ignore = class {
  relative;
  relativeChildren;
  absolute;
  absoluteChildren;
  platform;
  mmopts;
  constructor(ignored, { nobrace, nocase, noext, noglobstar, platform = defaultPlatform2 }) {
    this.relative = [];
    this.absolute = [];
    this.relativeChildren = [];
    this.absoluteChildren = [];
    this.platform = platform;
    this.mmopts = {
      dot: true,
      nobrace,
      nocase,
      noext,
      noglobstar,
      optimizationLevel: 2,
      platform,
      nocomment: true,
      nonegate: true
    };
    for (const ign of ignored)
      this.add(ign);
  }
  add(ign) {
    const mm = new Minimatch(ign, this.mmopts);
    for (let i = 0; i < mm.set.length; i++) {
      const parsed = mm.set[i];
      const globParts = mm.globParts[i];
      if (!parsed || !globParts) {
        throw new Error("invalid pattern object");
      }
      while (parsed[0] === "." && globParts[0] === ".") {
        parsed.shift();
        globParts.shift();
      }
      const p = new Pattern(parsed, globParts, 0, this.platform);
      const m = new Minimatch(p.globString(), this.mmopts);
      const children = globParts[globParts.length - 1] === "**";
      const absolute = p.isAbsolute();
      if (absolute)
        this.absolute.push(m);
      else
        this.relative.push(m);
      if (children) {
        if (absolute)
          this.absoluteChildren.push(m);
        else
          this.relativeChildren.push(m);
      }
    }
  }
  ignored(p) {
    const fullpath = p.fullpath();
    const fullpaths = `${fullpath}/`;
    const relative2 = p.relative() || ".";
    const relatives = `${relative2}/`;
    for (const m of this.relative) {
      if (m.match(relative2) || m.match(relatives))
        return true;
    }
    for (const m of this.absolute) {
      if (m.match(fullpath) || m.match(fullpaths))
        return true;
    }
    return false;
  }
  childrenIgnored(p) {
    const fullpath = p.fullpath() + "/";
    const relative2 = (p.relative() || ".") + "/";
    for (const m of this.relativeChildren) {
      if (m.match(relative2))
        return true;
    }
    for (const m of this.absoluteChildren) {
      if (m.match(fullpath))
        return true;
    }
    return false;
  }
};

// packages/tiny-brain-core/node_modules/glob/dist/esm/processor.js
var HasWalkedCache = class _HasWalkedCache {
  store;
  constructor(store = /* @__PURE__ */ new Map()) {
    this.store = store;
  }
  copy() {
    return new _HasWalkedCache(new Map(this.store));
  }
  hasWalked(target, pattern) {
    return this.store.get(target.fullpath())?.has(pattern.globString());
  }
  storeWalked(target, pattern) {
    const fullpath = target.fullpath();
    const cached = this.store.get(fullpath);
    if (cached)
      cached.add(pattern.globString());
    else
      this.store.set(fullpath, /* @__PURE__ */ new Set([pattern.globString()]));
  }
};
var MatchRecord = class {
  store = /* @__PURE__ */ new Map();
  add(target, absolute, ifDir) {
    const n = (absolute ? 2 : 0) | (ifDir ? 1 : 0);
    const current = this.store.get(target);
    this.store.set(target, current === void 0 ? n : n & current);
  }
  // match, absolute, ifdir
  entries() {
    return [...this.store.entries()].map(([path12, n]) => [
      path12,
      !!(n & 2),
      !!(n & 1)
    ]);
  }
};
var SubWalks = class {
  store = /* @__PURE__ */ new Map();
  add(target, pattern) {
    if (!target.canReaddir()) {
      return;
    }
    const subs = this.store.get(target);
    if (subs) {
      if (!subs.find((p) => p.globString() === pattern.globString())) {
        subs.push(pattern);
      }
    } else
      this.store.set(target, [pattern]);
  }
  get(target) {
    const subs = this.store.get(target);
    if (!subs) {
      throw new Error("attempting to walk unknown path");
    }
    return subs;
  }
  entries() {
    return this.keys().map((k) => [k, this.store.get(k)]);
  }
  keys() {
    return [...this.store.keys()].filter((t) => t.canReaddir());
  }
};
var Processor = class _Processor {
  hasWalkedCache;
  matches = new MatchRecord();
  subwalks = new SubWalks();
  patterns;
  follow;
  dot;
  opts;
  constructor(opts, hasWalkedCache) {
    this.opts = opts;
    this.follow = !!opts.follow;
    this.dot = !!opts.dot;
    this.hasWalkedCache = hasWalkedCache ? hasWalkedCache.copy() : new HasWalkedCache();
  }
  processPatterns(target, patterns) {
    this.patterns = patterns;
    const processingSet = patterns.map((p) => [target, p]);
    for (let [t, pattern] of processingSet) {
      this.hasWalkedCache.storeWalked(t, pattern);
      const root = pattern.root();
      const absolute = pattern.isAbsolute() && this.opts.absolute !== false;
      if (root) {
        t = t.resolve(root === "/" && this.opts.root !== void 0 ? this.opts.root : root);
        const rest2 = pattern.rest();
        if (!rest2) {
          this.matches.add(t, true, false);
          continue;
        } else {
          pattern = rest2;
        }
      }
      if (t.isENOENT())
        continue;
      let p;
      let rest;
      let changed = false;
      while (typeof (p = pattern.pattern()) === "string" && (rest = pattern.rest())) {
        const c = t.resolve(p);
        t = c;
        pattern = rest;
        changed = true;
      }
      p = pattern.pattern();
      rest = pattern.rest();
      if (changed) {
        if (this.hasWalkedCache.hasWalked(t, pattern))
          continue;
        this.hasWalkedCache.storeWalked(t, pattern);
      }
      if (typeof p === "string") {
        const ifDir = p === ".." || p === "" || p === ".";
        this.matches.add(t.resolve(p), absolute, ifDir);
        continue;
      } else if (p === GLOBSTAR) {
        if (!t.isSymbolicLink() || this.follow || pattern.checkFollowGlobstar()) {
          this.subwalks.add(t, pattern);
        }
        const rp = rest?.pattern();
        const rrest = rest?.rest();
        if (!rest || (rp === "" || rp === ".") && !rrest) {
          this.matches.add(t, absolute, rp === "" || rp === ".");
        } else {
          if (rp === "..") {
            const tp = t.parent || t;
            if (!rrest)
              this.matches.add(tp, absolute, true);
            else if (!this.hasWalkedCache.hasWalked(tp, rrest)) {
              this.subwalks.add(tp, rrest);
            }
          }
        }
      } else if (p instanceof RegExp) {
        this.subwalks.add(t, pattern);
      }
    }
    return this;
  }
  subwalkTargets() {
    return this.subwalks.keys();
  }
  child() {
    return new _Processor(this.opts, this.hasWalkedCache);
  }
  // return a new Processor containing the subwalks for each
  // child entry, and a set of matches, and
  // a hasWalkedCache that's a copy of this one
  // then we're going to call
  filterEntries(parent, entries) {
    const patterns = this.subwalks.get(parent);
    const results = this.child();
    for (const e of entries) {
      for (const pattern of patterns) {
        const absolute = pattern.isAbsolute();
        const p = pattern.pattern();
        const rest = pattern.rest();
        if (p === GLOBSTAR) {
          results.testGlobstar(e, pattern, rest, absolute);
        } else if (p instanceof RegExp) {
          results.testRegExp(e, p, rest, absolute);
        } else {
          results.testString(e, p, rest, absolute);
        }
      }
    }
    return results;
  }
  testGlobstar(e, pattern, rest, absolute) {
    if (this.dot || !e.name.startsWith(".")) {
      if (!pattern.hasMore()) {
        this.matches.add(e, absolute, false);
      }
      if (e.canReaddir()) {
        if (this.follow || !e.isSymbolicLink()) {
          this.subwalks.add(e, pattern);
        } else if (e.isSymbolicLink()) {
          if (rest && pattern.checkFollowGlobstar()) {
            this.subwalks.add(e, rest);
          } else if (pattern.markFollowGlobstar()) {
            this.subwalks.add(e, pattern);
          }
        }
      }
    }
    if (rest) {
      const rp = rest.pattern();
      if (typeof rp === "string" && // dots and empty were handled already
      rp !== ".." && rp !== "" && rp !== ".") {
        this.testString(e, rp, rest.rest(), absolute);
      } else if (rp === "..") {
        const ep = e.parent || e;
        this.subwalks.add(ep, rest);
      } else if (rp instanceof RegExp) {
        this.testRegExp(e, rp, rest.rest(), absolute);
      }
    }
  }
  testRegExp(e, p, rest, absolute) {
    if (!p.test(e.name))
      return;
    if (!rest) {
      this.matches.add(e, absolute, false);
    } else {
      this.subwalks.add(e, rest);
    }
  }
  testString(e, p, rest, absolute) {
    if (!e.isNamed(p))
      return;
    if (!rest) {
      this.matches.add(e, absolute, false);
    } else {
      this.subwalks.add(e, rest);
    }
  }
};

// packages/tiny-brain-core/node_modules/glob/dist/esm/walker.js
var makeIgnore = (ignore, opts) => typeof ignore === "string" ? new Ignore([ignore], opts) : Array.isArray(ignore) ? new Ignore(ignore, opts) : ignore;
var GlobUtil = class {
  path;
  patterns;
  opts;
  seen = /* @__PURE__ */ new Set();
  paused = false;
  aborted = false;
  #onResume = [];
  #ignore;
  #sep;
  signal;
  maxDepth;
  includeChildMatches;
  constructor(patterns, path12, opts) {
    this.patterns = patterns;
    this.path = path12;
    this.opts = opts;
    this.#sep = !opts.posix && opts.platform === "win32" ? "\\" : "/";
    this.includeChildMatches = opts.includeChildMatches !== false;
    if (opts.ignore || !this.includeChildMatches) {
      this.#ignore = makeIgnore(opts.ignore ?? [], opts);
      if (!this.includeChildMatches && typeof this.#ignore.add !== "function") {
        const m = "cannot ignore child matches, ignore lacks add() method.";
        throw new Error(m);
      }
    }
    this.maxDepth = opts.maxDepth || Infinity;
    if (opts.signal) {
      this.signal = opts.signal;
      this.signal.addEventListener("abort", () => {
        this.#onResume.length = 0;
      });
    }
  }
  #ignored(path12) {
    return this.seen.has(path12) || !!this.#ignore?.ignored?.(path12);
  }
  #childrenIgnored(path12) {
    return !!this.#ignore?.childrenIgnored?.(path12);
  }
  // backpressure mechanism
  pause() {
    this.paused = true;
  }
  resume() {
    if (this.signal?.aborted)
      return;
    this.paused = false;
    let fn = void 0;
    while (!this.paused && (fn = this.#onResume.shift())) {
      fn();
    }
  }
  onResume(fn) {
    if (this.signal?.aborted)
      return;
    if (!this.paused) {
      fn();
    } else {
      this.#onResume.push(fn);
    }
  }
  // do the requisite realpath/stat checking, and return the path
  // to add or undefined to filter it out.
  async matchCheck(e, ifDir) {
    if (ifDir && this.opts.nodir)
      return void 0;
    let rpc;
    if (this.opts.realpath) {
      rpc = e.realpathCached() || await e.realpath();
      if (!rpc)
        return void 0;
      e = rpc;
    }
    const needStat = e.isUnknown() || this.opts.stat;
    const s = needStat ? await e.lstat() : e;
    if (this.opts.follow && this.opts.nodir && s?.isSymbolicLink()) {
      const target = await s.realpath();
      if (target && (target.isUnknown() || this.opts.stat)) {
        await target.lstat();
      }
    }
    return this.matchCheckTest(s, ifDir);
  }
  matchCheckTest(e, ifDir) {
    return e && (this.maxDepth === Infinity || e.depth() <= this.maxDepth) && (!ifDir || e.canReaddir()) && (!this.opts.nodir || !e.isDirectory()) && (!this.opts.nodir || !this.opts.follow || !e.isSymbolicLink() || !e.realpathCached()?.isDirectory()) && !this.#ignored(e) ? e : void 0;
  }
  matchCheckSync(e, ifDir) {
    if (ifDir && this.opts.nodir)
      return void 0;
    let rpc;
    if (this.opts.realpath) {
      rpc = e.realpathCached() || e.realpathSync();
      if (!rpc)
        return void 0;
      e = rpc;
    }
    const needStat = e.isUnknown() || this.opts.stat;
    const s = needStat ? e.lstatSync() : e;
    if (this.opts.follow && this.opts.nodir && s?.isSymbolicLink()) {
      const target = s.realpathSync();
      if (target && (target?.isUnknown() || this.opts.stat)) {
        target.lstatSync();
      }
    }
    return this.matchCheckTest(s, ifDir);
  }
  matchFinish(e, absolute) {
    if (this.#ignored(e))
      return;
    if (!this.includeChildMatches && this.#ignore?.add) {
      const ign = `${e.relativePosix()}/**`;
      this.#ignore.add(ign);
    }
    const abs = this.opts.absolute === void 0 ? absolute : this.opts.absolute;
    this.seen.add(e);
    const mark = this.opts.mark && e.isDirectory() ? this.#sep : "";
    if (this.opts.withFileTypes) {
      this.matchEmit(e);
    } else if (abs) {
      const abs2 = this.opts.posix ? e.fullpathPosix() : e.fullpath();
      this.matchEmit(abs2 + mark);
    } else {
      const rel = this.opts.posix ? e.relativePosix() : e.relative();
      const pre = this.opts.dotRelative && !rel.startsWith(".." + this.#sep) ? "." + this.#sep : "";
      this.matchEmit(!rel ? "." + mark : pre + rel + mark);
    }
  }
  async match(e, absolute, ifDir) {
    const p = await this.matchCheck(e, ifDir);
    if (p)
      this.matchFinish(p, absolute);
  }
  matchSync(e, absolute, ifDir) {
    const p = this.matchCheckSync(e, ifDir);
    if (p)
      this.matchFinish(p, absolute);
  }
  walkCB(target, patterns, cb) {
    if (this.signal?.aborted)
      cb();
    this.walkCB2(target, patterns, new Processor(this.opts), cb);
  }
  walkCB2(target, patterns, processor, cb) {
    if (this.#childrenIgnored(target))
      return cb();
    if (this.signal?.aborted)
      cb();
    if (this.paused) {
      this.onResume(() => this.walkCB2(target, patterns, processor, cb));
      return;
    }
    processor.processPatterns(target, patterns);
    let tasks = 1;
    const next = () => {
      if (--tasks === 0)
        cb();
    };
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m))
        continue;
      tasks++;
      this.match(m, absolute, ifDir).then(() => next());
    }
    for (const t of processor.subwalkTargets()) {
      if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
        continue;
      }
      tasks++;
      const childrenCached = t.readdirCached();
      if (t.calledReaddir())
        this.walkCB3(t, childrenCached, processor, next);
      else {
        t.readdirCB((_, entries) => this.walkCB3(t, entries, processor, next), true);
      }
    }
    next();
  }
  walkCB3(target, entries, processor, cb) {
    processor = processor.filterEntries(target, entries);
    let tasks = 1;
    const next = () => {
      if (--tasks === 0)
        cb();
    };
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m))
        continue;
      tasks++;
      this.match(m, absolute, ifDir).then(() => next());
    }
    for (const [target2, patterns] of processor.subwalks.entries()) {
      tasks++;
      this.walkCB2(target2, patterns, processor.child(), next);
    }
    next();
  }
  walkCBSync(target, patterns, cb) {
    if (this.signal?.aborted)
      cb();
    this.walkCB2Sync(target, patterns, new Processor(this.opts), cb);
  }
  walkCB2Sync(target, patterns, processor, cb) {
    if (this.#childrenIgnored(target))
      return cb();
    if (this.signal?.aborted)
      cb();
    if (this.paused) {
      this.onResume(() => this.walkCB2Sync(target, patterns, processor, cb));
      return;
    }
    processor.processPatterns(target, patterns);
    let tasks = 1;
    const next = () => {
      if (--tasks === 0)
        cb();
    };
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m))
        continue;
      this.matchSync(m, absolute, ifDir);
    }
    for (const t of processor.subwalkTargets()) {
      if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
        continue;
      }
      tasks++;
      const children = t.readdirSync();
      this.walkCB3Sync(t, children, processor, next);
    }
    next();
  }
  walkCB3Sync(target, entries, processor, cb) {
    processor = processor.filterEntries(target, entries);
    let tasks = 1;
    const next = () => {
      if (--tasks === 0)
        cb();
    };
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m))
        continue;
      this.matchSync(m, absolute, ifDir);
    }
    for (const [target2, patterns] of processor.subwalks.entries()) {
      tasks++;
      this.walkCB2Sync(target2, patterns, processor.child(), next);
    }
    next();
  }
};
var GlobWalker = class extends GlobUtil {
  matches = /* @__PURE__ */ new Set();
  constructor(patterns, path12, opts) {
    super(patterns, path12, opts);
  }
  matchEmit(e) {
    this.matches.add(e);
  }
  async walk() {
    if (this.signal?.aborted)
      throw this.signal.reason;
    if (this.path.isUnknown()) {
      await this.path.lstat();
    }
    await new Promise((res, rej) => {
      this.walkCB(this.path, this.patterns, () => {
        if (this.signal?.aborted) {
          rej(this.signal.reason);
        } else {
          res(this.matches);
        }
      });
    });
    return this.matches;
  }
  walkSync() {
    if (this.signal?.aborted)
      throw this.signal.reason;
    if (this.path.isUnknown()) {
      this.path.lstatSync();
    }
    this.walkCBSync(this.path, this.patterns, () => {
      if (this.signal?.aborted)
        throw this.signal.reason;
    });
    return this.matches;
  }
};
var GlobStream = class extends GlobUtil {
  results;
  constructor(patterns, path12, opts) {
    super(patterns, path12, opts);
    this.results = new Minipass({
      signal: this.signal,
      objectMode: true
    });
    this.results.on("drain", () => this.resume());
    this.results.on("resume", () => this.resume());
  }
  matchEmit(e) {
    this.results.write(e);
    if (!this.results.flowing)
      this.pause();
  }
  stream() {
    const target = this.path;
    if (target.isUnknown()) {
      target.lstat().then(() => {
        this.walkCB(target, this.patterns, () => this.results.end());
      });
    } else {
      this.walkCB(target, this.patterns, () => this.results.end());
    }
    return this.results;
  }
  streamSync() {
    if (this.path.isUnknown()) {
      this.path.lstatSync();
    }
    this.walkCBSync(this.path, this.patterns, () => this.results.end());
    return this.results;
  }
};

// packages/tiny-brain-core/node_modules/glob/dist/esm/glob.js
var defaultPlatform3 = typeof process === "object" && process && typeof process.platform === "string" ? process.platform : "linux";
var Glob = class {
  absolute;
  cwd;
  root;
  dot;
  dotRelative;
  follow;
  ignore;
  magicalBraces;
  mark;
  matchBase;
  maxDepth;
  nobrace;
  nocase;
  nodir;
  noext;
  noglobstar;
  pattern;
  platform;
  realpath;
  scurry;
  stat;
  signal;
  windowsPathsNoEscape;
  withFileTypes;
  includeChildMatches;
  /**
   * The options provided to the constructor.
   */
  opts;
  /**
   * An array of parsed immutable {@link Pattern} objects.
   */
  patterns;
  /**
   * All options are stored as properties on the `Glob` object.
   *
   * See {@link GlobOptions} for full options descriptions.
   *
   * Note that a previous `Glob` object can be passed as the
   * `GlobOptions` to another `Glob` instantiation to re-use settings
   * and caches with a new pattern.
   *
   * Traversal functions can be called multiple times to run the walk
   * again.
   */
  constructor(pattern, opts) {
    if (!opts)
      throw new TypeError("glob options required");
    this.withFileTypes = !!opts.withFileTypes;
    this.signal = opts.signal;
    this.follow = !!opts.follow;
    this.dot = !!opts.dot;
    this.dotRelative = !!opts.dotRelative;
    this.nodir = !!opts.nodir;
    this.mark = !!opts.mark;
    if (!opts.cwd) {
      this.cwd = "";
    } else if (opts.cwd instanceof URL || opts.cwd.startsWith("file://")) {
      opts.cwd = fileURLToPath2(opts.cwd);
    }
    this.cwd = opts.cwd || "";
    this.root = opts.root;
    this.magicalBraces = !!opts.magicalBraces;
    this.nobrace = !!opts.nobrace;
    this.noext = !!opts.noext;
    this.realpath = !!opts.realpath;
    this.absolute = opts.absolute;
    this.includeChildMatches = opts.includeChildMatches !== false;
    this.noglobstar = !!opts.noglobstar;
    this.matchBase = !!opts.matchBase;
    this.maxDepth = typeof opts.maxDepth === "number" ? opts.maxDepth : Infinity;
    this.stat = !!opts.stat;
    this.ignore = opts.ignore;
    if (this.withFileTypes && this.absolute !== void 0) {
      throw new Error("cannot set absolute and withFileTypes:true");
    }
    if (typeof pattern === "string") {
      pattern = [pattern];
    }
    this.windowsPathsNoEscape = !!opts.windowsPathsNoEscape || opts.allowWindowsEscape === false;
    if (this.windowsPathsNoEscape) {
      pattern = pattern.map((p) => p.replace(/\\/g, "/"));
    }
    if (this.matchBase) {
      if (opts.noglobstar) {
        throw new TypeError("base matching requires globstar");
      }
      pattern = pattern.map((p) => p.includes("/") ? p : `./**/${p}`);
    }
    this.pattern = pattern;
    this.platform = opts.platform || defaultPlatform3;
    this.opts = { ...opts, platform: this.platform };
    if (opts.scurry) {
      this.scurry = opts.scurry;
      if (opts.nocase !== void 0 && opts.nocase !== opts.scurry.nocase) {
        throw new Error("nocase option contradicts provided scurry option");
      }
    } else {
      const Scurry = opts.platform === "win32" ? PathScurryWin32 : opts.platform === "darwin" ? PathScurryDarwin : opts.platform ? PathScurryPosix : PathScurry;
      this.scurry = new Scurry(this.cwd, {
        nocase: opts.nocase,
        fs: opts.fs
      });
    }
    this.nocase = this.scurry.nocase;
    const nocaseMagicOnly = this.platform === "darwin" || this.platform === "win32";
    const mmo = {
      // default nocase based on platform
      ...opts,
      dot: this.dot,
      matchBase: this.matchBase,
      nobrace: this.nobrace,
      nocase: this.nocase,
      nocaseMagicOnly,
      nocomment: true,
      noext: this.noext,
      nonegate: true,
      optimizationLevel: 2,
      platform: this.platform,
      windowsPathsNoEscape: this.windowsPathsNoEscape,
      debug: !!this.opts.debug
    };
    const mms = this.pattern.map((p) => new Minimatch(p, mmo));
    const [matchSet, globParts] = mms.reduce((set, m) => {
      set[0].push(...m.set);
      set[1].push(...m.globParts);
      return set;
    }, [[], []]);
    this.patterns = matchSet.map((set, i) => {
      const g = globParts[i];
      if (!g)
        throw new Error("invalid pattern object");
      return new Pattern(set, g, 0, this.platform);
    });
  }
  async walk() {
    return [
      ...await new GlobWalker(this.patterns, this.scurry.cwd, {
        ...this.opts,
        maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
        platform: this.platform,
        nocase: this.nocase,
        includeChildMatches: this.includeChildMatches
      }).walk()
    ];
  }
  walkSync() {
    return [
      ...new GlobWalker(this.patterns, this.scurry.cwd, {
        ...this.opts,
        maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
        platform: this.platform,
        nocase: this.nocase,
        includeChildMatches: this.includeChildMatches
      }).walkSync()
    ];
  }
  stream() {
    return new GlobStream(this.patterns, this.scurry.cwd, {
      ...this.opts,
      maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
      platform: this.platform,
      nocase: this.nocase,
      includeChildMatches: this.includeChildMatches
    }).stream();
  }
  streamSync() {
    return new GlobStream(this.patterns, this.scurry.cwd, {
      ...this.opts,
      maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
      platform: this.platform,
      nocase: this.nocase,
      includeChildMatches: this.includeChildMatches
    }).streamSync();
  }
  /**
   * Default sync iteration function. Returns a Generator that
   * iterates over the results.
   */
  iterateSync() {
    return this.streamSync()[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.iterateSync();
  }
  /**
   * Default async iteration function. Returns an AsyncGenerator that
   * iterates over the results.
   */
  iterate() {
    return this.stream()[Symbol.asyncIterator]();
  }
  [Symbol.asyncIterator]() {
    return this.iterate();
  }
};

// packages/tiny-brain-core/node_modules/glob/dist/esm/has-magic.js
var hasMagic = (pattern, options = {}) => {
  if (!Array.isArray(pattern)) {
    pattern = [pattern];
  }
  for (const p of pattern) {
    if (new Minimatch(p, options).hasMagic())
      return true;
  }
  return false;
};

// packages/tiny-brain-core/node_modules/glob/dist/esm/index.js
function globStreamSync(pattern, options = {}) {
  return new Glob(pattern, options).streamSync();
}
function globStream(pattern, options = {}) {
  return new Glob(pattern, options).stream();
}
function globSync(pattern, options = {}) {
  return new Glob(pattern, options).walkSync();
}
async function glob_(pattern, options = {}) {
  return new Glob(pattern, options).walk();
}
function globIterateSync(pattern, options = {}) {
  return new Glob(pattern, options).iterateSync();
}
function globIterate(pattern, options = {}) {
  return new Glob(pattern, options).iterate();
}
var streamSync = globStreamSync;
var stream = Object.assign(globStream, { sync: globStreamSync });
var iterateSync = globIterateSync;
var iterate = Object.assign(globIterate, {
  sync: globIterateSync
});
var sync = Object.assign(globSync, {
  stream: globStreamSync,
  iterate: globIterateSync
});
var glob = Object.assign(glob_, {
  glob: glob_,
  globSync,
  sync,
  globStream,
  stream,
  globStreamSync,
  streamSync,
  globIterate,
  iterate,
  globIterateSync,
  iterateSync,
  Glob,
  hasMagic,
  escape,
  unescape
});
glob.glob = glob;

// packages/tiny-brain-core/src/services/planning/planning-service.ts
import { exec } from "child_process";
import { promisify } from "util";
var execAsync = promisify(exec);
var PlanningService = class extends BaseService {
  repositoryRoot;
  constructor(context) {
    super(context);
    this.repositoryRoot = context.repositoryRoot;
  }
  /**
   * Extract features from planning discussion text
   */
  async extractFeatures(text) {
    const result = await extractFeaturesFromText(text);
    return ResultHelpers.unwrap(result);
  }
  /**
   * Create a new plan
   * Supports both legacy (from context) and new (explicit args) patterns
   */
  async createPlan(args) {
    const personaId = this.requireActivePersona();
    const title = args.title;
    const overview = args.overview;
    const initialFeatures = args.initialFeatures;
    const planDetails = args.planDetails;
    if (!title || !overview) {
      throw new Error("Title and overview are required for plan creation");
    }
    try {
      const gitIdentity = await this.getGitIdentity();
      let features = initialFeatures || [];
      if (!features.length && planDetails) {
        features = await this.extractFeatures(planDetails);
      }
      const plan = {
        id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        overview,
        type: "active",
        status: "not_started",
        features: features.map((featureTitle, index) => ({
          id: `feature-${index + 1}`,
          number: index + 1,
          title: featureTitle,
          description: "",
          status: "defined",
          tasks: [],
          taskSummary: {
            total: 0,
            completed: 0,
            remaining: 0
          }
        })),
        created: (/* @__PURE__ */ new Date()).toISOString(),
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
        metadata: {
          totalFeatures: features.length,
          completedFeatures: 0,
          totalTasks: 0,
          completedTasks: 0,
          lastChanges: [],
          contributors: [],
          tags: []
        },
        currentState: {
          feature: 1,
          featureTitle: features[0] || "",
          overallProgress: {
            completedFeatures: 0,
            totalFeatures: features.length,
            completedTasks: 0,
            totalTasks: 0,
            percentComplete: 0
          },
          workRemaining: {
            pendingFeatures: features.slice(1),
            currentFeatureTasks: 0,
            futureFeatureTasks: 0
          },
          nextAction: void 0,
          blockers: []
        },
        gitUserEmail: gitIdentity.email,
        gitUserName: gitIdentity.name
      };
      await this.savePlan(plan, personaId);
      this.log("info", "Plan created", {
        planId: plan.id,
        title: plan.title,
        personaId,
        features: plan.features.length
      });
      return plan;
    } catch (error) {
      this.log("error", "Failed to create plan:", error);
      throw error;
    }
  }
  /**
   * Load a plan by ID
   * Supports both legacy (from context) and new (explicit args) patterns
   */
  async loadPlan(args) {
    const planId = args?.planId;
    if (!planId) {
      const activePlans = await this.listPlans({ type: "active" });
      if (activePlans.length === 0) {
        return null;
      }
      return activePlans[0];
    }
    const personaId = this.context.activePersona?.id;
    if (!personaId) {
      return this.loadPlanFromRepo(planId);
    }
    return this.loadPlanById(planId, personaId);
  }
  /**
   * Load a plan for any persona (not just the active one)
   * Useful for dashboard/viewing purposes where you want to see plans
   * for personas that aren't currently active
   */
  async loadPlanForPersona(personaId, planId) {
    if (!personaId || !planId) {
      this.log("error", "loadPlanForPersona requires both personaId and planId");
      return null;
    }
    return this.loadPlanById(planId, personaId);
  }
  /**
   * List plans for any persona (not just the active one)
   * Useful for dashboard/viewing purposes
   */
  async listPlansForPersona(personaId, options) {
    if (!personaId) {
      this.log("error", "listPlansForPersona requires personaId");
      return [];
    }
    try {
      const plans = [];
      const files = await this.storage.listPersonaFiles(personaId, this.userId);
      const planFiles = files.filter((f) => {
        if (!f.endsWith(".json")) return false;
        if (f.includes("README") || f.includes("current-plan-id")) return false;
        if (options?.type === "active") return f.startsWith("plans/active/");
        if (options?.type === "archived") return f.startsWith("plans/archived/");
        return f.startsWith("plans/active/") || f.startsWith("plans/archived/");
      });
      for (const file of planFiles) {
        try {
          const content = await this.storage.getPersonaFile(personaId, file, this.userId);
          if (content) {
            const plan = JSON.parse(content);
            plans.push(plan);
          }
        } catch (error) {
          this.log("warn", `Failed to load plan from ${file}:`, error);
        }
      }
      plans.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      return plans;
    } catch (error) {
      this.log("error", `Failed to list plans for persona ${personaId}:`, error);
      return [];
    }
  }
  /**
   * Update an existing plan with support for bulk operations
   * Supports both legacy (from context) and new (explicit args) patterns
   */
  async updatePlan(args) {
    const planId = args.planId;
    const updates = args.updates;
    if (!planId || !updates) {
      throw new Error("Plan ID and updates are required");
    }
    try {
      const plan = await this.loadPlanFromRepo(planId);
      if (!plan) {
        throw new Error(`Plan not found: ${planId}`);
      }
      const updateResult = await applyBulkUpdates({
        plan,
        updates
      });
      const { plan: updatedPlan, changes } = ResultHelpers.unwrap(updateResult);
      await this.savePlanToRepo(updatedPlan);
      if (updatedPlan.prdDirPath) {
        const timestamp = (/* @__PURE__ */ new Date()).toISOString();
        if (changes.featuresUpdated && changes.featuresUpdated.length > 0) {
          for (const featureUpdate of changes.featuresUpdated) {
            for (const task of featureUpdate.tasksCompleted) {
              const taskCompletedEvent = {
                eventType: "prd:feature:task:completed",
                prdId: updatedPlan.id,
                prdPath: updatedPlan.prdDirPath,
                timestamp,
                feature: {
                  id: featureUpdate.feature.id,
                  number: featureUpdate.feature.number,
                  title: featureUpdate.feature.title,
                  status: featureUpdate.feature.status
                },
                task: {
                  id: task.id,
                  description: task.description,
                  status: task.status,
                  testCommitSha: task.testCommitSha,
                  testCommittedAt: task.testCommittedAt,
                  commitSha: task.commitSha,
                  committedAt: task.committedAt,
                  refactorCommitSha: task.refactorCommitSha,
                  refactorCommittedAt: task.refactorCommittedAt
                }
              };
              await this.emitPlanChange(taskCompletedEvent);
            }
            if (featureUpdate.tasksAdded.length > 0) {
              const tasksAddedEvent = {
                eventType: "prd:feature:tasks:added",
                prdId: updatedPlan.id,
                prdPath: updatedPlan.prdDirPath,
                timestamp,
                feature: {
                  id: featureUpdate.feature.id,
                  number: featureUpdate.feature.number,
                  title: featureUpdate.feature.title,
                  status: featureUpdate.feature.status
                },
                tasks: featureUpdate.tasksAdded.map((t) => ({
                  id: t.id,
                  description: t.description,
                  status: t.status,
                  testCommitSha: t.testCommitSha,
                  testCommittedAt: t.testCommittedAt,
                  commitSha: t.commitSha,
                  committedAt: t.committedAt,
                  refactorCommitSha: t.refactorCommitSha,
                  refactorCommittedAt: t.refactorCommittedAt
                }))
              };
              await this.emitPlanChange(tasksAddedEvent);
            }
            if (featureUpdate.statusChanged) {
              const featureUpdatedEvent = {
                eventType: "prd:feature:updated",
                prdId: updatedPlan.id,
                prdPath: updatedPlan.prdDirPath,
                timestamp,
                feature: {
                  id: featureUpdate.feature.id,
                  number: featureUpdate.feature.number,
                  title: featureUpdate.feature.title,
                  status: featureUpdate.feature.status
                }
              };
              await this.emitPlanChange(featureUpdatedEvent);
            }
          }
        }
      }
      this.log("info", "Plan updated", {
        planId: updatedPlan.id,
        title: updatedPlan.title
      });
      return updatedPlan;
    } catch (error) {
      this.log("error", "Failed to update plan:", error);
      throw error;
    }
  }
  /**
   * Archive a plan
   * Supports both legacy (from context) and new (explicit args) patterns
   */
  async archivePlan(args) {
    const personaId = this.requireActivePersona();
    let planId = args?.planId;
    const reason = args?.reason;
    if (!planId) {
      const activePlan = await this.getActivePlan();
      if (activePlan) {
        planId = activePlan.id;
      } else {
        throw new Error("No active plan to archive");
      }
    }
    try {
      const plan = await this.loadPlanById(planId, personaId);
      if (!plan) {
        throw new Error(`Plan not found: ${planId}`);
      }
      const activeFilename = `plans/active/${planId}.json`;
      try {
        await this.storage.deletePersonaFile(personaId, activeFilename, this.userId);
      } catch {
      }
      plan.type = "archived";
      plan.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      const archivedFilename = `plans/archived/${planId}.json`;
      await this.storage.storePersonaFile(
        personaId,
        archivedFilename,
        JSON.stringify(plan, null, 2),
        this.userId
      );
      try {
        const currentActivePlanId = await this.storage.getPersonaFile(
          personaId,
          "plans/current-plan-id.txt",
          this.userId
        );
        if (currentActivePlanId && currentActivePlanId.trim() === planId) {
          await this.storage.deletePersonaFile(
            personaId,
            "plans/current-plan-id.txt",
            this.userId
          );
          this.log("info", "Cleared active plan ID as the active plan was archived");
        }
      } catch {
      }
      this.log("info", "Plan archived", {
        planId,
        personaId,
        reason
      });
      return plan;
    } catch (error) {
      this.log("error", "Failed to archive plan:", error);
      throw error;
    }
  }
  /**
   * Unarchive a plan (move back to active)
   */
  async unarchivePlan(planId) {
    const personaId = this.requireActivePersona();
    if (!planId) {
      throw new Error("Plan ID is required");
    }
    try {
      const plan = await this.loadPlanById(planId, personaId);
      if (!plan) {
        throw new Error(`Plan not found: ${planId}`);
      }
      if (plan.type !== "archived") {
        throw new Error(`Plan is not archived: ${planId}`);
      }
      const archivedFilename = `plans/archived/${planId}.json`;
      try {
        await this.storage.deletePersonaFile(personaId, archivedFilename, this.userId);
      } catch {
      }
      plan.type = "active";
      plan.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      const activeFilename = `plans/active/${planId}.json`;
      await this.storage.storePersonaFile(
        personaId,
        activeFilename,
        JSON.stringify(plan, null, 2),
        this.userId
      );
      this.log("info", "Plan unarchived", {
        planId,
        planTitle: plan.title,
        personaId
      });
      return plan;
    } catch (error) {
      this.log("error", "Failed to unarchive plan:", error);
      throw error;
    }
  }
  /**
   * Switch to a different plan (set as active)
   */
  async switchToPlan(planId) {
    const personaId = this.requireActivePersona();
    if (!planId) {
      throw new Error("Plan ID is required");
    }
    try {
      this.log("debug", `Attempting to load plan ${planId} for persona ${personaId}`);
      let plan = await this.loadPlanById(planId, personaId);
      if (!plan) {
        this.log("error", `Plan not found: ${planId} for persona ${personaId}`);
        throw new Error(`Plan not found: ${planId}`);
      }
      if (plan.type === "archived") {
        plan = await this.unarchivePlan(planId);
      }
      await this.storage.storePersonaFile(
        personaId,
        "plans/current-plan-id.txt",
        planId,
        this.userId
      );
      this.log("info", "Switched to plan", {
        planId,
        planTitle: plan.title,
        personaId
      });
      return plan;
    } catch (error) {
      this.log("error", "Failed to switch to plan:", error);
      throw error;
    }
  }
  /**
   * Delete a plan permanently (must be archived first)
   */
  async deletePlan(planId) {
    const personaId = this.requireActivePersona();
    if (!planId) {
      throw new Error("Plan ID is required");
    }
    try {
      const plan = await this.loadPlanById(planId, personaId);
      if (!plan) {
        throw new Error(`Plan not found: ${planId}`);
      }
      if (plan.type !== "archived") {
        throw new Error(`Cannot delete active plan. Archive it first: ${planId}`);
      }
      const archivedFilename = `plans/archived/${planId}.json`;
      await this.storage.deletePersonaFile(personaId, archivedFilename, this.userId);
      this.log("info", "Plan deleted", {
        planId,
        planTitle: plan.title,
        personaId
      });
      return true;
    } catch (error) {
      this.log("error", "Failed to delete plan:", error);
      throw error;
    }
  }
  /**
   * List plans from repo storage and optionally from persona storage
   * @param args.type - 'active' | 'archived' | undefined (undefined returns all)
   * @param args.repoPath - Override the repository path to scan for plans
   */
  async listPlans(args) {
    const type = args?.type;
    const mine = args?.mine ?? false;
    const repoPathOverride = args?.repoPath;
    this.log("debug", `listPlans called with type: ${type}, mine: ${mine}, repoPath: ${repoPathOverride}, repositoryRoot: ${this.repositoryRoot}`);
    try {
      const plans = [];
      let userEmail;
      if (mine) {
        try {
          userEmail = await this.getGitUserEmail();
          this.log("debug", `Filtering plans for user: ${userEmail}`);
        } catch (error) {
          this.log("debug", "Failed to get git user email, mine filter will return empty:", error);
          return [];
        }
      }
      try {
        const prdDirs = repoPathOverride ? await this.getPRDDirectoriesForPath(repoPathOverride) : await this.getPRDDirectories();
        this.log("debug", `Found ${prdDirs.length} PRD directories in repo`);
        const repoRoot = repoPathOverride || await this.findRepositoryRoot();
        for (const prdDir of prdDirs) {
          const prdId = path2.basename(prdDir);
          const progressPath = path2.join(repoRoot, ".tiny-brain", "progress", `${prdId}.json`);
          try {
            await fs.access(progressPath);
            const content = await fs.readFile(progressPath, "utf-8");
            const plan = JSON.parse(content);
            if (type && plan.type !== type) {
              continue;
            }
            if (mine && userEmail) {
              const hasCommits = await this.hasUserCommits(prdDir, userEmail);
              if (!hasCommits) {
                this.log("debug", `User has no commits in ${prdDir}, skipping`);
                continue;
              }
            }
            plans.push(plan);
            this.log("debug", `Loaded plan ${plan.id} from repo storage`);
          } catch (error) {
            this.log("debug", `Could not load progress.json from ${prdDir}:`, error);
            continue;
          }
        }
      } catch (error) {
        this.log("error", "Failed to scan repo storage:", error);
      }
      if (repoPathOverride) {
        this.log("debug", "Skipping persona storage scan (repo-scoped query)");
      } else try {
        const personaId = this.context.activePersona?.id;
        if (personaId) {
          const files = await this.storage.listPersonaFiles(personaId, this.userId);
          const planFiles = files.filter((f) => {
            if (!f.endsWith(".json")) return false;
            if (f.includes("README") || f.includes("current-plan-id")) return false;
            if (type === "active") return f.startsWith("plans/active/");
            if (type === "archived") return f.startsWith("plans/archived/");
            return f.startsWith("plans/active/") || f.startsWith("plans/archived/");
          });
          for (const file of planFiles) {
            try {
              const content = await this.storage.getPersonaFile(personaId, file, this.userId);
              if (content) {
                const plan = JSON.parse(content);
                if (plans.some((p) => p.id === plan.id)) {
                  continue;
                }
                if (mine && userEmail) {
                  continue;
                }
                plans.push(plan);
                this.log("debug", `Loaded plan ${plan.id} from persona storage`);
              }
            } catch (error) {
              this.log("warn", `Failed to load plan from ${file}:`, error);
            }
          }
        }
      } catch (error) {
        this.log("debug", "Failed to scan persona storage:", error);
      }
      plans.sort(
        (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
      this.log("debug", `Listed ${plans.length} plans total (repo + persona storage)`);
      return plans;
    } catch (error) {
      this.log("error", "Failed to list plans", error);
      return [];
    }
  }
  /**
   * Get the active plan for the current persona
   */
  async getActivePlan() {
    const personaId = this.requireActivePersona();
    try {
      const activePlanIdFile = await this.storage.getPersonaFile(
        personaId,
        "plans/current-plan-id.txt",
        this.userId
      );
      if (activePlanIdFile) {
        const planId = activePlanIdFile.trim();
        const plan = await this.loadPlanById(planId, personaId);
        if (plan && plan.type === "active") {
          return plan;
        }
      }
      const activePlans = await this.listPlans({ type: "active" });
      if (activePlans.length === 0) {
        return null;
      }
      return activePlans.sort(
        (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      )[0];
    } catch (error) {
      this.log("error", "Failed to get active plan", error);
      return null;
    }
  }
  /**
   * Get a summary of the active plan
   */
  async getActivePlanSummary() {
    const plan = await this.getActivePlan();
    if (!plan) {
      return null;
    }
    return {
      id: plan.id,
      title: plan.title,
      type: plan.type,
      status: plan.status,
      currentState: plan.currentState,
      lastUpdated: plan.lastUpdated
    };
  }
  /**
   * Generate a status report for a plan
   */
  async generateStatusReport(plan) {
    const result = await generateStatusReport(plan);
    return ResultHelpers.unwrap(result);
  }
  /**
   * Format a plan for display
   */
  async formatPlan(plan, verbose = false) {
    const result = await formatPlan(plan, { verbose });
    return ResultHelpers.unwrap(result);
  }
  /**
   * Format plan structure for AI reference
   */
  async formatPlanStructure(plan) {
    const result = await formatPlanStructure(plan);
    return ResultHelpers.unwrap(result);
  }
  /**
   * Set a plan as the active plan
   * Supports both legacy (from context) and new (explicit args) patterns
   */
  async setActivePlan(args) {
    const personaId = this.requireActivePersona();
    const planId = args.planId;
    if (!planId) {
      throw new Error("Plan ID is required");
    }
    try {
      const plan = await this.loadPlanById(planId, personaId);
      if (!plan) {
        this.log("error", `Cannot set active plan: Plan ${planId} not found`);
        return false;
      }
      if (plan.type !== "active") {
        this.log("error", `Cannot set active plan: Plan ${planId} is archived`);
        return false;
      }
      await this.storage.storePersonaFile(
        personaId,
        "plans/current-plan-id.txt",
        planId,
        this.userId
      );
      this.log("info", "Active plan set", {
        planId,
        planTitle: plan.title,
        personaId
      });
      return true;
    } catch (error) {
      this.log("error", "Failed to set active plan:", error);
      return false;
    }
  }
  // Private helper methods
  /**
   * Get the path for a plan's progress.json file
   * New location: .tiny-brain/progress/{prdId}.json
   * Legacy location: docs/prd/{prdId}/progress.json
   */
  getProgressPath(repoRoot, prdId) {
    return path2.join(repoRoot, ".tiny-brain", "progress", `${prdId}.json`);
  }
  /**
   * Save plan to repository storage only (repo-scoped plans)
   */
  async savePlanToRepo(plan) {
    if (!plan.prdDirPath || !plan.prdId) {
      throw new Error("Plan must have PRD reference to be saved to repository");
    }
    try {
      const repoRoot = await this.findRepositoryRoot();
      const progressPath = this.getProgressPath(repoRoot, plan.prdId);
      const progressDir = path2.dirname(progressPath);
      await fs.mkdir(progressDir, { recursive: true });
      await fs.writeFile(progressPath, JSON.stringify(plan, null, 2), "utf-8");
      this.log("debug", `Saved plan: ${plan.id} to ${progressPath}`);
      const event = {
        eventType: "prd:created",
        prdId: plan.id,
        prdPath: plan.prdDirPath,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        plan
      };
      await this.emitPlanChange(event);
    } catch (error) {
      this.log("error", `Failed to save plan to repo:`, error);
      throw error;
    }
  }
  /**
   * Load plan from repository storage only
   * Checks new location first (.tiny-brain/progress/), then migrates from legacy location if needed
   */
  async loadPlanFromRepo(planId) {
    try {
      const repoRoot = await this.findRepositoryRoot();
      const newProgressPath = this.getProgressPath(repoRoot, planId);
      try {
        await fs.access(newProgressPath);
        const content = await fs.readFile(newProgressPath, "utf-8");
        const plan = JSON.parse(content);
        this.log("debug", `Successfully loaded plan: ${planId} from ${newProgressPath}`);
        return plan;
      } catch {
      }
      const prdDirs = await this.getPRDDirectories();
      for (const prdDir of prdDirs) {
        const legacyPath = path2.join(prdDir, "progress.json");
        try {
          await fs.access(legacyPath);
          const content = await fs.readFile(legacyPath, "utf-8");
          const plan = JSON.parse(content);
          if (plan.id === planId) {
            this.log("info", `Found plan in legacy location, migrating to ${newProgressPath}`);
            const progressDir = path2.dirname(newProgressPath);
            await fs.mkdir(progressDir, { recursive: true });
            await fs.writeFile(newProgressPath, JSON.stringify(plan, null, 2), "utf-8");
            this.log("debug", `Successfully migrated and loaded plan: ${planId}`);
            return plan;
          }
        } catch {
          continue;
        }
      }
      return null;
    } catch (error) {
      this.log("error", `Failed to load plan ${planId} from repo:`, error);
      return null;
    }
  }
  async savePlan(plan, personaId) {
    if (plan.prdDirPath && plan.prdId) {
      try {
        const repoRoot = await this.findRepositoryRoot();
        const progressPath = this.getProgressPath(repoRoot, plan.prdId);
        const progressDir = path2.dirname(progressPath);
        await fs.mkdir(progressDir, { recursive: true });
        await fs.writeFile(progressPath, JSON.stringify(plan, null, 2), "utf-8");
        this.log("debug", `Saved plan: ${plan.id} to ${progressPath}`);
        const event = {
          eventType: "prd:created",
          prdId: plan.id,
          prdPath: plan.prdDirPath,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          plan
        };
        await this.emitPlanChange(event);
        return;
      } catch (error) {
        this.log("error", `Failed to save plan to repo, falling back to persona storage:`, error);
      }
    }
    const status = plan.type === "archived" ? "archived" : "active";
    const filename = `plans/${status}/${plan.id}.json`;
    await this.storage.storePersonaFile(
      personaId,
      filename,
      JSON.stringify(plan, null, 2),
      this.userId
    );
    this.log("debug", `Saved plan: ${plan.id} to ${filename}`);
  }
  /**
   * Emit plan change event to registered listeners
   * Only emits for repo-scoped plans (not persona storage)
   */
  async emitPlanChange(event) {
    const listeners = this.context.planChangeListeners;
    if (!listeners || listeners.length === 0) {
      return;
    }
    const promises2 = listeners.map(async (listener) => {
      try {
        await listener(event);
      } catch (error) {
        this.log("error", "Plan change listener failed:", error);
      }
    });
    await Promise.all(promises2);
  }
  async loadPlanById(planId, personaId) {
    try {
      try {
        const repoRoot = await this.findRepositoryRoot();
        const newProgressPath = this.getProgressPath(repoRoot, planId);
        try {
          await fs.access(newProgressPath);
          const content2 = await fs.readFile(newProgressPath, "utf-8");
          const plan2 = JSON.parse(content2);
          this.log("debug", `Successfully loaded plan: ${planId} from ${newProgressPath}`);
          return plan2;
        } catch {
        }
        const prdDirs = await this.getPRDDirectories();
        for (const prdDir of prdDirs) {
          const legacyPath = path2.join(prdDir, "progress.json");
          try {
            await fs.access(legacyPath);
            const content2 = await fs.readFile(legacyPath, "utf-8");
            const plan2 = JSON.parse(content2);
            if (plan2.id === planId) {
              this.log("info", `Found plan in legacy location, migrating to ${newProgressPath}`);
              const progressDir = path2.dirname(newProgressPath);
              await fs.mkdir(progressDir, { recursive: true });
              await fs.writeFile(newProgressPath, JSON.stringify(plan2, null, 2), "utf-8");
              this.log("debug", `Successfully migrated and loaded plan: ${planId}`);
              return plan2;
            }
          } catch {
            continue;
          }
        }
      } catch (error) {
        this.log("debug", "Failed to search repo storage, falling back to persona storage:", error);
      }
      let filename = `plans/active/${planId}.json`;
      this.log("debug", `Looking for plan at: ${filename} for persona: ${personaId}`);
      let content = await this.storage.getPersonaFile(personaId, filename, this.userId);
      if (!content) {
        filename = `plans/archived/${planId}.json`;
        this.log("debug", `Not found in active, checking archived at: ${filename}`);
        content = await this.storage.getPersonaFile(personaId, filename, this.userId);
      }
      if (!content) {
        this.log("debug", `Plan not found in either location: ${planId} for persona: ${personaId}`);
        return null;
      }
      const plan = JSON.parse(content);
      this.log("debug", `Successfully loaded plan: ${planId} from ${filename}`);
      return plan;
    } catch (error) {
      this.log("error", `Failed to load plan ${planId} from storage for persona ${personaId}`, error);
      return null;
    }
  }
  /**
   * Create PRD markdown file in repository
   * @param prdPath - Relative path from repo root (e.g., "docs/prd/my-prd")
   * @param frontmatter - PRD frontmatter data
   * @param content - Optional PRD content sections
   */
  async createPRDMarkdown(prdPath, frontmatter, content) {
    try {
      const repoRoot = process.cwd();
      const fullPrdPath = path2.join(repoRoot, prdPath);
      await fs.mkdir(fullPrdPath, { recursive: true });
      await fs.mkdir(path2.join(fullPrdPath, "features"), { recursive: true });
      const prdMarkdown = generatePRD({
        frontmatter,
        ...content,
        features: []
        // Initially empty
      });
      const prdFilePath = path2.join(fullPrdPath, "prd.md");
      await fs.writeFile(prdFilePath, prdMarkdown, "utf-8");
      this.log("info", `Created PRD markdown at ${prdFilePath}`);
      return prdFilePath;
    } catch (error) {
      this.log("error", "Failed to create PRD markdown:", error);
      throw error;
    }
  }
  /**
   * Create PRD directory structure
   * Creates docs/prd/{plan-name}/ and docs/prd/{plan-name}/features/
   * @param planName - Name of the plan (used as directory name)
   * @returns Relative path to created PRD directory (e.g., "docs/prd/my-plan")
   */
  async createPRDStructure(planName) {
    const repoRoot = process.cwd();
    const prdPath = path2.join("docs", "prd", planName);
    const fullPrdPath = path2.join(repoRoot, prdPath);
    const featuresPath = path2.join(fullPrdPath, "features");
    try {
      await fs.mkdir(fullPrdPath, { recursive: true });
      await fs.mkdir(featuresPath, { recursive: true });
      this.log("info", `Created PRD structure at ${prdPath}`);
      return prdPath;
    } catch (error) {
      this.log("error", `Failed to create PRD structure at ${prdPath}`, { error });
      throw error;
    }
  }
  /**
   * Write PRD markdown file with YAML frontmatter
   * Creates prd.md file with formatted title, status, and creation date
   *
   * Error handling: Throws on failure (filesystem errors, permission issues, etc.)
   * Caller should catch and handle appropriately based on context
   *
   * @param planName - Name of the plan (used for title formatting and path)
   * @param planDetails - Markdown content for the PRD body
   * @returns Absolute path to created prd.md file
   * @throws Error if file cannot be created or written
   */
  async writePRDFile(planName, planDetails) {
    const repoRoot = process.cwd();
    const prdFilePath = path2.join(repoRoot, "docs", "prd", planName, "prd.md");
    try {
      const prdDir = path2.dirname(prdFilePath);
      await fs.mkdir(prdDir, { recursive: true });
      const title = formatTitle(planName);
      const createdDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const frontmatter = [
        "---",
        `title: ${title}`,
        "status: defined",
        `created: ${createdDate}`,
        "---",
        "",
        // Empty line after closing ---
        ""
        // This creates the double newline after ---
      ].join("\n");
      const content = frontmatter + planDetails;
      await fs.writeFile(prdFilePath, content, "utf-8");
      this.log("info", `Created PRD file at ${prdFilePath}`);
      return prdFilePath;
    } catch (error) {
      this.log("error", `Failed to create PRD file at ${prdFilePath}`, { error });
      throw error;
    }
  }
  /**
   * Create progress.json file in .tiny-brain/progress/
   * @param prdPath - Relative path to PRD directory (e.g., "docs/prd/my-prd")
   * @param plan - Plan object with id, title, overview, etc.
   * @returns Path to created progress.json file
   */
  async writeProgressFile(prdPath, plan) {
    try {
      const repoRoot = process.cwd();
      const planName = path2.basename(prdPath);
      const progressDir = path2.join(repoRoot, ".tiny-brain", "progress");
      await fs.mkdir(progressDir, { recursive: true });
      const progressFilePath = path2.join(progressDir, `${planName}.json`);
      const isTaskDone = (status) => status === "completed" || status === "superseded";
      const isFeatureDone = (status) => status === "completed" || status === "superseded";
      const features = plan.features || [];
      const totalFeatures = features.length;
      const completedFeatures = features.filter((f) => isFeatureDone(f.status)).length;
      const totalTasks = features.reduce((sum, f) => sum + (f.tasks?.length || 0), 0);
      const completedTasks = features.reduce(
        (sum, f) => sum + (f.tasks?.filter((t) => isTaskDone(t.status)).length || 0),
        0
      );
      const percentComplete = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0;
      const pendingFeatures = features.filter((f) => !isFeatureDone(f.status)).map((f) => f.title);
      const currentFeature = features.find((f) => !isFeatureDone(f.status));
      const currentFeatureTasks = currentFeature?.tasks?.filter((t) => !isTaskDone(t.status)).length || 0;
      const futureFeatureTasks = features.filter((f) => f !== currentFeature && !isFeatureDone(f.status)).reduce((sum, f) => sum + (f.tasks?.filter((t) => !isTaskDone(t.status)).length || 0), 0);
      const progressData = {
        id: planName,
        title: plan.title,
        type: "active",
        status: features.length === 0 ? "defined" : percentComplete === 100 ? "complete" : "in_progress",
        prdId: planName,
        prdDirPath: prdPath,
        overview: plan.overview || "",
        created: (/* @__PURE__ */ new Date()).toISOString(),
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
        currentState: {
          feature: currentFeature?.number || 1,
          featureTitle: currentFeature?.title || "",
          overallProgress: {
            completedFeatures,
            totalFeatures,
            completedTasks,
            totalTasks,
            percentComplete
          },
          workRemaining: {
            pendingFeatures,
            currentFeatureTasks,
            futureFeatureTasks
          },
          blockers: []
        },
        features: features.map((f) => ({
          id: f.id,
          number: f.number,
          title: f.title,
          status: f.status,
          tasks: (f.tasks || []).map((t) => ({
            id: t.id,
            description: t.description,
            status: t.status
          }))
        }))
      };
      await fs.writeFile(progressFilePath, JSON.stringify(progressData, null, 2), "utf-8");
      this.log("info", `Created progress.json at ${progressFilePath}`);
      return progressFilePath;
    } catch (error) {
      this.log("error", "Failed to create progress.json:", error);
      throw error;
    }
  }
  /**
   * Verify PRD files were created successfully
   * Checks for the existence of the PRD directory and prd.md file
   *
   * @param planName - Name of the plan to verify
   * @returns true if PRD files exist, false otherwise
   */
  async verifyPRDCreation(planName) {
    try {
      if (!planName || !planName.trim()) {
        return false;
      }
      const repoRoot = process.cwd();
      const prdDir = path2.join(repoRoot, "docs", "prd", planName);
      const prdFile = path2.join(prdDir, "prd.md");
      try {
        const dirStat = await fs.stat(prdDir);
        if (!dirStat.isDirectory()) {
          return false;
        }
      } catch {
        return false;
      }
      try {
        const fileStat = await fs.stat(prdFile);
        if (!fileStat.isFile()) {
          return false;
        }
      } catch {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Create feature markdown file in PRD directory
   * @param prdPath - Relative path to PRD directory (e.g., "docs/prd/my-prd")
   * @param frontmatter - Feature frontmatter data
   * @param content - Optional feature content sections
   */
  async createFeatureMarkdown(prdPath, frontmatter, content) {
    try {
      const repoRoot = process.cwd();
      const fullPrdPath = path2.join(repoRoot, prdPath);
      const featuresDir = path2.join(fullPrdPath, "features");
      await fs.mkdir(featuresDir, { recursive: true });
      const featureMarkdown = generateFeature({
        frontmatter,
        ...content,
        tasks: content?.tasks || []
        // Use provided tasks or empty array
      });
      const featureFilePath = path2.join(featuresDir, `${frontmatter.id}.md`);
      await fs.writeFile(featureFilePath, featureMarkdown, "utf-8");
      this.log("info", `Created feature markdown at ${featureFilePath}`);
      return featureFilePath;
    } catch (error) {
      this.log("error", "Failed to create feature markdown:", error);
      throw error;
    }
  }
  /**
   * Complete a task with commit SHA tracking
   * Updates the tracking document and marks task as completed
   */
  async completeTask(args) {
    const personaId = this.requireActivePersona();
    const { planId, featureNumber, taskId, commitSha } = args;
    try {
      const plan = await this.loadPlanById(planId, personaId);
      if (!plan) {
        throw new Error(`Plan not found: ${planId}`);
      }
      const feature = plan.features?.find((f) => f.number === featureNumber);
      if (!feature) {
        throw new Error(`Feature not found: ${featureNumber}`);
      }
      const task = feature.tasks?.find((t) => t.id === taskId);
      if (!task) {
        throw new Error(`Task not found: ${taskId}`);
      }
      task.commitSha = commitSha;
      task.committedAt = (/* @__PURE__ */ new Date()).toISOString();
      task.status = "completed";
      task.completedAt = (/* @__PURE__ */ new Date()).toISOString();
      const allComplete = feature.tasks?.every((t) => t.status === "completed");
      if (allComplete) {
        feature.status = "completed";
      }
      plan.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      await this.savePlan(plan, personaId);
      this.log("info", "Task completed", {
        planId: plan.id,
        featureNumber,
        taskId,
        commitSha: commitSha.substring(0, 7)
      });
      return plan;
    } catch (error) {
      this.log("error", "Failed to complete task:", error);
      throw error;
    }
  }
  /**
   * Add a feature to an existing plan
   * Handles the complete workflow: load plan, parse tasks, create markdown, update progress.json, emit SSE
   */
  async addFeature(args) {
    try {
      const prdDirs = await this.getPRDDirectories();
      if (prdDirs.length === 0) {
        throw new Error("No PRD found in repository. Use plan accept to create a PRD first.");
      }
      const prdDir = prdDirs[0];
      const prdId = path2.basename(prdDir);
      const repoRoot = await this.findRepositoryRoot();
      const progressPath = path2.join(repoRoot, ".tiny-brain", "progress", `${prdId}.json`);
      const progressContent = await fs.readFile(progressPath, "utf-8");
      const plan = JSON.parse(progressContent);
      if (!plan.prdId || !plan.prdDirPath) {
        throw new Error("Plan does not have a PRD reference. This plan may be corrupted.");
      }
      const featureId = args.featureName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const featureNumber = plan.features ? plan.features.length + 1 : 1;
      const parsedTasks = this.parseTasksFromMarkdown(args.featureDetails, featureNumber, now);
      const shortDescription = this.extractShortDescription(args.featureDetails);
      const prdPath = plan.prdDirPath.replace("/prd.md", "");
      const featureFilePath = await this.createFeatureMarkdown(
        prdPath,
        {
          id: featureId,
          prd_id: plan.prdId,
          title: args.featureName,
          status: "defined",
          created: now,
          updated: now
        },
        {
          description: args.featureDetails,
          acceptanceCriteria: ["Define acceptance criteria for this feature"],
          dependencies: [],
          testingStrategy: "Define testing strategy",
          tasks: parsedTasks
        }
      );
      this.log("info", `Created feature markdown at ${featureFilePath}`);
      const newFeature = {
        id: featureId,
        number: featureNumber,
        title: args.featureName,
        description: shortDescription,
        status: "defined",
        startedAt: void 0,
        completedAt: void 0,
        taskSummary: {
          total: parsedTasks.length,
          completed: 0,
          remaining: parsedTasks.length
        },
        tasks: parsedTasks
      };
      if (!plan.features) {
        plan.features = [];
      }
      plan.features.push(newFeature);
      if (!plan.metadata) {
        plan.metadata = {
          totalFeatures: 0,
          completedFeatures: 0,
          totalTasks: 0,
          completedTasks: 0,
          lastChanges: [],
          contributors: [],
          tags: []
        };
      }
      plan.metadata.totalFeatures = plan.features.length;
      plan.metadata.completedFeatures = plan.features.filter((f) => f.status === "completed").length;
      plan.metadata.totalTasks = plan.features.reduce((sum, f) => sum + (f.tasks?.length || 0), 0);
      plan.metadata.completedTasks = plan.features.reduce((sum, f) => sum + (f.tasks?.filter((t) => t.status === "completed").length || 0), 0);
      plan.lastUpdated = now;
      plan.currentState = this.calculateCurrentState(plan);
      await this.savePlanToRepo(plan);
      if (plan.prdDirPath) {
        const featureAddedEvent = {
          eventType: "prd:feature:added",
          prdId: plan.id,
          prdPath: plan.prdDirPath,
          timestamp: now,
          feature: {
            id: newFeature.id,
            number: newFeature.number,
            title: newFeature.title,
            status: newFeature.status
          }
        };
        await this.emitPlanChange(featureAddedEvent);
      }
      this.log("info", "Feature added to plan", {
        planId: plan.id,
        featureId,
        featureNumber
      });
      return { plan, feature: newFeature };
    } catch (error) {
      this.log("error", "Failed to add feature:", error);
      throw error;
    }
  }
  /**
   * Parse tasks from feature details markdown
   * Extracts numbered list items from "Implementation Tasks" section
   */
  parseTasksFromMarkdown(markdown, featureNumber, now) {
    const tasks = [];
    const tasksMatch = markdown.match(/###\s+Implementation Tasks\s+((?:\d+\.\s+.+\n?)+)/i);
    if (!tasksMatch) {
      return tasks;
    }
    const taskList = tasksMatch[1];
    const taskRegex = /^\d+\.\s+(.+)$/gm;
    let match3;
    let taskIndex = 1;
    while ((match3 = taskRegex.exec(taskList)) !== null) {
      const taskDescription = match3[1].trim();
      if (taskDescription) {
        tasks.push({
          id: `task-${featureNumber}-${taskIndex}`,
          description: taskDescription,
          status: "defined",
          createdAt: now
        });
        taskIndex++;
      }
    }
    return tasks;
  }
  /**
   * Extract short description from feature details markdown
   * Gets first sentence or paragraph from Purpose section
   */
  extractShortDescription(markdown) {
    const purposeMatch = markdown.match(/###\s+Purpose\s+(.+?)(?=\n\n|###|$)/is);
    if (purposeMatch) {
      const purpose = purposeMatch[1].trim();
      const firstSentence = purpose.match(/^[^.!?]+[.!?]/);
      if (firstSentence) {
        return firstSentence[0].trim();
      }
      return purpose.split("\n")[0].substring(0, 150).trim();
    }
    const firstPara = markdown.split("\n\n")[0];
    if (firstPara) {
      const cleaned = firstPara.replace(/^##\s+.*\n/, "").trim();
      const firstSentence = cleaned.match(/^[^.!?]+[.!?]/);
      if (firstSentence) {
        return firstSentence[0].trim();
      }
      return cleaned.substring(0, 150).trim();
    }
    return "Feature implementation";
  }
  /**
   * Calculate current state for a plan
   * This mirrors the logic from plan-updater.ts
   */
  calculateCurrentState(plan) {
    const isTaskDone = (status) => status === "completed" || status === "superseded";
    const isFeatureDone = (status) => status === "completed" || status === "superseded";
    const completedFeatures = plan.features.filter((f) => isFeatureDone(f.status)).length;
    const totalFeatures = plan.features.length;
    const completedTasks = plan.features.reduce(
      (sum, feature) => sum + feature.tasks.filter((t) => isTaskDone(t.status)).length,
      0
    );
    const totalTasks = plan.features.reduce((sum, feature) => sum + feature.tasks.length, 0);
    const percentComplete = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0;
    const currentFeature = plan.features.find((f) => f.status === "tested") || plan.features.find((f) => f.status === "defined") || plan.features[plan.features.length - 1];
    const currentFeatureNumber = currentFeature?.number || 1;
    const currentFeatureTitle = currentFeature?.title || "";
    let nextAction;
    if (currentFeature) {
      const nextTask = currentFeature.tasks.find((t) => !isTaskDone(t.status));
      if (nextTask) {
        nextAction = {
          featureId: currentFeature.id,
          taskId: nextTask.id,
          description: nextTask.description,
          priority: nextTask.priority,
          estimatedHours: nextTask.estimatedHours
        };
      }
    }
    const pendingFeatures = plan.features.filter((f) => f.status === "defined").map((f) => f.title);
    const currentFeatureTasks = currentFeature ? currentFeature.tasks.filter((t) => t.status !== "completed").length : 0;
    return {
      feature: currentFeatureNumber,
      featureTitle: currentFeatureTitle,
      overallProgress: {
        completedFeatures,
        totalFeatures,
        completedTasks,
        totalTasks,
        percentComplete
      },
      workRemaining: {
        pendingFeatures,
        currentFeatureTasks,
        futureFeatureTasks: plan.features.filter((f) => f.status === "defined" && f.number > currentFeatureNumber).reduce((sum, f) => sum + f.tasks.length, 0)
      },
      nextAction,
      blockers: []
    };
  }
  /**
   * Get the git user email from config
   * @returns Git user email
   * @throws Error if git user email not configured
   */
  async getGitUserEmail() {
    try {
      const options = this.repositoryRoot ? { cwd: this.repositoryRoot } : {};
      const { stdout } = await execAsync("git config user.email", options);
      const email = stdout.trim();
      if (!email) {
        throw new Error("Git user.email not configured");
      }
      return email;
    } catch (error) {
      throw new Error(
        `Git user.email not configured: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  /**
   * Get the git user name from config
   * @returns Git user name
   * @throws Error if git user name not configured
   */
  async getGitUserName() {
    try {
      const options = this.repositoryRoot ? { cwd: this.repositoryRoot } : {};
      const { stdout } = await execAsync("git config user.name", options);
      const name = stdout.trim();
      if (!name) {
        throw new Error("Git user.name not configured");
      }
      return name;
    } catch (error) {
      throw new Error(
        `Git user.name not configured: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  /**
   * Get the git identity (email and name)
   * @returns Object with email and name (name may be undefined)
   * @throws Error if git user email not configured
   */
  async getGitIdentity() {
    const email = await this.getGitUserEmail();
    try {
      const name = await this.getGitUserName();
      return { email, name };
    } catch {
      return { email };
    }
  }
  /**
   * Check if a user has commits in a specific directory
   * @param prdDir Absolute path to PRD directory
   * @param userEmail Git user email to check
   * @returns True if user has commits in directory
   */
  async hasUserCommits(prdDir, userEmail) {
    try {
      const repoRoot = await this.findRepositoryRoot();
      const relativePath = path2.relative(repoRoot, prdDir);
      const options = this.repositoryRoot ? { cwd: this.repositoryRoot } : {};
      const { stdout } = await execAsync(
        `git log --all --author="${userEmail}" --pretty=format:"%H" -- ${relativePath}`,
        options
      );
      return stdout.trim().length > 0;
    } catch (error) {
      this.log("debug", "Failed to check user commits:", error);
      return false;
    }
  }
  /**
   * Find the repository root directory using git
   * @returns Absolute path to repository root
   * @throws Error if not in a git repository
   */
  async findRepositoryRoot() {
    if (this.repositoryRoot) {
      return this.repositoryRoot;
    }
    try {
      const { stdout } = await execAsync("git rev-parse --show-toplevel");
      return stdout.trim();
    } catch (error) {
      throw new Error(
        `Not in a git repository: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  /**
   * Get all PRD directories for a specific repository path
   * @param repoPath - Absolute path to the repository root
   * @returns Array of absolute paths to PRD directories
   */
  async getPRDDirectoriesForPath(repoPath) {
    const prdBaseDir = path2.join(repoPath, "docs/prd");
    try {
      await fs.access(prdBaseDir);
    } catch {
      return [];
    }
    const entries = await fs.readdir(prdBaseDir);
    const prdDirs = [];
    for (const entry of entries) {
      const entryPath = path2.join(prdBaseDir, entry);
      const prdMdPath = path2.join(entryPath, "prd.md");
      try {
        await fs.access(prdMdPath);
        prdDirs.push(entryPath);
      } catch {
        continue;
      }
    }
    return prdDirs;
  }
  /**
   * Get all PRD directories that contain prd.md files
   * @returns Array of absolute paths to PRD directories
   * @throws Error if not in a git repository
   */
  async getPRDDirectories() {
    try {
      const repoRoot = await this.findRepositoryRoot();
      const prdBaseDir = path2.join(repoRoot, "docs/prd");
      try {
        await fs.access(prdBaseDir);
      } catch {
        return [];
      }
      const entries = await fs.readdir(prdBaseDir);
      const prdDirs = [];
      for (const entry of entries) {
        const entryPath = path2.join(prdBaseDir, entry);
        const prdMdPath = path2.join(entryPath, "prd.md");
        try {
          await fs.access(prdMdPath);
          prdDirs.push(entryPath);
        } catch {
          continue;
        }
      }
      return prdDirs;
    } catch (error) {
      throw new Error(
        `Failed to get PRD directories: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  /**
   * Parse feature markdown file and extract tasks from ### N. format
   */
  async parseFeatureMarkdown(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let id = "";
    let title = "";
    let status = "planned";
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const idMatch = frontmatter.match(/^id:\s*(.+)$/m);
      const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
      const statusMatch = frontmatter.match(/^status:\s*(.+)$/m);
      if (idMatch) id = idMatch[1].trim();
      if (titleMatch) title = titleMatch[1].trim();
      if (statusMatch) status = statusMatch[1].trim();
    }
    const taskRegex = /^###\s+(\d+)\.\s+(.+)$/gm;
    const tasks = [];
    let match3;
    while ((match3 = taskRegex.exec(content)) !== null) {
      const taskNumber = parseInt(match3[1], 10);
      const taskDescription = match3[2].trim();
      tasks.push({
        id: `task-${taskNumber}`,
        description: taskDescription,
        status: "defined"
      });
    }
    return { id, title, status, tasks };
  }
  /**
   * Read PRD markdown file and parse frontmatter
   */
  async readPRDMarkdown(prdPath) {
    const prdMdPath = path2.join(prdPath, "prd.md");
    const content = await fs.readFile(prdMdPath, "utf-8");
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = {
      id: "",
      title: "",
      version: "1.0.0",
      status: "not_started",
      created: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      updated: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      author: ""
    };
    if (frontmatterMatch) {
      const fm = frontmatterMatch[1];
      const idMatch = fm.match(/^id:\s*(.+)$/m);
      const titleMatch = fm.match(/^title:\s*(.+)$/m);
      const versionMatch = fm.match(/^version:\s*(.+)$/m);
      const statusMatch = fm.match(/^status:\s*(.+)$/m);
      const createdMatch = fm.match(/^created:\s*(.+)$/m);
      const updatedMatch = fm.match(/^updated:\s*(.+)$/m);
      const authorMatch = fm.match(/^author:\s*(.+)$/m);
      if (idMatch) frontmatter.id = idMatch[1].trim();
      if (titleMatch) frontmatter.title = titleMatch[1].trim();
      if (versionMatch) frontmatter.version = versionMatch[1].trim();
      if (statusMatch) frontmatter.status = statusMatch[1].trim();
      if (createdMatch) frontmatter.created = createdMatch[1].trim();
      if (updatedMatch) frontmatter.updated = updatedMatch[1].trim();
      if (authorMatch) frontmatter.author = authorMatch[1].trim();
    }
    return { frontmatter, content };
  }
  /**
   * Read all feature markdown files from a PRD directory
   */
  async readFeatureMarkdowns(prdPath) {
    const featuresPath = path2.join(prdPath, "features");
    try {
      const files = await fs.readdir(featuresPath);
      const features = [];
      for (const file of files) {
        if (!file.endsWith(".md")) continue;
        const content = await fs.readFile(path2.join(featuresPath, file), "utf-8");
        const parsed = await this.parseFeatureMarkdown(content);
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        let prdId = "";
        if (frontmatterMatch) {
          const prdIdMatch = frontmatterMatch[1].match(/^prd_id:\s*(.+)$/m);
          if (prdIdMatch) prdId = prdIdMatch[1].trim();
        }
        features.push({
          ...parsed,
          prd_id: prdId
        });
      }
      return features;
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }
  /**
   * Load existing progress.json if it exists
   */
  async loadExistingProgressJson(prdPath) {
    const prdId = path2.basename(prdPath);
    try {
      const repoRoot = await this.findRepositoryRoot();
      const progressPath = path2.join(repoRoot, ".tiny-brain", "progress", `${prdId}.json`);
      const content = await fs.readFile(progressPath, "utf-8");
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
  /**
   * Sync progress.json from markdown files
   * Reads prd.md and features/*.md to generate/update progress.json
   * Preserves existing commit SHAs and task status
   */
  async syncPlanFromMarkdown(prdPath) {
    const { frontmatter } = await this.readPRDMarkdown(prdPath);
    const featureMarkdowns = await this.readFeatureMarkdowns(prdPath);
    const existingPlan = await this.loadExistingProgressJson(prdPath);
    const features = featureMarkdowns.map((fm, index) => {
      const featureNumber = index + 1;
      const featureId = fm.id || `feature-${featureNumber}`;
      const existingFeature = existingPlan?.features.find((f) => f.id === featureId);
      const tasks = fm.tasks.map((t, taskIndex) => {
        const taskId = `task-${featureNumber}-${taskIndex + 1}`;
        const existingTask = existingFeature?.tasks.find(
          (et) => et.id === taskId || et.description === t.description
        );
        if (existingTask) {
          return {
            ...existingTask,
            description: t.description
            // Allow description updates
          };
        }
        return {
          id: taskId,
          description: t.description,
          status: "defined",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      });
      const completed = tasks.filter((t) => t.status === "completed").length;
      return {
        id: featureId,
        number: featureNumber,
        title: fm.title,
        description: "",
        status: fm.status === "completed" ? "completed" : "defined",
        tasks,
        taskSummary: {
          total: tasks.length,
          completed,
          remaining: tasks.length - completed,
          nextTask: tasks.find((t) => t.status !== "completed")?.description
        }
      };
    });
    const totalTasks = features.reduce((sum, f) => sum + f.tasks.length, 0);
    const completedTasks = features.reduce(
      (sum, f) => sum + f.tasks.filter((t) => t.status === "completed").length,
      0
    );
    const completedFeatures = features.filter(
      (f) => f.tasks.length > 0 && f.tasks.every((t) => t.status === "completed")
    ).length;
    let nextAction;
    for (const feature of features) {
      const nextTask = feature.tasks.find((t) => t.status !== "completed");
      if (nextTask) {
        nextAction = {
          featureId: feature.id,
          taskId: nextTask.id,
          description: nextTask.description
        };
        break;
      }
    }
    const currentFeature = features.find((f) => f.tasks.some((t) => t.status !== "completed")) || features[features.length - 1];
    const plan = {
      id: frontmatter.id,
      title: frontmatter.title,
      type: "active",
      status: completedTasks === totalTasks && totalTasks > 0 ? "complete" : completedTasks > 0 ? "in_progress" : "not_started",
      created: existingPlan?.created || (/* @__PURE__ */ new Date()).toISOString(),
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
      prdId: frontmatter.id,
      prdDirPath: prdPath,
      currentState: {
        feature: currentFeature?.number || 1,
        featureTitle: currentFeature?.title || "",
        overallProgress: {
          completedFeatures,
          totalFeatures: features.length,
          completedTasks,
          totalTasks,
          percentComplete: totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0
        },
        nextAction,
        workRemaining: {
          currentFeatureTasks: currentFeature?.tasks.filter((t) => t.status !== "completed").length || 0,
          futureFeatureTasks: features.filter((f) => f.number > (currentFeature?.number || 0)).reduce((sum, f) => sum + f.tasks.length, 0),
          pendingFeatures: features.filter((f) => f.tasks.some((t) => t.status !== "completed")).map((f) => f.title)
        }
      },
      overview: existingPlan?.overview || "",
      features,
      metadata: {
        totalFeatures: features.length,
        completedFeatures,
        totalTasks,
        completedTasks,
        lastChanges: [],
        contributors: [],
        tags: existingPlan?.metadata?.tags || []
      }
    };
    const repoRoot = await this.findRepositoryRoot();
    const progressDir = path2.join(repoRoot, ".tiny-brain", "progress");
    await fs.mkdir(progressDir, { recursive: true });
    const progressPath = path2.join(progressDir, `${frontmatter.id}.json`);
    await fs.writeFile(progressPath, JSON.stringify(plan, null, 2));
    if (currentFeature) {
      const syncEvent = {
        eventType: "prd:feature:updated",
        prdId: plan.id,
        prdPath,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        feature: {
          id: currentFeature.id,
          number: currentFeature.number,
          title: currentFeature.title,
          status: currentFeature.status
        },
        plan,
        // Include full plan for sync
        delta: {
          statusChanged: true,
          newStatus: "synced"
        }
      };
      await this.emitPlanChange(syncEvent);
    }
    return plan;
  }
  /**
   * Sync fixes from markdown files to .tiny-brain/fixes/progress.json
   * Reads all fix documents, extracts frontmatter and tasks, and generates progress tracking
   *
   * @param repoPath - Path to repository root
   * @returns FixesProgress object with all fixes and their tasks
   */
  async syncFixes(repoPath) {
    const fixesDir = path2.join(repoPath, ".tiny-brain", "fixes");
    const progressPath = path2.join(fixesDir, "progress.json");
    const fixFiles = await glob("*.md", { cwd: fixesDir, absolute: true });
    const mdFiles = fixFiles.filter((f) => f.endsWith(".md") && !f.endsWith("progress.json"));
    let existingProgress = null;
    try {
      await fs.access(progressPath);
      const content = await fs.readFile(progressPath, "utf-8");
      existingProgress = JSON.parse(content);
    } catch {
    }
    const fixes = [];
    for (const filePath of mdFiles) {
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const fix = this.parseFixMarkdown(content, filePath, repoPath, existingProgress);
        if (fix) {
          fixes.push(fix);
        }
      } catch (error) {
        this.log("warn", `Failed to parse fix file: ${filePath}`, error);
      }
    }
    const result = {
      fixes,
      lastSynced: (/* @__PURE__ */ new Date()).toISOString()
    };
    await fs.mkdir(fixesDir, { recursive: true });
    await fs.writeFile(progressPath, JSON.stringify(result, null, 2), "utf-8");
    return result;
  }
  /**
   * Parse a fix markdown file into a FixProgress object
   */
  parseFixMarkdown(content, filePath, repoPath, existingProgress) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }
    const frontmatterText = frontmatterMatch[1];
    const parsed = this.parseYamlFrontmatter(frontmatterText);
    if (!parsed.id || !parsed.title || !parsed.status || !parsed.severity) {
      return null;
    }
    const frontmatter = {
      id: parsed.id,
      title: parsed.title,
      status: parsed.status,
      severity: parsed.severity,
      reported: parsed.reported || "",
      resolved: parsed.resolved
    };
    const tasks = this.extractFixTasks(content);
    const existingFix = existingProgress?.fixes.find((f) => f.id === frontmatter.id);
    const mergedTasks = tasks.map((task) => {
      const existingTask = existingFix?.tasks.find((t) => t.description === task.description);
      if (existingTask) {
        return {
          ...task,
          status: existingTask.status,
          testCommitSha: existingTask.testCommitSha,
          testCommittedAt: existingTask.testCommittedAt,
          commitSha: existingTask.commitSha,
          committedAt: existingTask.committedAt,
          refactorCommitSha: existingTask.refactorCommitSha,
          refactorCommittedAt: existingTask.refactorCommittedAt,
          completedAt: existingTask.completedAt
        };
      }
      return task;
    });
    const relativePath = path2.relative(repoPath, filePath);
    return {
      id: frontmatter.id,
      title: frontmatter.title,
      status: frontmatter.status,
      severity: frontmatter.severity,
      tasks: mergedTasks,
      filePath: relativePath,
      reported: frontmatter.reported,
      resolved: frontmatter.resolved
    };
  }
  /**
   * Parse simple YAML frontmatter into an object
   */
  parseYamlFrontmatter(text) {
    const result = {};
    const lines = text.split("\n");
    for (const line of lines) {
      const match3 = line.match(/^(\w+):\s*(.*)$/);
      if (match3) {
        const [, key, value] = match3;
        if (value === "null" || value === "") {
          result[key] = null;
        } else {
          result[key] = value.trim();
        }
      }
    }
    return result;
  }
  /**
   * Extract tasks from fix markdown document
   * Tasks are identified by ### N. Task Name format
   */
  extractFixTasks(content) {
    const tasks = [];
    const taskPattern = /###\s+(\d+)\.\s+(.+?)(?=\n|$)/g;
    let match3;
    while ((match3 = taskPattern.exec(content)) !== null) {
      const taskNumber = parseInt(match3[1], 10);
      const taskTitle = match3[2].trim();
      tasks.push({
        id: `task-${taskNumber}`,
        description: taskTitle,
        status: "defined"
      });
    }
    return tasks;
  }
};
function formatTitle(planName) {
  if (!planName) {
    return "";
  }
  const words = planName.split(/[-_\s]+/).filter((word) => word.length > 0);
  const titleWords = words.map((word) => {
    if (word !== word.toLowerCase()) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return titleWords.join(" ");
}

// packages/tiny-brain-core/src/services/repo-config/repo-config-service.ts
import { createHash } from "crypto";
import { readFile, readdir as readdir2, access } from "fs/promises";
import { join as join2 } from "path";
var CONFIG_VERSION = "1.0.0";
var REPOS_CONFIG_PATH = "repos/repos";
var RepoConfigService = class {
  constructor(context) {
    this.context = context;
  }
  /**
   * Register a repository in the config
   */
  async registerRepo(options) {
    const config = await this.loadConfig();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existingRepo = config.repos.find((r) => r.path === options.path);
    if (existingRepo) {
      existingRepo.name = options.name;
      existingRepo.lastAccessed = now;
      if (options.prdCount !== void 0) {
        existingRepo.prdCount = options.prdCount;
      }
      await this.saveConfig(config);
      return existingRepo;
    }
    const newRepo = {
      id: this.generateRepoId(options.path),
      name: options.name,
      path: options.path,
      lastAccessed: now,
      createdAt: now,
      prdCount: options.prdCount
    };
    config.repos.push(newRepo);
    await this.saveConfig(config);
    return newRepo;
  }
  /**
   * List all registered repositories
   * Sorted by last accessed (most recent first)
   * Computes prdStats dynamically by reading progress.json files
   */
  async listRepos() {
    const config = await this.loadConfig();
    const repos = config.repos.sort((a, b) => {
      return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
    });
    const reposWithStats = await Promise.all(
      repos.map(async (repo) => ({
        ...repo,
        prdStats: await this.computePrdStats(repo.path)
      }))
    );
    return reposWithStats;
  }
  /**
   * Compute PRD status breakdown for a repository
   */
  async computePrdStats(repoPath) {
    const stats = {
      inProgress: 0,
      notStarted: 0,
      complete: 0
    };
    try {
      const prdDir = join2(repoPath, "docs", "prd");
      await access(prdDir);
      const entries = await readdir2(prdDir, { withFileTypes: true });
      const prdDirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith("_"));
      for (const dir of prdDirs) {
        try {
          const progressPath = join2(prdDir, dir.name, "progress.json");
          const content = await readFile(progressPath, "utf-8");
          const progress = JSON.parse(content);
          const status = progress.status?.toLowerCase();
          if (status === "in_progress") {
            stats.inProgress++;
          } else if (status === "complete" || status === "completed") {
            stats.complete++;
          } else if (status === "not_started" || status === "defined") {
            stats.notStarted++;
          } else {
            stats.notStarted++;
          }
        } catch {
        }
      }
    } catch {
    }
    return stats;
  }
  /**
   * Get a specific repository by ID
   */
  async getRepo(repoId) {
    const config = await this.loadConfig();
    return config.repos.find((r) => r.id === repoId) || null;
  }
  /**
   * Get repository with context file information
   * Extends basic repo info with analysis status from context file
   */
  async getRepoWithContext(repoId) {
    const repo = await this.getRepo(repoId);
    if (!repo) {
      return null;
    }
    const contextData = await this.extractContextFileData(repo.path);
    return {
      ...repo,
      ...contextData
    };
  }
  /**
   * Update last accessed timestamp for a repo
   */
  async updateLastAccessed(repoId) {
    const config = await this.loadConfig();
    const repo = config.repos.find((r) => r.id === repoId);
    if (repo) {
      repo.lastAccessed = (/* @__PURE__ */ new Date()).toISOString();
      await this.saveConfig(config);
    }
  }
  /**
   * Remove a repository from the config
   */
  async removeRepo(repoId) {
    const config = await this.loadConfig();
    config.repos = config.repos.filter((r) => r.id !== repoId);
    await this.saveConfig(config);
  }
  /**
   * Update PRD count for a repo
   */
  async updatePrdCount(repoId, count) {
    const config = await this.loadConfig();
    const repo = config.repos.find((r) => r.id === repoId);
    if (repo) {
      repo.prdCount = count;
      await this.saveConfig(config);
    }
  }
  /**
   * Load repos config from storage
   */
  async loadConfig() {
    try {
      const data = await this.context.storage.getUserData(
        `${REPOS_CONFIG_PATH}.json`,
        this.context.userId
      );
      if (!data) {
        return this.createDefaultConfig();
      }
      const config = JSON.parse(data);
      return config;
    } catch (error) {
      this.context.logger.warn("Failed to load repos config, using default", error);
      return this.createDefaultConfig();
    }
  }
  /**
   * Save repos config to storage
   */
  async saveConfig(config) {
    await this.context.storage.storeUserData(
      `${REPOS_CONFIG_PATH}.json`,
      JSON.stringify(config, null, 2),
      this.context.userId
    );
  }
  /**
   * Create default config
   */
  createDefaultConfig() {
    return {
      version: CONFIG_VERSION,
      repos: []
    };
  }
  /**
   * Generate a unique repo ID from path
   */
  generateRepoId(path12) {
    const hash = createHash("sha256").update(path12).digest("hex");
    return `repo-${hash.substring(0, 12)}`;
  }
  /**
   * Extract context file data from repository
   * Parses the Repository Context YAML section and When to Use Agents section
   */
  async extractContextFileData(repoPath) {
    const contextFileName = "CLAUDE.md";
    const contextFilePath = join2(repoPath, contextFileName);
    try {
      const content = await readFile(contextFilePath, "utf-8");
      const yamlData = this.parseRepositoryContextYAML(content);
      const agentCount = this.countInstalledAgents(content);
      return {
        contextFile: contextFileName,
        lastAnalyzed: yamlData?.analysisDate,
        installedAgentCount: agentCount
      };
    } catch {
      return {};
    }
  }
  /**
   * Parse Repository Context YAML section for analysis metadata
   */
  parseRepositoryContextYAML(content) {
    try {
      const yamlSectionRegex = /### Repository Context\n```yaml\n(.*?)\n```/s;
      const match3 = content.match(yamlSectionRegex);
      if (!match3 || !match3[1]) {
        return null;
      }
      const yamlContent = match3[1];
      const analysisDateMatch = yamlContent.match(/Analysis Date:\s*(.+)/);
      const analysisDate = analysisDateMatch ? analysisDateMatch[1].trim() : void 0;
      return { analysisDate };
    } catch {
      return null;
    }
  }
  /**
   * Count installed agents from "When to Use Agents" section
   */
  countInstalledAgents(content) {
    try {
      const agentSectionRegex = /### When to Use Agents\n(.*?)(?=\n### |\n## |$)/s;
      const match3 = content.match(agentSectionRegex);
      if (!match3 || !match3[1]) {
        return 0;
      }
      const agentSection = match3[1];
      const agentEntries = agentSection.match(/- `[^`]+`/g);
      return agentEntries ? agentEntries.length : 0;
    } catch {
      return 0;
    }
  }
};

// packages/tiny-brain-core/src/types/user-preferences.schema.ts
var RepoConfigSchema = external_exports.object({
  /**
   * Auto-commit progress.json changes after task tracking
   */
  autoCommitProgress: external_exports.boolean().default(false),
  /**
   * Enable agentic coding mode (AI-driven development)
   */
  enableAgenticCoding: external_exports.boolean().default(false),
  /**
   * Enable Suggestion-Driven Development (SDD)
   */
  enableSDD: external_exports.boolean().default(false),
  /**
   * Enable Test-Driven Development (TDD)
   */
  enableTDD: external_exports.boolean().default(true),
  /**
   * Enable Architecture Decision Records (ADR)
   */
  enableADR: external_exports.boolean().default(true),
  /**
   * Enable Quality Analysis
   */
  enableQuality: external_exports.boolean().default(true),
  /**
   * Directory configuration
   */
  directories: external_exports.object({
    /**
     * Documentation directory path
     */
    docs: external_exports.string().min(1).default("docs"),
    /**
     * ADR directory path
     */
    adr: external_exports.string().min(1).default("docs/adr"),
    /**
     * PRD directory path
     */
    prd: external_exports.string().min(1).default("docs/prd")
  }).strict().default({
    docs: "docs",
    adr: "docs/adr",
    prd: "docs/prd"
  }),
  /**
   * Test file patterns for test detection
   */
  testPatterns: external_exports.array(external_exports.string()).default(["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"])
}).strict().default({
  autoCommitProgress: false,
  enableAgenticCoding: false,
  enableSDD: false,
  enableTDD: true,
  enableADR: true,
  enableQuality: true,
  directories: {
    docs: "docs",
    adr: "docs/adr",
    prd: "docs/prd"
  },
  testPatterns: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"]
});
var UserPreferencesSchema = external_exports.object({
  /**
   * Repository-level configuration (team decisions, overridable per-repo)
   */
  repo: RepoConfigSchema
}).strict();
var DeepPartialRepoConfigSchema = external_exports.object({
  autoCommitProgress: external_exports.boolean().optional(),
  enableAgenticCoding: external_exports.boolean().optional(),
  enableSDD: external_exports.boolean().optional(),
  enableTDD: external_exports.boolean().optional(),
  enableADR: external_exports.boolean().optional(),
  enableQuality: external_exports.boolean().optional(),
  directories: external_exports.object({
    docs: external_exports.string().min(1).optional(),
    adr: external_exports.string().min(1).optional(),
    prd: external_exports.string().min(1).optional()
  }).optional(),
  testPatterns: external_exports.array(external_exports.string()).optional()
}).strict();
var PartialUserPreferencesSchema = external_exports.object({
  repo: DeepPartialRepoConfigSchema.optional()
}).strict();
var PreferencesConfigSchema = external_exports.object({
  version: external_exports.string(),
  preferences: UserPreferencesSchema
});
var PartialPreferencesConfigSchema = external_exports.object({
  version: external_exports.string(),
  preferences: PartialUserPreferencesSchema
});

// packages/tiny-brain-core/src/services/config/config-service.ts
import { readFile as readFile2 } from "fs/promises";
import { join as join3 } from "path";

// packages/tiny-brain-core/src/services/fix/fix-service.ts
import { promises as fs2 } from "fs";
import path3 from "path";

// packages/tiny-brain-core/src/services/adr/adr-service.ts
import { promises as fs3 } from "fs";
import path4 from "path";
import { exec as exec2 } from "child_process";
import { promisify as promisify2 } from "util";
var execAsync2 = promisify2(exec2);

// packages/tiny-brain-core/src/services/plugin/plugin-discovery.service.ts
import { readdir as readdir3, readFile as readFile3 } from "fs/promises";
import { join as join4 } from "path";
import { homedir } from "os";
import { existsSync as existsSync2 } from "fs";
var PluginDiscoveryService = class {
  claudePluginsDir;
  knownRepos;
  constructor(knownRepos = []) {
    this.claudePluginsDir = join4(homedir(), ".claude", "plugins");
    this.knownRepos = knownRepos;
  }
  /**
   * Discover all plugins across all scopes
   */
  async discoverAll() {
    const [installedPlugins, marketplaces] = await Promise.all([
      this.readInstalledPlugins(),
      this.discoverMarketplaces()
    ]);
    const user = [];
    const project = /* @__PURE__ */ new Map();
    const local = /* @__PURE__ */ new Map();
    for (const [pluginKey, entries] of Object.entries(installedPlugins.plugins)) {
      const [pluginName, marketplaceName] = pluginKey.split("@");
      for (const entry of entries) {
        const plugin = await this.parsePluginFromEntry(pluginName, marketplaceName, entry);
        if (!plugin) continue;
        if (entry.scope === "user") {
          user.push(plugin);
        } else if (entry.scope === "project" && entry.projectPath) {
          const existing = project.get(entry.projectPath) || [];
          existing.push(plugin);
          project.set(entry.projectPath, existing);
        }
      }
    }
    return { user, project, local, marketplaces };
  }
  /**
   * Read installed_plugins.json
   */
  async readInstalledPlugins() {
    const filePath = join4(this.claudePluginsDir, "installed_plugins.json");
    if (!existsSync2(filePath)) {
      return { version: 2, plugins: {} };
    }
    try {
      const content = await readFile3(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Failed to read installed_plugins.json:", error);
      return { version: 2, plugins: {} };
    }
  }
  /**
   * Discover registered marketplaces
   */
  async discoverMarketplaces() {
    const filePath = join4(this.claudePluginsDir, "known_marketplaces.json");
    if (!existsSync2(filePath)) {
      return [];
    }
    try {
      const content = await readFile3(filePath, "utf-8");
      const data = JSON.parse(content);
      return Object.entries(data).map(([name, entry]) => ({
        name,
        source: entry.source.source,
        url: entry.source.repo || entry.source.url,
        installLocation: entry.installLocation,
        lastUpdated: entry.lastUpdated,
        autoUpdate: entry.autoUpdate
      }));
    } catch (error) {
      console.error("Failed to read known_marketplaces.json:", error);
      return [];
    }
  }
  /**
   * Parse a plugin from an installed plugin entry
   */
  async parsePluginFromEntry(pluginName, marketplaceName, entry) {
    const pluginPath = entry.installPath;
    if (!existsSync2(pluginPath)) {
      console.warn(`Plugin path does not exist: ${pluginPath}`);
      return null;
    }
    const manifestPath = join4(pluginPath, ".claude-plugin", "plugin.json");
    if (!existsSync2(manifestPath)) {
      console.warn(`No plugin.json found at: ${manifestPath}`);
      return null;
    }
    try {
      const content = await readFile3(manifestPath, "utf-8");
      const manifest = JSON.parse(content);
      const components = await this.discoverComponents(pluginPath, manifest);
      return {
        name: manifest.name || pluginName,
        version: manifest.version || entry.version,
        description: manifest.description || "",
        scope: entry.scope,
        path: pluginPath,
        repoPath: entry.projectPath,
        marketplace: marketplaceName,
        manifest,
        components
      };
    } catch (error) {
      console.error(`Failed to parse plugin at ${pluginPath}:`, error);
      return null;
    }
  }
  /**
   * Get a flat list of all plugins with scope info
   */
  async discoverAllFlat() {
    const byScope = await this.discoverAll();
    const all = [...byScope.user];
    for (const plugins of byScope.project.values()) {
      all.push(...plugins);
    }
    for (const plugins of byScope.local.values()) {
      all.push(...plugins);
    }
    return all;
  }
  /**
   * Discover plugins in user scope
   */
  async discoverUserPlugins() {
    const all = await this.discoverAll();
    return all.user;
  }
  /**
   * Discover plugins in project scope across known repos
   */
  async discoverProjectPlugins() {
    const all = await this.discoverAll();
    return all.project;
  }
  /**
   * Discover plugins in local scope
   */
  async discoverLocalPlugins() {
    const all = await this.discoverAll();
    return all.local;
  }
  /**
   * Scan a plugins directory for installed plugins
   */
  async scanPluginDirectory(dir, scope, repoPath) {
    if (!existsSync2(dir)) {
      return [];
    }
    const plugins = [];
    try {
      const entries = await readdir3(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const pluginPath = join4(dir, entry.name);
        const plugin = await this.parsePlugin(pluginPath, scope, repoPath);
        if (plugin) {
          plugins.push(plugin);
        }
      }
    } catch (error) {
      console.error(`Failed to scan plugins directory ${dir}:`, error);
    }
    return plugins;
  }
  /**
   * Parse a single plugin directory
   */
  async parsePlugin(pluginPath, scope, repoPath) {
    const manifestPath = join4(pluginPath, ".claude-plugin", "plugin.json");
    if (!existsSync2(manifestPath)) {
      return null;
    }
    try {
      const content = await readFile3(manifestPath, "utf-8");
      const manifest = JSON.parse(content);
      const components = await this.discoverComponents(pluginPath, manifest);
      return {
        name: manifest.name,
        version: manifest.version || "0.0.0",
        description: manifest.description || "",
        scope,
        path: pluginPath,
        repoPath,
        manifest,
        components
      };
    } catch (error) {
      console.error(`Failed to parse plugin at ${pluginPath}:`, error);
      return null;
    }
  }
  /**
   * Discover what components a plugin contains
   */
  async discoverComponents(pluginPath, manifest) {
    const skills = [];
    const agents = [];
    let hasHooks = false;
    let hasMcp = false;
    const skillsDir = manifest.skills ? join4(pluginPath, manifest.skills) : join4(pluginPath, "skills");
    if (existsSync2(skillsDir)) {
      try {
        const entries = await readdir3(skillsDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const skillMd = join4(skillsDir, entry.name, "SKILL.md");
            if (existsSync2(skillMd)) {
              skills.push(entry.name);
            }
          }
        }
      } catch {
      }
    }
    if (Array.isArray(manifest.agents)) {
      for (const agentPath of manifest.agents) {
        const fullPath = join4(pluginPath, agentPath);
        if (existsSync2(fullPath)) {
          const agentName = agentPath.split("/").pop()?.replace(".md", "") || "";
          if (agentName) {
            agents.push(agentName);
          }
        }
      }
    } else {
      const agentsDir = manifest.agents ? join4(pluginPath, manifest.agents) : join4(pluginPath, "agents");
      if (existsSync2(agentsDir)) {
        try {
          const entries = await readdir3(agentsDir, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isFile() && entry.name.endsWith(".md")) {
              agents.push(entry.name.replace(".md", ""));
            }
          }
        } catch {
        }
      }
    }
    const hooksPath = manifest.hooks ? join4(pluginPath, manifest.hooks) : join4(pluginPath, "hooks", "hooks.json");
    hasHooks = existsSync2(hooksPath);
    const mcpPath = manifest.mcpServers ? join4(pluginPath, manifest.mcpServers) : join4(pluginPath, ".mcp.json");
    hasMcp = existsSync2(mcpPath);
    return { skills, agents, hasHooks, hasMcp };
  }
  /**
   * Add a repo to the known repos list
   */
  addRepo(repoPath) {
    if (!this.knownRepos.includes(repoPath)) {
      this.knownRepos.push(repoPath);
    }
  }
  /**
   * Get plugins available to a specific repo (respecting scope resolution)
   * Resolution order: Local > Project > User
   */
  async getPluginsForRepo(repoPath) {
    const result = [];
    const seen = /* @__PURE__ */ new Set();
    this.addRepo(repoPath);
    const localDir = join4(repoPath, ".claude", "local", "plugins");
    const localPlugins = await this.scanPluginDirectory(localDir, "local", repoPath);
    for (const plugin of localPlugins) {
      if (!seen.has(plugin.name)) {
        result.push(plugin);
        seen.add(plugin.name);
      }
    }
    const projectDir = join4(repoPath, ".claude", "plugins");
    const projectPlugins = await this.scanPluginDirectory(projectDir, "project", repoPath);
    for (const plugin of projectPlugins) {
      if (!seen.has(plugin.name)) {
        result.push(plugin);
        seen.add(plugin.name);
      }
    }
    const userPlugins = await this.discoverUserPlugins();
    for (const plugin of userPlugins) {
      if (!seen.has(plugin.name)) {
        result.push(plugin);
        seen.add(plugin.name);
      }
    }
    return result;
  }
};

// packages/tiny-brain-core/src/services/quality/quality-service.ts
import { promises as fs4 } from "fs";
import path5 from "path";

// packages/tiny-brain-core/src/services/api/library-client.ts
var LibraryClient = class {
  apiUrl;
  constructor(apiUrl) {
    if (apiUrl) {
      this.apiUrl = apiUrl;
      return;
    }
    this.apiUrl = getTBRUrl();
  }
  /**
   * Get agents with phase-based structure for repo analysis
   * Returns agents organized by development phases with handoffs and prerequisites
   */
  async getAgents(repoAnalysis, token) {
    const url = `${this.apiUrl}/api/library/system/agents`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ repoAnalysis })
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
  /**
   * Get catalog of available personas and agents
   */
  async getCatalog(token) {
    const response = await fetch(`${this.apiUrl}/api/library`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch library catalog: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
  /**
   * Get list of all available library personas
   */
  async getPersonas(token, category) {
    const params = category ? `?category=${encodeURIComponent(category)}` : "";
    const response = await fetch(`${this.apiUrl}/api/library/system/personas${params}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch library personas: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.personas || [];
  }
  /**
   * Check for agent updates based on current tech stack and installed agents
   */
  async checkAgentUpdates(techStack, currentAgents, token) {
    try {
      const response = await fetch(`${this.apiUrl}/api/library/agents/check-updates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          techStack,
          currentAgents
        })
      });
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data;
    } catch {
      return null;
    }
  }
  /**
   * Get agent diff between two analyses
   */
  async getAgentDiff(oldAnalysis, newAnalysis, token) {
    try {
      const response = await fetch(`${this.apiUrl}/api/library/agents/diff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          oldAnalysis,
          newAnalysis
        })
      });
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data;
    } catch {
      return null;
    }
  }
  /**
   * Get a specific library persona
   */
  async getPersona(personaPath, token, includeAgents = false) {
    const params = includeAgents ? "?agents=true" : "";
    const response = await fetch(`${this.apiUrl}/api/library/system/personas/${personaPath}${params}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch library persona: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
      return await response.text();
    }
  }
  /**
   * Get a specific agent by ID
   */
  async getAgent(agentId, token) {
    const response = await fetch(`${this.apiUrl}/api/library/agent/${agentId}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch library agent: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
  /**
   * List agents with optional filters (new agent system)
   */
  async listAgents(token, category, subcategory, phase) {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (subcategory) params.append("subcategory", subcategory);
    if (phase) params.append("phase", phase);
    const queryString = params.toString();
    const url = queryString ? `${this.apiUrl}/api/agents?${queryString}` : `${this.apiUrl}/api/agents`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
  /**
   * Get agent by path (new agent system)
   */
  async getAgentByPath(token, path12) {
    const response = await fetch(`${this.apiUrl}/api/agents/${path12}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch agent: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
  /**
   * Store agent at specified path (new agent system)
   */
  async storeAgent(token, path12, agent) {
    const response = await fetch(`${this.apiUrl}/api/agents/${path12}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(agent)
    });
    if (!response.ok) {
      throw new Error(`Failed to store agent: ${response.status} ${response.statusText}`);
    }
  }
  /**
   * Archive agent at specified path (new agent system)
   */
  async archiveAgent(token, path12) {
    const response = await fetch(`${this.apiUrl}/api/agents/${path12}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to archive agent: ${response.status} ${response.statusText}`);
    }
  }
  /**
   * Get agent index (new agent system)
   */
  async getAgentIndex(token) {
    const response = await fetch(`${this.apiUrl}/api/agents/index`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch agent index: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
  /**
   * Update agent index (new agent system)
   */
  async updateAgentIndex(token, index) {
    const response = await fetch(`${this.apiUrl}/api/agents/index`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(index)
    });
    if (!response.ok) {
      throw new Error(`Failed to update agent index: ${response.status} ${response.statusText}`);
    }
  }
  /**
   * Match agents based on repo analysis (new agent system)
   */
  async matchAgents(token, repoAnalysis) {
    const response = await fetch(`${this.apiUrl}/api/agents/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ repoAnalysis })
    });
    if (!response.ok) {
      throw new Error(`Failed to match agents: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
  /**
   * Update a specific system persona with partial data
   * @param persona - The SystemPersona to update
   * @param updates - Partial updates to apply
   * @param token - Authentication token
   * @returns Updated persona
   */
  async updateSystemPersona(persona, updates, token) {
    const url = `${this.apiUrl}/api/library/system/personas/${persona.path}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update system persona: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    return data;
  }
};

// packages/tiny-brain-core/src/analyser/index.ts
import * as fs7 from "fs/promises";
import * as path8 from "path";

// packages/tiny-brain-core/src/analyser/detectors/base-detector.ts
import * as fs5 from "fs/promises";
import * as path6 from "path";

// packages/tiny-brain-core/src/analyser/utils.ts
import * as path7 from "path";
import * as fs6 from "fs/promises";

// packages/tiny-brain-core/src/constants/test-plan-emojis.ts
var TEST_PLAN_EMOJIS = Object.freeze({
  // Category emojis
  REGRESSION: "\u{1F512}",
  AMENDED_CASE: "\u270F\uFE0F",
  AMENDED_FILE: "\u{1F4DD}",
  NEW_CASE: "\u{1F195}",
  NEW_FILE: "\u{1F4C4}",
  // Status emojis
  PASSING: "\u2705",
  FAILING: "\u274C",
  PENDING: "\u23F3"
});

// packages/tiny-brain-dashboard/server/services/bridge.service.ts
var ServiceBridge = class {
  constructor(context) {
    this.context = context;
    this.planning = new PlanningService(context);
    this.personas = new PersonaService(context);
    this.repoConfig = new RepoConfigService(context);
  }
  planning;
  personas;
  repoConfig;
  getActivePersonaId() {
    return this.context.activePersona?.id || "default";
  }
  async getActivePlanId() {
    if (!this.context.activePersona?.id) {
      return null;
    }
    try {
      const activePlan = await this.planning.getActivePlan();
      return activePlan?.id || null;
    } catch {
      return null;
    }
  }
};

// packages/tiny-brain-dashboard/server/routes/plans.routes.ts
function createPlanRoutes(bridge) {
  const app = new Hono2();
  const requireActivePersona = () => {
    const activePersonaId = bridge.getActivePersonaId();
    if (!activePersonaId || activePersonaId === "default") {
      return false;
    }
    return true;
  };
  app.get("/", async (c) => {
    const type = c.req.query("type");
    const plans = await bridge.planning.listPlans(type ? { type } : {});
    const activePlanId = await bridge.getActivePlanId();
    return c.json({ plans, activePlanId });
  });
  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const plan = await bridge.planning.loadPlan({ planId: id });
    if (!plan) {
      return c.json({ error: "Plan not found" }, 404);
    }
    return c.json(plan);
  });
  app.post("/:id/:action", async (c) => {
    if (!requireActivePersona()) {
      return c.json({ error: "No active persona" }, 400);
    }
    const { id, action } = c.req.param();
    try {
      switch (action) {
        case "archive":
          await bridge.planning.archivePlan({
            planId: id,
            reason: "Dashboard action"
          });
          break;
        case "activate":
          await bridge.planning.switchToPlan(id);
          break;
        case "unarchive":
          await bridge.planning.unarchivePlan(id);
          break;
        default:
          return c.json({ error: "Unknown action" }, 400);
      }
      return c.json({ success: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operation failed";
      return c.json({ error: message }, 400);
    }
  });
  app.delete("/:id", async (c) => {
    if (!requireActivePersona()) {
      return c.json({ error: "No active persona" }, 400);
    }
    const id = c.req.param("id");
    try {
      await bridge.planning.deletePlan(id);
      return c.json({ success: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed";
      return c.json({ error: message }, 400);
    }
  });
  app.get("/:id/report", async (c) => {
    const id = c.req.param("id");
    try {
      const plan = await bridge.planning.loadPlan({ planId: id });
      if (!plan) {
        return c.json({ error: "Plan not found" }, 404);
      }
      const report = await bridge.planning.formatPlan(plan, true);
      return c.json({
        report,
        plan
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate report";
      return c.json({ error: message }, 400);
    }
  });
  return app;
}

// packages/tiny-brain-dashboard/server/routes/personas.routes.ts
function createPersonaRoutes(bridge, sse) {
  const app = new Hono2();
  app.get("/", async (c) => {
    try {
      bridge.context.logger.info("Personas list endpoint called");
      const personaNames = await bridge.personas.listPersonas({ includeArchived: false });
      bridge.context.logger.info(`Found ${personaNames.length} personas`);
      const activePersonaId = bridge.getActivePersonaId();
      const personas = [];
      for (const personaName of personaNames) {
        try {
          const persona = await bridge.personas.loadPersona({
            personaName,
            mode: "brief"
          });
          if (persona) {
            personas.push(persona);
          } else {
            personas.push({
              name: personaName,
              persona: null,
              metadata: null
            });
          }
        } catch (err) {
          bridge.context.logger.error(`Error loading persona ${personaName}:`, err);
          personas.push({
            name: personaName,
            persona: null,
            metadata: null
          });
        }
      }
      return c.json({
        personas,
        activePersonaId
      });
    } catch (error) {
      bridge.context.logger.error("Failed to list personas:", error);
      return c.json({ error: "Failed to list personas" }, 500);
    }
  });
  app.get("/library", async (c) => {
    return c.json({
      personas: []
    });
  });
  app.get("/debug/storage", async (c) => {
    try {
      const testPersona = "developer";
      const profileContent = await bridge.context.storage.getPersonaFile(
        testPersona,
        "profile.md",
        bridge.context.userId
      );
      return c.json({
        userId: bridge.context.userId,
        storageType: bridge.context.storage.constructor.name,
        basePath: bridge.context.storage.getBasePath?.(),
        profileExists: !!profileContent,
        profileLength: profileContent?.length || 0,
        profilePreview: profileContent?.substring(0, 200) || "null"
      });
    } catch (error) {
      return c.json({
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : void 0
      }, 500);
    }
  });
  app.get("/updates", async (c) => {
    return c.json({
      updates: []
    });
  });
  app.get("/:id/files", async (c) => {
    try {
      const personaId = c.req.param("id");
      const storage = bridge.context.storage;
      const files = await storage.listPersonaFiles(
        personaId,
        bridge.context.userId
      );
      return c.json({ files });
    } catch (error) {
      bridge.context.logger.error("Failed to list persona files:", error);
      return c.json({ error: "Failed to list persona files" }, 500);
    }
  });
  app.get("/:id/plans", async (c) => {
    try {
      const personaId = c.req.param("id");
      const plans = await bridge.planning.listPlansForPersona(personaId);
      return c.json({ plans });
    } catch (error) {
      bridge.context.logger.error("Failed to get persona plans:", error);
      return c.json({ error: "Failed to get persona plans" }, 500);
    }
  });
  app.get("/:personaId/plans/:planId/report", async (c) => {
    try {
      const personaId = c.req.param("personaId");
      const planId = c.req.param("planId");
      const plan = await bridge.planning.loadPlanForPersona(personaId, planId);
      if (!plan) {
        return c.json({ error: "Plan not found" }, 404);
      }
      const report = await bridge.planning.formatPlan(plan, true);
      return c.json({
        report,
        plan
      });
    } catch (error) {
      bridge.context.logger.error("Failed to get plan report:", error);
      return c.json({ error: "Failed to get plan report" }, 500);
    }
  });
  app.post("/:id/switch", async (c) => {
    try {
      const personaId = c.req.param("id");
      bridge.context.logger.info("Persona switch requested:", personaId);
      bridge.context.logger.info(`Switching to persona: ${personaId}`);
      if (sse) {
        await sse.broadcast("persona-switched", {
          personaId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      return c.json({
        success: true,
        activePersonaId: personaId
      });
    } catch (error) {
      bridge.context.logger.error("Failed to switch persona:", error);
      return c.json({ error: "Failed to switch persona" }, 500);
    }
  });
  app.post("/:id/sync", async (c) => {
    const personaId = c.req.param("id");
    bridge.context.logger.info("Persona sync requested:", personaId);
    return c.json({
      success: true
    });
  });
  app.post("/:id/import", async (c) => {
    const personaId = c.req.param("id");
    bridge.context.logger.info("Persona import requested:", personaId);
    return c.json({
      success: true
    });
  });
  app.get("/:id", async (c) => {
    try {
      const personaId = c.req.param("id");
      bridge.context.logger.info(`Loading persona ${personaId} - userId: ${bridge.context.userId}, storage type: ${bridge.context.storage.constructor.name}`);
      const persona = await bridge.personas.loadPersona({
        personaName: personaId,
        mode: "full"
      });
      if (!persona) {
        bridge.context.logger.error(`Persona ${personaId} not found - returned null from loadPersona`);
        return c.json({ error: "Persona not found" }, 404);
      }
      return c.json(persona);
    } catch (error) {
      bridge.context.logger.error("Failed to get persona:", error);
      return c.json({ error: "Failed to get persona" }, 500);
    }
  });
  app.put("/:id", async (c) => {
    try {
      const personaId = c.req.param("id");
      const body = await c.req.json();
      await bridge.context.storage.storePersonaFile(
        personaId,
        "profile.json",
        JSON.stringify(body, null, 2),
        bridge.context.userId
      );
      return c.json({ success: true });
    } catch (error) {
      bridge.context.logger.error("Failed to update persona:", error);
      return c.json({ error: "Failed to update persona" }, 500);
    }
  });
  return app;
}

// packages/tiny-brain-dashboard/server/routes/config.routes.ts
function createConfigRoutes(bridge) {
  const app = new Hono2();
  app.get("/credentials", async (c) => {
    const libraryAuth = bridge.context.libraryAuth;
    if (!libraryAuth) {
      return c.json({
        clientId: null,
        clientSecret: null
      });
    }
    return c.json({
      clientId: libraryAuth.clientId || null,
      clientSecret: libraryAuth.hasStoredSecret ? "[STORED]" : null
    });
  });
  app.post("/credentials", async (c) => {
    return c.json({
      error: "Credentials are read-only. Please use the tiny-brain CLI to manage credentials."
    }, 403);
  });
  app.delete("/credentials", async (c) => {
    return c.json({
      error: "Credentials are read-only. Please use the tiny-brain CLI to clear credentials."
    }, 403);
  });
  return app;
}

// packages/tiny-brain-dashboard/server/routes/library.routes.ts
function createLibraryRoutes(bridge) {
  const app = new Hono2();
  const libraryClient = new LibraryClient();
  app.post("/authenticate", async (c) => {
    const libraryAuth = bridge.context.libraryAuth;
    if (!libraryAuth || !libraryAuth.token) {
      return c.json({
        success: false,
        error: "No authentication available. Please configure credentials through the CLI."
      }, 401);
    }
    return c.json({
      success: true,
      token: libraryAuth.token
    });
  });
  app.get("/personas", async (c) => {
    try {
      let token;
      const authHeader = c.req.header("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      } else if (bridge.context.libraryAuth?.token) {
        token = bridge.context.libraryAuth.token;
      }
      if (!token) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const personas = await libraryClient.getPersonas(token);
      bridge.context.logger.debug("LibraryClient.getPersonas returned:", {
        type: typeof personas,
        isArray: Array.isArray(personas),
        keys: personas && typeof personas === "object" && !Array.isArray(personas) ? Object.keys(personas) : void 0,
        length: Array.isArray(personas) ? personas.length : void 0
      });
      return c.json({
        personas
      });
    } catch (error) {
      bridge.context.logger.error("Failed to fetch library personas:", error);
      return c.json({ error: "Failed to fetch library personas" }, 500);
    }
  });
  app.post("/test", async (c) => {
    try {
      const libraryAuth = bridge.context.libraryAuth;
      if (!libraryAuth || !libraryAuth.token) {
        return c.json({
          success: false,
          error: "No authentication available"
        });
      }
      try {
        await libraryClient.getPersonas(libraryAuth.token);
        return c.json({
          success: true,
          message: "Connection test successful"
        });
      } catch (error) {
        return c.json({
          success: false,
          error: "Connection test failed"
        });
      }
    } catch (error) {
      bridge.context.logger.error("Failed to test library connection:", error);
      return c.json({
        success: false,
        error: "Failed to test connection"
      }, 500);
    }
  });
  return app;
}

// packages/tiny-brain-dashboard/server/routes/settings.routes.ts
function createSettingsRoutes(bridge) {
  const app = new Hono2();
  app.get("/global", async (c) => {
    try {
      const settingsData = await bridge.context.storage.getUserData("settings/global", bridge.context.userId);
      const settings = settingsData ? JSON.parse(settingsData) : { theme: "dark" };
      return c.json(settings);
    } catch (error) {
      bridge.context.logger.error("Failed to get global settings:", error);
      return c.json({ error: "Failed to get global settings" }, 500);
    }
  });
  app.put("/global", async (c) => {
    try {
      const body = await c.req.json();
      await bridge.context.storage.storeUserData("settings/global", JSON.stringify(body), bridge.context.userId);
      return c.json({ success: true });
    } catch (error) {
      bridge.context.logger.error("Failed to update global settings:", error);
      return c.json({ error: "Failed to update global settings" }, 500);
    }
  });
  app.get("/persona/:id", async (c) => {
    try {
      const personaId = c.req.param("id");
      const settingsData = await bridge.context.storage.getPersonaFile(
        personaId,
        "settings.json",
        bridge.context.userId
      );
      const settings = settingsData ? JSON.parse(settingsData) : {};
      return c.json(settings);
    } catch (error) {
      bridge.context.logger.error("Failed to get persona settings:", error);
      return c.json({ error: "Failed to get persona settings" }, 500);
    }
  });
  app.put("/persona/:id", async (c) => {
    try {
      const personaId = c.req.param("id");
      const body = await c.req.json();
      await bridge.context.storage.storePersonaFile(
        personaId,
        "settings.json",
        JSON.stringify(body),
        bridge.context.userId
      );
      return c.json({ success: true });
    } catch (error) {
      bridge.context.logger.error("Failed to update persona settings:", error);
      return c.json({ error: "Failed to update persona settings" }, 500);
    }
  });
  app.get("/active", async (c) => {
    try {
      const activePersonaId = bridge.getActivePersonaId();
      if (!activePersonaId) {
        return c.json({ error: "No active persona" }, 404);
      }
      const settingsData = await bridge.context.storage.getPersonaFile(
        activePersonaId,
        "settings.json",
        bridge.context.userId
      );
      const settings = settingsData ? JSON.parse(settingsData) : {};
      return c.json(settings);
    } catch (error) {
      bridge.context.logger.error("Failed to get active persona settings:", error);
      return c.json({ error: "Failed to get active persona settings" }, 500);
    }
  });
  return app;
}

// packages/tiny-brain-dashboard/server/routes/repos.routes.ts
import { readdir as readdir6, readFile as readFile6 } from "fs/promises";
import { join as join8 } from "path";
function parseTasksFromMarkdown(content) {
  const tasks = [];
  const taskRegex = /###\s+(\d+)\.\s+([^\n]+)\n([\s\S]*?)(?=###\s+\d+\.|## |$)/g;
  let match3;
  while ((match3 = taskRegex.exec(content)) !== null) {
    const taskNumber = parseInt(match3[1], 10);
    const taskTitle = match3[2].trim();
    const taskBody = match3[3].trim();
    const filesToModify = [];
    const modifyMatch = taskBody.match(/\*\*Files to modify:?\*\*\s*\n((?:- [^\n]+\n?)+)/i);
    if (modifyMatch) {
      const fileLines = modifyMatch[1].match(/- `([^`]+)`/g);
      if (fileLines) {
        fileLines.forEach((line) => {
          const fileMatch = line.match(/- `([^`]+)`/);
          if (fileMatch) filesToModify.push(fileMatch[1]);
        });
      }
    }
    const filesToCreate = [];
    const createMatch = taskBody.match(/\*\*Files to (?:create|modify\/create):?\*\*\s*\n((?:- [^\n]+\n?)+)/i);
    if (createMatch) {
      const fileLines = createMatch[1].match(/- `([^`]+)`/g);
      if (fileLines) {
        fileLines.forEach((line) => {
          const fileMatch = line.match(/- `([^`]+)`/);
          if (fileMatch) filesToCreate.push(fileMatch[1]);
        });
      }
    }
    const expectedChanges = [];
    const changesMatch = taskBody.match(/\*\*Expected changes:?\*\*\s*\n((?:- [^\n]+\n?)+)/i);
    if (changesMatch) {
      const changeLines = changesMatch[1].split("\n").filter((l) => l.startsWith("-"));
      changeLines.forEach((line) => {
        const change = line.replace(/^-\s*/, "").trim();
        if (change) expectedChanges.push(change);
      });
    }
    let description = taskBody;
    const firstSectionIndex = taskBody.search(/\*\*Files|`\*\*Expected/i);
    if (firstSectionIndex > 0) {
      description = taskBody.substring(0, firstSectionIndex).trim();
    }
    tasks.push({
      id: `task-${taskNumber}`,
      number: taskNumber,
      title: taskTitle,
      description,
      filesToModify: filesToModify.length > 0 ? filesToModify : void 0,
      filesToCreate: filesToCreate.length > 0 ? filesToCreate : void 0,
      expectedChanges: expectedChanges.length > 0 ? expectedChanges : void 0
    });
  }
  return tasks;
}
function parseFeatureMarkdown(content) {
  const frontmatter = parseFrontmatter(content);
  const descMatch = content.match(/## Description\s*\n\n([\s\S]*?)(?=\n## )/);
  const description = descMatch ? descMatch[1].trim() : void 0;
  const acceptanceCriteria = [];
  const criteriaMatch = content.match(/## Acceptance Criteria\s*\n\n([\s\S]*?)(?=\n## )/);
  if (criteriaMatch) {
    const criteriaLines = criteriaMatch[1].split("\n").filter((l) => l.startsWith("-"));
    criteriaLines.forEach((line) => {
      const criteria = line.replace(/^-\s*/, "").trim();
      if (criteria) acceptanceCriteria.push(criteria);
    });
  }
  const tasks = parseTasksFromMarkdown(content);
  return {
    id: frontmatter.id || "",
    title: frontmatter.title || "",
    description,
    acceptanceCriteria: acceptanceCriteria.length > 0 ? acceptanceCriteria : void 0,
    tasks,
    rawContent: content
  };
}
function parseFrontmatter(content) {
  const match3 = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match3) return {};
  const frontmatter = {};
  const lines = match3[1].split("\n");
  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}
function createRepoRoutes(bridge) {
  const app = new Hono2();
  app.get("/", async (c) => {
    try {
      const repos = await bridge.repoConfig.listRepos();
      return c.json({ repos });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 500);
    }
  });
  app.get("/:repoId", async (c) => {
    try {
      const repoId = c.req.param("repoId");
      const repo = await bridge.repoConfig.getRepoWithContext(repoId);
      if (!repo) {
        return c.json({ error: "Repository not found" }, 404);
      }
      return c.json({ repo });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 500);
    }
  });
  app.get("/:repoId/plans/:planId/features/:featureId", async (c) => {
    try {
      const repoId = c.req.param("repoId");
      const planId = c.req.param("planId");
      const featureId = c.req.param("featureId");
      console.log("[Feature API] Request:", { repoId, planId, featureId });
      const repo = await bridge.repoConfig.getRepo(repoId);
      if (!repo) {
        console.log("[Feature API] Repository not found:", repoId);
        return c.json({ error: "Repository not found" }, 404);
      }
      const featurePath = join8(repo.path, "docs", "prd", planId, "features", `${featureId}.md`);
      console.log("[Feature API] Looking for file:", featurePath);
      try {
        const content = await readFile6(featurePath, "utf-8");
        const feature = parseFeatureMarkdown(content);
        console.log("[Feature API] Success - found", feature.tasks.length, "tasks");
        return c.json({ feature });
      } catch (err) {
        if (err.code === "ENOENT") {
          console.log("[Feature API] Feature file not found:", featurePath);
          return c.json({ error: "Feature not found" }, 404);
        }
        throw err;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.log("[Feature API] Error:", message);
      return c.json({ error: message }, 500);
    }
  });
  app.get("/:repoId/plans", async (c) => {
    try {
      const repoId = c.req.param("repoId");
      const repo = await bridge.repoConfig.getRepo(repoId);
      if (!repo) {
        return c.json({ error: "Repository not found" }, 404);
      }
      const plans = await bridge.planning.listPlans({ repoPath: repo.path });
      return c.json({ plans });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 500);
    }
  });
  app.get("/:repoId/fixes", async (c) => {
    try {
      const repoId = c.req.param("repoId");
      const repo = await bridge.repoConfig.getRepo(repoId);
      if (!repo) {
        return c.json({ error: "Repository not found" }, 404);
      }
      const fixesProgress = await bridge.planning.syncFixes(repo.path);
      return c.json({ fixes: fixesProgress.fixes, lastSynced: fixesProgress.lastSynced });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 500);
    }
  });
  app.get("/:repoId/agents", async (c) => {
    try {
      const repoId = c.req.param("repoId");
      const repo = await bridge.repoConfig.getRepo(repoId);
      if (!repo) {
        return c.json({ error: "Repository not found" }, 404);
      }
      const agentsPath = join8(repo.path, ".claude", "agents");
      const agents = [];
      try {
        const files = await readdir6(agentsPath);
        const mdFiles = files.filter((f) => f.endsWith(".md"));
        for (const file of mdFiles) {
          const content = await readFile6(join8(agentsPath, file), "utf-8");
          const frontmatter = parseFrontmatter(content);
          const id = file.replace(".md", "");
          agents.push({
            id,
            name: frontmatter.name || id,
            description: frontmatter.description,
            tags: []
            // Tags could be extracted from frontmatter if present
          });
        }
      } catch (err) {
        if (err.code !== "ENOENT") {
          throw err;
        }
      }
      return c.json({ agents });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 500);
    }
  });
  app.get("/:repoId/skills", async (c) => {
    try {
      const repoId = c.req.param("repoId");
      const repo = await bridge.repoConfig.getRepo(repoId);
      if (!repo) {
        return c.json({ error: "Repository not found" }, 404);
      }
      const skillsPath = join8(repo.path, ".claude", "skills");
      const skills = [];
      try {
        const entries = await readdir6(skillsPath, { withFileTypes: true });
        const directories = entries.filter((e) => e.isDirectory());
        for (const dir of directories) {
          const skillMdPath = join8(skillsPath, dir.name, "SKILL.md");
          try {
            const content = await readFile6(skillMdPath, "utf-8");
            const frontmatter = parseFrontmatter(content);
            skills.push({
              id: dir.name,
              name: frontmatter.name || dir.name,
              description: frontmatter.description || "",
              path: `.claude/skills/${dir.name}/SKILL.md`
            });
          } catch {
          }
        }
      } catch (err) {
        if (err.code !== "ENOENT") {
          throw err;
        }
      }
      return c.json({ skills });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 500);
    }
  });
  return app;
}

// packages/tiny-brain-dashboard/server/routes/git.routes.ts
import { execSync } from "node:child_process";
function createGitRoutes(bridge) {
  const app = new Hono2();
  const repositoryRoot = bridge.context.repositoryRoot || process.cwd();
  app.get("/commits/:sha", async (c) => {
    const sha = c.req.param("sha");
    try {
      const commitInfo = execSync(
        `git show --no-patch --format='%H%n%an%n%ae%n%aI%n%s%n%b' ${sha}`,
        { encoding: "utf-8", cwd: repositoryRoot }
      ).split("\n");
      const fullSha = commitInfo[0];
      const author = commitInfo[1];
      const email = commitInfo[2];
      const date = commitInfo[3];
      const subject = commitInfo[4];
      const body = commitInfo.slice(5).join("\n").trim();
      const message = body ? `${subject}

${body}` : subject;
      const filesChangedOutput = execSync(
        `git show --stat --format='' ${sha}`,
        { encoding: "utf-8", cwd: repositoryRoot }
      );
      const filesChanged = filesChangedOutput.split("\n").filter((line) => line.includes("|")).length;
      return c.json({
        sha: fullSha,
        message,
        author,
        email,
        date,
        filesChanged
      });
    } catch (error) {
      console.error("Error fetching commit details:", error);
      console.error("Repository root:", repositoryRoot);
      console.error("SHA:", sha);
      return c.json({ error: "Failed to fetch commit details" }, 500);
    }
  });
  return app;
}

// packages/tiny-brain-dashboard/server/routes/plugins.routes.ts
function createPluginRoutes(bridge) {
  const app = new Hono2();
  const getKnownRepos = () => {
    const repos = bridge.repos?.getKnownRepos?.() || [];
    return repos;
  };
  app.get("/", async (c) => {
    try {
      const knownRepos = getKnownRepos();
      const discovery = new PluginDiscoveryService(knownRepos);
      const plugins = await discovery.discoverAllFlat();
      return c.json({
        plugins,
        count: plugins.length
      });
    } catch (error) {
      bridge.context.logger.error("Failed to discover plugins:", error);
      return c.json({ error: "Failed to discover plugins" }, 500);
    }
  });
  app.get("/by-scope", async (c) => {
    try {
      const knownRepos = getKnownRepos();
      const discovery = new PluginDiscoveryService(knownRepos);
      const byScope = await discovery.discoverAll();
      const projectPlugins = {};
      for (const [repoPath, plugins] of byScope.project) {
        projectPlugins[repoPath] = plugins;
      }
      const localPlugins = {};
      for (const [repoPath, plugins] of byScope.local) {
        localPlugins[repoPath] = plugins;
      }
      return c.json({
        user: byScope.user,
        project: projectPlugins,
        local: localPlugins,
        marketplaces: byScope.marketplaces
      });
    } catch (error) {
      bridge.context.logger.error("Failed to discover plugins by scope:", error);
      return c.json({ error: "Failed to discover plugins by scope" }, 500);
    }
  });
  app.get("/marketplaces", async (c) => {
    try {
      const discovery = new PluginDiscoveryService([]);
      const marketplaces = await discovery.discoverMarketplaces();
      return c.json({
        marketplaces,
        count: marketplaces.length
      });
    } catch (error) {
      bridge.context.logger.error("Failed to discover marketplaces:", error);
      return c.json({ error: "Failed to discover marketplaces" }, 500);
    }
  });
  app.get("/user", async (c) => {
    try {
      const discovery = new PluginDiscoveryService([]);
      const plugins = await discovery.discoverUserPlugins();
      return c.json({
        plugins,
        count: plugins.length
      });
    } catch (error) {
      bridge.context.logger.error("Failed to discover user plugins:", error);
      return c.json({ error: "Failed to discover user plugins" }, 500);
    }
  });
  app.get("/repo/:repoPath", async (c) => {
    try {
      const repoPath = decodeURIComponent(c.req.param("repoPath"));
      const knownRepos = getKnownRepos();
      const discovery = new PluginDiscoveryService(knownRepos);
      const plugins = await discovery.getPluginsForRepo(repoPath);
      return c.json({
        repoPath,
        plugins,
        count: plugins.length
      });
    } catch (error) {
      bridge.context.logger.error("Failed to get repo plugins:", error);
      return c.json({ error: "Failed to get repo plugins" }, 500);
    }
  });
  return app;
}

// packages/tiny-brain-dashboard/server/app.ts
var __dirname = path9.dirname(fileURLToPath3(import.meta.url));
function createApp(context, sse) {
  const app = new Hono2();
  const bridge = new ServiceBridge(context);
  app.use("*", cors());
  app.route("/api/plans", createPlanRoutes(bridge));
  app.route("/api/personas", createPersonaRoutes(bridge, sse));
  app.route("/api/config", createConfigRoutes(bridge));
  app.route("/api/library", createLibraryRoutes(bridge));
  app.route("/api/settings", createSettingsRoutes(bridge));
  app.route("/api/repos", createRepoRoutes(bridge));
  app.route("/api/git", createGitRoutes(bridge));
  app.route("/api/plugins", createPluginRoutes(bridge));
  app.get("/events", async (c) => {
    c.header("Content-Type", "text/event-stream");
    c.header("Cache-Control", "no-cache");
    c.header("Connection", "keep-alive");
    const stream2 = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const activePersonaId = bridge.getActivePersonaId();
        let plans = [];
        try {
          plans = await bridge.planning.listPlans();
        } catch {
        }
        const initialData = {
          personaId: activePersonaId,
          plans,
          activePlanId: null,
          // Repo plans don't have a single "active" plan
          message: "Connected to dashboard SSE"
        };
        controller.enqueue(encoder.encode(`event: connected
data: ${JSON.stringify(initialData)}

`));
        const sseStream = {
          write: async (data) => {
            try {
              controller.enqueue(encoder.encode(data));
            } catch (error) {
              throw error;
            }
          }
        };
        sse.addConnection(sseStream);
        c.req.raw.signal.addEventListener("abort", () => {
          sse.removeConnection(sseStream);
          controller.close();
        });
      }
    });
    return new Response(stream2, {
      headers: c.res.headers
    });
  });
  app.get("/health", (c) => {
    return c.json({ status: "ok" });
  });
  const distPath = process.env.TINY_BRAIN_DASHBOARD_STATIC_PATH ? path9.resolve(process.env.TINY_BRAIN_DASHBOARD_STATIC_PATH) : path9.resolve(__dirname, "../dist");
  const distExists = fs8.existsSync(distPath);
  if (distExists) {
    app.use("/assets/*", serveStatic({
      root: distPath,
      rewriteRequestPath: (path12) => path12.replace("/assets", "/assets")
    }));
    app.use("/favicon.png", serveStatic({
      root: distPath,
      rewriteRequestPath: () => "/favicon.png"
    }));
    app.get("/*", async (c) => {
      const reqPath = c.req.path;
      if (reqPath.startsWith("/api") || reqPath.startsWith("/events") || reqPath === "/health") {
        return c.notFound();
      }
      const indexPath = path9.join(distPath, "index.html");
      if (fs8.existsSync(indexPath)) {
        const indexHtml = fs8.readFileSync(indexPath, "utf-8");
        return c.html(indexHtml);
      }
      return c.html(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tiny Brain Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <p>Dashboard build not found. Please build the dashboard first.</p>
  </body>
</html>`);
    });
  } else {
    app.get("/*", async (c) => {
      const reqPath = c.req.path;
      if (reqPath.startsWith("/api") || reqPath.startsWith("/events") || reqPath === "/health") {
        return c.notFound();
      }
      return c.html(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tiny Brain Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <p>Dashboard not built. Please run 'npm run build' in the dashboard package.</p>
  </body>
</html>`);
    });
  }
  return app;
}

// packages/tiny-brain-dashboard/server/services/sse.service.ts
var SSEService = class {
  connections = /* @__PURE__ */ new Set();
  addConnection(stream2) {
    this.connections.add(stream2);
  }
  removeConnection(stream2) {
    this.connections.delete(stream2);
  }
  async broadcast(event, data) {
    const message = event ? `event: ${event}
data: ${JSON.stringify(data)}

` : `data: ${JSON.stringify(data)}

`;
    const promises2 = [];
    for (const stream2 of this.connections) {
      promises2.push(
        stream2.write(message).catch(() => {
          this.connections.delete(stream2);
        })
      );
    }
    await Promise.all(promises2);
  }
  closeAll() {
    this.connections.clear();
  }
  getConnectionCount() {
    return this.connections.size;
  }
};

// packages/tiny-brain-dashboard/server/services/file-watcher.service.ts
import * as path11 from "path";
import * as fs10 from "fs";
import * as os from "os";

// packages/tiny-brain-dashboard/server/services/generic-file-watcher.ts
import * as fs9 from "fs";
import * as path10 from "path";
import { EventEmitter as EventEmitter2 } from "events";
var FileWatcherService = class extends EventEmitter2 {
  watchInterval = null;
  fileTimestamps = /* @__PURE__ */ new Map();
  watchPath = null;
  options;
  logger;
  isWatching = false;
  constructor(logger) {
    super();
    this.logger = logger;
    this.options = {
      pollInterval: 1e3,
      recursive: true,
      fileFilter: () => true
    };
  }
  /**
   * Start watching a directory
   */
  async start(watchPath, options = {}) {
    if (this.isWatching) {
      throw new Error("File watcher is already running");
    }
    this.watchPath = watchPath;
    this.options = {
      ...this.options,
      ...options
    };
    if (!fs9.existsSync(watchPath)) {
      throw new Error(`Watch path does not exist: ${watchPath}`);
    }
    const stats = fs9.statSync(watchPath);
    if (!stats.isDirectory()) {
      throw new Error(`Watch path is not a directory: ${watchPath}`);
    }
    await this.scanDirectory();
    this.watchInterval = setInterval(async () => {
      await this.checkForChanges();
    }, this.options.pollInterval);
    this.isWatching = true;
    this.logger.info(`File watcher started for: ${watchPath}`);
  }
  /**
   * Stop watching
   */
  stop() {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.watchInterval = null;
    }
    this.fileTimestamps.clear();
    this.watchPath = null;
    this.isWatching = false;
    this.logger.info("File watcher stopped");
  }
  /**
   * Get all files in directory recursively
   */
  getAllFiles(dirPath) {
    const files = [];
    const scanDir = (currentPath) => {
      try {
        const entries = fs9.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path10.join(currentPath, entry.name);
          if (entry.name.startsWith(".")) {
            continue;
          }
          if (entry.isDirectory() && this.options.recursive) {
            scanDir(fullPath);
          } else if (entry.isFile()) {
            if (this.options.fileFilter(fullPath)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        this.logger.error(`Error scanning directory ${currentPath}:`, error);
      }
    };
    scanDir(dirPath);
    return files;
  }
  /**
   * Initial directory scan
   */
  async scanDirectory() {
    if (!this.watchPath) return;
    const files = this.getAllFiles(this.watchPath);
    for (const filePath of files) {
      try {
        const stats = fs9.statSync(filePath);
        this.fileTimestamps.set(filePath, stats.mtimeMs);
      } catch (error) {
        this.logger.error(`Error getting stats for ${filePath}:`, error);
      }
    }
    this.logger.info(`Initial scan complete: ${this.fileTimestamps.size} files`);
  }
  /**
   * Check for file changes
   */
  async checkForChanges() {
    if (!this.watchPath) return;
    const currentFiles = this.getAllFiles(this.watchPath);
    const currentFilesSet = new Set(currentFiles);
    const previousFilesSet = new Set(this.fileTimestamps.keys());
    for (const filePath of previousFilesSet) {
      if (!currentFilesSet.has(filePath)) {
        this.fileTimestamps.delete(filePath);
        const change = {
          type: "deleted",
          filePath,
          relativePath: path10.relative(this.watchPath, filePath)
        };
        this.emit("change", change);
        this.logger.debug(`File deleted: ${filePath}`);
      }
    }
    for (const filePath of currentFiles) {
      try {
        const stats = fs9.statSync(filePath);
        const previousMtime = this.fileTimestamps.get(filePath);
        if (!previousMtime) {
          this.fileTimestamps.set(filePath, stats.mtimeMs);
          const change = {
            type: "added",
            filePath,
            relativePath: path10.relative(this.watchPath, filePath),
            mtime: stats.mtime
          };
          this.emit("change", change);
          this.logger.debug(`File added: ${filePath}`);
        } else if (stats.mtimeMs > previousMtime) {
          this.fileTimestamps.set(filePath, stats.mtimeMs);
          const change = {
            type: "modified",
            filePath,
            relativePath: path10.relative(this.watchPath, filePath),
            mtime: stats.mtime
          };
          this.emit("change", change);
          this.logger.debug(`File modified: ${filePath}`);
        }
      } catch (error) {
        this.logger.error(`Error checking file ${filePath}:`, error);
      }
    }
  }
  /**
   * Check if watcher is running
   */
  isRunning() {
    return this.isWatching;
  }
  /**
   * Get watched path
   */
  getWatchPath() {
    return this.watchPath;
  }
};

// packages/tiny-brain-dashboard/server/services/file-watcher.service.ts
var FileWatcher = class {
  constructor(context, sse) {
    this.context = context;
    this.sse = sse;
    this.repoConfigService = new RepoConfigService(context);
  }
  // Map of repoId -> watchers for that repo
  repoWatchers = /* @__PURE__ */ new Map();
  // Watcher for repos.json to detect new repo registrations
  reposConfigWatcher = null;
  // Cache for plans per repo: Map<repoId, Map<prdId, plan>>
  plansCache = /* @__PURE__ */ new Map();
  // Cache for fixes per repo: Map<repoId, fixes>
  fixesCache = /* @__PURE__ */ new Map();
  // RepoConfigService instance
  repoConfigService;
  // Track if running
  running = false;
  async start() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.context.logger.info("[FileWatcher] Starting multi-repo file watcher...");
    try {
      const repos = await this.repoConfigService.listRepos();
      this.context.logger.info(`[FileWatcher] Found ${repos.length} registered repos`);
      for (const repo of repos) {
        await this.startRepoWatchers(repo);
      }
    } catch (error) {
      this.context.logger.warn("[FileWatcher] Failed to get repos list, will watch for registration:", error);
    }
    await this.startReposConfigWatcher();
  }
  /**
   * Start watchers for a single repo's progress and fixes directories
   */
  async startRepoWatchers(repo) {
    const repoId = repo.id;
    const repoPath = repo.path;
    this.context.logger.info(`[FileWatcher] Setting up watchers for repo: ${repoId} at ${repoPath}`);
    if (this.repoWatchers.has(repoId)) {
      this.context.logger.info(`[FileWatcher] Already watching repo: ${repoId}`);
      return;
    }
    const watchers = {
      prdWatcher: null,
      fixesWatcher: null,
      repoId,
      repoPath
    };
    if (!this.plansCache.has(repoId)) {
      this.plansCache.set(repoId, /* @__PURE__ */ new Map());
    }
    const prdPath = path11.join(repoPath, ".tiny-brain/progress");
    this.context.logger.info(`[FileWatcher] Checking PRD path: ${prdPath} exists: ${fs10.existsSync(prdPath)}`);
    if (fs10.existsSync(prdPath)) {
      try {
        watchers.prdWatcher = new FileWatcherService(this.context.logger);
        watchers.prdWatcher.on("change", (change) => {
          this.context.logger.info(`[FileWatcher] PRD change detected in ${repoId}: ${change.type} ${change.relativePath}`);
          this.handleFileChange(repoId, change);
        });
        await watchers.prdWatcher.start(prdPath, {
          pollInterval: 1e3,
          recursive: false,
          fileFilter: (filePath) => filePath.endsWith(".json")
        });
        this.context.logger.info(`[FileWatcher] PRD watcher started for repo ${repoId}: ${prdPath}`);
      } catch (error) {
        this.context.logger.error(`[FileWatcher] Failed to start PRD watcher for ${repoId}:`, error);
      }
    }
    const fixesPath = path11.join(repoPath, ".tiny-brain/fixes");
    this.context.logger.info(`[FileWatcher] Checking fixes path: ${fixesPath} exists: ${fs10.existsSync(fixesPath)}`);
    if (fs10.existsSync(fixesPath)) {
      try {
        watchers.fixesWatcher = new FileWatcherService(this.context.logger);
        watchers.fixesWatcher.on("change", (change) => {
          this.context.logger.info(`[FileWatcher] Fixes change detected in ${repoId}: ${change.type} ${change.relativePath}`);
          this.handleFixesChange(repoId, change);
        });
        await watchers.fixesWatcher.start(fixesPath, {
          pollInterval: 1e3,
          recursive: false,
          fileFilter: (filePath) => filePath.endsWith("progress.json")
        });
        this.context.logger.info(`[FileWatcher] Fixes watcher started for repo ${repoId}: ${fixesPath}`);
      } catch (error) {
        this.context.logger.error(`[FileWatcher] Failed to start fixes watcher for ${repoId}:`, error);
      }
    }
    this.repoWatchers.set(repoId, watchers);
    this.context.logger.info(`[FileWatcher] Repo watchers setup complete for: ${repoId}`);
  }
  /**
   * Start watching ~/.tiny-brain/repos/repos.json for new repo registrations
   */
  async startReposConfigWatcher() {
    const reposDir = path11.join(os.homedir(), ".tiny-brain", "repos");
    if (!fs10.existsSync(reposDir)) {
      this.context.logger.info(`[FileWatcher] Repos config directory does not exist: ${reposDir}`);
      return;
    }
    this.reposConfigWatcher = new FileWatcherService(this.context.logger);
    this.reposConfigWatcher.on("change", async (change) => {
      if (change.relativePath.endsWith("repos.json")) {
        this.context.logger.info("[FileWatcher] Detected repos.json change, checking for new repos...");
        await this.handleReposConfigChange();
      }
    });
    await this.reposConfigWatcher.start(reposDir, {
      pollInterval: 2e3,
      // Check less frequently for config changes
      recursive: false,
      fileFilter: (filePath) => filePath.endsWith("repos.json")
    });
    this.context.logger.info(`[FileWatcher] Repos config watcher started for: ${reposDir}`);
  }
  /**
   * Handle repos.json change - start watchers for any new repos
   */
  async handleReposConfigChange() {
    try {
      const repos = await this.repoConfigService.listRepos();
      for (const repo of repos) {
        if (!this.repoWatchers.has(repo.id)) {
          this.context.logger.info(`[FileWatcher] New repo registered: ${repo.id} (${repo.path})`);
          await this.startRepoWatchers(repo);
          await this.sse.broadcast("repo-registered", {
            repoId: repo.id,
            repoPath: repo.path,
            repoName: repo.name,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
    } catch (error) {
      this.context.logger.error("[FileWatcher] Error handling repos config change:", error);
    }
  }
  async stop() {
    for (const [repoId, watchers] of this.repoWatchers) {
      if (watchers.prdWatcher) {
        watchers.prdWatcher.stop();
      }
      if (watchers.fixesWatcher) {
        watchers.fixesWatcher.stop();
      }
      this.context.logger.info(`[FileWatcher] Stopped watchers for repo: ${repoId}`);
    }
    this.repoWatchers.clear();
    if (this.reposConfigWatcher) {
      this.reposConfigWatcher.stop();
      this.reposConfigWatcher = null;
    }
    this.plansCache.clear();
    this.fixesCache.clear();
    this.running = false;
  }
  isRunning() {
    return this.running;
  }
  async handleFileChange(repoId, change) {
    try {
      this.context.logger.info(`[FileWatcher] Detected file change in repo ${repoId}: ${change.type} - ${change.relativePath}`);
      const connectionCount = this.sse.getConnectionCount();
      this.context.logger.info(`[FileWatcher] SSE connections: ${connectionCount}`);
      if (connectionCount === 0) {
        this.context.logger.info(`[FileWatcher] No SSE clients connected - skipping file processing`);
        return;
      }
      const fileName = path11.basename(change.relativePath);
      this.context.logger.debug(`[FileWatcher] File name:`, fileName);
      if (!fileName.endsWith(".json")) {
        this.context.logger.debug(`[FileWatcher] Not a valid progress file - skipping`);
        return;
      }
      const prdId = fileName.replace(/\.json$/, "");
      this.context.logger.info(`[FileWatcher] Processing PRD change for: ${prdId} in repo: ${repoId}`);
      await this.handleProgressChange(repoId, prdId, change);
    } catch (error) {
      this.context.logger.error("Error handling file change:", error);
    }
  }
  async handleProgressChange(repoId, prdId, change) {
    try {
      this.context.logger.info(`[FileWatcher] handleProgressChange called for PRD: ${prdId} in repo: ${repoId}`);
      let repoCache = this.plansCache.get(repoId);
      if (!repoCache) {
        repoCache = /* @__PURE__ */ new Map();
        this.plansCache.set(repoId, repoCache);
      }
      if (change.type === "deleted") {
        repoCache.delete(prdId);
        this.context.logger.info(`[FileWatcher] Broadcasting SSE event: removed for PRD: ${prdId}`);
        await this.sse.broadcast("plan-change", {
          type: "removed",
          repoId,
          prdId,
          plan: null
        });
        return;
      }
      let newPlan;
      try {
        this.context.logger.debug(`[FileWatcher] Reading file: ${change.filePath}`);
        const content = await fs10.promises.readFile(change.filePath, "utf-8");
        newPlan = JSON.parse(content);
      } catch (error) {
        this.context.logger.error(`Error reading progress file ${change.filePath}:`, error);
        return;
      }
      const oldPlan = repoCache.get(prdId);
      const isNew = !oldPlan;
      if (isNew) {
        this.context.logger.info(`[FileWatcher] New PRD detected: ${prdId} in repo: ${repoId}`);
        repoCache.set(prdId, newPlan);
        await this.sse.broadcast("plan-change", {
          eventType: "prd:created",
          repoId,
          prdId: newPlan.id,
          prdPath: newPlan.prdDirPath || `docs/prd/${prdId}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          plan: newPlan
        });
        this.context.logger.info(`[FileWatcher] \u2705 Broadcast prd:created for: ${prdId} in repo: ${repoId}`);
        return;
      }
      const events = this.diffPlans(repoId, oldPlan, newPlan);
      this.context.logger.info(`[FileWatcher] Detected ${events.length} granular changes in PRD: ${prdId}`);
      repoCache.set(prdId, newPlan);
      for (const event of events) {
        this.context.logger.debug(`[FileWatcher] Broadcasting ${event.eventType} for PRD: ${prdId}`);
        await this.sse.broadcast("plan-change", event);
      }
      this.context.logger.info(`[FileWatcher] \u2705 Successfully broadcast ${events.length} events for PRD: ${prdId} in repo: ${repoId}`);
    } catch (error) {
      this.context.logger.error("Error handling progress change:", error);
    }
  }
  /**
   * Diff old and new plan to generate granular PRDChangeEvents
   * Detects task and feature updates
   */
  diffPlans(repoId, oldPlan, newPlan) {
    const events = [];
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const prdPath = newPlan.prdDirPath || `docs/prd/${newPlan.id}`;
    const oldFeatures = oldPlan.features || [];
    const newFeatures = newPlan.features || [];
    for (const newFeature of newFeatures) {
      const oldFeature = oldFeatures.find((f) => f.id === newFeature.id);
      if (!oldFeature) {
        events.push({
          eventType: "prd:feature:added",
          repoId,
          prdId: newPlan.id,
          prdPath,
          timestamp,
          feature: {
            id: newFeature.id,
            number: newFeature.number,
            title: newFeature.title,
            status: newFeature.status
          }
        });
        continue;
      }
      if (oldFeature.status !== newFeature.status) {
        events.push({
          eventType: "prd:feature:updated",
          repoId,
          prdId: newPlan.id,
          prdPath,
          timestamp,
          feature: {
            id: newFeature.id,
            number: newFeature.number,
            title: newFeature.title,
            status: newFeature.status
          },
          delta: {
            statusChanged: true,
            oldStatus: oldFeature.status,
            newStatus: newFeature.status
          }
        });
      }
      const oldTasks = oldFeature.tasks || [];
      const newTasks = newFeature.tasks || [];
      for (const newTask of newTasks) {
        const oldTask = oldTasks.find((t) => t.id === newTask.id);
        if (!oldTask) {
          events.push({
            eventType: "prd:feature:tasks:added",
            repoId,
            prdId: newPlan.id,
            prdPath,
            timestamp,
            feature: {
              id: newFeature.id,
              number: newFeature.number,
              title: newFeature.title,
              status: newFeature.status
            },
            tasks: [{
              id: newTask.id,
              description: newTask.description,
              status: newTask.status
            }],
            delta: {
              tasksAdded: 1
            }
          });
          continue;
        }
        const taskChanged = oldTask.status !== newTask.status || oldTask.commitSha !== newTask.commitSha || oldTask.testCommitSha !== newTask.testCommitSha || oldTask.refactorCommitSha !== newTask.refactorCommitSha;
        if (taskChanged) {
          if (oldTask.status !== "completed" && newTask.status === "completed") {
            events.push({
              eventType: "prd:feature:task:completed",
              repoId,
              prdId: newPlan.id,
              prdPath,
              timestamp,
              feature: {
                id: newFeature.id,
                number: newFeature.number,
                title: newFeature.title,
                status: newFeature.status
              },
              task: {
                id: newTask.id,
                description: newTask.description,
                status: newTask.status,
                testCommitSha: newTask.testCommitSha,
                commitSha: newTask.commitSha,
                refactorCommitSha: newTask.refactorCommitSha,
                testCommittedAt: newTask.testCommittedAt,
                committedAt: newTask.committedAt,
                refactorCommittedAt: newTask.refactorCommittedAt
              },
              delta: {
                tasksCompleted: 1,
                statusChanged: true,
                oldStatus: oldTask.status,
                newStatus: newTask.status
              }
            });
          } else {
            events.push({
              eventType: "prd:feature:task:updated",
              repoId,
              prdId: newPlan.id,
              prdPath,
              timestamp,
              feature: {
                id: newFeature.id,
                number: newFeature.number,
                title: newFeature.title,
                status: newFeature.status
              },
              task: {
                id: newTask.id,
                description: newTask.description,
                status: newTask.status,
                testCommitSha: newTask.testCommitSha,
                commitSha: newTask.commitSha,
                refactorCommitSha: newTask.refactorCommitSha,
                testCommittedAt: newTask.testCommittedAt,
                committedAt: newTask.committedAt,
                refactorCommittedAt: newTask.refactorCommittedAt
              },
              delta: {
                statusChanged: oldTask.status !== newTask.status,
                oldStatus: oldTask.status,
                newStatus: newTask.status
              }
            });
          }
        }
      }
    }
    return events;
  }
  /**
   * Handle changes to the fixes progress.json file
   */
  async handleFixesChange(repoId, change) {
    try {
      this.context.logger.info(`[FileWatcher] Detected fixes change in repo ${repoId}: ${change.type} - ${change.relativePath}`);
      const connectionCount = this.sse.getConnectionCount();
      if (connectionCount === 0) {
        this.context.logger.info(`[FileWatcher] No SSE clients connected - skipping fixes processing`);
        return;
      }
      if (!change.relativePath.endsWith("progress.json")) {
        return;
      }
      if (change.type === "deleted") {
        this.fixesCache.delete(repoId);
        await this.sse.broadcast("fix-change", {
          eventType: "fixes:cleared",
          repoId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        return;
      }
      let newFixes;
      try {
        const content = await fs10.promises.readFile(change.filePath, "utf-8");
        newFixes = JSON.parse(content);
      } catch (error) {
        this.context.logger.error(`Error reading fixes progress file ${change.filePath}:`, error);
        return;
      }
      const oldFixes = this.fixesCache.get(repoId);
      this.fixesCache.set(repoId, newFixes);
      const events = this.diffFixes(repoId, oldFixes, newFixes);
      for (const event of events) {
        this.context.logger.debug(`[FileWatcher] Broadcasting ${event.eventType} for fix: ${event.fixId}`);
        await this.sse.broadcast("fix-change", event);
      }
      this.context.logger.info(`[FileWatcher] \u2705 Successfully broadcast ${events.length} fix events for repo: ${repoId}`);
    } catch (error) {
      this.context.logger.error("Error handling fixes change:", error);
    }
  }
  /**
   * Diff old and new fixes to generate granular events
   */
  diffFixes(repoId, oldData, newData) {
    const events = [];
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const oldFixes = oldData?.fixes || [];
    const newFixes = newData?.fixes || [];
    for (const newFix of newFixes) {
      const oldFix = oldFixes.find((f) => f.id === newFix.id);
      if (!oldFix) {
        events.push({
          eventType: "fix:created",
          repoId,
          fixId: newFix.id,
          timestamp,
          fix: newFix
        });
        continue;
      }
      if (oldFix.status !== newFix.status) {
        events.push({
          eventType: "fix:updated",
          repoId,
          fixId: newFix.id,
          timestamp,
          fix: newFix,
          delta: {
            statusChanged: true,
            oldStatus: oldFix.status,
            newStatus: newFix.status
          }
        });
      }
      const oldTasks = oldFix.tasks || [];
      const newTasks = newFix.tasks || [];
      for (const newTask of newTasks) {
        const oldTask = oldTasks.find((t) => t.id === newTask.id);
        if (!oldTask) {
          events.push({
            eventType: "fix:task:added",
            repoId,
            fixId: newFix.id,
            timestamp,
            task: newTask
          });
          continue;
        }
        const taskChanged = oldTask.status !== newTask.status || oldTask.commitSha !== newTask.commitSha || oldTask.testCommitSha !== newTask.testCommitSha || oldTask.refactorCommitSha !== newTask.refactorCommitSha;
        if (taskChanged) {
          if (oldTask.status !== "completed" && newTask.status === "completed") {
            events.push({
              eventType: "fix:task:completed",
              repoId,
              fixId: newFix.id,
              timestamp,
              task: newTask
            });
          } else {
            events.push({
              eventType: "fix:task:updated",
              repoId,
              fixId: newFix.id,
              timestamp,
              task: newTask,
              delta: {
                statusChanged: oldTask.status !== newTask.status,
                oldStatus: oldTask.status,
                newStatus: newTask.status
              }
            });
          }
        }
      }
    }
    return events;
  }
};

// packages/tiny-brain-dashboard/server/index.ts
var DashboardServer = class {
  constructor(context) {
    this.context = context;
    this.sse = new SSEService();
    this.watcher = new FileWatcher(this.context, this.sse);
    this.app = createApp(this.context, this.sse);
    if ("personaChangeListeners" in this.context) {
      const listener = (personaId) => {
        this.context.logger.info(`Dashboard notified of persona change to: ${personaId}`);
        this.sse.broadcast("persona-changed", {
          personaId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      };
      this.context.personaChangeListeners.push(listener);
    }
    if (!("planChangeListeners" in this.context)) {
      this.context.planChangeListeners = [];
    }
    const planChangeListener = (event) => {
      this.context.logger.info(`Dashboard notified of PRD change: ${event.prdId} (${event.eventType})`);
      this.sse.broadcast("plan-change", event);
    };
    this.context.planChangeListeners.push(planChangeListener);
  }
  server = null;
  app;
  sse;
  watcher;
  port = 0;
  async start(port = 8765) {
    if (this.isRunning()) {
      throw new Error("Dashboard server is already running");
    }
    this.port = port;
    this.server = serve({
      fetch: this.app.fetch,
      port: this.port
    });
    return new Promise((resolve2, reject) => {
      let errorHandled = false;
      const errorHandler2 = (error) => {
        if (errorHandled) return;
        errorHandled = true;
        if (error?.code === "EADDRINUSE") {
          this.context.logger.info(`Dashboard already running on port ${this.port}`);
          this.server = null;
          resolve2({
            url: `http://localhost:${this.port}`,
            port: this.port
          });
        } else {
          reject(error);
        }
      };
      if (this.server) {
        this.server.on("error", errorHandler2);
      }
      setTimeout(async () => {
        if (errorHandled) return;
        try {
          await this.watcher.start();
        } catch (error) {
          this.context.logger.warn("Failed to start file watcher, dashboard will run without real-time updates:", error);
        }
        resolve2({
          url: `http://localhost:${this.port}`,
          port: this.port
        });
      }, 100);
    });
  }
  async stop() {
    if (!this.isRunning()) {
      return;
    }
    await this.watcher.stop();
    this.sse.closeAll();
    if (this.server) {
      return new Promise((resolve2) => {
        const timeout = setTimeout(() => {
          this.context.logger.warn("Server close timed out after 5s, forcing cleanup");
          this.server = null;
          this.port = 0;
          resolve2();
        }, 5e3);
        this.server.close(() => {
          clearTimeout(timeout);
          this.server = null;
          this.port = 0;
          resolve2();
        });
      });
    }
  }
  isRunning() {
    return this.server !== null && this.port > 0;
  }
};
export {
  DashboardServer
};
//# sourceMappingURL=index.js.map
