import {
  SelectableMarkdownText as PlatonSelectableMarkdownText,
  type SelectableMarkdownTextProps,
} from "@platon/mobile-markdown-text/renderer";

import { highlightCodeSnippet } from "../features/review/shikiReviewHighlighter";

type MobileSelectableMarkdownTextProps = Omit<SelectableMarkdownTextProps, "highlightCode">;

export type {
  NativeMarkdownTextStyle,
  SelectableMarkdownSkill,
} from "@platon/mobile-markdown-text/types";

export function hasNativeSelectableMarkdownText(): boolean {
  return true;
}

export function SelectableMarkdownText(props: MobileSelectableMarkdownTextProps) {
  return <PlatonSelectableMarkdownText {...props} highlightCode={highlightCodeSnippet} />;
}
