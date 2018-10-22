// CREATE IMAGE OBJECT
var image = new Image();
image.src = 'data/Third.jpg';

// WHEN IMAGE OBJECT IS LOADED, RENDER CHART
window.onload = () => { drawImage(image); };

// CHART RENDERING FUNC
function drawImage(image, cluster_size = 3) {

   // SET IMAGE CANVAS
   var canvas = $('#myCanvas')[0];
   canvas.width = image.width;
   canvas.height = image.height;

   // DRAW IMAGE TO CANVAS
   var context = canvas.getContext('2d');
   context.drawImage(image, 0, 0);
   
   // HIDE GENERATED IMAGE
   $('#myCanvas').css('display', 'none');

   // FETCH IMAGE DATA & CONSTRUCT PLACEHOLDERS FOR PARSED DATA
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

   // CSS SETTINGS
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
      dot: {
         red: '#D86666',
         green: '#5ECA66',
         blue: '#7D84DA', 
      },
      radius: {
         large: 6,
         medium: 4.5,
         small: 2
      },
      opacity: 0.6,
      cluster: cluster_size,
      multiplier: 1.02
   }

   // SET SCALED WIDTHS AND HEIGHTS OF SELECTORS
   $('#red, #green, #blue').width(settings.width.small);
   $('#red, #green, #blue').height(settings.height.small);
   $('#relational').width(settings.width.large);
   $('#relational').height(settings.height.large);

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

   // CONVERT COLOR VALUES TO CLUSTERS
   data = clusterify(data, settings);

   // FIND HIGHEST VALUE OF EACH COLOR
   data.red.highest = d3.max(data.red.values);
   data.green.highest = d3.max(data.green.values);
   data.blue.highest = d3.max(data.blue.values);

   // GENERATE CHART FOR RELATIONAL & SOLO CHARTS & RETURN MODIFIED DATA OBJECT
   data = relational_paths(data, settings);
   data = solo_paths(data, settings);

   log(data)
   log(settings)
}