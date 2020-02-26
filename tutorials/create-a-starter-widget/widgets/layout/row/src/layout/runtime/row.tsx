/** @jsx jsx */
import {
  React,
  classNames,
  jsx,
  css,
  IMLayoutJson,
  IMThemeVariables,
} from 'jimu-core';
import { IMRowConfig } from '../../config';
import RowItem from './layout-item';
import {
  LayoutProps,
  PageContext,
  PageContextProps,
  isRTL,
} from 'jimu-layouts/common';
import { ChildRect } from '../types';
import { ROW_STYLE } from '../utils';

type RowLayoutProps = LayoutProps & {
  config: IMRowConfig;
  layout: IMLayoutJson;
  transformedLayout: IMLayoutJson;
  theme: IMThemeVariables;
  isMultiRow: boolean;
};

export class Row extends React.PureComponent<RowLayoutProps> {
  childRects: ChildRect[];
  flipLeftRight: boolean;

  constructor(props) {
    super(props);
    this.flipLeftRight = isRTL();
  }

  collectBounds() {
    const { transformedLayout } = this.props;
    const content = transformedLayout.order || [];
    this.childRects = [];

    content.forEach((itemId) => {
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
    return this.childRects.sort((a, b) => a.left - b.left);
  }

  createItem(childRects: ChildRect[], index: number, layoutStyle) {
    const { layout, config, isMultiRow } = this.props;
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
      <RowItem
        key={childRect.id}
        offset={offset}
        span={childRect.width}
        isMultiRow={isMultiRow}
        layoutId={layout.id}
        layoutItemId={childRect.id}
        layoutItem={layout.content[childRect.id]}
        alignItems={layoutStyle.alignItems}
        style={{
          paddingLeft: gutter / 2,
          paddingRight: gutter / 2,
        }}
      />
    );
  }

  render() {
    const { layout, className, config } = this.props;
    this.collectBounds();
    const content = this.childRects;

    const layoutStyle: any = config.style || {};
    const gutter = config.space || 0;

    return (
      <PageContext.Consumer>
        {(props: PageContextProps) => {
          return <div className={classNames('layout', className, { 'row-rtl': this.flipLeftRight })}
            css={ROW_STYLE} data-layoutid={layout.id}>
            <div css={css`
            width: 100%;
            max-width: ${props.maxWidth > 0 ? props.maxWidth + 'px' : 'none'};
          `}>
              <div
                className={classNames('row', {
                  'flex-nowrap': !this.props.isMultiRow
                })}
                css={css`
                position: relative;
                margin-left: ${-gutter / 2}px;
                margin-right: ${-gutter / 2}px;
                height: 100%;
              `}>
                {content.length > 0 && (
                  content.map((_, index) => this.createItem(content, index, layoutStyle))
                )}
              </div>
            </div>
          </div>;
        }}
      </PageContext.Consumer>
    );
  }
}
