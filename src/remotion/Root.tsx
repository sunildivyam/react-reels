import './tailwind.css';
import { Composition } from "remotion";
import { COMPOSITIONS } from './compositions/configs';



// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {COMPOSITIONS.map(cmp => <Composition key={cmp.id} {...cmp}></Composition>)}
    </>
  );
};
