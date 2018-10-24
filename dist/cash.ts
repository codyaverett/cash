
interface Cash {
  [index: number]: Window & Document & HTMLElement & Element; //FIXME: Quick and dirty way of getting rid of most type errors
  length: number;
  splice ( start: number, deleteCount?: number );
  splice ( start: number, deleteCount: number, ...items: Ele[] );
}

interface CashStatic {
  fn: Cash;
}

type plainObject = { [index: string]: any };
type falsy = undefined | null | false | 0 | '';

type Ele = Window | Document | HTMLElement | Element;
type Selector = falsy | string | Function | HTMLCollection | NodeList | Ele | Ele[] | Cash;
type Comparator = string | Function | Ele | Cash;
type Context = Document | HTMLElement | Element;


const doc = document,
      win = window,
      {filter, indexOf, map, push, reverse, slice, splice} = Array.prototype;

const idRe = /^#[\w-]*$/,
      classRe = /^\.[\w-]*$/,
      htmlRe = /<.+>/,
      tagRe = /^\w+$/;


// @require ./variables.ts

function find ( selector: string, context: Context = doc ) {

  return classRe.test ( selector )
           ? context.getElementsByClassName ( selector.slice ( 1 ) )
           : tagRe.test ( selector )
             ? context.getElementsByTagName ( selector )
             : context.querySelectorAll ( selector );

}


// @require ./find.ts
// @require ./variables.ts

class Cash {

  constructor ( selector?: Selector, context: Context | Cash = doc ) {

    if ( !selector ) return;

    if ( isCash ( selector ) ) return selector;

    let eles: any = selector;

    if ( isString ( selector ) ) {

      const ctx = isCash ( context ) ? context[0] : context;

      eles = idRe.test ( selector )
                ? ( ctx as Document ).getElementById ( selector.slice ( 1 ) )
                : htmlRe.test ( selector )
                  ? parseHTML ( selector )
                  : find ( selector, ctx );

      if ( !eles ) return;

    } else if ( isFunction ( selector ) ) {

      return this.ready ( selector ); //FIXME: `fn.ready` is not included in `core`, but it's actually a core functionality

    }

    if ( eles.nodeType || eles === win ) eles = [eles];

    this.length = eles.length;

    for ( let i = 0, l = this.length; i < l; i++ ) {

      this[i] = eles[i];

    }

  }

  init ( selector?: Selector, context?: Context | Cash ) {

    return new Cash ( selector, context );

  }

}

const cash = Cash.prototype.init as typeof Cash.prototype.init & CashStatic;

cash.fn = cash.prototype = Cash.prototype; // Ensuring that `cash () instanceof cash`

Cash.prototype.length = 0;
Cash.prototype.splice = splice; // Ensuring a cash collection gets printed as array-like in Chrome


// @require core/cash.ts
// @require core/variables.ts

interface Cash {
  get (): Ele[];
  get ( index: number ): Ele;
}

Cash.prototype.get = function ( this: Cash, index?: number ) {

  if ( index === undefined ) return slice.call ( this );

  return this[index < 0 ? index + this.length : index];

};


// @require core/cash.ts
// @require ./get.ts

interface Cash {
  eq ( index: number ): Cash;
}

Cash.prototype.eq = function ( this: Cash, index: number ) {
  return cash ( this.get ( index ) );
};


// @require core/cash.ts
// @require ./eq.ts

interface Cash {
  first (): Cash;
}

Cash.prototype.first = function ( this: Cash ) {
  return this.eq ( 0 );
};


// @require core/cash.ts
// @require ./eq.ts

interface Cash {
  last (): Cash;
}

Cash.prototype.last = function ( this: Cash ) {
  return this.eq ( -1 );
};


// @require core/cash.ts
// @require core/variables.ts

interface Cash {
  map ( callback: Function ): Cash;
}

Cash.prototype.map = function ( this: Cash, callback: Function ) {
  return cash ( map.call ( this, ( ele, i ) => callback.call ( ele, i, ele ) ) );
};


// @require core/cash.ts
// @require core/variables.ts

interface Cash {
  slice ( start?: number, end?: number ): Cash;
}

Cash.prototype.slice = function ( this: Cash ) {
  return cash ( slice.apply ( this, arguments ) );
};


// @require ./cash.ts

const camelCaseRe = /(?:^\w|[A-Z]|\b\w)/g,
      camelCaseWhitespaceRe = /[\s-_]+/g;

function camelCase ( str: string ): string {
  return str.replace ( camelCaseRe, function ( letter, index ) {
    return letter[ !index ? 'toLowerCase' : 'toUpperCase' ]();
  }).replace ( camelCaseWhitespaceRe, '' );
};

interface CashStatic {
  camelCase ( str: string ): string;
}

cash.camelCase = camelCase;


// @require ./cash.ts

function each ( arr: ArrayLike<any>, callback: Function ): void {

  for ( let i = 0, l = arr.length; i < l; i++ ) {

    if ( callback.call ( arr[i], arr[i], i, arr ) === false ) break;

  }

}

interface CashStatic {
  each ( arr: ArrayLike<any>, callback: Function ): void;
}

cash.each = each;


// @require core/cash.ts
// @require core/each.ts

interface Cash {
  each ( callback: Function ): this;
}

Cash.prototype.each = function ( this: Cash, callback: Function ) {
  each ( this, ( ele, i ) => callback.call ( ele, i, ele ) );
  return this;
};


// @require core/cash.ts
// @require collection/each.ts

interface Cash {
  removeProp ( prop: string ): this;
}

Cash.prototype.removeProp = function ( this: Cash, prop: string ) {
  return this.each ( ( i, ele ) => { delete ele[prop] } );
};


// @require ./cash.ts

function extend ( target = this ) {

  let args = arguments,
      length = args.length;

  for ( let i = ( length < 2 ? 0 : 1 ); i < length; i++ ) {
    for ( let key in args[i] ) {
      target[key] = args[i][key];
    }
  }

  return target;

}

interface Cash {
  extend ( target, ...objs: any[] ): this;
}

interface CashStatic {
  extend ( target, ...objs: any[] );
}

Cash.prototype.extend = cash.extend = extend;


// @require ./cash.ts

let guid = 1;

interface CashStatic {
  guid: number;
}

cash.guid = guid;


// @require ./cash.ts

