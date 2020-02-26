/** @jsx jsx */
import { React, jsx, classNames, lodash, BoundingBox } from 'jimu-core';
import {
  LayoutItemProps,
  StateToLayoutItemProps,
  parseAspectRatio,
} from 'jimu-layouts/common';
import { LayoutItem } from 'jimu-layouts/layout-runtime';
import { RowLayoutItemSetting } from '../../config';
import { DEFAULT_ROW_ITEM_SETTING } from '../../default-config';

interface OwnProps {
  offset: number;
  span: number;
  isMultiRow: boolean;
  alignItems?: string;
  children?: any;
  style?: any;
}

export default class RowItem extends React.PureComponent<LayoutItemProps &
StateToLayoutItemProps & OwnProps> {
  calHeight(itemSetting: RowLayoutItemSetting, bbox: BoundingBox) {
    if (this.props.isMultiRow) {
      return { height: bbox.height, alignSelf: itemSetting.style?.alignSelf ?? 'flex-start' };
    }
    if (itemSetting.autoProps?.height) {
      return { height: 'auto', alignSelf: itemSetting.style?.alignSelf ?? 'flex-start' };
    }
    if (itemSetting.heightMode === 'ratio') {
      return { alignSelf: itemSetting.style?.alignSelf ?? 'flex-start' };
    }
    if (itemSetting.heightMode === 'fixed') {
      return { height: bbox.height, alignSelf: itemSetting.style?.alignSelf ?? 'flex-start' };
    }
    return { alignSelf: 'stretch' };
  }

  render() {
    const {
      span,
      offset,
      layoutId,
      layoutItem,
      style,
    } = this.props;
    if (!layoutItem || layoutItem.isPending) {
      return null;
    }
    const bbox = layoutItem.bbox;
    const itemSetting: RowLayoutItemSetting = lodash.assign({}, DEFAULT_ROW_ITEM_SETTING, layoutItem.setting);
    const mergedClass = classNames(
      'row-layout-item',
      `col-${span}`,
      `offset-${offset}`,
    );

    const mergedStyle: any = {
      ...style,
      ...this.calHeight(itemSetting, bbox),
    };

    if (itemSetting.offsetX || itemSetting.offsetY) {
      mergedStyle.transform = `translate(${itemSetting.offsetX || 0}px, ${itemSetting.offsetY || 0}px)`;
    }
    const ratio = parseAspectRatio(itemSetting.aspectRatio);

    return (
      <LayoutItem
        style={mergedStyle}
        className={mergedClass}
        layoutId={layoutId}
        layoutItemId={layoutItem.id}
        forceAspectRatio={itemSetting.heightMode === 'ratio' && !itemSetting.autoProps?.height}
        aspectRatio={ratio}
        onClick={this.props.onClick}
      />
    );
  }
}
