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

// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }