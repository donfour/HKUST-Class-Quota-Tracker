// GraphQL queries
import { gql } from 'apollo-boost';

const getCourseQuery = gql`
query GetCourseQuery($course_code: String!){
	course(course_code: $course_code){
    course_code
    data {
      section_id
      section_name
      wait_values {
        timestamp
        value
      }
      enrol_values {
        timestamp
        value
      }
      avail_values {
        timestamp
        value
      }
      quota_values {
        timestamp
        value
      }
    }
  }
}
`;

export { getCourseQuery };