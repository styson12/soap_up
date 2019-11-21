jQuery( "#soap" ).on( "click", function(event) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {soap: true}, function(response) {
        console.log(response.confirmation);
      });
    });
  });

jQuery( "#clear" ).on( "click", function(event) {
  chrome.storage.local.clear(function() {
    console.log("Cleared chrome storage.")
  });
})