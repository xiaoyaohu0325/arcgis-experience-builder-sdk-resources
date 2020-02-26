import { React, classNames, LayoutItemJson, IMLayoutItemJson, BoundingBox } from 'jimu-core';
import { LayoutItemProps, StateToLayoutItemProps, parseAspectRatio } from 'jimu-layouts/common';
import { LayoutItemInBuilder } from 'jimu-layouts/layout-builder';

interface OwnProps {
  layoutItem: IMLayoutItemJson;
  activeIds?: string;
  index: number;
  space: number;
  editingSectionId?: string;
  children?: any;
  onResizeStart: (id: string) => void;
  onResizing: (id: string, x: number, y: number, dw: number, dh: number) => void;
  onResizeEnd: (id: string, x: number, y: number, dw: number, dh: number, layoutItem: LayoutItemJson) => void;
}

interface State {
  isResizing: boolean;
  dw: number;
  dh: number;
}

export class FlexboxItem extends React.PureComponent<LayoutItemProps & StateToLayoutItemProps & OwnProps, State> {
  initWidth: number;
  initHeight: number;
  state: State = {
    isResizing: false,
    dw: 0,
    dh: 0,
  };

  onResizeStart = (id: string, initW: number, initH: number) => {
    this.initWidth = initW;
    this.initHeight = initH;
    this.props.onResizeStart(id);
    this.setState({
      isResizing: true,
    });
  };

  onResizing = (id: string, x: number, y: number, dw: number, dh: number) => {
    this.props.onResizing(id, x, y, dw, dh);
    this.setState({
      dw,
      dh,
      isResizing: true,
    });
  };

  onResizeEnd = (id: string, x: number, y: number, dw: number, dh: number, shiftKey?: boolean) => {
    const { layoutItem } = this.props;
    this.props.onResizeEnd(id, x, y, dw, dh, layoutItem);
    this.setState({
      isResizing: false,
      dw: 0,
      dh: 0,
    });
  };

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
    const { index, layoutId, layoutItem, space, draggable, resizable, selectable, showDefaultTools } = this.props;
    if (!layoutItem || layoutItem.isPending) {
      return null;
    }
    const { dw, dh, isResizing } = this.state;
    const bbox = layoutItem.bbox || ({} as any);
    const layoutSetting = layoutItem.setting || {};
    const mergedClass = classNames('flexbox-layout-item d-flex');
    const isStretch = this.isStretchInCrossAxis();
    const isFitContainer = layoutSetting.heightMode === 'fit';

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

    if (isResizing && (dw || dh)) {
      style.height = this.initHeight + dh;
      style.width = this.initWidth + dw;
    }

    return (
      <LayoutItemInBuilder
        style={JSON.stringify(style)}
        layoutId={layoutId}
        layoutItemId={layoutItem.id}
        onResizeStart={this.onResizeStart}
        onResizing={this.onResizing}
        onResizeEnd={this.onResizeEnd}
        left={!isStretch}
        right={!isStretch}
        top={false}
        bottom={!isFitContainer && !layoutSetting.autoProps?.height && layoutSetting.heightMode !== 'ratio'}
        draggable={draggable}
        resizable={resizable}
        selectable={selectable}
        showDefaultTools={showDefaultTools}
        onClick={this.props.onClick}
        className={mergedClass}
        forceAspectRatio={layoutSetting.heightMode === 'ratio' && !layoutSetting.autoProps?.height}
        aspectRatio={ratio}
      />
    );
  }
}
