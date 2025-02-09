
export const runFetch = async (url: string) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const jsonData = JSON.parse(text);
    return jsonData;
  } catch (error) {
    // console.log(`Error fetching or parsing the file ${url}:, ${(error as any)?.message}`);
    return null;
  };

}

export const deepCopy = (obj: object): object => {
  return JSON.parse(JSON.stringify(obj));
}
