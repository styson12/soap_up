const keys = {
    //Subjective
    "S": {
        "_esoTextModel['_esoFieldModel[\\'vm.patientComplaint.chiefComplaint\\']']": "Chief Complaint",
        "Add History": "History",
        "Add Allergies" : "Allergies",
        "Add Medications": "Medications",
    },
    //Objective
    "O": {
        "_esoTextModel['_esoFieldModel[\\'currentVital.pulse.pulseRate\\']']": "HR",
        "_esoTextModel['_esoFieldModel[\\'currentVital.bloodPressure.bloodPressureSystolic\\']']": "SBP",
        "_esoTextModel['_esoFieldModel[\\'currentVital.bloodPressure.bloodPressureDiastolic\\']']": "ABP", 
        "_esoTextModel['_esoFieldModel[\\'currentVital.respiration.respirationRate\\']']": "RR",
        "_esoFieldModel['currentVital.respiration.respirationQualityId']": "Respiratory Quality",
        "_esoFieldModel['currentVital.respiration.respirationRhythmId']": "Respiratory Rhythm",
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
    }
};

browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log("Message received");
      if (request.soap == true) {
        sendResponse({confirmation: "scrubbing..."});
        browser.storage.local.get(null, function(items) {
            var soap_string = "";
            var soap_order = ["S", "O", "A", "P"];
            for(let letter of soap_order) {
                for (let category in items) {
                    if (category == letter) {
                        soap_string += `${category})\n`;
                        for (let field in items[category]){
                            soap_string += `    ${field}: `;
                            if (Array.isArray(items[category][field])) {
                                soap_string += "\n"
                                for (let value in items[category][field]){
                                    var indent_length = field.length + 6;
                                    var indent = " ".repeat(indent_length);
                                    soap_string += `${indent}${items[category][field][value]}\n`;
                                }
                                soap_string += '\n';
                            }
                            else {
                                soap_string += `${items[category][field]} \n`;
                            }
                        }
                    }
                }
            }
            console.log(soap_string);
            jQuery('textarea').val(soap_string);
        });
      }
    });

function store(obj) {
    browser.storage.local.set(obj, function() {
        console.log("category updated");
        console.log(obj);
        });
} 

function remove(category, field) {
    getCategory(category, function(catObj) {
        delete catObj[category][field];
        console.log(`${field} removed from ${category}`);
        store(catObj);
    })
}

function getCategory(category, callback) {
    browser.storage.local.get(category, function(result) {
        if (jQuery.isEmptyObject(result)) {
            var obj = {};
            obj[category] = {};
            callback(obj);
        }
        else {
           callback(result);
        }
   })  
}

function keyExists(key) {
    for (let category in keys) {
        if (key in keys[category]) return category;
    }
    return false;
}

function append(category, field, value) {
    getCategory(category, function(catObj){
        if (jQuery.isEmptyObject(catObj[category][field])) {
            var arr = [];
            arr.push(value);
            catObj[category][field] = arr;
            store(catObj);
        }
        else {
            if (field == "Flowchart") {
                var exists = false;
                for (let s in catObj[category][field]) {
                    if(value.includes(catObj[category][field][s])) {
                        catObj[category][field][s] = value;
                        store(catObj);
                        exists = true;
                    }
                }
                if (!exists){
                    catObj[category][field].push(value);
                    store(catObj);
                }
            }
            else if (!catObj[category][field].includes(value)){
                catObj[category][field].push(value);
                store(catObj);
            }
        }
    })
}

function unappend(category, field, value) {
    getCategory(category, function(catObj){
        catObj[category][field].splice(catObj[category][field].indexOf(value), 1)
        if(catObj[category][field].length == 0){
            remove(category, field);
        }
        else {
            store(catObj);
        }
    })
}

scan();

function scan() {
    var called = false; 
    jQuery(document.body).on('change paste keyup', 'input, textarea', function(event) {
            var target = this;
            var key = target.getAttribute("ng-model");
            if (called == false) {
                setTimeout(function () {
                    var category = keyExists(key);
                    if (category) {
                        var field = keys[category][key];
                        if (target.value === "") remove(category, field);
                        else {
                            getCategory(category, function(catObj){
                                catObj[category][field] = target.value;
                                store(catObj);
                            });
                        }
                    }
                    called = false;
                }, 1000);
                called = true; 
            }
    });
    
    jQuery(document.body).on('DOMSubtreeModified', 'div.display-value', function(event) {
        var key = jQuery(this).parents("eso-single-select").attr("ng-model");
        var value = jQuery(this).text();
        var category = keyExists(key);
        if (category) {
            var field = keys[category][key];
            if (value != "") {
                getCategory(category, function(catObj){
                    catObj[category][field] = value;
                    store(catObj);
                });
            }
        }
    });

    // jQuery(document.body).on('click', 'div.label-container', function(event) {
    //     var value = jQuery(this).children("div").text();
    //     if (value.includes("Clear Selection")) {
    //         var key = jQuery(this).parents("eso-shelf.eso-modal-family show").chilren;
    //         console.log(key);
    //     }
    // });

    // jQuery(document.body).on('change', 'eso-single-select', function(event) {
    //     if(jQuery(this).attr("class").includes("quick-pick-mode")){
    //         var key = jQuery(this).attr("ng-model");
    //         var category = keyExists(key);
    //         if (category) {
    //             var field = keys[category][key];
    //             remove(category, field);
    //         }
    //     }
    // })

///////////////////////////////////////
// MutationObserver = window.MutationObserver || window.WebKitMutationObserver;


//     function callback(mutationsList, observer) {
//         console.log('Mutations:', mutationsList);
//         console.log('Observer:', observer);
//         mutationsList.forEach(mutation => {
//             if (mutation.attributeName === 'class') {
//                 console.log('Ch-ch-ch-changes!');
//             }
//         })
//     }

//     const mutationObserver = new MutationObserver(callback);
//     mutationObserver.observe(document, { attributes: true });

//////////////////////////////

    jQuery(document.body).on('click', 'eso-slide-toggle', function(event) {
        var key = jQuery(this).attr("ng-model");
        var name = jQuery(this).attr("class");
        var category = keyExists(key);
        if (category) {
            var field;
            if (key.includes("skin")) field = "Skin";
            else if (key.includes("eyes")) field = "Eyes";
            var value = keys[category][key];
            if (name.includes("positive")) append(category, field, value);
            else unappend(category, field, value);
        }
    });

    jQuery(document.body).on('click', 'check-mark', function(event) {
        var value = jQuery(this).parents("div").next("div").children("div").text();
        var key = jQuery(this).parents("main").prevAll("header").children("div").children("div").children("h1").text();
        var name = jQuery(this).attr("class");
        var category = keyExists(key);
        if (category) {
            var field = keys[category][key];
            if (name.includes("add")) {
               append(category, field, value);
            }
            else {
                unappend(category, field, value);
            }
        }
    });

    jQuery(document.body).on('DOMNodeInserted DOMSubtreeModified', 'grid-row[data-key]', function(event) {
        var time = jQuery(this).children("grid-cell.date").children("strong").text();
        var treatment = jQuery(this).children("grid-cell.treatment").children("strong").text();
        var summary = jQuery(this).children("grid-cell.summary").children("div").text();
        var value = `${time}  ${treatment}  ${summary}`;
        if (!value.includes("{")) append("P", "Flowchart", value);
    });

    jQuery(document.body).on('click', 'button:contains("New Record"), button:contains("CAD Import"), button:contains("NEW PATIENT")', function(event){
        browser.storage.local.clear(function() {
            console.log("Cleared browser storage.")
          });
    });

}












