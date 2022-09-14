var Averager = require("Averager").Averager;
var voltageAverager = new Averager({scale:500});

function onSecond() {
  voltageAverager.add(analogRead(A0) * E.getAnalogVRef() * 2.213);
  volts = voltageAverager.series.hours.getCurrent()[voltageAverager.series.hours.lastBucket];
  NRF.setAdvertising([
      {0x180F : [Math.round(Math.min(1, (volts - 3.2) / (4.22 - 3.2))  * 100)]},
    ]);
  // If graphics is defined
  if (global.g) {
    g.clear(1);
    var txt = volts.toFixed(2) + "V";
    var fontSize = g.getHeight()-8;
    g.setFontAlign(0,0);
    g.drawString("Battery Voltage",g.getWidth()/2,4);
    g.setFontVector(fontSize);
    while (g.stringWidth(txt) > g.getWidth()) {
      g.setFontVector(--fontSize);
    }
    g.drawString(txt, g.getWidth()/2, 4+g.getHeight()/2);
    g.flip();
  }
}
setInterval(onSecond, 5000);
