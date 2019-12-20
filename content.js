const keys = {
    //Subjective
    "_esoTextModel['_esoFieldModel[\\'vm.patientComplaint.chiefComplaint\\']']": "Chief Complaint",
    "Add History": "History",
    "Add Medications": "Medications",
    //Objective
    "_esoTextModel['_esoFieldModel[\\'currentVital.pulse.pulseRate\\']']": "HR",
    "_esoTextModel['_esoFieldModel[\\'currentVital.bloodPressure.bloodPressureSystolic\\']']": "SBP",
    "_esoTextModel['_esoFieldModel[\\'currentVital.bloodPressure.bloodPressureDiastolic\\']']": "ABP",
    "_esoTextModel['_esoFieldModel[\\'currentVital.respiration.respirationRate\\']']": "RR",
    "_esoTextModel['glucose']" : "BGL",
    "_esoFieldModel['currentVital.glasgowComaScale.glascowComaEyesId']" : "GCSE",
    "_esoFieldModel['currentVital.glasgowComaScale.glascowComaVerbalId']" : "GCSV",
    "_esoFieldModel['currentVital.glasgowComaScale.glascowComaMotorId']" : "GCSM",
        // Skin
    "_esoFieldModel['vm.skinSection.skin.cold']": "Cold",
    "_esoFieldModel['vm.skinSection.skin.cyanotic']": "Cyanotic",
    "_esoFieldModel['vm.skinSection.skin.diaphoretic']": "Diaphoretic",
    "_esoFieldModel['vm.skinSection.skin.hot']": "Hot",
    "_esoFieldModel['vm.skinSection.skin.jaundice']": "Jaundice",
    "_esoFieldModel['vm.skinSection.skin.lividity']": "Lividity",
    "_esoFieldModel['vm.skinSection.skin.mottled']": "Mottled",
    "_esoFieldModel['vm.skinSection.skin.pale']": "Pale",
    "_esoFieldModel['vm.skinSection.skin.other']": "Other",
        // Eyes
    "_esoFieldModel['vm.heentSection.eyes.blind.right']": "Blind_R",
    "_esoFieldModel['vm.heentSection.eyes.blind.left']": "Blind_L",
    "_esoFieldModel['vm.heentSection.eyes.constricted.right']": "Constricted_R",
    "_esoFieldModel['vm.heentSection.eyes.constricted.left']": "Constricted_L",
    "_esoFieldModel['vm.heentSection.eyes.dilated.right']": "Dilated_R",
    "_esoFieldModel['vm.heentSection.eyes.dilated.left']": "Dilated_L",
    "_esoFieldModel['vm.heentSection.eyes.nonReactive.right']": "Non-Reactive_R",
    "_esoFieldModel['vm.heentSection.eyes.nonReactive.left']": "Non-Reactive_L",
    "_esoFieldModel['vm.heentSection.eyes.other.right']": "Other_R",
    "_esoFieldModel['vm.heentSection.eyes.other.left']": "Other_L"
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
    if (value === "") {
        remove(key);
    }
    else {
        var obj = {};
        obj[key] = value;
        chrome.storage.local.set(obj, function() {
            console.log(`${key} is set to ${value}.`);
            });
    }
} 

function remove(key) {
    chrome.storage.local.remove(key, function(){
        console.log(`${key} removed.`);
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

    jQuery(document.body).on('click', 'eso-slide-toggle', function(event) {
        var key = jQuery(this).attr("ng-model");
        var name = jQuery(this).attr("class");
        if (key in keys) {
            if (name.includes("positive")) {
                store(keys[key], "positive");
            }
            else if (name.includes("negative")) {
                store(keys[key], "negative");
            }
            else {
                remove(keys[key]);
            }
        }
    })

    jQuery(document.body).on('click', 'check-mark', function(event) {
        var value = jQuery(this).parents("div").next("div").children("div").text();
        var key = jQuery(this).parents("main").prevAll("header").children("div").children("div").children("h1").text();
        var name = jQuery(this).attr("class");
        if (key in keys) {
            if (name.includes("add")) {
            }
            else {
            }
        }
    })
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









