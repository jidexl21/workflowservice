var Actions  = [
    "Approve", "Reject", "Pushback"
]; 

var ItemStatuses = [
    "pending",
    "approved",
    "rejected"
];

var Role =()=>{
    this.ID = "", 
    this.Name = "",
    this.Description = ""
}

var AllRoles = () =>{

}

var ApprovalActions = ()=> {
    this.Get =()=>{
        var itm = JSON.parse(localStorage.getItem("ApprovalActions")); 
        return (itm)?itm:[];
    }
    this.Add =(actn)=>{
        actn.Validate();
    }
    this.Save = (itm)=>{
        var all = this.Get(); all.push(itm);
        localStorage.setItem("ApprovalActions", JSON.stringify(this.Get()))
    }
}
var ApprovalAction = ()=>{
    this.ID, 
    this.FunctionID,
    this.RuleID,
    this.ItemID,
    this.ItemLevel,
    this.ActionType, 
    this.RoleID, 
    this.UserID,
    this.ApprovedDate, 
    this.Save =()=>{
        var db = (new ApprovalActions).Save(this);
    }, 
    this.Validate =()=>{
        
        if(!this.ID){throw "ID cannot be null"}; 
        if(!this.RuleID){throw "Rule ID Cannot be Null"};
        if(!this.ItemID){throw "ItemId cannot be null"}; 
        if(!this.ItemLevel){throw "ItemLevel Cannot be null"}
        if((this.ActionType != typeof(0) ) && (Actions.indexOf(ActionType) == -1)) {throw "Invalid action type Specified";}
        if(!this.RoleID){throw "RoleID cannot be null"};
        if(!ApprovedDate){this.ApprovedDate = new Date()}
    };  
}

var AllRules = function(){
    this.Get = (id)=> {
    var rawList = localStorage.getItem("AllRules"); 
    var list = (rawList)?JSON.parse(rawList):[];
     return (id) ? list.filter((rule)=>{
         return rule.ID == id;
     })
     : list ; 
    }
    this.Save =()=>{
        var curset = this.Get(); currset.push(rule); 
        localstorage.setItem("AllRules",JSON.stringify(currset)); 
    }
 }; 

 var ApprovalRule = function (){
    this.ID ="",
    this.FunctionID ="", 
    this.combinationNo ="", 
    this.RoleID ="",
    this.ApproverCount = 0,
    this.RuleStatus ="", 
    this.PageUrl ="", 
    this.Level ="",
    this.CreatedDate = Date();
}
var AllProcesses = function(){
    this.Get = (criteria)=>{
        var pr = localStorage.getItem("AllProcesses"); 
        return  ((!pr)?[]: JSON.parse(pr)).filter((item)=>{
            if(!criteria) return true; 
            if(typeof(criteria)=="string"){
                return (item.ID == criteria)
            }
            for(key in criteria){
                if(!(item[key]==criteria[key])) return false; 
            }
        });
    }
    this.SaveOrUpdate =(itm)=>{
        var pr = localStorage.getItem("AllProcesses"); 
        var itms = ((!pr)?[]: JSON.parse(pr)); 
        var found = itms.filter((itms)=>{itms.ID = itm.ID}).length; 
        if(found == 0){itms.push(itm)}else{
            found.map(function(prev){
                prev = itm;
            })
        }
        localStorage.setItem("AllProcesses", JSON.stringify(itms)); 
    }
    this.Save = function(itm){
        var pr = localStorage.getItem("AllProcesses"); 
        var itms = ((!pr)?[]: JSON.parse(pr));
        itms.push(itm);
        localStorage.setItem("AllProcesses", JSON.stringify(itms)); 
    }
}
var FlowProcess = function(){
    this.ID ="", 
    this.ProcessName = ""; 
    this.Description = "";
    this.RuleList = []; 
    this.Save = ()=>{
        (new AllProcesses()).Save(this)
    }
    this.Update = (itm)=>{
        (new AllProcesses()).Get(itm.ID).SaveOrUpdate(this)
    }
    this.Get = ()=>{
        return (new AllProcesses()).Get(); 
    }
    this.Validate = (allowEmpty) =>{
        if (!this.ID){this.ID = "PR_"+ Math.floor(Math.random()*1000000000000).toString(16)};
        if (this.ProcessName == ""){throw "Process Name cannot be empty"} 
        if((!allowEmpty) && (this.RuleList.length == 0)){throw "No Rules have been Created"}
    },
    this.LevelCount = ()=>{
        var num = 0; if(this.RuleList.length == 0){return 0;}
        var lastLevel = this.RuleList[0].Level;
        this.RuleList.forEach(element => {
            if(element.Level != lastLevel)num++; 
        });
        return num;
    }
}

var ApprovalItems = function(){
    this.Get = (id)=>{
        var all = localStorage.getItem("ApprovalItems"); 
        return ((all) ? JSON.parse(all) : []).filter((itm)=>{
            if(!id){ return true;}
            return itm.ID = id; 
        });
    }
    this.Save = (Itm)=>{
        var itms = this.Get()
        itms.push(Itm); 
        localStorage.setItem("ApprovalItems", JSON.stringify(itms));
    }
}

var ApprovalItem =  function(){
    this.FunctionID="";
    this.Description="";
    this.ApplicableAmount= 0;
    this.ItemStatus = 0;
    this.GetRule = ()=>{
        AllRules().filter((rule)=>{
            return rule.ID  = this.RuleID;
        })
    }, 
    this.Save = ()=>{(new ApprovalItems).Save(this)};
}

var app = ()=>{
    Approve : (item, role)=>{
        var currentRule = this.Get(item.RuleID);
        var newApprovalAction = new ApprovalAction(); 
        //newApprovalAction();
    }
}