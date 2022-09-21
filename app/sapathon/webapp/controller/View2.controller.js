sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/controls/Popover"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Popover) {
        "use strict";

        return Controller.extend("com.sap.sapathon.controller.View2", {
            onInit: function (oEvent) {
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.getRoute("View2").attachPatternMatched(this._onRouterMatched, this);
            },
            _onRouterMatched: function (oEvent) {
                var Param = oEvent.getParameter("arguments").month;
                this.onPressSubmit(Param);
            },
            onPressSubmit:function(val){
                var that = this;
                if(val.length === 3){
                   var Month = val;
                }
                else{
                    Month = this.getView().byId("idExecutionMonth").getValue();
                    var usage = this.getView().byId("idUsage").getValue();
                    var programName = this.getView().byId("idProgramName").getValue();
                }
                sap.ui.core.BusyIndicator.show(-1);
                var oModel = new JSONModel();
                oModel.setSizeLimit(100000);
                $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "https://port4004-workspaces-ws-mgqj6.us10.trial.applicationstudio.cloud.sap/v2/catalog/SampleData?$format=json&$filter=executionMonth eq '"+Month+"' or programName eq '"+programName+"' or usage eq '"+usage+"'",
                    async: true,
                    success: function (result) {
                        that.getView().byId("idMonthsDetails").setText(Month + "month - records("+result.d.results.length+")");
                        sap.ui.core.BusyIndicator.hide();
                        oModel.setData(result.d.results);
                        that.getView().setModel(oModel, "Tabledata");
                    },
                    error: function (errorThrown) {
                        console.log(errorThrown);
                    }
                });
            },
            onNavBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View1");
            }
        });
    });
