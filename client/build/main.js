process.env.HMR_PORT=57316;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"auth-service.ts":[function(require,module,exports) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const axios_1 = __importDefault(require("axios"));
const url = __importStar(require("url"));
const keytar = __importStar(require("keytar"));
const os = __importStar(require("os"));
const { REDIRECT_URL, KEYTAR_SERVICE, AUTH0_DOMAIN, CLIENT_ID, API_IDENTIFIER } = process.env;
const KEYTAR_ACCOUNT = os.userInfo().username;
class AuthService {
    constructor() {
        this.clearData();
    }
    get authenticationUrl() {
        return `https://${AUTH0_DOMAIN}/authorize?audience=${API_IDENTIFIER}&scope=openid profile user_metadata offline_access email&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}`;
    }
    get logoutUrl() {
        return `https://${AUTH0_DOMAIN}/v2/logout`;
    }
    get userId() {
        var _a, _b;
        const subArray = (_b = (_a = this.profile) === null || _a === void 0 ? void 0 : _a.sub) === null || _b === void 0 ? void 0 : _b.split('|');
        if (subArray[0] === 'auth0') {
            return subArray[1];
        }
        return null;
    }
    clearData() {
        this.accessToken = null;
        this.profile = null;
        this.refreshToken = null;
    }
    refreshTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield keytar.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
            if (refreshToken) {
                const refreshOptions = {
                    method: 'POST',
                    url: `https://${AUTH0_DOMAIN}/oauth/token`,
                    headers: { 'content-type': 'application/json' },
                    data: {
                        grant_type: 'refresh_token',
                        client_id: CLIENT_ID,
                        refresh_token: refreshToken
                    }
                };
                try {
                    const response = yield (0, axios_1.default)(refreshOptions);
                    const { access_token, id_token } = response.data;
                    this.accessToken = access_token;
                    this.profile = (0, jwt_decode_1.default)(id_token);
                }
                catch (error) {
                    yield this.logout();
                    throw error;
                }
            }
            else {
                throw new Error('No available refresh token.');
            }
        });
    }
    loadTokens(callbackUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = url.parse(callbackUrl, true).query;
            const options = {
                method: 'POST',
                url: `https://${AUTH0_DOMAIN}/oauth/token`,
                headers: {
                    'content-type': 'application/json',
                    accept: 'application/json',
                    'accept-encoding': 'identity'
                },
                responseType: 'json',
                data: JSON.stringify({
                    grant_type: 'authorization_code',
                    client_id: CLIENT_ID,
                    code: query.code,
                    redirect_uri: REDIRECT_URL
                })
            };
            try {
                const response = yield (0, axios_1.default)(options);
                const { access_token, id_token, refresh_token } = response.data;
                this.accessToken = access_token;
                this.profile = (0, jwt_decode_1.default)(id_token);
                this.refreshToken = refresh_token;
                if (this.refreshToken) {
                    yield keytar.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, this.refreshToken);
                }
            }
            catch (error) {
                yield this.logout();
                throw error;
            }
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield keytar.deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
            this.clearData();
        });
    }
}
exports.AuthService = AuthService;

},{}],"main.ts":[function(require,module,exports) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const electron_1 = require("electron");
const path = __importStar(require("path"));
const isDev = __importStar(require("electron-is-dev"));
const auth_service_1 = require("./auth-service");
let authService = new auth_service_1.AuthService();
const { SERVER_URL, REDIRECT_URL, GAME_WIDTH, GAME_HEIGHT } = process.env;
let appWindow = null;
let authWindow = null;
let logoutWindow = null;
// let isConfirmed = false;
function closeAuthWindow() {
    return new Promise((res) => {
        if (authWindow !== null) {
            authWindow.on('closed', () => {
                authWindow = null;
                res();
            });
            authWindow.close();
        }
        else {
            res();
        }
    });
}
function closeAppWindow() {
    return new Promise((res) => {
        if (appWindow !== null) {
            // isConfirmed = true;
            appWindow.on('closed', () => {
                appWindow = null;
                // isConfirmed = false;
                res();
            });
            appWindow.close();
        }
        else {
            res();
        }
    });
}
function closeLogoutWindow() {
    return new Promise((res) => {
        if (logoutWindow !== null) {
            logoutWindow.on('closed', () => {
                logoutWindow = null;
                res();
            });
            logoutWindow.close();
        }
        else {
            res();
        }
    });
}
function cleanupWindows(caller) {
    return __awaiter(this, void 0, void 0, function* () {
        caller !== 'app' && (yield closeAppWindow());
        caller !== 'auth' && (yield closeAuthWindow());
        caller !== 'logout' && (yield closeLogoutWindow());
    });
}
function createWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield authService.refreshTokens();
            createAppWindow();
        }
        catch (err) {
            createAuthWindow();
        }
    });
}
function createAppWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        yield cleanupWindows('app');
        if (appWindow !== null)
            return;
        appWindow = new electron_1.BrowserWindow({
            width: parseInt(GAME_WIDTH),
            height: parseInt(GAME_HEIGHT),
            useContentSize: true,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });
        appWindow.loadURL(`file://${path.join(__dirname, './index.html')}`);
        appWindow.on('show', () => {
            if (isDev) {
                appWindow === null || appWindow === void 0 ? void 0 : appWindow.webContents.openDevTools();
                appWindow === null || appWindow === void 0 ? void 0 : appWindow.focus();
            }
        });
        appWindow.on('close', (e) => {
            // if (!isConfirmed) {
            //   e.preventDefault();
            //   appWindow?.webContents.send('try-exit');
            // }
        });
    });
}
function createAuthWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        yield cleanupWindows('auth');
        if (authWindow !== null)
            return;
        authWindow = new electron_1.BrowserWindow({
            width: 960,
            height: 720,
            resizable: false,
            webPreferences: {
                nodeIntegration: false
            }
        });
        authWindow.on('show', () => {
            if (isDev) {
                authWindow === null || authWindow === void 0 ? void 0 : authWindow.webContents.openDevTools();
                authWindow === null || authWindow === void 0 ? void 0 : authWindow.focus();
            }
        });
        authWindow.loadURL(authService.authenticationUrl, { userAgent: 'Chrome' });
        const { webRequest } = authWindow.webContents.session;
        webRequest.onBeforeRequest({ urls: [`${REDIRECT_URL}*`] }, ({ url }) => __awaiter(this, void 0, void 0, function* () {
            yield authService.loadTokens(url);
            createAppWindow();
        }));
    });
}
function createLogoutWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        yield cleanupWindows('logout');
        if (logoutWindow !== null)
            return;
        logoutWindow = new electron_1.BrowserWindow({ show: false });
        logoutWindow.loadURL(authService.logoutUrl);
        logoutWindow.on('ready-to-show', () => __awaiter(this, void 0, void 0, function* () {
            yield authService.logout();
            createAuthWindow();
        }));
    });
}
electron_1.app.on('ready', () => {
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
    electron_1.app.quit();
});
electron_1.ipcMain.on('confirm-exit', () => {
    closeAppWindow();
});
electron_1.ipcMain.on('confirm-logout', (event, args) => {
    createLogoutWindow();
});
electron_1.ipcMain.on('userData', (event, args) => {
    const { accessToken, profile } = authService;
    event.returnValue = {
        accessToken,
        profile
    };
});
electron_1.ipcMain.on('serverURL', (event, args) => {
    event.returnValue = SERVER_URL;
});

},{"./auth-service":"auth-service.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = process.env.HMR_HOSTNAME || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + process.env.HMR_PORT + '/');
  ws.onmessage = function(event) {
    checkedAssets = {};
    assetsToAccept = [];

    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function(asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function(asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();

        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) { // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = (
    '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
      '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
      '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
      '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' +
      '<pre>' + stackTrace.innerHTML + '</pre>' +
    '</div>'
  );

  return overlay;

}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;

  var cached = bundle.cache[id];

  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id)
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}

},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=main.js.map