import './tailwind.css';
import { Composition } from "remotion";
import COMPOSITIONS_FROM_JSON from '../../public/remotion-defaults/data/compositions.json';
import { CompositionCalculateMetaDataFns, CompositionComponents, CompositionSchemas } from './compositions';
import { useEffect, useState } from 'react';
import Trial from './lib/Trial';
import { getTrialStatus } from '../client-core-lib/Trial';
import { getCompositionPublicProps } from '../client-core-lib/Core';

// Each <Composition> is an entry in the sidebar!
const DEV = process.env.DEV;

export const RemotionRoot: React.FC = () => {
  const [compositions, setCompositions] = useState<Array<object>>([]);
  const [hasExpired, setHasExpired] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Trial Period Check
    DEV && hasExpired === null && getTrialStatus().then(m => {
      setHasExpired(m ? true : false);
      setMessage(m);
    });
  }, []);


  useEffect(() => {

    // Get Public data composition JSON, and get merge video props
    if (!compositions.length) {
      const ids = COMPOSITIONS_FROM_JSON.map(c => c.id);
      getCompositionPublicProps(ids).then((cmps: Record<string, object>) => {
        const compositions = COMPOSITIONS_FROM_JSON.map(c => {
          const merged = { ...c, ...(cmps[c.id]) || {} };
          console.log(merged.defaultProps.images);
          return merged;
        });
        setCompositions(compositions);
      })
    }

  }, []);

  return (
    hasExpired ? <Trial message={message} /> :
      <>
        {compositions.map((cmp: any) => <Composition
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
