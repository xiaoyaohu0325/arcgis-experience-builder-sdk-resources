import { React, classNames, IMLayoutItemJson, BoundingBox } from 'jimu-core';
import { LayoutItemProps, parseAspectRatio } from 'jimu-layouts/common';
import { LayoutItem } from 'jimu-layouts/layout-runtime';

interface OwnProps {
  layoutItem: IMLayoutItemJson;
  index: number;
  space: number;
  children?: any;
}

export class FlexboxItem extends React.PureComponent<LayoutItemProps & OwnProps> {
  isStretchInCrossAxis() {
    const { layoutItem } = this.props;
    return layoutItem.setting?.autoProps?.width ?? true;
  }

  calHeight(itemSetting, bbox: BoundingBox) {
    const isFitContainer = itemSetting.heightMode === 'fit';
    if (isFitContainer) {
      return { flexGrow: 1, flexShrink: 1 };
    }
    if (itemSetting.autoProps?.height) {
      return { height: 'auto' };
    }
    const heightMode = itemSetting.heightMode ?? 'fixed';
    if (heightMode === 'fixed') {
      return { height: bbox.height, flexShrink: 0 };
    }
    return {};
  }

  render() {
    const { index, layoutId, layoutItem, space, onClick } = this.props;
    if (!layoutItem || layoutItem.isPending) {
      return null;
    }
    const bbox = layoutItem.bbox || ({} as any);
    const mergedClass = classNames('flexbox-layout-item', 'd-flex');
    const layoutSetting = layoutItem.setting || {};
    const isStretch = this.isStretchInCrossAxis();

    const ratio = parseAspectRatio(layoutSetting.aspectRatio);

    const style: any = {
      // position related style
      marginTop: index > 0 ? space : 'unset',
      ...this.calHeight(layoutSetting, bbox),
    };

    if (isStretch) {
      style.width = 'auto';
      style.alignSelf = 'stretch';
    } else {
      style.width = bbox.width;
      style.alignSelf = layoutSetting.style?.alignSelf ?? 'auto';
    }

    return (
      <LayoutItem
        style={JSON.stringify(style)}
        layoutId={layoutId}
        layoutItemId={layoutItem.id}
        onClick={onClick}
        className={mergedClass}
        forceAspectRatio={layoutSetting.heightMode === 'ratio' && !layoutSetting.autoProps?.height}
        aspectRatio={ratio}
      />
    );
  }
}