function matches ( ele: HTMLElement, selector: string ): boolean {

  const matches = ele && ( ele.matches || ele['webkitMatchesSelector'] || ele['mozMatchesSelector'] || ele['msMatchesSelector'] || ele['oMatchesSelector'] );

  return !!matches && matches.call ( ele, selector );

}

interface CashStatic {
  matches ( ele: HTMLElement, selector: string ): boolean;
}

cash.matches = matches;


// @require ./cash.ts

function isCash ( x ): x is Cash {
  return x instanceof Cash;
}

function isFunction ( x ): x is Function {
  return typeof x === 'function';
}

function isString ( x ): x is string {
  return typeof x === 'string';
}

function isNumeric ( x ): boolean {
  return !isNaN ( parseFloat ( x ) ) && isFinite ( x );
}

const {isArray} = Array;

interface CashStatic {
  isFunction ( x ): x is Function;
  isString ( x ): x is string;
  isNumeric ( x ): boolean;
  isArray ( x ): x is Array<any>;
}

cash.isFunction = isFunction;
cash.isString = isString;
cash.isNumeric = isNumeric;
cash.isArray = isArray;


// @require core/cash.ts
// @require core/type_checking.ts
// @require collection/each.ts

interface Cash {
  prop ( prop: string );
  prop ( prop: string, value ): this;
  prop ( props: plainObject ): this;
}

Cash.prototype.prop = function ( this: Cash, prop: string | plainObject, value? ) {

  if ( !prop ) return;

  if ( isString ( prop ) ) {

    if ( arguments.length < 2 ) return this[0] && this[0][prop];

    return this.each ( ( i, ele ) => { ele[prop] = value } );

  }

  for ( let key in prop ) {

    this.prop ( key, prop[key] );

  }

  return this;

};


// @require ./matches.ts
// @require ./type_checking.ts

function getCompareFunction ( comparator: Comparator ): Function {

  return isString ( comparator )
           ? ( i, ele ) => matches ( ele, comparator )
           : isFunction ( comparator )
             ? comparator
             : isCash ( comparator )
               ? ( i, ele ) => comparator.is ( ele )
               : ( i, ele ) => ele === comparator;

}


// @require core/cash.ts
// @require core/get_compare_function.ts
// @require core/type_checking.ts
// @require core/variables.ts
// @require collection/get.ts

interface Cash {
  filter ( comparator: Comparator ): Cash;
}

Cash.prototype.filter = function ( this: Cash, comparator?: Comparator ) {

  if ( !comparator ) return cash ();

  const compare = getCompareFunction ( comparator );

  return cash ( filter.call ( this, ( ele, i ) => compare.call ( ele, i, ele ) ) );

};


// @require ./type_checking.ts

const splitValuesRe = /\S+/g;

function getSplitValues ( str: string ) {
  return isString ( str ) ? str.match ( splitValuesRe ) || [] : [];
}


// @require core/cash.ts
// @require core/get_split_values.ts
// @require collection/each.ts

interface Cash {
  hasClass ( classes: string ): boolean;
}

Cash.prototype.hasClass = function ( this: Cash, cls: string ) {

  const classes = getSplitValues ( cls );

  let check = false;

  if ( classes.length ) {
    this.each ( ( i, ele ) => {
      check = ele.classList.contains ( classes[0] );
      return !check;
    });
  }

  return check;

};


// @require core/cash.ts
// @require core/get_split_values.ts
// @require collection/each.ts

interface Cash {
  removeAttr ( attrs: string ): this;
}

Cash.prototype.removeAttr = function ( this: Cash, attr: string ) {

  const attrs = getSplitValues ( attr );

  if ( !attrs.length ) return this;

  return this.each ( ( i, ele ) => {
    each ( attrs, a => {
      ele.removeAttribute ( a );
    });
  });

};


// @require core/cash.ts
// @require core/type_checking.ts
// @require collection/each.ts
// @require ./remove_attr.ts

interface Cash {
  attr ( attrs: string );
  attr ( attrs: string, value ): this;
  attr ( attrs: plainObject ): this;
}

function attr ( this: Cash, attr: string );
function attr ( this: Cash, attr: string, value ): Cash;
function attr ( this: Cash, attr: plainObject ): Cash;
function attr ( this: Cash, attr: string | plainObject, value? ) {

  if ( !attr ) return;

  if ( isString ( attr ) ) {

    if ( arguments.length < 2 ) {

      if ( !this[0] ) return;

      const value = this[0].getAttribute ( attr );

      return value === null ? undefined : value;

    }

    if ( value === null ) return this.removeAttr ( attr );

    return this.each ( ( i, ele ) => { ele.setAttribute ( attr, value ) } );

  }

  for ( let key in attr ) {

    this.attr ( key, attr[key] );

  }

  return this;

}

Cash.prototype.attr = attr;


// @require core/cash.ts
// @require core/each.ts
// @require core/get_split_values.ts
// @require collection/each.ts

interface Cash {
  toggleClass ( classes: string, force?: boolean ): this;
}

Cash.prototype.toggleClass = function ( this: Cash, cls: string, force?: boolean ) {

  const classes = getSplitValues ( cls ),
        isForce = ( force !== undefined );

  if ( !classes.length ) return this;

  return this.each ( ( i, ele ) => {
    each ( classes, c => {
      if ( isForce ) {
        force ? ele.classList.add ( c ) : ele.classList.remove ( c );
      } else {
        ele.classList.toggle ( c );
      }
    });
  });

};


// @require core/cash.ts
// @require ./toggle_class.ts

interface Cash {
  addClass ( classes: string ): this;
}

Cash.prototype.addClass = function ( this: Cash, cls: string ) {
  return this.toggleClass ( cls, true );
};


// @require core/cash.ts
// @require ./attr.ts
// @require ./toggle_class.ts

interface Cash {
  removeClass ( classes?: string ): this;
}

Cash.prototype.removeClass = function ( this: Cash, cls?: string ) {
  return !arguments.length ? this.attr ( 'class', '' ) : this.toggleClass ( cls as string, false );
};


// @optional ./add_class.ts
// @optional ./attr.ts
// @optional ./has_class.ts
// @optional ./prop.ts
// @optional ./remove_attr.ts
// @optional ./remove_class.ts
// @optional ./remove_prop.ts
// @optional ./toggle_class.ts


// @require ./cash.ts

