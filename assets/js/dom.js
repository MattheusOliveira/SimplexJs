(function IIFE(){
'use strict';
function DOM(element){
	if(!(this instanceof DOM))
		return new DOM(element);
   this.elements = document.querySelectorAll(element);
}

DOM.prototype.is = function(obj){
	return Object.prototype.toString.call(obj);
}


DOM.prototype.isObject = function(obj){
    return DOM.prototype.is(obj) === '[object Object]'
}
DOM.prototype.isArray = function(obj){
	return DOM.prototype.is(obj) === '[object Array]';
}
DOM.prototype.isFunction = function(obj){
	return DOM.prototype.is(obj) === '[object Function]'
}

DOM.prototype.isNumber = function(obj){
	return DOM.prototype.is(obj) === '[object Number]'
}

DOM.prototype.isString = function(obj){
	return DOM.prototype.is(obj) === '[object String]'
}

DOM.prototype.isBoolean = function(obj){
	return DOM.prototype.is(obj) === '[object Boolean]'
}
DOM.prototype.isNull = function(obj){
	if (DOM.prototype.is(obj) === '[object Null]')
		return true;
	else if(DOM.prototype.is(obj) === '[object Undefined]')
		return true;
	else{
		return false;
	}
}

DOM.prototype.on = function on(eventType, callback){ // extendendo a função principal e utilizando a função on
  	return Array.prototype.forEach.call(this.elements, function(e){
		e.addEventListener(eventType,callback,false);
  });


}
DOM.prototype.of = function of(eventType,callback){
	return Array.prototype.forEach.call(this.elements, function(e){
		e.removeEventListener(eventType,callback,false);
	})
}

DOM.prototype.get = function get(index){
	if(!index)
	return this.elements[0];
  return this.elements[index];
}

DOM.prototype.getAll = function getAll(index){
	return this.elements;
}


DOM.prototype.forEach =function forEach(){
  	return Array.prototype.forEach.apply(this.elements, arguments);
}

DOM.prototype.map = function(){
	return Array.prototype.map.apply(this.elements, function(e){
	})
}

DOM.prototype.filter =function(){
	return Array.prototype.filter.call(this.elements, function(e){
	})
}
DOM.prototype.reduceRight = function(){
	return Array.prototype.reduceRight.call(this.elements, function(e, atual){
	})
}

DOM.prototype.some = function(){
	return Array.prototype.some.call(this.elements, function(e){
	})
}

DOM.prototype.every = function(){
	return Array.prototype.every.call(this.elements, function(e){
	});
}
	window.DOM = DOM;
})();
