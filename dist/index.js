function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
var __generator = this && this.__generator || function(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return(g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g);
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
var variations = [
    {
        username: "Pikachu",
        icon_emoji: "pikachu-dance",
        text: "Pika! Pika! Pika! Pull requests are piling up. Gotta catch'em all!"
    },
    {
        username: "Pyong",
        icon_emoji: "pyong-excited",
        text: "고등학교는 한국에서 어려워요! Nevermind what it means, I just wanted your attention: PR are stacking up."
    },
    {
        username: "Mr. Burns",
        icon_emoji: "finger-steepling",
        text: "Smithers! We have to get those PR reviewed quick. They are almost as old as me."
    }
];
var run = function() {
    var _ref = _asyncToGenerator(function() {
        var token, webhook, threshold, octokit, query, open_pull_requests, variant, blocks, payload, error;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    token = core.getInput("token", {
                        required: true
                    });
                    webhook = core.getInput("webhook", {
                        required: true
                    });
                    threshold = core.getInput("threshold", {
                        required: true
                    });
                    octokit = getOctokit(token);
                    return [
                        4,
                        octokit.rest.pulls.list({
                            owner: context.repo.owner,
                            repo: context.repo.repo,
                            state: "open"
                        })
                    ];
                case 1:
                    query = _state.sent();
                    open_pull_requests = query.data.length;
                    if (open_pull_requests % threshold === 0 || open_pull_requests > 8) {
                        variant = variations[Math.floor(Math.random() * variations.length)];
                        blocks = [];
                        payload = variant;
                        query.data.forEach(function(param) {
                            var title = param.title, url = param.url, reviews = param.reviews;
                            var block = block_template(title, url, reviews);
                            blocks.push(block);
                        });
                        blocks.push(thank_you_all);
                        payload = _objectSpreadProps(_objectSpread({}, payload), {
                            blocks: blocks
                        });
                        octokit.request("POST ".concat(webhook), {
                            data: payload,
                            headers: {
                                "content-type": "application/json"
                            }
                        });
                    } else {
                        core.info("Nothing to notify right now \uD83D\uDC4C");
                    }
                    return [
                        3,
                        3
                    ];
                case 2:
                    error = _state.sent();
                    core.setFailed(error.message);
                    return [
                        3,
                        3
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    });
    return function run() {
        return _ref.apply(this, arguments);
    };
}();
run();
var block_template = function(title, url, reviews) {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: "".concat(title, " (").concat(reviews, " reviews)")
        },
        accessory: {
            type: "button",
            text: {
                type: "plain_text",
                text: "View"
            },
            url: url,
            action_id: "button-action"
        }
    };
};
var thank_you_all = {
    type: "context",
    elements: [
        {
            type: "mrkdwn",
            text: "Thank you all :bow:"
        }
    ]
};

