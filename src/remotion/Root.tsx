import './tailwind.css';
import { Composition } from "remotion";
import { COMPOSITIONS } from './compositions/configs';
import COMPOSITIONS_FROM_JSON from '../../public/remotion-defaults/data/compositions.json';
import { CompositionCalculateMetaDataFns, CompositionComponents, CompositionSchemas } from './compositions';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  const compositions = COMPOSITIONS_FROM_JSON?.length ? COMPOSITIONS_FROM_JSON : COMPOSITIONS;

  return (
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
