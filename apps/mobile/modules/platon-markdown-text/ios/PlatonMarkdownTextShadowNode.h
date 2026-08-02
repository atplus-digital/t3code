#pragma once

#include <react/renderer/components/PlatonMarkdownTextSpec/EventEmitters.h>
#include <react/renderer/components/PlatonMarkdownTextSpec/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/textlayoutmanager/TextLayoutManager.h>
#include <react/renderer/core/LayoutContext.h>
#include <react/renderer/core/ShadowNode.h>

#include <string>
#include <vector>

namespace facebook::react {

extern const char PlatonMarkdownTextComponentName[];

struct PlatonMarkdownTextParagraphStyleRange {
  size_t location;
  size_t length;
  Float firstLineHeadIndent;
  Float headIndent;
  Float paragraphSpacing;
};

struct PlatonMarkdownTextAttachmentRange {
  size_t location;
  size_t length;
  std::string imageUri;
};

inline Float PlatonMarkdownTextAttachmentSize(const PlatonMarkdownTextAttachmentRange &) {
  return 14;
}

inline Float PlatonMarkdownTextAttachmentBaselineOffset(
    const PlatonMarkdownTextAttachmentRange &) {
  return -2;
}

class PlatonMarkdownTextStateReal final {
 public:
  AttributedString attributedString;
  std::vector<PlatonMarkdownTextParagraphStyleRange> paragraphStyleRanges;
  std::vector<PlatonMarkdownTextAttachmentRange> attachmentRanges;
};

class PlatonMarkdownTextShadowNode final : public ConcreteViewShadowNode<
PlatonMarkdownTextComponentName,
PlatonMarkdownTextProps,
PlatonMarkdownTextEventEmitter,
PlatonMarkdownTextStateReal> {
public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  PlatonMarkdownTextShadowNode(
   const ShadowNode& sourceShadowNode,
   const ShadowNodeFragment& fragment
  );

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::LeafYogaNode);
    traits.set(ShadowNodeTraits::Trait::MeasurableYogaNode);
    return traits;
  }

  void layout(LayoutContext layoutContext) override;

  Size measureContent(
      const LayoutContext& layoutContext,
      const LayoutConstraints& layoutConstraints) const override;

private:
  mutable AttributedString _attributedString;
  mutable std::vector<PlatonMarkdownTextParagraphStyleRange> _paragraphStyleRanges;
  mutable std::vector<PlatonMarkdownTextAttachmentRange> _attachmentRanges;
};
} // namespace facebook::React
