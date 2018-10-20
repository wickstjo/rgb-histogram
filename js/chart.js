// CREATE IMAGE OBJECT
var image = new Image();
image.src = 'data/3.jpg';

// WHEN IMAGE OBJECT IS LOADED, RENDER CHART
window.onload = () => { drawImage(image); };

// CHART RENDERING FUNC
function drawImage(image) {

   // SET IMAGE CANVAS
   $('body').append('<canvas id="myCanvas"></canvas>');
   var canvas = $('#myCanvas')[0];
   canvas.width = image.width;
   canvas.height = image.height;

   // DRAW IMAGE TO CANVAS
   var context = canvas.getContext('2d');
   context.drawImage(image, 0, 0);
   
   // HIDE GENERATED IMAGE
   $('#myCanvas').css('display', 'none');

   // GENERATE SELECTORS
   var selectors = `
      <div id="shared">
         <table><tr>
            <td><div id="red"></div></td>
            <td><div id="green"></div></td>
            <td><div id="blue"></div></td>
         </tr></table>
      </div>
      <div id="relational"></div>
   `;

   // RENDER THEM IN
   $('body').append(selectors);

   // FETCH IMAGE DATA & CONSTRUCT DATA OBJECT
   var data = {
      content: context.getImageData(0, 0, canvas.width, canvas.height).data,
      red: {
         values: [],
         highest: 0,
         paths: {
            relational: '',
            solo: ''
         }
      },
      green: {
         values: [],
         highest: 0,
         paths: {
            relational: '',
            solo: ''
         }
      },
      blue: {
         values: [],
         highest: 0,
         paths: {
            relational: '',
            solo: ''
         }
      }
   }

   // CSS SETTINGS -- HELP OBJECT FOR SETTINGS
   var css = {
      border: { size: 4 },
      padding: { body: 30, div: 15 }
   }

   // SETTINGS OBJECT
   var settings = {
      width: {
         large: window.innerWidth - (css.border.size * 2) - (css.padding.body * 2),
         small: (window.innerWidth - (css.border.size * 6) - (css.padding.body * 2) - (css.padding.div * 2)) / 3
      },
      height: {
         large: (window.innerHeight - (css.padding.body * 2) - (css.border.size * 4) - (css.padding.div)) * 0.75,
         small: (window.innerHeight - (css.padding.body * 2) - (css.border.size * 4) - (css.padding.div)) * 0.25, 
      },
      background: {
         red: '#D86666',
         green: '#5ECA66',
         blue: '#7D84DA', 
      },
      border: {
         color: 'white',
         size: 0
      },
      opacity: 0.6,
      cluster: 15
   }

   // SET SCALED WIDTHS AND HEIGHTS OF SELECTORS
   $('#red, #green, #blue').width(settings.width.small)
   $('#red, #green, #blue').height(settings.height.small)
   $('#relational').width(settings.width.large)
   $('#relational').height(settings.height.large)

   // FILL RGB ARRAYS WITH 255 x 0
   for (var z = 0; z < 256; z++) {
      data.red.values.push(0);
      data.green.values.push(0);
      data.blue.values.push(0);  
   }

   // INTERATE THROUGH EVERY PIXEL -- INCREMENT COLOR NUANCE INDEX
   for(var i = 0; i < data.content.length; i+=4) {
      data.red.values[data.content[i]] += 1;
      data.green.values[data.content[i + 1]] += 1;
      data.blue.values[data.content[i + 2]] += 1;
   }

   // MAKE COLOR CLUSTERS FOR READABILITY
   data.red.values = clusterify(data.red.values, settings.cluster);
   data.green.values = clusterify(data.green.values, settings.cluster);
   data.blue.values = clusterify(data.blue.values, settings.cluster);

   // FIND HIGHEST VALUE OF EACH COLOR
   data.red.highest = d3.max(data.red.values);
   data.green.highest = d3.max(data.green.values);
   data.blue.highest = d3.max(data.blue.values);

   // GENERATE & PUSH RELATIONAL PATHS
   data = relational_paths(data, settings);

      // GENERATE GRAPH CANVAS
      var canvas = d3.select('#relational').append('svg')
         .attr('width', settings.width.large)
         .attr('height', settings.height.large)

      // RED PATH
      canvas.append('path')
         .attr('fill', settings.background.red)
         .attr('stroke', settings.border.color)
         .attr('stroke-width', settings.border.size)
         .attr('d', data.red.paths.relational)
         .attr('opacity', settings.opacity)

      // GREEN PATH
      canvas.append('path')
         .attr('fill', settings.background.green)
         .attr('stroke', settings.border.color)
         .attr('stroke-width', settings.border.size)
         .attr('d', data.green.paths.relational)
         .attr('opacity', settings.opacity)

      // BLUE PATH
      canvas.append('path')
         .attr('fill', settings.background.blue)
         .attr('stroke', settings.border.color)
         .attr('stroke-width', settings.border.size)
         .attr('d', data.blue.paths.relational)
         .attr('opacity', settings.opacity)

   // GENERATE & PUSH RED PATH
   data.red.paths.solo = solo_path(data.red, settings);

      // GENERATE GRAPH CANVAS
      var canvas = d3.select('#red').append('svg')
         .attr('width', settings.width.small)
         .attr('height', settings.height.small)

      // RED PATH
      canvas.append('path')
         .attr('fill', settings.background.red)
         .attr('stroke', settings.border.color)
         .attr('stroke-width', settings.border.size)
         .attr('d', data.red.paths.solo)
         .attr('opacity', settings.opacity)

   // GENERATE & PUSH GREEN PATH
   data.green.paths.solo = solo_path(data.green, settings);

      // GENERATE GRAPH CANVAS
      var canvas = d3.select('#green').append('svg')
         .attr('width', settings.width.small)
         .attr('height', settings.height.small)

      // GREEN PATH
      canvas.append('path')
         .attr('fill', settings.background.green)
         .attr('stroke', settings.border.color)
         .attr('stroke-width', settings.border.size)
         .attr('d', data.green.paths.solo)
         .attr('opacity', settings.opacity)

   // GENERATE & PUSH BLUE PATH
   data.blue.paths.solo = solo_path(data.blue, settings);

      // GENERATE GRAPH CANVAS
      var canvas = d3.select('#blue').append('svg')
         .attr('width', settings.width.small)
         .attr('height', settings.height.small)

      // BLUE PATH
      canvas.append('path')
         .attr('fill', settings.background.blue)
         .attr('stroke', settings.border.color)
         .attr('stroke-width', settings.border.size)
         .attr('d', data.blue.paths.solo)
         .attr('opacity', settings.opacity)

   log(data)
   log(settings)
}