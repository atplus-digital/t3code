#pragma once

#include "PlatonMarkdownTextShadowNode.h"

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>

namespace facebook::react {
using PlatonMarkdownTextComponentDescriptor = ConcreteComponentDescriptor<PlatonMarkdownTextShadowNode>;

void PlatonMarkdownTextSpec_registerComponentDescriptorsFromCodegen(
  std::shared_ptr<const ComponentDescriptorProviderRegistry> registry);
}
