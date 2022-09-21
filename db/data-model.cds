
context app.db {

entity Sales {
  key ID          : Integer;
      region      : String(100);
      country     : String(100);
      org         : String(4);
      amount      : Integer;
      comments    : String(100);
      criticality : Integer;
};
entity SampleData{
  key ID   : Integer;
  sapServer    :  String(100);
  usage :  String(20);
  databaseServer : String(10);
  programName : String(10);
  activeUsersOfTheProgram : String(100);
  noOfTimesThePgmRunForTheMonth : String(10);
  executionMonth : String(10);
  currentRunningTimeinCPUSeconds : String(10);
  energyConsumptioninMWH: String(100);
  co2EmissioninMG: String(100);
};

}

@cds.persistence.exists
@cds.persistence.calcview
entity CV_SALES {
  key REGION  : String(100);
      AMOUNT  : Integer;
}

@cds.persistence.exists
@cds.persistence.calcview
entity CV_SESSION_INFO {
  key ITEM     : String(5000);
      VALUE    : String(5000);
}

