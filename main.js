window.onload = function() {
  document.querySelector('#greeting').innerText =
    'Manage your bluetooth connections...';

  var tab = document.getElementById("devices");
  var hdr = tab.insertRow(0);
  hdr.insertCell(0).innerHTML = "ADDRESS";
  hdr.insertCell(1).innerHTML = "NAME";
  hdr.insertCell(2).innerHTML = "TYPE";
  hdr.insertCell(3).innerHTML = "PAIRED?";
  hdr.insertCell(4).innerHTML = "CONNECTED?";
  hdr.insertCell(5).innerHTML = "UUIDS";
  hdr.insertCell(6).innerHTML = "DEVICE_CLASS";

  chrome.bluetooth.getDevices(function(devices) {
    console.log("Checking bluetooth devices");
     for (var i = 0; i < devices.length; i++) {
       console.log("Device Address: " + devices[i].address + " Device name: " + devices[i].name);
       var row = tab.insertRow(i+1);
       row.insertCell(0).innerHTML = devices[i].address;
       row.insertCell(1).innerHTML = devices[i].name;
       row.insertCell(2).innerHTML = devices[i].type;
       row.insertCell(3).innerHTML = devices[i].paired;
       row.insertCell(4).innerHTML = devices[i].connected;
       row.insertCell(5).innerHTML = devices[i].uuids;
       row.insertCell(6).innerHTML = devices[i].deviceClass;

     }
  });

  chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log("request : " + request);
    if (request.type == "code")
       sendResponse({"code":"dummy_code"});
  });
  /*chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("request : " + request);
    if (request.type == "code")
       sendResponse({"code":"dummy_code"});
  });*/
  console.log("Registered Event Handler for an external event");
};

