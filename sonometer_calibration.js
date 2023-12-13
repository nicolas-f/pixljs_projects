var PIN_BUZZER = D6; // Yellow cable pin Buzzer is connected to

var button_watch = [0,0,0,0];
Bluetooth.setConsole(1);
backlight = 0;
Pixl.setLCDPower(false);
var idRefreshInterval = 0;
var noiseLevel=-26.30;
var gainCalibration=0.0;
var bufA = new Int16Array(256);
var bufB = new Int16Array(256);
var gainChanged = false;
var buzzerEnabled = false;
var micEnabled = false;

function readGainCalibration() {
  fp = require("Storage").open("gaincalib.cfg", 'r');
  data=fp.readLine();
  if(data) {
      gainCalibration = parseFloat(data);
  }
}

function writeGainCalibration() {
  fp = require("Storage").open("gaincalib.cfg", 'w');
  fp.write(gainCalibration.toFixed(1)+"\n");
}

readGainCalibration();

var mainmenu = {
  "" : {
    "title" : "-- Settings --"
  },
  "Backlight On" : function() { LED1.set(); },
  "Backlight Off" : function() { LED1.reset(); },
  "Calibration" : {
    value : gainCalibration,
    min:-50,max:50,step:0.1,
    onchange : v => { gainCalibration=v;gainChanged=true; }
  },
  "Exit" : function() { if(gainChanged) {writeGainCalibration();gainChanged=false;} homeScreen(); },
};

function disableButtons() {
  for(id=0;id<4;id++) {
    if(button_watch[id] > 0) {
      clearWatch(button_watch[id]);
    }
    button_watch[id] = 0;
  }
}

function switchBuzzerState() {
  buzzerEnabled = !buzzerEnabled;
  if(buzzerEnabled) {
    analogWrite(PIN_BUZZER,0.5,{freq:4000});
  } else {
    digitalWrite(PIN_BUZZER,0);
  }
  homeScreen();
}

function homeScreen() {
  Pixl.setLCDPower(true);
  g.clear();
  g.setFontBitmap();
  var t = new Date(); // get the current date and time
  var time_date = t.getFullYear()+"/"+("0"+(t.getMonth()+1)).substr(-2)+"/"+("0"+t.getDate()).substr(-2)+" "+t.getHours()+":"+("0"+t.getMinutes()).substr(-2);
  g.setFontAlign(1, -1).drawString((micEnabled ? "Stop" : "Start")+" Mic-", g.getWidth(), 2);
  g.setFontAlign(1, 1).drawString((buzzerEnabled ? "Stop" : "Start")+" Buzzer-", g.getWidth(), g.getHeight());
  g.setFontAlign(-1, 1).drawString("-On/Off", 0, g.getHeight());
  g.setFontAlign(-1, -1).drawString("-Settings", 0, 0);
  var level = "-";
  if(micEnabled) {
    level = noiseLevel;
    if(gainCalibration > -0.09 && gainCalibration < 0.08) {
      level += " dBFS";
    } else {
      level += " dBA";
    }
  }
  g.setFont("Vector16").setFontAlign(0, 0).drawString(level, g.getWidth()/2, g.getHeight()/2);
  g.flip();
  disableButtons();
  button_watch[0] = setWatch(function() { disableButtons(); Pixl.menu(mainmenu); }, BTN1, {  repeat: true,  edge: 'rising'});
  button_watch[2] = setWatch(switchBuzzerState, BTN3, {  repeat: true,  edge: 'rising'});
}
homeScreen();

