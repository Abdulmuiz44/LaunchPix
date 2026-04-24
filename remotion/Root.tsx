import { Composition } from "remotion";
import { LaunchPixDemo } from "./LaunchPixDemo";
import { LaunchPixProDemo } from "./LaunchPixProDemo";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="LaunchPixDemo"
        component={LaunchPixDemo}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LaunchPixProDemo"
        component={LaunchPixProDemo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
}
