/** @jsx jsx */
import { React, jsx, Immutable, lodash, LayoutItemType, APP_FRAME_NAME_IN_BUILDER } from 'jimu-core';
import { SettingSection, SettingRow, SizeModeSelector, SizeMode } from 'jimu-ui/setting-components';
import { UnitTypes, Label, LinearUnit, Select } from 'jimu-ui';
import { isPercentage, LayoutItemSettingProps } from 'jimu-layouts/common';
import { CommonLayoutItemSetting } from 'jimu-layouts/layout-builder';
import { InputUnit, InputRatio } from 'jimu-ui/style-setting-components';

const inputStyle = { width: 110 };
const availableUnits = [UnitTypes.PIXEL, UnitTypes.PERCENTAGE];

function parsePositionProp(value: string): { distance: number; unit: UnitTypes } {
  if (isPercentage(value)) {
    return {
      distance: parseFloat(value),
      unit: UnitTypes.PERCENTAGE,
    };
  }
  return {
    distance: parseInt(value, 10),
    unit: UnitTypes.PIXEL,
  };
}
export default class FlexboxItemSetting extends React.PureComponent<LayoutItemSettingProps> {
  updateBBox = (prop: string, value: LinearUnit) => {
    const { bbox } = this.props.layoutItem;
    const update = {};
    update[prop] = `${value.distance}${value.unit}`;
    this.props.onPosChange(
      {
        layoutId: this.props.layoutId,
        layoutItemId: this.props.layoutItem.id,
      },
      lodash.assign({}, bbox, update) as any,
    );
  }

  updateAutoSetting = (prop: string, isAuto: boolean) => {
    let setting = this.props.layoutItem.setting || Immutable({});
    setting = setting.setIn(['autoProps', prop], isAuto);
    const bbox = Immutable(this.props.layoutItem.bbox);
    const propValue = parseFloat(bbox?.height);
    if (!isAuto && isNaN(propValue)) {
      const rect = this.getSizeOfItem();
      if (rect) {
        this.props.onPosChange(
          {
            layoutId: this.props.layoutId,
            layoutItemId: this.props.layoutItem.id,
          },
          bbox.set('height', rect.height),
        );
      }
    }
    this.props.onSettingChange(
      {
        layoutId: this.props.layoutId,
        layoutItemId: this.props.layoutItem.id,
      },
      setting,
    );
  }

  updateAlignSelf = (e) => {
    let setting = this.props.layoutItem.setting || Immutable({});
    setting = setting.setIn(['style', 'alignSelf'], e.target.value);
    this.props.onSettingChange(
      {
        layoutId: this.props.layoutId,
        layoutItemId: this.props.layoutItem.id,
      },
      setting,
    );
  }

  updateHeightMode = (e) => {
    let setting = this.props.layoutItem.setting || Immutable({});
    const mode = e.target.value;
    setting = setting.set('heightMode', mode);
    if (mode === 'ratio') {
      const itemRect = this.getSizeOfItem();
      if (itemRect) {
        setting = setting.set('aspectRatio', Number((itemRect.height / itemRect.width).toFixed(2)));
      }
    }
    this.props.onSettingChange(
      {
        layoutId: this.props.layoutId,
        layoutItemId: this.props.layoutItem.id,
      },
      setting,
    );
  }

  updateAspectRatio = (newRatio) => {
    let setting = this.props.layoutItem.setting || Immutable({});
    setting = setting.set('aspectRatio', newRatio);
    this.props.onSettingChange(
      {
        layoutId: this.props.layoutId,
        layoutItemId: this.props.layoutItem.id,
      },
      setting,
    );
  }

  getSizeOfItem(): ClientRect {
    const { layoutId, layoutItem } = this.props;
    const layoutElem = this.querySelector(
      `div.exb-rnd[data-layoutid="${layoutId}"][data-layoutitemid="${layoutItem.id}"]`);
    if (layoutElem) {
      return layoutElem.getBoundingClientRect();
    }
    return null;
  }

