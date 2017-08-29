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

var value = 0;

function publishValue() {
	logger.info(value);
	mqtt.publish("test/value/1", value);
	mqtt.publish("test/value/2", value + 10);
	value++;
}

publishLoop(5 * 1000, publishValue);
