let completionPort;

self.onmessage = function(e) {
  if (e.data.type === 'console') {
    // Define the console object
    self.console = { 
      _port: e.ports[0],           // Remember the port we log to
      log: function log() {        // Define console.log()
        // Copy the arguments into a real array
        var args = Array.prototype.slice.call(arguments);
        // Send the arguments as a message, over our side channel
        self.console._port.postMessage(args);
      }
    };

    // Get rid of this event handler
    self.onmessage = null;

    // Now run the script that was originally passed to Worker()
    var url = location.hash.substring(1); // Get the real URL to run
    self.importScripts(url);              // Load and run it now

    if (completionPort) {
      completionPort.postMessage(self.__consoleEXPR);
    }
  }

  if (e.data.type === 'completion') {
    completionPort = e.ports[0];
  }
};
