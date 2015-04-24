WorkSpace = fabric.util.createClass(fabric.Rect, {
  initialize: function(options) {
    debugger;
    options || (options = { });
    this.width = 600,
    this.height = 600,
    this.left = 20,
    this.top = 20,
    this.hasControls = false,
    this.evented = false,
    this.hasBorders = false,
    this.fill = 'white',
    this.selectable = false,
    this.opacity = 0.85
  },

  pictureModules: [],

  hasCollisions: function() {
    for (var i = 0; i < this.pictureModules.length; i++) {
      this.pictureModules[i].setCoords();
      for (var j = i + 1; j < this.pictureModules.length; j++) {
        this.pictureModules[j].setCoords();
        if (this.pictureModules[i].intersectsWithObject(this.pictureModules[j])
          || this.pictureModules[i].isContainedWithinObject(this.pictureModules[j]) 
          || this.pictureModules[j].isContainedWithinObject(this.pictureModules[i])) {
          return true;
        };
      };
    };
    return false;
  },

  areObjectsInside: function() {
    for (var i = 0; i < this.pictureModules.length; i++) {
      this.pictureModules[i].setCoords();
      if (!this.pictureModules[i].isContainedWithinObject(this)) {
        return false;
      };
    };
    return true;
  },

  createPictureModule: function(options, pixelsPerCentimeter) {
    var pictureModule = new PictureModule(options, pixelsPerCentimeter);
    
    this.pictureModules.push(pictureModule);
    this.objectDimensionsChanged();

    pictureModule.isAllowingToRotate = pictureModule.isAllowingToMove = pictureModule.isAllowingToScale = function() {
      return !this.hasCollisions() && this.areObjectsInside();
    }.bind(this); 

    pictureModule.onPictureModuleScale = function() { 
      this.objectDimensionsChanged();
    }.bind(this);

    pictureModule.onPictureModuleMouseMovingOvered = function(e, target) {
      this.updateHint(e, target) 
    }.bind(this);

    pictureModule.onPictureModuleMouseOuted = function() {
      this.hideHint();
    }.bind(this);

    return pictureModule;
  },

  objectDimensionsChanged: function() {
    var minScale = 0, 
        maxScale = Infinity;
    
    for (var i = 0; i < this.pictureModules.length; i++) {
      minScale = Math.max(minScale, this.pictureModules[i].getRelativeMinScale());
      maxScale = Math.min(maxScale, this.pictureModules[i].getRelativeMaxScale());
    }
    // declared in configurator
    this.onExtremeScalesChanged && 
      this.onExtremeScalesChanged(minScale, maxScale);
  },

  canvasScaleChanged: function() {
    for (var i = 0; i < this.pictureModules.length; i++) {
      this.pictureModules[i].recalculateScales();
    }    
  },

  updateHint: function(e, target) {
    this.hint.innerHTML = 'Размер модуля: '+'<br>' + target.label;
    this.hint.style.display = 'block';
    this.hint.style.left = e.e.pageX + 15 +'px';
    this.hint.style.top = e.e.pageY + 15 +'px';
  },

  hideHint: function() {
    this.hint.style.display = 'none';
  }

});





