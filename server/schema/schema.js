const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema    
} = graphql;

const TimestampType = new GraphQLObjectType({
    name: 'Timestamp',
    fields: () => ({
        timestamp: { type: GraphQLString },
        value: { type: GraphQLInt }
    })
})

const SectionType = new GraphQLObjectType({
    name: 'Section',
    fields: () => ({
        section_id: { type: GraphQLString },
        section_name: { type: GraphQLString },
        wait_values: { type: new GraphQLList(TimestampType) },
        enrol_values: { type: new GraphQLList(TimestampType) },
        avail_values: { type: new GraphQLList(TimestampType) },
        quota_values: { type: new GraphQLList(TimestampType) }
    })
})

const CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: () => ({
        course_code: { type: GraphQLString },
        data: { type: new GraphQLList(SectionType) }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        course: {
            type: CourseType,
            args: { course_code: { type: GraphQLString } },
            async resolve({ db }, { course_code }){
                course_code = course_code.replace(/\s+/g, '').toUpperCase();

                const day_section_arr = await db.collection('day_data').find({ course_code }).toArray();

                // initialize an object for each section
                const results = {}
                day_section_arr.forEach(day_section => {
                    if(!results.hasOwnProperty(day_section.section_id)){
                        results[day_section.section_id] = {
                            section_id: day_section.section_id,
                            section_name: day_section.section_name,
                            wait_values: [],
                            enrol_values: [],
                            avail_values: [],
                            quota_values: []
                        }
                    }
                });

                // iterate through each day
                day_section_arr.forEach(day => {
                    const section_id = day.section_id;
                    const quota_types_arr = ['avail_values', 'enrol_values', 'quota_values', 'wait_values'];
                    
                    quota_types_arr.forEach(quota_type => {
                        // values were stored as objects of objects like so: { *hour*: { *minute*: *value* } }
                        // here we transform them back to arrays of objects like so: { timestamp: *timestamp*, value: *value* }
                        Object.keys(day[quota_type]).forEach(hour => {
                            Object.keys(day[quota_type][hour]).forEach(minute => {
                                const timestamp = (new Date(day.day_timestamp)).setHours(hour, minute, 0, 0);

                                results[section_id][quota_type].push({
                                    timestamp,
                                    value: day[quota_type][hour][minute]
                                });
                            })
                        })

                    })
                });

                // sort all data by timestamp
                Object.keys(results).forEach(key => {
                    const quota_types_arr = ['avail_values', 'enrol_values', 'quota_values', 'wait_values'];
                    quota_types_arr.forEach(quota_type => {
                        results[key][quota_type].sort((obj1, obj2) => obj1['timestamp'] - obj2['timestamp']);
                    })
                })


                return {
                    course_code,
                    data: Object.values(results)
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});