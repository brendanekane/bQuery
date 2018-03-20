const DOMNodeCollection = require('./dom_node_collection.js');
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
