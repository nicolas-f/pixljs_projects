function onSecond() {
  volts = analogRead(A0) * 3.48 * 2.1;
  var data = {
    v:Math.round(volts*100)/100
  };
  NRF.setAdvertising([
      {0x180F : [volts]},
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
setInterval(onSecond, 1000);

