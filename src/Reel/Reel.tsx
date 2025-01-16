import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { Animated, Scale } from "remotion-animated";
import z from "zod";

export const reelSchema = z.object({
    image: z.string(),
    gradient: z.string(),
    bgColor: z.string(),
    color: z.string(),
    texts: z.array(z.string()),
});

export const Reel: React.FC<z.infer<typeof reelSchema>> = ({
    image,
    gradient,
    bgColor,
    color,
    texts,
}) => {
    const frame = useCurrentFrame();

    return (
        <>
            <Animated
                in={0}
                out={900}
                animations={
                    [
                        Scale({ initial: 1.5, by: 1, start: 0, duration: 300 })
                    ]
                }>
                <Img
                    style={{
                        width: "100%",
                        position: "absolute",
                        zIndex: -100,
                    }}
                    src={staticFile(image)}
                />
            </Animated>
            <span
                style={{
                    fontSize: "100px",
                    backgroundColor: `${bgColor}`,
                }}
            >
                Hello: {frame}
            </span>
        </>
    );
};
