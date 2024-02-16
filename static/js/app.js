let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

let selector = d3.select('#selDataset');

d3.json(url).then(data => {
    for (let i = 0; i < data.names.length; i++) {
        selector.append('option').text(data.names[i]).property('value', data.names[i]);
    }
    let testSubjectIDNo = selector.property('value');

    HorizontalBarChart(testSubjectIDNo);
    Bubblechart(testSubjectIDNo);
    DemographicInfo(testSubjectIDNo);

});

// Depending on selected drop down value, change graphics
function optionChanged(selDatasetValue) {
    HorizontalBarChart(selDatasetValue);
    Bubblechart(selDatasetValue);
    DemographicInfo(selDatasetValue);
}


function HorizontalBarChart(selDatasetValue) {
    d3.json(url).then(data => {

        // Extract selected dataset from sample data
        const result =  data.samples.find(sample => parseInt(sample.id) === parseInt(selDatasetValue));
        //var selectedMetadata = response.metadata.filter(data => parseInt(data.id) === parseInt(selectedId));

        // Create data for the horizontal bar chart
        const  barChartData = {
            x: result.sample_values.slice(0,10).reverse(),
            y:  result.otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse(),
            type: 'bar',
            text:  result.otu_labels.slice(0,10).reverse(),
            orientation: 'h'
        };
        // Define layout for the bar chart
        const barChartLayout  = {
            title: "Top 10 OTUs",
            margin: {t: 30, l: 150}
        };
        // Plot the horizontal bar chart
        Plotly.newPlot('bar', [barChartData], barChartLayout);
    })
}

function Bubblechart(selDatasetValue) {
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
                colorscale: 'Earth'
            }
        }


        // Define layout for the bubble chart
        const bubbleChartLayout = {
            title: 'Bacteria Cultures Per Sample',
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
        });
    });
}
