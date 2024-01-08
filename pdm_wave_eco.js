var bufA = new Int16Array(256);
var bufB = new Int16Array(256);
var buffer = new Int16Array(256);
var spl=-99.0;
var canWrite = false;
var sample_rate = 15625;

function onSamples(samples, sumSquared) {
  "jit";
  if(canWrite) {
    buffer.set(samples);
  }
  canWrite = false;
  spl=10*Math.log(sumSquared/samples.length/1073741824)/Math.log(10);
}

function doUnInit() {
 Pdm.stop();
 Pdm.uninit();
}

function doInit() {
  // jaune->clock bleu->din
  Pdm.setup({"clock" : 5, "din" : 6, frequency: sample_rate, "lgain": 20});
  Pdm.init(onSamples, bufA, bufB);
  Pdm.start();
}



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


function onTimer() {
  g.clear();
  g.moveTo(0,32 + (buffer[0] / 10));
  for (var x=1;x<128 && x < buffer.length ;x++) {
    g.lineTo(x,32 + (buffer[x] / 10));
  }
  g.setFontBitmap();
  g.drawString(spl.toFixed(1) + " dB - Frequency: " + evaluateFrequency() + " Hz");
  // Use a large font for the value itself
  g.flip();
  canWrite = true;
  tm = setTimeout(onTimer, 250);
}

var tm = 0;

setWatch(function() {
  if(tm == 0) {
    doInit();
    Pixl.setLCDPower(true);
    tm = setTimeout(onTimer, 250);
  } else {
    clearTimeout(tm);
    tm = 0;
    Pixl.setLCDPower(false);
    doUnInit();
  }
}, BTN, {edge:"rising", debounce:50, repeat:true});


