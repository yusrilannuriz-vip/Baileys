// Velyxen console banner (adapted from the legacy Velyx index.js)
const __velyxenBannerGradients = [
  { c1: [255, 80, 120], c2: [255, 180, 210] },
  { c1: [140, 90, 255], c2: [90, 200, 255] },
  { c1: [0, 200, 255], c2: [120, 255, 220] },
  { c1: [255, 170, 0], c2: [255, 255, 120] }
];

const __velyxenBannerVersion = "8.0.0";
const __velyxenBannerMottos = [
  "Lightweight and powerful.",
  "Fast & Reliable.",
  "Built for WhatsApp bots.",
  "Modern Baileys modification.",
  "Optimized for performance.",
  "Simple and efficient.",
  "Reliable automation starts here.",
  "Designed for developers.",
  "Made for better messaging.",
  "Your trusted Baileys fork."
];

const __velyxenBannerGradientChoice =
  __velyxenBannerGradients[Math.floor(Math.random() * __velyxenBannerGradients.length)];
const __velyxenBannerMotto =
  __velyxenBannerMottos[Math.floor(Math.random() * __velyxenBannerMottos.length)];

const __velyxenBannerGradient = (text) =>
  text
    .split("")
    .map((ch, i, arr) => {
      const t = i / (arr.length - 1 || 1);
      const r = Math.round(
        __velyxenBannerGradientChoice.c1[0] +
        (__velyxenBannerGradientChoice.c2[0] - __velyxenBannerGradientChoice.c1[0]) * t
      );
      const g = Math.round(
        __velyxenBannerGradientChoice.c1[1] +
        (__velyxenBannerGradientChoice.c2[1] - __velyxenBannerGradientChoice.c1[1]) * t
      );
      const b = Math.round(
        __velyxenBannerGradientChoice.c1[2] +
        (__velyxenBannerGradientChoice.c2[2] - __velyxenBannerGradientChoice.c1[2]) * t
      );
      return `\x1b[38;2;${r};${g};${b}m${ch}`;
    })
    .join("") + "\x1b[0m";

console.log(`
${__velyxenBannerGradient(`  Velyxen v${__velyxenBannerVersion}`)}

${__velyxenBannerGradient(`  ${__velyxenBannerMotto}`)}
`);

//=======================================================//

import makeWASocket from "./Socket/index.js";
export { Dugong } from './Socket/dugong.js';
//=======================================================//
export * from "./Defaults/index.js";
export * from "./WABinary/index.js";
export * from "../WAProto/index.js";
export * from "./WAUSync/index.js";
export * from "./Store/index.js";
export * from "./Utils/index.js";
export * from "./Types/index.js";
export * from "./WAM/index.js";
//=======================================================//
export { makeWASocket };
export default makeWASocket;
//=======================================================//