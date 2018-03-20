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
