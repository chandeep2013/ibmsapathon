context app.db {

    entity SampleData {
        key ID                             : Integer;
            sapServer                      : String(100);
            usage                          : String(20);
            databaseServer                 : String(10);
            programName                    : String(100);
            activeUsersOfTheProgram        : String(100);
            noOfTimesThePgmRunForTheMonth  : String(100);
            executionMonth                 : String(10);
            currentRunningTimeinCPUSeconds : String(100);
            energyConsumptioninMWH         : String(100);
            co2EmissioninMG                : String(100);
    };

}
