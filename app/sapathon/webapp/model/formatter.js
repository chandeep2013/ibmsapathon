sap.ui.define([], function () {
    "use strict";
    return {

        MonthName: function (key) {
            var monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            for (var i = 0; i < monthsArray.length; i++) {
                if (monthsArray[i].includes(key)) {
                    var MonthName = monthsArray[i];
                    return MonthName;
                }
            }
        },
        CO2Emission:function(val){
            if(val !== ""){
                return Math.round(val);
            }
        },
        State:function(val){
            if(val ==">1"){
                return "Success";
            }
            else if(val =="1-2"){
                return "Information";
            }
            else if(val =="2-3"){
                return "Warning";
            }
            else{
                return "Error";
            }
        }

    };
});