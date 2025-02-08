import './tailwind.css';
import { Composition, continueRender, delayRender } from "remotion";
import COMPOSITIONS_FROM_JSON from '../../public/remotion-defaults/data/compositions.json';
import { CompositionCalculateMetaDataFns, CompositionComponents, CompositionSchemas } from './compositions';
import { useCallback, useEffect, useState } from 'react';
import Trial from './lib/Trial';
import { getTrialStatus } from '../client-core-lib/Trial';

// Each <Composition> is an entry in the sidebar!
const REMOTION_DEV = process.env.REMOTION_DEV;
const REMOTION_IS_WEB = process.env.REMOTION_IS_WEB;

export const RemotionRoot: React.FC = () => {
  const [compositions] = useState<Array<object>>(COMPOSITIONS_FROM_JSON);
  const [hasExpired, setHasExpired] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>('');
  const [handle] = useState(() => delayRender());
  const checkTrialStatus = useCallback(async () => {
    // Trial Period Check
    if (REMOTION_DEV && hasExpired === null) {
      const m = await getTrialStatus();
      setHasExpired(m ? true : false);
      setMessage(m);
      continueRender(handle);
    } else {
      continueRender(handle);
    }
  }, []);

  useEffect(() => {
    if (!REMOTION_DEV && REMOTION_IS_WEB && hasExpired === null) {
      checkTrialStatus();
    } else {
      continueRender(handle);
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
