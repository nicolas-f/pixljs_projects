var PIN_BUZZER = D4;
var PIN_BUZZER2 = A0;
var PIN_BUZZER3 = D9;
var buzzerEnabled = false;
var buzzerEnabled2 = false;
var buzzerEnabled3 = false;

function switchBuzzerState1() {
  buzzerEnabled = !buzzerEnabled;
  if(buzzerEnabled) {
    digitalWrite(PIN_BUZZER,255);
  } else {
    digitalWrite(PIN_BUZZER,0);
  }
}

function switchBuzzerState2() {
  buzzerEnabled2 = !buzzerEnabled2;
  if(buzzerEnabled2) {
    digitalWrite(PIN_BUZZER2,255);
  } else {
    digitalWrite(PIN_BUZZER2,0);
  }
}

function switchBuzzerState3() {
  buzzerEnabled3 = !buzzerEnabled3;
  if(buzzerEnabled3) {
    analogWrite(PIN_BUZZER3, 0.5,{freq:4000});
  } else {
    digitalWrite(PIN_BUZZER3, 0);
  }
}

setWatch(switchBuzzerState1, BTN3, {  repeat: true,  edge: 'rising'});
setWatch(switchBuzzerState2, BTN2, {  repeat: true,  edge: 'rising'});
setWatch(switchBuzzerState3, BTN1, {  repeat: true,  edge: 'rising'});
