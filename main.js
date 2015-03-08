window.onload = function() {
  document.querySelector('#greeting').innerText =
    'Listening to your bluetooth for a code for this site...';

  $('#myTable tr:last').after('<tr>...</tr><tr>...</tr>');

  chrome.bluetooth.getDevices(function(devices) {
    console.log("Checking bluetooth devices");
     for (var i = 0; i < devices.length; i++) {
       console.log("Device Address: " + devices[i].address + " Device name: " + devices[i].name);
     }
  });

};

