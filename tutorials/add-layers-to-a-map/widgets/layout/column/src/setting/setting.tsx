/** @jsx jsx */
import { jsx } from 'jimu-core';
import { BaseWidgetSetting, AllWidgetSettingProps } from 'jimu-for-builder';
import { SettingSection, SettingRow } from 'jimu-ui/setting-components';
import { Select, Sides, Switch, LinearUnit } from 'jimu-ui';
import { IMFlexboxConfig } from '../config';
import { defaultConfig } from '../default-config';
import { FourSides, InputUnit } from 'jimu-ui/style-setting-components';
import defaultMessages from './translations/default';

const marginSides = [Sides.T, Sides.R, Sides.B, Sides.L];
const inputStyle = { width: 110 };

export default class Setting extends BaseWidgetSetting<AllWidgetSettingProps<IMFlexboxConfig>>{
  updateSpace = (value: LinearUnit) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('space', value.distance),
    });
  }

  updatePadding = (value) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['style', 'padding'], value),
    });
  }

  updateJustifyContent = (e) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['style', 'justifyContent'], e.target.value),
    });
  }

  updateScrollable = (e) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['style', 'overflowY'], e.target.checked ? 'auto' : 'hidden'),
    });
  }

  formatMessage = (id: string) => {
    return this.props.intl.formatMessage({ id, defaultMessage: defaultMessages[id] });
  }

  render() {
    const { config } = this.props;
    const style = config.style || defaultConfig.style;

    return (
      <div className="flexbox-layout-setting">
        <SettingSection title={this.formatMessage('layout')}>
          <SettingRow label={this.formatMessage('verticalAlign')}>
            <Select value={style.justifyContent} onChange={this.updateJustifyContent} style={inputStyle}>
              <option value="flex-start">{this.formatMessage('start')}</option>
              <option value="flex-end">{this.formatMessage('end')}</option>
              <option value="center">{this.formatMessage('center')}</option>
              <option value="space-around">{this.formatMessage('spaceAround')}</option>
              <option value="space-between">{this.formatMessage('spaceBetween')}</option>
              <option value="space-evenly">{this.formatMessage('spaceEvenly')}</option>
            </Select>
          </SettingRow>
          <SettingRow label={this.formatMessage('scrollable')}>
            <Switch checked={(style.overflowY ?? 'auto') === 'auto'} onChange={this.updateScrollable}></Switch>
          </SettingRow>
          <SettingRow label={this.formatMessage('gap')}>
            <InputUnit value={{distance: config.space >= 0 ? config.space : defaultConfig.space, unit: undefined}} min={0}
              onChange={this.updateSpace} style={inputStyle}>
            </InputUnit>
          </SettingRow>
          <SettingRow label={this.formatMessage('padding')} flow="wrap">
            <FourSides showTip={true} sides={marginSides} value={style.padding as any}
              onChange={this.updatePadding}></FourSides>
          </SettingRow>
        </SettingSection>
      </div>
    );
  }
}
