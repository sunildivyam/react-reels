// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";
Config.setEntryPoint("src/remotion/index.tsx");
Config.setStillImageFormat("jpeg");
Config.setVideoImageFormat("jpeg");
Config.setDelayRenderTimeoutInMilliseconds(240 * 1000);
Config.setOverwriteOutput(true);
Config.setConcurrency(8); // CPU core concurrency
Config.overrideWebpackConfig(enableTailwind);
Config.setChromiumOpenGlRenderer("angle");
