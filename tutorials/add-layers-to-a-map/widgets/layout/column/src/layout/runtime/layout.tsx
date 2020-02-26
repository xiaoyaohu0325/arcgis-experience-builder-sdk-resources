import { React, ReactRedux, classNames, Immutable } from 'jimu-core';
import { styleUtils } from 'jimu-ui';
import { mapStateToLayoutProps, LayoutProps, StateToLayoutProps } from 'jimu-layouts/common';
import { FlexboxItem } from './layout-item';
import { IMFlexboxConfig } from '../../config';
import { defaultConfig } from '../../default-config';

interface OwnProps {
  config: IMFlexboxConfig;
}

type FlexLayoutProps = LayoutProps & StateToLayoutProps & OwnProps;

class Layout extends React.PureComponent<FlexLayoutProps> {
  createItem(itemId: string, index: number, layoutStyle: any) {
    const { layout, config } = this.props;

    return (
      <FlexboxItem
        key={itemId}
        index={index}
        space={+config.space >= 0 ? +config.space : defaultConfig.space}
        layoutId={layout.id}
        layoutItemId={itemId}
        layoutItem={layout.content[itemId]}>
      </FlexboxItem>
    );
  }

  render() {
    const { layout, className, config } = this.props;

    const content = layout.order || Immutable([]);
    const layoutStyle = config.style || defaultConfig.style;

    const mergedStyle: any = {
      ...styleUtils.toCSSStyle(layoutStyle as any),
      position: 'relative',
      overflowX: 'hidden',
    };
    const outClass = classNames('layout flexbox-layout d-flex flex-column w-100', className);

    return (
      <div className={outClass} style={mergedStyle}
        data-layoutid={layout.id}>
        { (content.asMutable()).map((layoutItem, index) => this.createItem(layoutItem, index, layoutStyle)) }
      </div>
    );
  }
}

export default ReactRedux.connect<StateToLayoutProps, {}, LayoutProps & OwnProps>(mapStateToLayoutProps)(Layout);