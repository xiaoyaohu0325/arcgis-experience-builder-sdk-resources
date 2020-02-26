/** @jsx jsx */
import {
  React,
  ReactRedux,
  classNames,
  polished,
  jsx,
  css,
  LayoutItemJson,
  LayoutItemConstructorProps,
  getAppStore,
  appActions,
  IMThemeVariables,
} from 'jimu-core';
import { getAppConfigAction } from 'jimu-for-builder';
import { LayoutProps, StateToLayoutProps, DropHandlers, mapStateToLayoutProps,
  autoBindHandlers, relativeClientRect, PageContext, PageContextProps } from 'jimu-layouts/common';
import { DropArea, addItemToLayout } from 'jimu-layouts/layout-builder';
import { styleUtils } from 'jimu-ui';
import * as SVG from 'svg.js';
import { calInsertPositionForColumn } from './dnd-helper';
import { IMFlexboxConfig } from '../../config';
import { defaultConfig } from '../../default-config';
import { FlexboxItem } from './layout-item';

type FlexboxLayoutProps = LayoutProps & {
  config: IMFlexboxConfig;
};

const dropareaStyle = css`
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  background: transparent;
`;

const guideOverlay = css`
  ${dropareaStyle};
  z-index: 20;
  pointer-events: none;
`;

const dropIndicatorSize = 10;

interface State {
  isDragover: boolean;
}

class Layout extends React.PureComponent<FlexboxLayoutProps & StateToLayoutProps, State> implements DropHandlers {
  ref: HTMLElement;
  guideDragOverRef: HTMLElement;
  guideDragOverDraw: SVG.Doc;
  dropArea: SVG.Rect;
  // dragEnterArea: SVG.Rect;
  boundingRect: ClientRect;
  isDragging: boolean;
  // childrenRef: { [key: string]: React.RefObject<HTMLDivElement> };
  childRects: Array<ClientRect & { id: string }>;
  domRect: ClientRect;
  resizingRect: ClientRect;
  referenceId: string;

  // page env
  theme: IMThemeVariables;
  builderTheme: IMThemeVariables;

  state: State = {
    isDragover: false,
  };

  constructor(props) {
    super(props);
    autoBindHandlers(this, [
      'onItemResizeStart',
      'onItemResizing',
      'onItemResizeEnd',
      'onDrop',
      'onDragOver',
      'onDragEnter',
      'onDragLeave',
      'toggleDragoverEffect',
    ]);
  }

  componentDidMount() {
    this.guideDragOverDraw = SVG(this.guideDragOverRef);
  }

  onItemResizeStart(id: string) {
    const { layout } = this.props;
    this.domRect = this.ref.getBoundingClientRect();
    const draggingChild = this.ref.querySelector(
      `div.exb-rnd[data-layoutid="${layout.id}"][data-layoutitemid="${id}"]`);
    const rect = draggingChild.getBoundingClientRect();
    this.resizingRect = relativeClientRect(rect, this.domRect);
  }

  onItemResizing = () => {};

  onItemResizeEnd(id: string, x: number, y: number, dw: number, dh: number, layoutItem: LayoutItemJson) {
    const newPos = {
      width: this.resizingRect.width + dw,
      height: this.resizingRect.height + dh,
    };
    this.childRects = [];
    this.domRect = null;
    const appConfigAction = getAppConfigAction();
    appConfigAction.editLayoutItemBBox(
      {
        layoutId: this.props.layout.id,
        layoutItemId: id,
      },
      newPos,
    ).exec();
  }

  onDragOver(
    draggingItem: LayoutItemConstructorProps,
    draggingElement: HTMLElement,
    containerRect: Partial<ClientRect>,
    itemRect: Partial<ClientRect>,
  ) {
    let rect = itemRect;

    if (this.childRects && this.childRects.length > 0) {
      const { insertY, refId } = calInsertPositionForColumn(containerRect as ClientRect, rect, this.childRects);
      this.referenceId = refId;
      rect = {
        top: insertY - dropIndicatorSize / 2 + this.ref.scrollTop,
        width: containerRect.width - dropIndicatorSize,
        left: dropIndicatorSize / 2,
        height: dropIndicatorSize,
      };
    } else {
      rect = {
        top: containerRect.height / 2 - dropIndicatorSize / 2,
        width: containerRect.width - dropIndicatorSize,
        left: dropIndicatorSize / 2,
        height: dropIndicatorSize,
      };
    }

    if (!this.dropArea) {
      this.dropArea = this.guideDragOverDraw
        .rect(rect.width, rect.height)
        .fill(polished.rgba(this.builderTheme.colors.palette.primary[700], 1))
        .stroke('none')
        .attr({
          x: rect.left,
          y: rect.top,
        });
    } else {
      this.dropArea.move(rect.left, rect.top).size(rect.width, rect.height);
      if (!this.dropArea.visible()) {
        this.dropArea.show();
      }
    }
  }

