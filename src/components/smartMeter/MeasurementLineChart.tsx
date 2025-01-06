import React from 'react';
import { MeasurementDto } from '../../api/openAPI';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

interface MeasurementLineChartProps {
    measurements: MeasurementDto[];
}

const MeasurementLineChart: React.FC<MeasurementLineChartProps> = ({ measurements }) => {
    const dataPoints = {
        phase1: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.voltagePhase1,
        })),
        phase2: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.voltagePhase2,
        })),
        phase3: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.voltagePhase3,
        })),
        positiveActivePower: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.positiveActivePower,
        })),
        positiveActiveEnergyTotal: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.positiveActiveEnergyTotal,
        })),
        negativeActivePower: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.negativeActivePower,
        })),
        negativeActiveEnergyTotal: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.negativeActiveEnergyTotal,
        })),
        reactiveEnergyQuadrant1Total: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.reactiveEnergyQuadrant1Total,
        })),
        reactiveEnergyQuadrant3Total: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.reactiveEnergyQuadrant3Total,
        })),
        totalPower: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.totalPower,
        })),
        currentPhase1: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.currentPhase1,
        })),
        currentPhase2: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.currentPhase2,
        })),
        currentPhase3: measurements.map((measurement) => ({
            x: new Date(measurement.timestamp ?? ''),
            y: measurement.currentPhase3,
        })),
    };

    const options = {
        chart: {
            type: 'line',
        },
        title: {
            text: 'Measurements',
        },
        xAxis: {
            title: {
                text: 'Timestamp',
            },
            type: 'datetime',
            dateTimeLabelFormats: {
                hour: '%H:%M:%S',
            },
        },
        yAxis: {
            title: {
                text: 'Value',
            },
        },
        series: [
            {
                name: 'Phase 1 Voltage',
                data: dataPoints.phase1.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Phase 2 Voltage',
                data: dataPoints.phase2.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Phase 3 Voltage',
                data: dataPoints.phase3.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Positive Active Power',
                data: dataPoints.positiveActivePower.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Positive Active Energy Total',
                data: dataPoints.positiveActiveEnergyTotal.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Negative Active Power',
                data: dataPoints.negativeActivePower.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Negative Active Energy Total',
                data: dataPoints.negativeActiveEnergyTotal.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Reactive Energy Quadrant 1 Total',
                data: dataPoints.reactiveEnergyQuadrant1Total.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Reactive Energy Quadrant 3 Total',
                data: dataPoints.reactiveEnergyQuadrant3Total.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Total Power',
                data: dataPoints.totalPower.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Current Phase 1',
                data: dataPoints.currentPhase1.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Current Phase 2',
                data: dataPoints.currentPhase2.map((point) => [point.x.getTime(), point.y]),
            },
            {
                name: 'Current Phase 3',
                data: dataPoints.currentPhase3.map((point) => [point.x.getTime(), point.y]),
            },
        ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default MeasurementLineChart;
