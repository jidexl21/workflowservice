




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
            def = {name:item, label:item, type:"select", options: ItemStatuses.map((i,x)=>{return {value:x,text:i}})}
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
    $("body").formy("createModal", {title:"<h4>Add New Item</h4>",onAction:function(data, all){
        var dat = {}; 
        data.map((x)=>{dat[x.name] = x.value});
        console.log(dat);
        var app = new ApprovalItems(); 
        app.Save(dat);
        $("body").trigger('ItemSaved', [dat]); 
    }
        }).each(function(){
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

        p.Save(); 
        $("#process_table").jsGrid("refresh");
        $(this).button('reset');
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
        var code = ItemStatuses.indexOf(id);
        $(this).append($("<div>", {id:id+"_table"}));
        var approvalModel = getParts(ApprovalItem);
        const $gridRef = $(this).find("#"+id+"_table");
        var data = new ApprovalItems()
        let datastore = data.Get().filter((x)=>{return (parseInt(x.ItemStatus) === code);});  
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
        data: datastore,
        fields: flds,     
        onItemDeleted:function(grid,row,item,itemIndex){
            console.log("item deleted") ;
            localStorage.setItem("ApprovalItems", JSON.stringify(datastore))
        }
        ,onItemUpdated:function(grid,row,item,itemIndex,previousItem){
            console.log("item updated") ;
            localStorage.setItem("ApprovalItems", JSON.stringify(datastore))
        }
        ,onRefreshing(grid){
            var a = (new ApprovalItems()).Get().filter((x)=>{return (parseInt(x.ItemStatus) === code);});
            if(datastore.length !== a.length){
                console.log("refreshing");
                console.log(a);  
                console.log(datastore)
                this.data = a;
            }
            
        }
    })
    /*
    $("#grid").jsGrid("insertItem", { Name: "John", Age: 25, Country: 2 }).done(function() {
        console.log("insertion completed");
    });
    */
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
 
        var flds = processModel.columns.map(item=>{
            var def = {name:item, type:"text"}
            if(item == "RuleList"){def.type = "action"}
            if(item == "ID"){def["readOnly"] = true}
            return def;
        });

        flds.push({ type: "control" })
        $gridRef.jsGrid({
            width: "100%",
           // height: "200px",
            inserting: false,
            editing: true,
            sorting: true,
            paging: true,
            data: data,
            fields: flds,
            onItemDeleted:function(grid,row,item,itemIndex){
                console.log("item deleted");
                localStorage.setItem("AllProcesses", JSON.stringify(data))
            }
            ,onItemUpdated:function(grid,row,item,itemIndex,previosItem){
                console.log("item updated") ;
                localStorage.setItem("AllProcesses", JSON.stringify(data))
            }
            ,onRefreshing: function(){
                 var a = (new AllProcesses()).Get(); 
                if(data.length == a.length)return; 
                this.data = a; 
            }
        })

    });

    $("body").on("ItemSaved", function(e, args){
        $("#pending,#approved,#rejected").each(function(){
            var id = $(this).attr("id");
            $(this).find("#"+id+"_table").jsGrid("refresh", args);
            //console.log('Refresh called on '+id); 
            //console.log(arguments)
        })
    } )
})
.on("onViewCustom", function(e,val){
    
    var dat = []
    var itm = $(e.target).parent().parent().find("td").each(function(){
        dat.push($.trim($(this).text()));
    })
    var ruler = new AllRules(); 
    console.log(ruler.Get(dat[0]));
    var ruleModel = getParts(ApprovalRule);
    var data = ruler.Get(dat[0]); 
    var obj = new AllProcesses();
    var flds = ruleModel.columns.map(item=>{
        var def = {name:item, type:"text", width:"50"}
        if(item==="FunctionID"){
            def.type = "select"
            def['items'] = obj.Get(dat[0])
            def['valueField']= "ID",
            def['textField']="ProcessName"
        }
        return def; 
    });
    flds.push({"type":"control"})
    
    $("body").formy("createModal", {title:"<h4>View Rules</h4>", size:"lg"})
    .find(".modal-body").each(function(){
        $(this).append($("<div>",{"id":"RuleTable"}));
        $(this).find("#RuleTable")    
        .jsGrid({
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
                localStorage.setItem("ApprovalItems", JSON.stringify(datastore))
            }
            ,onItemUpdated:function(grid,row,item,itemIndex,previousItem){
                console.log("item updated") ;
                localStorage.setItem("ApprovalItems", JSON.stringify(datastore))
            }
            ,onRefreshing(grid){
                var a = ruler.Get(dat[0]);
                if(data.length !== a.length){
                    console.log("refreshing");
                    console.log(a);  
                    console.log(data)
                    this.data = a;
                }
                
            }
        })
    }).end().find('table').parent().addClass("table-responsive").end().end()
    .modal("show"); 
    
})