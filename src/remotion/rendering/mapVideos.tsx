import { getFilesFromDirectorySortedByDate, readJsonFile } from "../../core-lib/FileUtils"
import JsonDb from "../../jsondb/JsonDb"

const videoSrc = 'C:/Users/sunil/My space/Social Media Projects/Soulful Avengers - YouTube Channel/To Upload'
const jsonFiles = [
  'C:/Users/sunil/My space/Software/video-engine/processed data/2025-02-06 - 1738860173986/DATA/Quote.json',
  'C:/Users/sunil/My space/Software/video-engine/processed data/2025-02-07 - 1738870445340/DATA/Quote.json',
  'C:/Users/sunil/My space/Software/video-engine/processed data/2025-02-07 - 1738918292554/DATA/Quote.json',
]


const mapVideos = async () => {
  const db = new JsonDb('Quote');
  await db.load();
  db.options = {};
  let quotes: any[] = [];

  // Get all Quotes from all rendred files
  for (const jsonFile of jsonFiles) {
    const qS = await readJsonFile(jsonFile);
    quotes = [].concat(...quotes, ...qS)
  }

  // Get all videoFileName
  const videos = await getFilesFromDirectorySortedByDate(videoSrc);
  const vFiles = videos.map(vF => ({
    vFile: vF,
    title: vF.split('-'),
    date: parseInt(vF.split('-')[1].split('.')[0])
  }));

  const nQuotes: any[] = [];
  console.log(`Source: ${quotes.length} | Videos: ${vFiles.length} | Added: ${nQuotes.length}`)

  quotes.forEach((quote, index) => {
    const nQuote = {
      compositionInfo: quote,
      socialMedia: {
        tags: quote.defaultProps.tags,
        hashTags: quote.defaultProps.hashTags
      },
      outFileName: `out/${vFiles[index].vFile}`,
      renderedOn: new Date(vFiles[index].date),
    };

    delete nQuote.compositionInfo.defaultProps.tags;
    delete nQuote.compositionInfo.defaultProps.hashTags;
    nQuotes.push(nQuote);
  });

  console.log(`Source: ${quotes.length} | Added: ${nQuotes.length}`)

  db.add(nQuotes);

  console.log(`Source: ${quotes.length} | Added: ${nQuotes.length}`)
}


mapVideos();
