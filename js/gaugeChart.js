// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var bbSamples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var filteredBB = bbSamples.filter(obj => obj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var bbResults = filteredBB[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var metaResult = metadataArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = bbResults.otu_ids;
    var otuLabels = bbResults.otu_labels;
    var sampleValues = bbResults.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var washingFreq = parseInt(metaResult.wfreq);
    // Create the yticks for the bar chart.
    var xticks = sampleValues.slice(0, 10).reverse();
    var yticks = otuIDs.slice(0,10).map(otuIDs => 'OTU ${otuIDs}').reverse();
    var labels = otuLabels.slice(0,10).reverse();

    // Use Plotly to plot the bar data and layout.
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
    Plotly.newPlot("bar", [barData], barLayout);
    
    // Use Plotly to plot the bubble data and layout.
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
  });
}
