// OBJECTIFY
function clusterify(colors, size) {

   // CLUSTER SETTINGS
   var cluster = [];

   // LOOP THROUGH ALL COLORS, INCREMENT WITH CLUSTER SIZE
   for (var x = 0; x < colors.length - 1; x+= size) {

      // RESET VALUE
      var value = 0;
      
      // ADD CLUSTER VALUES TOGETHER
      for (var y = 0; y < size; y++) {
         value += colors[x + y];
      }

      // DIVIDE SUM BY CLOSTER SIZE
      value = value / size;

      // PUSH INTO CONTAINER
      cluster.push(value)
   }

   return cluster;
}

// GENERATE RELATIONAL PATHS FOR RGB CHART
function relational_paths(data, settings) {

   // Y-SCALING -- BASED ON OVERALL HIGHEST VALUE
   var yScale = d3.scaleLinear()
      .domain([0, d3.max([data.red.highest, data.blue.highest, data.green.highest])])
      .range([0, settings.height.large])

   // X-SCALING
   var xScale = d3.scaleTime()
      .domain([0, data.red.values.length - 1])
      .rangeRound([0, settings.width.large])

   // GENERATE PATH METHOD
   var pathify = d3.area()
      .x((data, i) => { return xScale(i) })
      .y0(settings.height.large - yScale(0))
      .y1((data) => { return settings.height.large - yScale(data) })

   // CONVERT SCALED VALUES INTO PATHS
   data.red.paths.relational = pathify(data.red.values);
   data.green.paths.relational = pathify(data.green.values);
   data.blue.paths.relational = pathify(data.blue.values);

   // RETURN MODIFIED DATA
   return data;
}

// GENERATE PATH FOR A SINGLE COLOR
function solo_path(data, settings) {

   // Y-SCALING
   var yScale = d3.scaleLinear()
      .domain([0, data.highest])
      .range([0, settings.height.small])

   // X-SCALING
   var xScale = d3.scaleTime()
      .domain([0, data.values.length - 1])
      .rangeRound([0, settings.width.small])

   // GENERATE PATH METHOD
   var pathify = d3.area()
      .x((data, i) => { return xScale(i) })
      .y0(settings.height.small - yScale(0))
      .y1((data) => { return settings.height.small - yScale(data) })

   // GENERATE & RETURN PATH
   return pathify(data.values);
}

// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }