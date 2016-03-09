"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _magicTypes = require("magic-types");

var isString = _magicTypes.isString;
var isError = _magicTypes.isError;

var log = function (startTime) {
  return console.log("request took", (new Date().getTime() - startTime) / 1000, "seconds");
};

var getPort = function (port) {
  return parseInt(port, 10) === 80 ? "" : ":" + port;
};

exports.getPort = getPort;
var getHost = function (_ref) {
  var host = _ref.host;
  var protocol = _ref.protocol;
  var port = _ref.port;
  var _ref$path = _ref.path;
  var path = _ref$path === undefined ? "" : _ref$path;
  return "" + protocol + "://" + host + "" + getPort(port) + "" + path;
};

exports.getHost = getHost;
var fetchJSON = function (_ref) {
  var url = _ref.url;
  var _ref$method = _ref.method;
  var method = _ref$method === undefined ? "GET" : _ref$method;
  return fetch({
    url: url,
    method: method,
    json: true });
};

exports.fetchJSON = fetchJSON;
var fetch = function (_ref) {
  var url = _ref.url;
  var _ref$method = _ref.method;
  var method = _ref$method === undefined ? "GET" : _ref$method;
  var _ref$json = _ref.json;
  var json = _ref$json === undefined ? false : _ref$json;
  var _ref$timeoutMs = _ref.timeoutMs;
  var timeoutMs = _ref$timeoutMs === undefined ? 3000 : _ref$timeoutMs;
  return new Promise(function (resolve, reject) {
    var requestStart = new Date().getTime();

    console.log("fetching", { url: url, method: method, json: json });

    var req = new window.XMLHttpRequest();

    req.timeout = timeoutMs;
    req.open(method, url);

    req.onload = function () {
      log(requestStart);

      if (req.status === 200) {
        if (!json) {
          console.log("not a json request");
          return resolve(req);
        }

        var parsed = parseJSONResult(req.response || req.responseText);
        if (isString(parsed)) {
          console.log("json returned string");
          return reject(parsed);
        }

        if (isError(parsed)) {
          console.log("json returned error");
          return reject(parsed.message);
        }
        console.log({ parsed: parsed, isError: isError(parsed) });
        console.log("json resolved");
        return resolve(parsed);
      }

      console.log("http unknown error");
      reject(req.statusText || "Unkown Error");
    };

    req.onerror = function () {
      log(requestStart);
      reject("Network Error");
    };

    req.ontimeout = function () {
      log(requestStart);
      reject("Request timed out");
    };

    req.send();
  });
};

exports.fetch = fetch;
var parseJSONResult = function (res) {
  var parsed = new Error("Response invalid");
  try {
    parsed = JSON.parse(res);
  } catch (e) {
    console.error("JSON parsing error", { e: e, res: res });
  }

  return parsed;
};
exports.parseJSONResult = parseJSONResult;
