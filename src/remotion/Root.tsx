import './tailwind.css';
import { Composition } from "remotion";
import { COMPOSITIONS } from './compositions/configs';
import COMPOSITIONS_FROM_JSON from '../../public/remotion-defaults/data/compositions.json';
import { CompositionCalculateMetaDataFns, CompositionComponents, CompositionSchemas } from './compositions';
import { useEffect, useState } from 'react';
import Trial from './lib/Trial';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  const compositions = COMPOSITIONS_FROM_JSON?.length ? COMPOSITIONS_FROM_JSON : COMPOSITIONS;
  const [hasExpired, setHasExpired] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('.bundle');
        const text = await response.text();
        const jsonData = JSON.parse(text);
        const { x, y, m } = jsonData;
        setHasExpired((Date.now() - x) > y);
        setMessage(m);
      } catch (error) {
        setHasExpired(false);
        console.log('Error fetching or parsing the file:', (error as any).message);
      }
    };

    fetchData();
  }, []);

  return (
    hasExpired ? <Trial message={message} /> :
      <>
        {compositions.map(cmp => <Composition
          key={cmp.id}
          {...cmp}
          id={cmp.id}
          component={CompositionComponents[cmp.originalId]}
          schema={CompositionSchemas[cmp.originalId]}
          calculateMetadata={CompositionCalculateMetaDataFns[cmp.originalId]}
        />)}
      </>
  );
};
