import './tailwind.css';
import { Composition, continueRender, delayRender } from "remotion";
import COMPOSITIONS_FROM_JSON from '../../public/remotion-defaults/data/compositions.json';
import { CompositionCalculateMetaDataFns, CompositionComponents, CompositionSchemas } from './compositions';
import { useCallback, useEffect, useState } from 'react';
import Trial from './lib/Trial';
import { getTrialStatus } from '../client-core-lib/Trial';
import { getCompositionPublicProps } from '../client-core-lib/Core';

// Each <Composition> is an entry in the sidebar!
const REMOTION_DEV = process.env.REMOTION_DEV;
const REMOTION_IS_WEB = process.env.REMOTION_IS_WEB;

export const RemotionRoot: React.FC = () => {
  // Only On Local Dev Server, compositions should load from public jsons.
  const [compositions, setCompositions] = useState<Array<object>>(REMOTION_IS_WEB ? [] : COMPOSITIONS_FROM_JSON);
  const [hasExpired, setHasExpired] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>('');
  const [handle] = useState(() => delayRender());
  const checkTrialStatus = useCallback(async () => {
    // Trial Period Check
    if (REMOTION_DEV && hasExpired === null) {
      const m = await getTrialStatus();
      setHasExpired(m ? true : false);
      setMessage(m);
    }
  }, []);

  const loadCompositions = useCallback(async () => {
    // Get Public data composition JSON, and get merge video props
    if (!compositions.length) {
      const ids = COMPOSITIONS_FROM_JSON.map(c => c.id);
      const cmps: Record<string, object> = await getCompositionPublicProps(ids);
      const compositions = COMPOSITIONS_FROM_JSON.map(c => {
        const merged = { ...c, ...(cmps[c.id]) || {} };
        return merged;
      });
      setCompositions(compositions);
      continueRender(handle);
    }
  }, []);

  useEffect(() => {
    if (!REMOTION_DEV && REMOTION_IS_WEB && hasExpired === null) {
      checkTrialStatus();
    }

    if (REMOTION_DEV && REMOTION_IS_WEB) {
      loadCompositions();
    } else {
      continueRender(handle);
    }
  }, []);

  console.log(REMOTION_DEV, REMOTION_IS_WEB)

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
