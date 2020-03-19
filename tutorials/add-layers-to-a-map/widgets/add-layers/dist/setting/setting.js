define(["jimu-core","jimu-for-builder","jimu-ui/setting-components"], function(__WEBPACK_EXTERNAL_MODULE_jimu_core__, __WEBPACK_EXTERNAL_MODULE_jimu_for_builder__, __WEBPACK_EXTERNAL_MODULE_jimu_ui_setting_components__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./your-extensions/widgets/add-layers/src/setting/setting.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./your-extensions/widgets/add-layers/src/setting/setting.tsx":
/*!********************************************************************!*\
  !*** ./your-extensions/widgets/add-layers/src/setting/setting.tsx ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/** @jsx jsx */\r\nvar jimu_core_1 = __webpack_require__(/*! jimu-core */ \"jimu-core\");\r\nvar jimu_for_builder_1 = __webpack_require__(/*! jimu-for-builder */ \"jimu-for-builder\");\r\nvar setting_components_1 = __webpack_require__(/*! jimu-ui/setting-components */ \"jimu-ui/setting-components\");\r\nvar Setting = /** @class */ (function (_super) {\r\n    __extends(Setting, _super);\r\n    function Setting() {\r\n        var _this = _super !== null && _super.apply(this, arguments) || this;\r\n        _this.onMapWidgetSelected = function (useMapWidgetIds) {\r\n            _this.props.onSettingChange({\r\n                id: _this.props.id,\r\n                useMapWidgetIds: useMapWidgetIds\r\n            });\r\n        };\r\n        return _this;\r\n    }\r\n    Setting.prototype.render = function () {\r\n        return jimu_core_1.jsx(\"div\", { className: \"widget-setting-demo\" },\r\n            jimu_core_1.jsx(setting_components_1.JimuMapViewSelector, { useMapWidgetIds: this.props.useMapWidgetIds, onSelect: this.onMapWidgetSelected }));\r\n    };\r\n    return Setting;\r\n}(jimu_for_builder_1.BaseWidgetSetting));\r\nexports.default = Setting;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi95b3VyLWV4dGVuc2lvbnMvd2lkZ2V0cy9hZGQtbGF5ZXJzL3NyYy9zZXR0aW5nL3NldHRpbmcudHN4LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4veW91ci1leHRlbnNpb25zL3dpZGdldHMvYWRkLWxheWVycy9zcmMvc2V0dGluZy9zZXR0aW5nLnRzeD83N2IxIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xyXG5pbXBvcnQgeyBSZWFjdCwganN4IH0gZnJvbSBcImppbXUtY29yZVwiO1xyXG5pbXBvcnQgeyBCYXNlV2lkZ2V0U2V0dGluZywgQWxsV2lkZ2V0U2V0dGluZ1Byb3BzIH0gZnJvbSBcImppbXUtZm9yLWJ1aWxkZXJcIjtcclxuaW1wb3J0IHsgSmltdU1hcFZpZXdTZWxlY3RvciB9IGZyb20gXCJqaW11LXVpL3NldHRpbmctY29tcG9uZW50c1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZyBleHRlbmRzIEJhc2VXaWRnZXRTZXR0aW5nPEFsbFdpZGdldFNldHRpbmdQcm9wczxhbnk+LCBhbnk+IHtcclxuXHJcbiAgb25NYXBXaWRnZXRTZWxlY3RlZCA9ICh1c2VNYXBXaWRnZXRJZHM6IHN0cmluZ1tdKSA9PiB7XHJcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XHJcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxyXG4gICAgICB1c2VNYXBXaWRnZXRJZHM6IHVzZU1hcFdpZGdldElkc1xyXG4gICAgfSk7XHJcbiAgfTtcclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJ3aWRnZXQtc2V0dGluZy1kZW1vXCI+PEppbXVNYXBWaWV3U2VsZWN0b3JcclxuICAgIHVzZU1hcFdpZGdldElkcz17dGhpcy5wcm9wcy51c2VNYXBXaWRnZXRJZHN9XHJcbiAgICBvblNlbGVjdD17dGhpcy5vbk1hcFdpZGdldFNlbGVjdGVkfVxyXG4gIC8+PC9kaXY+O1xyXG4gIH1cclxufSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFPQTtBQU5BO0FBQ0E7QUFBQTtBQUlBO0FBQ0E7QUFBQTs7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./your-extensions/widgets/add-layers/src/setting/setting.tsx\n");

/***/ }),

/***/ "jimu-core":
/*!****************************!*\
  !*** external "jimu-core" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_core__;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamltdS1jb3JlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiamltdS1jb3JlXCI/YzY5NSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfamltdV9jb3JlX187Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///jimu-core\n");

/***/ }),

/***/ "jimu-for-builder":
/*!***********************************!*\
  !*** external "jimu-for-builder" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_for_builder__;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamltdS1mb3ItYnVpbGRlci5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcImppbXUtZm9yLWJ1aWxkZXJcIj8xY2IyIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X2Zvcl9idWlsZGVyX187Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///jimu-for-builder\n");

/***/ }),

/***/ "jimu-ui/setting-components":
/*!*********************************************!*\
  !*** external "jimu-ui/setting-components" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui_setting_components__;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamltdS11aS9zZXR0aW5nLWNvbXBvbmVudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJqaW11LXVpL3NldHRpbmctY29tcG9uZW50c1wiPzYyYmEiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfdWlfc2V0dGluZ19jb21wb25lbnRzX187Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///jimu-ui/setting-components\n");

/***/ })

/******/ })});;