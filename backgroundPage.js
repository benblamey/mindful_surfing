var startupTime, options;

chrome.runtime.onStartup.addListener(init); // This event fires when Chrome starts.
chrome.runtime.onInstalled.addListener(init); // This event fires when the extension is installed or reloaded.
chrome.storage.onChanged.addListener(init); // This event fires when settings are saved.
chrome.alarms.onAlarm.addListener(alarm_fired);

function init() {
	console.log('init()');	
	startupTime = new Date();
	
	chrome.alarms.clearAll(function() {	
		chrome.storage.sync.get(default_options, function(loaded_options) {
			console.log('loaded options');
			options = loaded_options;
			console.log(options);

		/*	var default_options = {
			interval_enabled: true,
			interval_initial_minutes: 30,
			interval_repeat_minutes: 10,
			shutdown_enabled: false,
			shutdown_minutes: 120,
			whitelist: []
		};*/
			
			if (options.interval_enabled) {
				console.log('enabling interval alarm');
				chrome.alarms.create('regular', {
						delayInMinutes: options.interval_initial_minutes,
						periodInMinutes: options.interval_repeat_minutes,
				});		
			}
			
			if (options.shutdown_enabled) {
				console.log('enabling shutdown alarms');
				// Note that alarm names need to be unique.
				chrome.alarms.create('shutdown_warning1', {
					delayInMinutes: options.shutdown_minutes - 10,
				});
				chrome.alarms.create('shutdown_warning2', {
					delayInMinutes: options.shutdown_minutes - 1,
				});
				chrome.alarms.create('shutdown_warning3', {
					delayInMinutes: options.shutdown_minutes - 0.6, // 10 secs
				});
				chrome.alarms.create('shutdown_now', {
					delayInMinutes: options.shutdown_minutes,
				});	
			}
		
		});
		
	});
}

// Handler used when any alarm fires.
function alarm_fired(alarm) {
	console.log("alarm fired:");
	console.log(alarm);

	runCallbackIfActive(function() {
		
		if (alarm.name.indexOf('shutdown_warning') > -1) {
			chrome.notifications.create('foo', {
				iconUrl: 'icon.png',
				type: 'basic',
				title: 'Mindful Surfing',
				message: 'Warning! ' + MSToString(timeToShutdown())+' until browser shutdown.',
			});
		} else if (alarm.name === 'shutdown_now') {
			chrome.windows.getAll(function(windows) {
				console.log(windows);
				for (i = 0; i < windows.length; i++) {
					console.log('Closing window ' + windows[i].id + '...');
					chrome.windows.remove(windows[i].id);
				}
			});
		} else if (alarm.name === 'regular') {
			msSinceStartup = (new Date()) - startupTime;
			durationString = MSToString(msSinceStartup);
			chrome.notifications.create('interval_notification', {
				iconUrl: 'icon.png',
				type: 'basic',
				title: 'Mindful Surfing',
				message: 'you have been browsing for ' + durationString + "\n\n" + "Time for a break?",
			});
		}
	});
}

// Computes the time until the next firing of the shutdown alarm.
function timeToShutdown() {
	var nowUnix = new Date().getTime();
	var startupUnix = startupTime.getTime();
	var timeToShutdown = (startupUnix + (options.shutdown_minutes * 60 * 1000)) - nowUnix;
	return timeToShutdown;
}

// Checks the active tab of each window against the whitelist -- to compute whether the interval should run.
function runCallbackIfActive(callbackIfActive) {
	console.log('updateActie()');
	var active = true;
	chrome.windows.getAll({populate: true}, function(windows) {
		console.log(windows);
		for (i = 0; i < windows.length; i++) {
			var window = windows[i];
			var tabs = window.tabs;
			for (j = 0; j < tabs.length; j++) {
				tab = tabs[j];
				if (!tab.active) {
					continue;
				}
				console.log(tab.url);
				// simple substring match
				for (k = 0; k < options.whitlist.length; k++) {
					whiteUrl = options.whitlist[k];
					if (tab.url.indexOf(whiteUrl) > -1 ) {
						active = false;
						console.log("White List Match Found!");
						break;
					}
				}
			}
		}
		
		if (active) {
			callback(callbackIfActive);
		} else {
			console.log('whitelist match -- not running callback');
		}
	});
}
