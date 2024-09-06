var Averager = require("Averager").Averager;
var voltageAverager = new Averager({scale:500});

function onTimer() {
  voltageAverager.add(analogRead(A0) * E.getAnalogVRef() * 2.213);
  let volts = voltageAverager.series.hours.getCurrent()[voltageAverager.series.hours.lastBucket];
  NRF.setAdvertising([
    {0x180F : [Math.round(Math.min(1, (volts - 3.2) / (4.22 - 3.2))  * 100)]},
  ]);
  // Get the temperature as a string
  var t = E.getTemperature().toFixed(1);
  // Clear display
  g.clear();
  // Use the small font for a title
  g.setFontBitmap();
  g.drawString(volts.toFixed(2)+" V - Temperature:");
  // Use a large font for the value itself
  g.setFontVector(40);
  g.drawString(t, (g.getWidth()-g.stringWidth(t))/2,10);
  // Update the screen
  g.flip();
}

// Update temperature every 2 seconds
setInterval(onTimer,5000);
// Update temperature immediately
onTimer();