  toggleDragoverEffect(value: boolean) {
    if (value) {
      this.referenceId = null;
      this.collectBounds(null);
    }
    this.setState({
      isDragover: value,
    });
  }

  onDragEnter() {
  }

  onDragLeave() {

  }

  onDrop(draggingItem: LayoutItemConstructorProps, containerRect: ClientRect, itemRect: ClientRect) {
    if (this.dropArea) {
      this.dropArea.hide();
    }
    const { layout } = this.props;
    const layoutInfo = {
      layoutId: layout.id,
    };
    let insertIndex = 0;
    if (this.referenceId) {
      insertIndex = layout.order.indexOf(this.referenceId);
    } else if (layout.order) {
      insertIndex = layout.order.length;
    }

    const appConfigAction = getAppConfigAction();
    addItemToLayout(appConfigAction.appConfig, draggingItem, layoutInfo, containerRect, itemRect, insertIndex)
      .then(((result) => {
        const { layoutInfo, updatedAppConfig } = result;
        getAppStore().dispatch(appActions.layoutChanged(updatedAppConfig, layoutInfo));
      }));
    this.referenceId = null;
    this.childRects = [];
  }

  collectBounds(id: string) {
    const { layout } = this.props;
    this.childRects = [];
    this.domRect = this.ref.getBoundingClientRect();
    const draggableChildren = this.ref.parentNode.querySelectorAll(
      `div[data-layoutid="${layout.id}"] > div.exb-rnd`);
    if (draggableChildren && draggableChildren.length > 0) {
      draggableChildren.forEach((node) => {
        const itemId = node.getAttribute('data-layoutitemid');
        if (id !== itemId && layout.order.indexOf(itemId) >= 0) {
          const rect = relativeClientRect(node.getBoundingClientRect(), this.domRect);
          rect.id = itemId;
          this.childRects.push(rect);
        }
      });
    }

    return this.childRects.sort((a, b) => a.top - b.top);
  }

  createItem(itemId: string, index: number, layoutStyle) {
    const {
      layout,
      config,
      itemDraggable,
      itemResizable,
      itemSelectable,
      showDefaultTools,
    } = this.props;

    return (
      <FlexboxItem
        key={itemId}
        index={index}
        space={+config.space >= 0 ? +config.space : defaultConfig.space}
        layoutId={layout.id}
        layoutItemId={itemId}
        layoutItem={layout.content[itemId]}
        draggable={itemDraggable}
        resizable={itemResizable}
        selectable={itemSelectable}
        showDefaultTools={showDefaultTools}
        onResizeStart={this.onItemResizeStart}
        onResizing={this.onItemResizing}
        onResizeEnd={this.onItemResizeEnd}
      />
    );
  }

  render() {
    const { layout, className, config } = this.props;

    const content = layout.order || [];
    const layoutStyle = config.style || defaultConfig.style;

    return (
      <PageContext.Consumer>
        {(pageContext: PageContextProps) => {
          this.builderTheme = pageContext.builderTheme;
          this.theme = pageContext.theme;

          const mergedStyle: any = {
            position: 'relative',
            minHeight: config.min || defaultConfig.min,
            minWidth: config.min || defaultConfig.min,
            ...styleUtils.toCSSStyle(layoutStyle as any),
            overflowX: 'hidden',
          };
          if (!mergedStyle.border && pageContext.isDesignMode) {
            mergedStyle.border = `1px dashed ${polished.rgba(this.builderTheme.colors.palette.dark[300], 0.3)}`;
          }
          const outClass = classNames('layout flexbox-layout d-flex flex-column w-100', className);
          const guideVisibleStyle = {
            display: this.state.isDragover ? 'block' : 'none',
          };

          return <div
            className={outClass}
            ref={el => (this.ref = el)}
            style={mergedStyle}
            data-layoutid={layout.id}>
            <DropArea
              css={dropareaStyle}
              layouts={this.props.layouts}
              highlightDragover={true}
              onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave}
              onDragOver={this.onDragOver}
              onDrop={this.onDrop}
              onToggleDragoverEffect={this.toggleDragoverEffect}
            >
            </DropArea>
            {content.length > 0 &&
              (content as any).map((layoutItem, index) => this.createItem(layoutItem, index, layoutStyle))
            }
            {content.length === 0 && this.props.children}
            <div css={guideOverlay} style={guideVisibleStyle} ref={el => (this.guideDragOverRef = el)} />
          </div>;
        }}
      </PageContext.Consumer>

    );
  }
}

export default ReactRedux.connect<StateToLayoutProps, {}, FlexboxLayoutProps>(mapStateToLayoutProps)(Layout);
