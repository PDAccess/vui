
<template>
  <div>
    <div :id="this.id" ref="heat"></div>
  </div>
</template>
<script>

import {Chart} from "frappe-charts/dist/frappe-charts.min.esm"

export default {
  name: 'fcart',
    props: {
        id: {
            required: false,
            type: String,
            default: null
        },

        dataSets: {
            required: false,
            type: Array,
            default: () => []
        },

        labels: {
            required: false,
            type: Array,
            default: () => []
        },

        startDate: {
            required: false,
            type: Date,
            default: null
        },

        endDate: {
            required: false,
            type: Date,
            default: null
        },

        dataPoints: {
            required: false,
            type: Object,
            default: () => {}
        },

        countLabel: {
            required: false,
            type: String,
            default: 'Count'
        },

        title: {
            required: false,
            type: String
        },

        height: {
            required: false,
            type: Number,
            default: 300
        },

        type: {
            required: false,
            type: String,
            default: 'bar'
        },

        yMarkers: {
            required: false,
            type: Array,
            default: () => [
                {
                    label: 'Marker',
                    value: 70,
                    options: {
                        labelPos: 'left'
                    }
                }
            ]
        },

        yRegions: {
            required: false,
            type: Array,
            default: () => [
                {
                    label: 'Region',
                    start: -10,
                    end: 50,
                    options: {
                        labelPos: 'right'
                    }
                }
            ]
        },

        colors: {
            required: false,
            type: Array,
            default: () => [
                'purple', '#ffa3ef', 'light-blue'
            ]
        },

        isNavigable: {
            required: false,
            type: Boolean,
            default: false
        },

        valuesOverPoints: {
            required: false,
            type: Boolean,
            default: false
        },

        lineOptions: {
            required: false,
            type: Object,
            default: () => {
                return {
                    dotSize: 4,
                    hideLine: 0,
                    hideDots: 0,
                    heatline: 0,
                    regionFill: 0,
                    areaFill: 0
                }
            }
        },

        axisOptions: {
            required: false,
            type: Object,
            default: () => {
                return {
                    yAxisMode: '',
                    xAxisMode: '',
                    xIsSeries: 0
                }
            }
        },

        maxLegendPoints: {
            required: false,
            type: Number,
            default: 20
        },

        maxSlices: {
            required: false,
            type: Number,
            default: 20
        },

        barOptions: {
            required: false,
            type: Object,
            default: () => {
                return {
                    height: 20,
                    depth: 2,
                    spaceRatio: 0.5,
                    stacked: 0
                }
            }
        },

        discreteDomains: {
            required: false,
            type: Boolean,
            default: true
        },

        tooltipOptions: {
            required: false,
            type: Object,
            default: () => {
                return {
                    formatTooltipX: d => (d + '').toUpperCase(),
                    formatTooltipY: d => d + ' pts'
                }
            }
        }
    },

    data () {
        return {
            chart: null,
            data: {
                labels: this.labels,
                datasets: this.dataSets
            },
            heatmapData: {
                dataPoints: this.dataPoints,
                start: this.startDate,
                end: this.endDate,
                countLabel: this.countLabel
            }
        }
    },

    mounted () {
        this.startChart();
    },

    methods: {
        startChart () {
            const heatMapOptions = {
                data: this.heatmapData,
                type: this.type,
                discreteDomains: this.discreteDomains,
                colors: this.colors,
                height: this.height,
                title: this.title,
                isNavigable: this.isNavigable
            }

            this.chart = new Chart(this.$refs.heat, heatMapOptions)
        },

        export () {
            this.chart.export()
        },

        addDataPoint (label, valueFromEachDataset, index) {
            this.chart.addDataPoint(label, valueFromEachDataset, index)
        },

        removeDataPoint (index) {
            this.chart.removeDataPoint(index)
        },

        updateDataset (datasetValues, index) {
            this.chart.updateDataset(datasetValues, index)
        },

        unbindWindowEvents () {
            this.chart.unbindWindowEvents()
        }
    }
}
</script>