function unique ( arr: any[] ) {
  return arr.filter ( ( item, index, self ) => self.indexOf ( item ) === index );
}

interface CashStatic {
  unique ( arr: any[] ): any[];
}

cash.unique = unique;


// @require core/cash.ts
// @require core/unique.ts
// @require ./get.ts

interface Cash {
  add ( selector: Selector, context?: Context ): Cash;
}

Cash.prototype.add = function ( this: Cash, selector: Selector, context?: Context ) {
  return cash ( unique ( this.get ().concat ( cash ( selector, context ).get () ) ) );
};


// @require core/variables.ts

function computeStyle ( ele: HTMLElement, prop: string, isVariable?: boolean ): undefined | string {

  if ( ele.nodeType !== 1 ) return;

  const style = win.getComputedStyle ( ele, null );

  return prop ? ( isVariable ? style.getPropertyValue ( prop ) : style[prop] ) : style;

}


// @require ./compute_style.ts

function computeStyleInt ( ele: HTMLElement, prop: string ): number {

  return parseInt ( computeStyle ( ele, prop ), 10 ) || 0;

}


const cssVariableRe = /^--/;


// @require ./variables.ts

function isCSSVariable ( prop: string ): boolean {

  return cssVariableRe.test ( prop );

}


// @require core/camel_case.ts
// @require core/cash.ts
// @require core/each.ts
// @require core/variables.ts
// @require ./is_css_variable.ts

const prefixedProps: plainObject = {},
      {style} = doc.createElement ( 'div' ),
      vendorsPrefixes = ['webkit', 'moz', 'ms', 'o'];

function getPrefixedProp ( prop: string, isVariable: boolean = isCSSVariable ( prop ) ): string {

  if ( isVariable ) return prop;

  if ( !prefixedProps[prop] ) {

    const propCC = camelCase ( prop ),
          propUC = `${propCC.charAt ( 0 ).toUpperCase ()}${propCC.slice ( 1 )}`,
          props = ( `${propCC} ${vendorsPrefixes.join ( `${propUC} ` )}${propUC}` ).split ( ' ' );

    each ( props, p => {
      if ( p in style ) {
        prefixedProps[prop] = p;
        return false;
      }
    });

  }

  return prefixedProps[prop];

};

interface CashStatic {
  prefixedProp ( prop: string, isVariable?: boolean ): string;
}

cash.prefixedProp = getPrefixedProp;


// @require core/type_checking.ts
// @require ./is_css_variable.ts

const numericProps = {
  animationIterationCount: true,
  columnCount: true,
  flexGrow: true,
  flexShrink: true,
  fontWeight: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  widows: true,
  zIndex: true
};

function getSuffixedValue ( prop: string, value: number | string, isVariable: boolean = isCSSVariable ( prop ) ): number | string {

  return !isVariable && !numericProps[prop] && isNumeric ( value ) ? `${value}px` : value;

}


// @require core/cash.ts
// @require core/type_checking.ts
// @require collection/each.ts
// @require ./helpers/compute_style.ts
// @require ./helpers/get_prefixed_prop.ts
// @require ./helpers/get_suffixed_value.ts
// @require ./helpers/is_css_variable.ts

interface Cash {
  css ( prop: string );
  css ( prop: string, value ): this;
  css ( props: plainObject ): this;
}

function css ( this: Cash, prop: string );
function css ( this: Cash, prop: string, value ): Cash;
function css ( this: Cash, prop: plainObject ): Cash;
function css ( this: Cash, prop: string | plainObject, value? ) {

  if ( isString ( prop ) ) {

    const isVariable = isCSSVariable ( prop );

    prop = getPrefixedProp ( prop, isVariable );

    if ( arguments.length < 2 ) return this[0] && computeStyle ( this[0], prop, isVariable );

    if ( !prop ) return this;

    value = getSuffixedValue ( prop, value, isVariable );

    return this.each ( ( i, ele ) => {

      if ( ele.nodeType !== 1 ) return;

      if ( isVariable ) {

        ele.style.setProperty ( prop, value );

      } else {

        ele.style[prop as string] = value; //TSC

      }

    });

  }

  for ( let key in prop ) {

    this.css ( key, prop[key] );

  }

  return this;

};

Cash.prototype.css = css;


// @optional ./css.ts


const dataNamespace = '__cashData',
      dataAttributeRe = /^data-(.*)/;


// @require core/cash.ts
// @require ./helpers/variables.ts

function hasData ( ele: HTMLElement ): boolean {
  return dataNamespace in ele;
}

interface CashStatic {
  hasData ( ele: HTMLElement ): boolean;
}

cash.hasData = hasData;


// @require ./variables.ts

function getDataCache ( ele: HTMLElement ): plainObject {
  return ele[dataNamespace] = ( ele[dataNamespace] || {} );
}


// @require attributes/attr.ts
// @require ./get_data_cache.ts

function getData ( ele: HTMLElement, key?: string ): plainObject {

  const cache = getDataCache ( ele );

  if ( key ) {

    if ( !( key in cache ) ) {

      let value = ele.dataset ? ele.dataset[key] || ele.dataset[camelCase ( key )] : cash ( ele ).attr ( `data-${key}` );

      if ( value !== undefined ) {

        try {
          value = JSON.parse ( value );
        } catch ( e ) {}

        cache[key] = value;

      }

    }

    return cache[key];

  }

  return cache;

}


// @require ./variables.ts
// @require ./get_data_cache.ts

function removeData ( ele: HTMLElement, key: string ): void {

  if ( key === undefined ) {

    delete ele[dataNamespace];

  } else {

    delete getDataCache ( ele )[key];

  }

}


// @require ./get_data_cache.ts

function setData ( ele: HTMLElement, key: string, value ): void {
  getDataCache ( ele )[key] = value;
}


// @require core/cash.ts
// @require core/type_checking.ts
// @require collection/each.ts
// @require ./helpers/get_data.ts
// @require ./helpers/set_data.ts
// @require ./helpers/variables.ts

interface Cash {
  data ( name: string );
  data ( name: string, value ): this;
  data ( datas: plainObject ): this;
}

