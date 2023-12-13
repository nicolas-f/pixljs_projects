var button_watch = [0,0,0,0];
Bluetooth.setConsole(1);
backlight = 0;
Pixl.setLCDPower(false);
var idRefreshInterval = 0;
// force timezone to UTC+0200
E.setTimeZone(1);

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
  g.setFontAlign(-1, -1);
  //g.setFontPixeloidSans(1);
  g.setFontBitmap();
  var t = new Date(); // get the current date and time
  var time_date = t.getFullYear()+"/"+("0"+(t.getMonth()+1)).substr(-2)+"/"+("0"+t.getDate()).substr(-2)+" "+t.getHours()+":"+("0"+t.getMinutes()).substr(-2);
  g.drawString(time_date, g.getWidth() / 2 - g.stringMetrics(time_date).width / 2, 0);
  g.flip();
  disableButtons();
  if(idRefreshInterval > 0) {
    clearTimeout(idRefreshInterval);
  }
  var next_minute = Date();
  next_minute.setHours(next_minute.getHours(), next_minute.getMinutes(), 0, 0);
  idRefreshInterval = setTimeout(homeScreen, next_minute + 60000 - Date());
}

homeScreen();

