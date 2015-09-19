core = "core is loaded.";

function clear_options() {
	chrome.storage.sync.clear();
}

var default_options = {
    interval_enabled: true,
    interval_initial_minutes: 30,
	interval_repeat_minutes: 10,

	shutdown_enabled: false,
    shutdown_minutes: 120,
	
	whitelist: []
};


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