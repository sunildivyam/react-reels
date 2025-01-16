import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { flip } from "@remotion/transitions/flip";
import { Text } from "../Text/Text";

export const TransitionVideo: React.FC = () => {


  return <>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={360}>
        <Text color="#0b84f3">मनुष्य अपने विचारों का ही फल है।</Text>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={flip()}
        timing={linearTiming({ durationInFrames: 300 })}
      />
      <TransitionSeries.Sequence durationInFrames={600}>
        <Text color="pink">आदमी की असली पहचान उसके व्यवहार से होती है, उसके शब्दों से नहीं।</Text>
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </>
}
