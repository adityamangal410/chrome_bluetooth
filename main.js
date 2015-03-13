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
    console.log("request : ");
    console.log(request);
    if (request.type == "code")
       sendResponse({"code":"1234"});
  });

  var onReceive = function(receiveInfo) {
    if (receiveInfo.socketId != socketId){
      return;
    }
    else{
      // receiveInfo.data is an ArrayBuffer.
      console.log("Data Received!");
      console.log(receiveInfo.data);
      console.log(String.fromCharCode.apply(null, new Uint16Array(receiveInfo.data)));
    }
  };

  var onSendCallback = function() {
    if (chrome.runtime.lastError) {
      console.log("Connection failed: " + chrome.runtime.lastError.message);
    } else {
      // Profile implementation here.
      console.log("Hello Successful!");
    }
  };
  // var uuid = '00001105-0000-1000-8000-00805f9b34fb';
  var uuid = 'A55D25C2-DA5F-40B2-B8D9-B940BF39795C';

  // var uuid = '00001101-0000-1000-8000-00805f9b34fb';
  var onConnectedCallback = function() {
    if (chrome.runtime.lastError) {
      console.log("Connection failed: " + chrome.runtime.lastError.message);
    } else {
      // Profile implementation here.
      console.log("Socket Successfully Created!");
      chrome.bluetoothSocket.onAccept.addListener(function(acceptInfo) {
        if (chrome.runtime.lastError) {
          console.log("Connection failed: " + chrome.runtime.lastError.message);
        } else {
          // Profile implementation here.
            console.log("Accept Successful!");
            if (acceptInfo.socketId != socketId){
            console.log('Sockets dont match!');
            return;
          }


          // Say hello...
          chrome.bluetoothSocket.send(acceptInfo.clientSocketId,
            "data", onSendCallback);

          // Accepted sockets are initially paused,
          // set the onReceive listener first.
          chrome.bluetoothSocket.onReceive.addListener(onReceive);
          chrome.bluetoothSocket.setPaused(false);
          chrome.bluetoothSocket.onReceiveError.addListener(function(errorInfo) {
            // Cause is in errorInfo.error.
            console.log(errorInfo.errorMessage);
          });
        }
      });
      chrome.bluetoothSocket.onAcceptError.addListener(function(errorInfo) {
        // Cause is in errorInfo.error.
        console.log(errorInfo.errorMessage);
      });
    }
  };

  var socketId;
  // chrome.bluetoothSocket.create(function(createInfo) {
  //   socketId = createInfo.socketId;
  //   chrome.bluetoothSocket.connect(createInfo.socketId,
  //     "74:45:8A:A0:AC:47", uuid, onConnectedCallback);
  // });

  chrome.bluetoothSocket.create(function(createInfo) {
    socketId = createInfo.socketId;
    chrome.bluetoothSocket.listenUsingRfcomm(createInfo.socketId,
      uuid, onConnectedCallback);
  });



  // chrome.bluetoothSocket.onReceive.addListener(function(receiveInfo) {
  //   if (receiveInfo.socketId != socketId){
  //     return;
  //   }
  //   else{
  //     // receiveInfo.data is an ArrayBuffer.
  //     console.log("Data Received!");
  //     console.log(receiveInfo.data);
  //     console.log(String.fromCharCode.apply(null, new Uint16Array(receiveInfo.data)));
  //   }
  // });

  console.log("Registered Event Handler for an external event");
};

