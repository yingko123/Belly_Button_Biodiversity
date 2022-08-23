//***************************************************************//
// function to initiate dashboard when index.html first launch
//**************************************************************//
function init() {
  // Grab user selected sampleNames(reference) 
  // from the dropdown select element
  var selector = d3.select("#selDataset");
  
  // load in the full set of samples.json data
  d3.json("samples.json").then((data) => {
    // sampleNames = list of 153 numbers
    var sampleNames = data.names;
    // show all 153 names(numbers) option in the dropdown window 
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
};

init();

// ************************************************************************//
// Refresh dashboard on "change" event in index.html (line 26)
// user selected "Test Subject ID No.:" is "newSample"
// ************************************************************************//
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
};

// ************************************************************************//
// Demographics Panel 
// ************************************************************************//
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    console.log(data);
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result)
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
};

// ************************************************************************//
// Bar Chart
// ************************************************************************//
// 1. Create the buildCharts function.
function buildCharts(subjectID) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var subjectSample = samples.filter(sampleObj => sampleObj.id == subjectID)[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = subjectSample.otu_ids;
    var otuLabels = subjectSample.otu_labels;
    var sampleValues = subjectSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in ascending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).reverse().map(otu => `OTU ${otu}`);
    
    // 8. Create the trace for the bar chart. 
    let barTrace = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: 'royalblue'
      }
    }
    
    var barData = [barTrace];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: '<b>Top 10 Bacteria Cultures Found</b>'
     };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData, barLayout);

// ************************************************************************//
// Bubble Charts 
// ************************************************************************//
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size:sampleValues,
        color: otuIds,
        colorscale: "Bluered"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Cultures Per Sample</b>',
      //showlegend: false,
      height: 600,
      width: 1200
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

// ************************************************************************//
// gauge Charts 
// ************************************************************************//
    // 4. Create the trace for the gauge chart.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == subjectID);
    var frequency = resultArray[0].wfreq;

    var gaugeData = [{
      domain: {x:[0,1], y:[0,1]},
      value: frequency,
      title: {text: '<b>Belly Button Washing Frequency</b><br>Scrubs per week'},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        bar: {color: "midnightblue"},
        steps: [
          { range: [0, 2], color: "orchid" },
          { range: [2, 4], color: "plum" },
          { range: [4, 6], color: "slateblue" },
          { range: [6, 8], color: "cornflowerblue" },
          { range: [8, 10], color: "royalblue" },
        ],
      }  
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 400, height: 500, margin:{t:0, b:0}};

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
};    
  
  
