// atomic.js
(function(context, undefined) {
  if (context.Atomic) {
    return;
  }

  /**
   * The global Atomic Object
   * @class Atomic
   */
  var Atomic = {
    _: {
      requires: {} // used when no module loader is enabled
    },
    loader: {
      init: null,
      load: null
    }
  };

  var AbstractComponent = null;
  var CONSTANTS = null;

  var fiber = null;

  var module;
  var exports;
  var process;

  // inside of this file, no define calls can be made
  var define = null;

  Atomic.config = context.ATOMIC_CONFIG || {};

  /**
   * Copy one objects properties into another
   * @method Atomic.augment
   * @param {Object} src - the source to supplement with new things
   * @param {Object} target - the thing to copy from
   * @returns {Object} the resulting object. `src` is updated by reference when using objects
   * @private
   */
  Atomic.augment = function(src, target) {
    if (Object.prototype.toString.call(src) === '[object Array]') {
      src = src.concat(target);
    }
    else {
      for (var name in target) {
        if (target.hasOwnProperty(name)) {
          src[name] = target[name];
        }
      }
    }
    return src;
  };

  /**
   * Create a "CommonJS" environment. This lets us
   * include a library directly, without having to alter
   * the original code. We can then collect the contents
   * from the module.exports object
   * @method cjsHarness
   * @private
   */
  function cjsHarness() {
    module = {
      exports: {}
    };
    exports = module.exports;
    process = {
      title: 'Atomic CommonJS Harness'
    };
  }

  /**
   * Destroy the "CommonJS" environment.
   * @method resetCjs
   * @private
   */
  function resetCjs() {
    module = undefined;
    exports = undefined;
    process = undefined;
  }

  // --------------------------------------------------
  // CONSTANTS
  // --------------------------------------------------
  //@@include('./constants.js')
  Atomic._.CONSTANTS = CONSTANTS;

  // --------------------------------------------------
  // FIBER
  // --------------------------------------------------
  cjsHarness();
  //@@include('./lib/fiber.js')
  Atomic._.Fiber = module.exports;
  resetCjs();

  // --------------------------------------------------
  // EVENT EMITTER 2
  // --------------------------------------------------
  cjsHarness();
  //@@include('./lib/eventemitter2.js')
  Atomic._.EventEmitter = module.exports.EventEmitter2;
  resetCjs();

  // --------------------------------------------------
  // WHEN.JS Promises/A+
  // --------------------------------------------------
  cjsHarness();
  //@@include('./lib/when.js')
  Atomic._.When = module.exports;
  resetCjs();

  // --------------------------------------------------
  // ABSTRACT COMPONENT
  // --------------------------------------------------
  //@@include('./atomic/abstractcomponent.js')
  Atomic._.AbstractComponent = AbstractComponent;

  // --------------------------------------------------
  // FACTORIES
  // --------------------------------------------------
  //@@include('./atomic/factory.js')

  // --------------------------------------------------
  // PUBLIC INTERFACES
  // --------------------------------------------------
  //@@include('./atomic/public.js')
  //@@include('./atomic/events.js')

  // assign public interface in window scope
  context.Atomic = Atomic;
})(this);