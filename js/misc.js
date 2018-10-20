// OBJECTIFY
function clusterify(colors) {

   var cluster = {
      values: [],
      size: 15
   }

   for (var x = 0; x < colors.length - 1; x+= cluster.size) {

      var value = 0;
      
      for (var y = 0; y < cluster.size; y++) {
         value += colors[x + y];
      }

      value = value / cluster.size;
      cluster.values.push(value)
   }

   return cluster.values;
}

// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }