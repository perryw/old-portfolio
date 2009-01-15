
Ajax.InPlaceEditorWithEmptyText = Class.create(Ajax.InPlaceEditor, {

  initialize : function($super, element, url, options) {
    if (!options.emptyText)        options.emptyText = "click to edit…";
    if (!options.emptyClassName)   options.emptyClassName = "inplaceeditor-empty";

    $super(element, url, options);

    this.checkEmpty();
  },

  checkEmpty : function() {

    if (this.element.innerHTML.length == 0 && this.options.emptyText) {

      this.element.appendChild(
          new Element("span", { className : this.options.emptyClassName }).update(this.options.emptyText)
        );
    }

  },

  getText : function($super) {

    if (empty_span = this.element.select("." + this.options.emptyClassName).first()) {
      empty_span.remove();
    }

    return $super();

  },
  leaveEditMode : function($super) {
    this.checkEmpty();
    return $super();
  },

  onComplete : function($super, transport) {
    this.checkEmpty();
    return $super(transport);
  }
});