function data ( this: Cash, name: string );
function data ( this: Cash, name: string, value ): Cash;
function data ( this: Cash, name: plainObject ): Cash;
function data ( this: Cash, name: string | plainObject, value? ) {

  if ( !name ) {

    if ( !this[0] ) return;

    each ( this[0].attributes, attr => {

      const match = attr.name.match ( dataAttributeRe );

      if ( !match ) return;

      this.data ( match[1] );

    });

    return getData ( this[0] );

  }

  if ( isString ( name ) ) {

    if ( value === undefined ) return this[0] && getData ( this[0], name );

    return this.each ( ( i, ele ) => setData ( ele, name, value ) );

  }

  for ( let key in name ) {

    this.data ( key, name[key] );

  }

  return this;

}

Cash.prototype.data = data;


// @require core/cash.ts
// @require collection/each.ts
// @require ./helpers/remove_data.ts

interface Cash {
  removeData ( key: string ): this;
}

Cash.prototype.removeData = function ( this: Cash, key: string ) {
  return this.each ( ( i, ele ) => removeData ( ele, key ) );
};


// @optional ./data.ts
// @optional ./remove_data.ts


// @require css/helpers/compute_style_int.ts

function getExtraSpace ( ele: HTMLElement, xAxis?: boolean ): number {
  return computeStyleInt ( ele, `border${ xAxis ? 'Left' : 'Top' }Width` ) + computeStyleInt ( ele, `padding${ xAxis ? 'Left' : 'Top' }` ) + computeStyleInt ( ele, `padding${ xAxis ? 'Right' : 'Bottom' }` ) + computeStyleInt ( ele, `border${ xAxis ? 'Right' : 'Bottom' }Width` );
}


// @require core/cash.ts
// @require core/each.ts
// @require core/variables.ts

interface Cash {
  innerWidth (): number;
  innerHeight (): number;
}

each ( ['Width', 'Height'], ( prop: string ) => {

  Cash.prototype[`inner${prop}`] = function () {

    if ( !this[0] ) return;

    if ( this[0] === win ) return win[`inner${prop}`];

    return this[0][`client${prop}`];

  };

});


// @require core/camel_case.ts
// @require core/cash.ts
// @require core/each.ts
// @require core/variables.ts
// @require css/helpers/compute_style.ts
// @require css/helpers/get_suffixed_value.ts
// @require ./helpers/get_extra_space.ts

interface Cash {
  width (): number;
  width ( value: number | string ): this;
  height (): number;
  height ( value: number | string ): this;
}

each ( ['width', 'height'], ( prop: string, index: number ) => {

  Cash.prototype[prop] = function ( value?: number | string ) {

    if ( !this[0] ) return value === undefined ? undefined : this;

    if ( !arguments.length ) {

      if ( this[0] === win ) return this[0][ camelCase ( `outer-${prop}` )];

      return this[0].getBoundingClientRect ()[prop] - getExtraSpace ( this[0], !index );

    }

    const valueNumber = parseInt ( value as string, 10 );

    return this.each ( ( i, ele ) => {

      if ( ele.nodeType !== 1 ) return;

      const boxSizing = computeStyle ( ele, 'boxSizing' );

      ele.style[prop] = getSuffixedValue ( prop, valueNumber + ( boxSizing === 'border-box' ? getExtraSpace ( ele, !index ) : 0 ) );

    });

  };

});


// @require core/cash.ts
// @require core/each.ts
// @require core/variables.ts
// @require css/helpers/compute_style_int.ts

interface Cash {
  outerWidth ( includeMargins?: boolean ): number;
  outerHeight ( includeMargins?: boolean ): number;
}

each ( ['Width', 'Height'], ( prop, index ) => {

  Cash.prototype[`outer${prop}`] = function ( includeMargins?: boolean ) {

    if ( !this[0] ) return;

    if ( this[0] === win ) return win[`outer${prop}`];

    return this[0][`offset${prop}`] + ( includeMargins ? computeStyleInt ( this[0], `margin${ !index ? 'Left' : 'Top' }` ) + computeStyleInt ( this[0], `margin${ !index ? 'Right' : 'Bottom' }` ) : 0 );

  };

});


// @optional ./inner.ts
// @optional ./normal.ts
// @optional ./outer.ts


function hasNamespaces ( ns1: string[], ns2: string[] ): boolean {

  for ( let i = 0, l = ns2.length; i < l; i++ ) {

    if ( ns1.indexOf ( ns2[i] ) < 0 ) return false;

  }

  return true;

}


// @require core/each.ts

function removeEventListeners ( cache: plainObject, ele: Ele, name: string ): void {

  each ( cache[name], ([ namespaces, callback ]) => { ele.removeEventListener ( name, callback ) } );

  delete cache[name];

}


const eventsNamespace = '__cashEvents',
      eventsNamespacesSeparator = '.';


// @require ./variables.ts

function getEventsCache ( ele: Ele ): plainObject {

  return ele[eventsNamespace] = ( ele[eventsNamespace] || {} );

}


// @require core/guid.ts
// @require events/helpers/get_events_cache.ts

function addEvent ( ele: Ele, name: string, namespaces: string[], callback: Function ): void {

  callback['guid'] = ( callback['guid'] || guid++ );

  const eventCache = getEventsCache ( ele );

  eventCache[name] = ( eventCache[name] || [] );
  eventCache[name].push ([ namespaces, callback ]);

  ele.addEventListener ( name, callback as EventListener ); //TSC

}


// @require ./variables.ts

function parseEventName ( eventName: string ): [string, string[]] {

  const parts = eventName.split ( eventsNamespacesSeparator );

  return [parts[0], parts.slice ( 1 ).sort ()]; // [name, namespace[]]

}


// @require core/guid.ts
// @require ./get_events_cache.ts
// @require ./has_namespaces.ts
// @require ./parse_event_name.ts
// @require ./remove_event_listeners.ts

function removeEvent ( ele: Ele, name?: string, namespaces?: string[], callback?: Function ): void {

  const cache = getEventsCache ( ele );

  if ( !name ) {

    if ( !namespaces || !namespaces.length ) {

      for ( name in cache ) {

        removeEventListeners ( cache, ele, name );

      }

    } else {

      for ( name in cache ) {

        removeEvent ( ele, name, namespaces, callback );

      }

    }

  } else {

    const eventCache = cache[name];

    if ( !eventCache ) return;

    if ( callback ) callback['guid'] = ( callback['guid'] || guid++ );

    cache[name] = eventCache.filter ( ([ ns, cb ]) => {

      if ( ( callback && cb['guid'] !== callback['guid'] ) || !hasNamespaces ( ns, namespaces ) ) return true;

      ele.removeEventListener ( name, cb );

    });

  }

}


