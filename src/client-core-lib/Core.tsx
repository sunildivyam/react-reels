import { staticFile } from "remotion";

export const runFetch = async (url: string) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const jsonData = JSON.parse(text);
    return jsonData;
  } catch (error) {
    console.log(`Error fetching or parsing the file ${url}:, ${(error as any).message}`);
    return null;
  };

}

export const getCompositionPublicProps = async (compositionIds: Array<string>): Promise<Record<string, object>> => {
  let compositions: Record<string, object> = {};

  for (const id of compositionIds) {
    const url = staticFile(`data/${id}.json`);
    const cmp = await runFetch(url);
    if (cmp?.length) {
      compositions[id] = cmp[0].videoProps;
    }
  }

  return compositions;
};
