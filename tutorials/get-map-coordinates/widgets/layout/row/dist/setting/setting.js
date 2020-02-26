define(["jimu-core","jimu-ui","jimu-for-builder","jimu-ui/setting-components","jimu-ui/style-setting-components"],(function(e,t,n,o,i){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=622)}({18:function(e,t){e.exports=i},3:function(t,n){t.exports=e},4:function(e,n){e.exports=t},59:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(3),i=n(4);t.defaultConfig=o.Immutable({space:20,style:{padding:{number:[10],unit:i.UnitTypes.PIXEL}}}),t.DEFAULT_ROW_ITEM_SETTING={heightMode:"fixed",aspectRatio:1,offsetX:0,offsetY:0,style:{alignSelf:"flex-start"}}},6:function(e,t){e.exports=n},622:function(e,t,n){"use strict";var o,i=this&&this.__extends||(o=function(e,t){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0});var r=n(3),s=n(6),u=n(7),a=n(4),f=n(59),p=n(623),c=n(18),d=[a.Sides.T,a.Sides.R,a.Sides.B,a.Sides.L],l=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.updateSpace=function(e){t.props.onSettingChange({id:t.props.id,config:t.props.config.set("space",e.distance)})},t.updatePadding=function(e){t.props.onSettingChange({id:t.props.id,config:t.props.config.setIn(["style","padding"],e)})},t.formatMessage=function(e){return t.props.intl.formatMessage({id:e,defaultMessage:p.default[e]})},t}return i(t,e),t.prototype.render=function(){var e=this.props.config,t=e.style||f.defaultConfig.style,n=e.space>=0?e.space:f.defaultConfig.space;return r.jsx("div",{className:"row-layout-setting"},r.jsx(u.SettingSection,{title:this.formatMessage("layout")},r.jsx(u.SettingRow,{label:this.formatMessage("gap")},r.jsx(c.InputUnit,{value:{distance:n,unit:a.UnitTypes.PIXEL},min:0,onChange:this.updateSpace,style:{width:110}})),r.jsx(u.SettingRow,{label:this.formatMessage("padding"),flow:"wrap"},r.jsx(c.FourSides,{showTip:!0,sides:d,value:t.padding,onChange:this.updatePadding}))))},t}(s.BaseWidgetSetting);t.default=l},623:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={gap:"Gap"}},7:function(e,t){e.exports=o}})}));