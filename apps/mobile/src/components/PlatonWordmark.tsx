import type { ColorValue } from "react-native";
import Svg, { Path } from "react-native-svg";

/**
 * Compact monochrome Platon temple mark, matching the desktop sidebar brand
 * (`apps/web` SidebarChrome). Width derives from the viewBox aspect ratio.
 */
export function PlatonWordmark(props: { readonly height: number; readonly color: ColorValue }) {
  const aspectRatio = 80 / 72;
  return (
    <Svg
      accessibilityLabel="Platon"
      height={props.height}
      width={props.height * aspectRatio}
      viewBox="0 0 80 72"
    >
      <Path
        d="M24 0h32l8 4H16L24 0Zm-16 4h64l-6 14H14L8 4Zm6 18h12a4 4 0 0 1 4 4v42a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4Zm20 0h12a4 4 0 0 1 4 4v42a4 4 0 0 1-4 4H34a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4Zm20 0h12a4 4 0 0 1 4 4v42a4 4 0 0 1-4 4H54a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4Z"
        fill={props.color}
      />
    </Svg>
  );
}
