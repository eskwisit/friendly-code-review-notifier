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
var run = function() {
    var _ref = _asyncToGenerator(function() {
        var token, webhook, threshold, limit, octokit, _context_repo, owner, repo, query, open_pull_requests, blocks, repo_pr_url, shuffled, payload, error;
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
                    limit = core.getInput("limit", {
                        required: true
                    });
                    octokit = getOctokit(token);
                    _context_repo = context.repo, owner = _context_repo.owner, repo = _context_repo.repo;
                    return [
                        4,
                        octokit.rest.pulls.list({
                            owner: owner,
                            repo: repo,
                            state: "open"
                        })
                    ];
                case 1:
                    query = _state.sent();
                    open_pull_requests = query.data.length;
                    if (open_pull_requests % threshold === 0 || open_pull_requests > Math.pow(threshold)) {
                        blocks = [];
                        repo_pr_url = "https://github.com/".concat(owner, "/").concat(repo, "/pulls");
                        shuffled = limit ? query.data.sort(function() {
                            return 0.5 - Math.random();
                        }).slice(0, limit) : query.data;
                        blocks.push(header_template);
                        shuffled.forEach(function(param) {
                            var title = param.title, number = param.number, url = param.html_url;
                            var block = block_template(title, url, number);
                            blocks.push(block);
                        });
                        blocks.push(link_to_pull_requests(open_pull_requests, repo_pr_url));
                        blocks.push(thank_you);
                        payload = {
                            blocks: blocks
                        };
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
var header_template = {
    type: "section",
    text: {
        type: "mrkdwn",
        text: "*Hey, this is Annoy-o-tron :robot_face: Sorry to interrupt but it seems PRs are stacking up*. What about reviewing the unicorn below?"
    }
};
var divider = {
    type: "divider"
};
var block_template = function(title, url, number) {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: ":unicorn_face:  <".concat(url, "|").concat(title, "> #").concat(number)
        },
        accessory: {
            type: "button",
            text: {
                type: "plain_text",
                text: "Review"
            },
            url: url
        }
    };
};
var link_to_pull_requests = function(length, repo_url) {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: "<".concat(repo_url, "|Click here> to see the full list of PR (").concat(length, ").")
        }
    };
};
var thank_you = {
    type: "context",
    elements: [
        {
            type: "mrkdwn",
            text: "Thank you very much :bow:"
        }
    ]
};

