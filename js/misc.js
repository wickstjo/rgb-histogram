// CONVERT COLOR VALUES TO CLUSTERS
function clusterify(data, settings) {

   // COLOR ARRAY
   var colors = ['red', 'green', 'blue'];

   // LOOP THROUGH COLORS & APPEND A PATH
   colors.forEach(color => {

      // CLUSTER SETTINGS
      var cluster = [];

      // LOOP THROUGH ALL COLORS, INCREMENT WITH CLUSTER SIZE
      for (var x = 0; x < data[color].values.length - 1; x+= settings.cluster) {

         // RESET VALUE
         var value = 0;
         
         // ADD CLUSTER VALUES TOGETHER
         for (var y = 0; y < settings.cluster; y++) {
            value += data[color].values[x + y];
         }

         // DIVIDE SUM BY CLOSTER SIZE
         value = value / settings.cluster;

         // PUSH INTO CONTAINER
         cluster.push(value)
      }

      // REPLACE VALUES ARRAY WITH CLUSTER ARRAY
      data[color].values = cluster;
   });

   // RETURN MODIFIED DATA OBJECT
   return data;
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
         .domain([data[color].highest * settings.multiplier, 0])
         .range([0, settings.height.small])

      // X-SCALING
      var xScale = d3.scaleTime()
         .domain([0, data[color].values.length - 1])
         .rangeRound([0, settings.width.small])

      // GENERATE PATH METHOD
      var pathify = d3.area()
         .x((data, i) => { return xScale(i) })
         .y0(yScale(0))
         .y1((data) => { return yScale(data) })

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
               .attr('cy', (data) => { return yScale(data) })
               .attr('r', dotsize)
               .attr('fill', settings.dot[color])
               .on('mouseover', function(d) {
                  d3.select(this).attr("r", dotsize * 3)
                  $('#tooltip').html(Math.ceil(d))
                  $('#tooltip').css('opacity', 1)
                  var offset = $('#tooltip').width() / 1.5;
                  $('#tooltip').css('left', d3.event.pageX - offset + 'px')
                  $('#tooltip').css('top', d3.event.pageY + 20 + 'px')
               })
               .on('mouseout', function() {
                  d3.select(this).attr("r", dotsize)
                  $('#tooltip').css('opacity', 0)
               })
   });

   // RETURN MODIFIED DATA OBJECT
   return data;
}

// GENERATE RELATIONAL CHART & UPDATE DATA OBJECT
function relational_paths(data, settings) {

   // Y-SCALING -- BASED ON OVERALL HIGHEST VALUE
   var yScale = d3.scaleLinear()
      .domain([d3.max([data.red.highest, data.blue.highest, data.green.highest]) * 1.01, 0])
      .range([0, settings.height.large])

   // X-SCALING
   var xScale = d3.scaleTime()
      .domain([0, data.red.values.length - 1])
      .rangeRound([0, settings.width.large])

   // X-AXIS
   var yAxis = d3.axisRight(yScale)
      .tickPadding(7)
      .ticks(5)

   // GENERATE PATH METHOD
   var pathify = d3.area()
      .x((data, i) => { return xScale(i) })
      .y0(yScale(0))
      .y1((data) => { return yScale(data) })

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

      canvas.append('g')
         .attr('class', 'yAxis')
         .attr('text', 'red')
         .call(yAxis)

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
         canvas.selectAll('circle.group-' + color)
            .data(data[color].values)
               .enter().append('circle')
                  .attr('class', () => { return 'group-' + color })
                  .attr('cx', (data, i) => { return xScale(i) })
                  .attr('cy', (data) => { return yScale(data) })
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