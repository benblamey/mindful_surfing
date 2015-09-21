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

function MSToString(msSinceStartup) {
    var durationString = "";
    
    var days = Math.floor(msSinceStartup / (1000 * 60 * 60 * 24));
    msSinceStartup -=  days * (1000 * 60 * 60 * 24);
    if (days > 0) {
            durationString += days + " days, ";
    }
    
    var hours = Math.floor(msSinceStartup / (1000 * 60 * 60));
    msSinceStartup -= hours * (1000 * 60 * 60);
    if (durationString != '' || hours > 0) {
            durationString += hours + " hours, ";
    }
    
    var mins = Math.floor(msSinceStartup / (1000 * 60));
    msSinceStartup -= mins * (1000 * 60);
    if (durationString != '' || mins > 0) {
        durationString += mins + " mins, ";
    }
    
    var seconds = Math.floor(msSinceStartup / (1000));
    msSinceStartup -= seconds * (1000);
    durationString += seconds + " seconds";
    
    return durationString;
}