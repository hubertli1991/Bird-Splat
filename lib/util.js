var Util = {

  inherits: function(ChildClass, BaseClass) {
    function Surrogate() {}
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
    ChildClass.prototype.constructor = ChildClass;
  }

};

module.exports = Util;
