const keys = {
    "_esoTextModel['_esoFieldModel[\\'currentVital.pulse.pulseRate\\']']": "HR",
    "_esoTextModel['_esoFieldModel[\\'currentVital.bloodPressure.bloodPressureSystolic\\']']": "SBP",
    "_esoTextModel['_esoFieldModel[\\'currentVital.bloodPressure.bloodPressureDiastolic\\']']": "ABP",
    "_esoTextModel['_esoFieldModel[\\'currentVital.respiration.respirationRate\\']']": "RR",
    "_esoTextModel['glucose']" : "BGL",
    "_esoFieldModel['currentVital.glasgowComaScale.glascowComaEyesId']" : "GCSE",
    "_esoFieldModel['currentVital.glasgowComaScale.glascowComaVerbalId']" : "GCSV",
    "_esoFieldModel['currentVital.glasgowComaScale.glascowComaMotorId']" : "GCSM"
};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log("Message received");
      if (request.soap == true) {
        sendResponse({confirmation: "scrubbing..."});
        chrome.storage.local.get(null, function(items) {
            var allKeys = Object.keys(items);
            var allValues = Object.values(items);
            console.log(allKeys);
            console.log(allValues);
        });
      }
    });

function store(key, value) {
    var obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, function() {
        console.log(`${key} is set to ` + value);
      });
} 

scan();

function scan() {
    var called = false; 
    jQuery(document.body).on('change paste keyup', 'input', function(event) {
            var target = this;
            var key = target.getAttribute("ng-model");
            if (called == false) {
                setTimeout(function () {
                    if (key in keys) {
                        store(keys[key], target.value);
                    }
                    called = false;
                }, 6000);
                called = true; 
            }
    });
    
    jQuery(document.body).on('change paste keyup', 'textarea', function(event) {
        var target = this;
        if (called == false) {
            setTimeout(function () {
                store(target.value, target.value);
                called = false;
            }, 6000);
            called = true; 
        }
    });
    
    jQuery(document.body).on('DOMSubtreeModified', 'div.display-value', function(event) {
        var key = jQuery(this).parents("eso-single-select").attr("ng-model");
        var value = jQuery(this).text();
        if (key in keys) {
            store(keys[key], value);
        }
    });

    // jQuery( "label:contains('GCS')" ).siblings(".score-value").on('DOMSubtreeModified', function(event) {
    //     var value = jQuery(this).text();
    //     store("GCS", value);
    // });
    
    // jQuery(document.body).on('click', 'eso-yes-no', function(event) {
    //     console.log(this.class);
    //     console.log("blah");
    //     console.log(jQuery(this).text());
    // });
}




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









