var input_interval_enabled_checkbox = document.getElementsByName("interval_enabled")[0];
var input_interval_initial_minutes_number = document.getElementsByName("interval_initial")[0];
var input_interval_repeat_minutes_number = document.getElementsByName("interval_repeat")[0];

var input_shutdown_enabled_checkbox = document.getElementsByName("shutdown_enabled")[0];
var input_shutdown_minutes_number = document.getElementsByName("shutdown_minutes")[0];

var input_whitelist_textarea = document.getElementsByName("whitelist")[0];


var default_options = {
    interval_enabled: true,
    interval_initial_minutes: 30,
	interval_repeat_minutes: 10,

	shutdown_enabled: false,
    shutdown_minutes: 120,
	
	whitelist: []
};

function save_options() {

  var options = {
    interval_enabled: input_interval_enabled_checkbox.checked,
    interval_initial_minutes: input_interval_initial_minutes_number.value,
	interval_repeat_minutes: input_interval_repeat_minutes_number.value,

	shutdown_enabled: input_interval_enabled_checkbox.checked,
    shutdown_minutes: input_shutdown_minutes_number.value,
	
	whitelist: input_whitelist_textarea.value.split('\n')
  };
  console.log("saing:");
  console.log(options);
	
  chrome.storage.sync.set(options);
}

function load_options() {
  chrome.storage.sync.get(default_options, function(options) {
	apply_options(options);
  });
}

function clear_options() {
	chrome.storage.sync.clear();
}

function apply_options(options) {
	console.log('loaded options');
	console.log(options);

	readNumber = function(property, field) {
		console.log("read numbner(), field:");
		console.log(field);
		optionsValue = options[property];
		console.log("optionsValue:");
		console.log(optionsValue);
		min = field.min;
		max = field.max;
		optionsValue = Math.floor(optionsValue);
		if (!isFinite(optionsValue) || optionsValue < min || optionsValue > max) {
			optionsValue = default_options[property];
		}
		field.value = optionsValue;
	}
	
    input_interval_enabled_checkbox.checked  = options.interval_enabled;
	readNumber("interval_initial_minutes", input_interval_initial_minutes_number);
	readNumber("interval_repeat_minutes", input_interval_repeat_minutes_number);

	input_shutdown_enabled_checkbox.checked  = options.shutdown_enabled;
    readNumber("shutdown_minutes", input_shutdown_minutes_number);
	
	// TODO
	//whitelist: input_whitelist_textarea.value.split('\n')	  
	
	// TODO:
	// restrt timers
}



/*
// Saves options to chrome.storage
function save_options() {
  var color  = options.document.getElementById('color').value;
  var likesColor  = options.document.getElementById('like').checked;
  chrome.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor
  }, function() {
    // Update status to let user know options were saved.
    var status  = options.document.getElementById('status');
    status.textContent  = options.'Options saved.';
    setTimeout(function() {
      status.textContent  = options.'';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color  = options.'red' and likesColor  = options.true.
  chrome.storage.sync.get({
    favoriteColor: 'red',
    likesColor: true
  }, function(items) {
    document.getElementById('color').value  = options.items.favoriteColor;
    document.getElementById('like').checked  = options.items.likesColor;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
*/