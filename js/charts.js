function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var bbSamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredBB = bbSamples.filter(obj => obj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var bbResults = filteredBB[0];
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var metaResult = metadataArray[0];
    // 3. Create a variable that holds the washing frequency.
    var washingFreq = parseInt(metaResult.wfreq);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = bbResults.otu_ids;
    var otuLabels = bbResults.otu_labels;
    var sampleValues = bbResults.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var xticks = sampleValues.slice(0, 10).reverse();
    var yticks = otuIDs.slice(0,10).map(otuIDs => 'OTU ${otuIDs}').reverse();
    var labels = otuLabels.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: labels
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Found in BellyButtons"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);
  });

  // 1. Create the trace for the bubble chart.
  var bubbleData = {
   x: otuIDs,
   y: sampleValues,
   text: otuLabels,
   mode: "markers",
   marker: {
    size: sampleValues,
    color: otuIDs
   }
  };

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: "Bacteria Cultures per Sample",
    xaxis: {title: "OTU IDs"},
    showlegend: false
  };

  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 

// 4. Create the trace for the gauge chart.
var gaugeData = {
  value: washingFreq,
  title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
  type: "indicator",
  mode: "gauge+number",
  gauge: {
    axis: {range: [0,10]},
    steps: [
      {range: [0,2], color:"#ea2c2c"},
      {range: [2,4], color:"#ea822c"},
      {range: [4,6], color:"#ee9c00"},
      {range: [6,8], color:"#eecc00"},
      {range: [8,10], color:"#d4ee00"}
    ]
  }
};

// 5. Create the layout for the gauge chart.
var gaugeLayout = { 
  width: 600, height: 450, margin: {t: 0, b: 0}
};

// 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", [gaugeData], gaugeLayout);

}
