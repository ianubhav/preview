window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
 ga('create', 'UA-68124588-1', 'auto') ; 
ga('send', 'pageview');
$(document).on('change', 'input[type=radio][name=optradio]', function () {
        var value = $(this).val();
        console.log(value);
        save_options(value);
         ga('send', 'event', value, 'click' );
         $('#fadeout').show().delay(200).fadeOut(1000);
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

 ga('send', 'event', 'img', 'mouseenter' );

$('#fadeout').hide();

document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});