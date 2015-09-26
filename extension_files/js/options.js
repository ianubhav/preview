$(document).on('change', 'input[type=radio][name=optradio]', function () {
        var value = $(this).val();
        save_options(value);
});
function save_options(value) {
  localStorage.extensionStatus = value;
}
function restore_options() {
  if(!localStorage.extensionStatus)
    localStorage.extensionStatus = 'enabled';
  if(localStorage.extensionStatus=="enabled")
    $("#rad_enabled").prop("checked", true);
  else
    $("#rad_disabled").prop("checked", true);
}
document.addEventListener('DOMContentLoaded', restore_options);
