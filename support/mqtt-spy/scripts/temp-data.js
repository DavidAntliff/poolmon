var Platform = Java.type("javafx.application.Platform");
var Timer    = Java.type("java.util.Timer");

function setInterval(func, milliseconds) {
  // New timer, run as daemon so the application can quit
  var timer = new Timer("setInterval", true);
  timer.schedule(function() Platform.runLater(func), milliseconds, milliseconds);
  return timer;
}

function clearInterval(timer) {
  timer.cancel();
}

function setTimeout(func, milliseconds) {
  // New timer, run as daemon so the application can quit
  var timer = new Timer("setTimeout", true);
  timer.schedule(function() Platform.runLater(func), milliseconds);
  return timer;
}

function clearTimeout(timer) {
  timer.cancel();
}

function gaussianRand() {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
}

function gaussianRandom(start, end) {
  return Math.floor(start + gaussianRand() * (end - start + 1));
}

// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function simulateTemp(mean, variance) {
    return round(mean + variance * randn_bm(), 1);
}

function publishTemps() {
	mqtt.publish("mydevice/sensor1", simulateTemp(18.0, 1.0));
	mqtt.publish("mydevice/sensor2", simulateTemp(30.0, 2.0));
	mqtt.publish("mydevice/sensor3", simulateTemp(18.0, 1.0));
	mqtt.publish("mydevice/sensor4", simulateTemp(50.0, 10.0));
}

function publishLoop(delay_ms, publish_fn)
{
	var Thread = Java.type("java.lang.Thread");
	//var Date = Java.type("java.util.Date");
	//var SimpleDateFormat = Java.type("java.text.SimpleDateFormat");

	//var TIME_FORMAT_WITH_SECONDS = "HH:mm:ss";
	//var TIME_WITH_SECONDS_SDF = new SimpleDateFormat(TIME_FORMAT_WITH_SECONDS);

	while (true)
	{
		//var currentTime = TIME_WITH_SECONDS_SDF.format(new Date());

		//mqttspy.publish("/time/", currentTime, 0, false);
		publish_fn();

		for (count = 0; count < Math.ceil(delay_ms / 1000.0); count++) {
			// Sleep for 1 second and handle a stop request
			try
			{
				Thread.sleep(1000);
			}
			catch(err)
			{
				return false;
			}

			// Keep mqtt-spy informed the script is still running
			mqttspy.touch();
		}
	}

	return true;
}

publishLoop(5 * 1000, publishTemps);

