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
    function balanced(a, b, str2) {
      if (a instanceof RegExp) a = maybeMatch(a, str2);
      if (b instanceof RegExp) b = maybeMatch(b, str2);
      var r = range(a, b, str2);
      return r && {
        start: r[0],
        end: r[1],
        pre: str2.slice(0, r[0]),
        body: str2.slice(r[0] + a.length, r[1]),
        post: str2.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str2) {
      var m = str2.match(reg);
      return m ? m[0] : null;
    }
    balanced.range = range;
    function range(a, b, str2) {
      var begs, beg, left, right, result;
      var ai = str2.indexOf(a);
      var bi = str2.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        if (a === b) {
          return [ai, bi];
        }
        begs = [];
        left = str2.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str2.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str2.indexOf(b, i + 1);
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
    function numeric(str2) {
      return parseInt(str2, 10) == str2 ? parseInt(str2, 10) : str2.charCodeAt(0);
    }
    function escapeBraces(str2) {
      return str2.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str2) {
      return str2.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str2) {
      if (!str2)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str2);
      if (!m)
        return str2.split(",");
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
    function expandTop(str2) {
      if (!str2)
        return [];
      if (str2.substr(0, 2) === "{}") {
        str2 = "\\{\\}" + str2.substr(2);
      }
      return expand2(escapeBraces(str2), true).map(unescapeBraces);
    }
    function embrace(str2) {
      return "{" + str2 + "}";
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
    function expand2(str2, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str2);
      if (!m) return [str2];
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
            str2 = m.pre + "{" + m.body + escClose + m.post;
            return expand2(str2);
          }
          return [str2];
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
import crypto2 from "crypto";
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
function writeFromReadableStream(stream3, writable) {
  if (stream3.locked) {
    throw new TypeError("ReadableStream is locked.");
  } else if (writable.destroyed) {
    return;
  }
  return writeFromReadableStreamDefaultReader(stream3.getReader(), writable);
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
  global.crypto = crypto2;
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
            await new Promise((resolve3) => setTimeout(resolve3));
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
var splitPath = (path17) => {
  const paths = path17.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path: path17 } = extractGroupsFromPath(routePath);
  const paths = splitPath(path17);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path17) => {
  const groups = [];
  path17 = path17.replace(/\{[^}]+\}/g, (match3, index) => {
    const mark = `@${index}`;
    groups.push([mark, match3]);
    return mark;
  });
  return { groups, path: path17 };
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
var tryDecode = (str2, decoder) => {
  try {
    return decoder(str2);
  } catch {
    return str2.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match3) => {
      try {
        return decoder(match3);
      } catch {
        return match3;
      }
    });
  }
};
var tryDecodeURI = (str2) => tryDecode(str2, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path17 = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path17.includes("%25") ? path17.replace(/%25/g, "%2525") : path17);
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
var checkOptionalParameter = (path17) => {
  if (path17.charCodeAt(path17.length - 1) !== 63 || !path17.includes(":")) {
    return null;
  }
  const segments = path17.split("/");
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
var tryDecodeURIComponent = (str2) => tryDecode(str2, decodeURIComponent_);
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
  constructor(request, path17 = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path17;
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
var resolveCallback = async (str2, phase, preserveCallbacks, context, buffer) => {
  if (typeof str2 === "object" && !(str2 instanceof String)) {
    if (!(str2 instanceof Promise)) {
      str2 = str2.toString();
    }
    if (str2 instanceof Promise) {
      str2 = await str2;
    }
  }
  const callbacks = str2.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str2);
  }
  if (buffer) {
    buffer[0] += str2;
  } else {
    buffer = [str2];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str22) => resolveCallback(str22, phase, false, context, buffer))
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
    this.on = (method, path17, ...handlers) => {
      for (const p of [path17].flat()) {
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
  route(path17, app) {
    const subApp = this.basePath(path17);
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
  basePath(path17) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path17);
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
  mount(path17, applicationHandler, options) {
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
      const mergedPath = mergePath(this._basePath, path17);
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
    this.#addRoute(METHOD_NAME_ALL, mergePath(path17, "*"), handler);
    return this;
  }
  #addRoute(method, path17, handler) {
    method = method.toUpperCase();
    path17 = mergePath(this._basePath, path17);
    const r = { basePath: this._basePath, path: path17, method, handler };
    this.router.add(method, path17, [handler, r]);
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
    const path17 = this.getPath(request, { env });
    const matchResult = this.router.match(method, path17);
    const c = new Context(request, {
      path: path17,
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
function match(method, path17) {
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
  return match22(method, path17);
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
  insert(path17, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path17 = path17.replace(/\{[^}]+\}/g, (m) => {
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
    const tokens = path17.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
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
function buildWildcardRegExp(path17) {
  return wildcardRegExpCache[path17] ??= new RegExp(
    path17 === "*" ? "" : `^${path17.replace(
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
    const [pathErrorCheckOnly, path17, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path17] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path17, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path17) : e;
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
      const map2 = handlerData[i][j]?.[1];
      if (!map2) {
        continue;
      }
      const keys = Object.keys(map2);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map2[keys[k]] = paramReplacementMap[map2[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path17) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path17)) {
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
  add(method, path17, handler) {
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
    if (path17 === "/*") {
      path17 = "*";
    }
    const paramCount = (path17.match(/\/:/g) || []).length;
    if (/\*$/.test(path17)) {
      const re = buildWildcardRegExp(path17);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path17] ||= findMiddleware(middleware[m], path17) || findMiddleware(middleware[METHOD_NAME_ALL], path17) || [];
        });
      } else {
        middleware[method][path17] ||= findMiddleware(middleware[method], path17) || findMiddleware(middleware[METHOD_NAME_ALL], path17) || [];
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
    const paths = checkOptionalParameter(path17) || [path17];
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
      const ownRoute = r[method] ? Object.keys(r[method]).map((path17) => [path17, r[method][path17]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path17) => [path17, r[METHOD_NAME_ALL][path17]])
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
  add(method, path17, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path17, handler]);
  }
  match(method, path17) {
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
        res = router.match(method, path17);
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
  insert(method, path17, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path17);
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
  search(method, path17) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path17);
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
  add(method, path17, handler) {
    const results = checkOptionalParameter(path17);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path17, handler);
  }
  match(method, path17) {
    return this.#node.search(method, path17);
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
    function set2(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set2("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set2("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set2("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set2("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set2("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set2("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set2("Access-Control-Allow-Headers", headers.join(","));
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
var createStreamBody = (stream3) => {
  const body = new ReadableStream({
    start(controller) {
      stream3.on("data", (chunk2) => {
        controller.enqueue(chunk2);
      });
      stream3.on("error", (err) => {
        controller.error(err);
      });
      stream3.on("end", () => {
        controller.close();
      });
    },
    cancel() {
      stream3.destroy();
    }
  });
  return body;
};
var getStats = (path17) => {
  let stats;
  try {
    stats = statSync(path17);
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
    let path17 = join(
      root,
      !optionPath && options.rewriteRequestPath ? options.rewriteRequestPath(filename, c) : filename
    );
    let stats = getStats(path17);
    if (stats && stats.isDirectory()) {
      const indexFile = options.index ?? "index.html";
      path17 = join(path17, indexFile);
      stats = getStats(path17);
    }
    if (!stats) {
      await options.onNotFound?.(path17, c);
      return next();
    }
    const mimeType = getMimeType(path17);
    c.header("Content-Type", mimeType || "application/octet-stream");
    if (options.precompressed && (!mimeType || COMPRESSIBLE_CONTENT_TYPE_REGEX.test(mimeType))) {
      const acceptEncodingSet = new Set(
        c.req.header("Accept-Encoding")?.split(",").map((encoding) => encoding.trim())
      );
      for (const encoding of ENCODINGS_ORDERED_KEYS) {
        if (!acceptEncodingSet.has(encoding)) {
          continue;
        }
        const precompressedStats = getStats(path17 + ENCODINGS[encoding]);
        if (precompressedStats) {
          c.header("Content-Encoding", encoding);
          c.header("Vary", "Accept-Encoding", { append: true });
          stats = precompressedStats;
          path17 = path17 + ENCODINGS[encoding];
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
      result = c.body(createStreamBody(createReadStream(path17)), 200);
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
      const stream3 = createReadStream(path17, { start, end });
      c.header("Content-Length", chunksize.toString());
      c.header("Content-Range", `bytes ${start}-${end}/${stats.size}`);
      result = c.body(createStreamBody(stream3), 206);
    }
    await options.onFound?.(path17, c);
    return result;
  };
};

// packages/tiny-brain-dashboard/server/app.ts
import path14 from "node:path";
import { fileURLToPath as fileURLToPath3 } from "node:url";
import fs12 from "node:fs";

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
  const json2 = JSON.stringify(obj, null, 2);
  return json2.replace(/"([^"]+)":/g, "$1:");
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
function setErrorMap(map2) {
  overrideErrorMap = map2;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path: path17, errorMaps, issueData } = params;
  const fullPath = [...path17, ...issueData.path || []];
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
  for (const map2 of maps) {
    errorMessage = map2(fullIssue, { data, defaultError: errorMessage }).message;
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
  static async mergeObjectAsync(status, pairs2) {
    const syncPairs = [];
    for (const pair of pairs2) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs2) {
    const finalObject = {};
    for (const pair of pairs2) {
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
  constructor(parent, value, path17, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path17;
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
ZodArray.create = (schema2, params) => {
  return new ZodArray({
    type: schema2,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema2) {
  if (schema2 instanceof ZodObject) {
    const newShape = {};
    for (const key in schema2.shape) {
      const fieldSchema = schema2.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema2._def,
      shape: () => newShape
    });
  } else if (schema2 instanceof ZodArray) {
    return new ZodArray({
      ...schema2._def,
      type: deepPartialify(schema2.element)
    });
  } else if (schema2 instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema2.unwrap()));
  } else if (schema2 instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema2.unwrap()));
  } else if (schema2 instanceof ZodTuple) {
    return ZodTuple.create(schema2.items.map((item) => deepPartialify(item)));
  } else {
    return schema2;
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
    const pairs2 = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs2.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs2.push({
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
        pairs2.push({
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
        for (const pair of pairs2) {
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
      return ParseStatus.mergeObjectSync(status, pairs2);
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
  setKey(key, schema2) {
    return this.augment({ [key]: schema2 });
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
ZodUnion.create = (types3, params) => {
  return new ZodUnion({
    options: types3,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type2) => {
  if (type2 instanceof ZodLazy) {
    return getDiscriminator(type2.schema);
  } else if (type2 instanceof ZodEffects) {
    return getDiscriminator(type2.innerType());
  } else if (type2 instanceof ZodLiteral) {
    return [type2.value];
  } else if (type2 instanceof ZodEnum) {
    return type2.options;
  } else if (type2 instanceof ZodNativeEnum) {
    return util.objectValues(type2.enum);
  } else if (type2 instanceof ZodDefault) {
    return getDiscriminator(type2._def.innerType);
  } else if (type2 instanceof ZodUndefined) {
    return [void 0];
  } else if (type2 instanceof ZodNull) {
    return [null];
  } else if (type2 instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type2.unwrap())];
  } else if (type2 instanceof ZodNullable) {
    return [null, ...getDiscriminator(type2.unwrap())];
  } else if (type2 instanceof ZodBranded) {
    return getDiscriminator(type2.unwrap());
  } else if (type2 instanceof ZodReadonly) {
    return getDiscriminator(type2.unwrap());
  } else if (type2 instanceof ZodCatch) {
    return getDiscriminator(type2._def.innerType);
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
    for (const type2 of options) {
      const discriminatorValues = getDiscriminator(type2.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type2);
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
      const schema2 = this._def.items[itemIndex] || this._def.rest;
      if (!schema2)
        return null;
      return schema2._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
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
    const pairs2 = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs2.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs2);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs2);
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
    const pairs2 = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs2) {
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
      for (const pair of pairs2) {
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
ZodPromise.create = (schema2, params) => {
  return new ZodPromise({
    type: schema2,
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
ZodEffects.create = (schema2, effect, params) => {
  return new ZodEffects({
    schema: schema2,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema2, params) => {
  return new ZodEffects({
    schema: schema2,
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
ZodOptional.create = (type2, params) => {
  return new ZodOptional({
    innerType: type2,
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
ZodNullable.create = (type2, params) => {
  return new ZodNullable({
    innerType: type2,
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
ZodDefault.create = (type2, params) => {
  return new ZodDefault({
    innerType: type2,
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
ZodCatch.create = (type2, params) => {
  return new ZodCatch({
    innerType: type2,
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
ZodReadonly.create = (type2, params) => {
  return new ZodReadonly({
    innerType: type2,
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
  constructor(type2, parent, options = {}) {
    this.type = type2;
    if (type2)
      this.#hasMagic = true;
    this.#parent = parent;
    this.#root = this.#parent ? this.#parent.#root : this;
    this.#options = this.#root === this ? options : this.#root.#options;
    this.#negs = this.#root === this ? [] : this.#root.#negs;
    if (type2 === "!" && !this.#root.#filledNegs)
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
  static #parseAST(str2, ast, pos, opt) {
    let escaping = false;
    let inBrace = false;
    let braceStart = -1;
    let braceNeg = false;
    if (ast.type === null) {
      let i2 = pos;
      let acc2 = "";
      while (i2 < str2.length) {
        const c = str2.charAt(i2++);
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
        if (!opt.noext && isExtglobType(c) && str2.charAt(i2) === "(") {
          ast.push(acc2);
          acc2 = "";
          const ext2 = new _AST(c, ast);
          i2 = _AST.#parseAST(str2, ext2, i2, opt);
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
    while (i < str2.length) {
      const c = str2.charAt(i++);
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
      if (isExtglobType(c) && str2.charAt(i) === "(") {
        part.push(acc);
        acc = "";
        const ext2 = new _AST(c, part);
        part.push(ext2);
        i = _AST.#parseAST(str2, ext2, i, opt);
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
    ast.#parts = [str2.substring(pos - 1)];
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
      constructor(type2, parent, options = {}) {
        super(type2, parent, ext(def, options));
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
    let set2 = this.globParts.map((s, _, __) => {
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
    this.debug(this.pattern, set2);
    this.set = set2.filter((s) => s.indexOf(false) === -1);
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
      parts = parts.reduce((set2, part) => {
        const prev = set2[set2.length - 1];
        if (part === "**" && prev === "**") {
          return set2;
        }
        if (part === "..") {
          if (prev && prev !== ".." && prev !== "." && prev !== "**") {
            set2.pop();
            return set2;
          }
        }
        set2.push(part);
        return set2;
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
    const set2 = this.set;
    if (!set2.length) {
      this.regexp = false;
      return this.regexp;
    }
    const options = this.options;
    const twoStar = options.noglobstar ? star2 : options.dot ? twoStarDot : twoStarNoDot;
    const flags = new Set(options.nocase ? ["i"] : []);
    let re = set2.map((pattern) => {
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
    const [open, close] = set2.length > 1 ? ["(?:", ")"] : ["", ""];
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
    const set2 = this.set;
    this.debug(this.pattern, "set", set2);
    let filename = ff[ff.length - 1];
    if (!filename) {
      for (let i = ff.length - 2; !filename && i >= 0; i--) {
        filename = ff[i];
      }
    }
    for (let i = 0; i < set2.length; i++) {
      const pattern = set2[i];
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
var emitWarning = (msg, type2, code, fn) => {
  typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type2, code, fn) : console.error(`[${code}] ${type2}: ${msg}`);
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
    return new Promise((resolve3, reject) => {
      this.on(DESTROYED, () => reject(new Error("stream destroyed")));
      this.on("error", (er) => reject(er));
      this.on("end", () => resolve3());
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
      let resolve3;
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
        resolve3({ value, done: !!this[EOF] });
      };
      const onend = () => {
        this.off("error", onerr);
        this.off("data", ondata);
        this.off(DESTROYED, ondestroy);
        stop();
        resolve3({ done: true, value: void 0 });
      };
      const ondestroy = () => onerr(new Error("stream destroyed"));
      return new Promise((res2, rej) => {
        reject = rej;
        resolve3 = res2;
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
  constructor(name, type2 = UNKNOWN, root, roots, nocase, children, opts) {
    this.name = name;
    this.#matchName = nocase ? normalizeNocase(name) : normalize(name);
    this.#type = type2 & TYPEMASK;
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
  resolve(path17) {
    if (!path17) {
      return this;
    }
    const rootPath = this.getRootString(path17);
    const dir = path17.substring(rootPath.length);
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
  isType(type2) {
    return this[`is${type2}`]();
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
    const type2 = entToType(e);
    const child = this.newChild(e.name, type2, { parent: this });
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
      let resolve3 = () => {
      };
      this.#asyncReaddirInFlight = new Promise((res) => resolve3 = res);
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
      resolve3();
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
  constructor(name, type2 = UNKNOWN, root, roots, nocase, children, opts) {
    super(name, type2, root, roots, nocase, children, opts);
  }
  /**
   * @internal
   */
  newChild(name, type2 = UNKNOWN, opts = {}) {
    return new _PathWin32(name, type2, this.root, this.roots, this.nocase, this.childrenCache(), opts);
  }
  /**
   * @internal
   */
  getRootString(path17) {
    return win32.parse(path17).root;
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
  constructor(name, type2 = UNKNOWN, root, roots, nocase, children, opts) {
    super(name, type2, root, roots, nocase, children, opts);
  }
  /**
   * @internal
   */
  getRootString(path17) {
    return path17.startsWith("/") ? "/" : "";
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
  newChild(name, type2 = UNKNOWN, opts = {}) {
    return new _PathPosix(name, type2, this.root, this.roots, this.nocase, this.childrenCache(), opts);
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
  constructor(cwd = process.cwd(), pathImpl, sep2, { nocase, childrenCacheSize = 16 * 1024, fs: fs15 = defaultFS } = {}) {
    this.#fs = fsFromOption(fs15);
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
  depth(path17 = this.cwd) {
    if (typeof path17 === "string") {
      path17 = this.cwd.resolve(path17);
    }
    return path17.depth();
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
  chdir(path17 = this.cwd) {
    const oldCwd = this.cwd;
    this.cwd = typeof path17 === "string" ? this.cwd.resolve(path17) : path17;
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
  newRoot(fs15) {
    return new PathWin32(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), { fs: fs15 });
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
  newRoot(fs15) {
    return new PathPosix(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), { fs: fs15 });
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
    return [...this.store.entries()].map(([path17, n]) => [
      path17,
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
  constructor(patterns, path17, opts) {
    this.patterns = patterns;
    this.path = path17;
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
  #ignored(path17) {
    return this.seen.has(path17) || !!this.#ignore?.ignored?.(path17);
  }
  #childrenIgnored(path17) {
    return !!this.#ignore?.childrenIgnored?.(path17);
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
  constructor(patterns, path17, opts) {
    super(patterns, path17, opts);
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
  constructor(patterns, path17, opts) {
    super(patterns, path17, opts);
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
    const [matchSet, globParts] = mms.reduce((set2, m) => {
      set2[0].push(...m.set);
      set2[1].push(...m.globParts);
      return set2;
    }, [[], []]);
    this.patterns = matchSet.map((set2, i) => {
      const g = globParts[i];
      if (!g)
        throw new Error("invalid pattern object");
      return new Pattern(set2, g, 0, this.platform);
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

// node_modules/js-yaml/dist/js-yaml.mjs
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = "", cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
var isNothing_1 = isNothing;
var isObject_1 = isObject;
var toArray_1 = toArray;
var repeat_1 = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1 = extend;
var common = {
  isNothing: isNothing_1,
  isObject: isObject_1,
  toArray: toArray_1,
  repeat: repeat_1,
  isNegativeZero: isNegativeZero_1,
  extend: extend_1
};
function formatError(exception2, compact2) {
  var where = "", message = exception2.reason || "(unknown reason)";
  if (!exception2.mark) return message;
  if (exception2.mark.name) {
    where += 'in "' + exception2.mark.name + '" ';
  }
  where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
  if (!compact2 && exception2.mark.snippet) {
    where += "\n\n" + exception2.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$1(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
YAMLException$1.prototype = Object.create(Error.prototype);
YAMLException$1.prototype.constructor = YAMLException$1;
YAMLException$1.prototype.toString = function toString(compact2) {
  return this.name + ": " + formatError(this, compact2);
};
var exception = YAMLException$1;
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
    pos: position - lineStart + head.length
    // relative position
  };
}
function padStart(string, max) {
  return common.repeat(" ", max - string.length) + string;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== "number") options.indent = 1;
  if (typeof options.linesBefore !== "number") options.linesBefore = 3;
  if (typeof options.linesAfter !== "number") options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match3;
  var foundLineNo = -1;
  while (match3 = re.exec(mark.buffer)) {
    lineEnds.push(match3.index);
    lineStarts.push(match3.index + match3[0].length);
    if (mark.position <= match3.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = "", i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  }
  return result.replace(/\n$/, "");
}
var snippet = makeSnippet;
var TYPE_CONSTRUCTOR_OPTIONS = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
];
var YAML_NODE_KINDS = [
  "scalar",
  "sequence",
  "mapping"
];
function compileStyleAliases(map2) {
  var result = {};
  if (map2 !== null) {
    Object.keys(map2).forEach(function(style) {
      map2[style].forEach(function(alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$1;
function compileList(schema2, name) {
  var result = [];
  schema2[name].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend2(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof type) {
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);
  } else {
    throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  }
  implicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
    if (type$1.loadKind && type$1.loadKind !== "scalar") {
      throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    }
    if (type$1.multi) {
      throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }
  });
  explicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, "implicit");
  result.compiledExplicit = compileList(result, "explicit");
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var str = new type("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(data) {
    return data !== null ? data : "";
  }
});
var seq = new type("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(data) {
    return data !== null ? data : [];
  }
});
var map = new type("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(data) {
    return data !== null ? data : {};
  }
});
var failsafe = new schema({
  explicit: [
    str,
    seq,
    map
  ]
});
function resolveYamlNull(data) {
  if (data === null) return true;
  var max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new type("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === "[object Boolean]";
}
var bool = new type("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function(object) {
      return object ? "true" : "false";
    },
    uppercase: function(object) {
      return object ? "TRUE" : "FALSE";
    },
    camelcase: function(object) {
      return object ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null) return false;
  var max = data.length, index = 0, hasDigits = false, ch;
  if (!max) return false;
  ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max) return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch !== "0" && ch !== "1") return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_") return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === "_") continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_") return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-") sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0") return 0;
  if (ch === "0") {
    if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
    if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
}
var int = new type("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function(obj) {
      return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
    },
    octal: function(obj) {
      return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
    },
    decimal: function(obj) {
      return obj.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(obj) {
      return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, "").toLowerCase();
  sign = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common.isNegativeZero(object)) {
    return "-0.0";
  }
  res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
}
var float = new type("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: "lowercase"
});
var json = failsafe.extend({
  implicit: [
    _null,
    bool,
    int,
    float
  ]
});
var core = json;
var YAML_DATE_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
);
var YAML_TIMESTAMP_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match3, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match3 = YAML_DATE_REGEXP.exec(data);
  if (match3 === null) match3 = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match3 === null) throw new Error("Date resolve error");
  year = +match3[1];
  month = +match3[2] - 1;
  day = +match3[3];
  if (!match3[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match3[4];
  minute = +match3[5];
  second = +match3[6];
  if (match3[7]) {
    fraction = match3[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match3[9]) {
    tz_hour = +match3[10];
    tz_minute = +(match3[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 6e4;
    if (match3[9] === "-") delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object) {
  return object.toISOString();
}
var timestamp = new type("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
var merge = new type("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64) continue;
    if (code < 0) return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
var binary = new type("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]") return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new type("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== "[object Object]") return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new type("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null) return true;
  var key, object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new type("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core.extend({
  implicit: [
    timestamp,
    merge
  ],
  explicit: [
    binary,
    omap,
    pairs,
    set
  ]
});
var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode(
    (c - 65536 >> 10) + 55296,
    (c - 65536 & 1023) + 56320
  );
}
function setProperty(object, key, value) {
  if (key === "__proto__") {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
  } else {
    object[key] = value;
  }
}
var simpleEscapeCheck = new Array(256);
var simpleEscapeMap = new Array(256);
for (i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
var i;
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || _default;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    // omit trailing \0
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name, args) {
    var match3, major, minor;
    if (state.version !== null) {
      throwError(state, "duplication of %YAML directive");
    }
    if (args.length !== 1) {
      throwError(state, "YAML directive accepts exactly one argument");
    }
    match3 = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match3 === null) {
      throwError(state, "ill-formed argument of the YAML directive");
    }
    major = parseInt(match3[1], 10);
    minor = parseInt(match3[2], 10);
    if (major !== 1) {
      throwError(state, "unacceptable YAML version of the document");
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      throwWarning(state, "unsupported YAML version of the document");
    }
  },
  TAG: function handleTagDirective(state, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state, "TAG directive accepts exactly two arguments");
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, "tag prefix is malformed: " + prefix);
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, "the stream contains non-printable characters");
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common.isObject(source)) {
    throwError(state, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      setProperty(destination, key, source[key]);
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, "duplicated mapping key");
    }
    setProperty(_result, keyNode, valueNode);
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position, ch;
  ch = state.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += " ";
  } else if (count > 1) {
    state.result += common.repeat("\n", count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a single quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a double quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line;
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += common.repeat("\n", emptyLines);
      }
    } else {
      state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "sequence";
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state.position += 1;
      ch = following;
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    }
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "mapping";
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33) return false;
  if (state.tag !== null) {
    throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 38) return false;
  if (state.anchor !== null) {
    throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an anchor node must contain at least one character");
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 42) return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an alias node must contain at least one character");
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === "?") {
    if (state.result !== null && state.kind !== "scalar") {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state.implicitTypes[typeIndex];
      if (type2.resolve(state.result)) {
        state.result = type2.construct(state.result);
        state.tag = type2.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== "!") {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
      type2 = state.typeMap[state.kind || "fallback"][state.tag];
    } else {
      type2 = null;
      typeList = state.typeMap.multi[state.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state, "unknown tag !<" + state.tag + ">");
    }
    if (state.result !== null && type2.kind !== state.kind) {
      throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
    }
    if (!type2.resolve(state.result, state.tag)) {
      throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
    } else {
      state.result = type2.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = /* @__PURE__ */ Object.create(null);
  state.anchorMap = /* @__PURE__ */ Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0) readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf("\0");
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, "null byte is not allowed in input");
  }
  state.input += "\0";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return void 0;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception("expected a single document in the stream, but found more");
}
var loadAll_1 = loadAll$1;
var load_1 = load$1;
var loader = {
  loadAll: loadAll_1,
  load: load_1
};
var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 65279;
var CHAR_TAB = 9;
var CHAR_LINE_FEED = 10;
var CHAR_CARRIAGE_RETURN = 13;
var CHAR_SPACE = 32;
var CHAR_EXCLAMATION = 33;
var CHAR_DOUBLE_QUOTE = 34;
var CHAR_SHARP = 35;
var CHAR_PERCENT = 37;
var CHAR_AMPERSAND = 38;
var CHAR_SINGLE_QUOTE = 39;
var CHAR_ASTERISK = 42;
var CHAR_COMMA = 44;
var CHAR_MINUS = 45;
var CHAR_COLON = 58;
var CHAR_EQUALS = 61;
var CHAR_GREATER_THAN = 62;
var CHAR_QUESTION = 63;
var CHAR_COMMERCIAL_AT = 64;
var CHAR_LEFT_SQUARE_BRACKET = 91;
var CHAR_RIGHT_SQUARE_BRACKET = 93;
var CHAR_GRAVE_ACCENT = 96;
var CHAR_LEFT_CURLY_BRACKET = 123;
var CHAR_VERTICAL_LINE = 124;
var CHAR_RIGHT_CURLY_BRACKET = 125;
var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
var DEPRECATED_BOOLEANS_SYNTAX = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema2, map2) {
  var result, keys, index, length, tag, style, type2;
  if (map2 === null) return {};
  result = {};
  keys = Object.keys(map2);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
      style = type2.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle + common.repeat("0", length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1;
var QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options["schema"] || _default;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string, spaces) {
  var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
  while (position < length) {
    next = string.indexOf("\n", position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== "\n") result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return "\n" + common.repeat(" ", state.indent * level);
}
function testImplicitResolving(state, str2) {
  var index, length, type2;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type2 = state.implicitTypes[index];
    if (type2.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    (inblock ? (
      // c = flow-in
      cIsNsCharOrWhitespace
    ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
  );
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string, pos) {
  var first2 = string.charCodeAt(pos), second;
  if (first2 >= 55296 && first2 <= 56319 && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first2 - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first2;
}
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1;
var STYLE_SINGLE = 2;
var STYLE_LITERAL = 3;
var STYLE_FOLDED = 4;
var STYLE_DOUBLE = 5;
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = function() {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level);
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
    var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string2) {
      return testImplicitResolving(state, string2);
    }
    switch (chooseScalarStyle(
      string,
      singleLineOnly,
      state.indent,
      lineWidth,
      testAmbiguity,
      state.quotingType,
      state.forceQuotes && !iskey,
      inblock
    )) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception("impossible error: invalid scalar style");
    }
  }();
}
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  var clip = string[string.length - 1] === "\n";
  var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + "\n";
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = function() {
    var nextLF = string.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }();
  var prevMoreIndented = string[0] === "\n" || string[0] === " ";
  var moreIndented;
  var match3;
  while (match3 = lineRe.exec(string)) {
    var prefix = match3[1], line = match3[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ") return line;
  var breakRe = / [^ ]/g;
  var match3;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match3 = breakRe.exec(line)) {
    next = match3.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += "\n" + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 65536) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
      if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = "[" + _result + "]";
}
function writeBlockSequence(state, level, object, compact2) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact2 || _result !== "") {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (_result !== "") pairBuffer += ", ";
    if (state.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024) pairBuffer += "? ";
    pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = "{" + _result + "}";
}
function writeBlockMapping(state, level, object, compact2) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new exception("sortKeys must be a boolean or a function");
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (!compact2 || _result !== "") {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type2, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type2 = typeList[index];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state.tag = type2.representName(object);
        } else {
          state.tag = type2.tag;
        }
      } else {
        state.tag = "?";
      }
      if (type2.represent) {
        style = state.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object, style);
        } else if (_hasOwnProperty.call(type2.represent, style)) {
          _result = type2.represent[style](object, style);
        } else {
          throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact2, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type2 = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact2 = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact2);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact2);
        } else {
          writeBlockSequence(state, level, state.dump, compact2);
        }
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new exception("unacceptable kind of an object to dump " + type2);
    }
    if (state.tag !== null && state.tag !== "?") {
      tagStr = encodeURI(
        state.tag[0] === "!" ? state.tag.slice(1) : state.tag
      ).replace(/!/g, "%21");
      if (state.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state.dump = tagStr + " " + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [], duplicatesIndexes = [], index, length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === "object") {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs) getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({ "": value }, "", value);
  }
  if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
  return "";
}
var dump_1 = dump$1;
var dumper = {
  dump: dump_1
};
function renamed(from, to) {
  return function() {
    throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
  };
}
var Type = type;
var Schema = schema;
var FAILSAFE_SCHEMA = failsafe;
var JSON_SCHEMA = json;
var CORE_SCHEMA = core;
var DEFAULT_SCHEMA = _default;
var load = loader.load;
var loadAll = loader.loadAll;
var dump = dumper.dump;
var YAMLException = exception;
var types2 = {
  binary,
  float,
  map,
  null: _null,
  pairs,
  set,
  timestamp,
  bool,
  int,
  merge,
  omap,
  seq,
  str
};
var safeLoad = renamed("safeLoad", "load");
var safeLoadAll = renamed("safeLoadAll", "loadAll");
var safeDump = renamed("safeDump", "dump");
var jsYaml = {
  Type,
  Schema,
  FAILSAFE_SCHEMA,
  JSON_SCHEMA,
  CORE_SCHEMA,
  DEFAULT_SCHEMA,
  load,
  loadAll,
  dump,
  YAMLException,
  types: types2,
  safeLoad,
  safeLoadAll,
  safeDump
};

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
        const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
        if (changes.featuresUpdated && changes.featuresUpdated.length > 0) {
          for (const featureUpdate of changes.featuresUpdated) {
            for (const task of featureUpdate.tasksCompleted) {
              const taskCompletedEvent = {
                eventType: "prd:feature:task:completed",
                prdId: updatedPlan.id,
                prdPath: updatedPlan.prdDirPath,
                timestamp: timestamp2,
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
                timestamp: timestamp2,
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
                timestamp: timestamp2,
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
    const type2 = args?.type;
    const mine = args?.mine ?? false;
    const repoPathOverride = args?.repoPath;
    this.log("debug", `listPlans called with type: ${type2}, mine: ${mine}, repoPath: ${repoPathOverride}, repositoryRoot: ${this.repositoryRoot}`);
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
            if (type2 && plan.type !== type2) {
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
            if (type2 === "active") return f.startsWith("plans/active/");
            if (type2 === "archived") return f.startsWith("plans/archived/");
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
        status: percentComplete === 100 ? "complete" : completedTasks > 0 ? "in_progress" : "not_started",
        prdId: planName,
        prdDirPath: prdPath,
        overview: plan.overview || "",
        gitUserName: plan.gitUserName,
        gitUserEmail: plan.gitUserEmail,
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
    const getString = (key) => {
      const val = parsed[key];
      if (typeof val === "string") return val;
      if (val instanceof Date) return val.toISOString().split("T")[0];
      return void 0;
    };
    const id = getString("id");
    const title = getString("title");
    const status = getString("status");
    const severity = getString("severity");
    if (!id || !title || !status || !severity) {
      return null;
    }
    const frontmatter = {
      id,
      title,
      status,
      severity,
      reported: getString("reported") || "",
      resolved: parsed.resolved === null ? null : getString("resolved") ?? null
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
    const resolution = parsed.resolution;
    return {
      id: frontmatter.id,
      title: frontmatter.title,
      status: frontmatter.status,
      severity: frontmatter.severity,
      tasks: mergedTasks,
      filePath: relativePath,
      reported: frontmatter.reported,
      resolved: frontmatter.resolved,
      resolution
    };
  }
  /**
   * Parse YAML frontmatter into an object using js-yaml
   */
  parseYamlFrontmatter(text) {
    try {
      const parsed = load(text);
      return parsed || {};
    } catch {
      return {};
    }
  }
  /**
   * Parse resolution marker from task description
   * Returns { cleanDescription, status, commitSha }
   *
   * Supported markers:
   * - (sha) - 7+ hex chars - marks as completed with commitSha
   * - (superseded) - marks as superseded
   */
  parseResolutionMarker(rawDescription) {
    const shaMatch = rawDescription.match(/^(.+?)\s*\(([a-f0-9]{7,40})\)\s*$/i);
    if (shaMatch) {
      return {
        cleanDescription: shaMatch[1].trim(),
        status: "completed",
        commitSha: shaMatch[2]
      };
    }
    const supersededMatch = rawDescription.match(/^(.+?)\s*\(superseded\)\s*$/i);
    if (supersededMatch) {
      return {
        cleanDescription: supersededMatch[1].trim(),
        status: "superseded"
      };
    }
    return { cleanDescription: rawDescription };
  }
  /**
   * Extract tasks from fix markdown document
   * Tasks are identified by ### N. Task Name format
   * Parses resolution markers like (sha) and (superseded) from titles
   */
  extractFixTasks(content) {
    const tasks = [];
    const taskPattern = /###\s+(\d+)\.\s+(.+?)(?=\n|$)/g;
    let match3;
    while ((match3 = taskPattern.exec(content)) !== null) {
      const taskNumber = parseInt(match3[1], 10);
      const taskTitle = match3[2].trim();
      const parsed = this.parseResolutionMarker(taskTitle);
      tasks.push({
        id: `task-${taskNumber}`,
        description: parsed.cleanDescription,
        status: parsed.status ?? "defined",
        commitSha: parsed.commitSha
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
  generateRepoId(path17) {
    const hash = createHash("sha256").update(path17).digest("hex");
    return `repo-${hash.substring(0, 12)}`;
  }
  /**
   * Extract context file data from repository
   * Reads analysis date from .tiny-brain/analysis.json and agent count from CLAUDE.md
   */
  async extractContextFileData(repoPath) {
    const result = {};
    try {
      const analysisPath = join2(repoPath, ".tiny-brain", "analysis.json");
      const analysisContent = await readFile(analysisPath, "utf-8");
      const analysisData = JSON.parse(analysisContent);
      if (analysisData.detectedAt) {
        result.lastAnalyzed = analysisData.detectedAt;
      }
    } catch {
      try {
        const contextFilePath = join2(repoPath, "CLAUDE.md");
        const content = await readFile(contextFilePath, "utf-8");
        const yamlData = this.parseRepositoryContextYAML(content);
        if (yamlData?.analysisDate) {
          result.lastAnalyzed = yamlData.analysisDate;
        }
      } catch {
      }
    }
    try {
      const contextFileName = "CLAUDE.md";
      const contextFilePath = join2(repoPath, contextFileName);
      const content = await readFile(contextFilePath, "utf-8");
      result.contextFile = contextFileName;
      result.installedAgentCount = this.countInstalledAgents(content);
    } catch {
    }
    return result;
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

// packages/tiny-brain-core/src/services/hooks/hooks-service.ts
import { existsSync as existsSync3 } from "fs";
import { readFile as readFile4, readdir as readdir4 } from "fs/promises";
import { join as join5 } from "path";
var HooksService = class {
  repoRoot;
  constructor(repoRoot) {
    this.repoRoot = repoRoot;
  }
  /**
   * Get all plugin hooks from hooks.json
   */
  async getPluginHooks() {
    const hooksJsonPath = this.getPluginHooksPath();
    if (!existsSync3(hooksJsonPath)) {
      return [];
    }
    try {
      const content = await readFile4(hooksJsonPath, "utf-8");
      const hooksJson = JSON.parse(content);
      const hooks = [];
      for (const [event, groups] of Object.entries(hooksJson.hooks || {})) {
        const matcherGroup = groups.find((g) => g.matcher);
        hooks.push({
          name: event,
          event,
          type: "plugin",
          path: hooksJsonPath,
          matcher: matcherGroup?.matcher
        });
      }
      return hooks;
    } catch {
      return [];
    }
  }
  /**
   * Get all git hooks from .git/hooks/
   */
  async getGitHooks() {
    const gitHooksDir = join5(this.repoRoot, ".git", "hooks");
    if (!existsSync3(gitHooksDir)) {
      return [];
    }
    try {
      const entries = await readdir4(gitHooksDir, { withFileTypes: true });
      const hooks = [];
      for (const entry of entries) {
        if (!entry.isFile() || entry.name.endsWith(".sample")) {
          continue;
        }
        hooks.push({
          name: entry.name,
          event: entry.name,
          type: "git",
          path: join5(gitHooksDir, entry.name)
        });
      }
      return hooks;
    } catch {
      return [];
    }
  }
  /**
   * Get all hooks (both plugin and git)
   */
  async getAllHooks() {
    const [pluginHooks, gitHooks] = await Promise.all([
      this.getPluginHooks(),
      this.getGitHooks()
    ]);
    return { pluginHooks, gitHooks };
  }
  /**
   * Get the content of a specific hook
   */
  async getHookContent(type2, hookName) {
    if (type2 === "git") {
      return this.getGitHookContent(hookName);
    } else {
      return this.getPluginHookContent(hookName);
    }
  }
  async getGitHookContent(hookName) {
    const hookPath = join5(this.repoRoot, ".git", "hooks", hookName);
    if (!existsSync3(hookPath)) {
      return null;
    }
    try {
      return await readFile4(hookPath, "utf-8");
    } catch {
      return null;
    }
  }
  async getPluginHookContent(hookName) {
    const hooksJsonPath = this.getPluginHooksPath();
    if (!existsSync3(hooksJsonPath)) {
      return null;
    }
    try {
      const content = await readFile4(hooksJsonPath, "utf-8");
      const hooksJson = JSON.parse(content);
      const hookGroups = hooksJson.hooks?.[hookName];
      if (!hookGroups || hookGroups.length === 0) {
        return null;
      }
      const lines = [`# ${hookName} Hook`, ""];
      for (const group of hookGroups) {
        if (group.matcher) {
          lines.push(`## Matcher: ${group.matcher}`);
        } else {
          lines.push("## Default");
        }
        lines.push("");
        for (const hook of group.hooks) {
          lines.push(`### ${hook.type}`);
          lines.push("```bash");
          lines.push(hook.command);
          lines.push("```");
          lines.push("");
        }
      }
      return lines.join("\n");
    } catch {
      return null;
    }
  }
  getPluginHooksPath() {
    const possiblePaths = [
      join5(this.repoRoot, ".claude-plugin", "hooks", "hooks.json"),
      join5(this.repoRoot, "hooks", "hooks.json")
    ];
    for (const p of possiblePaths) {
      if (existsSync3(p)) {
        return p;
      }
    }
    return possiblePaths[0];
  }
};

// packages/tiny-brain-core/src/services/analysis/tech-context-service.ts
import { promises as fs5 } from "fs";
import path6 from "path";
import crypto3 from "crypto";
var TechContextService = class {
  tinyBrainDir;
  techDir;
  agentsDir;
  constructor(repoPath) {
    this.tinyBrainDir = path6.join(repoPath, ".tiny-brain");
    this.techDir = path6.join(this.tinyBrainDir, "tech");
    this.agentsDir = path6.join(repoPath, ".claude", "agents");
  }
  /** Get the .tiny-brain directory path */
  getTinyBrainDir() {
    return this.tinyBrainDir;
  }
  /** Get the .tiny-brain/tech directory path */
  getTechDir() {
    return this.techDir;
  }
  /** Get the .claude/agents directory path */
  getAgentsDir() {
    return this.agentsDir;
  }
  /** Ensure required directories exist */
  async ensureDirectories() {
    await fs5.mkdir(this.tinyBrainDir, { recursive: true });
    await fs5.mkdir(this.techDir, { recursive: true });
  }
  /**
   * Write analysis data to .tiny-brain/analysis.json
   */
  async writeAnalysis(analysis) {
    await this.ensureDirectories();
    const stack = {
      languages: analysis.languages,
      frameworks: analysis.frameworks,
      testing: analysis.testingTools,
      build: analysis.buildTools
    };
    const analysisData = {
      hasTests: analysis.hasTests,
      testFileCount: analysis.testFileCount,
      testPatterns: analysis.testPatterns,
      isPolyglot: analysis.isPolyglot ?? false,
      primaryLanguage: analysis.primaryLanguage ?? analysis.languages[0] ?? "unknown",
      documentationPattern: analysis.documentationPattern,
      documentationLocations: analysis.documentationLocations
    };
    const hashInput = JSON.stringify({ stack, analysis: analysisData });
    const analysisHash = crypto3.createHash("sha256").update(hashInput).digest("hex");
    const file = {
      version: "1.0",
      detectedAt: (/* @__PURE__ */ new Date()).toISOString(),
      analysisHash,
      stack,
      analysis: analysisData
    };
    const filePath = path6.join(this.tinyBrainDir, "analysis.json");
    await fs5.writeFile(filePath, JSON.stringify(file, null, 2), "utf-8");
  }
  /**
   * Write a tech expertise file with YAML frontmatter
   */
  async writeTechFile(name, frontmatter, content) {
    await this.ensureDirectories();
    const yamlFrontmatter = [
      "---",
      `name: ${frontmatter.name}`,
      `version: ${frontmatter.version}`,
      `domain: ${frontmatter.domain}`,
      `filePatterns:`,
      ...frontmatter.filePatterns.map((p) => `  - "${p}"`),
      frontmatter.description ? `description: "${frontmatter.description}"` : null,
      "---"
    ].filter(Boolean).join("\n");
    const fileContent = `${yamlFrontmatter}

${content}`;
    const filePath = path6.join(this.techDir, `${name}.md`);
    await fs5.writeFile(filePath, fileContent, "utf-8");
  }
  /**
   * Write raw markdown content to a tech file
   * Used when receiving complete markdown from TBR API
   */
  async writeTechFileRaw(name, content) {
    await this.ensureDirectories();
    const filePath = path6.join(this.techDir, `${name}.md`);
    await fs5.writeFile(filePath, content, "utf-8");
  }
  /**
   * Read analysis data from .tiny-brain/analysis.json
   */
  async readAnalysis() {
    const filePath = path6.join(this.tinyBrainDir, "analysis.json");
    try {
      const content = await fs5.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
  /**
   * Read all tech expertise files from .tiny-brain/tech/
   */
  async readTechFiles() {
    try {
      const files = await fs5.readdir(this.techDir);
      const techFiles = [];
      for (const file of files) {
        if (!file.endsWith(".md")) continue;
        const filePath = path6.join(this.techDir, file);
        const content = await fs5.readFile(filePath, "utf-8");
        const parsed = this.parseFrontmatter(content);
        if (parsed) {
          techFiles.push({
            ...parsed,
            filePath
          });
        }
      }
      return techFiles;
    } catch {
      return [];
    }
  }
  /**
   * Get tech files that match a given file path based on filePatterns
   */
  async getTechForFile(filePath) {
    const techFiles = await this.readTechFiles();
    const matches = [];
    const basename2 = path6.basename(filePath);
    for (const techFile of techFiles) {
      for (const pattern of techFile.frontmatter.filePatterns) {
        if (minimatch(filePath, pattern) || minimatch(basename2, pattern) || minimatch(filePath, `**/${pattern}`) || filePath.includes(pattern.replace(/\/$/, ""))) {
          matches.push(techFile);
          break;
        }
      }
    }
    return matches;
  }
  /**
   * Check if the tech stack has changed compared to previous analysis
   */
  async hasStackChanged(analysis) {
    const existing = await this.readAnalysis();
    if (!existing) return true;
    const stack = {
      languages: analysis.languages,
      frameworks: analysis.frameworks,
      testing: analysis.testingTools,
      build: analysis.buildTools
    };
    const analysisData = {
      hasTests: analysis.hasTests,
      testFileCount: analysis.testFileCount,
      testPatterns: analysis.testPatterns,
      isPolyglot: analysis.isPolyglot ?? false,
      primaryLanguage: analysis.primaryLanguage ?? analysis.languages[0] ?? "unknown",
      documentationPattern: analysis.documentationPattern,
      documentationLocations: analysis.documentationLocations
    };
    const hashInput = JSON.stringify({ stack, analysis: analysisData });
    const newHash = crypto3.createHash("sha256").update(hashInput).digest("hex");
    return newHash !== existing.analysisHash;
  }
  /**
   * Write config to .tiny-brain/tech/config.json
   */
  async writeConfig(config) {
    await this.ensureDirectories();
    const fullConfig = {
      ...config,
      lastSynced: (/* @__PURE__ */ new Date()).toISOString()
    };
    const filePath = path6.join(this.techDir, "config.json");
    await fs5.writeFile(filePath, JSON.stringify(fullConfig, null, 2), "utf-8");
  }
  /**
   * Read config from .tiny-brain/tech/config.json
   */
  async readConfig() {
    const filePath = path6.join(this.techDir, "config.json");
    try {
      const content = await fs5.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch {
      return { useAgents: false };
    }
  }
  /**
   * Install tech agents to .claude/agents/
   * Converts tech context files into proper Claude Code sub-agents with:
   * - name: tech-{name} (matches subagent_type="tech-react")
   * - description: for Claude Code auto-delegation
   * - Sub-agent invocation context
   */
  async installTechAgents() {
    await fs5.mkdir(this.agentsDir, { recursive: true });
    const techFiles = await this.readTechFiles();
    for (const techFile of techFiles) {
      const name = techFile.frontmatter.name;
      const agentFileName = `tech-${name}.md`;
      const agentPath = path6.join(this.agentsDir, agentFileName);
      const description = techFile.frontmatter.description || `${name} development specialist. Use for ${techFile.frontmatter.domain} tasks involving ${name}.`;
      const agentContent = `---
name: tech-${name}
description: ${description}
version: ${techFile.frontmatter.version}
domain: ${techFile.frontmatter.domain}
---

# ${name} Sub-Agent

You are a specialized ${name} development agent invoked by the developer agent. Apply the expertise and patterns below to the task you've been given.

## Tech Expertise

${techFile.content}`;
      await fs5.writeFile(agentPath, agentContent, "utf-8");
    }
  }
  /**
   * Remove only tech-*.md files from .claude/agents/
   */
  async removeTechAgents() {
    try {
      const files = await fs5.readdir(this.agentsDir);
      for (const file of files) {
        if (file.startsWith("tech-") && file.endsWith(".md")) {
          await fs5.unlink(path6.join(this.agentsDir, file));
        }
      }
    } catch {
    }
  }
  /**
   * Sync agents based on enableAgentic preference
   */
  async syncAgents(enableAgentic) {
    await this.writeConfig({ useAgents: enableAgentic });
    if (enableAgentic) {
      await this.installTechAgents();
    } else {
      await this.removeTechAgents();
    }
  }
  /**
   * Get versions of all local tech context files
   * @returns Map of tech name → version
   */
  async getLocalTechVersions() {
    const techFiles = await this.readTechFiles();
    const versions = /* @__PURE__ */ new Map();
    for (const file of techFiles) {
      versions.set(file.frontmatter.name, file.frontmatter.version);
    }
    return versions;
  }
  /**
   * Compare versions to determine if TBS version is newer
   * @returns true if tbsVersion is newer than localVersion
   */
  shouldUpdateTech(localVersion, tbsVersion) {
    const parseVersion = (v) => {
      return v.split(".").map((s) => parseInt(s, 10) || 0);
    };
    const local = parseVersion(localVersion);
    const tbs = parseVersion(tbsVersion);
    const maxLen = Math.max(local.length, tbs.length);
    while (local.length < maxLen) local.push(0);
    while (tbs.length < maxLen) tbs.push(0);
    for (let i = 0; i < maxLen; i++) {
      if (tbs[i] > local[i]) return true;
      if (tbs[i] < local[i]) return false;
    }
    return false;
  }
  /**
   * Parse YAML frontmatter from a markdown file
   */
  parseFrontmatter(content) {
    const match3 = content.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
    if (!match3) return null;
    const yamlContent = match3[1];
    const markdownContent = match3[2];
    const frontmatter = {};
    const lines = yamlContent.split("\n");
    let currentKey = "";
    let filePatterns = [];
    for (const line of lines) {
      const keyMatch = line.match(/^(\w+):\s*(.*)$/);
      if (keyMatch) {
        currentKey = keyMatch[1];
        const value = keyMatch[2].replace(/^["']|["']$/g, "");
        if (currentKey === "filePatterns") {
          filePatterns = [];
        } else if (currentKey === "name") {
          frontmatter.name = value;
        } else if (currentKey === "version") {
          frontmatter.version = value;
        } else if (currentKey === "domain") {
          frontmatter.domain = value;
        } else if (currentKey === "description") {
          frontmatter.description = value;
        }
      } else if (currentKey === "filePatterns" && line.trim().startsWith("-")) {
        const pattern = line.trim().replace(/^-\s*/, "").replace(/^["']|["']$/g, "");
        filePatterns.push(pattern);
      }
    }
    frontmatter.filePatterns = filePatterns;
    if (!frontmatter.name || !frontmatter.version || !frontmatter.domain) {
      return null;
    }
    return {
      frontmatter,
      content: markdownContent
    };
  }
};

// packages/tiny-brain-core/src/analyser/index.ts
import * as fs8 from "fs/promises";
import * as path9 from "path";

// packages/tiny-brain-core/src/analyser/detectors/base-detector.ts
import * as fs6 from "fs/promises";
import * as path7 from "path";
var BaseDetector = class {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }
  async fileExists(filePath) {
    try {
      await fs6.access(path7.join(this.dirPath, filePath));
      return true;
    } catch {
      return false;
    }
  }
  async readFile(filePath) {
    try {
      return await fs6.readFile(path7.join(this.dirPath, filePath), "utf8");
    } catch {
      return "";
    }
  }
  async readJsonFile(filePath) {
    try {
      const content = await this.readFile(filePath);
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
  async findFiles(pattern) {
    try {
      const files = await fs6.readdir(this.dirPath);
      return files.filter((file) => {
        if (pattern.includes("*")) {
          const regex = new RegExp(pattern.replace("*", ".*"));
          return regex.test(file);
        }
        return file === pattern;
      });
    } catch {
      return [];
    }
  }
};

// packages/tiny-brain-core/src/analyser/detectors/javascript-detector.ts
var JavaScriptDetector = class extends BaseDetector {
  packageJson = null;
  async detect() {
    return await this.fileExists("package.json");
  }
  async analyze() {
    if (!await this.detect()) {
      return null;
    }
    this.packageJson = await this.readJsonFile("package.json");
    if (!this.packageJson) {
      return null;
    }
    const deps = {
      ...this.packageJson.dependencies,
      ...this.packageJson.devDependencies
    };
    const stack = {
      path: this.dirPath,
      language: await this.detectLanguage(),
      framework: this.detectFramework(deps),
      frontend: this.detectFrontend(deps),
      backend: this.detectBackend(deps),
      testing: await this.detectTesting(deps),
      linting: await this.detectLinting(deps),
      bundling: this.detectBundling(deps),
      packageManager: await this.detectPackageManager(),
      stateManagement: this.detectStateManagement(deps),
      styling: this.detectStyling(deps),
      database: this.detectDatabase(deps)
    };
    return stack;
  }
  async detectLanguage() {
    if (await this.fileExists("tsconfig.json")) {
      return "typescript";
    }
    return "javascript";
  }
  detectFramework(deps) {
    if (deps?.["next"]) return "nextjs";
    if (deps?.["nuxt"]) return "nuxt";
    if (deps?.["@angular/core"]) return "angular";
    if (deps?.["gatsby"]) return "gatsby";
    if (deps?.["react"]) return "react";
    if (deps?.["vue"]) return "vue";
    if (deps?.["svelte"]) return "svelte";
    if (deps?.["solid-js"]) return "solidjs";
    if (deps?.["preact"]) return "preact";
    return null;
  }
  detectFrontend(deps) {
    if (deps?.["react"] || deps?.["next"]) return "react";
    if (deps?.["vue"] || deps?.["nuxt"]) return "vue";
    if (deps?.["@angular/core"]) return "angular";
    if (deps?.["svelte"]) return "svelte";
    if (deps?.["solid-js"]) return "solidjs";
    if (deps?.["preact"]) return "preact";
    if (deps?.["lit"]) return "lit";
    if (deps?.["alpinejs"]) return "alpinejs";
    return null;
  }
  detectBackend(deps) {
    if (deps?.["express"]) return "express";
    if (deps?.["@nestjs/core"]) return "nestjs";
    if (deps?.["fastify"]) return "fastify";
    if (deps?.["koa"]) return "koa";
    if (deps?.["hapi"] || deps?.["@hapi/hapi"]) return "hapi";
    if (deps?.["restify"]) return "restify";
    if (deps?.["@apollo/server"]) return "apollo-server";
    return null;
  }
  async detectTesting(deps) {
    const testing = {
      framework: null,
      libraries: [],
      e2e: null,
      mocking: []
    };
    if (deps?.["jest"]) {
      testing.framework = "jest";
    } else if (deps?.["vitest"]) {
      testing.framework = "vitest";
    } else if (deps?.["mocha"]) {
      testing.framework = "mocha";
    } else if (deps?.["ava"]) {
      testing.framework = "ava";
    } else if (deps?.["tape"]) {
      testing.framework = "tape";
    } else if (deps?.["jasmine"]) {
      testing.framework = "jasmine";
    }
    if (deps?.["@testing-library/react"]) testing.libraries?.push("testing-library-react");
    if (deps?.["@testing-library/vue"]) testing.libraries?.push("testing-library-vue");
    if (deps?.["@testing-library/angular"]) testing.libraries?.push("testing-library-angular");
    if (deps?.["@testing-library/svelte"]) testing.libraries?.push("testing-library-svelte");
    if (deps?.["@testing-library/user-event"]) testing.libraries?.push("testing-library-user-event");
    if (deps?.["@testing-library/jest-dom"]) testing.libraries?.push("testing-library-jest-dom");
    if (deps?.["enzyme"]) testing.libraries?.push("enzyme");
    if (deps?.["@vue/test-utils"]) testing.libraries?.push("vue-test-utils");
    if (deps?.["chai"]) testing.libraries?.push("chai");
    if (deps?.["expect"]) testing.libraries?.push("expect");
    if (deps?.["should"]) testing.libraries?.push("should");
    if (deps?.["sinon"]) testing.libraries?.push("sinon");
    if (deps?.["@playwright/test"]) {
      testing.e2e = "playwright";
    } else if (deps?.["cypress"]) {
      testing.e2e = "cypress";
    } else if (deps?.["puppeteer"]) {
      testing.e2e = "puppeteer";
    } else if (deps?.["webdriverio"]) {
      testing.e2e = "webdriverio";
    } else if (deps?.["nightwatch"]) {
      testing.e2e = "nightwatch";
    } else if (deps?.["testcafe"]) {
      testing.e2e = "testcafe";
    }
    if (deps?.["msw"]) testing.mocking?.push("msw");
    if (deps?.["nock"]) testing.mocking?.push("nock");
    if (deps?.["sinon"]) testing.mocking?.push("sinon");
    if (deps?.["jest-mock-extended"]) testing.mocking?.push("jest-mock-extended");
    if (deps?.["mockery"]) testing.mocking?.push("mockery");
    if (deps?.["proxyquire"]) testing.mocking?.push("proxyquire");
    return testing;
  }
  async detectLinting(deps) {
    const linting = {
      tool: null,
      plugins: []
    };
    if (deps?.["eslint"]) {
      linting.tool = "eslint";
      if (deps?.["eslint-plugin-react"]) linting.plugins?.push("react");
      if (deps?.["eslint-plugin-vue"]) linting.plugins?.push("vue");
      if (deps?.["@typescript-eslint/parser"]) linting.plugins?.push("typescript");
      if (deps?.["eslint-plugin-jest"]) linting.plugins?.push("jest");
      if (deps?.["eslint-plugin-cypress"]) linting.plugins?.push("cypress");
      if (deps?.["eslint-plugin-prettier"]) linting.plugins?.push("prettier");
    } else if (deps?.["tslint"]) {
      linting.tool = "tslint";
    } else if (deps?.["@biomejs/biome"]) {
      linting.tool = "biome";
    } else if (deps?.["standard"]) {
      linting.tool = "standard";
    } else if (deps?.["xo"]) {
      linting.tool = "xo";
    }
    return linting;
  }
  detectBundling(deps) {
    if (deps?.["webpack"]) return "webpack";
    if (deps?.["vite"]) return "vite";
    if (deps?.["rollup"]) return "rollup";
    if (deps?.["parcel"]) return "parcel";
    if (deps?.["esbuild"]) return "esbuild";
    if (deps?.["snowpack"]) return "snowpack";
    if (deps?.["browserify"]) return "browserify";
    return null;
  }
  async detectPackageManager() {
    if (await this.fileExists("yarn.lock")) return "yarn";
    if (await this.fileExists("pnpm-lock.yaml")) return "pnpm";
    if (await this.fileExists("bun.lockb")) return "bun";
    return "npm";
  }
  detectStateManagement(deps) {
    if (deps?.["redux"]) return "redux";
    if (deps?.["mobx"]) return "mobx";
    if (deps?.["zustand"]) return "zustand";
    if (deps?.["recoil"]) return "recoil";
    if (deps?.["jotai"]) return "jotai";
    if (deps?.["valtio"]) return "valtio";
    if (deps?.["vuex"]) return "vuex";
    if (deps?.["pinia"]) return "pinia";
    return null;
  }
  detectStyling(deps) {
    const styling = {
      approach: null,
      preprocessor: null
    };
    if (deps?.["styled-components"]) styling.approach = "styled-components";
    else if (deps?.["@emotion/react"] || deps?.["@emotion/core"]) styling.approach = "emotion";
    else if (deps?.["@stitches/react"]) styling.approach = "stitches";
    else if (deps?.["styled-jsx"]) styling.approach = "styled-jsx";
    else if (deps?.["tailwindcss"]) styling.approach = "tailwind";
    else if (deps?.["windicss"]) styling.approach = "windicss";
    else if (deps?.["unocss"]) styling.approach = "unocss";
    else if (deps?.["@mui/material"]) styling.approach = "material-ui";
    else if (deps?.["antd"]) styling.approach = "ant-design";
    else if (deps?.["@chakra-ui/react"]) styling.approach = "chakra-ui";
    else if (deps?.["@mantine/core"]) styling.approach = "mantine";
    if (deps?.["sass"] || deps?.["node-sass"]) styling.preprocessor = "sass";
    else if (deps?.["less"]) styling.preprocessor = "less";
    else if (deps?.["stylus"]) styling.preprocessor = "stylus";
    else if (deps?.["postcss"]) styling.preprocessor = "postcss";
    return styling;
  }
  detectDatabase(deps) {
    const database = {
      orm: null,
      driver: null
    };
    if (deps?.["prisma"] || deps?.["@prisma/client"]) database.orm = "prisma";
    else if (deps?.["typeorm"]) database.orm = "typeorm";
    else if (deps?.["sequelize"]) database.orm = "sequelize";
    else if (deps?.["mongoose"]) database.orm = "mongoose";
    else if (deps?.["knex"]) database.orm = "knex";
    else if (deps?.["objection"]) database.orm = "objection";
    else if (deps?.["mikro-orm"]) database.orm = "mikro-orm";
    else if (deps?.["bookshelf"]) database.orm = "bookshelf";
    if (deps?.["pg"]) database.driver = "postgresql";
    else if (deps?.["mysql"] || deps?.["mysql2"]) database.driver = "mysql";
    else if (deps?.["sqlite3"] || deps?.["better-sqlite3"]) database.driver = "sqlite";
    else if (deps?.["mongodb"]) database.driver = "mongodb";
    else if (deps?.["redis"] || deps?.["ioredis"]) database.driver = "redis";
    else if (deps?.["@aws-sdk/client-dynamodb"]) database.driver = "dynamodb";
    return database;
  }
};

// packages/tiny-brain-core/src/analyser/utils.ts
import * as path8 from "path";
import * as fs7 from "fs/promises";

// packages/tiny-brain-core/src/analyser/index.ts
var DEFAULT_OPTIONS = {
  maxDepth: 5,
  skipDirs: ["node_modules", ".git", "dist", "build", ".next", ".nuxt", "coverage", ".turbo", ".cache"]
};
var TEST_PATTERNS = [".test.", ".spec.", "__tests__", ".e2e.", ".integration."];
async function analyseRepository(rootPath = process.cwd(), options) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const languages = /* @__PURE__ */ new Set();
  const frameworks = /* @__PURE__ */ new Set();
  const testingTools = /* @__PURE__ */ new Set();
  const buildTools = /* @__PURE__ */ new Set();
  const testFiles = [];
  const testPatterns = /* @__PURE__ */ new Set();
  const languageFileCounts = {};
  await walkDirectory(rootPath, async (dirPath, files) => {
    const stack = await detectTechInDirectory(dirPath);
    if (stack) {
      if (stack.language === "javascript" || stack.language === "typescript") {
        const detector = new JavaScriptDetector(dirPath);
        const enhancedStack = await detector.analyze();
        if (enhancedStack) {
          processStack(enhancedStack);
        }
      } else {
        processStack(stack);
      }
    }
    for (const file of files || []) {
      detectFileType(file);
      detectTestFile(file);
    }
    await detectOtherLanguages(dirPath, files || []);
  }, opts);
  function processStack(stack) {
    if (stack.language) {
      languages.add(stack.language);
      languageFileCounts[stack.language] = (languageFileCounts[stack.language] || 0) + 1;
    }
    if (stack.framework) frameworks.add(stack.framework);
    if (stack.frontend) frameworks.add(stack.frontend);
    if (stack.backend) frameworks.add(stack.backend);
    if (stack.testing?.framework) testingTools.add(stack.testing.framework);
    if (stack.testing?.e2e) testingTools.add(stack.testing.e2e);
    if (stack.testing?.libraries) {
      stack.testing.libraries.forEach((lib) => testingTools.add(lib));
    }
    if (stack.bundling) buildTools.add(stack.bundling);
  }
  function detectFileType(fileName) {
    const ext2 = path9.extname(fileName).toLowerCase();
    if ([".js", ".mjs", ".cjs", ".jsx"].includes(ext2)) {
      languages.add("javascript");
      languageFileCounts.javascript = (languageFileCounts.javascript || 0) + 1;
    }
    if ([".ts", ".tsx", ".mts", ".cts"].includes(ext2)) {
      languages.add("typescript");
      languageFileCounts.typescript = (languageFileCounts.typescript || 0) + 1;
    }
    if ([".py"].includes(ext2)) {
      languages.add("python");
      languageFileCounts.python = (languageFileCounts.python || 0) + 1;
    }
    if ([".go"].includes(ext2)) {
      languages.add("go");
      languageFileCounts.go = (languageFileCounts.go || 0) + 1;
    }
    if ([".rb"].includes(ext2)) {
      languages.add("ruby");
      languageFileCounts.ruby = (languageFileCounts.ruby || 0) + 1;
    }
    if ([".java"].includes(ext2)) {
      languages.add("java");
      languageFileCounts.java = (languageFileCounts.java || 0) + 1;
    }
    if ([".rs"].includes(ext2)) {
      languages.add("rust");
      languageFileCounts.rust = (languageFileCounts.rust || 0) + 1;
    }
    if ([".cs"].includes(ext2)) {
      languages.add("csharp");
      languageFileCounts.csharp = (languageFileCounts.csharp || 0) + 1;
    }
  }
  function detectTestFile(fileName) {
    for (const pattern of TEST_PATTERNS) {
      if (fileName.includes(pattern)) {
        testFiles.push(fileName);
        const ext2 = path9.extname(fileName);
        if (ext2) {
          testPatterns.add(pattern + ext2.substring(1));
        }
        break;
      }
    }
  }
  async function detectOtherLanguages(dirPath, files) {
    try {
      for (const file of files) {
        const filePath = path9.join(dirPath, file);
        if (file === "requirements.txt" || file === "setup.py" || file === "pyproject.toml") {
          languages.add("python");
          const content = await fs8.readFile(filePath, "utf8").catch(() => "");
          if (content.includes("django")) frameworks.add("django");
          if (content.includes("flask")) frameworks.add("flask");
          if (content.includes("fastapi")) frameworks.add("fastapi");
          if (content.includes("pytest")) testingTools.add("pytest");
          if (content.includes("unittest")) testingTools.add("unittest");
        }
        if (file === "go.mod" || file === "go.sum") {
          languages.add("go");
          const content = await fs8.readFile(filePath, "utf8").catch(() => "");
          if (content.includes("testify")) testingTools.add("testify");
          if (content.includes("gin-gonic")) frameworks.add("gin");
          if (content.includes("echo")) frameworks.add("echo");
        }
        if (file === "Gemfile" || file === "Rakefile") {
          languages.add("ruby");
          const content = await fs8.readFile(filePath, "utf8").catch(() => "");
          if (content.includes("rails")) frameworks.add("rails");
          if (content.includes("sinatra")) frameworks.add("sinatra");
          if (content.includes("rspec")) testingTools.add("rspec");
          if (content.includes("minitest")) testingTools.add("minitest");
        }
        if (file === "webpack.config.js") buildTools.add("webpack");
        if (file === "rollup.config.js") buildTools.add("rollup");
        if (file === "vite.config.js" || file === "vite.config.ts") buildTools.add("vite");
        if (file === "gulpfile.js") buildTools.add("gulp");
        if (file === "Gruntfile.js") buildTools.add("grunt");
        if (file === "Makefile") buildTools.add("make");
      }
    } catch {
    }
  }
  let primaryLanguage;
  if (Object.keys(languageFileCounts).length > 0) {
    primaryLanguage = Object.entries(languageFileCounts).sort((a, b) => b[1] - a[1])[0][0];
  }
  const sortedLanguages = Array.from(languages).sort((a, b) => {
    const countA = languageFileCounts[a] || 0;
    const countB = languageFileCounts[b] || 0;
    return countB - countA;
  });
  const documentationLocations = [];
  let documentationPattern;
  const rootFiles = await fs8.readdir(rootPath).catch(() => []);
  const hasRootReadme = rootFiles.some((f) => (typeof f === "string" ? f : f.name).toLowerCase() === "readme.md");
  const hasDocsFolder = rootFiles.some((f) => (typeof f === "string" ? f : f.name).toLowerCase() === "docs");
  if (hasRootReadme) {
    documentationLocations.push("README.md");
  }
  if (hasDocsFolder) {
    documentationLocations.push("docs/");
  }
  if (hasDocsFolder && hasRootReadme) {
    documentationPattern = "mixed";
  } else if (hasDocsFolder) {
    documentationPattern = "docs-folder";
  } else if (hasRootReadme) {
    documentationPattern = "single-readme";
  }
  return {
    // Core detected technologies
    languages: sortedLanguages,
    frameworks: Array.from(frameworks),
    testingTools: Array.from(testingTools),
    buildTools: Array.from(buildTools),
    // Test detection
    hasTests: testFiles.length > 0,
    testFileCount: testFiles.length,
    testPatterns: Array.from(testPatterns),
    // Polyglot detection
    isPolyglot: languages.size > 1,
    primaryLanguage,
    // Documentation detection
    documentationPattern,
    documentationLocations: documentationLocations.length > 0 ? documentationLocations : void 0
  };
}
async function walkDirectory(dir, callback, options, currentDepth = 0) {
  if (currentDepth > (options.maxDepth || 5)) {
    return;
  }
  try {
    const entries = await fs8.readdir(dir, { withFileTypes: true });
    const files = [];
    const dirs = [];
    for (const entry of entries) {
      if (entry.isDirectory() && !options.skipDirs?.includes(entry.name)) {
        dirs.push(entry.name);
      } else if (!entry.isDirectory()) {
        files.push(entry.name);
      }
    }
    await callback(dir, files);
    for (const subdir of dirs) {
      const fullPath = path9.join(dir, subdir);
      await walkDirectory(fullPath, callback, options, currentDepth + 1);
    }
  } catch {
    await callback(dir, []);
  }
}
async function detectTechInDirectory(dirPath) {
  const detectors = [
    new JavaScriptDetector(dirPath)
    // Future: Add more detectors here
    // new PythonDetector(dirPath),
    // new GoDetector(dirPath),
    // new DotNetDetector(dirPath),
    // new JavaDetector(dirPath),
    // new RustDetector(dirPath),
  ];
  for (const detector of detectors) {
    if (await detector.detect()) {
      return await detector.analyze();
    }
  }
  return null;
}

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
   * Get tech contexts matching the repo analysis
   * Returns markdown files with frontmatter for each matched technology
   */
  async getTechContexts(repoAnalysis, token) {
    const url = `${this.apiUrl}/api/library/tech-contexts`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ repoAnalysis })
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch tech contexts: ${response.status} ${response.statusText}`);
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
  async getAgentByPath(token, path17) {
    const response = await fetch(`${this.apiUrl}/api/agents/${path17}`, {
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
  async storeAgent(token, path17, agent) {
    const response = await fetch(`${this.apiUrl}/api/agents/${path17}`, {
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
  async archiveAgent(token, path17) {
    const response = await fetch(`${this.apiUrl}/api/agents/${path17}`, {
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

// packages/tiny-brain-core/src/services/analysis/analysis-service.ts
import { readFile as readFile7 } from "fs/promises";
import { join as join9 } from "path";
var AnalysisService = class {
  constructor(repoPath, options = {}) {
    this.repoPath = repoPath;
    this.techContextService = new TechContextService(repoPath);
    this.libraryClient = new LibraryClient();
    this.logger = options.logger || {
      info: () => {
      },
      debug: () => {
      },
      warn: () => {
      }
    };
    this.onProgress = options.onProgress;
    this.authToken = options.authToken;
  }
  techContextService;
  libraryClient;
  logger;
  onProgress;
  authToken;
  /**
   * Read enableAgenticCoding preference from repo config
   */
  async isAgenticCodingEnabled() {
    try {
      const configPath = join9(this.repoPath, ".tiny-brain", "config.json");
      const content = await readFile7(configPath, "utf-8");
      const config = JSON.parse(content);
      return config.repo?.enableAgenticCoding ?? false;
    } catch {
      return false;
    }
  }
  /**
   * Emit a progress event
   */
  emitProgress(type2, message, data) {
    if (this.onProgress) {
      this.onProgress({
        type: type2,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        message,
        data
      });
    }
  }
  /**
   * Perform repository analysis
   *
   * This is the re-run appropriate analysis:
   * 1. Detect tech stack
   * 2. Write to .tiny-brain/analysis.json
   * 3. Fetch tech contexts from TBR (if authenticated)
   * 4. Sync agents based on enableAgenticCoding config
   */
  async performAnalysis() {
    try {
      this.emitProgress("analysis:started", "Starting repository analysis");
      this.emitProgress("analysis:tech-detection", "Detecting tech stack");
      const analysis = await analyseRepository(this.repoPath);
      this.logger?.info(`Repository analysis complete: ${analysis.languages.join(", ")}`);
      const analysisInput = {
        languages: analysis.languages,
        frameworks: analysis.frameworks,
        testingTools: analysis.testingTools,
        buildTools: analysis.buildTools,
        hasTests: analysis.hasTests,
        testFileCount: analysis.testFileCount,
        testPatterns: analysis.testPatterns,
        isPolyglot: analysis.isPolyglot,
        primaryLanguage: analysis.primaryLanguage,
        documentationPattern: analysis.documentationPattern,
        documentationLocations: analysis.documentationLocations
      };
      const existingAnalysis = await this.techContextService.readAnalysis();
      const isFirstAnalysis = existingAnalysis === null;
      const stackChanged = await this.techContextService.hasStackChanged(analysisInput);
      this.emitProgress("analysis:writing-file", "Writing analysis.json");
      await this.techContextService.writeAnalysis(analysisInput);
      let writtenTechContexts = [];
      if (this.authToken) {
        this.emitProgress("analysis:fetching-contexts", "Fetching tech contexts from TBR");
        writtenTechContexts = await this.fetchAndWriteTechContexts(analysis);
      } else {
        this.logger?.debug("No auth token available for TBR API call");
      }
      this.emitProgress("analysis:syncing-agents", "Syncing tech agents");
      const enableAgentic = await this.isAgenticCodingEnabled();
      await this.techContextService.syncAgents(enableAgentic);
      let changes;
      if (!isFirstAnalysis && stackChanged && existingAnalysis) {
        const previousStack = existingAnalysis.stack;
        changes = {
          techStackAdded: [
            ...analysis.languages.filter((l) => !previousStack.languages.includes(l)),
            ...analysis.frameworks.filter((f) => !previousStack.frameworks.includes(f)),
            ...analysis.buildTools.filter((b) => !previousStack.build.includes(b)),
            ...analysis.testingTools.filter((t) => !previousStack.testing.includes(t))
          ],
          techStackRemoved: [
            ...previousStack.languages.filter((l) => !analysis.languages.includes(l)),
            ...previousStack.frameworks.filter((f) => !analysis.frameworks.includes(f)),
            ...previousStack.build.filter((b) => !analysis.buildTools.includes(b)),
            ...previousStack.testing.filter((t) => !analysis.testingTools.includes(t))
          ]
        };
      }
      const result = {
        analysis,
        isFirstAnalysis,
        enableAgenticCoding: enableAgentic,
        changes,
        writtenTechContexts
      };
      this.emitProgress("analysis:complete", "Analysis complete", {
        isFirstAnalysis,
        enableAgenticCoding: enableAgentic,
        techContextsWritten: writtenTechContexts.length,
        hasChanges: !!changes
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.emitProgress("analysis:failed", `Analysis failed: ${message}`, { error: message });
      throw error;
    }
  }
  /**
   * Fetch tech contexts from TBR and write them to .tiny-brain/tech/
   */
  async fetchAndWriteTechContexts(analysis) {
    try {
      if (!this.authToken) {
        return [];
      }
      const response = await this.libraryClient.getTechContexts(analysis, this.authToken);
      if (!response?.techContexts || response.techContexts.length === 0) {
        this.logger?.debug("No tech contexts returned from TBR");
        return [];
      }
      const writtenContexts = [];
      for (const techContext of response.techContexts) {
        const name = techContext.frontmatter.name;
        await this.techContextService.writeTechFileRaw(name, techContext.raw);
        writtenContexts.push(name);
        this.logger?.debug(`Wrote tech context: ${name}`);
      }
      this.logger?.info(`Wrote ${writtenContexts.length} tech context(s) to .tiny-brain/tech/`);
      return writtenContexts;
    } catch (error) {
      this.logger?.warn(`Failed to fetch tech contexts from TBR: ${error instanceof Error ? error.message : "Unknown error"}`);
      return [];
    }
  }
};

// packages/tiny-brain-core/src/services/analysis/config-health-service.ts
import { promises as fs9 } from "fs";
import path10 from "path";
var HOOK_SIGNATURE = "Installed by: tiny-brain";
var REQUIRED_PERMISSIONS = [
  "Write(.tiny-brain/**)",
  "Read(.tiny-brain/**)"
];
var CONTEXT_START_MARKER = "## tiny-brain - start";
var CONTEXT_END_MARKER = "## tiny-brain - end";
var ConfigHealthService = class {
  repoPath;
  gitDir;
  hooksDir;
  claudeMdPath;
  settingsPath;
  constructor(repoPath) {
    this.repoPath = repoPath;
    this.gitDir = path10.join(repoPath, ".git");
    this.hooksDir = path10.join(this.gitDir, "hooks");
    this.claudeMdPath = path10.join(repoPath, "CLAUDE.md");
    this.settingsPath = path10.join(repoPath, ".claude", "settings.json");
  }
  /**
   * Check status of a single git hook
   */
  async checkHook(hookName) {
    const hookPath = path10.join(this.hooksDir, hookName);
    try {
      const stats = await fs9.stat(hookPath);
      const isExecutable = (stats.mode & 64) !== 0;
      const content = await fs9.readFile(hookPath, "utf-8");
      const isSigned = content.includes(HOOK_SIGNATURE);
      return {
        name: hookName,
        installed: true,
        signed: isSigned,
        executable: isExecutable
      };
    } catch (error) {
      if (error.code === "ENOENT") {
        return {
          name: hookName,
          installed: false,
          signed: false,
          executable: false
        };
      }
      return {
        name: hookName,
        installed: false,
        signed: false,
        executable: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  /**
   * Check all git hooks
   */
  async checkGitHooks() {
    const [preCommit, commitMsg, postCommit] = await Promise.all([
      this.checkHook("pre-commit"),
      this.checkHook("commit-msg"),
      this.checkHook("post-commit")
    ]);
    return { preCommit, commitMsg, postCommit };
  }
  /**
   * Check CLAUDE.md context block
   */
  async checkContextBlock() {
    try {
      const content = await fs9.readFile(this.claudeMdPath, "utf-8");
      const hasStartMarker = content.includes(CONTEXT_START_MARKER);
      const hasEndMarker = content.includes(CONTEXT_END_MARKER);
      const present = hasStartMarker && hasEndMarker;
      if (!present) {
        return {
          present: false,
          upToDate: false,
          missingSections: hasStartMarker ? ["end marker"] : hasEndMarker ? ["start marker"] : ["context block"]
        };
      }
      const versionMatch = content.match(/Version:\s*(\d+\.\d+\.\d+)/);
      const version = versionMatch ? versionMatch[1] : void 0;
      const missingSections = [];
      if (!content.includes("## Commit Message Format")) {
        missingSections.push("Commit Message Format");
      }
      if (!content.includes("## TDD Workflow")) {
        missingSections.push("TDD Workflow");
      }
      if (!content.includes("## Operational Tracking Directory")) {
        missingSections.push("Operational Tracking Directory");
      }
      return {
        present: true,
        version,
        upToDate: missingSections.length === 0,
        missingSections
      };
    } catch (error) {
      if (error.code === "ENOENT") {
        return {
          present: false,
          upToDate: false,
          missingSections: ["CLAUDE.md file"],
          error: "CLAUDE.md not found"
        };
      }
      return {
        present: false,
        upToDate: false,
        missingSections: [],
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  /**
   * Check skill permissions in .claude/settings.json
   */
  async checkSkillPermissions() {
    try {
      const content = await fs9.readFile(this.settingsPath, "utf-8");
      const settings = JSON.parse(content);
      const allowedPermissions = settings.permissions?.allow || [];
      const missing = REQUIRED_PERMISSIONS.filter(
        (perm) => !allowedPermissions.some((allowed) => {
          if (allowed === perm) return true;
          if (allowed.includes("*")) {
            try {
              const escaped = allowed.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
              const pattern = escaped.replace(/\\\*/g, ".*");
              return new RegExp(`^${pattern}$`).test(perm);
            } catch {
              return false;
            }
          }
          return false;
        })
      );
      return {
        present: allowedPermissions.length > 0,
        missing
      };
    } catch (error) {
      if (error.code === "ENOENT") {
        return {
          present: false,
          missing: REQUIRED_PERMISSIONS,
          error: ".claude/settings.json not found"
        };
      }
      return {
        present: false,
        missing: REQUIRED_PERMISSIONS,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  /**
   * Check required directories based on config flags
   */
  async checkDirectories(flags) {
    const missing = [];
    const tinyBrainExists = await this.directoryExists(".tiny-brain");
    if (!tinyBrainExists) {
      missing.push(".tiny-brain/");
    }
    if (flags?.enableSDD !== false) {
      const prdExists = await this.directoryExists("docs/prd");
      if (!prdExists) {
        missing.push("docs/prd/");
      }
      const fixesExists = await this.directoryExists(".tiny-brain/fixes");
      if (!fixesExists) {
        missing.push(".tiny-brain/fixes/");
      }
    }
    if (flags?.enableADR !== false) {
      const adrExists = await this.directoryExists("docs/adr");
      if (!adrExists) {
        missing.push("docs/adr/");
      }
    }
    const qualityExists = await this.directoryExists("docs/quality");
    if (!qualityExists) {
      missing.push("docs/quality/");
    }
    return { missing };
  }
  /**
   * Helper to check if a directory exists
   */
  async directoryExists(relativePath) {
    try {
      const stats = await fs9.stat(path10.join(this.repoPath, relativePath));
      return stats.isDirectory();
    } catch {
      return false;
    }
  }
  /**
   * Get configuration flags from repo config
   */
  async getConfigFlags() {
    try {
      const configPath = path10.join(this.repoPath, ".tiny-brain", "config.json");
      const content = await fs9.readFile(configPath, "utf-8");
      const config = JSON.parse(content);
      return {
        enableSDD: config.repo?.enableSDD ?? true,
        enableADR: config.repo?.enableADR ?? true,
        enableTDD: config.repo?.enableTDD ?? true
      };
    } catch {
      return {
        enableSDD: true,
        enableADR: true,
        enableTDD: true
      };
    }
  }
  /**
   * Get complete configuration health status
   */
  async getConfigHealth() {
    const flags = await this.getConfigFlags();
    const [hooks, contextBlock, permissions, directories] = await Promise.all([
      this.checkGitHooks(),
      this.checkContextBlock(),
      this.checkSkillPermissions(),
      this.checkDirectories(flags)
    ]);
    let status = "healthy";
    const hooksList = [hooks.preCommit, hooks.commitMsg, hooks.postCommit];
    const hasHookErrors = hooksList.some((h) => !h.installed || !h.signed);
    const hasHookWarnings = hooksList.some((h) => h.installed && !h.executable);
    const hasContextErrors = !contextBlock.present;
    const hasContextWarnings = contextBlock.present && !contextBlock.upToDate;
    const hasPermissionErrors = !permissions.present || permissions.missing.length > 0;
    const hasDirectoryWarnings = directories.missing.length > 0;
    if (hasHookErrors || hasContextErrors || hasPermissionErrors) {
      status = "error";
    } else if (hasHookWarnings || hasContextWarnings || hasDirectoryWarnings) {
      status = "warning";
    }
    return {
      status,
      hooks,
      contextBlock,
      permissions,
      directories
    };
  }
};

// packages/tiny-brain-core/src/services/api/skill-loader.ts
import * as fs10 from "fs/promises";
import * as path11 from "path";
var SkillLoader = class {
  skillsPath;
  cache = /* @__PURE__ */ new Map();
  constructor(skillsPath) {
    this.skillsPath = skillsPath;
  }
  async loadSkill(skillName) {
    const cached = this.cache.get(skillName);
    if (cached) {
      return cached;
    }
    const skillPath = path11.join(this.skillsPath, skillName);
    const skillFile = path11.join(skillPath, "SKILL.md");
    const content = await fs10.readFile(skillFile, "utf-8");
    const { metadata, body } = this.parseFrontmatter(content);
    const templates = await this.loadTemplates(skillPath);
    const skill = {
      name: metadata.name || skillName,
      version: metadata.version || "1.0.0",
      description: metadata.description || "",
      systemPrompt: body.trim(),
      templates
    };
    this.cache.set(skillName, skill);
    return skill;
  }
  parseFrontmatter(content) {
    if (!content.startsWith("---")) {
      return {
        metadata: {},
        body: content
      };
    }
    const endIndex = content.indexOf("---", 3);
    if (endIndex === -1) {
      return {
        metadata: {},
        body: content
      };
    }
    const yamlContent = content.slice(3, endIndex).trim();
    const body = content.slice(endIndex + 3).trim();
    let metadata = {};
    if (yamlContent) {
      try {
        metadata = jsYaml.load(yamlContent);
      } catch {
        metadata = {};
      }
    }
    return { metadata, body };
  }
  async loadTemplates(skillPath) {
    const templatesPath = path11.join(skillPath, "templates");
    const templates = {};
    try {
      const entries = await fs10.readdir(templatesPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith(".md")) {
          const templatePath = path11.join(templatesPath, entry.name);
          const content = await fs10.readFile(templatePath, "utf-8");
          templates[entry.name] = content;
        }
      }
    } catch (error) {
      const err = error;
      if (err.code === "ENOENT") {
        return {};
      }
      throw error;
    }
    return templates;
  }
  /**
   * Clear the skill cache
   */
  clearCache() {
    this.cache.clear();
  }
};

// node_modules/@anthropic-ai/sdk/internal/tslib.mjs
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

// node_modules/@anthropic-ai/sdk/internal/utils/uuid.mjs
var uuid4 = function() {
  const { crypto: crypto4 } = globalThis;
  if (crypto4?.randomUUID) {
    uuid4 = crypto4.randomUUID.bind(crypto4);
    return crypto4.randomUUID();
  }
  const u8 = new Uint8Array(1);
  const randomByte = crypto4 ? () => crypto4.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
};

// node_modules/@anthropic-ai/sdk/internal/errors.mjs
function isAbortError(err) {
  return typeof err === "object" && err !== null && // Spec-compliant fetch implementations
  ("name" in err && err.name === "AbortError" || // Expo fetch
  "message" in err && String(err.message).includes("FetchRequestCanceledException"));
}
var castToError = (err) => {
  if (err instanceof Error)
    return err;
  if (typeof err === "object" && err !== null) {
    try {
      if (Object.prototype.toString.call(err) === "[object Error]") {
        const error = new Error(err.message, err.cause ? { cause: err.cause } : {});
        if (err.stack)
          error.stack = err.stack;
        if (err.cause && !error.cause)
          error.cause = err.cause;
        if (err.name)
          error.name = err.name;
        return error;
      }
    } catch {
    }
    try {
      return new Error(JSON.stringify(err));
    } catch {
    }
  }
  return new Error(err);
};

// node_modules/@anthropic-ai/sdk/core/error.mjs
var AnthropicError = class extends Error {
};
var APIError = class _APIError extends AnthropicError {
  constructor(status, error, message, headers) {
    super(`${_APIError.makeMessage(status, error, message)}`);
    this.status = status;
    this.headers = headers;
    this.requestID = headers?.get("request-id");
    this.error = error;
  }
  static makeMessage(status, error, message) {
    const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
    if (status && msg) {
      return `${status} ${msg}`;
    }
    if (status) {
      return `${status} status code (no body)`;
    }
    if (msg) {
      return msg;
    }
    return "(no status code or body)";
  }
  static generate(status, errorResponse, message, headers) {
    if (!status || !headers) {
      return new APIConnectionError({ message, cause: castToError(errorResponse) });
    }
    const error = errorResponse;
    if (status === 400) {
      return new BadRequestError(status, error, message, headers);
    }
    if (status === 401) {
      return new AuthenticationError(status, error, message, headers);
    }
    if (status === 403) {
      return new PermissionDeniedError(status, error, message, headers);
    }
    if (status === 404) {
      return new NotFoundError(status, error, message, headers);
    }
    if (status === 409) {
      return new ConflictError(status, error, message, headers);
    }
    if (status === 422) {
      return new UnprocessableEntityError(status, error, message, headers);
    }
    if (status === 429) {
      return new RateLimitError(status, error, message, headers);
    }
    if (status >= 500) {
      return new InternalServerError(status, error, message, headers);
    }
    return new _APIError(status, error, message, headers);
  }
};
var APIUserAbortError = class extends APIError {
  constructor({ message } = {}) {
    super(void 0, void 0, message || "Request was aborted.", void 0);
  }
};
var APIConnectionError = class extends APIError {
  constructor({ message, cause }) {
    super(void 0, void 0, message || "Connection error.", void 0);
    if (cause)
      this.cause = cause;
  }
};
var APIConnectionTimeoutError = class extends APIConnectionError {
  constructor({ message } = {}) {
    super({ message: message ?? "Request timed out." });
  }
};
var BadRequestError = class extends APIError {
};
var AuthenticationError = class extends APIError {
};
var PermissionDeniedError = class extends APIError {
};
var NotFoundError = class extends APIError {
};
var ConflictError = class extends APIError {
};
var UnprocessableEntityError = class extends APIError {
};
var RateLimitError = class extends APIError {
};
var InternalServerError = class extends APIError {
};

// node_modules/@anthropic-ai/sdk/internal/utils/values.mjs
var startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
var isAbsoluteURL = (url) => {
  return startsWithSchemeRegexp.test(url);
};
var isArray = (val) => (isArray = Array.isArray, isArray(val));
var isReadonlyArray = isArray;
function maybeObj(x) {
  if (typeof x !== "object") {
    return {};
  }
  return x ?? {};
}
function isEmptyObj(obj) {
  if (!obj)
    return true;
  for (const _k in obj)
    return false;
  return true;
}
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
var validatePositiveInteger = (name, n) => {
  if (typeof n !== "number" || !Number.isInteger(n)) {
    throw new AnthropicError(`${name} must be an integer`);
  }
  if (n < 0) {
    throw new AnthropicError(`${name} must be a positive integer`);
  }
  return n;
};
var safeJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return void 0;
  }
};

// node_modules/@anthropic-ai/sdk/internal/utils/sleep.mjs
var sleep = (ms) => new Promise((resolve3) => setTimeout(resolve3, ms));

// node_modules/@anthropic-ai/sdk/version.mjs
var VERSION = "0.71.2";

// node_modules/@anthropic-ai/sdk/internal/detect-platform.mjs
var isRunningInBrowser = () => {
  return (
    // @ts-ignore
    typeof window !== "undefined" && // @ts-ignore
    typeof window.document !== "undefined" && // @ts-ignore
    typeof navigator !== "undefined"
  );
};
function getDetectedPlatform() {
  if (typeof Deno !== "undefined" && Deno.build != null) {
    return "deno";
  }
  if (typeof EdgeRuntime !== "undefined") {
    return "edge";
  }
  if (Object.prototype.toString.call(typeof globalThis.process !== "undefined" ? globalThis.process : 0) === "[object process]") {
    return "node";
  }
  return "unknown";
}
var getPlatformProperties = () => {
  const detectedPlatform = getDetectedPlatform();
  if (detectedPlatform === "deno") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": normalizePlatform(Deno.build.os),
      "X-Stainless-Arch": normalizeArch(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
    };
  }
  if (typeof EdgeRuntime !== "undefined") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": globalThis.process.version
    };
  }
  if (detectedPlatform === "node") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": normalizePlatform(globalThis.process.platform ?? "unknown"),
      "X-Stainless-Arch": normalizeArch(globalThis.process.arch ?? "unknown"),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
    };
  }
  const browserInfo = getBrowserInfo();
  if (browserInfo) {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
      "X-Stainless-Runtime-Version": browserInfo.version
    };
  }
  return {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": VERSION,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
};
function getBrowserInfo() {
  if (typeof navigator === "undefined" || !navigator) {
    return null;
  }
  const browserPatterns = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (const { key, pattern } of browserPatterns) {
    const match3 = pattern.exec(navigator.userAgent);
    if (match3) {
      const major = match3[1] || 0;
      const minor = match3[2] || 0;
      const patch = match3[3] || 0;
      return { browser: key, version: `${major}.${minor}.${patch}` };
    }
  }
  return null;
}
var normalizeArch = (arch) => {
  if (arch === "x32")
    return "x32";
  if (arch === "x86_64" || arch === "x64")
    return "x64";
  if (arch === "arm")
    return "arm";
  if (arch === "aarch64" || arch === "arm64")
    return "arm64";
  if (arch)
    return `other:${arch}`;
  return "unknown";
};
var normalizePlatform = (platform) => {
  platform = platform.toLowerCase();
  if (platform.includes("ios"))
    return "iOS";
  if (platform === "android")
    return "Android";
  if (platform === "darwin")
    return "MacOS";
  if (platform === "win32")
    return "Windows";
  if (platform === "freebsd")
    return "FreeBSD";
  if (platform === "openbsd")
    return "OpenBSD";
  if (platform === "linux")
    return "Linux";
  if (platform)
    return `Other:${platform}`;
  return "Unknown";
};
var _platformHeaders;
var getPlatformHeaders = () => {
  return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
};

// node_modules/@anthropic-ai/sdk/internal/shims.mjs
function getDefaultFetch() {
  if (typeof fetch !== "undefined") {
    return fetch;
  }
  throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function makeReadableStream(...args) {
  const ReadableStream2 = globalThis.ReadableStream;
  if (typeof ReadableStream2 === "undefined") {
    throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  }
  return new ReadableStream2(...args);
}
function ReadableStreamFrom(iterable) {
  let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
  return makeReadableStream({
    start() {
    },
    async pull(controller) {
      const { done, value } = await iter.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
    async cancel() {
      await iter.return?.();
    }
  });
}
function ReadableStreamToAsyncIterable(stream3) {
  if (stream3[Symbol.asyncIterator])
    return stream3;
  const reader = stream3.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (result?.done)
          reader.releaseLock();
        return result;
      } catch (e) {
        reader.releaseLock();
        throw e;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
async function CancelReadableStream(stream3) {
  if (stream3 === null || typeof stream3 !== "object")
    return;
  if (stream3[Symbol.asyncIterator]) {
    await stream3[Symbol.asyncIterator]().return?.();
    return;
  }
  const reader = stream3.getReader();
  const cancelPromise = reader.cancel();
  reader.releaseLock();
  await cancelPromise;
}

// node_modules/@anthropic-ai/sdk/internal/request-options.mjs
var FallbackEncoder = ({ headers, body }) => {
  return {
    bodyHeaders: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  };
};

// node_modules/@anthropic-ai/sdk/internal/utils/bytes.mjs
function concatBytes(buffers) {
  let length = 0;
  for (const buffer of buffers) {
    length += buffer.length;
  }
  const output = new Uint8Array(length);
  let index = 0;
  for (const buffer of buffers) {
    output.set(buffer, index);
    index += buffer.length;
  }
  return output;
}
var encodeUTF8_;
function encodeUTF8(str2) {
  let encoder;
  return (encodeUTF8_ ?? (encoder = new globalThis.TextEncoder(), encodeUTF8_ = encoder.encode.bind(encoder)))(str2);
}
var decodeUTF8_;
function decodeUTF8(bytes) {
  let decoder;
  return (decodeUTF8_ ?? (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
}

// node_modules/@anthropic-ai/sdk/internal/decoders/line.mjs
var _LineDecoder_buffer;
var _LineDecoder_carriageReturnIndex;
var LineDecoder = class {
  constructor() {
    _LineDecoder_buffer.set(this, void 0);
    _LineDecoder_carriageReturnIndex.set(this, void 0);
    __classPrivateFieldSet(this, _LineDecoder_buffer, new Uint8Array(), "f");
    __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
  }
  decode(chunk2) {
    if (chunk2 == null) {
      return [];
    }
    const binaryChunk = chunk2 instanceof ArrayBuffer ? new Uint8Array(chunk2) : typeof chunk2 === "string" ? encodeUTF8(chunk2) : chunk2;
    __classPrivateFieldSet(this, _LineDecoder_buffer, concatBytes([__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), binaryChunk]), "f");
    const lines = [];
    let patternIndex;
    while ((patternIndex = findNewlineIndex(__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f"))) != null) {
      if (patternIndex.carriage && __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") == null) {
        __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, patternIndex.index, "f");
        continue;
      }
      if (__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") != null && (patternIndex.index !== __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") + 1 || patternIndex.carriage)) {
        lines.push(decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") - 1)));
        __classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f")), "f");
        __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
        continue;
      }
      const endIndex = __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") !== null ? patternIndex.preceding - 1 : patternIndex.preceding;
      const line = decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, endIndex));
      lines.push(line);
      __classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(patternIndex.index), "f");
      __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
    }
    return lines;
  }
  flush() {
    if (!__classPrivateFieldGet(this, _LineDecoder_buffer, "f").length) {
      return [];
    }
    return this.decode("\n");
  }
};
_LineDecoder_buffer = /* @__PURE__ */ new WeakMap(), _LineDecoder_carriageReturnIndex = /* @__PURE__ */ new WeakMap();
LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
function findNewlineIndex(buffer, startIndex) {
  const newline = 10;
  const carriage = 13;
  for (let i = startIndex ?? 0; i < buffer.length; i++) {
    if (buffer[i] === newline) {
      return { preceding: i, index: i + 1, carriage: false };
    }
    if (buffer[i] === carriage) {
      return { preceding: i, index: i + 1, carriage: true };
    }
  }
  return null;
}
function findDoubleNewlineIndex(buffer) {
  const newline = 10;
  const carriage = 13;
  for (let i = 0; i < buffer.length - 1; i++) {
    if (buffer[i] === newline && buffer[i + 1] === newline) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === carriage) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) {
      return i + 4;
    }
  }
  return -1;
}

// node_modules/@anthropic-ai/sdk/internal/utils/log.mjs
var levelNumbers = {
  off: 0,
  error: 200,
  warn: 300,
  info: 400,
  debug: 500
};
var parseLogLevel = (maybeLevel, sourceName, client) => {
  if (!maybeLevel) {
    return void 0;
  }
  if (hasOwn(levelNumbers, maybeLevel)) {
    return maybeLevel;
  }
  loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
  return void 0;
};
function noop() {
}
function makeLogFn(fnLevel, logger, logLevel) {
  if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) {
    return noop;
  } else {
    return logger[fnLevel].bind(logger);
  }
}
var noopLogger = {
  error: noop,
  warn: noop,
  info: noop,
  debug: noop
};
var cachedLoggers = /* @__PURE__ */ new WeakMap();
function loggerFor(client) {
  const logger = client.logger;
  const logLevel = client.logLevel ?? "off";
  if (!logger) {
    return noopLogger;
  }
  const cachedLogger = cachedLoggers.get(logger);
  if (cachedLogger && cachedLogger[0] === logLevel) {
    return cachedLogger[1];
  }
  const levelLogger = {
    error: makeLogFn("error", logger, logLevel),
    warn: makeLogFn("warn", logger, logLevel),
    info: makeLogFn("info", logger, logLevel),
    debug: makeLogFn("debug", logger, logLevel)
  };
  cachedLoggers.set(logger, [logLevel, levelLogger]);
  return levelLogger;
}
var formatRequestDetails = (details) => {
  if (details.options) {
    details.options = { ...details.options };
    delete details.options["headers"];
  }
  if (details.headers) {
    details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [
      name,
      name.toLowerCase() === "x-api-key" || name.toLowerCase() === "authorization" || name.toLowerCase() === "cookie" || name.toLowerCase() === "set-cookie" ? "***" : value
    ]));
  }
  if ("retryOfRequestLogID" in details) {
    if (details.retryOfRequestLogID) {
      details.retryOf = details.retryOfRequestLogID;
    }
    delete details.retryOfRequestLogID;
  }
  return details;
};

// node_modules/@anthropic-ai/sdk/core/streaming.mjs
var _Stream_client;
var Stream2 = class _Stream {
  constructor(iterator, controller, client) {
    this.iterator = iterator;
    _Stream_client.set(this, void 0);
    this.controller = controller;
    __classPrivateFieldSet(this, _Stream_client, client, "f");
  }
  static fromSSEResponse(response, controller, client) {
    let consumed = false;
    const logger = client ? loggerFor(client) : console;
    async function* iterator() {
      if (consumed) {
        throw new AnthropicError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      }
      consumed = true;
      let done = false;
      try {
        for await (const sse of _iterSSEMessages(response, controller)) {
          if (sse.event === "completion") {
            try {
              yield JSON.parse(sse.data);
            } catch (e) {
              logger.error(`Could not parse message into JSON:`, sse.data);
              logger.error(`From chunk:`, sse.raw);
              throw e;
            }
          }
          if (sse.event === "message_start" || sse.event === "message_delta" || sse.event === "message_stop" || sse.event === "content_block_start" || sse.event === "content_block_delta" || sse.event === "content_block_stop") {
            try {
              yield JSON.parse(sse.data);
            } catch (e) {
              logger.error(`Could not parse message into JSON:`, sse.data);
              logger.error(`From chunk:`, sse.raw);
              throw e;
            }
          }
          if (sse.event === "ping") {
            continue;
          }
          if (sse.event === "error") {
            throw new APIError(void 0, safeJSON(sse.data) ?? sse.data, void 0, response.headers);
          }
        }
        done = true;
      } catch (e) {
        if (isAbortError(e))
          return;
        throw e;
      } finally {
        if (!done)
          controller.abort();
      }
    }
    return new _Stream(iterator, controller, client);
  }
  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream(readableStream, controller, client) {
    let consumed = false;
    async function* iterLines() {
      const lineDecoder = new LineDecoder();
      const iter = ReadableStreamToAsyncIterable(readableStream);
      for await (const chunk2 of iter) {
        for (const line of lineDecoder.decode(chunk2)) {
          yield line;
        }
      }
      for (const line of lineDecoder.flush()) {
        yield line;
      }
    }
    async function* iterator() {
      if (consumed) {
        throw new AnthropicError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      }
      consumed = true;
      let done = false;
      try {
        for await (const line of iterLines()) {
          if (done)
            continue;
          if (line)
            yield JSON.parse(line);
        }
        done = true;
      } catch (e) {
        if (isAbortError(e))
          return;
        throw e;
      } finally {
        if (!done)
          controller.abort();
      }
    }
    return new _Stream(iterator, controller, client);
  }
  [(_Stream_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    return this.iterator();
  }
  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee() {
    const left = [];
    const right = [];
    const iterator = this.iterator();
    const teeIterator = (queue) => {
      return {
        next: () => {
          if (queue.length === 0) {
            const result = iterator.next();
            left.push(result);
            right.push(result);
          }
          return queue.shift();
        }
      };
    };
    return [
      new _Stream(() => teeIterator(left), this.controller, __classPrivateFieldGet(this, _Stream_client, "f")),
      new _Stream(() => teeIterator(right), this.controller, __classPrivateFieldGet(this, _Stream_client, "f"))
    ];
  }
  /**
   * Converts this stream to a newline-separated ReadableStream of
   * JSON stringified values in the stream
   * which can be turned back into a Stream with `Stream.fromReadableStream()`.
   */
  toReadableStream() {
    const self = this;
    let iter;
    return makeReadableStream({
      async start() {
        iter = self[Symbol.asyncIterator]();
      },
      async pull(ctrl) {
        try {
          const { value, done } = await iter.next();
          if (done)
            return ctrl.close();
          const bytes = encodeUTF8(JSON.stringify(value) + "\n");
          ctrl.enqueue(bytes);
        } catch (err) {
          ctrl.error(err);
        }
      },
      async cancel() {
        await iter.return?.();
      }
    });
  }
};
async function* _iterSSEMessages(response, controller) {
  if (!response.body) {
    controller.abort();
    if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.product === "ReactNative") {
      throw new AnthropicError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
    }
    throw new AnthropicError(`Attempted to iterate over a response with no body`);
  }
  const sseDecoder = new SSEDecoder();
  const lineDecoder = new LineDecoder();
  const iter = ReadableStreamToAsyncIterable(response.body);
  for await (const sseChunk of iterSSEChunks(iter)) {
    for (const line of lineDecoder.decode(sseChunk)) {
      const sse = sseDecoder.decode(line);
      if (sse)
        yield sse;
    }
  }
  for (const line of lineDecoder.flush()) {
    const sse = sseDecoder.decode(line);
    if (sse)
      yield sse;
  }
}
async function* iterSSEChunks(iterator) {
  let data = new Uint8Array();
  for await (const chunk2 of iterator) {
    if (chunk2 == null) {
      continue;
    }
    const binaryChunk = chunk2 instanceof ArrayBuffer ? new Uint8Array(chunk2) : typeof chunk2 === "string" ? encodeUTF8(chunk2) : chunk2;
    let newData = new Uint8Array(data.length + binaryChunk.length);
    newData.set(data);
    newData.set(binaryChunk, data.length);
    data = newData;
    let patternIndex;
    while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
      yield data.slice(0, patternIndex);
      data = data.slice(patternIndex);
    }
  }
  if (data.length > 0) {
    yield data;
  }
}
var SSEDecoder = class {
  constructor() {
    this.event = null;
    this.data = [];
    this.chunks = [];
  }
  decode(line) {
    if (line.endsWith("\r")) {
      line = line.substring(0, line.length - 1);
    }
    if (!line) {
      if (!this.event && !this.data.length)
        return null;
      const sse = {
        event: this.event,
        data: this.data.join("\n"),
        raw: this.chunks
      };
      this.event = null;
      this.data = [];
      this.chunks = [];
      return sse;
    }
    this.chunks.push(line);
    if (line.startsWith(":")) {
      return null;
    }
    let [fieldname, _, value] = partition(line, ":");
    if (value.startsWith(" ")) {
      value = value.substring(1);
    }
    if (fieldname === "event") {
      this.event = value;
    } else if (fieldname === "data") {
      this.data.push(value);
    }
    return null;
  }
};
function partition(str2, delimiter) {
  const index = str2.indexOf(delimiter);
  if (index !== -1) {
    return [str2.substring(0, index), delimiter, str2.substring(index + delimiter.length)];
  }
  return [str2, "", ""];
}

// node_modules/@anthropic-ai/sdk/internal/parse.mjs
async function defaultParseResponse(client, props) {
  const { response, requestLogID, retryOfRequestLogID, startTime } = props;
  const body = await (async () => {
    if (props.options.stream) {
      loggerFor(client).debug("response", response.status, response.url, response.headers, response.body);
      if (props.options.__streamClass) {
        return props.options.__streamClass.fromSSEResponse(response, props.controller);
      }
      return Stream2.fromSSEResponse(response, props.controller);
    }
    if (response.status === 204) {
      return null;
    }
    if (props.options.__binaryResponse) {
      return response;
    }
    const contentType = response.headers.get("content-type");
    const mediaType = contentType?.split(";")[0]?.trim();
    const isJSON = mediaType?.includes("application/json") || mediaType?.endsWith("+json");
    if (isJSON) {
      const json2 = await response.json();
      return addRequestID(json2, response);
    }
    const text = await response.text();
    return text;
  })();
  loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
    retryOfRequestLogID,
    url: response.url,
    status: response.status,
    body,
    durationMs: Date.now() - startTime
  }));
  return body;
}
function addRequestID(value, response) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }
  return Object.defineProperty(value, "_request_id", {
    value: response.headers.get("request-id"),
    enumerable: false
  });
}

// node_modules/@anthropic-ai/sdk/core/api-promise.mjs
var _APIPromise_client;
var APIPromise = class _APIPromise extends Promise {
  constructor(client, responsePromise, parseResponse = defaultParseResponse) {
    super((resolve3) => {
      resolve3(null);
    });
    this.responsePromise = responsePromise;
    this.parseResponse = parseResponse;
    _APIPromise_client.set(this, void 0);
    __classPrivateFieldSet(this, _APIPromise_client, client, "f");
  }
  _thenUnwrap(transform) {
    return new _APIPromise(__classPrivateFieldGet(this, _APIPromise_client, "f"), this.responsePromise, async (client, props) => addRequestID(transform(await this.parseResponse(client, props), props), props.response));
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
   * to your `tsconfig.json`.
   */
  asResponse() {
    return this.responsePromise.then((p) => p.response);
  }
  /**
   * Gets the parsed response data, the raw `Response` instance and the ID of the request,
   * returned via the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
   * to your `tsconfig.json`.
   */
  async withResponse() {
    const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
    return { data, response, request_id: response.headers.get("request-id") };
  }
  parse() {
    if (!this.parsedPromise) {
      this.parsedPromise = this.responsePromise.then((data) => this.parseResponse(__classPrivateFieldGet(this, _APIPromise_client, "f"), data));
    }
    return this.parsedPromise;
  }
  then(onfulfilled, onrejected) {
    return this.parse().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.parse().catch(onrejected);
  }
  finally(onfinally) {
    return this.parse().finally(onfinally);
  }
};
_APIPromise_client = /* @__PURE__ */ new WeakMap();

// node_modules/@anthropic-ai/sdk/core/pagination.mjs
var _AbstractPage_client;
var AbstractPage = class {
  constructor(client, response, body, options) {
    _AbstractPage_client.set(this, void 0);
    __classPrivateFieldSet(this, _AbstractPage_client, client, "f");
    this.options = options;
    this.response = response;
    this.body = body;
  }
  hasNextPage() {
    const items = this.getPaginatedItems();
    if (!items.length)
      return false;
    return this.nextPageRequestOptions() != null;
  }
  async getNextPage() {
    const nextOptions = this.nextPageRequestOptions();
    if (!nextOptions) {
      throw new AnthropicError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
    }
    return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
  }
  async *iterPages() {
    let page = this;
    yield page;
    while (page.hasNextPage()) {
      page = await page.getNextPage();
      yield page;
    }
  }
  async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    for await (const page of this.iterPages()) {
      for (const item of page.getPaginatedItems()) {
        yield item;
      }
    }
  }
};
var PagePromise = class extends APIPromise {
  constructor(client, request, Page2) {
    super(client, request, async (client2, props) => new Page2(client2, props.response, await defaultParseResponse(client2, props), props.options));
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    const page = await this;
    for await (const item of page) {
      yield item;
    }
  }
};
var Page = class extends AbstractPage {
  constructor(client, response, body, options) {
    super(client, response, body, options);
    this.data = body.data || [];
    this.has_more = body.has_more || false;
    this.first_id = body.first_id || null;
    this.last_id = body.last_id || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    if (this.has_more === false) {
      return false;
    }
    return super.hasNextPage();
  }
  nextPageRequestOptions() {
    if (this.options.query?.["before_id"]) {
      const first_id = this.first_id;
      if (!first_id) {
        return null;
      }
      return {
        ...this.options,
        query: {
          ...maybeObj(this.options.query),
          before_id: first_id
        }
      };
    }
    const cursor = this.last_id;
    if (!cursor) {
      return null;
    }
    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        after_id: cursor
      }
    };
  }
};
var PageCursor = class extends AbstractPage {
  constructor(client, response, body, options) {
    super(client, response, body, options);
    this.data = body.data || [];
    this.has_more = body.has_more || false;
    this.next_page = body.next_page || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    if (this.has_more === false) {
      return false;
    }
    return super.hasNextPage();
  }
  nextPageRequestOptions() {
    const cursor = this.next_page;
    if (!cursor) {
      return null;
    }
    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        page: cursor
      }
    };
  }
};

// node_modules/@anthropic-ai/sdk/internal/uploads.mjs
var checkFileSupport = () => {
  if (typeof File === "undefined") {
    const { process: process2 } = globalThis;
    const isOldNode = typeof process2?.versions?.node === "string" && parseInt(process2.versions.node.split(".")) < 20;
    throw new Error("`File` is not defined as a global, which is required for file uploads." + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
  }
};
function makeFile(fileBits, fileName, options) {
  checkFileSupport();
  return new File(fileBits, fileName ?? "unknown_file", options);
}
function getName(value) {
  return (typeof value === "object" && value !== null && ("name" in value && value.name && String(value.name) || "url" in value && value.url && String(value.url) || "filename" in value && value.filename && String(value.filename) || "path" in value && value.path && String(value.path)) || "").split(/[\\/]/).pop() || void 0;
}
var isAsyncIterable = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
var multipartFormRequestOptions = async (opts, fetch2) => {
  return { ...opts, body: await createForm(opts.body, fetch2) };
};
var supportsFormDataMap = /* @__PURE__ */ new WeakMap();
function supportsFormData(fetchObject) {
  const fetch2 = typeof fetchObject === "function" ? fetchObject : fetchObject.fetch;
  const cached = supportsFormDataMap.get(fetch2);
  if (cached)
    return cached;
  const promise = (async () => {
    try {
      const FetchResponse = "Response" in fetch2 ? fetch2.Response : (await fetch2("data:,")).constructor;
      const data = new FormData();
      if (data.toString() === await new FetchResponse(data).text()) {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  })();
  supportsFormDataMap.set(fetch2, promise);
  return promise;
}
var createForm = async (body, fetch2) => {
  if (!await supportsFormData(fetch2)) {
    throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
  }
  const form = new FormData();
  await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
  return form;
};
var isNamedBlob = (value) => value instanceof Blob && "name" in value;
var addFormValue = async (form, key, value) => {
  if (value === void 0)
    return;
  if (value == null) {
    throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    form.append(key, String(value));
  } else if (value instanceof Response) {
    let options = {};
    const contentType = value.headers.get("Content-Type");
    if (contentType) {
      options = { type: contentType };
    }
    form.append(key, makeFile([await value.blob()], getName(value), options));
  } else if (isAsyncIterable(value)) {
    form.append(key, makeFile([await new Response(ReadableStreamFrom(value)).blob()], getName(value)));
  } else if (isNamedBlob(value)) {
    form.append(key, makeFile([value], getName(value), { type: value.type }));
  } else if (Array.isArray(value)) {
    await Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry)));
  } else if (typeof value === "object") {
    await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
  } else {
    throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
  }
};

// node_modules/@anthropic-ai/sdk/internal/to-file.mjs
var isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
var isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
var isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
async function toFile(value, name, options) {
  checkFileSupport();
  value = await value;
  name || (name = getName(value));
  if (isFileLike(value)) {
    if (value instanceof File && name == null && options == null) {
      return value;
    }
    return makeFile([await value.arrayBuffer()], name ?? value.name, {
      type: value.type,
      lastModified: value.lastModified,
      ...options
    });
  }
  if (isResponseLike(value)) {
    const blob = await value.blob();
    name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
    return makeFile(await getBytes(blob), name, options);
  }
  const parts = await getBytes(value);
  if (!options?.type) {
    const type2 = parts.find((part) => typeof part === "object" && "type" in part && part.type);
    if (typeof type2 === "string") {
      options = { ...options, type: type2 };
    }
  }
  return makeFile(parts, name, options);
}
async function getBytes(value) {
  let parts = [];
  if (typeof value === "string" || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
  value instanceof ArrayBuffer) {
    parts.push(value);
  } else if (isBlobLike(value)) {
    parts.push(value instanceof Blob ? value : await value.arrayBuffer());
  } else if (isAsyncIterable(value)) {
    for await (const chunk2 of value) {
      parts.push(...await getBytes(chunk2));
    }
  } else {
    const constructor = value?.constructor?.name;
    throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ""}${propsForError(value)}`);
  }
  return parts;
}
function propsForError(value) {
  if (typeof value !== "object" || value === null)
    return "";
  const props = Object.getOwnPropertyNames(value);
  return `; props: [${props.map((p) => `"${p}"`).join(", ")}]`;
}

// node_modules/@anthropic-ai/sdk/core/resource.mjs
var APIResource = class {
  constructor(client) {
    this._client = client;
  }
};

// node_modules/@anthropic-ai/sdk/internal/headers.mjs
var brand_privateNullableHeaders = Symbol.for("brand.privateNullableHeaders");
function* iterateHeaders(headers) {
  if (!headers)
    return;
  if (brand_privateNullableHeaders in headers) {
    const { values, nulls } = headers;
    yield* values.entries();
    for (const name of nulls) {
      yield [name, null];
    }
    return;
  }
  let shouldClear = false;
  let iter;
  if (headers instanceof Headers) {
    iter = headers.entries();
  } else if (isReadonlyArray(headers)) {
    iter = headers;
  } else {
    shouldClear = true;
    iter = Object.entries(headers ?? {});
  }
  for (let row of iter) {
    const name = row[0];
    if (typeof name !== "string")
      throw new TypeError("expected header name to be a string");
    const values = isReadonlyArray(row[1]) ? row[1] : [row[1]];
    let didClear = false;
    for (const value of values) {
      if (value === void 0)
        continue;
      if (shouldClear && !didClear) {
        didClear = true;
        yield [name, null];
      }
      yield [name, value];
    }
  }
}
var buildHeaders = (newHeaders) => {
  const targetHeaders = new Headers();
  const nullHeaders = /* @__PURE__ */ new Set();
  for (const headers of newHeaders) {
    const seenHeaders = /* @__PURE__ */ new Set();
    for (const [name, value] of iterateHeaders(headers)) {
      const lowerName = name.toLowerCase();
      if (!seenHeaders.has(lowerName)) {
        targetHeaders.delete(name);
        seenHeaders.add(lowerName);
      }
      if (value === null) {
        targetHeaders.delete(name);
        nullHeaders.add(lowerName);
      } else {
        targetHeaders.append(name, value);
        nullHeaders.delete(lowerName);
      }
    }
  }
  return { [brand_privateNullableHeaders]: true, values: targetHeaders, nulls: nullHeaders };
};

// node_modules/@anthropic-ai/sdk/internal/utils/path.mjs
function encodeURIPath(str2) {
  return str2.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
var EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
var createPathTagFunction = (pathEncoder = encodeURIPath) => function path17(statics, ...params) {
  if (statics.length === 1)
    return statics[0];
  let postPath = false;
  const invalidSegments = [];
  const path18 = statics.reduce((previousValue, currentValue, index) => {
    if (/[?#]/.test(currentValue)) {
      postPath = true;
    }
    const value = params[index];
    let encoded = (postPath ? encodeURIComponent : pathEncoder)("" + value);
    if (index !== params.length && (value == null || typeof value === "object" && // handle values from other realms
    value.toString === Object.getPrototypeOf(Object.getPrototypeOf(value.hasOwnProperty ?? EMPTY) ?? EMPTY)?.toString)) {
      encoded = value + "";
      invalidSegments.push({
        start: previousValue.length + currentValue.length,
        length: encoded.length,
        error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
      });
    }
    return previousValue + currentValue + (index === params.length ? "" : encoded);
  }, "");
  const pathOnly = path18.split(/[?#]/, 1)[0];
  const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
  let match3;
  while ((match3 = invalidSegmentPattern.exec(pathOnly)) !== null) {
    invalidSegments.push({
      start: match3.index,
      length: match3[0].length,
      error: `Value "${match3[0]}" can't be safely passed as a path parameter`
    });
  }
  invalidSegments.sort((a, b) => a.start - b.start);
  if (invalidSegments.length > 0) {
    let lastEnd = 0;
    const underline = invalidSegments.reduce((acc, segment) => {
      const spaces = " ".repeat(segment.start - lastEnd);
      const arrows = "^".repeat(segment.length);
      lastEnd = segment.start + segment.length;
      return acc + spaces + arrows;
    }, "");
    throw new AnthropicError(`Path parameters result in path with invalid segments:
${invalidSegments.map((e) => e.error).join("\n")}
${path18}
${underline}`);
  }
  return path18;
};
var path12 = /* @__PURE__ */ createPathTagFunction(encodeURIPath);

// node_modules/@anthropic-ai/sdk/resources/beta/files.mjs
var Files = class extends APIResource {
  /**
   * List Files
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const fileMetadata of client.beta.files.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/files", Page, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete File
   *
   * @example
   * ```ts
   * const deletedFile = await client.beta.files.delete(
   *   'file_id',
   * );
   * ```
   */
  delete(fileID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.delete(path12`/v1/files/${fileID}`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Download File
   *
   * @example
   * ```ts
   * const response = await client.beta.files.download(
   *   'file_id',
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  download(fileID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path12`/v1/files/${fileID}/content`, {
      ...options,
      headers: buildHeaders([
        {
          "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString(),
          Accept: "application/binary"
        },
        options?.headers
      ]),
      __binaryResponse: true
    });
  }
  /**
   * Get File Metadata
   *
   * @example
   * ```ts
   * const fileMetadata =
   *   await client.beta.files.retrieveMetadata('file_id');
   * ```
   */
  retrieveMetadata(fileID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path12`/v1/files/${fileID}`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Upload File
   *
   * @example
   * ```ts
   * const fileMetadata = await client.beta.files.upload({
   *   file: fs.createReadStream('path/to/file'),
   * });
   * ```
   */
  upload(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/files", multipartFormRequestOptions({
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
        options?.headers
      ])
    }, this._client));
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/models.mjs
var Models = class extends APIResource {
  /**
   * Get a specific model.
   *
   * The Models API response can be used to determine information about a specific
   * model or resolve a model alias to a model ID.
   *
   * @example
   * ```ts
   * const betaModelInfo = await client.beta.models.retrieve(
   *   'model_id',
   * );
   * ```
   */
  retrieve(modelID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path12`/v1/models/${modelID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
        options?.headers
      ])
    });
  }
  /**
   * List available models.
   *
   * The Models API response can be used to determine which models are available for
   * use in the API. More recently released models are listed first.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaModelInfo of client.beta.models.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/models?beta=true", Page, {
      query,
      ...options,
      headers: buildHeaders([
        { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/internal/constants.mjs
var MODEL_NONSTREAMING_TOKENS = {
  "claude-opus-4-20250514": 8192,
  "claude-opus-4-0": 8192,
  "claude-4-opus-20250514": 8192,
  "anthropic.claude-opus-4-20250514-v1:0": 8192,
  "claude-opus-4@20250514": 8192,
  "claude-opus-4-1-20250805": 8192,
  "anthropic.claude-opus-4-1-20250805-v1:0": 8192,
  "claude-opus-4-1@20250805": 8192
};

// node_modules/@anthropic-ai/sdk/lib/beta-parser.mjs
function maybeParseBetaMessage(message, params, opts) {
  if (!params || !("parse" in (params.output_format ?? {}))) {
    return {
      ...message,
      content: message.content.map((block) => {
        if (block.type === "text") {
          const parsedBlock = Object.defineProperty({ ...block }, "parsed_output", {
            value: null,
            enumerable: false
          });
          return Object.defineProperty(parsedBlock, "parsed", {
            get() {
              opts.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead.");
              return null;
            },
            enumerable: false
          });
        }
        return block;
      }),
      parsed_output: null
    };
  }
  return parseBetaMessage(message, params, opts);
}
function parseBetaMessage(message, params, opts) {
  let firstParsedOutput = null;
  const content = message.content.map((block) => {
    if (block.type === "text") {
      const parsedOutput = parseBetaOutputFormat(params, block.text);
      if (firstParsedOutput === null) {
        firstParsedOutput = parsedOutput;
      }
      const parsedBlock = Object.defineProperty({ ...block }, "parsed_output", {
        value: parsedOutput,
        enumerable: false
      });
      return Object.defineProperty(parsedBlock, "parsed", {
        get() {
          opts.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead.");
          return parsedOutput;
        },
        enumerable: false
      });
    }
    return block;
  });
  return {
    ...message,
    content,
    parsed_output: firstParsedOutput
  };
}
function parseBetaOutputFormat(params, content) {
  if (params.output_format?.type !== "json_schema") {
    return null;
  }
  try {
    if ("parse" in params.output_format) {
      return params.output_format.parse(content);
    }
    return JSON.parse(content);
  } catch (error) {
    throw new AnthropicError(`Failed to parse structured output: ${error}`);
  }
}

// node_modules/@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs
var tokenize = (input) => {
  let current = 0;
  let tokens = [];
  while (current < input.length) {
    let char = input[current];
    if (char === "\\") {
      current++;
      continue;
    }
    if (char === "{") {
      tokens.push({
        type: "brace",
        value: "{"
      });
      current++;
      continue;
    }
    if (char === "}") {
      tokens.push({
        type: "brace",
        value: "}"
      });
      current++;
      continue;
    }
    if (char === "[") {
      tokens.push({
        type: "paren",
        value: "["
      });
      current++;
      continue;
    }
    if (char === "]") {
      tokens.push({
        type: "paren",
        value: "]"
      });
      current++;
      continue;
    }
    if (char === ":") {
      tokens.push({
        type: "separator",
        value: ":"
      });
      current++;
      continue;
    }
    if (char === ",") {
      tokens.push({
        type: "delimiter",
        value: ","
      });
      current++;
      continue;
    }
    if (char === '"') {
      let value = "";
      let danglingQuote = false;
      char = input[++current];
      while (char !== '"') {
        if (current === input.length) {
          danglingQuote = true;
          break;
        }
        if (char === "\\") {
          current++;
          if (current === input.length) {
            danglingQuote = true;
            break;
          }
          value += char + input[current];
          char = input[++current];
        } else {
          value += char;
          char = input[++current];
        }
      }
      char = input[++current];
      if (!danglingQuote) {
        tokens.push({
          type: "string",
          value
        });
      }
      continue;
    }
    let WHITESPACE = /\s/;
    if (char && WHITESPACE.test(char)) {
      current++;
      continue;
    }
    let NUMBERS = /[0-9]/;
    if (char && NUMBERS.test(char) || char === "-" || char === ".") {
      let value = "";
      if (char === "-") {
        value += char;
        char = input[++current];
      }
      while (char && NUMBERS.test(char) || char === ".") {
        value += char;
        char = input[++current];
      }
      tokens.push({
        type: "number",
        value
      });
      continue;
    }
    let LETTERS = /[a-z]/i;
    if (char && LETTERS.test(char)) {
      let value = "";
      while (char && LETTERS.test(char)) {
        if (current === input.length) {
          break;
        }
        value += char;
        char = input[++current];
      }
      if (value == "true" || value == "false" || value === "null") {
        tokens.push({
          type: "name",
          value
        });
      } else {
        current++;
        continue;
      }
      continue;
    }
    current++;
  }
  return tokens;
};
var strip = (tokens) => {
  if (tokens.length === 0) {
    return tokens;
  }
  let lastToken = tokens[tokens.length - 1];
  switch (lastToken.type) {
    case "separator":
      tokens = tokens.slice(0, tokens.length - 1);
      return strip(tokens);
      break;
    case "number":
      let lastCharacterOfLastToken = lastToken.value[lastToken.value.length - 1];
      if (lastCharacterOfLastToken === "." || lastCharacterOfLastToken === "-") {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      }
    case "string":
      let tokenBeforeTheLastToken = tokens[tokens.length - 2];
      if (tokenBeforeTheLastToken?.type === "delimiter") {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      } else if (tokenBeforeTheLastToken?.type === "brace" && tokenBeforeTheLastToken.value === "{") {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      }
      break;
    case "delimiter":
      tokens = tokens.slice(0, tokens.length - 1);
      return strip(tokens);
      break;
  }
  return tokens;
};
var unstrip = (tokens) => {
  let tail = [];
  tokens.map((token) => {
    if (token.type === "brace") {
      if (token.value === "{") {
        tail.push("}");
      } else {
        tail.splice(tail.lastIndexOf("}"), 1);
      }
    }
    if (token.type === "paren") {
      if (token.value === "[") {
        tail.push("]");
      } else {
        tail.splice(tail.lastIndexOf("]"), 1);
      }
    }
  });
  if (tail.length > 0) {
    tail.reverse().map((item) => {
      if (item === "}") {
        tokens.push({
          type: "brace",
          value: "}"
        });
      } else if (item === "]") {
        tokens.push({
          type: "paren",
          value: "]"
        });
      }
    });
  }
  return tokens;
};
var generate = (tokens) => {
  let output = "";
  tokens.map((token) => {
    switch (token.type) {
      case "string":
        output += '"' + token.value + '"';
        break;
      default:
        output += token.value;
        break;
    }
  });
  return output;
};
var partialParse = (input) => JSON.parse(generate(unstrip(strip(tokenize(input)))));

// node_modules/@anthropic-ai/sdk/lib/BetaMessageStream.mjs
var _BetaMessageStream_instances;
var _BetaMessageStream_currentMessageSnapshot;
var _BetaMessageStream_params;
var _BetaMessageStream_connectedPromise;
var _BetaMessageStream_resolveConnectedPromise;
var _BetaMessageStream_rejectConnectedPromise;
var _BetaMessageStream_endPromise;
var _BetaMessageStream_resolveEndPromise;
var _BetaMessageStream_rejectEndPromise;
var _BetaMessageStream_listeners;
var _BetaMessageStream_ended;
var _BetaMessageStream_errored;
var _BetaMessageStream_aborted;
var _BetaMessageStream_catchingPromiseCreated;
var _BetaMessageStream_response;
var _BetaMessageStream_request_id;
var _BetaMessageStream_logger;
var _BetaMessageStream_getFinalMessage;
var _BetaMessageStream_getFinalText;
var _BetaMessageStream_handleError;
var _BetaMessageStream_beginRequest;
var _BetaMessageStream_addStreamEvent;
var _BetaMessageStream_endRequest;
var _BetaMessageStream_accumulateMessage;
var JSON_BUF_PROPERTY = "__json_buf";
function tracksToolInput(content) {
  return content.type === "tool_use" || content.type === "server_tool_use" || content.type === "mcp_tool_use";
}
var BetaMessageStream = class _BetaMessageStream {
  constructor(params, opts) {
    _BetaMessageStream_instances.add(this);
    this.messages = [];
    this.receivedMessages = [];
    _BetaMessageStream_currentMessageSnapshot.set(this, void 0);
    _BetaMessageStream_params.set(this, null);
    this.controller = new AbortController();
    _BetaMessageStream_connectedPromise.set(this, void 0);
    _BetaMessageStream_resolveConnectedPromise.set(this, () => {
    });
    _BetaMessageStream_rejectConnectedPromise.set(this, () => {
    });
    _BetaMessageStream_endPromise.set(this, void 0);
    _BetaMessageStream_resolveEndPromise.set(this, () => {
    });
    _BetaMessageStream_rejectEndPromise.set(this, () => {
    });
    _BetaMessageStream_listeners.set(this, {});
    _BetaMessageStream_ended.set(this, false);
    _BetaMessageStream_errored.set(this, false);
    _BetaMessageStream_aborted.set(this, false);
    _BetaMessageStream_catchingPromiseCreated.set(this, false);
    _BetaMessageStream_response.set(this, void 0);
    _BetaMessageStream_request_id.set(this, void 0);
    _BetaMessageStream_logger.set(this, void 0);
    _BetaMessageStream_handleError.set(this, (error) => {
      __classPrivateFieldSet(this, _BetaMessageStream_errored, true, "f");
      if (isAbortError(error)) {
        error = new APIUserAbortError();
      }
      if (error instanceof APIUserAbortError) {
        __classPrivateFieldSet(this, _BetaMessageStream_aborted, true, "f");
        return this._emit("abort", error);
      }
      if (error instanceof AnthropicError) {
        return this._emit("error", error);
      }
      if (error instanceof Error) {
        const anthropicError = new AnthropicError(error.message);
        anthropicError.cause = error;
        return this._emit("error", anthropicError);
      }
      return this._emit("error", new AnthropicError(String(error)));
    });
    __classPrivateFieldSet(this, _BetaMessageStream_connectedPromise, new Promise((resolve3, reject) => {
      __classPrivateFieldSet(this, _BetaMessageStream_resolveConnectedPromise, resolve3, "f");
      __classPrivateFieldSet(this, _BetaMessageStream_rejectConnectedPromise, reject, "f");
    }), "f");
    __classPrivateFieldSet(this, _BetaMessageStream_endPromise, new Promise((resolve3, reject) => {
      __classPrivateFieldSet(this, _BetaMessageStream_resolveEndPromise, resolve3, "f");
      __classPrivateFieldSet(this, _BetaMessageStream_rejectEndPromise, reject, "f");
    }), "f");
    __classPrivateFieldGet(this, _BetaMessageStream_connectedPromise, "f").catch(() => {
    });
    __classPrivateFieldGet(this, _BetaMessageStream_endPromise, "f").catch(() => {
    });
    __classPrivateFieldSet(this, _BetaMessageStream_params, params, "f");
    __classPrivateFieldSet(this, _BetaMessageStream_logger, opts?.logger ?? console, "f");
  }
  get response() {
    return __classPrivateFieldGet(this, _BetaMessageStream_response, "f");
  }
  get request_id() {
    return __classPrivateFieldGet(this, _BetaMessageStream_request_id, "f");
  }
  /**
   * Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
   * returned vie the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * This is the same as the `APIPromise.withResponse()` method.
   *
   * This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
   * as no `Response` is available.
   */
  async withResponse() {
    __classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, true, "f");
    const response = await __classPrivateFieldGet(this, _BetaMessageStream_connectedPromise, "f");
    if (!response) {
      throw new Error("Could not resolve a `Response` object");
    }
    return {
      data: this,
      response,
      request_id: response.headers.get("request-id")
    };
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(stream3) {
    const runner = new _BetaMessageStream(null);
    runner._run(() => runner._fromReadableStream(stream3));
    return runner;
  }
  static createMessage(messages, params, options, { logger } = {}) {
    const runner = new _BetaMessageStream(params, { logger });
    for (const message of params.messages) {
      runner._addMessageParam(message);
    }
    __classPrivateFieldSet(runner, _BetaMessageStream_params, { ...params, stream: true }, "f");
    runner._run(() => runner._createMessage(messages, { ...params, stream: true }, { ...options, headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" } }));
    return runner;
  }
  _run(executor) {
    executor().then(() => {
      this._emitFinal();
      this._emit("end");
    }, __classPrivateFieldGet(this, _BetaMessageStream_handleError, "f"));
  }
  _addMessageParam(message) {
    this.messages.push(message);
  }
  _addMessage(message, emit = true) {
    this.receivedMessages.push(message);
    if (emit) {
      this._emit("message", message);
    }
  }
  async _createMessage(messages, params, options) {
    const signal = options?.signal;
    let abortHandler;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      abortHandler = this.controller.abort.bind(this.controller);
      signal.addEventListener("abort", abortHandler);
    }
    try {
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_beginRequest).call(this);
      const { response, data: stream3 } = await messages.create({ ...params, stream: true }, { ...options, signal: this.controller.signal }).withResponse();
      this._connected(response);
      for await (const event of stream3) {
        __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_addStreamEvent).call(this, event);
      }
      if (stream3.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_endRequest).call(this);
    } finally {
      if (signal && abortHandler) {
        signal.removeEventListener("abort", abortHandler);
      }
    }
  }
  _connected(response) {
    if (this.ended)
      return;
    __classPrivateFieldSet(this, _BetaMessageStream_response, response, "f");
    __classPrivateFieldSet(this, _BetaMessageStream_request_id, response?.headers.get("request-id"), "f");
    __classPrivateFieldGet(this, _BetaMessageStream_resolveConnectedPromise, "f").call(this, response);
    this._emit("connect");
  }
  get ended() {
    return __classPrivateFieldGet(this, _BetaMessageStream_ended, "f");
  }
  get errored() {
    return __classPrivateFieldGet(this, _BetaMessageStream_errored, "f");
  }
  get aborted() {
    return __classPrivateFieldGet(this, _BetaMessageStream_aborted, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this MessageStream, so that calls can be chained
   */
  on(event, listener) {
    const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = []);
    listeners.push({ listener });
    return this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this MessageStream, so that calls can be chained
   */
  off(event, listener) {
    const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event];
    if (!listeners)
      return this;
    const index = listeners.findIndex((l) => l.listener === listener);
    if (index >= 0)
      listeners.splice(index, 1);
    return this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this MessageStream, so that calls can be chained
   */
  once(event, listener) {
    const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = []);
    listeners.push({ listener, once: true });
    return this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(event) {
    return new Promise((resolve3, reject) => {
      __classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, true, "f");
      if (event !== "error")
        this.once("error", reject);
      this.once(event, resolve3);
    });
  }
  async done() {
    __classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, true, "f");
    await __classPrivateFieldGet(this, _BetaMessageStream_endPromise, "f");
  }
  get currentMessage() {
    return __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
  }
  /**
   * @returns a promise that resolves with the the final assistant Message response,
   * or rejects if an error occurred or the stream ended prematurely without producing a Message.
   * If structured outputs were used, this will be a ParsedMessage with a `parsed` field.
   */
  async finalMessage() {
    await this.done();
    return __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalMessage).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant Message's text response, concatenated
   * together if there are more than one text blocks.
   * Rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalText() {
    await this.done();
    return __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalText).call(this);
  }
  _emit(event, ...args) {
    if (__classPrivateFieldGet(this, _BetaMessageStream_ended, "f"))
      return;
    if (event === "end") {
      __classPrivateFieldSet(this, _BetaMessageStream_ended, true, "f");
      __classPrivateFieldGet(this, _BetaMessageStream_resolveEndPromise, "f").call(this);
    }
    const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event];
    if (listeners) {
      __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
      listeners.forEach(({ listener }) => listener(...args));
    }
    if (event === "abort") {
      const error = args[0];
      if (!__classPrivateFieldGet(this, _BetaMessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
        Promise.reject(error);
      }
      __classPrivateFieldGet(this, _BetaMessageStream_rejectConnectedPromise, "f").call(this, error);
      __classPrivateFieldGet(this, _BetaMessageStream_rejectEndPromise, "f").call(this, error);
      this._emit("end");
      return;
    }
    if (event === "error") {
      const error = args[0];
      if (!__classPrivateFieldGet(this, _BetaMessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
        Promise.reject(error);
      }
      __classPrivateFieldGet(this, _BetaMessageStream_rejectConnectedPromise, "f").call(this, error);
      __classPrivateFieldGet(this, _BetaMessageStream_rejectEndPromise, "f").call(this, error);
      this._emit("end");
    }
  }
  _emitFinal() {
    const finalMessage = this.receivedMessages.at(-1);
    if (finalMessage) {
      this._emit("finalMessage", __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalMessage).call(this));
    }
  }
  async _fromReadableStream(readableStream, options) {
    const signal = options?.signal;
    let abortHandler;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      abortHandler = this.controller.abort.bind(this.controller);
      signal.addEventListener("abort", abortHandler);
    }
    try {
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_beginRequest).call(this);
      this._connected(null);
      const stream3 = Stream2.fromReadableStream(readableStream, this.controller);
      for await (const event of stream3) {
        __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_addStreamEvent).call(this, event);
      }
      if (stream3.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_endRequest).call(this);
    } finally {
      if (signal && abortHandler) {
        signal.removeEventListener("abort", abortHandler);
      }
    }
  }
  [(_BetaMessageStream_currentMessageSnapshot = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_params = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_endPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_listeners = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_ended = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_errored = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_aborted = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_response = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_request_id = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_logger = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_handleError = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_instances = /* @__PURE__ */ new WeakSet(), _BetaMessageStream_getFinalMessage = function _BetaMessageStream_getFinalMessage2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a Message with role=assistant");
    }
    return this.receivedMessages.at(-1);
  }, _BetaMessageStream_getFinalText = function _BetaMessageStream_getFinalText2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a Message with role=assistant");
    }
    const textBlocks = this.receivedMessages.at(-1).content.filter((block) => block.type === "text").map((block) => block.text);
    if (textBlocks.length === 0) {
      throw new AnthropicError("stream ended without producing a content block with type=text");
    }
    return textBlocks.join(" ");
  }, _BetaMessageStream_beginRequest = function _BetaMessageStream_beginRequest2() {
    if (this.ended)
      return;
    __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, void 0, "f");
  }, _BetaMessageStream_addStreamEvent = function _BetaMessageStream_addStreamEvent2(event) {
    if (this.ended)
      return;
    const messageSnapshot = __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_accumulateMessage).call(this, event);
    this._emit("streamEvent", event, messageSnapshot);
    switch (event.type) {
      case "content_block_delta": {
        const content = messageSnapshot.content.at(-1);
        switch (event.delta.type) {
          case "text_delta": {
            if (content.type === "text") {
              this._emit("text", event.delta.text, content.text || "");
            }
            break;
          }
          case "citations_delta": {
            if (content.type === "text") {
              this._emit("citation", event.delta.citation, content.citations ?? []);
            }
            break;
          }
          case "input_json_delta": {
            if (tracksToolInput(content) && content.input) {
              this._emit("inputJson", event.delta.partial_json, content.input);
            }
            break;
          }
          case "thinking_delta": {
            if (content.type === "thinking") {
              this._emit("thinking", event.delta.thinking, content.thinking);
            }
            break;
          }
          case "signature_delta": {
            if (content.type === "thinking") {
              this._emit("signature", content.signature);
            }
            break;
          }
          default:
            checkNever(event.delta);
        }
        break;
      }
      case "message_stop": {
        this._addMessageParam(messageSnapshot);
        this._addMessage(maybeParseBetaMessage(messageSnapshot, __classPrivateFieldGet(this, _BetaMessageStream_params, "f"), { logger: __classPrivateFieldGet(this, _BetaMessageStream_logger, "f") }), true);
        break;
      }
      case "content_block_stop": {
        this._emit("contentBlock", messageSnapshot.content.at(-1));
        break;
      }
      case "message_start": {
        __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, messageSnapshot, "f");
        break;
      }
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, _BetaMessageStream_endRequest = function _BetaMessageStream_endRequest2() {
    if (this.ended) {
      throw new AnthropicError(`stream has ended, this shouldn't happen`);
    }
    const snapshot = __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
    if (!snapshot) {
      throw new AnthropicError(`request ended without sending any chunks`);
    }
    __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, void 0, "f");
    return maybeParseBetaMessage(snapshot, __classPrivateFieldGet(this, _BetaMessageStream_params, "f"), { logger: __classPrivateFieldGet(this, _BetaMessageStream_logger, "f") });
  }, _BetaMessageStream_accumulateMessage = function _BetaMessageStream_accumulateMessage2(event) {
    let snapshot = __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
    if (event.type === "message_start") {
      if (snapshot) {
        throw new AnthropicError(`Unexpected event order, got ${event.type} before receiving "message_stop"`);
      }
      return event.message;
    }
    if (!snapshot) {
      throw new AnthropicError(`Unexpected event order, got ${event.type} before "message_start"`);
    }
    switch (event.type) {
      case "message_stop":
        return snapshot;
      case "message_delta":
        snapshot.container = event.delta.container;
        snapshot.stop_reason = event.delta.stop_reason;
        snapshot.stop_sequence = event.delta.stop_sequence;
        snapshot.usage.output_tokens = event.usage.output_tokens;
        snapshot.context_management = event.context_management;
        if (event.usage.input_tokens != null) {
          snapshot.usage.input_tokens = event.usage.input_tokens;
        }
        if (event.usage.cache_creation_input_tokens != null) {
          snapshot.usage.cache_creation_input_tokens = event.usage.cache_creation_input_tokens;
        }
        if (event.usage.cache_read_input_tokens != null) {
          snapshot.usage.cache_read_input_tokens = event.usage.cache_read_input_tokens;
        }
        if (event.usage.server_tool_use != null) {
          snapshot.usage.server_tool_use = event.usage.server_tool_use;
        }
        return snapshot;
      case "content_block_start":
        snapshot.content.push(event.content_block);
        return snapshot;
      case "content_block_delta": {
        const snapshotContent = snapshot.content.at(event.index);
        switch (event.delta.type) {
          case "text_delta": {
            if (snapshotContent?.type === "text") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                text: (snapshotContent.text || "") + event.delta.text
              };
            }
            break;
          }
          case "citations_delta": {
            if (snapshotContent?.type === "text") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                citations: [...snapshotContent.citations ?? [], event.delta.citation]
              };
            }
            break;
          }
          case "input_json_delta": {
            if (snapshotContent && tracksToolInput(snapshotContent)) {
              let jsonBuf = snapshotContent[JSON_BUF_PROPERTY] || "";
              jsonBuf += event.delta.partial_json;
              const newContent = { ...snapshotContent };
              Object.defineProperty(newContent, JSON_BUF_PROPERTY, {
                value: jsonBuf,
                enumerable: false,
                writable: true
              });
              if (jsonBuf) {
                try {
                  newContent.input = partialParse(jsonBuf);
                } catch (err) {
                  const error = new AnthropicError(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${err}. JSON: ${jsonBuf}`);
                  __classPrivateFieldGet(this, _BetaMessageStream_handleError, "f").call(this, error);
                }
              }
              snapshot.content[event.index] = newContent;
            }
            break;
          }
          case "thinking_delta": {
            if (snapshotContent?.type === "thinking") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                thinking: snapshotContent.thinking + event.delta.thinking
              };
            }
            break;
          }
          case "signature_delta": {
            if (snapshotContent?.type === "thinking") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                signature: event.delta.signature
              };
            }
            break;
          }
          default:
            checkNever(event.delta);
        }
        return snapshot;
      }
      case "content_block_stop":
        return snapshot;
    }
  }, Symbol.asyncIterator)]() {
    const pushQueue = [];
    const readQueue = [];
    let done = false;
    this.on("streamEvent", (event) => {
      const reader = readQueue.shift();
      if (reader) {
        reader.resolve(event);
      } else {
        pushQueue.push(event);
      }
    });
    this.on("end", () => {
      done = true;
      for (const reader of readQueue) {
        reader.resolve(void 0);
      }
      readQueue.length = 0;
    });
    this.on("abort", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    this.on("error", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    return {
      next: async () => {
        if (!pushQueue.length) {
          if (done) {
            return { value: void 0, done: true };
          }
          return new Promise((resolve3, reject) => readQueue.push({ resolve: resolve3, reject })).then((chunk3) => chunk3 ? { value: chunk3, done: false } : { value: void 0, done: true });
        }
        const chunk2 = pushQueue.shift();
        return { value: chunk2, done: false };
      },
      return: async () => {
        this.abort();
        return { value: void 0, done: true };
      }
    };
  }
  toReadableStream() {
    const stream3 = new Stream2(this[Symbol.asyncIterator].bind(this), this.controller);
    return stream3.toReadableStream();
  }
};
function checkNever(x) {
}

// node_modules/@anthropic-ai/sdk/lib/tools/CompactionControl.mjs
var DEFAULT_TOKEN_THRESHOLD = 1e5;
var DEFAULT_SUMMARY_PROMPT = `You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:
1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified
2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced
3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)
4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain
5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user
Be concise but complete\u2014err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.
Wrap your summary in <summary></summary> tags.`;

// node_modules/@anthropic-ai/sdk/lib/tools/BetaToolRunner.mjs
var _BetaToolRunner_instances;
var _BetaToolRunner_consumed;
var _BetaToolRunner_mutated;
var _BetaToolRunner_state;
var _BetaToolRunner_options;
var _BetaToolRunner_message;
var _BetaToolRunner_toolResponse;
var _BetaToolRunner_completion;
var _BetaToolRunner_iterationCount;
var _BetaToolRunner_checkAndCompact;
var _BetaToolRunner_generateToolResponse;
function promiseWithResolvers() {
  let resolve3;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve3 = res;
    reject = rej;
  });
  return { promise, resolve: resolve3, reject };
}
var BetaToolRunner = class {
  constructor(client, params, options) {
    _BetaToolRunner_instances.add(this);
    this.client = client;
    _BetaToolRunner_consumed.set(this, false);
    _BetaToolRunner_mutated.set(this, false);
    _BetaToolRunner_state.set(this, void 0);
    _BetaToolRunner_options.set(this, void 0);
    _BetaToolRunner_message.set(this, void 0);
    _BetaToolRunner_toolResponse.set(this, void 0);
    _BetaToolRunner_completion.set(this, void 0);
    _BetaToolRunner_iterationCount.set(this, 0);
    __classPrivateFieldSet(this, _BetaToolRunner_state, {
      params: {
        // You can't clone the entire params since there are functions as handlers.
        // You also don't really need to clone params.messages, but it probably will prevent a foot gun
        // somewhere.
        ...params,
        messages: structuredClone(params.messages)
      }
    }, "f");
    __classPrivateFieldSet(this, _BetaToolRunner_options, {
      ...options,
      headers: buildHeaders([{ "x-stainless-helper": "BetaToolRunner" }, options?.headers])
    }, "f");
    __classPrivateFieldSet(this, _BetaToolRunner_completion, promiseWithResolvers(), "f");
  }
  async *[(_BetaToolRunner_consumed = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_mutated = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_state = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_options = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_message = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_toolResponse = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_completion = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_iterationCount = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_instances = /* @__PURE__ */ new WeakSet(), _BetaToolRunner_checkAndCompact = async function _BetaToolRunner_checkAndCompact2() {
    const compactionControl = __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.compactionControl;
    if (!compactionControl || !compactionControl.enabled) {
      return false;
    }
    let tokensUsed = 0;
    if (__classPrivateFieldGet(this, _BetaToolRunner_message, "f") !== void 0) {
      try {
        const message = await __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
        const totalInputTokens = message.usage.input_tokens + (message.usage.cache_creation_input_tokens ?? 0) + (message.usage.cache_read_input_tokens ?? 0);
        tokensUsed = totalInputTokens + message.usage.output_tokens;
      } catch {
        return false;
      }
    }
    const threshold = compactionControl.contextTokenThreshold ?? DEFAULT_TOKEN_THRESHOLD;
    if (tokensUsed < threshold) {
      return false;
    }
    const model = compactionControl.model ?? __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.model;
    const summaryPrompt = compactionControl.summaryPrompt ?? DEFAULT_SUMMARY_PROMPT;
    const messages = __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages;
    if (messages[messages.length - 1].role === "assistant") {
      const lastMessage = messages[messages.length - 1];
      if (Array.isArray(lastMessage.content)) {
        const nonToolBlocks = lastMessage.content.filter((block) => block.type !== "tool_use");
        if (nonToolBlocks.length === 0) {
          messages.pop();
        } else {
          lastMessage.content = nonToolBlocks;
        }
      }
    }
    const response = await this.client.beta.messages.create({
      model,
      messages: [
        ...messages,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: summaryPrompt
            }
          ]
        }
      ],
      max_tokens: __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.max_tokens
    }, {
      headers: { "x-stainless-helper": "compaction" }
    });
    if (response.content[0]?.type !== "text") {
      throw new AnthropicError("Expected text response for compaction");
    }
    __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages = [
      {
        role: "user",
        content: response.content
      }
    ];
    return true;
  }, Symbol.asyncIterator)]() {
    var _a2;
    if (__classPrivateFieldGet(this, _BetaToolRunner_consumed, "f")) {
      throw new AnthropicError("Cannot iterate over a consumed stream");
    }
    __classPrivateFieldSet(this, _BetaToolRunner_consumed, true, "f");
    __classPrivateFieldSet(this, _BetaToolRunner_mutated, true, "f");
    __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, void 0, "f");
    try {
      while (true) {
        let stream3;
        try {
          if (__classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.max_iterations && __classPrivateFieldGet(this, _BetaToolRunner_iterationCount, "f") >= __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.max_iterations) {
            break;
          }
          __classPrivateFieldSet(this, _BetaToolRunner_mutated, false, "f");
          __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, void 0, "f");
          __classPrivateFieldSet(this, _BetaToolRunner_iterationCount, (_a2 = __classPrivateFieldGet(this, _BetaToolRunner_iterationCount, "f"), _a2++, _a2), "f");
          __classPrivateFieldSet(this, _BetaToolRunner_message, void 0, "f");
          const { max_iterations, compactionControl, ...params } = __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params;
          if (params.stream) {
            stream3 = this.client.beta.messages.stream({ ...params }, __classPrivateFieldGet(this, _BetaToolRunner_options, "f"));
            __classPrivateFieldSet(this, _BetaToolRunner_message, stream3.finalMessage(), "f");
            __classPrivateFieldGet(this, _BetaToolRunner_message, "f").catch(() => {
            });
            yield stream3;
          } else {
            __classPrivateFieldSet(this, _BetaToolRunner_message, this.client.beta.messages.create({ ...params, stream: false }, __classPrivateFieldGet(this, _BetaToolRunner_options, "f")), "f");
            yield __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
          }
          const isCompacted = await __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_checkAndCompact).call(this);
          if (!isCompacted) {
            if (!__classPrivateFieldGet(this, _BetaToolRunner_mutated, "f")) {
              const { role, content } = await __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
              __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages.push({ role, content });
            }
            const toolMessage = await __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_generateToolResponse).call(this, __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages.at(-1));
            if (toolMessage) {
              __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages.push(toolMessage);
            } else if (!__classPrivateFieldGet(this, _BetaToolRunner_mutated, "f")) {
              break;
            }
          }
        } finally {
          if (stream3) {
            stream3.abort();
          }
        }
      }
      if (!__classPrivateFieldGet(this, _BetaToolRunner_message, "f")) {
        throw new AnthropicError("ToolRunner concluded without a message from the server");
      }
      __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").resolve(await __classPrivateFieldGet(this, _BetaToolRunner_message, "f"));
    } catch (error) {
      __classPrivateFieldSet(this, _BetaToolRunner_consumed, false, "f");
      __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").promise.catch(() => {
      });
      __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").reject(error);
      __classPrivateFieldSet(this, _BetaToolRunner_completion, promiseWithResolvers(), "f");
      throw error;
    }
  }
  setMessagesParams(paramsOrMutator) {
    if (typeof paramsOrMutator === "function") {
      __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params = paramsOrMutator(__classPrivateFieldGet(this, _BetaToolRunner_state, "f").params);
    } else {
      __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params = paramsOrMutator;
    }
    __classPrivateFieldSet(this, _BetaToolRunner_mutated, true, "f");
    __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, void 0, "f");
  }
  /**
   * Get the tool response for the last message from the assistant.
   * Avoids redundant tool executions by caching results.
   *
   * @returns A promise that resolves to a BetaMessageParam containing tool results, or null if no tools need to be executed
   *
   * @example
   * const toolResponse = await runner.generateToolResponse();
   * if (toolResponse) {
   *   console.log('Tool results:', toolResponse.content);
   * }
   */
  async generateToolResponse() {
    const message = await __classPrivateFieldGet(this, _BetaToolRunner_message, "f") ?? this.params.messages.at(-1);
    if (!message) {
      return null;
    }
    return __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_generateToolResponse).call(this, message);
  }
  /**
   * Wait for the async iterator to complete. This works even if the async iterator hasn't yet started, and
   * will wait for an instance to start and go to completion.
   *
   * @returns A promise that resolves to the final BetaMessage when the iterator completes
   *
   * @example
   * // Start consuming the iterator
   * for await (const message of runner) {
   *   console.log('Message:', message.content);
   * }
   *
   * // Meanwhile, wait for completion from another part of the code
   * const finalMessage = await runner.done();
   * console.log('Final response:', finalMessage.content);
   */
  done() {
    return __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").promise;
  }
  /**
   * Returns a promise indicating that the stream is done. Unlike .done(), this will eagerly read the stream:
   * * If the iterator has not been consumed, consume the entire iterator and return the final message from the
   * assistant.
   * * If the iterator has been consumed, waits for it to complete and returns the final message.
   *
   * @returns A promise that resolves to the final BetaMessage from the conversation
   * @throws {AnthropicError} If no messages were processed during the conversation
   *
   * @example
   * const finalMessage = await runner.runUntilDone();
   * console.log('Final response:', finalMessage.content);
   */
  async runUntilDone() {
    if (!__classPrivateFieldGet(this, _BetaToolRunner_consumed, "f")) {
      for await (const _ of this) {
      }
    }
    return this.done();
  }
  /**
   * Get the current parameters being used by the ToolRunner.
   *
   * @returns A readonly view of the current ToolRunnerParams
   *
   * @example
   * const currentParams = runner.params;
   * console.log('Current model:', currentParams.model);
   * console.log('Message count:', currentParams.messages.length);
   */
  get params() {
    return __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params;
  }
  /**
   * Add one or more messages to the conversation history.
   *
   * @param messages - One or more BetaMessageParam objects to add to the conversation
   *
   * @example
   * runner.pushMessages(
   *   { role: 'user', content: 'Also, what about the weather in NYC?' }
   * );
   *
   * @example
   * // Adding multiple messages
   * runner.pushMessages(
   *   { role: 'user', content: 'What about NYC?' },
   *   { role: 'user', content: 'And Boston?' }
   * );
   */
  pushMessages(...messages) {
    this.setMessagesParams((params) => ({
      ...params,
      messages: [...params.messages, ...messages]
    }));
  }
  /**
   * Makes the ToolRunner directly awaitable, equivalent to calling .runUntilDone()
   * This allows using `await runner` instead of `await runner.runUntilDone()`
   */
  then(onfulfilled, onrejected) {
    return this.runUntilDone().then(onfulfilled, onrejected);
  }
};
_BetaToolRunner_generateToolResponse = async function _BetaToolRunner_generateToolResponse2(lastMessage) {
  if (__classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f") !== void 0) {
    return __classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f");
  }
  __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, generateToolResponse(__classPrivateFieldGet(this, _BetaToolRunner_state, "f").params, lastMessage), "f");
  return __classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f");
};
async function generateToolResponse(params, lastMessage = params.messages.at(-1)) {
  if (!lastMessage || lastMessage.role !== "assistant" || !lastMessage.content || typeof lastMessage.content === "string") {
    return null;
  }
  const toolUseBlocks = lastMessage.content.filter((content) => content.type === "tool_use");
  if (toolUseBlocks.length === 0) {
    return null;
  }
  const toolResults = await Promise.all(toolUseBlocks.map(async (toolUse) => {
    const tool = params.tools.find((t) => ("name" in t ? t.name : t.mcp_server_name) === toolUse.name);
    if (!tool || !("run" in tool)) {
      return {
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: `Error: Tool '${toolUse.name}' not found`,
        is_error: true
      };
    }
    try {
      let input = toolUse.input;
      if ("parse" in tool && tool.parse) {
        input = tool.parse(input);
      }
      const result = await tool.run(input);
      return {
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: result
      };
    } catch (error) {
      return {
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: `Error: ${error instanceof Error ? error.message : String(error)}`,
        is_error: true
      };
    }
  }));
  return {
    role: "user",
    content: toolResults
  };
}

// node_modules/@anthropic-ai/sdk/internal/decoders/jsonl.mjs
var JSONLDecoder = class _JSONLDecoder {
  constructor(iterator, controller) {
    this.iterator = iterator;
    this.controller = controller;
  }
  async *decoder() {
    const lineDecoder = new LineDecoder();
    for await (const chunk2 of this.iterator) {
      for (const line of lineDecoder.decode(chunk2)) {
        yield JSON.parse(line);
      }
    }
    for (const line of lineDecoder.flush()) {
      yield JSON.parse(line);
    }
  }
  [Symbol.asyncIterator]() {
    return this.decoder();
  }
  static fromResponse(response, controller) {
    if (!response.body) {
      controller.abort();
      if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.product === "ReactNative") {
        throw new AnthropicError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
      }
      throw new AnthropicError(`Attempted to iterate over a response with no body`);
    }
    return new _JSONLDecoder(ReadableStreamToAsyncIterable(response.body), controller);
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/messages/batches.mjs
var Batches = class extends APIResource {
  /**
   * Send a batch of Message creation requests.
   *
   * The Message Batches API can be used to process multiple Messages API requests at
   * once. Once a Message Batch is created, it begins processing immediately. Batches
   * can take up to 24 hours to complete.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.create({
   *     requests: [
   *       {
   *         custom_id: 'my-custom-id-1',
   *         params: {
   *           max_tokens: 1024,
   *           messages: [
   *             { content: 'Hello, world', role: 'user' },
   *           ],
   *           model: 'claude-sonnet-4-5-20250929',
   *         },
   *       },
   *     ],
   *   });
   * ```
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/messages/batches?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * This endpoint is idempotent and can be used to poll for Message Batch
   * completion. To access the results of a Message Batch, make a request to the
   * `results_url` field in the response.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.retrieve(
   *     'message_batch_id',
   *   );
   * ```
   */
  retrieve(messageBatchID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path12`/v1/messages/batches/${messageBatchID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List all Message Batches within a Workspace. Most recently created batches are
   * returned first.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaMessageBatch of client.beta.messages.batches.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/messages/batches?beta=true", Page, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete a Message Batch.
   *
   * Message Batches can only be deleted once they've finished processing. If you'd
   * like to delete an in-progress batch, you must first cancel it.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaDeletedMessageBatch =
   *   await client.beta.messages.batches.delete(
   *     'message_batch_id',
   *   );
   * ```
   */
  delete(messageBatchID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.delete(path12`/v1/messages/batches/${messageBatchID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Batches may be canceled any time before processing ends. Once cancellation is
   * initiated, the batch enters a `canceling` state, at which time the system may
   * complete any in-progress, non-interruptible requests before finalizing
   * cancellation.
   *
   * The number of canceled requests is specified in `request_counts`. To determine
   * which requests were canceled, check the individual results within the batch.
   * Note that cancellation may not result in any canceled requests if they were
   * non-interruptible.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.cancel(
   *     'message_batch_id',
   *   );
   * ```
   */
  cancel(messageBatchID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path12`/v1/messages/batches/${messageBatchID}/cancel?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Streams the results of a Message Batch as a `.jsonl` file.
   *
   * Each line in the file is a JSON object containing the result of a single request
   * in the Message Batch. Results are not guaranteed to be in the same order as
   * requests. Use the `custom_id` field to match results to requests.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatchIndividualResponse =
   *   await client.beta.messages.batches.results(
   *     'message_batch_id',
   *   );
   * ```
   */
  async results(messageBatchID, params = {}, options) {
    const batch = await this.retrieve(messageBatchID);
    if (!batch.results_url) {
      throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
    }
    const { betas } = params ?? {};
    return this._client.get(batch.results_url, {
      ...options,
      headers: buildHeaders([
        {
          "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString(),
          Accept: "application/binary"
        },
        options?.headers
      ]),
      stream: true,
      __binaryResponse: true
    })._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/messages/messages.mjs
var DEPRECATED_MODELS = {
  "claude-1.3": "November 6th, 2024",
  "claude-1.3-100k": "November 6th, 2024",
  "claude-instant-1.1": "November 6th, 2024",
  "claude-instant-1.1-100k": "November 6th, 2024",
  "claude-instant-1.2": "November 6th, 2024",
  "claude-3-sonnet-20240229": "July 21st, 2025",
  "claude-3-opus-20240229": "January 5th, 2026",
  "claude-2.1": "July 21st, 2025",
  "claude-2.0": "July 21st, 2025",
  "claude-3-7-sonnet-latest": "February 19th, 2026",
  "claude-3-7-sonnet-20250219": "February 19th, 2026"
};
var Messages = class extends APIResource {
  constructor() {
    super(...arguments);
    this.batches = new Batches(this._client);
  }
  create(params, options) {
    const { betas, ...body } = params;
    if (body.model in DEPRECATED_MODELS) {
      console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS[body.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
    }
    let timeout = this._client._options.timeout;
    if (!body.stream && timeout == null) {
      const maxNonstreamingTokens = MODEL_NONSTREAMING_TOKENS[body.model] ?? void 0;
      timeout = this._client.calculateNonstreamingTimeout(body.max_tokens, maxNonstreamingTokens);
    }
    return this._client.post("/v1/messages?beta=true", {
      body,
      timeout: timeout ?? 6e5,
      ...options,
      headers: buildHeaders([
        { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
        options?.headers
      ]),
      stream: params.stream ?? false
    });
  }
  /**
   * Send a structured list of input messages with text and/or image content, along with an expected `output_format` and
   * the response will be automatically parsed and available in the `parsed_output` property of the message.
   *
   * @example
   * ```ts
   * const message = await client.beta.messages.parse({
   *   model: 'claude-3-5-sonnet-20241022',
   *   max_tokens: 1024,
   *   messages: [{ role: 'user', content: 'What is 2+2?' }],
   *   output_format: zodOutputFormat(z.object({ answer: z.number() }), 'math'),
   * });
   *
   * console.log(message.parsed_output?.answer); // 4
   * ```
   */
  parse(params, options) {
    options = {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...params.betas ?? [], "structured-outputs-2025-11-13"].toString() },
        options?.headers
      ])
    };
    return this.create(params, options).then((message) => parseBetaMessage(message, params, { logger: this._client.logger ?? console }));
  }
  /**
   * Create a Message stream
   */
  stream(body, options) {
    return BetaMessageStream.createMessage(this, body, options);
  }
  /**
   * Count the number of tokens in a Message.
   *
   * The Token Count API can be used to count the number of tokens in a Message,
   * including tools, images, and documents, without creating it.
   *
   * Learn more about token counting in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/token-counting)
   *
   * @example
   * ```ts
   * const betaMessageTokensCount =
   *   await client.beta.messages.countTokens({
   *     messages: [{ content: 'string', role: 'user' }],
   *     model: 'claude-opus-4-5-20251101',
   *   });
   * ```
   */
  countTokens(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/messages/count_tokens?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "token-counting-2024-11-01"].toString() },
        options?.headers
      ])
    });
  }
  toolRunner(body, options) {
    return new BetaToolRunner(this._client, body, options);
  }
};
Messages.Batches = Batches;
Messages.BetaToolRunner = BetaToolRunner;

// node_modules/@anthropic-ai/sdk/resources/beta/skills/versions.mjs
var Versions = class extends APIResource {
  /**
   * Create Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.create(
   *   'skill_id',
   * );
   * ```
   */
  create(skillID, params = {}, options) {
    const { betas, ...body } = params ?? {};
    return this._client.post(path12`/v1/skills/${skillID}/versions?beta=true`, multipartFormRequestOptions({
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    }, this._client));
  }
  /**
   * Get Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.retrieve(
   *   'version',
   *   { skill_id: 'skill_id' },
   * );
   * ```
   */
  retrieve(version, params, options) {
    const { skill_id, betas } = params;
    return this._client.get(path12`/v1/skills/${skill_id}/versions/${version}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Skill Versions
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const versionListResponse of client.beta.skills.versions.list(
   *   'skill_id',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(skillID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList(path12`/v1/skills/${skillID}/versions?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.delete(
   *   'version',
   *   { skill_id: 'skill_id' },
   * );
   * ```
   */
  delete(version, params, options) {
    const { skill_id, betas } = params;
    return this._client.delete(path12`/v1/skills/${skill_id}/versions/${version}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/skills/skills.mjs
var Skills = class extends APIResource {
  constructor() {
    super(...arguments);
    this.versions = new Versions(this._client);
  }
  /**
   * Create Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.create();
   * ```
   */
  create(params = {}, options) {
    const { betas, ...body } = params ?? {};
    return this._client.post("/v1/skills?beta=true", multipartFormRequestOptions({
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    }, this._client));
  }
  /**
   * Get Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.retrieve('skill_id');
   * ```
   */
  retrieve(skillID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path12`/v1/skills/${skillID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Skills
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const skillListResponse of client.beta.skills.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/skills?beta=true", PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.delete('skill_id');
   * ```
   */
  delete(skillID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.delete(path12`/v1/skills/${skillID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
};
Skills.Versions = Versions;

// node_modules/@anthropic-ai/sdk/resources/beta/beta.mjs
var Beta = class extends APIResource {
  constructor() {
    super(...arguments);
    this.models = new Models(this._client);
    this.messages = new Messages(this._client);
    this.files = new Files(this._client);
    this.skills = new Skills(this._client);
  }
};
Beta.Models = Models;
Beta.Messages = Messages;
Beta.Files = Files;
Beta.Skills = Skills;

// node_modules/@anthropic-ai/sdk/resources/completions.mjs
var Completions = class extends APIResource {
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/complete", {
      body,
      timeout: this._client._options.timeout ?? 6e5,
      ...options,
      headers: buildHeaders([
        { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
        options?.headers
      ]),
      stream: params.stream ?? false
    });
  }
};

// node_modules/@anthropic-ai/sdk/lib/MessageStream.mjs
var _MessageStream_instances;
var _MessageStream_currentMessageSnapshot;
var _MessageStream_connectedPromise;
var _MessageStream_resolveConnectedPromise;
var _MessageStream_rejectConnectedPromise;
var _MessageStream_endPromise;
var _MessageStream_resolveEndPromise;
var _MessageStream_rejectEndPromise;
var _MessageStream_listeners;
var _MessageStream_ended;
var _MessageStream_errored;
var _MessageStream_aborted;
var _MessageStream_catchingPromiseCreated;
var _MessageStream_response;
var _MessageStream_request_id;
var _MessageStream_getFinalMessage;
var _MessageStream_getFinalText;
var _MessageStream_handleError;
var _MessageStream_beginRequest;
var _MessageStream_addStreamEvent;
var _MessageStream_endRequest;
var _MessageStream_accumulateMessage;
var JSON_BUF_PROPERTY2 = "__json_buf";
function tracksToolInput2(content) {
  return content.type === "tool_use" || content.type === "server_tool_use";
}
var MessageStream = class _MessageStream {
  constructor() {
    _MessageStream_instances.add(this);
    this.messages = [];
    this.receivedMessages = [];
    _MessageStream_currentMessageSnapshot.set(this, void 0);
    this.controller = new AbortController();
    _MessageStream_connectedPromise.set(this, void 0);
    _MessageStream_resolveConnectedPromise.set(this, () => {
    });
    _MessageStream_rejectConnectedPromise.set(this, () => {
    });
    _MessageStream_endPromise.set(this, void 0);
    _MessageStream_resolveEndPromise.set(this, () => {
    });
    _MessageStream_rejectEndPromise.set(this, () => {
    });
    _MessageStream_listeners.set(this, {});
    _MessageStream_ended.set(this, false);
    _MessageStream_errored.set(this, false);
    _MessageStream_aborted.set(this, false);
    _MessageStream_catchingPromiseCreated.set(this, false);
    _MessageStream_response.set(this, void 0);
    _MessageStream_request_id.set(this, void 0);
    _MessageStream_handleError.set(this, (error) => {
      __classPrivateFieldSet(this, _MessageStream_errored, true, "f");
      if (isAbortError(error)) {
        error = new APIUserAbortError();
      }
      if (error instanceof APIUserAbortError) {
        __classPrivateFieldSet(this, _MessageStream_aborted, true, "f");
        return this._emit("abort", error);
      }
      if (error instanceof AnthropicError) {
        return this._emit("error", error);
      }
      if (error instanceof Error) {
        const anthropicError = new AnthropicError(error.message);
        anthropicError.cause = error;
        return this._emit("error", anthropicError);
      }
      return this._emit("error", new AnthropicError(String(error)));
    });
    __classPrivateFieldSet(this, _MessageStream_connectedPromise, new Promise((resolve3, reject) => {
      __classPrivateFieldSet(this, _MessageStream_resolveConnectedPromise, resolve3, "f");
      __classPrivateFieldSet(this, _MessageStream_rejectConnectedPromise, reject, "f");
    }), "f");
    __classPrivateFieldSet(this, _MessageStream_endPromise, new Promise((resolve3, reject) => {
      __classPrivateFieldSet(this, _MessageStream_resolveEndPromise, resolve3, "f");
      __classPrivateFieldSet(this, _MessageStream_rejectEndPromise, reject, "f");
    }), "f");
    __classPrivateFieldGet(this, _MessageStream_connectedPromise, "f").catch(() => {
    });
    __classPrivateFieldGet(this, _MessageStream_endPromise, "f").catch(() => {
    });
  }
  get response() {
    return __classPrivateFieldGet(this, _MessageStream_response, "f");
  }
  get request_id() {
    return __classPrivateFieldGet(this, _MessageStream_request_id, "f");
  }
  /**
   * Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
   * returned vie the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * This is the same as the `APIPromise.withResponse()` method.
   *
   * This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
   * as no `Response` is available.
   */
  async withResponse() {
    __classPrivateFieldSet(this, _MessageStream_catchingPromiseCreated, true, "f");
    const response = await __classPrivateFieldGet(this, _MessageStream_connectedPromise, "f");
    if (!response) {
      throw new Error("Could not resolve a `Response` object");
    }
    return {
      data: this,
      response,
      request_id: response.headers.get("request-id")
    };
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(stream3) {
    const runner = new _MessageStream();
    runner._run(() => runner._fromReadableStream(stream3));
    return runner;
  }
  static createMessage(messages, params, options) {
    const runner = new _MessageStream();
    for (const message of params.messages) {
      runner._addMessageParam(message);
    }
    runner._run(() => runner._createMessage(messages, { ...params, stream: true }, { ...options, headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" } }));
    return runner;
  }
  _run(executor) {
    executor().then(() => {
      this._emitFinal();
      this._emit("end");
    }, __classPrivateFieldGet(this, _MessageStream_handleError, "f"));
  }
  _addMessageParam(message) {
    this.messages.push(message);
  }
  _addMessage(message, emit = true) {
    this.receivedMessages.push(message);
    if (emit) {
      this._emit("message", message);
    }
  }
  async _createMessage(messages, params, options) {
    const signal = options?.signal;
    let abortHandler;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      abortHandler = this.controller.abort.bind(this.controller);
      signal.addEventListener("abort", abortHandler);
    }
    try {
      __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_beginRequest).call(this);
      const { response, data: stream3 } = await messages.create({ ...params, stream: true }, { ...options, signal: this.controller.signal }).withResponse();
      this._connected(response);
      for await (const event of stream3) {
        __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_addStreamEvent).call(this, event);
      }
      if (stream3.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_endRequest).call(this);
    } finally {
      if (signal && abortHandler) {
        signal.removeEventListener("abort", abortHandler);
      }
    }
  }
  _connected(response) {
    if (this.ended)
      return;
    __classPrivateFieldSet(this, _MessageStream_response, response, "f");
    __classPrivateFieldSet(this, _MessageStream_request_id, response?.headers.get("request-id"), "f");
    __classPrivateFieldGet(this, _MessageStream_resolveConnectedPromise, "f").call(this, response);
    this._emit("connect");
  }
  get ended() {
    return __classPrivateFieldGet(this, _MessageStream_ended, "f");
  }
  get errored() {
    return __classPrivateFieldGet(this, _MessageStream_errored, "f");
  }
  get aborted() {
    return __classPrivateFieldGet(this, _MessageStream_aborted, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this MessageStream, so that calls can be chained
   */
  on(event, listener) {
    const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = []);
    listeners.push({ listener });
    return this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this MessageStream, so that calls can be chained
   */
  off(event, listener) {
    const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event];
    if (!listeners)
      return this;
    const index = listeners.findIndex((l) => l.listener === listener);
    if (index >= 0)
      listeners.splice(index, 1);
    return this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this MessageStream, so that calls can be chained
   */
  once(event, listener) {
    const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = []);
    listeners.push({ listener, once: true });
    return this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(event) {
    return new Promise((resolve3, reject) => {
      __classPrivateFieldSet(this, _MessageStream_catchingPromiseCreated, true, "f");
      if (event !== "error")
        this.once("error", reject);
      this.once(event, resolve3);
    });
  }
  async done() {
    __classPrivateFieldSet(this, _MessageStream_catchingPromiseCreated, true, "f");
    await __classPrivateFieldGet(this, _MessageStream_endPromise, "f");
  }
  get currentMessage() {
    return __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
  }
  /**
   * @returns a promise that resolves with the the final assistant Message response,
   * or rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalMessage() {
    await this.done();
    return __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalMessage).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant Message's text response, concatenated
   * together if there are more than one text blocks.
   * Rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalText() {
    await this.done();
    return __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalText).call(this);
  }
  _emit(event, ...args) {
    if (__classPrivateFieldGet(this, _MessageStream_ended, "f"))
      return;
    if (event === "end") {
      __classPrivateFieldSet(this, _MessageStream_ended, true, "f");
      __classPrivateFieldGet(this, _MessageStream_resolveEndPromise, "f").call(this);
    }
    const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event];
    if (listeners) {
      __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
      listeners.forEach(({ listener }) => listener(...args));
    }
    if (event === "abort") {
      const error = args[0];
      if (!__classPrivateFieldGet(this, _MessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
        Promise.reject(error);
      }
      __classPrivateFieldGet(this, _MessageStream_rejectConnectedPromise, "f").call(this, error);
      __classPrivateFieldGet(this, _MessageStream_rejectEndPromise, "f").call(this, error);
      this._emit("end");
      return;
    }
    if (event === "error") {
      const error = args[0];
      if (!__classPrivateFieldGet(this, _MessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
        Promise.reject(error);
      }
      __classPrivateFieldGet(this, _MessageStream_rejectConnectedPromise, "f").call(this, error);
      __classPrivateFieldGet(this, _MessageStream_rejectEndPromise, "f").call(this, error);
      this._emit("end");
    }
  }
  _emitFinal() {
    const finalMessage = this.receivedMessages.at(-1);
    if (finalMessage) {
      this._emit("finalMessage", __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalMessage).call(this));
    }
  }
  async _fromReadableStream(readableStream, options) {
    const signal = options?.signal;
    let abortHandler;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      abortHandler = this.controller.abort.bind(this.controller);
      signal.addEventListener("abort", abortHandler);
    }
    try {
      __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_beginRequest).call(this);
      this._connected(null);
      const stream3 = Stream2.fromReadableStream(readableStream, this.controller);
      for await (const event of stream3) {
        __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_addStreamEvent).call(this, event);
      }
      if (stream3.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_endRequest).call(this);
    } finally {
      if (signal && abortHandler) {
        signal.removeEventListener("abort", abortHandler);
      }
    }
  }
  [(_MessageStream_currentMessageSnapshot = /* @__PURE__ */ new WeakMap(), _MessageStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_endPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_listeners = /* @__PURE__ */ new WeakMap(), _MessageStream_ended = /* @__PURE__ */ new WeakMap(), _MessageStream_errored = /* @__PURE__ */ new WeakMap(), _MessageStream_aborted = /* @__PURE__ */ new WeakMap(), _MessageStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _MessageStream_response = /* @__PURE__ */ new WeakMap(), _MessageStream_request_id = /* @__PURE__ */ new WeakMap(), _MessageStream_handleError = /* @__PURE__ */ new WeakMap(), _MessageStream_instances = /* @__PURE__ */ new WeakSet(), _MessageStream_getFinalMessage = function _MessageStream_getFinalMessage2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a Message with role=assistant");
    }
    return this.receivedMessages.at(-1);
  }, _MessageStream_getFinalText = function _MessageStream_getFinalText2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a Message with role=assistant");
    }
    const textBlocks = this.receivedMessages.at(-1).content.filter((block) => block.type === "text").map((block) => block.text);
    if (textBlocks.length === 0) {
      throw new AnthropicError("stream ended without producing a content block with type=text");
    }
    return textBlocks.join(" ");
  }, _MessageStream_beginRequest = function _MessageStream_beginRequest2() {
    if (this.ended)
      return;
    __classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, void 0, "f");
  }, _MessageStream_addStreamEvent = function _MessageStream_addStreamEvent2(event) {
    if (this.ended)
      return;
    const messageSnapshot = __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_accumulateMessage).call(this, event);
    this._emit("streamEvent", event, messageSnapshot);
    switch (event.type) {
      case "content_block_delta": {
        const content = messageSnapshot.content.at(-1);
        switch (event.delta.type) {
          case "text_delta": {
            if (content.type === "text") {
              this._emit("text", event.delta.text, content.text || "");
            }
            break;
          }
          case "citations_delta": {
            if (content.type === "text") {
              this._emit("citation", event.delta.citation, content.citations ?? []);
            }
            break;
          }
          case "input_json_delta": {
            if (tracksToolInput2(content) && content.input) {
              this._emit("inputJson", event.delta.partial_json, content.input);
            }
            break;
          }
          case "thinking_delta": {
            if (content.type === "thinking") {
              this._emit("thinking", event.delta.thinking, content.thinking);
            }
            break;
          }
          case "signature_delta": {
            if (content.type === "thinking") {
              this._emit("signature", content.signature);
            }
            break;
          }
          default:
            checkNever2(event.delta);
        }
        break;
      }
      case "message_stop": {
        this._addMessageParam(messageSnapshot);
        this._addMessage(messageSnapshot, true);
        break;
      }
      case "content_block_stop": {
        this._emit("contentBlock", messageSnapshot.content.at(-1));
        break;
      }
      case "message_start": {
        __classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, messageSnapshot, "f");
        break;
      }
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, _MessageStream_endRequest = function _MessageStream_endRequest2() {
    if (this.ended) {
      throw new AnthropicError(`stream has ended, this shouldn't happen`);
    }
    const snapshot = __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
    if (!snapshot) {
      throw new AnthropicError(`request ended without sending any chunks`);
    }
    __classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, void 0, "f");
    return snapshot;
  }, _MessageStream_accumulateMessage = function _MessageStream_accumulateMessage2(event) {
    let snapshot = __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
    if (event.type === "message_start") {
      if (snapshot) {
        throw new AnthropicError(`Unexpected event order, got ${event.type} before receiving "message_stop"`);
      }
      return event.message;
    }
    if (!snapshot) {
      throw new AnthropicError(`Unexpected event order, got ${event.type} before "message_start"`);
    }
    switch (event.type) {
      case "message_stop":
        return snapshot;
      case "message_delta":
        snapshot.stop_reason = event.delta.stop_reason;
        snapshot.stop_sequence = event.delta.stop_sequence;
        snapshot.usage.output_tokens = event.usage.output_tokens;
        if (event.usage.input_tokens != null) {
          snapshot.usage.input_tokens = event.usage.input_tokens;
        }
        if (event.usage.cache_creation_input_tokens != null) {
          snapshot.usage.cache_creation_input_tokens = event.usage.cache_creation_input_tokens;
        }
        if (event.usage.cache_read_input_tokens != null) {
          snapshot.usage.cache_read_input_tokens = event.usage.cache_read_input_tokens;
        }
        if (event.usage.server_tool_use != null) {
          snapshot.usage.server_tool_use = event.usage.server_tool_use;
        }
        return snapshot;
      case "content_block_start":
        snapshot.content.push({ ...event.content_block });
        return snapshot;
      case "content_block_delta": {
        const snapshotContent = snapshot.content.at(event.index);
        switch (event.delta.type) {
          case "text_delta": {
            if (snapshotContent?.type === "text") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                text: (snapshotContent.text || "") + event.delta.text
              };
            }
            break;
          }
          case "citations_delta": {
            if (snapshotContent?.type === "text") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                citations: [...snapshotContent.citations ?? [], event.delta.citation]
              };
            }
            break;
          }
          case "input_json_delta": {
            if (snapshotContent && tracksToolInput2(snapshotContent)) {
              let jsonBuf = snapshotContent[JSON_BUF_PROPERTY2] || "";
              jsonBuf += event.delta.partial_json;
              const newContent = { ...snapshotContent };
              Object.defineProperty(newContent, JSON_BUF_PROPERTY2, {
                value: jsonBuf,
                enumerable: false,
                writable: true
              });
              if (jsonBuf) {
                newContent.input = partialParse(jsonBuf);
              }
              snapshot.content[event.index] = newContent;
            }
            break;
          }
          case "thinking_delta": {
            if (snapshotContent?.type === "thinking") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                thinking: snapshotContent.thinking + event.delta.thinking
              };
            }
            break;
          }
          case "signature_delta": {
            if (snapshotContent?.type === "thinking") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                signature: event.delta.signature
              };
            }
            break;
          }
          default:
            checkNever2(event.delta);
        }
        return snapshot;
      }
      case "content_block_stop":
        return snapshot;
    }
  }, Symbol.asyncIterator)]() {
    const pushQueue = [];
    const readQueue = [];
    let done = false;
    this.on("streamEvent", (event) => {
      const reader = readQueue.shift();
      if (reader) {
        reader.resolve(event);
      } else {
        pushQueue.push(event);
      }
    });
    this.on("end", () => {
      done = true;
      for (const reader of readQueue) {
        reader.resolve(void 0);
      }
      readQueue.length = 0;
    });
    this.on("abort", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    this.on("error", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    return {
      next: async () => {
        if (!pushQueue.length) {
          if (done) {
            return { value: void 0, done: true };
          }
          return new Promise((resolve3, reject) => readQueue.push({ resolve: resolve3, reject })).then((chunk3) => chunk3 ? { value: chunk3, done: false } : { value: void 0, done: true });
        }
        const chunk2 = pushQueue.shift();
        return { value: chunk2, done: false };
      },
      return: async () => {
        this.abort();
        return { value: void 0, done: true };
      }
    };
  }
  toReadableStream() {
    const stream3 = new Stream2(this[Symbol.asyncIterator].bind(this), this.controller);
    return stream3.toReadableStream();
  }
};
function checkNever2(x) {
}

// node_modules/@anthropic-ai/sdk/resources/messages/batches.mjs
var Batches2 = class extends APIResource {
  /**
   * Send a batch of Message creation requests.
   *
   * The Message Batches API can be used to process multiple Messages API requests at
   * once. Once a Message Batch is created, it begins processing immediately. Batches
   * can take up to 24 hours to complete.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.create({
   *   requests: [
   *     {
   *       custom_id: 'my-custom-id-1',
   *       params: {
   *         max_tokens: 1024,
   *         messages: [
   *           { content: 'Hello, world', role: 'user' },
   *         ],
   *         model: 'claude-sonnet-4-5-20250929',
   *       },
   *     },
   *   ],
   * });
   * ```
   */
  create(body, options) {
    return this._client.post("/v1/messages/batches", { body, ...options });
  }
  /**
   * This endpoint is idempotent and can be used to poll for Message Batch
   * completion. To access the results of a Message Batch, make a request to the
   * `results_url` field in the response.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.retrieve(
   *   'message_batch_id',
   * );
   * ```
   */
  retrieve(messageBatchID, options) {
    return this._client.get(path12`/v1/messages/batches/${messageBatchID}`, options);
  }
  /**
   * List all Message Batches within a Workspace. Most recently created batches are
   * returned first.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const messageBatch of client.messages.batches.list()) {
   *   // ...
   * }
   * ```
   */
  list(query = {}, options) {
    return this._client.getAPIList("/v1/messages/batches", Page, { query, ...options });
  }
  /**
   * Delete a Message Batch.
   *
   * Message Batches can only be deleted once they've finished processing. If you'd
   * like to delete an in-progress batch, you must first cancel it.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const deletedMessageBatch =
   *   await client.messages.batches.delete('message_batch_id');
   * ```
   */
  delete(messageBatchID, options) {
    return this._client.delete(path12`/v1/messages/batches/${messageBatchID}`, options);
  }
  /**
   * Batches may be canceled any time before processing ends. Once cancellation is
   * initiated, the batch enters a `canceling` state, at which time the system may
   * complete any in-progress, non-interruptible requests before finalizing
   * cancellation.
   *
   * The number of canceled requests is specified in `request_counts`. To determine
   * which requests were canceled, check the individual results within the batch.
   * Note that cancellation may not result in any canceled requests if they were
   * non-interruptible.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.cancel(
   *   'message_batch_id',
   * );
   * ```
   */
  cancel(messageBatchID, options) {
    return this._client.post(path12`/v1/messages/batches/${messageBatchID}/cancel`, options);
  }
  /**
   * Streams the results of a Message Batch as a `.jsonl` file.
   *
   * Each line in the file is a JSON object containing the result of a single request
   * in the Message Batch. Results are not guaranteed to be in the same order as
   * requests. Use the `custom_id` field to match results to requests.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatchIndividualResponse =
   *   await client.messages.batches.results('message_batch_id');
   * ```
   */
  async results(messageBatchID, options) {
    const batch = await this.retrieve(messageBatchID);
    if (!batch.results_url) {
      throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
    }
    return this._client.get(batch.results_url, {
      ...options,
      headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
      stream: true,
      __binaryResponse: true
    })._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
  }
};

// node_modules/@anthropic-ai/sdk/resources/messages/messages.mjs
var Messages2 = class extends APIResource {
  constructor() {
    super(...arguments);
    this.batches = new Batches2(this._client);
  }
  create(body, options) {
    if (body.model in DEPRECATED_MODELS2) {
      console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS2[body.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
    }
    let timeout = this._client._options.timeout;
    if (!body.stream && timeout == null) {
      const maxNonstreamingTokens = MODEL_NONSTREAMING_TOKENS[body.model] ?? void 0;
      timeout = this._client.calculateNonstreamingTimeout(body.max_tokens, maxNonstreamingTokens);
    }
    return this._client.post("/v1/messages", {
      body,
      timeout: timeout ?? 6e5,
      ...options,
      stream: body.stream ?? false
    });
  }
  /**
   * Create a Message stream
   */
  stream(body, options) {
    return MessageStream.createMessage(this, body, options);
  }
  /**
   * Count the number of tokens in a Message.
   *
   * The Token Count API can be used to count the number of tokens in a Message,
   * including tools, images, and documents, without creating it.
   *
   * Learn more about token counting in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/token-counting)
   *
   * @example
   * ```ts
   * const messageTokensCount =
   *   await client.messages.countTokens({
   *     messages: [{ content: 'string', role: 'user' }],
   *     model: 'claude-opus-4-5-20251101',
   *   });
   * ```
   */
  countTokens(body, options) {
    return this._client.post("/v1/messages/count_tokens", { body, ...options });
  }
};
var DEPRECATED_MODELS2 = {
  "claude-1.3": "November 6th, 2024",
  "claude-1.3-100k": "November 6th, 2024",
  "claude-instant-1.1": "November 6th, 2024",
  "claude-instant-1.1-100k": "November 6th, 2024",
  "claude-instant-1.2": "November 6th, 2024",
  "claude-3-sonnet-20240229": "July 21st, 2025",
  "claude-3-opus-20240229": "January 5th, 2026",
  "claude-2.1": "July 21st, 2025",
  "claude-2.0": "July 21st, 2025",
  "claude-3-7-sonnet-latest": "February 19th, 2026",
  "claude-3-7-sonnet-20250219": "February 19th, 2026"
};
Messages2.Batches = Batches2;

// node_modules/@anthropic-ai/sdk/resources/models.mjs
var Models2 = class extends APIResource {
  /**
   * Get a specific model.
   *
   * The Models API response can be used to determine information about a specific
   * model or resolve a model alias to a model ID.
   */
  retrieve(modelID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path12`/v1/models/${modelID}`, {
      ...options,
      headers: buildHeaders([
        { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
        options?.headers
      ])
    });
  }
  /**
   * List available models.
   *
   * The Models API response can be used to determine which models are available for
   * use in the API. More recently released models are listed first.
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/models", Page, {
      query,
      ...options,
      headers: buildHeaders([
        { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/internal/utils/env.mjs
var readEnv = (env) => {
  if (typeof globalThis.process !== "undefined") {
    return globalThis.process.env?.[env]?.trim() ?? void 0;
  }
  if (typeof globalThis.Deno !== "undefined") {
    return globalThis.Deno.env?.get?.(env)?.trim();
  }
  return void 0;
};

// node_modules/@anthropic-ai/sdk/client.mjs
var _BaseAnthropic_instances;
var _a;
var _BaseAnthropic_encoder;
var _BaseAnthropic_baseURLOverridden;
var HUMAN_PROMPT = "\\n\\nHuman:";
var AI_PROMPT = "\\n\\nAssistant:";
var BaseAnthropic = class {
  /**
   * API Client for interfacing with the Anthropic API.
   *
   * @param {string | null | undefined} [opts.apiKey=process.env['ANTHROPIC_API_KEY'] ?? null]
   * @param {string | null | undefined} [opts.authToken=process.env['ANTHROPIC_AUTH_TOKEN'] ?? null]
   * @param {string} [opts.baseURL=process.env['ANTHROPIC_BASE_URL'] ?? https://api.anthropic.com] - Override the default base URL for the API.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
   * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor({ baseURL = readEnv("ANTHROPIC_BASE_URL"), apiKey = readEnv("ANTHROPIC_API_KEY") ?? null, authToken = readEnv("ANTHROPIC_AUTH_TOKEN") ?? null, ...opts } = {}) {
    _BaseAnthropic_instances.add(this);
    _BaseAnthropic_encoder.set(this, void 0);
    const options = {
      apiKey,
      authToken,
      ...opts,
      baseURL: baseURL || `https://api.anthropic.com`
    };
    if (!options.dangerouslyAllowBrowser && isRunningInBrowser()) {
      throw new AnthropicError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew Anthropic({ apiKey, dangerouslyAllowBrowser: true });\n");
    }
    this.baseURL = options.baseURL;
    this.timeout = options.timeout ?? _a.DEFAULT_TIMEOUT;
    this.logger = options.logger ?? console;
    const defaultLogLevel = "warn";
    this.logLevel = defaultLogLevel;
    this.logLevel = parseLogLevel(options.logLevel, "ClientOptions.logLevel", this) ?? parseLogLevel(readEnv("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? defaultLogLevel;
    this.fetchOptions = options.fetchOptions;
    this.maxRetries = options.maxRetries ?? 2;
    this.fetch = options.fetch ?? getDefaultFetch();
    __classPrivateFieldSet(this, _BaseAnthropic_encoder, FallbackEncoder, "f");
    this._options = options;
    this.apiKey = typeof apiKey === "string" ? apiKey : null;
    this.authToken = authToken;
  }
  /**
   * Create a new client instance re-using the same options given to the current client with optional overriding.
   */
  withOptions(options) {
    const client = new this.constructor({
      ...this._options,
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      apiKey: this.apiKey,
      authToken: this.authToken,
      ...options
    });
    return client;
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  validateHeaders({ values, nulls }) {
    if (values.get("x-api-key") || values.get("authorization")) {
      return;
    }
    if (this.apiKey && values.get("x-api-key")) {
      return;
    }
    if (nulls.has("x-api-key")) {
      return;
    }
    if (this.authToken && values.get("authorization")) {
      return;
    }
    if (nulls.has("authorization")) {
      return;
    }
    throw new Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted');
  }
  async authHeaders(opts) {
    return buildHeaders([await this.apiKeyAuth(opts), await this.bearerAuth(opts)]);
  }
  async apiKeyAuth(opts) {
    if (this.apiKey == null) {
      return void 0;
    }
    return buildHeaders([{ "X-Api-Key": this.apiKey }]);
  }
  async bearerAuth(opts) {
    if (this.authToken == null) {
      return void 0;
    }
    return buildHeaders([{ Authorization: `Bearer ${this.authToken}` }]);
  }
  /**
   * Basic re-implementation of `qs.stringify` for primitive types.
   */
  stringifyQuery(query) {
    return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
      if (value === null) {
        return `${encodeURIComponent(key)}=`;
      }
      throw new AnthropicError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
    }).join("&");
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${VERSION}`;
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${uuid4()}`;
  }
  makeStatusError(status, error, message, headers) {
    return APIError.generate(status, error, message, headers);
  }
  buildURL(path17, query, defaultBaseURL) {
    const baseURL = !__classPrivateFieldGet(this, _BaseAnthropic_instances, "m", _BaseAnthropic_baseURLOverridden).call(this) && defaultBaseURL || this.baseURL;
    const url = isAbsoluteURL(path17) ? new URL(path17) : new URL(baseURL + (baseURL.endsWith("/") && path17.startsWith("/") ? path17.slice(1) : path17));
    const defaultQuery = this.defaultQuery();
    if (!isEmptyObj(defaultQuery)) {
      query = { ...defaultQuery, ...query };
    }
    if (typeof query === "object" && query && !Array.isArray(query)) {
      url.search = this.stringifyQuery(query);
    }
    return url.toString();
  }
  _calculateNonstreamingTimeout(maxTokens) {
    const defaultTimeout = 10 * 60;
    const expectedTimeout = 60 * 60 * maxTokens / 128e3;
    if (expectedTimeout > defaultTimeout) {
      throw new AnthropicError("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
    }
    return defaultTimeout * 1e3;
  }
  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  async prepareOptions(options) {
  }
  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  async prepareRequest(request, { url, options }) {
  }
  get(path17, opts) {
    return this.methodRequest("get", path17, opts);
  }
  post(path17, opts) {
    return this.methodRequest("post", path17, opts);
  }
  patch(path17, opts) {
    return this.methodRequest("patch", path17, opts);
  }
  put(path17, opts) {
    return this.methodRequest("put", path17, opts);
  }
  delete(path17, opts) {
    return this.methodRequest("delete", path17, opts);
  }
  methodRequest(method, path17, opts) {
    return this.request(Promise.resolve(opts).then((opts2) => {
      return { method, path: path17, ...opts2 };
    }));
  }
  request(options, remainingRetries = null) {
    return new APIPromise(this, this.makeRequest(options, remainingRetries, void 0));
  }
  async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
    const options = await optionsInput;
    const maxRetries = options.maxRetries ?? this.maxRetries;
    if (retriesRemaining == null) {
      retriesRemaining = maxRetries;
    }
    await this.prepareOptions(options);
    const { req, url, timeout } = await this.buildRequest(options, {
      retryCount: maxRetries - retriesRemaining
    });
    await this.prepareRequest(req, { url, options });
    const requestLogID = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0");
    const retryLogStr = retryOfRequestLogID === void 0 ? "" : `, retryOf: ${retryOfRequestLogID}`;
    const startTime = Date.now();
    loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
      retryOfRequestLogID,
      method: options.method,
      url,
      options,
      headers: req.headers
    }));
    if (options.signal?.aborted) {
      throw new APIUserAbortError();
    }
    const controller = new AbortController();
    const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
    const headersTime = Date.now();
    if (response instanceof globalThis.Error) {
      const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
      if (options.signal?.aborted) {
        throw new APIUserAbortError();
      }
      const isTimeout = isAbortError(response) || /timed? ?out/i.test(String(response) + ("cause" in response ? String(response.cause) : ""));
      if (retriesRemaining) {
        loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${retryMessage}`);
        loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${retryMessage})`, formatRequestDetails({
          retryOfRequestLogID,
          url,
          durationMs: headersTime - startTime,
          message: response.message
        }));
        return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
      }
      loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - error; no more retries left`);
      loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (error; no more retries left)`, formatRequestDetails({
        retryOfRequestLogID,
        url,
        durationMs: headersTime - startTime,
        message: response.message
      }));
      if (isTimeout) {
        throw new APIConnectionTimeoutError();
      }
      throw new APIConnectionError({ cause: response });
    }
    const specialHeaders = [...response.headers.entries()].filter(([name]) => name === "request-id").map(([name, value]) => ", " + name + ": " + JSON.stringify(value)).join("");
    const responseInfo = `[${requestLogID}${retryLogStr}${specialHeaders}] ${req.method} ${url} ${response.ok ? "succeeded" : "failed"} with status ${response.status} in ${headersTime - startTime}ms`;
    if (!response.ok) {
      const shouldRetry = await this.shouldRetry(response);
      if (retriesRemaining && shouldRetry) {
        const retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
        await CancelReadableStream(response.body);
        loggerFor(this).info(`${responseInfo} - ${retryMessage2}`);
        loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage2})`, formatRequestDetails({
          retryOfRequestLogID,
          url: response.url,
          status: response.status,
          headers: response.headers,
          durationMs: headersTime - startTime
        }));
        return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
      }
      const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
      loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
      const errText = await response.text().catch((err2) => castToError(err2).message);
      const errJSON = safeJSON(errText);
      const errMessage = errJSON ? void 0 : errText;
      loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
        retryOfRequestLogID,
        url: response.url,
        status: response.status,
        headers: response.headers,
        message: errMessage,
        durationMs: Date.now() - startTime
      }));
      const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
      throw err;
    }
    loggerFor(this).info(responseInfo);
    loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
      retryOfRequestLogID,
      url: response.url,
      status: response.status,
      headers: response.headers,
      durationMs: headersTime - startTime
    }));
    return { response, options, controller, requestLogID, retryOfRequestLogID, startTime };
  }
  getAPIList(path17, Page2, opts) {
    return this.requestAPIList(Page2, { method: "get", path: path17, ...opts });
  }
  requestAPIList(Page2, options) {
    const request = this.makeRequest(options, null, void 0);
    return new PagePromise(this, request, Page2);
  }
  async fetchWithTimeout(url, init, ms, controller) {
    const { signal, method, ...options } = init || {};
    if (signal)
      signal.addEventListener("abort", () => controller.abort());
    const timeout = setTimeout(() => controller.abort(), ms);
    const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === "object" && options.body !== null && Symbol.asyncIterator in options.body;
    const fetchOptions = {
      signal: controller.signal,
      ...isReadableBody ? { duplex: "half" } : {},
      method: "GET",
      ...options
    };
    if (method) {
      fetchOptions.method = method.toUpperCase();
    }
    try {
      return await this.fetch.call(void 0, url, fetchOptions);
    } finally {
      clearTimeout(timeout);
    }
  }
  async shouldRetry(response) {
    const shouldRetryHeader = response.headers.get("x-should-retry");
    if (shouldRetryHeader === "true")
      return true;
    if (shouldRetryHeader === "false")
      return false;
    if (response.status === 408)
      return true;
    if (response.status === 409)
      return true;
    if (response.status === 429)
      return true;
    if (response.status >= 500)
      return true;
    return false;
  }
  async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
    let timeoutMillis;
    const retryAfterMillisHeader = responseHeaders?.get("retry-after-ms");
    if (retryAfterMillisHeader) {
      const timeoutMs = parseFloat(retryAfterMillisHeader);
      if (!Number.isNaN(timeoutMs)) {
        timeoutMillis = timeoutMs;
      }
    }
    const retryAfterHeader = responseHeaders?.get("retry-after");
    if (retryAfterHeader && !timeoutMillis) {
      const timeoutSeconds = parseFloat(retryAfterHeader);
      if (!Number.isNaN(timeoutSeconds)) {
        timeoutMillis = timeoutSeconds * 1e3;
      } else {
        timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
      }
    }
    if (!(timeoutMillis && 0 <= timeoutMillis && timeoutMillis < 60 * 1e3)) {
      const maxRetries = options.maxRetries ?? this.maxRetries;
      timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
    }
    await sleep(timeoutMillis);
    return this.makeRequest(options, retriesRemaining - 1, requestLogID);
  }
  calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
    const initialRetryDelay = 0.5;
    const maxRetryDelay = 8;
    const numRetries = maxRetries - retriesRemaining;
    const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
    const jitter = 1 - Math.random() * 0.25;
    return sleepSeconds * jitter * 1e3;
  }
  calculateNonstreamingTimeout(maxTokens, maxNonstreamingTokens) {
    const maxTime = 60 * 60 * 1e3;
    const defaultTime = 60 * 10 * 1e3;
    const expectedTime = maxTime * maxTokens / 128e3;
    if (expectedTime > defaultTime || maxNonstreamingTokens != null && maxTokens > maxNonstreamingTokens) {
      throw new AnthropicError("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
    }
    return defaultTime;
  }
  async buildRequest(inputOptions, { retryCount = 0 } = {}) {
    const options = { ...inputOptions };
    const { method, path: path17, query, defaultBaseURL } = options;
    const url = this.buildURL(path17, query, defaultBaseURL);
    if ("timeout" in options)
      validatePositiveInteger("timeout", options.timeout);
    options.timeout = options.timeout ?? this.timeout;
    const { bodyHeaders, body } = this.buildBody({ options });
    const reqHeaders = await this.buildHeaders({ options: inputOptions, method, bodyHeaders, retryCount });
    const req = {
      method,
      headers: reqHeaders,
      ...options.signal && { signal: options.signal },
      ...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && { duplex: "half" },
      ...body && { body },
      ...this.fetchOptions ?? {},
      ...options.fetchOptions ?? {}
    };
    return { req, url, timeout: options.timeout };
  }
  async buildHeaders({ options, method, bodyHeaders, retryCount }) {
    let idempotencyHeaders = {};
    if (this.idempotencyHeader && method !== "get") {
      if (!options.idempotencyKey)
        options.idempotencyKey = this.defaultIdempotencyKey();
      idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
    }
    const headers = buildHeaders([
      idempotencyHeaders,
      {
        Accept: "application/json",
        "User-Agent": this.getUserAgent(),
        "X-Stainless-Retry-Count": String(retryCount),
        ...options.timeout ? { "X-Stainless-Timeout": String(Math.trunc(options.timeout / 1e3)) } : {},
        ...getPlatformHeaders(),
        ...this._options.dangerouslyAllowBrowser ? { "anthropic-dangerous-direct-browser-access": "true" } : void 0,
        "anthropic-version": "2023-06-01"
      },
      await this.authHeaders(options),
      this._options.defaultHeaders,
      bodyHeaders,
      options.headers
    ]);
    this.validateHeaders(headers);
    return headers.values;
  }
  buildBody({ options: { body, headers: rawHeaders } }) {
    if (!body) {
      return { bodyHeaders: void 0, body: void 0 };
    }
    const headers = buildHeaders([rawHeaders]);
    if (
      // Pass raw type verbatim
      ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === "string" && // Preserve legacy string encoding behavior for now
      headers.values.has("content-type") || // `Blob` is superset of `File`
      globalThis.Blob && body instanceof globalThis.Blob || // `FormData` -> `multipart/form-data`
      body instanceof FormData || // `URLSearchParams` -> `application/x-www-form-urlencoded`
      body instanceof URLSearchParams || // Send chunked stream (each chunk has own `length`)
      globalThis.ReadableStream && body instanceof globalThis.ReadableStream
    ) {
      return { bodyHeaders: void 0, body };
    } else if (typeof body === "object" && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function")) {
      return { bodyHeaders: void 0, body: ReadableStreamFrom(body) };
    } else {
      return __classPrivateFieldGet(this, _BaseAnthropic_encoder, "f").call(this, { body, headers });
    }
  }
};
_a = BaseAnthropic, _BaseAnthropic_encoder = /* @__PURE__ */ new WeakMap(), _BaseAnthropic_instances = /* @__PURE__ */ new WeakSet(), _BaseAnthropic_baseURLOverridden = function _BaseAnthropic_baseURLOverridden2() {
  return this.baseURL !== "https://api.anthropic.com";
};
BaseAnthropic.Anthropic = _a;
BaseAnthropic.HUMAN_PROMPT = HUMAN_PROMPT;
BaseAnthropic.AI_PROMPT = AI_PROMPT;
BaseAnthropic.DEFAULT_TIMEOUT = 6e5;
BaseAnthropic.AnthropicError = AnthropicError;
BaseAnthropic.APIError = APIError;
BaseAnthropic.APIConnectionError = APIConnectionError;
BaseAnthropic.APIConnectionTimeoutError = APIConnectionTimeoutError;
BaseAnthropic.APIUserAbortError = APIUserAbortError;
BaseAnthropic.NotFoundError = NotFoundError;
BaseAnthropic.ConflictError = ConflictError;
BaseAnthropic.RateLimitError = RateLimitError;
BaseAnthropic.BadRequestError = BadRequestError;
BaseAnthropic.AuthenticationError = AuthenticationError;
BaseAnthropic.InternalServerError = InternalServerError;
BaseAnthropic.PermissionDeniedError = PermissionDeniedError;
BaseAnthropic.UnprocessableEntityError = UnprocessableEntityError;
BaseAnthropic.toFile = toFile;
var Anthropic = class extends BaseAnthropic {
  constructor() {
    super(...arguments);
    this.completions = new Completions(this);
    this.messages = new Messages2(this);
    this.models = new Models2(this);
    this.beta = new Beta(this);
  }
};
Anthropic.Completions = Completions;
Anthropic.Messages = Messages2;
Anthropic.Models = Models2;
Anthropic.Beta = Beta;

// packages/tiny-brain-core/src/services/api/claude-tools.ts
var SKILL_TOOLS = [
  {
    name: "read_file",
    description: "Read the contents of a file at the specified path. Returns the file content as a string.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "The path to the file to read, relative to the repository root"
        }
      },
      required: ["path"]
    }
  },
  {
    name: "write_file",
    description: "Write content to a file at the specified path. Creates parent directories if they do not exist.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "The path to the file to write, relative to the repository root"
        },
        content: {
          type: "string",
          description: "The content to write to the file"
        }
      },
      required: ["path", "content"]
    }
  },
  {
    name: "list_directory",
    description: "List the contents of a directory. Returns file and directory names.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "The path to the directory to list, relative to the repository root"
        },
        recursive: {
          type: "boolean",
          description: "Whether to list contents recursively",
          default: false
        }
      },
      required: ["path"]
    }
  },
  {
    name: "execute_bash",
    description: "Execute a bash command in the repository root. Use for running tests, builds, or other shell operations.",
    input_schema: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The bash command to execute"
        },
        timeout: {
          type: "number",
          description: "Maximum time in milliseconds to wait for the command to complete",
          default: 3e4
        }
      },
      required: ["command"]
    }
  },
  {
    name: "search_files",
    description: "Search for files matching a glob pattern. Returns matching file paths.",
    input_schema: {
      type: "object",
      properties: {
        pattern: {
          type: "string",
          description: 'Glob pattern to match files (e.g., "**/*.ts", "src/**/*.test.ts")'
        },
        path: {
          type: "string",
          description: "Directory to search in, relative to repository root. Defaults to repository root."
        }
      },
      required: ["pattern"]
    }
  },
  {
    name: "plan_sync",
    description: "Synchronize a PRD plan from markdown files to progress.json. Call this after creating or modifying PRD files.",
    input_schema: {
      type: "object",
      properties: {
        planId: {
          type: "string",
          description: "The ID of the plan/PRD to sync (matches the id field in prd.md frontmatter)"
        }
      },
      required: ["planId"]
    }
  }
];

// packages/tiny-brain-core/src/services/api/claude-client.ts
var ClaudeClient = class {
  client;
  model;
  maxIterations;
  constructor(config) {
    this.client = new Anthropic({ apiKey: config.apiKey });
    this.model = config.model ?? "claude-sonnet-4-20250514";
    this.maxIterations = config.maxIterations ?? 20;
  }
  async invokeSkill(request, callbacks) {
    const messages = [
      { role: "user", content: request.userMessage }
    ];
    let iterations = 0;
    try {
      while (iterations < this.maxIterations) {
        iterations++;
        const response = await this.client.messages.create({
          model: this.model,
          max_tokens: 4096,
          system: request.systemPrompt,
          tools: SKILL_TOOLS,
          messages
        });
        const toolUses = [];
        for (const block of response.content) {
          if (block.type === "text") {
            callbacks.onText(block.text);
          } else if (block.type === "tool_use") {
            callbacks.onToolUse(block.name, block.input);
            toolUses.push({
              id: block.id,
              name: block.name,
              input: block.input
            });
          }
        }
        if (response.stop_reason === "end_turn") {
          callbacks.onComplete();
          return;
        }
        if (toolUses.length > 0) {
          const toolResults = [];
          for (const tool of toolUses) {
            const result = await request.toolExecutor.execute(
              tool.name,
              tool.input
            );
            callbacks.onToolResult(tool.id, result);
            toolResults.push({
              type: "tool_result",
              tool_use_id: tool.id,
              content: result.success ? JSON.stringify(result.result) : `Error: ${result.error}`
            });
          }
          messages.push({
            role: "assistant",
            content: response.content
          });
          messages.push({
            role: "user",
            content: toolResults
          });
        }
      }
      callbacks.onError(new Error(`Exceeded maximum iterations (${this.maxIterations})`));
    } catch (error) {
      callbacks.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
};

// packages/tiny-brain-core/src/services/api/tool-executor.ts
import * as fs11 from "fs/promises";
import * as path13 from "path";
import { exec as exec3 } from "child_process";
var ToolExecutor = class {
  repositoryRoot;
  defaultTimeout;
  constructor(config) {
    this.repositoryRoot = config.repositoryRoot;
    this.defaultTimeout = config.defaultTimeout ?? 3e4;
  }
  async execute(toolName, input) {
    try {
      switch (toolName) {
        case "read_file":
          return await this.readFile(input);
        case "write_file":
          return await this.writeFile(input);
        case "list_directory":
          return await this.listDirectory(input);
        case "execute_bash":
          return await this.executeBash(input);
        case "search_files":
          return await this.searchFiles(input);
        case "plan_sync":
          return await this.planSync(input);
        default:
          return { success: false, error: `Unknown tool: ${toolName}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  validatePath(inputPath) {
    const resolvedPath = path13.resolve(this.repositoryRoot, inputPath);
    if (!resolvedPath.startsWith(this.repositoryRoot)) {
      return {
        valid: false,
        resolvedPath,
        error: `Path "${inputPath}" resolves outside repository root`
      };
    }
    return { valid: true, resolvedPath };
  }
  async readFile(input) {
    const validation = this.validatePath(input.path);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    try {
      const content = await fs11.readFile(validation.resolvedPath, "utf-8");
      return { success: true, result: content };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  async writeFile(input) {
    const validation = this.validatePath(input.path);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    try {
      const dir = path13.dirname(validation.resolvedPath);
      await fs11.mkdir(dir, { recursive: true });
      await fs11.writeFile(validation.resolvedPath, input.content, "utf-8");
      return { success: true, result: "File written successfully" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  async listDirectory(input) {
    const validation = this.validatePath(input.path);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    try {
      const entries = await this.listDirectoryRecursive(
        validation.resolvedPath,
        input.recursive ?? false
      );
      return { success: true, result: entries };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  async listDirectoryRecursive(dirPath, recursive, prefix = "") {
    const entries = await fs11.readdir(dirPath, { withFileTypes: true });
    const result = [];
    for (const entry of entries) {
      const entryPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const type2 = entry.isDirectory() ? "directory" : "file";
      result.push({ name: entryPath, type: type2 });
      if (recursive && entry.isDirectory()) {
        const subEntries = await this.listDirectoryRecursive(
          path13.join(dirPath, entry.name),
          recursive,
          entryPath
        );
        result.push(...subEntries);
      }
    }
    return result;
  }
  async executeBash(input) {
    const timeout = input.timeout ?? this.defaultTimeout;
    return new Promise((resolve3) => {
      exec3(
        input.command,
        {
          cwd: this.repositoryRoot,
          timeout,
          maxBuffer: 10 * 1024 * 1024
          // 10MB
        },
        (error, stdout, stderr) => {
          if (error) {
            resolve3({
              success: false,
              error: error.message + (stderr ? `
Stderr: ${stderr}` : "")
            });
            return;
          }
          const result = stderr ? `${stdout}
Stderr: ${stderr}` : stdout;
          resolve3({ success: true, result });
        }
      );
    });
  }
  async searchFiles(input) {
    let searchPath = this.repositoryRoot;
    if (input.path) {
      const validation = this.validatePath(input.path);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      searchPath = validation.resolvedPath;
    }
    try {
      const files = await glob(input.pattern, {
        cwd: searchPath,
        nodir: true
      });
      return { success: true, result: files };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  async planSync(input) {
    return {
      success: true,
      result: `Plan sync requested for plan: ${input.planId}. This should be handled by the PlanService.`
    };
  }
};

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
  /**
   * Analyse a repository using core AnalysisService
   * This is the "re-run" analysis used from dashboard (full tech detection,
   * write analysis.json, fetch tech contexts, sync agents).
   *
   * @param repoPath - Path to the repository
   * @param onProgress - Optional callback for progress events (enables SSE streaming)
   * @returns Analysis result
   */
  async analyseRepository(repoPath, onProgress) {
    const analysisService = new AnalysisService(repoPath, {
      authToken: this.context.authToken,
      onProgress,
      logger: {
        info: (msg) => console.log(`[Analysis] ${msg}`),
        debug: (msg) => console.debug(`[Analysis] ${msg}`),
        warn: (msg) => console.warn(`[Analysis] ${msg}`)
      }
    });
    return analysisService.performAnalysis();
  }
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
    const type2 = c.req.query("type");
    const plans = await bridge.planning.listPlans(type2 ? { type: type2 } : {});
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
        clientSecret: null,
        hasLlmApiKey: false
      });
    }
    return c.json({
      clientId: libraryAuth.clientId || null,
      clientSecret: libraryAuth.hasStoredSecret ? "[STORED]" : null,
      hasLlmApiKey: libraryAuth.hasLlmApiKey
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
import { readdir as readdir9, readFile as readFile10 } from "fs/promises";
import { join as join12 } from "path";
import { createHash as createHash2 } from "crypto";
function toRepoAnalysisFile(result) {
  const analysis = result.analysis;
  const hashInput = JSON.stringify({
    languages: analysis.languages,
    frameworks: analysis.frameworks,
    testingTools: analysis.testingTools,
    buildTools: analysis.buildTools
  });
  const analysisHash = createHash2("md5").update(hashInput).digest("hex").slice(0, 8);
  return {
    version: "1.0",
    detectedAt: (/* @__PURE__ */ new Date()).toISOString(),
    analysisHash,
    stack: {
      languages: analysis.languages,
      frameworks: analysis.frameworks,
      testing: analysis.testingTools,
      build: analysis.buildTools
    },
    analysis: {
      hasTests: analysis.hasTests,
      testFileCount: analysis.testFileCount,
      testPatterns: analysis.testPatterns,
      isPolyglot: analysis.isPolyglot ?? false,
      primaryLanguage: analysis.primaryLanguage ?? "unknown",
      documentationPattern: analysis.documentationPattern,
      documentationLocations: analysis.documentationLocations
    }
  };
}
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
function createRepoRoutes(bridge, sse) {
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
      const featurePath = join12(repo.path, "docs", "prd", planId, "features", `${featureId}.md`);
      console.log("[Feature API] Looking for file:", featurePath);
      try {
        const content = await readFile10(featurePath, "utf-8");
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
      const agentsPath = join12(repo.path, ".claude", "agents");
      const agents = [];
      try {
        const files = await readdir9(agentsPath);
        const mdFiles = files.filter((f) => f.endsWith(".md"));
        for (const file of mdFiles) {
          const content = await readFile10(join12(agentsPath, file), "utf-8");
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
      const skillsPath = join12(repo.path, ".claude", "skills");
      const skills = [];
      try {
        const entries = await readdir9(skillsPath, { withFileTypes: true });
        const directories = entries.filter((e) => e.isDirectory());
        for (const dir of directories) {
          const skillMdPath = join12(skillsPath, dir.name, "SKILL.md");
          try {
            const content = await readFile10(skillMdPath, "utf-8");
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
  app.get("/:repoId/analysis", async (c) => {
    try {
      const repoId = c.req.param("repoId");
      const repo = await bridge.repoConfig.getRepo(repoId);
      if (!repo) {
        return c.json({ error: "Repository not found" }, 404);
      }
      const analysisPath = join12(repo.path, ".tiny-brain", "analysis.json");
      try {
        const content = await readFile10(analysisPath, "utf-8");
        const analysis = JSON.parse(content);
        return c.json({ exists: true, analysis });
      } catch (err) {
        if (err.code === "ENOENT") {
          return c.json({ exists: false, analysis: null });
        }
        throw err;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 500);
    }
  });
  app.post("/:repoId/analysis", async (c) => {
    try {
      const repoId = c.req.param("repoId");
      const repo = await bridge.repoConfig.getRepo(repoId);
      if (!repo) {
        return c.json({ error: "Repository not found" }, 404);
      }
      if (!bridge.analyseRepository) {
        return c.json({ error: "Analysis service not available" }, 500);
      }
      const runAnalysis = async () => {
        try {
          const onProgress = sse ? (event) => {
            sse.broadcast("analysis-progress", {
              eventType: event.type,
              repoId,
              timestamp: event.timestamp,
              message: event.message,
              data: event.data
            });
          } : void 0;
          const result = await bridge.analyseRepository(repo.path, onProgress);
          if (sse) {
            await sse.broadcast("analysis-change", {
              eventType: "analysis:complete",
              repoId,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              analysis: toRepoAnalysisFile(result)
            });
          }
        } catch (error) {
          if (sse) {
            await sse.broadcast("analysis-change", {
              eventType: "analysis:failed",
              repoId,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              error: error instanceof Error ? error.message : "Unknown error"
            });
          }
        }
      };
      runAnalysis();
      return c.json({ accepted: true, repoId }, 202);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 500);
    }
  });
  app.get("/:repoId/quality", async (c) => {
    try {
      const repoId = c.req.param("repoId");
      const repo = await bridge.repoConfig.getRepo(repoId);
      if (!repo) {
        return c.json({ error: "Repository not found" }, 404);
      }
      const qualityRunsPath = join12(repo.path, "docs", "quality", "runs");
      const runs = [];
      try {
        const files = await readdir9(qualityRunsPath);
        const qualityFiles = files.filter((f) => f.endsWith("-quality.md"));
        qualityFiles.sort((a, b) => b.localeCompare(a));
        for (const file of qualityFiles) {
          const content = await readFile10(join12(qualityRunsPath, file), "utf-8");
          const frontmatter = parseFrontmatter(content);
          const runId = file.replace(".md", "");
          runs.push({
            runId,
            date: frontmatter.run_date || "",
            score: parseInt(frontmatter.score || "0", 10),
            grade: frontmatter.grade || "",
            issueCount: parseInt(frontmatter.issues_count || frontmatter.issue_count || "0", 10)
          });
        }
      } catch (err) {
        if (err.code !== "ENOENT") {
          throw err;
        }
      }
      const latestGrade = runs.length > 0 ? runs[0].grade : null;
      const latestScore = runs.length > 0 ? runs[0].score : null;
      return c.json({ runs, latestGrade, latestScore });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 500);
    }
  });
  app.get("/:repoId/quality/:runId", async (c) => {
    try {
      const repoId = c.req.param("repoId");
      const runId = c.req.param("runId");
      const repo = await bridge.repoConfig.getRepo(repoId);
      if (!repo) {
        return c.json({ error: "Repository not found" }, 404);
      }
      const runPath = join12(repo.path, "docs", "quality", "runs", `${runId}.md`);
      try {
        const content = await readFile10(runPath, "utf-8");
        const frontmatter = parseFrontmatter(content);
        const run2 = {
          runId,
          date: frontmatter.run_date || "",
          score: parseInt(frontmatter.score || "0", 10),
          grade: frontmatter.grade || "",
          issueCount: parseInt(frontmatter.issues_count || frontmatter.issue_count || "0", 10),
          rawContent: content
        };
        return c.json({ run: run2 });
      } catch (err) {
        if (err.code === "ENOENT") {
          return c.json({ error: "Quality run not found" }, 404);
        }
        throw err;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 500);
    }
  });
  app.get("/:repoId/config-health", async (c) => {
    try {
      const repoId = c.req.param("repoId");
      const repo = await bridge.repoConfig.getRepo(repoId);
      if (!repo) {
        return c.json({ error: "Repository not found" }, 404);
      }
      const configHealthService = new ConfigHealthService(repo.path);
      const health = await configHealthService.getConfigHealth();
      return c.json({ health });
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
  app.get("/commits/:sha", async (c) => {
    const sha = c.req.param("sha");
    const repoId = c.req.param("repoId");
    if (!repoId) {
      return c.json({ error: "Repository ID is required" }, 400);
    }
    const repo = await bridge.repoConfig.getRepo(repoId);
    if (!repo) {
      return c.json({ error: "Repository not found" }, 404);
    }
    const repositoryRoot = repo.path;
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("bad object") || errorMessage.includes("unknown revision")) {
        return c.json({ error: "Commit not found" }, 404);
      }
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

// packages/tiny-brain-dashboard/server/routes/hooks.routes.ts
function createHooksRoutes(_bridge) {
  const app = new Hono2();
  app.get("/", async (c) => {
    const repoPath = c.req.query("repoPath");
    if (!repoPath) {
      return c.json({ error: "repoPath query parameter is required" }, 400);
    }
    const hooksService = new HooksService(repoPath);
    const hooks = await hooksService.getAllHooks();
    return c.json(hooks);
  });
  app.get("/:hookType/:hookName/content", async (c) => {
    const hookType = c.req.param("hookType");
    const hookName = c.req.param("hookName");
    const repoPath = c.req.query("repoPath");
    if (!repoPath) {
      return c.json({ error: "repoPath query parameter is required" }, 400);
    }
    if (hookType !== "git" && hookType !== "plugin") {
      return c.json({ error: 'hookType must be "git" or "plugin"' }, 400);
    }
    const hooksService = new HooksService(repoPath);
    const content = await hooksService.getHookContent(hookType, hookName);
    if (content === null) {
      return c.json({ error: "Hook not found" }, 404);
    }
    return c.json({ content });
  });
  return app;
}

// node_modules/hono/dist/utils/stream.js
var StreamingApi = class {
  writer;
  encoder;
  writable;
  abortSubscribers = [];
  responseReadable;
  /**
   * Whether the stream has been aborted.
   */
  aborted = false;
  /**
   * Whether the stream has been closed normally.
   */
  closed = false;
  constructor(writable, _readable) {
    this.writable = writable;
    this.writer = writable.getWriter();
    this.encoder = new TextEncoder();
    const reader = _readable.getReader();
    this.abortSubscribers.push(async () => {
      await reader.cancel();
    });
    this.responseReadable = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        done ? controller.close() : controller.enqueue(value);
      },
      cancel: () => {
        this.abort();
      }
    });
  }
  async write(input) {
    try {
      if (typeof input === "string") {
        input = this.encoder.encode(input);
      }
      await this.writer.write(input);
    } catch {
    }
    return this;
  }
  async writeln(input) {
    await this.write(input + "\n");
    return this;
  }
  sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
  async close() {
    try {
      await this.writer.close();
    } catch {
    }
    this.closed = true;
  }
  async pipe(body) {
    this.writer.releaseLock();
    await body.pipeTo(this.writable, { preventClose: true });
    this.writer = this.writable.getWriter();
  }
  onAbort(listener) {
    this.abortSubscribers.push(listener);
  }
  /**
   * Abort the stream.
   * You can call this method when stream is aborted by external event.
   */
  abort() {
    if (!this.aborted) {
      this.aborted = true;
      this.abortSubscribers.forEach((subscriber) => subscriber());
    }
  }
};

// node_modules/hono/dist/helper/streaming/utils.js
var isOldBunVersion = () => {
  const version = typeof Bun !== "undefined" ? Bun.version : void 0;
  if (version === void 0) {
    return false;
  }
  const result = version.startsWith("1.1") || version.startsWith("1.0") || version.startsWith("0.");
  isOldBunVersion = () => result;
  return result;
};

// node_modules/hono/dist/helper/streaming/sse.js
var SSEStreamingApi = class extends StreamingApi {
  constructor(writable, readable) {
    super(writable, readable);
  }
  async writeSSE(message) {
    const data = await resolveCallback(message.data, HtmlEscapedCallbackPhase.Stringify, false, {});
    const dataLines = data.split("\n").map((line) => {
      return `data: ${line}`;
    }).join("\n");
    const sseData = [
      message.event && `event: ${message.event}`,
      dataLines,
      message.id && `id: ${message.id}`,
      message.retry && `retry: ${message.retry}`
    ].filter(Boolean).join("\n") + "\n\n";
    await this.write(sseData);
  }
};
var run = async (stream3, cb, onError) => {
  try {
    await cb(stream3);
  } catch (e) {
    if (e instanceof Error && onError) {
      await onError(e, stream3);
      await stream3.writeSSE({
        event: "error",
        data: e.message
      });
    } else {
      console.error(e);
    }
  } finally {
    stream3.close();
  }
};
var contextStash = /* @__PURE__ */ new WeakMap();
var streamSSE = (c, cb, onError) => {
  const { readable, writable } = new TransformStream();
  const stream3 = new SSEStreamingApi(writable, readable);
  if (isOldBunVersion()) {
    c.req.raw.signal.addEventListener("abort", () => {
      if (!stream3.closed) {
        stream3.abort();
      }
    });
  }
  contextStash.set(stream3.responseReadable, c);
  c.header("Transfer-Encoding", "chunked");
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");
  run(stream3, cb, onError);
  return c.newResponse(stream3.responseReadable);
};

// packages/tiny-brain-dashboard/server/services/skill-session.service.ts
var SkillSessionManager = class {
  sessions = /* @__PURE__ */ new Map();
  /**
   * Create a new session for a skill invocation
   */
  createSession() {
    const id = crypto.randomUUID();
    const session = {
      id,
      abortController: new AbortController(),
      startedAt: /* @__PURE__ */ new Date()
    };
    this.sessions.set(id, session);
    return session;
  }
  /**
   * Get a session by ID
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }
  /**
   * Cancel a running session
   * @returns true if session was found and cancelled, false if not found
   */
  cancelSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }
    session.abortController.abort();
    this.sessions.delete(sessionId);
    return true;
  }
  /**
   * End a session (cleanup after completion)
   */
  endSession(sessionId) {
    this.sessions.delete(sessionId);
  }
  /**
   * Get count of active sessions
   */
  getActiveSessionCount() {
    return this.sessions.size;
  }
  /**
   * Clean up stale sessions (older than timeout)
   * @param timeoutMs Maximum session age in milliseconds (default: 30 minutes)
   */
  cleanupStaleSessions(timeoutMs = 30 * 60 * 1e3) {
    const now = Date.now();
    let cleanedCount = 0;
    for (const [id, session] of this.sessions) {
      if (now - session.startedAt.getTime() > timeoutMs) {
        session.abortController.abort();
        this.sessions.delete(id);
        cleanedCount++;
      }
    }
    return cleanedCount;
  }
};

// packages/tiny-brain-dashboard/server/routes/skills.routes.ts
var AVAILABLE_SKILLS = ["plan", "fix", "feature", "adr", "quality"];
function createSkillsRoutes(bridge) {
  const app = new Hono2();
  const sessionManager = new SkillSessionManager();
  const getSkillsPath = () => {
    if (process.env.CLAUDE_PLUGIN_ROOT) {
      return `${process.env.CLAUDE_PLUGIN_ROOT}/skills`;
    }
    return process.env.SKILLS_PATH || "/Users/andyrichardson/work/repos/tiny-brain/tiny-brain-local/packages/tiny-brain-plugin/skills";
  };
  app.get("/", async (c) => {
    const skillsPath = getSkillsPath();
    const loader2 = new SkillLoader(skillsPath);
    const skills = [];
    for (const skillName of AVAILABLE_SKILLS) {
      try {
        const skill = await loader2.loadSkill(skillName);
        skills.push({
          name: skill.name,
          description: skill.description,
          version: skill.version
        });
      } catch (error) {
        bridge.context.logger.warn(`Failed to load skill ${skillName}:`, error);
      }
    }
    return c.json({ skills });
  });
  app.post("/invoke", async (c) => {
    const body = await c.req.json();
    const { skill: skillName, prompt, context: userContext } = body;
    if (!skillName) {
      return c.json({ error: "Missing required field: skill" }, 400);
    }
    if (!prompt) {
      return c.json({ error: "Missing required field: prompt" }, 400);
    }
    const getLlmApiKey = bridge.context.libraryAuth?.getLlmApiKey;
    if (!getLlmApiKey) {
      return c.json({ error: "API key getter not configured" }, 401);
    }
    const apiKey = await getLlmApiKey();
    if (!apiKey) {
      return c.json({ error: "No API key configured. Please set LLM_API_KEY or configure via CLI." }, 401);
    }
    if (!AVAILABLE_SKILLS.includes(skillName)) {
      return c.json({ error: `Skill '${skillName}' not found` }, 404);
    }
    const skillsPath = getSkillsPath();
    const loader2 = new SkillLoader(skillsPath);
    let skill;
    try {
      skill = await loader2.loadSkill(skillName);
    } catch (error) {
      bridge.context.logger.error(`Failed to load skill ${skillName}:`, error);
      return c.json({ error: `Failed to load skill '${skillName}'` }, 500);
    }
    const session = sessionManager.createSession();
    const repositoryRoot = bridge.context.repositoryRoot || process.cwd();
    return streamSSE(c, async (stream3) => {
      try {
        const toolExecutor = new ToolExecutor({ repositoryRoot });
        const client = new ClaudeClient({ apiKey });
        let userMessage = prompt;
        if (userContext) {
          userMessage = `Context:
${JSON.stringify(userContext, null, 2)}

Request:
${prompt}`;
        }
        let systemPrompt = skill.systemPrompt;
        if (Object.keys(skill.templates).length > 0) {
          systemPrompt += "\n\n## Available Templates\n\n";
          for (const [name, content] of Object.entries(skill.templates)) {
            systemPrompt += `### ${name}
\`\`\`
${content}
\`\`\`

`;
          }
        }
        await client.invokeSkill(
          {
            systemPrompt,
            userMessage,
            toolExecutor
          },
          {
            onText: async (text) => {
              await stream3.writeSSE({
                event: "text",
                data: JSON.stringify({ text })
              });
            },
            onToolUse: async (toolName, input) => {
              await stream3.writeSSE({
                event: "tool_use",
                data: JSON.stringify({ tool: toolName, input })
              });
            },
            onToolResult: async (toolId, result) => {
              await stream3.writeSSE({
                event: "tool_result",
                data: JSON.stringify({
                  toolId,
                  success: result.success,
                  result: result.result,
                  error: result.error
                })
              });
            },
            onComplete: async () => {
              await stream3.writeSSE({
                event: "complete",
                data: JSON.stringify({ success: true, sessionId: session.id })
              });
              sessionManager.endSession(session.id);
            },
            onError: async (error) => {
              await stream3.writeSSE({
                event: "error",
                data: JSON.stringify({ error: error.message })
              });
              sessionManager.endSession(session.id);
            }
          }
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        await stream3.writeSSE({
          event: "error",
          data: JSON.stringify({ error: message })
        });
        sessionManager.endSession(session.id);
      }
    });
  });
  app.post("/:sessionId/cancel", async (c) => {
    const sessionId = c.req.param("sessionId");
    const cancelled = sessionManager.cancelSession(sessionId);
    if (!cancelled) {
      return c.json({ error: "Session not found" }, 404);
    }
    return c.json({ success: true, message: "Session cancelled" });
  });
  return app;
}

// packages/tiny-brain-dashboard/server/app.ts
var __dirname = path14.dirname(fileURLToPath3(import.meta.url));
function createApp(context, sse) {
  const app = new Hono2();
  const bridge = new ServiceBridge(context);
  app.use("*", cors());
  app.route("/api/plans", createPlanRoutes(bridge));
  app.route("/api/personas", createPersonaRoutes(bridge, sse));
  app.route("/api/config", createConfigRoutes(bridge));
  app.route("/api/library", createLibraryRoutes(bridge));
  app.route("/api/settings", createSettingsRoutes(bridge));
  app.route("/api/repos", createRepoRoutes(bridge, sse));
  app.route("/api/repos/:repoId/git", createGitRoutes(bridge));
  app.route("/api/hooks", createHooksRoutes(bridge));
  app.route("/api/plugins", createPluginRoutes(bridge));
  app.route("/api/skills", createSkillsRoutes(bridge));
  app.get("/events", async (c) => {
    c.header("Content-Type", "text/event-stream");
    c.header("Cache-Control", "no-cache");
    c.header("Connection", "keep-alive");
    const stream3 = new ReadableStream({
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
    return new Response(stream3, {
      headers: c.res.headers
    });
  });
  app.get("/health", (c) => {
    return c.json({ status: "ok" });
  });
  const distPath = process.env.TINY_BRAIN_DASHBOARD_STATIC_PATH ? path14.resolve(process.env.TINY_BRAIN_DASHBOARD_STATIC_PATH) : path14.resolve(__dirname, "../dist");
  const distExists = fs12.existsSync(distPath);
  if (distExists) {
    app.use("/assets/*", serveStatic({
      root: distPath,
      rewriteRequestPath: (path17) => path17.replace("/assets", "/assets")
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
      const indexPath = path14.join(distPath, "index.html");
      if (fs12.existsSync(indexPath)) {
        const indexHtml = fs12.readFileSync(indexPath, "utf-8");
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
  addConnection(stream3) {
    this.connections.add(stream3);
  }
  removeConnection(stream3) {
    this.connections.delete(stream3);
  }
  async broadcast(event, data) {
    const message = event ? `event: ${event}
data: ${JSON.stringify(data)}

` : `data: ${JSON.stringify(data)}

`;
    const promises2 = [];
    for (const stream3 of this.connections) {
      promises2.push(
        stream3.write(message).catch(() => {
          this.connections.delete(stream3);
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
import * as path16 from "path";
import * as fs14 from "fs";
import * as os from "os";

// packages/tiny-brain-dashboard/server/services/generic-file-watcher.ts
import * as fs13 from "fs";
import * as path15 from "path";
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
    if (!fs13.existsSync(watchPath)) {
      throw new Error(`Watch path does not exist: ${watchPath}`);
    }
    const stats = fs13.statSync(watchPath);
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
        const entries = fs13.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path15.join(currentPath, entry.name);
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
        const stats = fs13.statSync(filePath);
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
          relativePath: path15.relative(this.watchPath, filePath)
        };
        this.emit("change", change);
        this.logger.debug(`File deleted: ${filePath}`);
      }
    }
    for (const filePath of currentFiles) {
      try {
        const stats = fs13.statSync(filePath);
        const previousMtime = this.fileTimestamps.get(filePath);
        if (!previousMtime) {
          this.fileTimestamps.set(filePath, stats.mtimeMs);
          const change = {
            type: "added",
            filePath,
            relativePath: path15.relative(this.watchPath, filePath),
            mtime: stats.mtime
          };
          this.emit("change", change);
          this.logger.debug(`File added: ${filePath}`);
        } else if (stats.mtimeMs > previousMtime) {
          this.fileTimestamps.set(filePath, stats.mtimeMs);
          const change = {
            type: "modified",
            filePath,
            relativePath: path15.relative(this.watchPath, filePath),
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
  // Cache for quality runs per repo: Map<repoId, Map<runId, run>>
  qualityCache = /* @__PURE__ */ new Map();
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
      qualityWatcher: null,
      prdDocsWatcher: null,
      fixDocsWatcher: null,
      repoId,
      repoPath
    };
    if (!this.plansCache.has(repoId)) {
      this.plansCache.set(repoId, /* @__PURE__ */ new Map());
    }
    const tinyBrainPath = path16.join(repoPath, ".tiny-brain");
    this.context.logger.info(`[FileWatcher] Checking .tiny-brain path: ${tinyBrainPath} exists: ${fs14.existsSync(tinyBrainPath)}`);
    if (fs14.existsSync(tinyBrainPath)) {
      try {
        watchers.prdWatcher = new FileWatcherService(this.context.logger);
        watchers.prdWatcher.on("change", (change) => {
          if (change.relativePath.startsWith("progress/") || change.relativePath.startsWith("progress\\")) {
            this.context.logger.info(`[FileWatcher] PRD change detected in ${repoId}: ${change.type} ${change.relativePath}`);
            this.handleFileChange(repoId, change);
          }
        });
        await watchers.prdWatcher.start(tinyBrainPath, {
          pollInterval: 1e3,
          recursive: true,
          // Watch recursively to detect progress/ directory creation
          fileFilter: (filePath) => filePath.endsWith(".json") && filePath.includes("progress")
        });
        this.context.logger.info(`[FileWatcher] PRD watcher started for repo ${repoId}: ${tinyBrainPath}`);
      } catch (error) {
        this.context.logger.error(`[FileWatcher] Failed to start PRD watcher for ${repoId}:`, error);
      }
    } else {
      try {
        await fs14.promises.mkdir(tinyBrainPath, { recursive: true });
        this.context.logger.info(`[FileWatcher] Created .tiny-brain directory for repo ${repoId}`);
        watchers.prdWatcher = new FileWatcherService(this.context.logger);
        watchers.prdWatcher.on("change", (change) => {
          if (change.relativePath.startsWith("progress/") || change.relativePath.startsWith("progress\\")) {
            this.context.logger.info(`[FileWatcher] PRD change detected in ${repoId}: ${change.type} ${change.relativePath}`);
            this.handleFileChange(repoId, change);
          }
        });
        await watchers.prdWatcher.start(tinyBrainPath, {
          pollInterval: 1e3,
          recursive: true,
          fileFilter: (filePath) => filePath.endsWith(".json") && filePath.includes("progress")
        });
        this.context.logger.info(`[FileWatcher] PRD watcher started for repo ${repoId}: ${tinyBrainPath}`);
      } catch (error) {
        this.context.logger.error(`[FileWatcher] Failed to create .tiny-brain and start PRD watcher for ${repoId}:`, error);
      }
    }
    const fixesPath = path16.join(repoPath, ".tiny-brain/fixes");
    this.context.logger.info(`[FileWatcher] Checking fixes path: ${fixesPath} exists: ${fs14.existsSync(fixesPath)}`);
    if (fs14.existsSync(fixesPath)) {
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
    const qualityPath = path16.join(repoPath, "docs/quality/runs");
    this.context.logger.info(`[FileWatcher] Checking quality path: ${qualityPath} exists: ${fs14.existsSync(qualityPath)}`);
    if (fs14.existsSync(qualityPath)) {
      try {
        if (!this.qualityCache.has(repoId)) {
          this.qualityCache.set(repoId, /* @__PURE__ */ new Map());
        }
        watchers.qualityWatcher = new FileWatcherService(this.context.logger);
        watchers.qualityWatcher.on("change", (change) => {
          this.context.logger.info(`[FileWatcher] Quality change detected in ${repoId}: ${change.type} ${change.relativePath}`);
          this.handleQualityChange(repoId, change);
        });
        await watchers.qualityWatcher.start(qualityPath, {
          pollInterval: 1e3,
          recursive: false,
          fileFilter: (filePath) => filePath.endsWith(".md")
        });
        this.context.logger.info(`[FileWatcher] Quality watcher started for repo ${repoId}: ${qualityPath}`);
      } catch (error) {
        this.context.logger.error(`[FileWatcher] Failed to start quality watcher for ${repoId}:`, error);
      }
    }
    const prdDocsPath = path16.join(repoPath, "docs/prd");
    this.context.logger.info(`[FileWatcher] Checking PRD docs path: ${prdDocsPath} exists: ${fs14.existsSync(prdDocsPath)}`);
    if (fs14.existsSync(prdDocsPath)) {
      try {
        watchers.prdDocsWatcher = new FileWatcherService(this.context.logger);
        watchers.prdDocsWatcher.on("change", (change) => {
          this.context.logger.info(`[FileWatcher] PRD docs change detected in ${repoId}: ${change.type} ${change.relativePath}`);
          this.handlePrdDocsChange(repoId, repoPath, change);
        });
        await watchers.prdDocsWatcher.start(prdDocsPath, {
          pollInterval: 1e3,
          recursive: true,
          // Watch recursively for PRDs and their features
          fileFilter: (filePath) => filePath.endsWith(".md")
        });
        this.context.logger.info(`[FileWatcher] PRD docs watcher started for repo ${repoId}: ${prdDocsPath}`);
      } catch (error) {
        this.context.logger.error(`[FileWatcher] Failed to start PRD docs watcher for ${repoId}:`, error);
      }
    }
    const fixDocsPath = path16.join(repoPath, ".tiny-brain/fixes");
    if (fs14.existsSync(fixDocsPath)) {
      try {
        watchers.fixDocsWatcher = new FileWatcherService(this.context.logger);
        watchers.fixDocsWatcher.on("change", (change) => {
          if (change.relativePath.endsWith(".md")) {
            this.context.logger.info(`[FileWatcher] Fix docs change detected in ${repoId}: ${change.type} ${change.relativePath}`);
            this.handleFixDocsChange(repoId, change);
          }
        });
        await watchers.fixDocsWatcher.start(fixDocsPath, {
          pollInterval: 1e3,
          recursive: false,
          fileFilter: (filePath) => filePath.endsWith(".md")
        });
        this.context.logger.info(`[FileWatcher] Fix docs watcher started for repo ${repoId}: ${fixDocsPath}`);
      } catch (error) {
        this.context.logger.error(`[FileWatcher] Failed to start fix docs watcher for ${repoId}:`, error);
      }
    }
    this.repoWatchers.set(repoId, watchers);
    this.context.logger.info(`[FileWatcher] Repo watchers setup complete for: ${repoId}`);
  }
  /**
   * Start watching ~/.tiny-brain/repos/repos.json for new repo registrations
   */
  async startReposConfigWatcher() {
    const reposDir = path16.join(os.homedir(), ".tiny-brain", "repos");
    if (!fs14.existsSync(reposDir)) {
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
      if (watchers.qualityWatcher) {
        watchers.qualityWatcher.stop();
      }
      if (watchers.prdDocsWatcher) {
        watchers.prdDocsWatcher.stop();
      }
      if (watchers.fixDocsWatcher) {
        watchers.fixDocsWatcher.stop();
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
    this.qualityCache.clear();
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
      const fileName = path16.basename(change.relativePath);
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
        const content = await fs14.promises.readFile(change.filePath, "utf-8");
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
          prdId: newPlan.id || prdId,
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
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
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
          timestamp: timestamp2,
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
          timestamp: timestamp2,
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
            timestamp: timestamp2,
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
              timestamp: timestamp2,
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
              timestamp: timestamp2,
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
        const content = await fs14.promises.readFile(change.filePath, "utf-8");
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
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
    const oldFixes = oldData?.fixes || [];
    const newFixes = newData?.fixes || [];
    for (const newFix of newFixes) {
      const oldFix = oldFixes.find((f) => f.id === newFix.id);
      if (!oldFix) {
        events.push({
          eventType: "fix:created",
          repoId,
          fixId: newFix.id,
          timestamp: timestamp2,
          fix: newFix
        });
        continue;
      }
      if (oldFix.status !== newFix.status) {
        events.push({
          eventType: "fix:updated",
          repoId,
          fixId: newFix.id,
          timestamp: timestamp2,
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
            timestamp: timestamp2,
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
              timestamp: timestamp2,
              task: newTask
            });
          } else {
            events.push({
              eventType: "fix:task:updated",
              repoId,
              fixId: newFix.id,
              timestamp: timestamp2,
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
  /**
   * Handle changes to quality run files in docs/quality/runs/
   */
  async handleQualityChange(repoId, change) {
    try {
      this.context.logger.info(`[FileWatcher] Detected quality change in repo ${repoId}: ${change.type} - ${change.relativePath}`);
      const connectionCount = this.sse.getConnectionCount();
      if (connectionCount === 0) {
        this.context.logger.info(`[FileWatcher] No SSE clients connected - skipping quality processing`);
        return;
      }
      if (!change.relativePath.endsWith(".md")) {
        return;
      }
      const fileName = path16.basename(change.relativePath);
      const runId = fileName.replace(/\.md$/, "");
      let repoCache = this.qualityCache.get(repoId);
      if (!repoCache) {
        repoCache = /* @__PURE__ */ new Map();
        this.qualityCache.set(repoId, repoCache);
      }
      if (change.type === "deleted") {
        repoCache.delete(runId);
        await this.sse.broadcast("quality-change", {
          eventType: "quality:deleted",
          repoId,
          runId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        return;
      }
      let runData = { runId };
      try {
        const content = await fs14.promises.readFile(change.filePath, "utf-8");
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          for (const line of frontmatter.split("\n")) {
            const colonIndex = line.indexOf(":");
            if (colonIndex > 0) {
              const key = line.slice(0, colonIndex).trim();
              const value = line.slice(colonIndex + 1).trim();
              if (/^\d+$/.test(value)) {
                runData[key] = parseInt(value, 10);
              } else {
                runData[key] = value;
              }
            }
          }
        }
      } catch (error) {
        this.context.logger.error(`Error reading quality file ${change.filePath}:`, error);
        return;
      }
      const isNew = !repoCache.has(runId);
      repoCache.set(runId, runData);
      await this.sse.broadcast("quality-change", {
        eventType: isNew ? "quality:created" : "quality:updated",
        repoId,
        runId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        run: runData
      });
      this.context.logger.info(`[FileWatcher] \u2705 Broadcast quality:${isNew ? "created" : "updated"} for run: ${runId} in repo: ${repoId}`);
    } catch (error) {
      this.context.logger.error("Error handling quality change:", error);
    }
  }
  /**
   * Extract tasks from markdown using ### N. pattern
   */
  extractTasksFromMarkdown(content) {
    const tasks = [];
    const taskRegex = /^###\s+(\d+)\.\s+(.+)$/gm;
    let match3;
    while ((match3 = taskRegex.exec(content)) !== null) {
      const taskNumber = parseInt(match3[1], 10);
      tasks.push({
        id: `task-${taskNumber}`,
        number: taskNumber,
        description: match3[2].trim(),
        status: "pending"
      });
    }
    return tasks;
  }
  /**
   * Parse YAML frontmatter from markdown content
   */
  parseFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = {};
    if (frontmatterMatch) {
      const lines = frontmatterMatch[1].split("\n");
      for (const line of lines) {
        const colonIndex = line.indexOf(":");
        if (colonIndex > 0) {
          const key = line.slice(0, colonIndex).trim();
          const value = line.slice(colonIndex + 1).trim();
          frontmatter[key] = value;
        }
      }
    }
    return frontmatter;
  }
  /**
   * Handle changes to PRD markdown documents in docs/prd/
   * Emits prd:doc:created, prd:doc:updated, feature:created, feature:updated events
   */
  async handlePrdDocsChange(repoId, _repoPath, change) {
    try {
      this.context.logger.info(`[FileWatcher] Detected PRD docs change in repo ${repoId}: ${change.type} - ${change.relativePath}`);
      const connectionCount = this.sse.getConnectionCount();
      if (connectionCount === 0) {
        this.context.logger.info(`[FileWatcher] No SSE clients connected - skipping PRD docs processing`);
        return;
      }
      if (!change.relativePath.endsWith(".md")) {
        return;
      }
      const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
      const pathParts = change.relativePath.split(/[/\\]/);
      const prdId = pathParts[0];
      if (change.type === "deleted") {
        if (pathParts.length === 2 && pathParts[1] === "prd.md") {
          await this.sse.broadcast("prd-doc-change", {
            eventType: "prd:doc:deleted",
            repoId,
            prdId,
            timestamp: timestamp2
          });
        } else if (pathParts.length === 3 && pathParts[1] === "features") {
          const featureFile = pathParts[2];
          const featureId = featureFile.replace(".md", "");
          await this.sse.broadcast("prd-doc-change", {
            eventType: "feature:deleted",
            repoId,
            prdId,
            featureId,
            timestamp: timestamp2
          });
        }
        return;
      }
      let content;
      try {
        content = await fs14.promises.readFile(change.filePath, "utf-8");
      } catch (error) {
        this.context.logger.error(`Error reading PRD doc file ${change.filePath}:`, error);
        return;
      }
      const frontmatter = this.parseFrontmatter(content);
      const tasks = this.extractTasksFromMarkdown(content);
      if (pathParts.length === 2 && pathParts[1] === "prd.md") {
        const eventType = change.type === "added" ? "prd:doc:created" : "prd:doc:updated";
        await this.sse.broadcast("prd-doc-change", {
          eventType,
          repoId,
          prdId: frontmatter.id || prdId,
          title: frontmatter.title,
          status: frontmatter.status,
          filePath: change.relativePath,
          timestamp: timestamp2
        });
        this.context.logger.info(`[FileWatcher] \u2705 Broadcast ${eventType} for PRD: ${prdId} in repo: ${repoId}`);
      } else if (pathParts.length === 3 && pathParts[1] === "features") {
        const featureFile = pathParts[2];
        const featureId = frontmatter.id || featureFile.replace(".md", "");
        const eventType = change.type === "added" ? "feature:created" : "feature:updated";
        await this.sse.broadcast("prd-doc-change", {
          eventType,
          repoId,
          prdId: frontmatter.prd || prdId,
          feature: {
            id: featureId,
            number: parseInt(frontmatter.number, 10) || 0,
            title: frontmatter.title || featureId,
            status: frontmatter.status
          },
          tasks,
          filePath: change.relativePath,
          timestamp: timestamp2
        });
        this.context.logger.info(`[FileWatcher] \u2705 Broadcast ${eventType} for feature: ${featureId} with ${tasks.length} tasks in repo: ${repoId}`);
      }
    } catch (error) {
      this.context.logger.error("Error handling PRD docs change:", error);
    }
  }
  /**
   * Handle changes to fix markdown documents in .tiny-brain/fixes/
   * Emits fix:doc:created, fix:doc:updated events
   */
  async handleFixDocsChange(repoId, change) {
    try {
      this.context.logger.info(`[FileWatcher] Detected fix docs change in repo ${repoId}: ${change.type} - ${change.relativePath}`);
      const connectionCount = this.sse.getConnectionCount();
      if (connectionCount === 0) {
        this.context.logger.info(`[FileWatcher] No SSE clients connected - skipping fix docs processing`);
        return;
      }
      if (!change.relativePath.endsWith(".md")) {
        return;
      }
      const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
      const fixId = path16.basename(change.relativePath, ".md");
      if (change.type === "deleted") {
        await this.sse.broadcast("fix-doc-change", {
          eventType: "fix:doc:deleted",
          repoId,
          fixId,
          timestamp: timestamp2
        });
        return;
      }
      let content;
      try {
        content = await fs14.promises.readFile(change.filePath, "utf-8");
      } catch (error) {
        this.context.logger.error(`Error reading fix doc file ${change.filePath}:`, error);
        return;
      }
      const frontmatter = this.parseFrontmatter(content);
      const tasks = this.extractTasksFromMarkdown(content);
      const eventType = change.type === "added" ? "fix:doc:created" : "fix:doc:updated";
      await this.sse.broadcast("fix-doc-change", {
        eventType,
        repoId,
        fixId: frontmatter.id || fixId,
        title: frontmatter.title,
        status: frontmatter.status,
        severity: frontmatter.severity,
        tasks,
        filePath: change.relativePath,
        timestamp: timestamp2
      });
      this.context.logger.info(`[FileWatcher] \u2705 Broadcast ${eventType} for fix: ${fixId} with ${tasks.length} tasks in repo: ${repoId}`);
    } catch (error) {
      this.context.logger.error("Error handling fix docs change:", error);
    }
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
    return new Promise((resolve3, reject) => {
      let errorHandled = false;
      const errorHandler2 = (error) => {
        if (errorHandled) return;
        errorHandled = true;
        if (error?.code === "EADDRINUSE") {
          this.context.logger.info(`Dashboard already running on port ${this.port}`);
          this.server = null;
          resolve3({
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
        resolve3({
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
      return new Promise((resolve3) => {
        const timeout = setTimeout(() => {
          this.context.logger.warn("Server close timed out after 5s, forcing cleanup");
          this.server = null;
          this.port = 0;
          resolve3();
        }, 5e3);
        this.server.close(() => {
          clearTimeout(timeout);
          this.server = null;
          this.port = 0;
          resolve3();
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
/*! Bundled license information:

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT *)
*/
//# sourceMappingURL=index.js.map
