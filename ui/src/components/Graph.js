import React from 'react';
import {
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    LineSeries,
    Highlight,
    Borders,
    DiscreteColorLegend
  } from 'react-vis';
  
import '../../node_modules/react-vis/dist/style.css';

const LINE_COLORS = {
    'quota': '#393B46',
    'avail': '#88d8b0',
    'enrol': '#29A4DE',
    'wait': '#ff6f69'
}

const ITEMS = [
    { title: 'Quota', color: LINE_COLORS.quota },
    { title: 'Enrol', color: LINE_COLORS.enrol },
    { title: 'Avail', color: LINE_COLORS.avail},
    { title: 'Wait', color: LINE_COLORS.wait}
];

export default class Graph extends React.Component {
    state = {
        show_avail: true,
        show_enrol: true,
        show_quota: true,
        show_wait: true,
        lastDrawLocation: null
    }

    toggle_show({title}){
        switch(title){
            case 'Quota': 
            this.setState(prevState => ({show_quota: !prevState.show_quota}));
            break;
            case 'Enrol': 
            this.setState(prevState => ({show_enrol: !prevState.show_enrol}));
            break;
            case 'Avail': 
            this.setState(prevState => ({show_avail: !prevState.show_avail}));
            break;
            case 'Wait': 
            this.setState(prevState => ({show_wait: !prevState.show_wait}));
            break;
        }
    }

    render_line_series(){
        const line_series = [];
        const {show_avail, show_enrol, show_quota, show_wait} = this.state;
        const { avail_values, enrol_values, quota_values, wait_values, section_name, section_id } = this.props.section;

        if(show_avail){
            line_series.push(
                <LineSeries
                    opacity={0.7}
                    color={LINE_COLORS.avail}
                    data={avail_values.map(obj => ({ x: parseInt(obj.timestamp), y: parseInt(obj.value) }))}
                />
            )
        }

        if(show_enrol){
            line_series.push(
                <LineSeries
                    opacity={0.7}
                    color={LINE_COLORS.enrol}
                    data={enrol_values.map(obj => ({ x: parseInt(obj.timestamp), y: parseInt(obj.value) }))}
                />
            )
        }

        if(show_quota){
            line_series.push(
                <LineSeries
                    opacity={0.7}
                    color={LINE_COLORS.quota}
                    data={quota_values.map(obj => ({ x: parseInt(obj.timestamp), y: parseInt(obj.value) }))}
                />
            )
        }

        if(show_wait){
            line_series.push(
                <LineSeries
                    opacity={0.7}
                    color={LINE_COLORS.wait}
                    data={wait_values.map(obj => ({ x: parseInt(obj.timestamp), y: parseInt(obj.value) }))}
                />
            )
        }

        return line_series;
    }

    render(){
        const { section_name, section_id } = this.props.section;
        const { lastDrawLocation } = this.state;
        return (
            <div className='graph_container'>
                <div>{`${section_name} (${section_id})`}</div>
                <div>
                    <DiscreteColorLegend orientation="horizontal" items={ITEMS} onItemClick={this.toggle_show.bind(this)}/>
                    <XYPlot
                        yPadding={10}
                        xType="time"
                        width={700}
                        height={300}
                        margin={{bottom: 55}}
                        xDomain={
                            lastDrawLocation && [
                                lastDrawLocation.left,
                                lastDrawLocation.right
                            ]
                        }
                        yDomain={
                            lastDrawLocation && [
                                lastDrawLocation.bottom,
                                lastDrawLocation.top
                            ]
                        }
                    >
                        <HorizontalGridLines />
                        <VerticalGridLines />
                        {this.render_line_series()}
                        <Borders style={{
                            bottom: {fill: '#fff'},
                            left: {fill: '#fff'},
                            right: {fill: '#fff'},
                            top: {fill: '#fff'}
                        }}/>
                        <XAxis tickLabelAngle={-90}/>
                        <YAxis />
                        <Highlight
                            onBrushEnd={area => this.setState({lastDrawLocation: area})}
                            onDrag={area => {
                                this.setState(({lastDrawLocation}) => ({
                                    lastDrawLocation: {
                                        bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                                        left: lastDrawLocation.left - (area.right - area.left),
                                        right: lastDrawLocation.right - (area.right - area.left),
                                        top: lastDrawLocation.top + (area.top - area.bottom)
                                    }
                                }));
                            }}
                        />
                    </XYPlot>
                </div>
                <div>
                    <button
                        onClick={() => this.setState({lastDrawLocation: null})}
                        className='reset_zoom_btn'
                    >
                        Reset Zoom
                    </button>
                </div>
            </div>
        );
    }
};