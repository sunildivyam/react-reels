import { readJsonFile, saveToJsonFile } from "../../core-lib/FileUtils";
import { BgGradient, VideoRecord } from "../interfaces";

const rgbToHex = (rgb: string): string => {
  if (rgb.startsWith("#")) {
    return rgb;
  }

  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) {
    throw new Error("Invalid RGB string");
  }
  const [r, g, b] = result.map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const srcFiles = [
  "dist/json_db_data/MantrasVideo.json",
  "dist/json_db_data/Quote.json",
  "dist/json_db_data/QuoteReel.json",
  "dist/json_db_data/RelaxingVideo.json",
  "dist/json_db_data/Holi2025.json",
];

const update = async () => {
  srcFiles.forEach(async (file) => {
    const json = await readJsonFile(file);
    const updatedJson: { [key: string]: VideoRecord } = {};

    Object.keys(json).forEach((id: string) => {
      const vd = json[id] as VideoRecord;
      if (vd.compositionInfo.defaultProps?.bgGradient) {
        vd.compositionInfo.defaultProps.bgGradient = {
          colors: Object.keys(
            vd.compositionInfo.defaultProps.bgGradient ?? {},
          ).map((key: string) =>
            rgbToHex((vd.compositionInfo.defaultProps.bgGradient as any)[key]),
          ),
          angle: 45,
        } as BgGradient;
      }
      updatedJson[id] = vd;
    });

    // Write updated json
    await saveToJsonFile(updatedJson, `${file}`);
  });
};

update();
