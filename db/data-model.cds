context app.db {

    entity SampleData {
        key ID                             : Integer;
            sapServer                      : String(100);
            usage                          : String(20);
            databaseServer                 : String(10);
            programName                    : String(10);
            activeUsersOfTheProgram        : String(100);
            noOfTimesThePgmRunForTheMonth  : String(10);
            executionMonth                 : String(10);
            currentRunningTimeinCPUSeconds : String(10);
            energyConsumptioninMWH         : String(100);
            co2EmissioninMG                : String(100);
    };

}
