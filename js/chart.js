// CREATE IMAGE OBJECT
var image = new Image();
image.src = 'data/3.jpg';

// WHEN IMAGE OBJECT IS LOADED, RENDER CHART
window.onload = () => { drawImage(image); };

// CHART RENDERING FUNC
function drawImage(image) {

   // CONSTRUCT IMAGE OBJECT
   var image = {
      obj: image,
      width: image.width,
      height: image.height,
      margin: {
         x: 0,
         y: 0
      }
   }

   // SET IMAGE CANVAS
   $('body').append('<canvas id="myCanvas"></canvas>');
   var canvas = $('#myCanvas')[0];
   canvas.width = image.width;
   canvas.height = image.height;

   // DRAW IMAGE TO CANVAS
   var context = canvas.getContext('2d');
   context.drawImage(image.obj, image.margin.x, image.margin.y);
   
   // HIDE GENERATED IMAGE
   $('#myCanvas').css('display', 'none');

   // FETCH IMAGE DATA & CONSTRUCT DATA OBJECT
   var data = {
      content: context.getImageData(image.margin.x, image.margin.y, image.width, image.height).data,
      red: {
         values: [],
         highest: 0,
         path: ''
      },
      green: {
         values: [],
         highest: 0,
         path: ''
      },
      blue: {
         values: [],
         highest: 0,
         path: ''
      }
   }

   // FILL RGB ARRAYS WITH 255 x 0
   for (var z = 0; z < 256; z++) {
      data.red.values.push(0);
      data.green.values.push(0);
      data.blue.values.push(0);
   }

   // INTERATE THROUGH EVERY PIXEL -- INCREMENT COLOR NUANCE OCCURANCE BY ONE
   for(var i = 0; i < data.content.length; i+=4) {
      data.red.values[data.content[i]] += 1;
      data.green.values[data.content[i + 1]] += 1;
      data.blue.values[data.content[i + 2]] += 1;
   }

   // CONSTRUCT DIV FOR GRAPH
   var div = '<div id="box"></div>';
   $('body').append(div);

   // SETTINGS OBJECT
   var settings = {
      width: $('#box').width(),
      height: $('#box').height(),
      background: {
         red: '#D86666',
         green: '#5ECA66',
         blue: '#7D84DA', 
      },
      border: {
         color: 'white',
         size: 1
      },
      opacity: 0.6,
      cluster: 15
   }

   // MAKE CLUSTERS FOR READABILITY
   data.red.values = clusterify(data.red.values, settings.cluster);
   data.green.values = clusterify(data.green.values, settings.cluster);
   data.blue.values = clusterify(data.blue.values, settings.cluster);

   // FIND HIGHEST VALUE OF EACH COLOR
   data.red.highest = d3.max(data.red.values);
   data.green.highest = d3.max(data.green.values);
   data.blue.highest = d3.max(data.blue.values);

   // Y-SCALING -- BASED ON OVERALL HIGHEST VALUE
   var yScale = d3.scaleLinear()
      .domain([0, d3.max([data.red.highest, data.blue.highest, data.green.highest])])
      .range([0, settings.height])

   // X-SCALING
   var xScale = d3.scaleTime()
      .domain([0, data.red.values.length - 1])
      .rangeRound([0, settings.width])

   // GENERATE PATH METHOD
   var pathify = d3.area()
      .x((data, i) => { return xScale(i) })
      .y0(settings.height - yScale(0))
      .y1((data) => { return settings.height - yScale(data) })


   // CONVERT XY OBJECTS INTO D3 PATHS
   data.red.path = pathify(data.red.values);
   data.green.path = pathify(data.green.values);
   data.blue.path = pathify(data.blue.values);

   log(data)

   // GENERATE GRAPH CANVAS
   var canvas = d3.select('#box').append('svg')
      .attr('width', settings.width)
      .attr('height', settings.height)

   // RED PATH
   canvas.append('path')
      .attr('fill', settings.background.red)
      .attr('stroke', settings.border.color)
      .attr('stroke-width', settings.border.size)
      .attr('d', data.red.path)
      .attr('opacity', settings.opacity)

   // GREEN PATH
   canvas.append('path')
      .attr('fill', settings.background.green)
      .attr('stroke', settings.border.color)
      .attr('stroke-width', settings.border.size)
      .attr('d', data.green.path)
      .attr('opacity', settings.opacity)

   // BLUE PATH
   canvas.append('path')
      .attr('fill', settings.background.blue)
      .attr('stroke', settings.border.color)
      .attr('stroke-width', settings.border.size)
      .attr('d', data.blue.path)
      .attr('opacity', settings.opacity)

}