// @require core/cash.ts
// @require core/each.ts
// @require collection/each.ts
// @require ./helpers/parse_event_name.ts
// @require ./helpers/remove_event.ts

interface Cash {
  off ( events?: string, callback?: Function ): this;
}

Cash.prototype.off = function ( this: Cash, eventFullName?: string, callback?: Function ) {

  if ( eventFullName === undefined ) {

    this.each ( ( i, ele ) => removeEvent ( ele ) );

  } else {

    each ( getSplitValues ( eventFullName ), eventFullName => {

      const [name, namespaces] = parseEventName ( eventFullName );

      this.each ( ( i, ele ) => removeEvent ( ele, name, namespaces, callback ) );

    });

  }

  return this;

};


// @require core/cash.ts
// @require core/get_split_values.ts
// @require core/guid.ts
// @require core/matches.ts
// @require core/type_checking.ts
// @require collection/each.ts
// @require ./helpers/variables.ts
// @require ./helpers/add_event.ts
// @require ./helpers/has_namespaces.ts
// @require ./helpers/parse_event_name.ts
// @require ./helpers/remove_event.ts

interface Cash {
  on ( events: plainObject ): this;
  on ( events: string, callback: Function, _one?: boolean ): this;
  on ( events: string, selector: string | Function, callback: Function, _one?: boolean ): this;
}

function on ( this: Cash, eventFullName: plainObject ): Cash;
function on ( this: Cash, eventFullName: string, callback: Function, _one?: boolean ): Cash;
function on ( this: Cash, eventFullName: string, selector: string | Function, callback: Function, _one?: boolean ): Cash;
function on ( this: Cash, eventFullName: string | plainObject, selector?: string | Function, callback?: boolean | Function, _one?: boolean ) {

  if ( !isString ( eventFullName ) ) {

    for ( let key in eventFullName ) {

      this.on ( key, selector, eventFullName[key] );

    }

    return this;

  }

  if ( isFunction ( selector ) ) {

    callback = selector;
    selector = '';

  }

  each ( getSplitValues ( eventFullName ), eventFullName => {

    const [name, namespaces] = parseEventName ( eventFullName );

    this.each ( ( i, ele ) => {

      const finalCallback = function ( event ) {

        if ( event.namespace && !hasNamespaces ( namespaces, event.namespace.split ( eventsNamespacesSeparator ) ) ) return;

        let thisArg = ele;

        if ( selector ) {

          let target = event.target;

          while ( !matches ( target, selector as string ) ) { //TSC
            if ( target === ele ) return;
            target = target.parentNode;
            if ( !target ) return;
          }

          thisArg = target;

        }

        event.namespace = ( event.namespace || '' );

        const returnValue = ( callback as Function ).call ( thisArg, event, event.data ); //TSC

        if ( _one ) {

          removeEvent ( ele, name, namespaces, finalCallback );

        }

        if ( returnValue === false ) {

          event.preventDefault ();
          event.stopPropagation ();

        }

      };

      finalCallback['guid'] = callback['guid'] = ( callback['guid'] || guid++ );

      addEvent ( ele, name, namespaces, finalCallback );

    });

  });

  return this;

}

Cash.prototype.on = on;


// @require core/cash.ts
// @require ./on.ts

interface Cash {
  one ( events: plainObject ): this;
  one ( events: string, callback: Function ): this;
  one ( events: string, selector: string | Function, callback: Function ): this;
}

function one ( this: Cash, eventFullName: plainObject ): Cash;
function one ( this: Cash, eventFullName: string, callback: Function ): Cash;
function one ( this: Cash, eventFullName: string, selector: string | Function, callback: Function ): Cash;
function one ( this: Cash, eventFullName: string | plainObject, selector?: string | Function, callback?: Function ) {
  return this.on ( ( eventFullName as string ), selector, callback, true ); //TSC
};

Cash.prototype.one = one;


// @require core/cash.ts
// @require core/variables.ts

interface Cash {
  ready ( callback: Function ): this;
}

Cash.prototype.ready = function ( this: Cash, callback: Function ) {

  const finalCallback = () => callback ( cash );

  if ( doc.readyState !== 'loading' ) {

    setTimeout ( finalCallback );

  } else {

    doc.addEventListener ( 'DOMContentLoaded', finalCallback );

  }

  return this;

};


// @require core/cash.ts
// @require core/type_checking.ts
// @require core/variables.ts
// @require collection/each.ts
// @require ./helpers/parse_event_name.ts
// @require ./helpers/variables.ts

interface Cash {
  trigger ( event: string | Event, data? ): this;
}

Cash.prototype.trigger = function ( this: Cash, eventFullName: string | Event, data? ) {

  let evt: string | Event = eventFullName;

  if ( isString ( eventFullName ) ) {

    const [name, namespaces] = parseEventName ( eventFullName );

    evt = doc.createEvent ( 'HTMLEvents' );
    evt.initEvent ( name, true, true );
    evt['namespace'] = namespaces.join ( eventsNamespacesSeparator );

  }

  evt['data'] = data;

  return this.each ( ( i, ele ) => { ele.dispatchEvent ( evt ) } );

};


// @optional ./off.ts
// @optional ./on.ts
// @optional ./one.ts
// @optional ./ready.ts
// @optional ./trigger.ts


// @require core/each.ts

function getValueSelectMultiple ( ele: HTMLSelectElement ): string[] {

  const values: string[] = [];

  each ( ele.options, option => {
    if ( option.selected && !option.disabled && !option.parentNode.disabled ) {
      values.push ( option.value );
    }
  });

  return values;

}


function getValueSelectSingle ( ele: HTMLSelectElement ): string {

  return ele.selectedIndex < 0 ? null : ele.options[ele.selectedIndex].value;

}


// @require ./get_value_select_single.ts
// @require ./get_value_select_multiple.ts

const selectOneRe = /select-one/i,
      selectMultipleRe = /select-multiple/i;

function getValue ( ele: HTMLElement ): string | string[] {

  const type = ele['type'];

  if ( selectOneRe.test ( type ) ) return getValueSelectSingle ( ele as HTMLSelectElement );

  if ( selectMultipleRe.test ( type ) ) return getValueSelectMultiple ( ele as HTMLSelectElement );

  return ele['value'] || '';

}


