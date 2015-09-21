var input_interval_enabled_checkbox;
var input_interval_initial_minutes_number;
var input_interval_repeat_minutes_number;

var input_shutdown_enabled_checkbox;
var input_shutdown_minutes_number;

var input_whitelist_textarea;
var apply_button;

document.addEventListener("DOMContentLoaded", function(event) { 
    input_interval_enabled_checkbox = document.getElementsByName("interval_enabled")[0];
    input_interval_initial_minutes_number = document.getElementsByName("interval_initial")[0];
    input_interval_repeat_minutes_number = document.getElementsByName("interval_repeat")[0];

    input_shutdown_enabled_checkbox = document.getElementsByName("shutdown_enabled")[0];
    input_shutdown_minutes_number = document.getElementsByName("shutdown_minutes")[0];

    input_whitelist_textarea = document.getElementsByName("whitelist")[0];
    
    // Click handler cannot be set in markup because of CSP restrictions.
    // See: https://developer.chrome.com/extensions/contentSecurityPolicy
    apply_button = document.getElementById("apply_button");
    apply_button.addEventListener('click', apply_click);
    input_interval_enabled_checkbox.addEventListener('click', update_ui_fields_enabled);
    input_shutdown_enabled_checkbox.addEventListener('click', update_ui_fields_enabled);
    
    load_options();
    
    //console.log(canuseeme);
    console.log(core);
});

function update_ui_fields_enabled() {
    input_interval_initial_minutes_number.disabled = !input_interval_enabled_checkbox.checked;
    input_interval_repeat_minutes_number.disabled = !input_interval_enabled_checkbox.checked;
    
    input_shutdown_minutes_number.disabled = !input_shutdown_enabled_checkbox.checked;
}

function apply_click() {
    save_options();
}

function save_options() {
  console.log('sae_options() called.');
  var options = {
    interval_enabled: input_interval_enabled_checkbox.checked,
    interval_initial_minutes: fetch_number_from_ui(input_interval_initial_minutes_number, 'interval_initial_minutes'),
    interval_repeat_minutes: fetch_number_from_ui(input_interval_repeat_minutes_number, 'interval_repeat_minutes'),

    shutdown_enabled: input_shutdown_enabled_checkbox.checked,
    shutdown_minutes: fetch_number_from_ui(input_shutdown_minutes_number, 'shutdown_minutes'),
    
    whitelist: fetch_whitelist_from_ui()
  };
  console.log("saving:");
  console.log(options);
    
  chrome.storage.sync.set(options);
}

function fetch_number_from_ui(field, property) {
    console.log("write_number_to_ui() called, field:");
    console.log(field);
    console.log('property:');
    console.log(property);
    
    var min = field.min;
    var max = field.max;
    var number = field.value;
    number = Math.floor(number);
    if (!isFinite(number) || number < min || number > max) {
        number = default_options[property];
    }
    return number;
}

function load_options() {
  chrome.storage.sync.get(default_options, function(options) {
    write_options_to_ui(options);
  });
}

function write_options_to_ui(options) {
    console.log('loaded options');
    console.log(options);

    write_number_to_ui = function(property, field) {
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
    write_number_to_ui("interval_initial_minutes", input_interval_initial_minutes_number);
    write_number_to_ui("interval_repeat_minutes", input_interval_repeat_minutes_number);

    input_shutdown_enabled_checkbox.checked  = options.shutdown_enabled;
    write_number_to_ui("shutdown_minutes", input_shutdown_minutes_number);
    
    input_whitelist_textarea.value = options.whitelist.join('\n');
}

function fetch_whitelist_from_ui() {
    var raw_whitelist = input_whitelist_textarea.value.split('\n');
    console.log('fetch_whitelist_from_ui(), raw_whitelist:');
    console.log(raw_whitelist);
    var whitelist = [];
    for (i = 0; i < raw_whitelist.length; i++) {
        whiteUrl = raw_whitelist[i];
        whiteUrl = whiteUrl.trim();
        if (whiteUrl.length > 0) {
            whitelist.push(whiteUrl)
        }
    }
    return whitelist;
}
