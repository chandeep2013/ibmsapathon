using {app.db as db} from '../db/data-model';

/*using {CV_SALES, CV_SESSION_INFO} from '../db/data-model';*/
service CatalogService @(path : '/catalog') {

    @cds.query.limit : {
        default : 10000,
        max     : 100000
    }
    @readonly
    entity SampleData as
        select from db.SampleData {
            *
        };
};
