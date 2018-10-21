// CREATE COLOR CLUSTER
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

   // RETURN CLUSTER
   return cluster;
}

// GENERATE PATH FOR A SINGLE COLOR
function solo_paths(data, settings) {

   // COLOR ARRAY
   var colors = ['red', 'green', 'blue'];

   // FETCH DOT RADIUS BASED ON CLUSTER SIZE -- TO AVOID EXECUTION DURING ENTER LOOP
   var dotsize = clusterdot(settings, 'small');

   // LOOP THROUGH COLORS & APPEND A PATH
   colors.forEach(color => {

      // Y-SCALING
      var yScale = d3.scaleLinear()
         .domain([0, data[color].highest * settings.multiplier])
         .range([0, settings.height.small])

      // X-SCALING
      var xScale = d3.scaleTime()
         .domain([0, data[color].values.length - 1])
         .rangeRound([0, settings.width.small])

      // GENERATE PATH METHOD
      var pathify = d3.area()
         .x((data, i) => { return xScale(i) })
         .y0(settings.height.small - yScale(0))
         .y1((data) => { return settings.height.small - yScale(data) })

      // GENERATE PATH
      data[color].paths.solo = pathify(data[color].values);

      // GENERATE GRAPH CANVAS
      var canvas = d3.select('#' + color).append('svg')
         .attr('width', settings.width.small)
         .attr('height', settings.height.small)

      // ADD PATH
      canvas.append('path')
         .attr('fill', settings.background[color])
         .attr('d', data[color].paths.solo)
         .attr('opacity', settings.opacity)

      // ADD DOTS
      canvas.selectAll('circle')
         .data(data[color].values)
            .enter().append('circle')
               .attr('cx', (data, i) => { return xScale(i) })
               .attr('cy', (data) => { return settings.height.small - yScale(data) })
               .attr('r', dotsize)
               .attr('fill', settings.dot[color])
   });

   // RETURN MODIFIED DATA OBJECT
   return data;
}

// GENERATE RELATIONAL CHART & UPDATE DATA OBJECT
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

   // FETCH DOT RADIUS BASED ON CLUSTER SIZE
   var dotsize = clusterdot(settings, 'large');

   // GENERATE GRAPH CANVAS
   var canvas = d3.select('#relational').append('svg')
      .attr('width', settings.width.large)
      .attr('height', settings.height.large)

      // COLOR ARRAY
      var colors = ['red', 'green', 'blue'];

      // LOOP THROUGH COLORS & APPEND A PATH
      colors.forEach(color => {

         // ADD PATH
         canvas.append('path')
            .attr('fill', settings.background[color])
            .attr('d', data[color].paths.relational)
            .attr('opacity', settings.opacity)

         // ADD DOTS
         canvas.selectAll('circle')
            .data(data[color].values)
               .enter().append('circle')
                  .attr('cx', (data, i) => { return xScale(i) })
                  .attr('cy', (data) => { return settings.height.large - yScale(data) })
                  .attr('r', dotsize)
                  .attr('fill', settings.dot[color])
      });

   // RETURN MODIFIED DATA OBJECT
   return data;
}

// DOT SIZE BASED ON CLUSTER SIZE
function clusterdot(settings, window) {

   // DEFAULT SIZE
   var size = 0;

   // FOR LARGE DIV
   if (window == 'large') {

      // DEFAULT TO LARGE, ELSE MEDIUM
      size = settings.radius.large;
      if (settings.cluster < 15) { size = settings.radius.medium; }

   // FOR SMALL DIV
   } else {

      // DEFAULT TO MEDIUM, ELSE SMALL
      size = settings.radius.medium;
      if (settings.cluster < 15) { size = settings.radius.small; }
   }
   
   // RETURN NEW DOTSIZE
   return size;
}

// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }