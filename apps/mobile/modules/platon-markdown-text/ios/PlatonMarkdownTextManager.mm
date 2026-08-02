#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCTBridge.h"
#import "Utils.h"

@interface PlatonMarkdownTextManager : RCTViewManager
@end

@implementation PlatonMarkdownTextManager

RCT_EXPORT_MODULE(PlatonMarkdownText)

- (UIView *)view
{
  return [[UIView alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(color, NSString, UIView)
{
}

@end

@interface PlatonMarkdownTextRunManager : RCTViewManager
@end

@implementation PlatonMarkdownTextRunManager

RCT_EXPORT_MODULE(PlatonMarkdownTextRun)

- (UIView *)view
{
  return nil;
}

@end
