console.log('backgroundPage.js loaded.');

active = true;

var canuseeme = "horray!";

var white_list = [
	'mubi.com',
	'netflix.com',
	'channel4.com',
];

var startupTime;

chrome.runtime.onStartup.addListener(function() {

	init();

});

function init() {
	console.log("core:")
	console.log(core);
	
	startupTime = new Date();
	
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
	
	chrome.alarms.create('regular', {
		delayInMinutes: 0.5,
		periodInMinutes: 10,
	}
	);	
}




function updateActive() {
	console.log('updateActie()');
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
				for (k = 0; k < white_list.length; k++) {
					whiteUrl = white_list[k];
					if (tab.url.indexOf(whiteUrl) > -1 ) {
						active = false;
						console.log("White List Match Found!");
						break;
					}
				}
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
	if (alarm.name === 'regular') {
		msSinceStartup = (new Date()) - startupTime;
		console.log("startup time:");
		console.log(startupTime);
		console.log("msSinceStartup:");
		console.log(msSinceStartup);
		
		
		var days = Math.floor(msSinceStartup / (1000 * 60 * 60 * 24));
		msSinceStartup -=  days * (1000 * 60 * 60 * 24);
		var hours = Math.floor(msSinceStartup / (1000 * 60 * 60));
		msSinceStartup -= hours * (1000 * 60 * 60);
		var mins = Math.floor(msSinceStartup / (1000 * 60));
		msSinceStartup -= mins * (1000 * 60);
		var seconds = Math.floor(msSinceStartup / (1000));
		msSinceStartup -= seconds * (1000);
		durationString = days + " days, " + hours + " hours, " + mins + " minutes, " + seconds + " seconds";
		
		chrome.notifications.create('foo', {
			iconUrl: 'icon.png',
			type: 'basic',
			title: 'Mindfulness',
			message: 'you have been browsing for ' + durationString + "\n\n" + "Time for a break?",
		});
	}
	
})

