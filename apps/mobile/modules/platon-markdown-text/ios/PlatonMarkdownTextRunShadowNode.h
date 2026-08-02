#pragma once

#include <react/renderer/components/PlatonMarkdownTextSpec/EventEmitters.h>
#include <react/renderer/components/PlatonMarkdownTextSpec/Props.h>
#include <react/renderer/components/PlatonMarkdownTextSpec/States.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook::react {
extern const char PlatonMarkdownTextRunComponentName[];

using PlatonMarkdownTextRunShadowNode = ConcreteViewShadowNode<
    PlatonMarkdownTextRunComponentName,
    PlatonMarkdownTextRunProps,
    PlatonMarkdownTextRunEventEmitter,
    PlatonMarkdownTextRunState>;
}
