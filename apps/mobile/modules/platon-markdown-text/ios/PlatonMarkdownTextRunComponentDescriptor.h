#pragma once

#include "PlatonMarkdownTextRunShadowNode.h"

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>

namespace facebook::react {
using PlatonMarkdownTextRunComponentDescriptor = ConcreteComponentDescriptor<PlatonMarkdownTextRunShadowNode>;

void PlatonMarkdownTextRunSpec_registerComponentDescriptorsFromCodegen(
  std::shared_ptr<const ComponentDescriptorProviderRegistry> registry);
}
