import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { getCourseQuery } from '../queries/queries';

// components
import Graph from './Graph';

const TEN_MINUTES_IN_MS = 600000;

export default class Main extends Component{
    state = {
        input: 'MATH1012'
    }
    render(){
        return (
            <Query
                query={ getCourseQuery }
                variables={{ course_code: this.state.input }}
                pollInterval={TEN_MINUTES_IN_MS}
            >
                    {({ loading, error, data }) => {
                        return (
                            <div className='app'>
                                <h1 className='title'>HKUST Class Quota Tracker (Winter 2018)</h1>
                                <p className='instruction'>
                                    Type in a course code to search. Drag on the charts to zoom in. Click on legend to hide / show lines. <br/>
                                    It might take 5-10 seconds to load at first, as the server goes to sleep after being idle for a while.
                                </p>
                                <input
                                    className='searchbar'
                                    onChange={e => this.setState({input: e.target.value })}
                                    placeholder={'Search for a course'}
                                />
                                {
                                    error ? `Error! ${error.message}` :
                                    loading ? "Loading..." :
                                    <div>
                                        <div className='course_code'>{data.course.course_code}</div>
                                        {
                                            data.course.data.length !== 0 ?
                                            data.course.data.map((section, i) => <Graph key={i} section={section}/>) :
                                            'Course not found!'
                                        }
                                    </div>
                                }
                                <p className='description'>This app srapes the <a target='_blank' href='https://w5.ab.ust.hk/wcq/cgi-bin/' rel='noopener noreferrer'>HKUST Class Quota</a> page every 10 minutes and keeps track of the availability of all courses. Is it useful? Debatable. But isn't it fun to see people get rekt by the SOSC1980 waitlist?</p>
                            </div>
                        )
                    }}
            </Query>
        )
    }
};