const queryEncodeSpaceRe = /%20/g;

function queryEncode ( prop: string, value: string ): string {

  return `&${encodeURIComponent ( prop )}=${encodeURIComponent ( value ).replace ( queryEncodeSpaceRe, '+' )}`;

}


// @require core/cash.ts
// @require core/each.ts
// @require core/type_checking.ts
// @require ./helpers/get_value.ts
// @require ./helpers/query_encode.ts

const skippableRe = /file|reset|submit|button|image/i,
      checkableRe = /radio|checkbox/i;

interface Cash {
  serialize (): string;
}

Cash.prototype.serialize = function ( this: Cash ) {

  let query = '';

  this.each ( ( i, ele ) => {

    each ( ele.elements || [ele], ele => {

      if ( ele.disabled || !ele.name || ele.tagName === 'FIELDSET' ) return;

      if ( skippableRe.test ( ele.type ) ) return;

      if ( checkableRe.test ( ele.type ) && !ele.checked ) return;

      const value = getValue ( ele );

      if ( value === undefined ) return;

      const values = isArray ( value ) ? value : [value];

      each ( values, value => {
        query += queryEncode ( ele.name, value );
      });

    });

  });

  return query.substr ( 1 );

};


// @require core/cash.ts
// @require core/each.ts
// @require core/type_checking.ts
// @require collection/each.ts
// @require ./helpers/get_value.ts

interface Cash {
  val (): string | string[];
  val ( value ): this;
}

function val ( this: Cash ): string | string[];
function val ( this: Cash, value: string ): Cash;
function val ( this: Cash, value?: string ): string | string[] | Cash {

  if ( value === undefined ) return this[0] && getValue ( this[0] );

  return this.each ( ( i, ele ) => {

    const isMultiple = selectMultipleRe.test ( ele.type ),
          eleValue = ( value === null ) ? ( isMultiple ? [] : '' ) : value;

    if ( isMultiple && isArray ( eleValue ) ) {

      each ( ele.options, option => {

        option.selected = eleValue.indexOf ( option.value ) >= 0;

      });

    } else {

      ele.value = eleValue;

    }

  });

}

Cash.prototype.val = val;


// @optional ./serialize.ts
// @optional ./val.ts


// @require core/cash.ts
// @require collection/map.ts

interface Cash {
  clone (): this;
}

Cash.prototype.clone = function ( this: Cash ) {
  return this.map ( ( i, ele ) => ele.cloneNode ( true ) );
};


// @require core/cash.ts
// @require collection/each.ts

interface Cash {
  detach (): this;
}

Cash.prototype.detach = function ( this: Cash ) {
  return this.each ( ( i, ele ) => {
    if ( ele.parentNode ) {
      ele.parentNode.removeChild ( ele )
    }
  });
};


// @require ./cash.ts
// @require ./variables.ts
// @require ./type_checking.ts
// @require collection/get.ts
// @require manipulation/detach.ts

const fragmentRe = /^\s*<(\w+)[^>]*>/,
      singleTagRe = /^\s*<(\w+)\s*\/?>(?:<\/\1>)?\s*$/;

let containers: { [index: string]: HTMLElement };

function initContainers () {

  if ( containers ) return;

  const table = doc.createElement ( 'table' ),
        tr = doc.createElement ( 'tr' );

  containers = {
    '*': doc.createElement ( 'div' ),
    tr: doc.createElement ( 'tbody' ),
    td: tr,
    th: tr,
    thead: table,
    tbody: table,
    tfoot: table,
  };

}

function parseHTML ( html: string ): Ele[] {

  initContainers ();

  if ( !isString ( html ) ) return [];

  if ( singleTagRe.test ( html ) ) return [doc.createElement ( RegExp.$1 )];

  const fragment = fragmentRe.test ( html ) && RegExp.$1,
        container = containers[fragment] || containers['*'];

  container.innerHTML = html;

  return cash ( container.childNodes ).detach ().get ();

}

interface CashStatic {
  parseHTML ( html: string ): Ele[];
}

cash.parseHTML = parseHTML;


// @optional ./camel_case.ts
// @optional ./each.ts
// @optional ./extend.ts
// @optional ./find.ts
// @optional ./get_compare_function.ts
// @optional ./get_split_values.ts
// @optional ./guid.ts
// @optional ./matches.ts
// @optional ./parse_html.ts
// @optional ./unique.ts
// @optional ./variables.ts
// @require ./cash.ts
// @require ./type_checking.ts


// @require core/cash.ts

interface Cash {
  empty (): this;
}

Cash.prototype.empty = function ( this: Cash ) {

  const ele = this[0];

  if ( ele ) {

    while ( ele.firstChild ) {

      ele.removeChild ( ele.firstChild );

    }

  }

  return this;

};


function insertElement ( ele: Node, child: Node, prepend?: boolean ): void {

  if ( prepend ) {

    ele.insertBefore ( child, ele.childNodes[0] );

  } else {

    ele.appendChild ( child );

  }

}


// @require core/each.ts
// @require core/type_checking.ts
// @require ./insert_element.ts

function insertContent ( parent: Cash, child: Cash, prepend?: boolean ): void {

  each ( parent, ( parentEle: HTMLElement, index: number ) => {
    each ( child, ( childEle: HTMLElement ) => {
      insertElement ( parentEle, !index ? childEle : childEle.cloneNode ( true ), prepend );
    });
  });

}


// @require core/cash.ts
// @require core/each.ts
// @require ./helpers/insert_content.ts

interface Cash {
  append ( ...selectors: Selector[] ): this;
}

Cash.prototype.append = function ( this: Cash ) {
  each ( arguments, ( selector: Selector ) => {
    insertContent ( this, cash ( selector ) );
  });
  return this;
};


// @require core/cash.ts
// @require ./helpers/insert_content.ts

interface Cash {
  appendTo ( selector: Selector ): this;
}

Cash.prototype.appendTo = function ( this: Cash, selector: Selector ) {
  insertContent ( cash ( selector ), this );
  return this;
};


// @require core/cash.ts
// @require collection/each.ts

interface Cash {
  html (): string;
  html ( html: string ): this;
}

