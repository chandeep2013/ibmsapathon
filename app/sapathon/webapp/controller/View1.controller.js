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

        return Controller.extend("com.sap.sapathon.controller.View1", {
            onInit: function () {
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.getRoute("View1").attachPatternMatched(this._onvizCharts, this);
                var that = this;
                var oVizFrame1 = this.getView().byId("idVizFrame1");
                var oPopOver1 = this.getView().byId("idPopOver1");
                oPopOver1.connect(oVizFrame1.getVizUid());
                oPopOver1.setActionItems([{
                    type: 'action',
                    text: 'View Details',
                    press: function (evt) {
                        var selectedMonth = evt.getSource().getParent().getParent().getParent().getContent()[0]._oDimLabel.mProperties.text;
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        oRouter.navTo("View2", {
                            month: selectedMonth
                        });
                    }
                }]);
                oVizFrame1.setVizProperties({
                    title: {
                        text: 'Monthly CO2 emission'
                    },
                    plotArea: {
                        colorPalette: ["#8189F7", "#E8743B", "#19A979", "#ED4A7B", "#8189F7", "#E8743B", "#19A979", "#ED4A7B"]
                    },
                    valueAxis: {
                        title: {
                            visible: false
                        }
                    },
                    valueAxis2: {
                        title: {
                            visible: false
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: false
                        }
                    }
                });
                var oVizFrame2 = this.getView().byId("idVizFrame2");
                var oPopOver2 = this.getView().byId("idPopOver2");
                oPopOver2.connect(oVizFrame2.getVizUid());
                oPopOver2.setActionItems([{
                    type: 'action',
                    text: 'View Details',
                    press: function (evt) {
                        var selectedMonth = evt.getSource().getParent().getParent().getParent().getContent()[0]._oDimLabel.mProperties.text;
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        oRouter.navTo("View2", {
                            month: selectedMonth
                        });
                    }
                }]);
                oVizFrame2.setVizProperties({
                    title: {
                        text: 'CPU time > 100K Seconds'
                    },
                    plotArea: {
                        dataShape: {
                            primaryAxis: ['bar', 'bar', 'line', 'line'],
                            secondaryAxis: ['line', 'line']
                        },
                        colorPalette: ["#8189F7", "#E8743B", "#19A979", "#ED4A7B", "#8189F7", "#E8743B", "#19A979", "#ED4A7B"]
                    },
                    valueAxis: {
                        title: {
                            visible: false
                        }
                    },
                    valueAxis2: {
                        title: {
                            visible: false
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: false
                        }
                    }
                });
                var oVizFrame3 = this.getView().byId("idVizFrame3");
                var oPopOver3 = this.getView().byId("idPopOver3");
                oPopOver3.connect(oVizFrame3.getVizUid());
                oPopOver3.setActionItems([{
                    type: 'action',
                    text: 'View Details',
                    press: function (evt) {
                        var selectedMonth = evt.getSource().getParent().getParent().getParent().getContent()[0]._oDimLabel.mProperties.text;
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        oRouter.navTo("View2", {
                            month: selectedMonth.split("-")[1].trim()
                        });
                    }
                }]);
                oVizFrame3.setVizProperties({
                    title: {
                        text: 'CO2 emission of top 10 multiple times executed programs'
                    },
                    plotArea: {
                        colorPalette: ["#8189F7", "#E8743B", "#19A979", "#ED4A7B", "#8189F7", "#E8743B", "#19A979", "#ED4A7B"]
                    },
                    valueAxis: {
                        title: {
                            visible: false
                        }
                    },
                    valueAxis2: {
                        title: {
                            visible: false
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: false
                        }
                    }
                });
                var oVizFrame4 = this.getView().byId("idVizFrame4");
                var oPopOver4 = this.getView().byId("idPopOver4");
                oPopOver4.connect(oVizFrame4.getVizUid());
                oPopOver4.setActionItems([{
                    type: 'action',
                    text: 'View Details',
                    press: function (evt) {
                        var selectedMonth = evt.getSource().getParent().getParent().getParent().getContent()[0]._oDimLabel.mProperties.text;
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        oRouter.navTo("View2", {
                            month: selectedMonth.split("-")[1].trim()
                        });
                    }
                }]);
                oVizFrame4.setVizProperties({
                    title: {
                        text: 'Energy consumption'
                    },
                    plotArea: {
                        colorPalette: ["#8189F7", "#E8743B", "#19A979", "#ED4A7B", "#8189F7", "#E8743B", "#19A979", "#ED4A7B"]
                    },
                    valueAxis: {
                        title: {
                            visible: false
                        }
                    },
                    valueAxis2: {
                        title: {
                            visible: false
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: false
                        }
                    }
                });
            },
            _onvizCharts: function () {
                var that = this;
                sap.ui.core.BusyIndicator.show(-1);
                $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "https://port4004-workspaces-ws-mgqj6.us10.trial.applicationstudio.cloud.sap/v2/catalog/SampleData",
                    async: true,
                    success: function (result) {
                        that.arrangeData(result.d.results);
                    },
                    error: function (errorThrown) {
                        console.log(errorThrown);
                    }
                });
            },
            arrangeData: function (ResponseData) {
                var oModel = new JSONModel();
                oModel.setSizeLimit(100000);
                var ViZData = [];
                var CPUData = [];
                this.Chart2Data(ResponseData);
                var pgmName = 0, ResponseDataPgmName = 0, ProgramRunPerMonth = 0, Co2EmissioninGrams = 0,RunningTimeinCPUSeconds=0;
                for (var i = 0; i < ResponseData.length; i++) {
                    if (parseInt(ResponseData[i].currentRunningTimeinCPUSeconds) > 100000) {
                        CPUData.push(ResponseData[i]);
                    }
                    else {
                        if (ResponseData[i + 1] && ResponseData[i].executionMonth === ResponseData[i + 1].executionMonth) {
                            if (ResponseData[i].programName != "") {
                                ResponseDataPgmName = 1;
                            }
                            pgmName += ResponseDataPgmName;
                            ProgramRunPerMonth += parseInt(ResponseData[i].noOfTimesThePgmRunForTheMonth);
                            Co2EmissioninGrams += parseInt(ResponseData[i].co2EmissioninMG);
                            RunningTimeinCPUSeconds += parseInt(ResponseData[i].currentRunningTimeinCPUSeconds);
                        }
                        else {
                            ViZData.push({
                                "Month": ResponseData[i].executionMonth,
                                "Count of custom program": pgmName,
                                "Run count per month": ProgramRunPerMonth,
                                "CO2 emission in gram": Co2EmissioninGrams,
                                "Energy consumption":RunningTimeinCPUSeconds
                            });
                        }
                    }

                }
                this.CPUData(CPUData);
                console.log(ViZData);
                sap.ui.core.BusyIndicator.hide();
                oModel.setData(ViZData);
                this.getView().setModel(oModel, "vizData");
            },
            CPUData: function (ResponseData) {
                var pgmName1 = 0, ResponseDataPgmName1 = 0, ProgramRunPerMonth1 = 0, Co2EmissioninGrams1 = 0;
                var oModel1 = new JSONModel();
                oModel1.setSizeLimit(100000);
                var ViZData1 = [];
                for (var j = 0; j < ResponseData.length; j++) {
                    if (ResponseData[j + 1] && ResponseData[j].executionMonth === ResponseData[j + 1].executionMonth) {
                        if (ResponseData[j].programName != "") {
                            ResponseDataPgmName1 = 1;
                        }
                        pgmName1 += ResponseDataPgmName1;
                        ProgramRunPerMonth1 += parseInt(ResponseData[j].noOfTimesThePgmRunForTheMonth);
                        Co2EmissioninGrams1 += parseInt(ResponseData[j].co2EmissioninMG);
                    }
                    else {
                        ViZData1.push({
                            "Month": ResponseData[j].executionMonth,
                            "Count of custom program": pgmName1,
                            "Run count per month": ProgramRunPerMonth1,
                            "CO2 emission in kg": Co2EmissioninGrams1 / 1000
                        });
                    }
                }
                oModel1.setData(ViZData1);
                this.getView().setModel(oModel1, "vizData1");
            },
            Chart2Data: function (ResponseData) {
                var oChart2Model = new JSONModel();
                oChart2Model.setSizeLimit(100000);
                var Chart2Data = [];
                var pgmName = 0, ResponseDataPgmName = 0, ProgramRunPerMonth = 0, Co2EmissioninGrams = 0;
                for (var i = 0; i < ResponseData.length; i++) {
                    if (ResponseData[i + 1] && ResponseData[i].executionMonth === ResponseData[i + 1].executionMonth) {
                        if (ResponseData[i].programName != "") {
                            ResponseDataPgmName = 1;
                        }
                        pgmName += ResponseDataPgmName;
                        ProgramRunPerMonth += parseInt(ResponseData[i].noOfTimesThePgmRunForTheMonth);
                        Co2EmissioninGrams += parseInt(ResponseData[i].co2EmissioninMG);
                    }
                    else {
                        Chart2Data.push({
                            "Paramater": "Co2 Emission in g",
                            "Value":Co2EmissioninGrams,
                            "Month":ResponseData[i].executionMonth
                        });
                        Chart2Data.push({
                            "Paramater": "Program Run Per Month",
                            "Value":ProgramRunPerMonth,
                            "Month":ResponseData[i].executionMonth
                        });
                        Chart2Data.push({
                            "Paramater": "Program Name",
                            "Value":pgmName,
                            "Month":ResponseData[i].executionMonth
                        });
                    }
                }
                console.log(Chart2Data);
                sap.ui.core.BusyIndicator.hide();
                oChart2Model.setData(Chart2Data);
                this.getView().setModel(oChart2Model, "Chart2Data");
            }
        });
    });
