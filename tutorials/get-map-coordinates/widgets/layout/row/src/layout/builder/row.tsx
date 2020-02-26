/** @jsx jsx */
import {
  React,
  classNames,
  LayoutInfo,
  polished,
  jsx,
  css,
  LayoutItemJson,
  LayoutItemConstructorProps,
  getAppStore,
  appActions,
  IMLayoutJson,
  IMThemeVariables,
  BoundingBox,
} from 'jimu-core';
import { getAppConfigAction } from 'jimu-for-builder';
import * as SVG from 'svg.js';
import { IMRowConfig } from '../../config';
import RowItemForBuilder from './layout-item';
import {
  LayoutProps,
  DropHandlers,
  autoBindHandlers,
  PageContext,
  PageContextProps,
  isRTL,
  LayoutZIndex,
} from 'jimu-layouts/common';
import { DropArea, addItemToLayout } from 'jimu-layouts/layout-builder';
import { snapLeft, resizeItem, moveItem, insertItem } from './utils';
import { ChildRect, IMChildRect, TOTAL_COLS } from '../types';
import { flipRowItemPos, ROW_STYLE } from '../utils';

type RowLayoutProps = LayoutProps & {
  config: IMRowConfig;
  layout: IMLayoutJson,
  transformedLayout: IMLayoutJson,
  isMultiRow: boolean,
};

const dropareaStyle = css`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const guideOverlay = css`
  ${dropareaStyle};
  bottom: 0;
  top: 0;
  z-index: ${LayoutZIndex.DragMoveTip};
  pointer-events: none;