function html ( this: Cash ): string;
function html ( this: Cash, html: string ): Cash;
function html ( this: Cash, html?: string ): string | Cash {

  if ( html === undefined ) return this[0] && this[0].innerHTML;

  return this.each ( ( i, ele ) => { ele.innerHTML = html } );

}

Cash.prototype.html = html;


// @require core/cash.ts
// @require collection/each.ts

interface Cash {
  insertAfter ( selector: Selector ): this;
}

Cash.prototype.insertAfter = function ( this: Cash, selector: Selector ) {

  cash ( selector ).each ( ( index: number, ele: HTMLElement ) => {

    const parent = ele.parentNode;

    if ( parent ) {
      this.each ( ( i, e ) => {
        parent.insertBefore ( !index ? e : e.cloneNode ( true ), ele.nextSibling );
      });
    }

  });

  return this;

};


// @require core/cash.ts
// @require core/each.ts
// @require core/variables.ts
// @require collection/slice.ts
// @require ./insert_after.ts

interface Cash {
  after ( ...selectors: Selector[] ): this;
}

Cash.prototype.after = function ( this: Cash ) {
  each ( reverse.apply ( arguments ), ( selector: Selector ) => {
    reverse.apply ( cash ( selector ).slice () ).insertAfter ( this );
  });
  return this;
};


// @require core/cash.ts
// @require collection/each.ts

interface Cash {
  insertBefore ( selector: Selector ): this;
}

Cash.prototype.insertBefore = function ( this: Cash, selector: Selector ) {

  cash ( selector ).each ( ( index: number, ele: HTMLElement ) => {

    const parent = ele.parentNode;

    if ( parent ) {
      this.each ( ( i, e ) => {
        parent.insertBefore ( !index ? e : e.cloneNode ( true ), ele );
      });
    }

  });

  return this;

};


// @require core/cash.ts
// @require core/each.ts
// @require ./insert_before.ts

interface Cash {
  before ( ...selectors: Selector[] ): this;
}

Cash.prototype.before = function ( this: Cash ) {
  each ( arguments, ( selector: Selector ) => {
    cash ( selector ).insertBefore ( this );
  });
  return this;
};


// @require core/cash.ts
// @require core/each.ts
// @require ./helpers/insert_content.ts

interface Cash {
  prepend ( ...selectors: Selector[] ): this;
}

Cash.prototype.prepend = function ( this: Cash ) {
  each ( arguments, ( selector: Selector ) => {
    insertContent ( this, cash ( selector ), true );
  });
  return this;
};


// @require core/cash.ts
// @require core/variables.ts
// @require collection/slice.ts
// @require ./helpers/insert_content.ts

interface Cash {
  prependTo ( selector: Selector ): this;
}

Cash.prototype.prependTo = function ( this: Cash, selector: Selector ) {
  insertContent ( cash ( selector ), reverse.apply ( this.slice () ), true );
  return this;
};


// @require core/cash.ts
// @require events/off.ts
// @require ./detach.ts

interface Cash {
  remove (): this;
}

Cash.prototype.remove = function ( this: Cash ) {
  return this.detach ().off ();
};


// @require core/cash.ts
// @require collection/each.ts
// @require collection/slice.ts
// @require ./after.ts
// @require ./remove.ts

interface Cash {
  replaceWith ( selector: Selector ): this;
}

Cash.prototype.replaceWith = function ( this: Cash, selector: Selector ) {

  return this.each ( ( i, ele ) => {

    const parent = ele.parentNode;

    if ( !parent ) return;

    const $eles = i ? cash ( selector ).clone () : cash ( selector );

    if ( !$eles[0] ) {
      this.remove ();
      return false;
    }

    parent.replaceChild ( $eles[0], ele );

    cash ( $eles[0] ).after ( $eles.slice ( 1 ) );

  });

};


// @require core/cash.ts
// @require ./replace_with.ts

interface Cash {
  replaceAll ( selector: Selector ): this;
}

Cash.prototype.replaceAll = function ( this: Cash, selector: Selector ) {
  cash ( selector ).replaceWith ( this );
  return this;
};


// @require core/cash.ts
// @require collection/each.ts

interface Cash {
  text (): string;
  text ( text: string ): this;
}

function text ( this: Cash ): string;
function text ( this: Cash, text: string ): Cash;
function text ( this: Cash, text?: string ): string | Cash {

  if ( text === undefined ) return this[0] ? this[0].textContent : '';

  return this.each ( ( i, ele ) => { ele.textContent = text } );

};

Cash.prototype.text = text;


// @optional ./after.ts
// @optional ./append.ts
// @optional ./append_to.ts
// @optional ./before.ts
// @optional ./clone.ts
// @optional ./detach.ts
// @optional ./empty.ts
// @optional ./html.ts
// @optional ./insert_after.ts
// @optional ./insert_before.ts
// @optional ./prepend.ts
// @optional ./prepend_to.ts
// @optional ./remove.ts
// @optional ./replace_all.ts
// @optional ./replace_with.ts
// @optional ./text.ts


// @require core/cash.ts
// @require core/variables.ts

const docEle = doc.documentElement;

interface Cash {
  offset (): undefined | {
    top: number,
    left: number
  };
}

Cash.prototype.offset = function ( this: Cash ) {

  const ele = this[0];

  if ( !ele ) return;

  const rect = ele.getBoundingClientRect ();

  return {
    top: rect.top + win.pageYOffset - docEle.clientTop,
    left: rect.left + win.pageXOffset - docEle.clientLeft
  };

};


// @require core/cash.ts

interface Cash {
  offsetParent (): Cash;
}

Cash.prototype.offsetParent = function ( this: Cash ) {
  return cash ( this[0] && this[0].offsetParent );
};


// @require core/cash.ts

interface Cash {
  position (): undefined | {
    top: number,
    left: number
  };
}

Cash.prototype.position = function ( this: Cash ) {

  const ele = this[0];

  if ( !ele ) return;

  return {
    left: ele.offsetLeft,
    top: ele.offsetTop
  };

};


// @optional ./offset.ts
// @optional ./offset_parent.ts
// @optional ./position.ts


// @require core/cash.ts
// @require core/unique.ts
// @require collection/each.ts
// @require collection/filter.ts

interface Cash {
  children ( selector?: string ): Cash;
}

