jQuery( "#soap" ).on( "click", function(event) {
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {soap: true}, function(response) {
        console.log(response.confirmation);
      });
    });
  });

jQuery( "#clear" ).on( "click", function(event) {
  browser.storage.local.clear(function() {
    console.log("Cleared browser storage.")
  });
})