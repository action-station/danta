danta.ui = {
    
    /* base ui objects ****************************************************** */
    
    Base: { _uuid: "danta.ui.Base",
        _behave: null,
        _behaviors: {},
        
        _attach_behaviors: function () {
            this._behave = this._behave || [];
            
            this._behave.forEach(function (e, i, a) {
                var behavior = danta.ui.behavior[e.behavior];
                behavior(this, e.params);
            }, this);
        },
        
        get_param: function (key) {
            if(this.element) { // element: associated jQuery object
                return this.element.data(key);
            }
            
            return this.element[key];
        },
        
        behave: function (behavior, params) {
            this._behave = this._behave || [];
            if(typeof params === "undefined") {
                params = {};
            }
            
            if(this._behaviors[behavior]) {
                this._behave.push({ behavior: behavior, params: params });
            }
            else {
                throw this.id + " cannot behave " + behavior;
            }
        },
        
        render: function () {
            var dl = $("<dl />").addClass("default");
            
            for(var i in this) {
                if(this.hasOwnProperty(i) && typeof this[i] !== "function") {
                    dl.append("<dt>" + i + "</dt>");
                    dl.append("<dd>" + this[i] + "</dd>");
                }
            }
            
            this.element.append(dl);
        },
        
        hide: function () { this.element.hide(); },
        show: function () { this.element.show(); }
    },
    
    /* user ui objects ****************************************************** */
    
    /* ui functions ********************************************************* */
    
    _make_widget: function (id) {
        var jo = $("#" + id);
        
        if(jo.length > 0) {
            var data = jo[0].dataset;
            
            if(data.widget) {
                var to = danta.ui.widget[data.widget];
                if(typeof to === "object") {
                    var o = Object.create(to);
                    if(!("_parts" in o)) { o._parts = []; }
                    
                    o._parts.push(danta.ui.Base);
                    
                    var wo = danta._o(o);
                    wo.element = jo.addClass("widget");
                    
                    return wo;
                }
            }
        }
        
        throw "danta.ui.widget._make: error";
    },
    
    _autoload: function () { /* Using Bootstrap for default layout */
        var container = null;
        var row = null;
        
        // @TODO: how should the header and footer be styled?
        
        if(!$("body").hasClass("no_autoload")) {
            container = $("<div />").addClass("container-fluid");
            
            row = $('<div class="row"></div>');
            
            //$("header").addClass("page-header");
            $("header").addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12");
            
            row.append($("header").detach());
            container.append(row);
            
            row = $('<div class="row"></div>');
            $("section").each(function (i, card) {
                if(!$(card).hasClass("no_autoload")) {
                    i+=1;
                    /*
                     * Default stacking of cards:
                     *      mobile: one
                     *      tablet: two
                     *      desktop: four
                     */
                    $(card).addClass("jumbotron col-xs-12 col-sm-6 col-md-6 col-lg-3");

                    if(i%2 == 0) { $(card).addClass("m2"); }
                    if(i%4 == 0) { $(card).addClass("m4"); }
                }
            });
            row.append($("section").detach());
            container.append(row);
            
            row = $('<div class="row"></div>');
            
            $("footer").addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12");
            
            row.append($("footer").detach());
            container.append(row);
            
            $("body").append(container);
        }
        
        /* Widgets */
        var widgets = {};
        $("[data-widget]").each(function () {
            var widget_id = $(this).attr("id");
            var widget = danta.ui._make_widget(widget_id);
            
            if(widget.get_param("autorender") === "yes") {
                widget.render();
            }
            
            widget.id = widget_id;
            widgets[widget_id] = widget;
        });
        
        return { widgets: widgets };
    }
}
