function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then(function(metadata) {
    var sample_panel = d3.select("#sample-metadata");
  
    // Use `.html("") to clear any existing metadata
    sample_panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(metadata).forEach(function(object) {
      var row = sample_panel.append("p");
      row.text(`${object}`);
    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  }); 
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // https://plot.ly/javascript/bubble-charts/
d3.json(`/samples/${sample}`).then(function(sampleData) {
  var sample_values = sampleData.sample_values;
  var otu_ids = sampleData.otu_ids;
  var otu_labels = sampleData.otu_labels;

  var traceBubble = {
    x: otu_ids,
    y: sample_values,
    type: 'scatter',
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids,
    }
  };

  var data2 = [traceBubble];

  var layoutBubble = {
    title: 'Belly Bubble',
    };


    // @TODO: Build a Bubble Chart using the sample data
  Plotly.newPlot("bubble", data2, layoutBubble);
});
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  d3.json(`/samples/${sample}`).then(function(sampleData) {
    var sample_values = sampleData.sample_values;
    var otu_ids = sampleData.otu_ids;
    var otu_labels = sampleData.otu_labels;

    var tracePie = {
      values: sample_values.slice(0, 10),
      labels: otu_ids.slice(0, 10),
      type: "pie",
      hovertext: otu_labels,
    };

    var pieData = [tracePie];

    var layoutPie = {
      title: "Belly Pie",
      height: 400,
      width: 400
    }

    Plotly.newPlot("pie", pieData, layoutPie);
  });
}

buildCharts();

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
