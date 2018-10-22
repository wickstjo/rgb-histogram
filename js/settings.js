// HIDE WINDOW WHEN YOU PRESS ESC
jQuery(document).on('keyup', (evt) => {

   // WHEN 'ESC' OR 'S' IS PRESSED
   if (evt.keyCode == 27 || evt.keyCode == 87) {

      // MAKE SURE SETTINGS WINDOW IS OPEN
      if ($("#settings").css('display') == 'table') {

         // IF 'W' WAS PRESSED
         if (evt.keyCode == 87) {

            // FADE OUT
            $('#relational, #red, #green, #blue').css('opacity', 0);

            // WAIT 200 MS
            sleep(200).then(() => {

               // PURGE CHART SELECTORS
               $('#relational, #red, #green, #blue').html('');

               // BIND QUERY ITEMS
               var src = $('#image').val();
               var cluster = parseInt($('#cluster').val());

               // CREATE NEW IMAGE OBJECT
               var image = new Image();
               image.src = 'data/' + src + '.jpg';

               // GIVE IMAGE OBJECT TIME TO LOAD
               sleep(100).then(() => {

                  // RENDER NEW CHARTS
                  drawImage(image, cluster);

                  // FADE IN
                  $('#relational, #red, #green, #blue').css('opacity', 1);
               });
            });
         }

         // FADINGLY TURN OFF OPACITY
         $("#settings").css('opacity', 0);

         // AFTERWARDS, RENDER OUT SETTINGS WINDOW
         sleep(200).then(() => { $("#settings").css('display', 'none'); });
      }
   
   }

   // WHEN 'Q' IS PRESSED
   if (evt.keyCode == 81) {

      // MAKE SURE SETTINGS WINDOW IS CLOSED
      if ($("#settings").css('display') == 'none') {

         // DISPLAY SELECTOR AS TABLE
         $("#settings").css('display', 'table');

         // FADINGLY TURN ON OPACITY
         sleep(100).then(() => { $("#settings").css('opacity', 1) });
      }
   
   }
});