sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/controls/Popover",
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    "com/sap/sapathon/model/formatter",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Popover, Export, ExportTypeCSV, formatter, MessageBox) {
        "use strict";

        return Controller.extend("com.sap.sapathon.controller.View2", {
            formatter: formatter,
            onInit: function (oEvent) {
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.getRoute("View2").attachPatternMatched(this._onRouterMatched, this);
            },
            _onRouterMatched: function (oEvent) {
                var sMonth = oEvent.getParameter("arguments").month;
                var sTop10 = oEvent.getParameter("arguments").top10;
                var sRange = oEvent.getParameter("arguments").range;
                var sChart = oEvent.getParameter("arguments").chart;
                this.onPressSubmit(sMonth, sTop10, sRange,sChart);
            },
            onPressSubmit: function (val, top10, range,chart) {
                var that = this, MonthName, aEntries = [], replaceMonthText;
                var progamFilter = "", programRunPerMonthFilter = "", CO2EMissionFilter = "", TotalCPUtimeinsecondsFilter = "";
                if (val && val.length === 3) {
                    var Month = val, usage = "", programName = "", energyConsumption = "", programRunPerMonth = "", CO2EMission = "", TotalCPUtimeinseconds = "";
                    this.getView().byId("idExecutionMonth").setSelectedKeys([val]);
                    replaceMonthText = "( executionMonth eq '" + Month + "' )";
                }
                else {
                    Month = this.getView().byId("idExecutionMonth").getSelectedKeys();
                    if (Month.length == 0) {
                        Month.push("Jan");
                        this.getView().byId("idExecutionMonth").setSelectedKeys([Month]);
                    }
                    for (var i = 0; i < Month.length; i++) {
                        aEntries.push("executionMonth eq '" + Month[i] + "'");
                    }
                    replaceMonthText = "( " + aEntries.join(" or ") + " )";
                    usage = this.getView().byId("idUsage").getValue();
                    programName = this.getView().byId("idProgramName").getValue();
                    if (programName != "") {
                        progamFilter = "and programName eq '" + programName + "'";
                    }
                    programRunPerMonth = this.getView().byId("idProgramRunPerMonth").getValue();
                    if (programRunPerMonth != "") {
                        programRunPerMonthFilter = " and noOfTimesThePgmRunForTheMonth eq '" + programRunPerMonth + "'";
                    }
                    CO2EMission = this.getView().byId("idCO2EMission").getValue();
                    if (CO2EMission != "") {
                        CO2EMissionFilter = " and co2EmissioninMG eq '" + CO2EMission + "'";
                    }

                    TotalCPUtimeinseconds = this.getView().byId("idTotalCPUtimeinseconds").getValue();
                    if (TotalCPUtimeinseconds != "") {
                        TotalCPUtimeinsecondsFilter = " and currentRunningTimeinCPUSeconds eq '" + TotalCPUtimeinseconds + "'";
                    }
                }
                var monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                for (var i = 0; i < monthsArray.length; i++) {
                    if (monthsArray[i].includes(Month)) {
                        MonthName = monthsArray[i];
                    }
                }

                if (top10 == "true") {
                    https://port4004-workspaces-ws-69bpc.eu10.applicationstudio.cloud.sap/v2/catalog/SampleData
                    var spath = "/v2/catalog/SampleData?$format=json&$filter={1} and usage eq 'PROD'&$orderby=noOfTimesThePgmRunForTheMonth desc&$top=10"
                }
                else {
                    spath = "/v2/catalog/SampleData?$format=json&$filter={1} " + progamFilter + programRunPerMonthFilter + CO2EMissionFilter + TotalCPUtimeinsecondsFilter + " and usage eq 'PROD'";
                }
                spath = spath.replace("{1}", replaceMonthText);
                sap.ui.core.BusyIndicator.show(-1);
                var oModel = new JSONModel();
                oModel.setSizeLimit(100000);
                $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: spath,
                    async: true,
                    success: function (result) {
                        sap.ui.core.BusyIndicator.hide();
                        if (range) {
                            var lessthanOne = [], GreaterthanOne = [], greaterthanTwo = [], greaterthanThree = [];
                            for (var i = 0; i < result.d.results.length; i++) {
                                if (parseFloat(result.d.results[i].co2EmissioninMG) < 1) {
                                    lessthanOne.push(result.d.results[i]);
                                }
                                else if (parseFloat(result.d.results[i].co2EmissioninMG) > 1 && parseFloat(result.d.results[i].co2EmissioninMG) < 2) {
                                    GreaterthanOne.push(result.d.results[i]);
                                }
                                else if (parseFloat(result.d.results[i].co2EmissioninMG) > 2 && parseFloat(result.d.results[i].co2EmissioninMG) < 3) {
                                    greaterthanTwo.push(result.d.results[i]);
                                }
                                else if (parseFloat(result.d.results[i].co2EmissioninMG) > 3) {
                                    greaterthanThree.push(result.d.results[i]);
                                }
                            }
                            if (range == "<1") {
                                oModel.setData(lessthanOne);
                                that.getView().byId("idMonthsDetails").setText("Average carbon emission in "+Month+" (" + range + "grams)-"+" (" + lessthanOne.length + " records)");  
                            }
                            else if (range == "1-2") {
                                oModel.setData(GreaterthanOne);
                                that.getView().byId("idMonthsDetails").setText("Average carbon emission in "+Month+" (" + range + "grams)-"+" (" + GreaterthanOne.length + " records)");  
                            }
                            else if (range == "2-3") {
                                oModel.setData(greaterthanTwo);
                                that.getView().byId("idMonthsDetails").setText("Average carbon emission in "+Month+" (" + range + "grams)-"+" (" + greaterthanTwo.length + " records)"); 
                            }
                            else if (range == ">3") {
                                oModel.setData(greaterthanThree); 
                                that.getView().byId("idMonthsDetails").setText("Average carbon emission in "+Month+" (" + range + "grams)-"+" (" + greaterthanThree.length + " records)");  
                            }
                            that.getView().setModel(oModel, "Tabledata");
                        }
                        else {
                            oModel.setData(result.d.results);
                            that.getView().byId("idMonthsDetails").setText("Records (" + result.d.results.length + ")");
                            that.getView().setModel(oModel, "Tabledata");
                        }

                        if(chart ==="chart1"){
                            that.getView().byId("idMonthsDetails").setText("Co2 emission for "+Month +" (" + result.d.results.length + " records)");
                        }
                        else if(chart === "chart2"){
                            that.getView().byId("idMonthsDetails").setText("Top 10 executed programs for "+Month );
                        }
                        else if(chart ==="chart3"){
                            that.getView().byId("idMonthsDetails").setText("Energy consumption for "+Month +" (" + result.d.results.length + " records)");
                        }

                    },
                    error: function (errorThrown) {
                        MessageBox.error("Error on getting data!");
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            },
            onDataExport: sap.m.Table.prototype.exportData || function (oEvent) {
                var that = this;
                var columnsToDownload = [];
                columnsToDownload = [{
                    name: "Carbon footprint",
                    template: {
                        content: {
                            path: "-"
                        }
                    }
                }, {
                    name: "Usage",
                    template: {
                        content: {
                            path: "usage"
                        }
                    }
                }, {
                    name: "Program name",
                    template: {
                        content: {
                            path: "programName"
                        }
                    }
                }, {
                    name: "Program run for month",
                    template: {
                        content: {
                            path: "noOfTimesThePgmRunForTheMonth"
                        }
                    }
                }, {
                    name: "Execution month",
                    template: {
                        content: {
                            path: "executionMonth"
                        }
                    }
                }, {
                    name: "Total CPU time in seconds",
                    template: {
                        content: {
                            path: "currentRunningTimeinCPUSeconds"
                        }
                    }
                }, {
                    name: "Energy consumption in MWh",
                    template: {
                        content: {
                            path: "currentRunningTimeinCPUSeconds"
                        }
                    }
                }, {
                    name: "Co2 emission in milli gram",
                    template: {
                        content: {
                            path: "co2EmissioninMG"
                        }
                    }
                }];
                this.getView().getModel("Tabledata").setSizeLimit(1000000);
                var ModelTodownload = this.getView().getModel("Tabledata");
                //////////////////////////////Download CSV File /////////////////////////////////	
                var oExport = new sap.ui.core.util.Export({
                    // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                    exportType: new sap.ui.core.util.ExportTypeCSV({
                        //	separatorChar : ";",
                        charset: "utf-8",
                    }),
                    // Pass in the model created above
                    models: ModelTodownload,
                    // binding information for the rows aggregation
                    rows: {
                        path: "/"
                    },
                    // column definitions with column name and binding info for the content
                    columns: columnsToDownload
                });
                oExport.generate().done(function (sContent) {
                    //	console.log(sContent);
                }).always(function () {
                    this.destroy();
                });
                // download exported file
                oExport.saveFile().catch(function (oError) {
                    sap.m.MessageToast.show("Error when downloading data. Browser might not be supported!\n\n" + oError);
                }).then(function () {
                    oExport.destroy();
                });
            },
            onNavBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View1");
            }
        });
    });
