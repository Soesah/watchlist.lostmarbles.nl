Vue.directive('draggable', {
  inserted: function (el, binding) {
    debugger;
    // putting nodes in dataTransfer isn't completely supported
    // use this prop on the constructor instead.
    this.source = null;

    // callbacks notify the source of what is happening
    // and keep this class generic
    this.callbacks = callbacks;

    el.draggable = true;
    el.addEventListener('dragstart', this.handleDragStart.bind(this), false);
    el.addEventListener('dragend', this.handleDragEnd.bind(this), false);
    el.addEventListener('dragenter', this.handleDragEnter.bind(this), false);
    el.addEventListener('dragover', this.handleDragOver.bind(this), false);
    el.addEventListener('drop', this.handleDrop.bind(this), false);
    el.addEventListener('dragleave', this.handleDragLeave.bind(this), false);
  },

  // show state of being dragged
  handleDragStart (evt) {
    this.el.classList.add('being-dragged');
    Draggable.source = this.el;

    var parent = this.el.parentNode,
        sourceIndex = this.getChildIndex(parent, this.el),
        // get some data to pass on to a drop
        data = this.callbacks.getdragdata ? this.callbacks.getdragdata.call(this.el, Draggable.source) : {};

    evt.dataTransfer.effectAllowed = 'move';
    data.sourceIndex = sourceIndex;
    evt.dataTransfer.setData('json', JSON.stringify(data));

    // call the callback
    this.callbacks.dragstart ? this.callbacks.dragstart.call(this.el, Draggable.source) : false;
  },

  // show state of no longer being dragged
  handleDragEnd () {
    this.el.classList.remove('being-dragged');

    // call the callback
    this.callbacks.dragend ? this.callbacks.dragend.call(this.el, Draggable.source) : false;

    // clean up
    if (this.el.parentNode) {
      [].forEach.call(this.el.parentNode.childNodes, function(el) {
        if (el.nodeType === 1) {
          el.classList.remove('drop-target');
        }
      });
    }
  },
  handleDragEnter () {
    this.el.classList.add('drop-target');
  },
  handleDragOver (evt) {
    if (evt.preventDefault) {
      evt.preventDefault(); // Necessary. Allows us to drop.
    }

    evt.dataTransfer.dropEffect = 'move'; 
  },
  handleDrop (evt) {
    if (evt.stopPropagation) {
      evt.stopPropagation(); // stops the browser from redirecting.
    }
    var source = Draggable.source,
        parent = this.el.parentNode,
        sourceIndex = this.getChildIndex(parent, source),
        targetIndex = this.getChildIndex(parent, this.el);

    source.classList.remove('being-dragged');

    // no need to continue when dragging onto yourself
    if (source === this.el) {
      Draggable.source = null;
      return;
    }

    var data = JSON.parse(evt.dataTransfer.getData('json'));

    data.sourceIndex = sourceIndex;
    data.targetIndex = targetIndex;

    // call the drop callback
    // pass the dropped item
    this.callbacks.drop ? this.callbacks.drop.call(this.el, source, data) : false;

    if (targetIndex > sourceIndex) {
      this.el.parentNode.insertBefore(source, this.el.nextElementSibling);
    } else if (targetIndex < sourceIndex) {
      this.el.parentNode.insertBefore(source, this.el);
    }
    Draggable.source = null;
  },
  handleDragLeave () {
    this.el.classList.remove('drop-target');
  },

  getChildIndex (parent, child) {
    var index = -1;

    [].forEach.call(parent.childNodes, function(node, i) {
      if (node === child) {
        index = i;
      }
    });

    return index;
  }
});