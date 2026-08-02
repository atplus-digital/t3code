#import "PlatonMarkdownTextRun.h"
#import "PlatonMarkdownText.h"
#import "PlatonMarkdownTextRunComponentDescriptor.h"
#import <react/renderer/components/PlatonMarkdownTextSpec/EventEmitters.h>
#import <react/renderer/components/PlatonMarkdownTextSpec/Props.h>
#import <react/renderer/components/PlatonMarkdownTextSpec/RCTComponentViewHelpers.h>
#import "RCTFabricComponentsPlugins.h"
#import "Utils.h"

using namespace facebook::react;

@interface PlatonMarkdownTextRun () <RCTPlatonMarkdownTextRunViewProtocol>

@end

@implementation PlatonMarkdownTextRun {
  NSString * _text;
  RCTBubblingEventBlock _onPress;
  RCTBubblingEventBlock _onLongPress;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<PlatonMarkdownTextRunComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const PlatonMarkdownTextRunProps>();
    _props = defaultProps;
  }
  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<PlatonMarkdownTextRunProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<PlatonMarkdownTextRunProps const>(props);

  if (newViewProps.text != oldViewProps.text) {
    NSString *text = [NSString stringWithUTF8String:newViewProps.text.c_str()];
    _text = text;
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)onPress {
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const facebook::react::PlatonMarkdownTextRunEventEmitter>(_eventEmitter)
    ->onPress(facebook::react::PlatonMarkdownTextRunEventEmitter::OnPress{});
  }
}

- (void)onLongPress {
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const facebook::react::PlatonMarkdownTextRunEventEmitter>(_eventEmitter)
    ->onLongPress(facebook::react::PlatonMarkdownTextRunEventEmitter::OnLongPress{});
  }
}

+ (BOOL)shouldBeRecycled {
  return NO;
}

Class<RCTComponentViewProtocol> PlatonMarkdownTextRunCls(void)
{
    return PlatonMarkdownTextRun.class;
}

@end
