jQuery(document).ready(function ($) {

    // Selector for password fields
    var inputPasswordSelector = "input[type=password]";

    // we need a unique attribute to identify changed input[type=password] fields by later
    var saveAttrName = "data-kaletsch-tech-showpassword-was-password";
    var saveAttrValue = "y"; // does not matter

    // Selector for changed password fields
    var inputChangedPasswordSelector = "input[type=text][" + saveAttrName + "=" + saveAttrValue + "]";

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

        if (message.kaletschTechTest) { // we need a test system if ext was injected
            sendResponse({
                validResponse: true
            });
        }

        // only act on messages for password toggles
        if (message.kaletschTechShowPasswords) {
            var $inputs;

            if (message.active) {
                $inputs = $(inputPasswordSelector);

                $inputs
                    .attr(saveAttrName, saveAttrValue) // add attr for later identification
                    .attr("type", "text") // password -> text => password is shown to user
                ;
            } else {
                $inputs = $(inputChangedPasswordSelector);

                $inputs
                    .removeAttr("data-kaletsch-tech-showpassword-was-password") // cleanup identification attribute
                    .attr("type", "password"); // text -> password => password are hidden again
            }

            // show some stats
            sendResponse({
                validResponse: true,
                total: $inputs.length,
                visible: $inputs.filter(":visible").length
            });
        }

        if (message.kaletschTechExtractPasswords) {
            var passwords = [];

            // extract all passwords
            $(inputPasswordSelector + "," + inputChangedPasswordSelector).each(function () {
                passwords.push($(this).val())
            });

            // and show them in extension popup
            sendResponse({
                validResponse: true,
                passwords: passwords
            });
        }

    });
});

