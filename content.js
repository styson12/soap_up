chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log("Message received");
      if (request.soap == true) {
        sendResponse({confirmation: "scrubbing..."});
        chrome.storage.local.get(null, function(items) {
            var allKeys = Object.keys(items);
            console.log(allKeys);
        });
      }
    });

console.log("Chrome extension go");

function setStore(key, value) {
    chrome.storage.local.set({key: value}, function() {
        console.log('Value is set to ' + value);
      });
} 

scan();
function scan() {
    // jQuery(document.body).on('change paste keyup', 'input', function(event) {
    //     var target = this;
    //     var timeout = null;
    //     // Listen for keystroke events
    //     target.onkeyup = function (e) {

    //         // Clear the timeout if it has already been set.
    //         // This will prevent the previous task from executing
    //         // if it has been less than <MILLISECONDS>
    //         clearTimeout(timeout);

    //         // Make a new timeout set to go off in 800ms
    //         timeout = setTimeout(function () {
    //             console.log(target.value);
    //         }, 3000);
    //     };
    // });
    var called = false; 
    jQuery(document.body).on('change paste keyup', 'input', function(event) {
            var target = this;
            if (called == false) {
                setTimeout(function () {
                    console.log(target.value);
                    // setStore(target.value, target.value);
                    chrome.storage.local.set({"blah": target.value}, function() {
                        console.log('Value is set to ' + target.value);
                      });
                    called = false;
                }, 6000);
                called = true; 
            }
    });
    
    jQuery(document.body).on('change paste keyup', 'textarea', function(event) {
        var target = this;
        if (called == false) {
            setTimeout(function () {
                console.log(target.value);
                called = false;
            }, 6000);
            called = true; 
        }
    });
    
    jQuery(document.body).on('DOMSubtreeModified', 'div.display-value', function(event) {
        console.log(jQuery(this).text());
    });
    
    // jQuery(document.body).on('click', 'eso-yes-no', function(event) {
    //     console.log(this.class);
    //     console.log("blah");
    //     console.log(jQuery(this).text());
    // });
}

// function getInputs(){
//     // var inputs = document.getElementsByTagName('input');
//     // setTimeout(function(){
//     //     for (let input of inputs) {
//     //         if (input.hasAttribute('ng-model')){
//     //             console.log(input.getAttribute('ng-model'));
//     //         }
//     //     }
//     // }, 3000);
//     let promise = new Promise((resolve, reject) => {
//         setTimeout(function(){
//             resolve(document.getElementsByTagName('input'));
//           }, 2000);
//       });
      
//     promise.then((inputs) => {
//     for (let input of inputs) {
//         if (input.hasAttribute('ng-model')){
//             console.log(input.getAttribute('ng-model'));

//             console.log(input.value);
//         }
//     }
//     });

// }

// getInputs();

// $(function(){
//     $('li').click(function() {
//         getInputs();
//     });
// });



// MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

// var observer = new MutationObserver(subscriber);

// let promise = new Promise((resolve, reject) => {
//     setTimeout(function(){
//         // var target = document.querySelectorAll('input[ng-model], eso-field.eso-field:not(.ng-hide)');
//         var targets = document.querySelectorAll('input, textarea, div.display-value, button.btn');
//         resolve(targets);
//       }, 3000);
//   });
  
// promise.then((targets) => {
//     console.log(targets);
//     for (t of targets){
//         var observer = new MutationObserver(subscriber);
//         observer.observe(t, {  
//             // childList: true, 
//             attributes: true
//             // characterData: true
//             // subtree: true,
//           });
//     }
// });

// function subscriber(mutations) {
//     mutations.forEach((mutation) => {
//       // handle mutations here
//       console.log(mutation);
//     });
//   }
// ****************************
// MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

// var observer = new MutationObserver(subscriber);

// let promise = new Promise((resolve, reject) => {
//     setTimeout(function(){
//         // var target = document.querySelectorAll('input[ng-model], eso-field.eso-field:not(.ng-hide)');
//         var targets = document.querySelectorAll('input, textarea, div.display-value, button.btn');
//         resolve(targets);
//       }, 3000);
//   });
  
// promise.then((targets) => {
//     console.log(targets);
//     for (t of targets){
//         var observer = new MutationObserver(subscriber);
//         observer.observe(t, {  
//             // childList: true, 
//             attributes: true
//             // characterData: true
//             // subtree: true,
//           });
//     }
// });

// function subscriber(mutations) {
//     mutations.forEach((mutation) => {
//         console.log(mutation);
//         scan();
//     });
//   }

// observer.observe(document, {
//     childList: true, 
//     attributes: true,
//     characterData: true,
//     subtree: true,
// })









