sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/controls/Popover",
    "com/sap/sapathon/model/formatter",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Popover, formatter, MessageBox) {
        "use strict";

        return Controller.extend("com.sap.sapathon.controller.View1", {
            formatter: formatter,
            onInit: function () {
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.getRoute("View1").attachPatternMatched(this._onvizCharts, this);
                var that = this;
                var vizFrameArray = ["idVizFrame1", "idVizFrame2", "idVizFrame3", "idVizFrame4"];
                for (var i = 0; i < vizFrameArray.length; i++) {

                    var frame = this.getView().byId(vizFrameArray[i]);
                    if (vizFrameArray[i] == "idVizFrame2") {
                        frame.setVizProperties({
                            plotArea: {
                                secondaryScale: { fixedRange: true, minValue: 0, maxValue: 30000 },
                                dataShape: {
                                    primaryAxis: ['bar', 'bar', 'bar', 'bar', 'line', 'line', 'line'],
                                    secondaryAxis: ['line', 'line', 'line']
                                },
                                //colorPalette: ["#1CA979", "#1CA979", "#1CA979", "#1CA979", "#1CA979", "#1CA979", "#1CA979", "#1CA979"],
                                dataLabel: {
                                    visible: true
                                }
                            }, valueAxis: {
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
                    } else {
                        frame.setVizProperties({
                            plotArea: {
                                //colorPalette: ["#8189F7", "#E8743B", "#19A979", "#ED4A7B", "#8189F7", "#E8743B", "#19A979", "#ED4A7B"],
                                dataLabel: {
                                    visible: true
                                }
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
                    }

                    if (vizFrameArray[i] === "idVizFrame1") {
                        var oPopOver = this.getView().byId("idPopOver1");
                        oPopOver.connect(frame.getVizUid());
                    }
                    else if (vizFrameArray[i] === "idVizFrame2") {
                        var oPopOver = this.getView().byId("idPopOver2");
                        oPopOver.connect(frame.getVizUid());
                    }
                    else if (vizFrameArray[i] === "idVizFrame3") {
                        var oPopOver = this.getView().byId("idPopOver3");
                        oPopOver.connect(frame.getVizUid());
                        frame.setVizProperties({
                            legend: {
                                visible: false
                            }
                        });
                    }
                    else if (vizFrameArray[i] === "idVizFrame4") {
                        var oPopOver = this.getView().byId("idPopOver4");
                        oPopOver.connect(frame.getVizUid());
                    }
                    oPopOver.setActionItems([{
                        type: 'action',
                        text: 'View Details',
                        press: function (evt) {
                            var selectedMonth = evt.getSource().getParent().getParent().getParent().getContent()[0]._oDimLabel.mProperties.text;
                            var monthParam = selectedMonth.length > 3 ? selectedMonth.split("-")[1].trim() : selectedMonth;
                            var chart2Param = evt.getSource().getParent().getParent().getParent().getId().includes("popover2");
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                            oRouter.navTo("View2", {
                                month: monthParam,
                                top10: chart2Param
                            });
                        }
                    }]);
                }
            },
            onNavTo: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View2");
            },
            onRowSelectionChange: function (evt) {
                var oData = this.getView().getModel("vizData1").getProperty("/" + evt.getSource().getSelectedIndex());
                var monthParam = oData.Month.length > 3 ? oData.Month.split("-")[1].trim() : oData.Month;
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View2", {
                    month: monthParam,
                    range: oData.Param
                });
            },
            _onvizCharts: function () {
                var that = this;
                sap.ui.core.BusyIndicator.show(-1);
                $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "/v2/catalog/SampleData",
                    async: true,
                    success: function (result) {
                        that.arrangeData(result.d.results);
                    },
                    error: function (errorThrown) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.error("Error on getting data!");
                    }
                });
            },
            arrangeData: function (ResponseData) {
                var that = this;
                var oModel = new JSONModel();
                oModel.setSizeLimit(100000);
                var ViZData = [];
                //var CPUData = [];
                this.Chart2Data(ResponseData);
                this.CPUData(ResponseData);
                var pgmName = 0, ResponseDataPgmName = 0, ProgramRunPerMonth = 0, Co2EmissioninGrams = 0, RunningTimeinCPUSeconds = 0;
                var totalCo2Emission = 0, totalEnergyConsumption = 0;
                for (var i = 0; i < ResponseData.length; i++) {
                    totalCo2Emission += parseFloat(ResponseData[i].co2EmissioninMG);
                    if (ResponseData[i].currentRunningTimeinCPUSeconds != "" && ResponseData[i].currentRunningTimeinCPUSeconds !== null) {
                        totalEnergyConsumption += parseInt(ResponseData[i].currentRunningTimeinCPUSeconds);
                    }
                    //if (parseInt(ResponseData[i].currentRunningTimeinCPUSeconds) > 100000) {
                    //    CPUData.push(ResponseData[i]);
                    //}
                    if (ResponseData[i + 1] && ResponseData[i].executionMonth === ResponseData[i + 1].executionMonth) {
                        if (ResponseData[i].programName != "") {
                            ResponseDataPgmName = 1;
                        }
                        pgmName += ResponseDataPgmName;
                        ProgramRunPerMonth += parseInt(ResponseData[i].noOfTimesThePgmRunForTheMonth);
                        Co2EmissioninGrams += parseFloat(ResponseData[i].co2EmissioninMG);
                        RunningTimeinCPUSeconds += parseInt(ResponseData[i].currentRunningTimeinCPUSeconds);
                    }
                    else {
                        if (ResponseData[i].executionMonth !== null) {
                            ViZData.push({
                                "Month": ResponseData[i].executionMonth,
                                "Count of custom program": pgmName,
                                "Run count per month": ProgramRunPerMonth,
                                "CO2 emission in gram": Co2EmissioninGrams,
                                "Energy consumption in Wh": RunningTimeinCPUSeconds / 1000
                            });
                        }
                    }
                }
                var TotalCO2 = Math.round(totalCo2Emission) + " grams";
                var TotalEnergy = " " + Math.round(totalEnergyConsumption / 1000) + " Wh";
                this.getView().byId("idTotalCO2").setText(TotalCO2);
                this.getView().byId("idTotalEnergy").setText(TotalEnergy);
                //that.CPUData(CPUData);
                sap.ui.core.BusyIndicator.hide();
                oModel.setData(ViZData);
                this.getView().setModel(oModel, "vizData");
            },
            CPUData: function (ResponseData) {
                var that = this;
                /*var pgmName1 = 0, ResponseDataPgmName1 = 0, ProgramRunPerMonth1 = 0, Co2EmissioninGrams1 = 0;
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
                        Co2EmissioninGrams1 += parseFloat(ResponseData[j].co2EmissioninMG);
                    }
                    else {
                        pgmName1 += ResponseDataPgmName1;
                        ProgramRunPerMonth1 += parseInt(ResponseData[j].noOfTimesThePgmRunForTheMonth);
                        Co2EmissioninGrams1 += parseFloat(ResponseData[j].co2EmissioninMG);
                        ViZData1.push({
                            "Month": ResponseData[j].executionMonth,
                            "Count of custom program": pgmName1,
                            "Run count per month": ProgramRunPerMonth1,
                            "CO2 emission in g": Co2EmissioninGrams1
                        });
                        pgmName1 = 0;
                        ProgramRunPerMonth1 = 0;
                        Co2EmissioninGrams1 = 0;
                    }
                }
                oModel1.setData(ViZData1);
                this.getView().setModel(oModel1, "vizData1");*/
                var pgmName1 = 0, ResponseDataPgmName1 = 0, ProgramRunPerMonth1 = 0, Co2EmissioninGrams1 = 0, currentRunningTimeinCPUSeconds1 = 0;
                var lessthanOne = [], GreaterthanOne = [], greaterthanTwo = [], greaterthanThree = [];
                var oModel1 = new JSONModel();
                oModel1.setSizeLimit(100000);
                var ViZData1 = [];
                for (var j = 0; j < ResponseData.length; j++) {
                    if (ResponseData[j + 1] && ResponseData[j].executionMonth === ResponseData[j + 1].executionMonth) {
                        if (ResponseData[j].programName != "") {
                            ResponseDataPgmName1 = 1;
                        }
                        if (parseFloat(ResponseData[j].co2EmissioninMG) < 1) {
                            lessthanOne.push(ResponseData[j]);
                        }
                        else if (parseFloat(ResponseData[j].co2EmissioninMG) > 1 && parseFloat(ResponseData[j].co2EmissioninMG) < 2) {
                            GreaterthanOne.push(ResponseData[j]);
                        }
                        else if (parseFloat(ResponseData[j].co2EmissioninMG) > 2 && parseFloat(ResponseData[j].co2EmissioninMG) < 3) {
                            greaterthanTwo.push(ResponseData[j]);
                        }
                        else if (parseFloat(ResponseData[j].co2EmissioninMG) > 3) {
                            greaterthanThree.push(ResponseData[j]);
                        }

                        //pgmName1 += ResponseDataPgmName1;
                        //ProgramRunPerMonth1 += parseInt(ResponseData[j].noOfTimesThePgmRunForTheMonth);
                        //Co2EmissioninGrams1 += parseFloat(ResponseData[j].co2EmissioninMG);
                    }
                    else {
                        //pgmName1 += ResponseDataPgmName1;
                        //ProgramRunPerMonth1 += parseInt(ResponseData[j].noOfTimesThePgmRunForTheMonth);
                        //Co2EmissioninGrams1 += parseFloat(ResponseData[j].co2EmissioninMG);
                        if (ResponseData[j].executionMonth !== null) {
                            for (var a = 0; a < lessthanOne.length; a++) {
                                pgmName1 += ResponseDataPgmName1;
                                ProgramRunPerMonth1 += parseInt(lessthanOne[a].noOfTimesThePgmRunForTheMonth);
                                Co2EmissioninGrams1 += parseFloat(lessthanOne[a].co2EmissioninMG);
                                currentRunningTimeinCPUSeconds1 += parseInt(lessthanOne[a].currentRunningTimeinCPUSeconds);
                            }
                            ViZData1.push({
                                "Month": ResponseData[j].executionMonth,
                                "Param": "<1",
                                "Count of custom program": lessthanOne.length,
                                "Run count per month": ProgramRunPerMonth1,
                                "CO2 emission in g": Co2EmissioninGrams1,
                                "currentRunningTimeinCPUSeconds": currentRunningTimeinCPUSeconds1,
                                "Average": Co2EmissioninGrams1 / lessthanOne.length
                            });
                            pgmName1 = 0;
                            ProgramRunPerMonth1 = 0;
                            Co2EmissioninGrams1 = 0;
                            currentRunningTimeinCPUSeconds1 = 0;
                            for (var a = 0; a < GreaterthanOne.length; a++) {
                                pgmName1 += ResponseDataPgmName1;
                                ProgramRunPerMonth1 += parseInt(GreaterthanOne[a].noOfTimesThePgmRunForTheMonth);
                                Co2EmissioninGrams1 += parseFloat(GreaterthanOne[a].co2EmissioninMG);
                                currentRunningTimeinCPUSeconds1 += parseInt(GreaterthanOne[a].currentRunningTimeinCPUSeconds);
                            }
                            ViZData1.push({
                                "Month": ResponseData[j].executionMonth,
                                "Param": "1-2",
                                "Count of custom program": GreaterthanOne.length,
                                "Run count per month": ProgramRunPerMonth1,
                                "CO2 emission in g": Co2EmissioninGrams1,
                                "currentRunningTimeinCPUSeconds": currentRunningTimeinCPUSeconds1,
                                "Average": Co2EmissioninGrams1 / GreaterthanOne.length
                            });
                            pgmName1 = 0;
                            ProgramRunPerMonth1 = 0;
                            Co2EmissioninGrams1 = 0;
                            currentRunningTimeinCPUSeconds1 = 0;
                            for (var a = 0; a < greaterthanTwo.length; a++) {
                                pgmName1 += ResponseDataPgmName1;
                                ProgramRunPerMonth1 += parseInt(greaterthanTwo[a].noOfTimesThePgmRunForTheMonth);
                                Co2EmissioninGrams1 += parseFloat(greaterthanTwo[a].co2EmissioninMG);
                                currentRunningTimeinCPUSeconds1 += parseInt(greaterthanTwo[a].currentRunningTimeinCPUSeconds);
                            }
                            ViZData1.push({
                                "Month": ResponseData[j].executionMonth,
                                "Param": "2-3",
                                "Count of custom program": greaterthanTwo.length,
                                "Run count per month": ProgramRunPerMonth1,
                                "CO2 emission in g": Co2EmissioninGrams1,
                                "currentRunningTimeinCPUSeconds": currentRunningTimeinCPUSeconds1,
                                "Average": Co2EmissioninGrams1 / greaterthanTwo.length
                            });
                            pgmName1 = 0;
                            ProgramRunPerMonth1 = 0;
                            Co2EmissioninGrams1 = 0;
                            currentRunningTimeinCPUSeconds1 = 0;
                            for (var a = 0; a < greaterthanThree.length; a++) {
                                pgmName1 += ResponseDataPgmName1;
                                ProgramRunPerMonth1 += parseInt(greaterthanThree[a].noOfTimesThePgmRunForTheMonth);
                                Co2EmissioninGrams1 += parseFloat(greaterthanThree[a].co2EmissioninMG);
                                currentRunningTimeinCPUSeconds1 += parseInt(greaterthanThree[a].currentRunningTimeinCPUSeconds);
                            }
                            ViZData1.push({
                                "Month": ResponseData[j].executionMonth,
                                "Param": ">3",
                                "Count of custom program": greaterthanThree.length,
                                "Run count per month": ProgramRunPerMonth1,
                                "CO2 emission in g": Co2EmissioninGrams1,
                                "currentRunningTimeinCPUSeconds": currentRunningTimeinCPUSeconds1,
                                "Average": Co2EmissioninGrams1 / greaterthanThree.length
                            });
                            pgmName1 = 0;
                            ProgramRunPerMonth1 = 0;
                            Co2EmissioninGrams1 = 0;
                            currentRunningTimeinCPUSeconds1 = 0;
                        }

                    }
                }
                oModel1.setData(ViZData1);
                this.getView().setModel(oModel1, "vizData1");
                setTimeout(function () {
                    var rows = that.getView().byId("idTable").mAggregations.rows;
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].mAggregations.cells[1].mProperties.text == "<1") {
                            document.getElementById("container-com.sap.sapathon---View1--idTable-rows-row" + i + "-col1").style.backgroundColor = "#99EE99";
                            //document.getElementById("__number0-__clone1").style.color = "White";
                        }
                        else if (rows[i].mAggregations.cells[1].mProperties.text == "1-2") {
                            document.getElementById("container-com.sap.sapathon---View1--idTable-rows-row" + i + "-col1").style.backgroundColor = "#FFFCD1";
                            //document.getElementById("__number0-__clone1").style.color = "White";
                        }
                        else if (rows[i].mAggregations.cells[1].mProperties.text == "2-3") {
                            document.getElementById("container-com.sap.sapathon---View1--idTable-rows-row" + i + "-col1").style.backgroundColor = "#FFBF00";
                            //document.getElementById("__number0-__clone1").style.color = "White";
                        }
                        else if (rows[i].mAggregations.cells[1].mProperties.text == ">3") {
                            document.getElementById("container-com.sap.sapathon---View1--idTable-rows-row" + i + "-col1").style.backgroundColor = "Red";
                            //document.getElementById("__number0-__clone1").style.color = "White";
                        }
                    }
                }, 1000);

            },
            Chart2Data: function (ResponseData) {
                var oChart2Model = new JSONModel();
                oChart2Model.setSizeLimit(100000);
                var Chart2Data = [];
                var pgmName = 0, ResponseDataPgmName = 0, ProgramRunPerMonth = 0, Co2EmissioninGrams = 0;
                var monthArray = [];
                for (var i = 0; i < ResponseData.length; i++) {
                    if (ResponseData[i + 1] && ResponseData[i].executionMonth === ResponseData[i + 1].executionMonth) {
                        if (ResponseData[i].programName != "") {
                            ResponseDataPgmName = 1;
                        }
                        monthArray.push(ResponseData[i]);
                    }
                    else {
                        var topTenData = monthArray.sort(function (x, y) {
                            var n = y.noOfTimesThePgmRunForTheMonth - x.noOfTimesThePgmRunForTheMonth;
                            if (n !== 0) {
                                return n;
                            }

                            return x - y;
                        });
                        if (topTenData.length != 0) {
                            for (var k = 0; k < 10; k++) {
                                pgmName += ResponseDataPgmName;
                                ProgramRunPerMonth += parseInt(topTenData[k].noOfTimesThePgmRunForTheMonth);
                                Co2EmissioninGrams += parseFloat(topTenData[k].co2EmissioninMG);
                            }

                            Chart2Data.push({
                                "Paramater": "Co2 Emission in g",
                                "Value": Co2EmissioninGrams,
                                "Month": ResponseData[i].executionMonth
                            });
                            Chart2Data.push({
                                "Paramater": "Program run per month",
                                "Value": ProgramRunPerMonth,
                                "Month": ResponseData[i].executionMonth
                            });
                            /*Chart2Data.push({
                                "Paramater": "Program Name",
                                "Value": pgmName,
                                "Month": ResponseData[i].executionMonth
                            });*/
                            monthArray = [];
                            pgmName = 0;
                            ResponseDataPgmName = 0;
                            ProgramRunPerMonth = 0;
                            Co2EmissioninGrams = 0;
                        }

                    }
                }
                sap.ui.core.BusyIndicator.hide();
                oChart2Model.setData(Chart2Data);
                this.getView().setModel(oChart2Model, "Chart2Data");
            }
        });
    });