  querySelector(selector: string): HTMLElement {
    const appFrame: HTMLFrameElement = document.querySelector(`iframe[name="${APP_FRAME_NAME_IN_BUILDER}"]`);
    if (appFrame) {
      const appFrameDoc = appFrame.contentDocument || appFrame.contentWindow.document;
      return appFrameDoc.querySelector(selector);
    }
    return null;
  }

  formatMessage = (id: string) => {
    return this.props.formatMessage(id);
  }

  render() {
    const { layoutId, layoutItem, isLockLayout } = this.props;
    if (!layoutItem) {
      return null;
    }
    const setting = layoutItem.setting || {};
    const style = setting.style || {};
    const bbox = layoutItem.bbox || {};
    const isAutoWidth = setting.autoProps?.width ?? true;
    const isAutoHeight = setting.autoProps?.height ?? false;
    const heightMode = setting.heightMode ?? 'fixed';

    return (
      <div className="column-item-setting">
        {!isLockLayout && <React.Fragment>
          <SettingSection title={this.formatMessage('size')}>
            <SettingRow label={
              <Label check className="justify-content-start align-items-center">
                {this.formatMessage('width')}
              </Label>}
            >
              <SizeModeSelector
                mode={isAutoWidth ? SizeMode.Auto : SizeMode.Custom}
                onChange={mode => this.updateAutoSetting('width', mode === SizeMode.Auto)}
              >
                <InputUnit
                  style={inputStyle}
                  disabled={isAutoWidth}
                  units={availableUnits}
                  value={parsePositionProp(bbox?.width)}
                  onChange={value => this.updateBBox('width', value)}
                />
              </SizeModeSelector>
            </SettingRow>
            {!isAutoWidth && <SettingRow label={this.formatMessage('align')}>
              <Select value={style.alignSelf ?? 'flex-start'} onChange={this.updateAlignSelf} style={inputStyle}>
                <option value="flex-start">{this.formatMessage('start')}</option>
                <option value="flex-end">{this.formatMessage('end')}</option>
                <option value="center">{this.formatMessage('center')}</option>
              </Select>
            </SettingRow>}
            <SettingRow label={
              <Label check className="justify-content-start align-items-center">
                {this.formatMessage('height')}
              </Label>}
            >
              <SizeModeSelector
                mode={isAutoHeight ? SizeMode.Auto : SizeMode.Custom}
                onChange={mode => this.updateAutoSetting('height', mode === SizeMode.Auto)}
              >
                <Select value={heightMode} onChange={this.updateHeightMode} style={inputStyle} disabled={isAutoHeight}>
                  <option value="fit">{this.formatMessage('fitToContainer')}</option>
                  <option value="fixed">{this.formatMessage('fixed')}</option>
                  <option value="ratio">{this.formatMessage('aspectRatio')}</option>
                </Select>
              </SizeModeSelector>
            </SettingRow>
            {heightMode === 'ratio' && !isAutoHeight &&
            <SettingRow label={this.formatMessage('aspectRatio')}>
              <InputRatio style={inputStyle} value={setting.aspectRatio} onChange={this.updateAspectRatio}/>
            </SettingRow>}
            {heightMode === 'fixed' && !isAutoHeight &&
            <SettingRow label={this.formatMessage('height')}>
              <InputUnit
                style={inputStyle}
                units={availableUnits}
                value={{
                  distance: Math.round(parseFloat(bbox.height)),
                  unit: UnitTypes.PIXEL,
                }}
                onChange={value => this.updateBBox('height', value)}
              />
            </SettingRow>}
          </SettingSection>
        </React.Fragment>}
        {(layoutItem.widgetId || layoutItem.sectionId) && <CommonLayoutItemSetting
          layoutId={layoutId}
          layoutItemId={layoutItem.id}
          isSection={layoutItem.type === LayoutItemType.Section}
          style={this.props.style}
          onStyleChange={this.props.onStyleChange}
          formatMessage={this.props.formatMessage}/>}
      </div>
    );
  }
}
