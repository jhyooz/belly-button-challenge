let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

let selector = d3.select('#selDataset');

d3.json(url).then(data => {
    for (let i = 0; i < data.names.length; i++) {
        selector.append('option').text(data.names[i]).property('value', data.names[i]);
    }
    let testSubjectIDNo = selector.property('value');

    HorizontalBarChart(testSubjectIDNo);
    BubbleChart(testSubjectIDNo);
    DemographicInfo(testSubjectIDNo);
    GaugeChart(testSubjectIDNo);
});

// Depending on selected drop down value, change graphics
function optionChanged(selDatasetValue) {
    HorizontalBarChart(selDatasetValue);
    BubbleChart(selDatasetValue);
    DemographicInfo(selDatasetValue);
    GaugeChart(selDatasetValue);
}


function HorizontalBarChart(selDatasetValue) {
    d3.json(url).then(data => {

        // Extract selected dataset from sample data
        const result = data.samples.find(sample => parseInt(sample.id) === parseInt(selDatasetValue));

        // Create data for the horizontal bar chart
        const  barChartData = {
            x: result.sample_values.slice(0,10).reverse(),
            y:  result.otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse(),
            type: 'bar',
            text:  result.otu_labels.slice(0,10).reverse(),
            orientation: 'h',
            marker: {
                color: '#3E7556',
                opacity: 0.75},
        }
        // Define layout for the bar chart
        const barChartLayout  = {
            title: {
                text: "<b>Top 10 OTUs</b>",
                font: { size: 16 }},
            margin: {t: 30, l: 150}
        }
        // Plot the horizontal bar chart
        Plotly.newPlot('bar', [barChartData], barChartLayout);
    })
}

function BubbleChart(selDatasetValue) {
    d3.json(url).then(data => {
        // Extract relevant sample data for the selected dataset
        const result = data.samples.find(sample => parseInt(sample.id) === parseInt(selDatasetValue));

        // Create data for the horizontal bar chart
        const bubbleChartData = {
            x: result.otu_ids,
            y: result.sample_values,
            text: result.otu_labels,
            mode: 'markers',
            marker: {
                size: result.sample_values,
                color: result.otu_ids,
                colorscale: 'Greens'
            }
        }


        // Define layout for the bubble chart
        const bubbleChartLayout = {
            title: {
                text: "<b>Bacteria Cultures Per Sample</b>",
                font: { size: 16 }},
            margin: {t: 30},
            hovermode: 'closest',
            xaxis: {title: "OTU ID"},
        };

        // Plot the bubble chart
        Plotly.newPlot('bubble', [bubbleChartData], bubbleChartLayout);
    })
}


function DemographicInfo(selDatasetValue) {
    d3.json(url).then((data) => {

        const metadata = data.metadata;

        // Filter metadata to obtain information for the selected dataset
        const result = metadata.find(meta => parseInt(meta.id) === parseInt(selDatasetValue));

        // Select the HTML element to display demographic information
        const demographicInfo  = d3.select('#sample-metadata');

        // Clear existing content in the HTML element
        demographicInfo.html('');

        // Display key-value pairs from the selected metadata
        Object.entries(result).forEach(([key, value]) => {
            demographicInfo.append('h6').text(`${key}: ${value}`);
        })
    })
}

// BONUS CHART
function GaugeChart(selDatasetValue) {
    d3.json(url).then(data => {
        const metadata = data.metadata;

        // Extract relevant sample data for the selected dataset
        const result = metadata.find(meta => parseInt(meta.id) === parseInt(selDatasetValue));

        // Create data for the gauge chart
        const gaugeChartData = {
            domain: { x: [0, 1], y: [0, 1] },
            value: result.wfreq,
            type: "indicator",
            mode: "gauge+number",
            title: {
                text: "<b>Belly Button Washing Frequency</b><br><span style='font-size: 14px;'>Scrubs per Week</span>",
                font: { size: 16 }
            },
            gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: 'green'},
                bar: {color: "#3F704D"},
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    {range: [0, 1], color: "#f8f3ec"}, // 0-1
                    {range: [1, 2], color: "#f4f1e5"}, // 1-2
                    {range: [2, 3], color: "#e9e6ca"}, // 2-3
                    {range: [3, 4], color: "#e5e7b3"}, // 3-4
                    {range: [4, 5], color: "#d5e49d"}, // 4-5
                    {range: [5, 6], color: "#b7cc92"}, // 5-6
                    {range: [6, 7], color: "#8cbf88"}, // 6-7
                    {range: [7, 8], color: "#8abb8f"}, // 7-8
                    {range: [8, 9], color: "#85b48a"}, // 8-9
                ]
            },
        }

        // Define layout for the gauge chart
        const gaugeChartLayout = {
            width: 520,
            height: 500,
            margin: { t: 0, b: 145, pad: 8 }
        }

        // Plot the gauge chart
        Plotly.newPlot('gauge', [gaugeChartData], gaugeChartLayout);
    })
}
