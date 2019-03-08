var MyActionField = function(config) {
    jsGrid.Field.call(this, config);
};
 

MyActionField.prototype = new jsGrid.Field({
 
    css: "action-field",            // redefine general property 'css'
    align: "center",              // redefine general property 'align'
 
    viewEvent: "onViewCustom",      // custom property
 
    sorter: function(date1, date2) {
        return new Date(date1) - new Date(date2);
    },
 
    itemTemplate: function(value) {
        var c = this; 
        var actn = $("<button>",{"class":"btn btn-warning btn-sm"}).text("View")
        .on("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            $(this).trigger(c.viewEvent, [value])
        }); 
        return actn[0]
    },
 
    insertTemplate: function(value) {
        return this._insertPicker = "...";// $("<input>").datepicker({ defaultDate: new Date() });
    },
 
    editTemplate: function(value) {
        return this._editPicker = "...";//$("<input>").datepicker().datepicker("setDate", new Date(value));
    },
 
    insertValue: function() {
        return "...";///this._insertPicker.datepicker("getDate").toISOString();
    },
 
    editValue: function() {
        return "..."; //this._editPicker.datepicker("getDate").toISOString();
    }
});
 
jsGrid.fields.action = MyActionField;