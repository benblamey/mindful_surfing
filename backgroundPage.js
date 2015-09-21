var startupTime, options;

console.log("-- STARTING EXTENSION --");

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
				chrome.alarms.create('first alarm', {
					delayInMinutes: options.shutdown_minutes - 10,
				});
				chrome.alarms.create('first1 alarm', {
					delayInMinutes: options.shutdown_minutes - 1,
				});
				chrome.alarms.create('second alarm', {
					delayInMinutes: options.shutdown_minutes - 0.6, // 10 secs
				});
				chrome.alarms.create('final alarm', {
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

	updateActive(function(active) {
		if (!active) {
			return;
		}
		
		if (alarm.name === 'first alarm') {
			chrome.notifications.create('foo', {
				iconUrl: 'icon.png',
				type: 'basic',
				title: 'time running out',
				message: MSToString(timeToShutdown())+' until browser shutdown',
			});
		}
		if (alarm.name === 'second alarm') {
			chrome.notifications.create('foo', {
				iconUrl: 'icon.png',
				type: 'basic',
				title: 'time running out',
				message: MSToString(timeToShutdown())+' until browser shutdown!',
			});
		}
		if (alarm.name === 'final alarm') {
			chrome.windows.getAll(function(windows) {
				console.log(windows);
				for (i = 0; i < windows.length; i++) {
					console.log('Closing window ' + windows[i].id + '...');
					chrome.windows.remove(windows[i].id);
				}
				
			});
		}
		if (alarm.name === 'regular') {
			msSinceStartup = (new Date()) - startupTime;
			console.log("startup time:");
			console.log(startupTime);
			console.log("msSinceStartup:");
			console.log(msSinceStartup);
			
			durationString = MSToString(msSinceStartup);
			
			chrome.notifications.create('foo', {
				iconUrl: 'icon.png',
				type: 'basic',
				title: 'Mindfulness',
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

function updateActive(callback) {
	console.log('updateActie()');
	var active = true;
	chrome.windows.getAll({populate: true}, function(windows) {
		console.log(windows);
		for (i = 0; i < windows.length; i++) {
			var window = windows[i];
			console.log('window');
			//console.log(window);
			var tabs = window.tabs;
			console.log('tabs');
			//console.log(tabs);
			for (j = 0; j < tabs.length; j++) {
				tab = tabs[j];
				if (!tab.active) {
					continue;
				}
				console.log(tab.url);
				// if url matches white-list -- turn "actie off"
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
		
		callback(active);
	});
}
