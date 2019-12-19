/**
 * Vue Currency Input 1.14.3
 * (c) 2019 Matthias Stiller
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = global || self, factory(global.VueCurrencyInput = {}, global.Vue));
}(this, (function (exports, Vue) { 'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

  var createCurrencyFormat = function (numberFormat) {
    var ps = numberFormat.format(123456);
    var ns = numberFormat.format(-1);
    var hasFractionDigits = (ps.match(/0/g) || []).length > 0;
    var decimalSymbol = hasFractionDigits ? ps.substr(ps.indexOf('6') + 1, 1) : null;
    var prefix = ps.substring(0, ps.indexOf('1'));
    var negativePrefix = ns.substring(0, ns.indexOf('1'));
    var suffix = ps.substring(ps.lastIndexOf(hasFractionDigits ? '0' : '6') + 1);
    var groupingSymbol = ps.substr(ps.indexOf('3') + 1, 1);
    return {
      prefix: prefix,
      negativePrefix: negativePrefix,
      suffix: suffix,
      groupingSymbol: groupingSymbol,
      decimalSymbol: decimalSymbol
    }
  };
  function createCurrencyFormat$1 (ref) {
    var locale = ref.locale;
    var currency = ref.currency;
    var precision = ref.precision;
    var autoDecimalMode = ref.autoDecimalMode;
    var valueAsInteger = ref.valueAsInteger;
    var currencyFormat;
    var minimumFractionDigits = 2;
    var maximumFractionDigits = 2;
    if (typeof precision === 'number') {
      minimumFractionDigits = maximumFractionDigits = precision;
    } else if (typeof precision === 'object' && !autoDecimalMode && !valueAsInteger) {
      minimumFractionDigits = precision.min || 0;
      maximumFractionDigits = precision.max !== undefined ? precision.max : 20;
    }
    if (currency == null) {
      currencyFormat = createCurrencyFormat(new Intl.NumberFormat(locale, { minimumFractionDigits: 1 }));
    } else if (typeof currency === 'object') {
      currencyFormat = Object.assign({}, createCurrencyFormat(new Intl.NumberFormat(locale, { minimumFractionDigits: 1 })),
        {prefix: currency.prefix || '',
        negativePrefix: ("-" + (currency.prefix || '')),
        suffix: currency.suffix || ''});
    } else {
      var numberFormat = new Intl.NumberFormat(locale, { currency: currency, style: 'currency' });
      currencyFormat = createCurrencyFormat(numberFormat);
      if (currencyFormat.decimalSymbol == null) {
        minimumFractionDigits = maximumFractionDigits = 0;
      } else if (precision === undefined) {
        minimumFractionDigits = numberFormat.resolvedOptions().minimumFractionDigits;
        maximumFractionDigits = numberFormat.resolvedOptions().maximumFractionDigits;
      }
    }
    return Object.assign({}, currencyFormat,
      {minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: maximumFractionDigits})
  }

  var removeLeadingZeros = function (str) { return str.replace(/^0+(0$|[^0])/, '$1'); };
  var onlyDigits = function (str) { return str.replace(/\D+/g, ''); };
  var count = function (str, search) { return (str.match(new RegExp(("\\" + search), 'g')) || []).length; };
  var endsWith = function (str, search) {
    return str.substring(str.length - search.length, str.length) === search
  };
  var startsWith = function (str, search) {
    return str.substring(0, search.length) === search
  };
  var stripCurrencySymbolAndMinusSign = function (str, ref) {
    var prefix = ref.prefix;
    var suffix = ref.suffix;
    var value = str.replace(prefix, '').replace(suffix, '');
    return {
      value: value.replace('-', ''),
      negative: startsWith(value, '-')
    }
  };
  var isNumber = function (str) { return str.match(/^-?\d+(\.\d+)?$/); };

  var toInteger = function (number, valueAsInteger, fractionDigits) {
    return valueAsInteger ? Number(number.toFixed(fractionDigits).split('.').join('')) : number
  };
  var toFloat = function (number, valueAsInteger, fractionDigits) {
    return valueAsInteger ? number / Math.pow(10, fractionDigits) : number
  };

  function parse (str, currencyFormat, valueAsInteger) {
    if ( valueAsInteger === void 0 ) valueAsInteger = false;
    if (typeof str === 'string') {
      if (isNumber(str)) {
        return toInteger(Number(str), valueAsInteger, currencyFormat.minimumFractionDigits)
      }
      var ref = stripCurrencySymbolAndMinusSign(str, currencyFormat);
      var value = ref.value;
      var negative = ref.negative;
      var numberParts = value.split(currencyFormat.decimalSymbol);
      if (numberParts.length > 2) {
        return null
      }
      var integer = numberParts[0].replace(new RegExp(("\\" + (currencyFormat.groupingSymbol)), 'g'), '');
      if (integer.length && !integer.match(/^\d+$/g)) {
        return null
      }
      var number = integer;
      if (numberParts.length === 2) {
        var fraction = numberParts[1];
        if (fraction.length && !fraction.match(/^\d+$/g)) {
          return null
        }
        number += "." + fraction;
      }
      if (number) {
        if (negative) {
          number = "-" + number;
        }
        return toInteger(Number(number), valueAsInteger, currencyFormat.minimumFractionDigits)
      }
    }
    return null
  }

  var parseCurrency = function (formattedValue, options) { return parse(formattedValue, createCurrencyFormat$1(options), options.valueAsInteger); };

  var DEFAULT_OPTIONS = {
    locale: undefined,
    currency: 'EUR',
    valueAsInteger: false,
    distractionFree: true,
    precision: undefined,
    autoDecimalMode: false,
    min: null,
    max: null
  };

  var setCaretPosition = function (el, position) { return el.setSelectionRange(position, position); };
  var getCaretPositionAfterFormat = function (newValue, inputtedValue, caretPosition, currencyFormat, options) {
    var prefix = currencyFormat.prefix;
    var suffix = currencyFormat.suffix;
    var decimalSymbol = currencyFormat.decimalSymbol;
    var maximumFractionDigits = currencyFormat.maximumFractionDigits;
    var groupingSymbol = currencyFormat.groupingSymbol;
    var decimalSymbolPosition = inputtedValue.indexOf(decimalSymbol) + 1;
    var caretPositionFromLeft = inputtedValue.length - caretPosition;
    if (Math.abs(newValue.length - inputtedValue.length) > 1 && caretPosition <= decimalSymbolPosition) {
      return newValue.indexOf(decimalSymbol) + 1
    } else if (newValue.substr(caretPosition, 1) === groupingSymbol && count(newValue, groupingSymbol) === count(inputtedValue, groupingSymbol) + 1) {
      return newValue.length - caretPositionFromLeft - 1
    } else {
      if (!options.autoDecimalMode && decimalSymbolPosition !== 0 && caretPosition > decimalSymbolPosition) {
        if (onlyDigits(inputtedValue.substr(decimalSymbolPosition)).length - 1 === maximumFractionDigits) {
          caretPositionFromLeft -= 1;
        }
      }
      return options.distractionFree.hideCurrencySymbol
        ? newValue.length - caretPositionFromLeft
        : Math.max(newValue.length - Math.max(caretPositionFromLeft, suffix.length), prefix.length === 0 ? 0 : prefix.length + 1)
    }
  };
  var getDistractionFreeCaretPosition = function (formatConfig, options, value, caretPosition) {
    var result = caretPosition;
    if (options.distractionFree.hideCurrencySymbol) {
      result -= formatConfig.prefix.length;
    }
    if (options.distractionFree.hideGroupingSymbol) {
      result -= count(value.substring(0, caretPosition), formatConfig.groupingSymbol);
    }
    return Math.max(0, result)
  };

  var isValidInteger = function (integer, groupingSymbol) { return integer.match(new RegExp(("^-?(0|[1-9]\\d{0,2}(\\" + groupingSymbol + "?\\d{3})*)$"))); };
  var isFractionIncomplete = function (value, ref) {
    var decimalSymbol = ref.decimalSymbol;
    var groupingSymbol = ref.groupingSymbol;
    var numberParts = value.split(decimalSymbol);
    return endsWith(value, decimalSymbol) && numberParts.length === 2 && isValidInteger(numberParts[0], groupingSymbol)
  };
  var checkIncompleteValue = function (value, negative, previousConformedValue, formatConfig) {
    var prefix = formatConfig.prefix;
    var negativePrefix = formatConfig.negativePrefix;
    var suffix = formatConfig.suffix;
    var decimalSymbol = formatConfig.decimalSymbol;
    var maximumFractionDigits = formatConfig.maximumFractionDigits;
    if (value === '' && negative && previousConformedValue !== negativePrefix) {
      return ("" + negativePrefix + suffix)
    } else if (maximumFractionDigits > 0) {
      if (isFractionIncomplete(value, formatConfig)) {
        return ("" + (negative ? negativePrefix : prefix) + value + suffix)
      } else if (startsWith(value, decimalSymbol)) {
        return ((negative ? negativePrefix : prefix) + "0" + decimalSymbol + ((onlyDigits(value.substr(1)).substr(0, maximumFractionDigits))) + suffix)
      }
    }
    return null
  };
  var getAutoDecimalModeConformedValue = function (value, previousConformedValue, ref) {
    var minimumFractionDigits = ref.minimumFractionDigits;
    if (value === '') {
      return { conformedValue: '' }
    } else {
      var negative = startsWith(value, '-');
      var conformedValue = value === '-' ? Number(-0) : Number(("" + (negative ? '-' : '') + (removeLeadingZeros(onlyDigits(value))))) / Math.pow(10, minimumFractionDigits);
      return {
        conformedValue: conformedValue,
        fractionDigits: conformedValue.toFixed(minimumFractionDigits).slice(-minimumFractionDigits)
      }
    }
  };
  var isFractionInvalid = function (fraction, numberOfFractionDigits) { return fraction.length > 0 && numberOfFractionDigits === 0; };
  function conformToMask (str, formatConfig, options, previousConformedValue) {
    if ( previousConformedValue === void 0 ) previousConformedValue = '';
    if (typeof str === 'string') {
      if (formatConfig.minimumFractionDigits > 0 && options.autoDecimalMode) {
        return getAutoDecimalModeConformedValue(str, previousConformedValue, formatConfig)
      }
      var ref = stripCurrencySymbolAndMinusSign(str, formatConfig);
      var value = ref.value;
      var negative = ref.negative;
      var incompleteValue = checkIncompleteValue(value, negative, previousConformedValue, formatConfig);
      if (incompleteValue != null) {
        return { conformedValue: incompleteValue }
      }
      var ref$1 = value.split(formatConfig.decimalSymbol);
      var integer = ref$1[0];
      var fraction = ref$1.slice(1);
      var integerDigits = removeLeadingZeros(onlyDigits(integer));
      var fractionDigits = onlyDigits(fraction.join('')).substr(0, formatConfig.maximumFractionDigits);
      if (isFractionInvalid(fraction, fractionDigits.length)) {
        return { conformedValue: previousConformedValue }
      }
      var number = integerDigits;
      if (negative) {
        number = "-" + number;
      }
      if (isNumber(number)) {
        return {
          conformedValue: Number((number + "." + fractionDigits)),
          fractionDigits: fractionDigits
        }
      } else if (number === '-' && (previousConformedValue === str.slice(0, -1) || previousConformedValue !== formatConfig.negativePrefix)) {
        return { conformedValue: previousConformedValue }
      } else {
        return { conformedValue: '' }
      }
    }
    return { conformedValue: previousConformedValue }
  }

  function dispatchEvent (el, eventName, data) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, true, true, data);
    el.dispatchEvent(event);
  }

  var equal = function (a, b) {
    if (a === b) {
      return true
    }
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
      return false
    }
    var keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) {
      return false
    }
    if (!keys.every(Object.prototype.hasOwnProperty.bind(b))) {
      return false
    }
    return keys.every(function (key) { return equal(a[key], b[key]); })
  };

  var init = function (el, optionsFromBinding, ref, ref$1) {
    var inputEvent = ref.inputEvent;
    var $CI_DEFAULT_OPTIONS = ref$1.$CI_DEFAULT_OPTIONS;
    var inputElement = el.tagName.toLowerCase() === 'input' ? el : el.querySelector('input');
    if (!inputElement) {
      throw new Error('No input element found')
    }
    var options = Object.assign({}, ($CI_DEFAULT_OPTIONS || DEFAULT_OPTIONS), optionsFromBinding);
    var min = options.min;
    var max = options.max;
    var distractionFree = options.distractionFree;
    var autoDecimalMode = options.autoDecimalMode;
    if (typeof distractionFree === 'boolean') {
      options.distractionFree = {
        hideCurrencySymbol: distractionFree,
        hideNegligibleDecimalDigits: distractionFree,
        hideGroupingSymbol: distractionFree
      };
    }
    if (autoDecimalMode) {
      options.distractionFree.hideNegligibleDecimalDigits = false;
    }
    if (min != null && max != null && min > max) {
      throw new Error('Invalid value range')
    }
    var currencyFormat = createCurrencyFormat$1(options);
    inputElement.$ci = Object.assign({}, inputElement.$ci || {},
      {options: options,
      inputEvent: inputEvent,
      currencyFormat: currencyFormat});
    return inputElement
  };
  var applyFixedFractionFormat = function (el, value) {
    if (value != null) {
      var ref = el.$ci.options;
      var min = ref.min;
      var max = ref.max;
      var locale = ref.locale;
      if (min != null && value < min) {
        value = min;
      }
      if (max != null && value > max) {
        value = max;
      }
      var ref$1 = el.$ci.currencyFormat;
      var maximumFractionDigits = ref$1.maximumFractionDigits;
      var minimumFractionDigits = ref$1.minimumFractionDigits;
      value = new Intl.NumberFormat(locale, { minimumFractionDigits: minimumFractionDigits, maximumFractionDigits: maximumFractionDigits }).format(value);
    }
    format(el, value);
    if (!el.$ci.inputEvent) {
      dispatchEvent(el, 'input');
    }
  };
  var updateInputValue = function (el, value, hideNegligibleDecimalDigits) {
    if ( hideNegligibleDecimalDigits === void 0 ) hideNegligibleDecimalDigits = false;
    if (value != null) {
      var ref = el.$ci;
      var focus = ref.focus;
      var options = ref.options;
      var currencyFormat = ref.currencyFormat;
      var previousConformedValue = ref.previousConformedValue;
      var ref$1 = options.distractionFree;
      var hideCurrencySymbol = ref$1.hideCurrencySymbol;
      var hideGroupingSymbol = ref$1.hideGroupingSymbol;
      var formatConfig = Object.assign({}, currencyFormat);
      if (focus && hideCurrencySymbol) {
        formatConfig.prefix = '';
        formatConfig.negativePrefix = '-';
        formatConfig.suffix = '';
      }
      var ref$2 = conformToMask(value, formatConfig, options, previousConformedValue);
      var conformedValue = ref$2.conformedValue;
      var fractionDigits = ref$2.fractionDigits;
      if (typeof conformedValue === 'number') {
        var formattedValue = new Intl.NumberFormat(options.locale, {
          useGrouping: !(focus && hideGroupingSymbol),
          minimumFractionDigits: hideNegligibleDecimalDigits ? fractionDigits.replace(/0+$/, '').length : Math.min(formatConfig.minimumFractionDigits, fractionDigits.length),
          maximumFractionDigits: formatConfig.maximumFractionDigits
        }).format(Math.abs(conformedValue));
        var isNegativeZero = conformedValue === 0 && (1 / conformedValue < 0);
        el.value = "" + (isNegativeZero || conformedValue < 0 ? formatConfig.negativePrefix : formatConfig.prefix) + formattedValue + (formatConfig.suffix);
        el.$ci.numberValue = conformedValue;
      } else {
        el.value = conformedValue;
        el.$ci.numberValue = parse(el.value, formatConfig, false);
      }
    } else {
      el.value = el.$ci.numberValue = null;
    }
    el.$ci.previousConformedValue = el.value;
  };
  var format = function (el, value) {
    updateInputValue(el, value);
    var ref = el.$ci;
    var numberValue = ref.numberValue;
    var currencyFormat = ref.currencyFormat;
    var options = ref.options;
    var inputEvent = ref.inputEvent;
    if (numberValue != null) {
      numberValue = toInteger(numberValue, options.valueAsInteger, currencyFormat.maximumFractionDigits);
    }
    if (inputEvent) {
      dispatchEvent(el, inputEvent, { numberValue: numberValue });
    }
  };
  var addEventListener = function (el) {
    el.addEventListener('input', function () {
      var value = el.value;
      var selectionStart = el.selectionStart;
      var el_$ci = el.$ci;
      var currencyFormat = el_$ci.currencyFormat;
      var options = el_$ci.options;
      format(el, value);
      if (el.$ci.focus) {
        setCaretPosition(el, getCaretPositionAfterFormat(el.value, value, selectionStart, currencyFormat, options));
      }
    }, { capture: true });
    el.addEventListener('format', function (e) {
      var ref = el.$ci;
      var currencyFormat = ref.currencyFormat;
      var options = ref.options;
      var numberValue = ref.numberValue;
      var value = toFloat(e.detail.value, options.valueAsInteger, currencyFormat.maximumFractionDigits);
      if (value !== numberValue) {
        applyFixedFractionFormat(el, value);
      }
    });
    el.addEventListener('focus', function () {
      el.$ci.focus = true;
      var ref = el.$ci.options.distractionFree;
      var hideCurrencySymbol = ref.hideCurrencySymbol;
      var hideGroupingSymbol = ref.hideGroupingSymbol;
      var hideNegligibleDecimalDigits = ref.hideNegligibleDecimalDigits;
      if (hideCurrencySymbol || hideGroupingSymbol || hideNegligibleDecimalDigits) {
        setTimeout(function () {
          var value = el.value;
          var selectionStart = el.selectionStart;
          var selectionEnd = el.selectionEnd;
          updateInputValue(el, el.value, hideNegligibleDecimalDigits);
          if (Math.abs(selectionStart - selectionEnd) > 0) {
            el.setSelectionRange(0, el.value.length);
          } else {
            setCaretPosition(el, getDistractionFreeCaretPosition(el.$ci.currencyFormat, el.$ci.options, value, selectionStart));
          }
        });
      }
    });
    el.addEventListener('blur', function () {
      el.$ci.focus = false;
      applyFixedFractionFormat(el, el.$ci.numberValue);
    });
  };
  var directive = {
    bind: function bind (el, ref, ref$1) {
      var options = ref.value;
      var modifiers = ref.modifiers;
      var context = ref$1.context;
      var inputElement = init(el, options, modifiers, context);
      Vue.nextTick(function () {
        var value = inputElement.value;
        var inputElement_$ci = inputElement.$ci;
        var currencyFormat = inputElement_$ci.currencyFormat;
        var options = inputElement_$ci.options;
        if (value) {
          applyFixedFractionFormat(inputElement, toFloat(parse(value, currencyFormat), options.valueAsInteger, currencyFormat.maximumFractionDigits));
        }
      });
      addEventListener(inputElement);
    },
    componentUpdated: function componentUpdated (el, ref, ref$1) {
      var value = ref.value;
      var oldValue = ref.oldValue;
      var modifiers = ref.modifiers;
      var context = ref$1.context;
      if (!equal(value, oldValue)) {
        var inputElement = init(el, value, modifiers, context);
        applyFixedFractionFormat(inputElement, inputElement.$ci.numberValue);
      }
    }
  };

  function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }
  var component = {
    render: function render (h) {
      return h('input', {
        domProps: {
          value: this.formattedValue
        },
        directives: [{
          name: 'currency',
          value: this.options,
          modifiers: {
            inputEvent: 'format-complete'
          }
        }],
        on: this.listeners()
      })
    },
    directives: {
      currency: directive
    },
    name: 'CurrencyInput',
    props: {
      value: {
        type: Number,
        default: null
      },
      locale: {
        type: String,
        default: undefined
      },
      currency: {
        type: [String, Object],
        default: undefined
      },
      distractionFree: {
        type: [Boolean, Object],
        default: undefined
      },
      precision: {
        type: [Number, Object],
        default: undefined
      },
      autoDecimalMode: {
        type: Boolean,
        default: undefined
      },
      valueAsInteger: {
        type: Boolean,
        default: undefined
      },
      min: {
        type: Number,
        default: undefined
      },
      max: {
        type: Number,
        default: undefined
      }
    },
    data: function data () {
      return {
        formattedValue: this.value
      }
    },
    computed: {
      options: function options () {
        var this$1 = this;
        var options = Object.assign({}, this.$CI_DEFAULT_OPTIONS || DEFAULT_OPTIONS);
        Object.keys(DEFAULT_OPTIONS).forEach(function (key) {
          if (this$1[key] !== undefined) {
            options[key] = this$1[key];
          }
        });
        return options
      }
    },
    watch: {
      value: 'setValue'
    },
    methods: {
      setValue: function setValue (value) {
        dispatchEvent(this.$el, 'format', { value: value });
      },
      listeners: function listeners () {
        var this$1 = this;
        var ref = this.$listeners;
        var input = ref.input;
        var rest = objectWithoutProperties( ref, ["input"] );
        var listeners = rest;
        return Object.assign({}, listeners,
          {'format-complete': function (ref) {
            var detail = ref.detail;
            this$1.$emit('input', detail.numberValue);
            this$1.formattedValue = this$1.$el.value;
          }})
      }
    }
  };

  var plugin = {
    install: function install (Vue, ref) {
      if ( ref === void 0 ) ref = {};
      var componentName = ref.componentName; if ( componentName === void 0 ) componentName = component.name;
      var directiveName = ref.directiveName; if ( directiveName === void 0 ) directiveName = 'currency';
      var globalOptions = ref.globalOptions; if ( globalOptions === void 0 ) globalOptions = {};
      var defaultOptions = Object.assign({}, DEFAULT_OPTIONS, globalOptions);
      Vue.prototype.$CI_DEFAULT_OPTIONS = defaultOptions;
      Vue.component(componentName, component);
      Vue.directive(directiveName, directive);
      Vue.prototype.$parseCurrency = function (str, options) {
        if ( options === void 0 ) options = defaultOptions;
        return parseCurrency(str, options);
      };
    }
  };

  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
  }

  exports.CurrencyDirective = directive;
  exports.CurrencyInput = component;
  exports.default = plugin;
  exports.parseCurrency = parseCurrency;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
