import { extensionSpec, IMLayoutJson, IMState, Immutable, BrowserSizeMode, IMLayoutItemJson, getAppStore } from 'jimu-core';
import { getHeightOfLayoutItems } from 'jimu-layouts/common';
import { TOTAL_COLS } from './types';

function getAppState(): IMState {
  const state = getAppStore().getState();
  if (window.jimuConfig.isBuilder) {
    return state?.appStateInBuilder;
  } else {
    return state;
  }
}

export default class RowLayoutTransformer implements extensionSpec.LayoutTransformer {
  id = 'row-layout-transformer';

  layoutType = 'ROW';

  transformLayout(
    layout: IMLayoutJson,
    fromSizeMode: BrowserSizeMode,
    toSizeMode: BrowserSizeMode,
  ): IMLayoutJson {
    if (fromSizeMode === toSizeMode) {
      return layout;
    }

    let updatedLayout: IMLayoutJson = Immutable(layout);

    if (toSizeMode === BrowserSizeMode.Small) {
      const state = getAppState();
      const itemHeights = getHeightOfLayoutItems(
        state.appConfig, state.widgetsState, layout.id);
      let index = 0;
      const order = Object.keys(layout.content || {}).sort((a, b) => {
        return parseInt(layout.content[a].bbox.left, 10) - parseInt(layout.content[b].bbox.left, 10);
      });
      order.forEach((itemId) => {
        const layoutItem = layout.content[itemId];
        if (!layoutItem.isPending) {
          updatedLayout = updatedLayout.setIn(['content', itemId, 'bbox'], {
            left: index * TOTAL_COLS,
            width: TOTAL_COLS,
            height: layoutItem.bbox?.height ?? 'auto',
          });
          if (itemHeights) {
            const setting = layoutItem.setting ?? Immutable({});
            updatedLayout = updatedLayout.setIn(['content', itemId, 'bbox', 'height'], itemHeights[itemId].height)
              .setIn(['content', itemId, 'setting'], setting.merge(itemHeights[itemId].setting));
          }
          index += 1;
        }
      });
    }

    return updatedLayout;
  }

  transformLayoutItem(
    item: IMLayoutItemJson,
    index: number,
    fromLayoutId: string,
    toLayoutId: string,
    fromSizeMode: BrowserSizeMode,
    toSizeMode: BrowserSizeMode
  ): {item: IMLayoutItemJson, index: number} {
    return { item, index };
  }
}
