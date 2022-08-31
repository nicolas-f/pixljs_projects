
var bufA = new Int16Array(256);
var bufB = new Int16Array(256);
var canWrite = false;
var buffer = new Int16Array(256);

var sample_rate = 15625;

function onSamples(samples) {
  if(canWrite) {
    buffer.set(samples);
  }  
  canWrite = false;
}

Pdm.stop();
Pdm.uninit();
// jaune 5 bleu 6
Pdm.setup({"clock" : 5, "din" : 6, frequency: sample_rate});
Pdm.init(onSamples, bufA, bufB);
Pdm.start();


setWatch(function() { 
 Pdm.stop();
 Pdm.uninit();
 g.clear();
 g.flip();
}, BTN, {edge:"rising", debounce:50, repeat:true});


function evaluateFrequency() {
  
  var zeroCrossSample = 0;
  var zeroCrossDelay = 0;
  var do_break = false;
  for (i = 1; i < buffer.length; i++) {
    var previous = buffer[i-1];
    var current = buffer[i]; 
    if (previous >= 0 && current < 0) {
        // evaluate Tzc
        var oldZeroCross = zeroCrossSample;
        zeroCrossSample = (i - 1.0) + (previous / (previous - current));
        if(oldZeroCross > 0) {
          var newZeroCrossDelay = zeroCrossSample - oldZeroCross;
          if(zeroCrossDelay < 1) {
            zeroCrossDelay = newZeroCrossDelay;
          } else {
            do_break = true;
          }
          // Store measured frequency in Hz
          if(do_break) {
            return Math.round(sample_rate / ((zeroCrossDelay + newZeroCrossDelay) / 2.0));
          }
          zeroCrossDelay = newZeroCrossDelay;
        }
    }
  }
  return 0;
}

function getBatteryVoltage() {
  return analogRead(A0) * E.getAnalogVRef() * 2.213;
}

function onTimer() {
  var volts = getBatteryVoltage();
  NRF.setAdvertising([
      {0x180F : [Math.round(Math.min(1, (volts - 3.2) / 1.02)  * 100)]},
    ]);
  g.clear();
  g.moveTo(0,32 + (buffer[0] / 10));
  for (var x=1;x<128 && x < buffer.length ;x++) {
    g.lineTo(x,32 + (buffer[x] / 10));
  }
  g.setFontBitmap();
  g.drawString("Frequency: " + evaluateFrequency() + " Hz");
  // Use a large font for the value itself
  g.flip();
  canWrite = true;
}

// Update temperature every 2 seconds
setInterval(onTimer,2000);

