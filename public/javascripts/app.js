var Location = Backbone.Model.extend({
    urlRoot:"/location",

});
 
var Locations = Backbone.Collection.extend({    
    url:"/locations",
    model: Location,
});

var CreateLocationView = Backbone.View.extend({ 
    el:'#create_location_container',
    events: { 
        "submit": "save",
    },

    template: _.template($('#create_location_template').html()),

    initialize: function(options){
         _.bindAll(this, "updateLocation");
        options.vent.bind("updateLocation", this.updateLocation);
        this.render();
    },

    updateLocation: function(location){
        self = this;
        this.model.set(location);
        this.model.destroy({
            success: function(){
                self.updateView(location);
            }
        });
        
    },

    updateView: function(location){
        this.model = location;
        this.render();
    },

    render: function(){
        $("#create_location_container").html(this.template(this.model.toJSON()));

        //if we are editing, default map with address
        if(this.model.get("address")){
            address = this.model.get("address");
        } else {
            address = "NYC";
        }

        $('#address').geocomplete({
            map: ".map_canvas",
            location: address,
            details: "form"
        });
        return this;
    },

    save: function(e) { 
        self = this;      
        e.preventDefault();
        data = $('form').serializeObject();
        if(this.model.get('_id')){
            this.model.set({id: this.model.get('_id')});
        }
        this.model.set(data);
        this.model.save(null, {
            success: function (model, response) {
                self.collection.add(model);
                self.updateView(new Location());
            }
        });
        
        
        return false    
    }
}); 

var LocationView = Backbone.View.extend({
    tagName: 'li',
    attributes:{
        class:"row",
    },

    template: _.template($('#location_template').html()),    

    initialize: function(options){
        this.vent = options.vent;
        //update view accordingly when model changes
        this.listenTo(this.model, "destroy", this.destroy);
        this.listenTo(this.model, "change", this.render);
        this.render();
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "click #delete": "deleteLocation",
        "click #edit": "editLocation"
    },

    editLocation: function(e){
        this.vent.trigger("updateLocation", this.model);
    },

    deleteLocation: function(e){
        this.remove();
        self = this;
        this.model.set({id:this.model.get("_id")});
        this.model.destroy();
    }
});

var LocationListView = Backbone.View.extend({
    tagName:'ul',

    initialize: function(){
        _.bindAll(this,'render','renderOne');
        this.collection.on('add', this.renderOne);
        this.render();
    },
    render: function(){
        this.collection.each(this.renderOne);
        return this;
    },
    renderOne : function(model) {
        var locationView = new LocationView({model:model, vent:vent});
        this.$el.append(locationView.el);
        return this;
    }

});

var createLocationView;
var vent = _.extend({}, Backbone.Events);
var locations = new Locations();
createLocationView = new CreateLocationView({ model: new Location(), collection:locations, vent:vent});        
locations.fetch({
    success: function(){
        locationListView = new LocationListView({ collection:locations, vent:vent });        
        
        $("#location_list_container").append(locationListView.el);        
        $(document).foundation();
    }
});     


$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
