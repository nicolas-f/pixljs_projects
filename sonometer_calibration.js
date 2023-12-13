var button_watch = [0,0,0,0];
Bluetooth.setConsole(1);
backlight = 0;
Pixl.setLCDPower(false);
var idRefreshInterval = 0;
var noiseLevel=-26.30;

function disableButtons() {
  for(id=0;id<4;id++) {
    if(button_watch[id] > 0) {
      clearWatch(button_watch[id]);
    }
    button_watch[id] = 0;
  }
}

function homeScreen() {
  Pixl.setLCDPower(true);
  LED.write(0);
  g.clear();
  g.setFontBitmap();
  var t = new Date(); // get the current date and time
  var time_date = t.getFullYear()+"/"+("0"+(t.getMonth()+1)).substr(-2)+"/"+("0"+t.getDate()).substr(-2)+" "+t.getHours()+":"+("0"+t.getMinutes()).substr(-2);
  g.setFontAlign(1, -1).drawString("Start-", g.getWidth(), 2);
  g.setFontAlign(1, 1).drawString("Stop-", g.getWidth(), g.getHeight());
  g.setFontAlign(-1, 1).drawString("-On/Off", 0, g.getHeight());
  g.setFontAlign(-1, -1).drawString("-Calibration", 0, 0);  
  g.setFont("Vector16").setFontAlign(0, 0).drawString(noiseLevel+" dBFS", g.getWidth()/2, g.getHeight()/2);
  g.flip();
  disableButtons();
}

homeScreen();

