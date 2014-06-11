(function(root, undefined) {
  "use strict";
  Ember.TypeAheadComponent = Ember.TextField.extend({
      
    didInsertElement: function() {
      this._super();
      var _this = this;
      
      if(!this.get("data")){
        throw "No data property set";
      }

      if (jQuery.isFunction(this.get("data").then)){
        this.get("data").then(function(data) {
          _this.initializeTypeahead(data);
        });
      }

      else{
        this.initializeTypeahead(this.get("data"));
      }

    },

    substringMatcher: function(items) {
      return function findMatches(q, cb) {
        var matches, substrRegex;
        matches = [];
        substrRegex = new RegExp(q, 'i');

        Ember.$.each(items, function(i, item) {
          if (substrRegex.test(item.name)) {
            matches.push(item);
          }
        });
        cb(matches);
      };
    },

    initializeTypeahead: function(data){
      var _this = this;
      this.typeahead = this.$().typeahead({
        hint: false,
        highlight: true,
        minLength: 1
      },
      {
        name: _this.get('name'),
        displayKey: 'name',
        source: _this.substringMatcher(data.map(function(item) {
          return {
            name: item.get(_this.get('name')),
            value: item.get(_this.get('value') || _this.get('name')),
            emberObject: item
          }
        }))
      });

      this.typeahead.on("typeahead:selected", function(event, item) {
        _this.set("selection", item.emberObject);
      });

      this.typeahead.on("typeahead:autocompleted", function(event, item) {
        _this.set("selection", item.emberObject);
      });

      if (this.get("selection")) {
        this.typeahead.val(this.get("selection.name"));
      }
    },
    
    selectionObserver: function() {
      if (Ember.isEmpty(this.get('selection')) === true) {
        return this.typeahead.val('');
      }
      return this.typeahead.val(this.get("selection").get(this.get("name")));
    }.observes("selection")

  });
  Ember.Handlebars.helper('type-ahead', Ember.TypeAheadComponent);
}(this));