Cash.prototype.children = function ( this: Cash, selector?: string ) {

  let result: Ele[] | Cash = [];

  this.each ( ( i, ele ) => { push.apply ( result, ele.children ) } );

  result = cash ( unique ( result ) );

  if ( !selector ) return result;

  return result.filter ( selector );

};


// @require core/cash.ts
// @require core/unique.ts
// @require collection/each.ts

interface Cash {
  contents (): Cash;
}

Cash.prototype.contents = function ( this: Cash ) {

  let result: Ele[] = [];

  this.each ( ( i, ele ) => {

    push.apply ( result, ele.tagName === 'IFRAME' ? [ele.contentDocument] : ele.childNodes );

  });

  return cash ( result.length && unique ( result ) );

};


// @require core/cash.ts
// @require core/unique.ts
// @require core/find.ts
// @require core/variables.ts

interface Cash {
  find ( selector: string ): Cash;
}

Cash.prototype.find = function ( this: Cash, selector: string ) {

  const result: Ele[] = [];

  for ( let i = 0, l = this.length; i < l; i++ ) {
    const found = find ( selector, this[i] );
    if ( found.length ) {
      push.apply ( result, found );
    }
  }

  return cash ( result.length && unique ( result ) );

};


// @require core/cash.ts
// @require core/find.ts
// @require core/type_checking.ts
// @require collection/filter.ts

interface Cash {
  has ( selector: string | HTMLElement ): Cash;
}

Cash.prototype.has = function ( this: Cash, selector: string | HTMLElement ) {

  const comparator = isString ( selector )
                       ? ( i, ele ) => !!find ( selector, ele ).length
                       : ( i, ele ) => ele.contains ( selector );

  return this.filter ( comparator );

};


// @require core/cash.ts
// @require core/get_compare_function.ts
// @require collection/each.ts

interface Cash {
  is ( comparator: Comparator ): boolean;
}

Cash.prototype.is = function ( this: Cash, comparator: Comparator ) {

  if ( !comparator || !this[0] ) return false;

  const compare = getCompareFunction ( comparator );

  let check = false;

  this.each ( ( i, ele ) => {
    check = compare.call ( ele, i, ele );
    return !check;
  });

  return check;

};


// @require core/cash.ts

interface Cash {
  next (): Cash;
}

Cash.prototype.next = function ( this: Cash ) {
  return cash ( this[0] && this[0].nextElementSibling );
};


// @require core/cash.ts
// @require core/get_compare_function.ts
// @require collection/filter.ts

interface Cash {
  not ( comparator: Comparator ): Cash;
}

Cash.prototype.not = function ( this: Cash, comparator: Comparator ) {

  if ( !comparator || !this[0] ) return this;

  const compare = getCompareFunction ( comparator );

  return this.filter ( ( i, ele ) => !compare.call ( ele, i, ele ) );

};


// @require core/cash.ts
// @require core/unique.ts
// @require collection/each.ts

interface Cash {
  parent (): Cash;
}

Cash.prototype.parent = function ( this: Cash ) {

  const result: Ele[] = [];

  this.each ( ( i, ele ) => {
    if ( ele && ele.parentNode ) {
      result.push ( ele.parentNode );
    }
  });

  return cash ( unique ( result ) );

};


// @require core/cash.ts
// @require core/variables.ts
// @require traversal/children.ts
// @require traversal/parent.ts
// @require ./get.ts

interface Cash {
  index ( selector?: Selector ): number;
}

Cash.prototype.index = function ( this: Cash, selector?: Selector ) {

  const child = selector ? cash ( selector )[0] : this[0],
        collection = selector ? this : cash ( child ).parent ().children ();

  return indexOf.call ( collection, child );

};


// @optional ./add.ts
// @optional ./each.ts
// @optional ./eq.ts
// @optional ./filter.ts
// @optional ./first.ts
// @optional ./get.ts
// @optional ./indexFn.ts
// @optional ./last.ts
// @optional ./map.ts
// @optional ./slice.ts


// @require core/cash.ts
// @require collection/filter.ts
// @require ./is.ts
// @require ./parent.ts

interface Cash {
  closest ( selector: string ): Cash;
}

Cash.prototype.closest = function ( this: Cash, selector: string ) {

  if ( !selector || !this[0] ) return cash ();

  if ( this.is ( selector ) ) return this.filter ( selector );

  return this.parent ().closest ( selector );

};


// @require core/cash.ts
// @require core/matches.ts
// @require core/unique.ts
// @require core/variables.ts
// @require collection/each.ts

interface Cash {
  parents ( selector?: string ): Cash;
}

Cash.prototype.parents = function ( this: Cash, selector?: string ) {

  const result: Ele[] = [];

  let last;

  this.each ( ( i, ele ) => {

    last = ele;

    while ( last && last.parentNode && last !== doc.body.parentNode ) {

      last = last.parentNode;

      if ( !selector || ( selector && matches ( last, selector ) ) ) {
        result.push ( last );
      }

    }

  });

  return cash ( unique ( result ) );

};


// @require core/cash.ts

interface Cash {
  prev (): Cash;
}

Cash.prototype.prev = function ( this: Cash ) {
  return cash ( this[0] && this[0].previousElementSibling );
};


// @require core/cash.ts
// @require collection/filter.ts
// @require ./children.ts
// @require ./parent.ts

interface Cash {
  siblings (): Cash;
}

Cash.prototype.siblings = function ( this: Cash ) {

  const ele = this[0];

  return this.parent ().children ().filter ( ( i, child ) => child !== ele );

};


// @optional ./children.ts
// @optional ./closest.ts
// @optional ./contents.ts
// @optional ./find.ts
// @optional ./has.ts
// @optional ./is.ts
// @optional ./next.ts
// @optional ./not.ts
// @optional ./parent.ts
// @optional ./parents.ts
// @optional ./prev.ts
// @optional ./siblings.ts


// @optional attributes/index.ts
// @optional collection/index.ts
// @optional css/index.ts
// @optional data/index.ts
// @optional dimensions/index.ts
// @optional events/index.ts
// @optional forms/index.ts
// @optional manipulation/index.ts
// @optional offset/index.ts
// @optional traversal/index.ts
// @require core/index.ts


// @priority -100
// @require ./cash.ts
// @require ./variables.ts

if ( typeof exports !== 'undefined' ) { // Node.js

  module.exports = cash;

} else { // Browser

  win['cash'] = win['$'] = cash;

}