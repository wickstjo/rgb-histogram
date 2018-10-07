// CONVERT TO OBJECT ARRAY
function objectify(color) {

   // CREATE CONTAINER & PUSH STARTING POINT
   var target = [0];

   // PUSH IN RESTO OF ELEMENTS
   for (var z = 0; z < color.length; z++) {
      target.push(color[z]);
   }

   // PUSH IN ENDPOINT
   target.push(0);

   return target;
}

// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }