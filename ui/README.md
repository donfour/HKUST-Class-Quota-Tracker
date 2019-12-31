## HKUST Class Quota Tracker Web Interface

Check out the [live site](https://donfour.github.io/HKUST-Class-Quota-Tracker-UI).

tl;dr

1. Excellent GraphQL tutorial [here](https://youtu.be/Y0lDGjwRYKw). But note that his code for making GraphQL requests in React is outdated, it is recommended to use the [Query component](https://www.apollographql.com/docs/react/react-apollo-migration.html) in Apollo 2.1.
2. [Article](https://www.mongodb.com/blog/post/schema-design-for-time-series-data-in-mongodb), and [article](https://www.mongodb.com/blog/post/time-series-data-and-mongodb-part-2-schema-design-best-practices) on storing timeseries data in MongoDB.
3. Don't use [React Timeseries Charts](https://software.es.net/react-timeseries-charts/#/) for plotting timeseries data, it's hard to use. Use [React-Vis](https://uber.github.io/react-vis/) instead.
4. JavaScript's Date object uses your machine's timezone by default, which is a pain if you deploy to a machine in a different timezone (e.g. deploying to Heroku). My solution was to convert all time to UTC.