`;

interface State {
  // dragEnterred: boolean;
  isResizing: boolean;
  updatingRects: IMChildRect[];
  isDragging: boolean;
  draggingItemId: string;
  dragOutOfBoundary: boolean;
  isDragoverCenter: boolean;
}

export class Row extends React.PureComponent<RowLayoutProps, State> implements DropHandlers {
  ref: HTMLElement;
  guideColRef: HTMLElement;
  guideDragOverRef: HTMLElement;
  guideDragOverDraw: SVG.Doc;
  dropArea: SVG.Rect;
  boundingRect: ClientRect;
  isDragging: boolean;
  // childrenRef: { [key: string]: React.RefObject<HTMLDivElement> };
  childRects: ChildRect[];
  flippedChildRects: ChildRect[];
  domRect: ClientRect;
  resizingRect: ClientRect;
  referenceId: string;
  colWidth: number;
  // paddings: number[];
  space: number;
  flowLayoutId: string;
  maxPageWidth: number;
  builderTheme: IMThemeVariables;
  isDesignMode: boolean;
  flipLeftRight: boolean;

  state: State = {
    // dragEnterred: false,
    isResizing: false,
    updatingRects: null,
    isDragging: false,
    draggingItemId: null,
    dragOutOfBoundary: false,
    isDragoverCenter: false,
  };

  constructor(props) {
    super(props);
    // this.childrenRef = {};
    autoBindHandlers(this, [
      'onItemResizeStart',
      'onItemResizing',
      'onItemResizeEnd',
      'onDrop',
      'onDragOver',
      'onDragEnter',
      'onDragLeave',
      'toggleDragoverCenterEffect',
    ]);
    this.flipLeftRight = isRTL();
  }

  componentDidMount() {
    this.guideDragOverDraw = SVG(this.guideDragOverRef);
  }

  onItemResizeStart(id: string) {
    this.domRect = this.ref.getBoundingClientRect();

    this.setState({
      isResizing: true,
    });
  }

  onItemResizing(id: string, x: number, y: number, dw: number, dh: number) {
    const colWidth = this.domRect.width / TOTAL_COLS;
    let deltaX = Math.round(x / colWidth);
    let deltaW = Math.round(dw / colWidth);

    if (this.flipLeftRight) {
      deltaX = -deltaX;
      deltaW = -deltaW;
    }

    const resizingRects = resizeItem(id, deltaX, deltaW, this.childRects);
    this.setState({
      updatingRects: resizingRects,
    });
  }

  onItemResizeEnd(id: string, x: number, y: number, dw: number, dh: number, layoutItem: LayoutItemJson) {
    const { layout } = this.props;
    const colWidth = this.domRect.width / TOTAL_COLS;
    let deltaX = Math.round(x / colWidth);
    let deltaW = Math.round(dw / colWidth);

    if (this.flipLeftRight) {
      deltaX = -deltaX;
      deltaW = -deltaW;
    }

    const appConfigAction = getAppConfigAction();
    const resizingRects = resizeItem(id, deltaX, deltaW, this.childRects);
    resizingRects.forEach((rectItem) => {
      const rect: any = {
        left: rectItem.left,
        width: rectItem.width,
        height: rectItem.id === id ? Math.round(rectItem.height + dh) : Math.round(rectItem.height),
      };
      appConfigAction.editLayoutItemBBox(
        {
          layoutId: layout.id,
          layoutItemId: rectItem.id,
        },
        rect,
      );
    });
    appConfigAction.exec();

    this.setState({
      isResizing: false,
      updatingRects: null,
    });
  }

  onItemDragStart = () => {
    this.setState({ isDragging: true });
  }

  onItemDragging = (id: string, dx: number, dy: number, outOfBoundary: boolean) => {
    // only triggered once when outOfBoundary is true
    if (outOfBoundary) {
      this.setState({
        draggingItemId: id,
        dragOutOfBoundary: outOfBoundary,
      });
    }
  }

  onItemDragEnd = (id: string, dx: number, dy: number, outOfBoundary: boolean) => {
    this.setState({ isDragging: false });
  }

  toggleDragoverCenterEffect(value: boolean) {
    this.referenceId = null;
    if (value) {
      this.collectBounds();
    }
    this.setState({
      isDragoverCenter: value,
    });
  }

  onDragOver(
    draggingItem: LayoutItemConstructorProps,
    draggingElement: HTMLElement,
    containerRect: Partial<ClientRect>,
    itemRect: Partial<ClientRect>,
    clientX: number,
    clientY: number,
  ) {
    // const { layout } = this.props;
    const layoutInfo = draggingItem.layoutInfo || {} as LayoutInfo;

    const updatedRects: IMChildRect[] = this.reCalculateRects(
      draggingItem,
      containerRect,
      itemRect,
      clientX,
    );
    let targetRect: IMChildRect;

    updatedRects.some((childRect) => {
      if (!childRect.id || (childRect.layoutId === layoutInfo.layoutId && childRect.id === layoutInfo.layoutItemId)) {
        targetRect = childRect;
        return true;
      }
    });
    let available = true;
    let insertPos = targetRect.left;
    this.flippedChildRects.some((childRect) => {
      if (childRect.layoutId === targetRect.layoutId && childRect.id === targetRect.id) {
        return;
      }
      if (childRect.left <= targetRect.left && (childRect.left + childRect.width) > targetRect.left) {
        available = false;
      }
      if (!available) {
        const updatedChildRect = updatedRects.find(item => item.layoutId === item.layoutId && item.id === childRect.id);
        if (updatedChildRect.left + updatedChildRect.width <= targetRect.left) {
          insertPos = childRect.left + childRect.width;
        } else {
          insertPos = childRect.left;
        }
        return true;
      }
    });

    if (!this.dropArea) {
      if (available) {
        this.dropArea = this.guideDragOverDraw.rect(targetRect.width * this.colWidth - this.space, targetRect.height)
          .fill(polished.rgba(this.builderTheme.colors.palette.primary[700], 0.2)).stroke('none').attr({
            x: insertPos * this.colWidth + this.space / 2,
            y: 0,
          });
      } else {
        const restrainedInsertPos = Math.min(
          containerRect.width - this.space / 2,
          Math.max(0, insertPos * this.colWidth - this.space / 2),
        );
        this.dropArea = this.guideDragOverDraw.rect(10, containerRect.height)
          .fill(polished.rgba(this.builderTheme.colors.palette.primary[700], 1)).stroke('none').attr({
            x: restrainedInsertPos,
            y: 0,
          });
      }
    } else {
      if (available) {
        this.dropArea.move(insertPos * this.colWidth + this.space / 2, 0)
          .fill(polished.rgba(this.builderTheme.colors.palette.primary[700], 0.2))
          .size(targetRect.width * this.colWidth - this.space, targetRect.height);
      } else {
        const restrainedInsertPos = Math.min(
          containerRect.width - this.space / 2,
          Math.max(0, insertPos * this.colWidth - this.space / 2),
        );
        this.dropArea.move(restrainedInsertPos, 0)
          .fill(polished.rgba(this.builderTheme.colors.palette.primary[700], 1))
          .size(10, containerRect.height);
      }

      if (!this.dropArea.visible()) {
        this.dropArea.show();
      }
    }
  }

  onDragEnter() {

  }

  onDragLeave() {

  }

  reCalculateRects(
    draggingItem: LayoutItemConstructorProps,
    containerRect: Partial<ClientRect>,
    itemRect: Partial<ClientRect>,
    clientX: number,
  ) {
    const layoutInfo = draggingItem.layoutInfo || {} as LayoutInfo;
    const { config, layout } = this.props;
    this.space = config.space || 0;
    // this.paddings = styleUtils.expandStyleArray(lodash.getValue(config, 'style.padding.number', [0]));
    // width should add the marginLeft and marginRight, which equals to this.space
    const rowWidth = this.maxPageWidth > 0 ? Math.min(this.maxPageWidth, containerRect.width) : containerRect.width;
    const cursorLeft = clientX - (containerRect.width - rowWidth) / 2;
    const itemLeft = itemRect.left - (containerRect.width - rowWidth) / 2;
    this.colWidth = rowWidth / TOTAL_COLS;
    const cursorLeftInRow1 = Math.floor(cursorLeft / this.colWidth);
    const itemLeftInRow = Math.floor(itemLeft / this.colWidth);
    const span = Math.round(itemRect.width / this.colWidth);

    const cursorLeftInRow = snapLeft(layout.id, draggingItem, itemLeftInRow, span, cursorLeftInRow1, this.flippedChildRects);

    if (this.isInRow(layoutInfo)) { // move in the same layout
      return moveItem(layoutInfo.layoutItemId, cursorLeftInRow, this.flippedChildRects);
    }
    // drag from different layout or from widget list
    return insertItem(
      {
        width: span,
        height: itemRect.height,
        layoutId: layoutInfo.layoutId,
        id: layoutInfo.layoutItemId,
      },
      cursorLeftInRow,
      this.flippedChildRects,
    );
  }

  onDrop(
    draggingItem: LayoutItemConstructorProps,
    containerRect: ClientRect,
    itemRect: ClientRect,
    clientX: number,
    clientY: number,
  ) {
    const rowWidth = this.maxPageWidth > 0 ? Math.min(this.maxPageWidth, containerRect.width) : containerRect.width;
    const cursorLeft = clientX - (containerRect.width - rowWidth) / 2;
    const itemLeft = itemRect.left - (containerRect.width - rowWidth) / 2;

    const layoutInfo = draggingItem.layoutInfo || {} as LayoutInfo;
    const { layout } = this.props;
    const colWidth = rowWidth / TOTAL_COLS;
    let cursorLeftInRow = Math.floor(cursorLeft / colWidth);
    const itemLeftInRow = Math.floor(itemLeft / this.colWidth);
    const span = Math.round(itemRect.width / colWidth);

    cursorLeftInRow = snapLeft(layout.id, draggingItem, itemLeftInRow, span, cursorLeftInRow, this.flippedChildRects);

    let appConfigAction = getAppConfigAction();

    let updatedRects: IMChildRect[];
    let fromOutside: boolean = false;
    if (this.isInRow(layoutInfo)) { // move in the same row
      updatedRects = moveItem(layoutInfo.layoutItemId, cursorLeftInRow, this.flippedChildRects);
    } else { // drag from different layout or from widget list
      updatedRects = insertItem(
        {
          width: span,
          height: itemRect.height,
          layoutId: layoutInfo.layoutId,
          id: layoutInfo.layoutItemId,
        },
        cursorLeftInRow,
        this.flippedChildRects,
      );
      fromOutside = true;
    }

    let addedItemRect;
    let insertIndex;
    updatedRects.forEach((rectItem, index) => {
      let rect: any = {
        left: rectItem.left,
        width: rectItem.width,
        height: rectItem.height,
      };
      if (this.flipLeftRight) {
        rect = flipRowItemPos(rect as BoundingBox);
      }
      if (rectItem.layoutId === layout.id) { // item that is in the same layout
        appConfigAction.editLayoutItemBBox(
          {
            layoutId: rectItem.layoutId,
            layoutItemId: rectItem.id,
          },
          rect,
        );
      } else {
        const firstIndexInRow = 0;
        addedItemRect = rect;
        insertIndex = firstIndexInRow + index;
      }
    });

    if (addedItemRect) {
      addItemToLayout(
        appConfigAction.appConfig,
        draggingItem,
        {
          layoutId: layout.id,
        },
        containerRect, addedItemRect, insertIndex).then((result) => {
        const { layoutInfo, updatedAppConfig } = result;
        appConfigAction = getAppConfigAction(updatedAppConfig);
        if (fromOutside) {
          appConfigAction.editLayoutItemSetting(layoutInfo, { heightMode: 'fit' });
        }
        getAppStore().dispatch(appActions.layoutChanged(appConfigAction.appConfig, layoutInfo));
      });
    } else {
      appConfigAction.exec();
    }

    if (this.dropArea) {
      this.dropArea.hide();
    }
    // this.hideColGuide();

    this.setState({
      // dragEnterred: false,
      draggingItemId: null, // new layout item is added, clear this id to avoid conflict
      dragOutOfBoundary: false,
    });
  }

  isInRow(layoutInfo: LayoutInfo) {
    const { layout } = this.props;
    return layoutInfo && layoutInfo.layoutId === layout.id;
  }

  collectBounds() {
    const { transformedLayout } = this.props;
    const content = transformedLayout.order || [];
    this.childRects = [];

    content.forEach((itemId) => {
      if (transformedLayout.content[itemId].isPending) {
        return;
      }
      const bbox = transformedLayout.content?.[itemId]?.bbox;
      if (bbox) {
        this.childRects.push({
          layoutId: transformedLayout.id,
          id: itemId,
          left: parseInt(bbox.left, 10),
          width: parseInt(bbox.width, 10),
          height: parseInt(bbox.height, 10),
        });
      }
    });
    this.childRects.sort((a, b) => a.left - b.left);

    if (this.flipLeftRight) {
      this.flippedChildRects = [];
      this.childRects.forEach((item) => {
        let rect: any = {
          left: item.left,
          width: item.width,
          height: item.height,
        };
        rect = flipRowItemPos(rect as BoundingBox);
        this.flippedChildRects.push({
          layoutId: item.layoutId,
          id: item.id,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      });
      this.flippedChildRects.sort((a, b) => a.left - b.left);
    } else {
      this.flippedChildRects = this.childRects;
    }

    return this.childRects;
  }

  createItem(childRects: ChildRect[], index: number, layoutStyle) {
    const { transformedLayout, itemDraggable, itemResizable, itemSelectable, config, isMultiRow } = this.props;
    // const { isDragging, draggingItemId, dragOutOfBoundary } = this.state;
    const childRect = childRects[index];
    const gutter = config.space || 0;

    let offset;
    if (index === 0) {
      offset = childRect.left;
    } else {
      const previousBBox = childRects[index - 1];
      offset = childRect.left - previousBBox.left - previousBBox.width;
    }

    return (
      <RowItemForBuilder
        key={childRect.id}
        order={index + 1}
        offset={offset}
        span={childRect.width}
        gutter={gutter}
        isMultiRow={isMultiRow}
        builderTheme={this.builderTheme}
        isDesignMode={this.isDesignMode}
        layoutId={transformedLayout.id}
        layoutItemId={childRect.id}
        layoutItem={transformedLayout.content[childRect.id]}
        draggable={itemDraggable}
        resizable={itemResizable}
        selectable={itemSelectable}
        alignItems={layoutStyle.alignItems}
        // itemDisplaySetting={itemDisplaySetting}
        onResizeStart={this.onItemResizeStart}
        onResizing={this.onItemResizing}
        onResizeEnd={this.onItemResizeEnd}
        onDragStart={this.onItemDragStart}
        onDragging={this.onItemDragging}
        onDragEnd={this.onItemDragEnd}
      />
    );
  }

  placeholderForDraggingItem() {
    const { draggingItemId } = this.state;
    const index = this.childRects.findIndex(item => item.id === draggingItemId);

    if (index >= 0) {
      const childRect = this.childRects[index];

      let offset;
      if (index === 0) {
        offset = childRect.left;
      } else {
        const previousBBox = this.childRects[index - 1];
        offset = childRect.left - previousBBox.left - previousBBox.width;
      }
      return <div className={`offset-${offset} order-${index + 1} col-${childRect.width}`}
        css={css`height: ${childRect.height}px; background: transparent;`}></div>;
    }
  }

  render() {
    const { transformedLayout, className, config } = this.props;
    const { isDragging, isResizing, dragOutOfBoundary, isDragoverCenter } = this.state;
    const isDragover = isDragoverCenter;
    let content: ChildRect[];
    if (isResizing && this.state.updatingRects) {
      content = this.state.updatingRects;
    } else {
      this.collectBounds();
      content = this.childRects;
    }

    const layoutStyle: any = config.style || {};
    const gutter = config.space || 0;

    // this.paddings = styleUtils.expandStyleArray(lodash.getValue(config, 'style.padding.number', [0]));

    return (<PageContext.Consumer>
      {(props: PageContextProps) => {
        this.maxPageWidth = props.maxWidth;
        this.builderTheme = props.builderTheme;
        this.isDesignMode = props.isDesignMode;

        return <div className={classNames('layout', className, { 'row-rtl': this.flipLeftRight })}
          css={ROW_STYLE} data-layoutid={transformedLayout.id}>
          <div css={css`
            width: 100%;
            max-width: ${props.maxWidth > 0 ? props.maxWidth + 'px' : 'none'};
          `}>
            <div
              className={classNames('row', {
                'flex-nowrap': !this.props.isMultiRow
              })}
              ref={el => (this.ref = el)}
              css={css`
                position: relative;
                height: 100%;
                margin-left: ${-gutter / 2}px;
                margin-right: ${-gutter / 2}px;
              `}>
              <DropArea
                css={dropareaStyle}
                layouts={this.props.layouts}
                highlightDragover={false}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
                onToggleDragoverEffect={this.toggleDragoverCenterEffect}>
              </DropArea>
              {content.length > 0 && (
                content.map((_, index) => this.createItem(content, index, layoutStyle))
              )}
              {isDragging && dragOutOfBoundary && this.placeholderForDraggingItem()}
              {content.length === 0 && this.props.children}
              <div
                ref={el => this.guideColRef = el}
                css={css`
                  pointer-events: none;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0px;
                  position: absolute;
                  z-index: 1;
                  display: ${(isDragover || isResizing) ? 'flex' : 'none'};
                `}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((key) => {
                  return (
                    <div
                      key={key}
                      css={css`
                        width: 8.333333%;
                      `}>
                      <div
                        css={css`
                          padding-left: ${gutter / 2}px;
                          padding-right: ${gutter / 2}px;
                          height: 100%;
                          width: 100%;
                          overflow: hidden;
                        `}>
                        <div
                          css={css`
                            transform: translateY(-5%);
                            border: 1px dashed ${polished.rgba(props.builderTheme.colors.palette.dark[300], 0.6)};
                            height: 110%;
                            width: 100%;
                          `}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div css={css`
                ${guideOverlay};
                display: ${isDragover ? 'block' : 'none'};
              `} ref={el => (this.guideDragOverRef = el)} />
            </div>
          </div>
        </div>;
      }}
    </PageContext.Consumer>
    );
  }
}
