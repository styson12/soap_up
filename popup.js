function soapUP(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {soap: true}, function(response) {
          console.log(response.confirmation);
        });
      });
}
jQuery( "#soap" ).on( "click", function(event) {
    soapUP();
  });