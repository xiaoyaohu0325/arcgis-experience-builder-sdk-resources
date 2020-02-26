/** @jsx jsx */
import {
  React,
  Immutable,
  jsx,
  lodash,
  APP_FRAME_NAME_IN_BUILDER,
  LayoutItemType,
} from 'jimu-core';
import {
  SettingSection,
  SettingRow,
  SizeMode,
  SizeModeSelector,
} from 'jimu-ui/setting-components';
import { LayoutItemSettingProps } from 'jimu-layouts/common';

import { UnitTypes, LinearUnit, Select, NumericInput, Label } from 'jimu-ui';
import { CommonLayoutItemSetting } from 'jimu-layouts/layout-builder';
import { RowLayoutItemSetting } from '../config';
import { DEFAULT_ROW_ITEM_SETTING } from '../default-config';
import { InputUnit, InputRatio } from 'jimu-ui/style-setting-components';

const inputStyle = { width: '7.5rem' };

const availableUnits = [UnitTypes.PIXEL];

export default class RowItemSetting extends React.PureComponent<LayoutItemSettingProps> {
  updateStyle(key, value) {
    const { layoutItem } = this.props;
    const style = Immutable(layoutItem?.setting?.style ?? {});
    this.props.onSettingChange(
      {
        layoutId: this.props.layoutId,
        layoutItemId: this.props.layoutItem.id,
      },
      {
        style: style.set(key, value),
      },
    );
  }

  updateAlign = (e) => {
    this.updateStyle('alignSelf', e.target.value);
  }

  updateHeight = (value: LinearUnit) => {
    const bbox = Immutable(this.props.layoutItem.bbox);
    this.props.onPosChange(
      {
        layoutId: this.props.layoutId,
        layoutItemId: this.props.layoutItem.id,
      },
      bbox.set('height', `${Math.round(value.distance)}${value.unit}`),
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

  updateAutoSetting = (mode: SizeMode) => {
    const isAuto = mode === SizeMode.Auto;
    let setting = this.props.layoutItem.setting || Immutable({});
    setting = setting.setIn(['autoProps', 'height'], isAuto);
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

  updateOffsetX = (value: number) => {
    const setting = this.props.layoutItem.setting || Immutable({});
    this.props.onSettingChange(
      {
        layoutId: this.props.layoutId,
        layoutItemId: this.props.layoutItem.id,
      },
      setting.set('offsetX', value),
    );
  }

  updateOffsetY = (value: number) => {
    const setting = this.props.layoutItem.setting || Immutable({});
    this.props.onSettingChange(
      {
        layoutId: this.props.layoutId,
        layoutItemId: this.props.layoutItem.id,
      },
      setting.set('offsetY', value),
    );
  }

  formatMessage = (id: string) => {
    return this.props.formatMessage(id);
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

  render() {
    const { layoutId, layoutItem, isLockLayout } = this.props;
    if (!layoutItem) {
      return null;
    }
    const itemSetting: RowLayoutItemSetting = lodash.assign({}, DEFAULT_ROW_ITEM_SETTING, layoutItem.setting);
    const bbox = layoutItem.bbox;
    const style = itemSetting.style || {} as any;
    const isAuto = itemSetting.autoProps?.height ?? false;
    const heightMode = (itemSetting as any).heightMode !== 'auto' ? (itemSetting.heightMode ?? 'fit') : 'fit';

    return (
      <div className="row-item-setting">
        {!isLockLayout && <React.Fragment>
          <SettingSection title={this.formatMessage('size')}>
            <SettingRow label={
              <Label check className="justify-content-start align-items-center">
                {this.formatMessage('height')}
              </Label>}
            >
              <SizeModeSelector
                mode={isAuto ? SizeMode.Auto : SizeMode.Custom}
                onChange={this.updateAutoSetting}
              >
                <Select value={heightMode} onChange={this.updateHeightMode} style={inputStyle} disabled={isAuto}>
                  <option value="fit">{this.formatMessage('fitToContainer')}</option>
                  <option value="fixed">{this.formatMessage('fixed')}</option>
                  <option value="ratio">{this.formatMessage('aspectRatio')}</option>
                </Select>
              </SizeModeSelector>
            </SettingRow>
            {heightMode === 'ratio' && !isAuto &&
            <SettingRow label={this.formatMessage('aspectRatio')}>
              <InputRatio style={inputStyle} value={itemSetting.aspectRatio} onChange={this.updateAspectRatio}/>
            </SettingRow>}
            {heightMode === 'fixed' && !isAuto &&
            <SettingRow label={this.formatMessage('height')}>
              <InputUnit
                style={inputStyle}
                units={availableUnits}
                value={{
                  distance: Math.round(parseFloat(bbox.height)),
                  unit: UnitTypes.PIXEL,
                }}
                onChange={this.updateHeight}
              />
            </SettingRow>}
            {(heightMode !== 'fit' || isAuto) &&
            <SettingRow label={this.formatMessage('align')}>
              <Select style={inputStyle} value={style.alignSelf || 'flex-start'} onChange={this.updateAlign}>
                <option value="flex-start">{this.formatMessage('T')}</option>
                <option value="flex-end">{this.formatMessage('B')}</option>
                <option value="center">{this.formatMessage('center')}</option>
              </Select>
            </SettingRow>}
          </SettingSection>
          <SettingSection title={this.formatMessage('position')}>
            <SettingRow label={this.formatMessage('offsetX')}>
              <NumericInput
                style={inputStyle}
                value={itemSetting.offsetX}
                onChange={this.updateOffsetX}
              />
            </SettingRow>
            <SettingRow label={this.formatMessage('offsetY')}>
              <NumericInput
                style={inputStyle}
                value={itemSetting.offsetY}
                onChange={this.updateOffsetY}
              />
            </SettingRow>
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
