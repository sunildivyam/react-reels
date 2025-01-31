import './tailwind.css';
import { Composition } from "remotion";
import { COMPOSITIONS } from './compositions/configs';
import COMPOSITIONS_FROM_JSON from '../../public/remotion-defaults/data/compositions.json';
import { CompositionCalculateMetaDataFns, CompositionComponents, CompositionSchemas } from './compositions';
import { useEffect, useState } from 'react';
import Trial from './lib/Trial';
import { getTrialStatus } from '../client-core-lib/Trial';
import { getCompositionPublicProps } from '../client-core-lib/Core';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  const [compositions, setCompositions] = useState(COMPOSITIONS_FROM_JSON?.length ? COMPOSITIONS_FROM_JSON : COMPOSITIONS);
  const [hasExpired, setHasExpired] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Trial Period Check
    getTrialStatus().then(m => {
      setHasExpired(m ? true : false);
      setMessage(m);
    });

    // Get Public data composition JSON, and get merge video props
    getCompositionPublicProps(compositions.map(c => c.id)).then((cmps: Record<string, object>) => {
      setCompositions(compositions.map(c => {
        c.defaultProps = cmps[c.id] || c.videoProps;
        return c;
      }));
    })
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
