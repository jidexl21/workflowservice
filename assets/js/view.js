var getParts = function(obj){
    var sample = new obj(); 
    var model = Object.keys(sample)
    .filter(item=>{return !(typeof(sample[item])== 'function') ||(typeof(sample[item])=='object')});
    var actions = Object.keys(sample)
    .filter(item=>{return (typeof(sample[item])== 'function') ||(typeof(sample[item])=='object')});
    return {columns: model, actions: actions }; 
}

var addTable = (obj, model, rows)=>{
    var dat = 
    $("<table>", {"class":"table"}).append($("<thead>").append($("<tr>").each(function(){
            model.columns.map(element=>{
                $(this).append($("<th>").append(element));
            })
        })
    )).append($("<tbody>"))
    obj.append(dat);
    return obj; 
};

$(document).on("click", "#newItem", function(){
    //console.log(ItemStatuses)
    var itemModel = getParts(ApprovalItem);
    var flds = itemModel.columns.map(item=>{
        var def = {name:item, label:item}
        if (item=="ItemStatus"){
            def = {name:item, label:item, type:"select", options: ItemStatuses}
        }
        if (item=="FunctionID"){
            var available = (new AllProcesses()).Get().map(item=>{
                return {value:item.ID, text:item.ProcessName}
            });
            def = {name:item, label:item, type:"select", options: available}
        }
        return def;
    })
    var fm = $("<div>").formy("createForm", flds ,{type:"horizontal",colratio:"1:2"})
    $("body").formy("createModal", {title:"<h4>Add New Item</h4>"}).each(function(){
        $(this).find(".modal-body").empty().formy("createForm", flds ,{type:"horizontal",colratio:"1:2"}
        )
    }).modal("show")
    
})
.on("click", "#newProcess", ()=>{
    
    var proc = new FlowProcess(); 
    try{proc.Validate();}catch(e){console.log(e.toString())}
    
    var flds = Object.keys(proc).map((itm)=>{
        return ((typeof(proc[itm]) == 'function') || (typeof(proc[itm]) == 'object'))
        ? null : {label: itm.toUpperCase(), name:itm, fldtype:typeof(proc[itm])}
    }).filter(x=>{return x!=null}); 
    flds.map((Item,x)=>{
       if(proc[Item.name]){
           Item["value"] = proc[Item.name]; 
       }
    })

    var fx = $("<div>").formy("createForm", flds ,{type:"horizontal",colratio:"1:2"} )
    $("body").formy("createModal", {title:"<h4>Add New Approvable Process</h4>", 
        body:fx,
        onAction:function(){
            $(this).button('loading')
           var p = new FlowProcess(); 
           var frm = $(this).parent().parent().find("form"); 
           var dat = frm.serializeArray(); 
           for(fld in dat){
               p[dat[fld].name]= (dat[fld].value)
           }
        //console.log(p)
        p.Save()
        $(this).button('reset')
        }
    })
    .modal("show")
})
.ready(()=>{
    
    var getData = function(obj){
        return (new obj()).Get(); 
    }
    var ItemModel = {
        columns:["ID", "ProcessID", "Status"]
    }
    $("#pending,#approved,#rejected").empty().each(function(){
        var id  = $(this).attr("id");
        $(this).append($("<div>", {id:id}));
        var approvalModel = getParts(ApprovalItem);
        const $gridRef = $(this).find("#"+id);
        var data = new ApprovalItems()
        let datastore = data.Get();  
    if ($gridRef) $gridRef.attr('data',JSON.stringify(datastore));
    var flds = approvalModel.columns.map(item=>{return {name:item, type:"text", width:50}});
    flds.push({ type: "control" })

    $gridRef.jsGrid({
        width: "100%",
       // height: "200px",
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        data: data,
        fields: flds
    })

    });
    var processModel = getParts(FlowProcess); 
    var data = getData(FlowProcess);
    //if(data.length > 0)
    //if(processModel.columns.length > data)
    $("#processes").empty().each(function(){
        $(this).append($("<div>", {"id":"process_table"}));
        var processModel = getParts(FlowProcess);
        const $gridRef = $(this).find("#process_table");
        var data = (new AllProcesses()).Get(); 
 
        var flds = processModel.columns.map(item=>{return {name:item, type:"text", width:50}});
        flds.push({ type: "control" })
        console.log(flds)
        $gridRef.jsGrid({
            width: "100%",
           // height: "200px",
            inserting: true,
            editing: true,
            sorting: true,
            paging: true,
            data: data,
            fields: flds,
            onItemDeleted:function(grid,row,item,itemIndex){
                console.log("item deleted") ;
                localStorage.setItem("AllProcesses", JSON.stringify(data))
            }
            ,onItemUpdated:function(grid,row,item,itemIndex,previosItem){
                console.log("item updated") ;
                localStorage.setItem("AllProcesses", JSON.stringify(data))
            }
        })

    });
})