"use strict";
const gradients = [
    { c1: [0, 255, 255], c2: [255, 255, 255] },
    { c1: [0, 191, 255], c2: [255, 255, 255] },
    { c1: [102, 204, 255], c2: [255, 255, 255] },
    { c1: [51, 255, 255], c2: [255, 255, 255] },
];
const g = gradients[Math.floor(Math.random() * gradients.length)];
console.log([`
░█░█ █▀▀ █░░ █░█ █░█ █▀▀ █▀█
░▀▄▀ █▀▀ █░░ █▄█ ▄▀▄ █▀▀ █░█
░░▀░ ▀▀▀ ▀▀▀ ░▀░ ▀░▀ ▀▀▀ ▀░▀`, `Baileys Velyxen
Build Better • Connect Faster • Stay Stable
WhatsApp : 085122483367
Telegram : @velyxdiarx`]
        .map(
            (text) =>
                " ".repeat(
                    Math.max(0, Math.floor(((process.stdout.columns || 80) - text.length) / 2))
                ) +
                text
                    .split("")
                    .map((ch, i, arr) => {
                        const t = i / (arr.length - 1 || 1);
                        const r = Math.round(g.c1[0] + (g.c2[0] - g.c1[0]) * t);
                        const green = Math.round(g.c1[1] + (g.c2[1] - g.c1[1]) * t);
                        const b = Math.round(g.c1[2] + (g.c2[2] - g.c1[2]) * t);
                        return `\x1b[38;2;${r};${green};${b}m${ch}`;
                    })
                    .join("") +
                "\x1b[0m"
        )
        .join("\n")
);

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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
            __createBinding(exports, m, p);
};

var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.proto = exports.makeWASocket = void 0;
const WAProto_1 = require("../WAProto");
Object.defineProperty(exports, "proto", {
    enumerable: true,
    get: function() {
        return WAProto_1.proto;
    }
});

const Socket_1 = __importDefault(require("./Socket"));
exports.makeWASocket = Socket_1.default;
__exportStar(require("../WAProto"), exports);
__exportStar(require("./Utils"), exports);
__exportStar(require("./Types"), exports);
__exportStar(require("./Store"), exports);
__exportStar(require("./Defaults"), exports);
__exportStar(require("./WABinary"), exports);
__exportStar(require("./WAM"), exports);
__exportStar(require("./WAUSync"), exports);

exports.default = Socket_1.default;
