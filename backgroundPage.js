// Tip:
// Settings > On startup > "continue where you left off"

console.log('backgroundPage.js loaded.');

active = true;

chrome.runtime.onStartup.addListener(function() {
	console.log('hi!');
	
	chrome.alarms.create('first alarm', {
		delayInMinutes: 0.1,
	}
	);
	
	chrome.alarms.create('second alarm', {
		delayInMinutes: 0.2,
	}
	);
	
	chrome.alarms.create('final alarm', {
		delayInMinutes: 0.3,
	}
	);	
});


function updateActive() {
	console.log('updateActie()');
	chrome.windows.getAll({populate: true}, function(windows) {
		//console.log(windows);
		for (i = 0; i < windows.length; i++) {
			var window = windows[i];
			console.log('window');
			//console.log(window);
			var tabs = window.tabs;
			console.log('tabs');
			//console.log(tabs);
			for (j = 0; j < tabs.length; j++) {
				tab = tabs[j];
				console.log(tab.url);
				// if url matches white-list -- turn "actie off"
				// simple substring match
			}
		}
	});
}


chrome.alarms.onAlarm.addListener(function(alarm) {
	
	console.log("alarm fired:");
	console.log(alarm);
	
	updateActive();
	
	if (!active) {
		return;
	}
	
	if (alarm.name === 'first alarm') {
		chrome.notifications.create('foo', {
			iconUrl: 'icon.png',
			type: 'basic',
			title: 'time running out',
			message: '2 minutes til browser shutdown',
		});
	}
	if (alarm.name === 'second alarm') {
		chrome.notifications.create('foo', {
			iconUrl: 'icon.png',
			type: 'basic',
			title: 'time running out',
			message: '1 minute til browser shutdown!',
		});
	}
	if (alarm.name === 'final alarm') {
		chrome.windows.getAll(function(windows) {
			console.log(windows);
			for (i = 0; i < windows.length; i++) {
				console.log('Closing window ' + windows[i].id + '...');
				//chrome.windows.remove(windows[i].id);
			}
			
		});
	}
	
	
})

