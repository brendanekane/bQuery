/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);
let documentLoaded = false;
let eventQueueue = [];

document.addEventListener("DOMContentLoaded", () => {
  documentLoaded = true;
  eventQueueue.forEach ((el) => el());
});



window.$b = function (arg) {
  let DOMArg;
  if (arg instanceof HTMLElement) {
    DOMArg = [arg];
    return new DOMNodeCollection(DOMArg);
  } else if (typeof arg === 'function') {

    if (documentLoaded) {
      arg();
    }else{
      eventQueueue.push(arg);
    }

  } else {
    const elList = document.querySelectorAll(arg);
    DOMArg = Array.from(elList);
    return new DOMNodeCollection(DOMArg);
  }
};

$b.extend = function (firstObj, ...additionalObjs) {
  Object.assign(firstObj, ...additionalObjs);
  return firstObj;
};

$b.ajax = function (options) {
  const defaults = {
    url: '',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: () => {},
    error: () => {},
    data: {}
  };

  $b.extend(defaults, options);


  const xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url);

  xhr.onload = function () {
    if (xhr.status == '200') {
      options.success(JSON.parse(xhr.response));
    } else {
      options.error(JSON.parse(xhr.response));
    }

  };
  xhr.send(options.data)

};


$b( ()=> console.log('loaded document') );


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(arr) {
    this.arr = arr;
  }

  html(str) {
    if (typeof str === 'string') {
      this.arr.forEach(el => el.innerHTML = str);
    } else if (this.arr.length < 0) {
      return this.arr[0].innerHTML;
    }
  }

  empty() {
    this.html('');
  }

  append(arg) {
    if (typeof arg === 'string') {
      this.arr.forEach (el => el.innerHTML += arg);
    } else if (arg instanceof HTMLElement) {
      this.arr.forEach(el => el.innerHTML += arg.outerHTML);
    } else {
      this.arr.forEach (el => {
        arg.arr.forEach (ael => el.innerHTML += ael.outerHTML);
      });
    }
  }
  attr(arg, optionalArg) {
    if (!optionalArg) {
      if (typeof arg === 'string') {
        return this.arr[0].getAttribute(arg);
      }else {
        const keys = Object.keys(arg);
        for(let i = 0; i < keys.length; i++){
          this.arr.forEach(el => el.setAttribute(keys[i], arg.keys[i]));
        }
      }
    } else {
      this.arr.forEach(el => el.setAttribute(arg, optionalArg));
    }
  }

  addClass(classesToAdd) {
    this.arr.forEach (el => {
      const prevClasses = el.getAttribute('class') ? (el.getAttribute('class') + " ") : "";
      el.setAttribute('class', prevClasses + classesToAdd);
    });
  }

  removeClass(classesToRemove){
    if(!classesToRemove) this.arr.forEach(el => el.removeAttribute('class'));
    this.arr.forEach(el =>{
      if(el.getAttribute('class') ) {
        const currentClassArr = el.getAttribute('class').split(' ');
        classesToRemove.split(' ').forEach(clas => {
          const indexToDelete = currentClassArr.indexOf(clas);
          if (indexToDelete !== -1) {
            currentClassArr.splice(indexToDelete, 1);
          }
        });
        currentClassArr.length ?
        el.setAttribute('class', currentClassArr.join(' ')) :
        el.removeAttribute('class');
      }else {
        return;
      }
    });
  }

  children() {
    let results = [];
    this.arr.forEach (el => {
     results = results.concat(Array.from(el.children));
    });
    return new DOMNodeCollection(results);
  }

  parent(){
    let results = [];
    this.arr.forEach (el => {
      if(!results.includes(el.parentNode)){
        results.push(el.parentNode);
      }
    });
    return new DOMNodeCollection(results);
  }

  find(selector){
    let result = [];
    this.arr.forEach (el => {
      result = result.concat(Array.from(el.querySelectorAll(selector)));
    });
    return new DOMNodeCollection(result);
  }

  remove(){
    this.arr.forEach(el => {
      el.outerHTML = '';
    });
    this.arr = [];
  }

  on(trigger, callback) {
    this.arr.forEach(el => {
      el.addEventListener(trigger, callback);
      if (el.eventTriggers){
        el.eventTriggers[trigger] = callback;
      } else{
        el.eventTriggers = {[trigger]: callback};
      }
    });
  }

  off(trigger) {
    this.arr.forEach( el => {
      const callback = el.eventTriggers[trigger];
      el.removeEventListener(trigger, callback);
      delete el.eventTriggers[trigger];
    });
  }

}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);