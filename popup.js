function sendMessageToCurrentTab(options, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) { // get active tab and
        chrome.tabs.sendMessage(tabs[0].id, options, {}, callback); // send message to it
    });
}

function toggle(active) {
    sendMessageToCurrentTab(
        {
            'kaletschTechShowPasswords': true,
            "active": active
        },
        function (data) {
            if(!checkData(data)){
                return;
            }

            // show some stats
            $("#stats")
                .show()
                .html(
                    "Passwords " + (active ? "shown" : "hidden") + "<br />" +
                    data.visible + " / " + data.total + " Passwords visible"
                )
            ;

        }
    );
}

function checkData(data) {
    if(
        typeof data === "undefined" ||
        !data ||
        typeof data.validResponse !== "boolean" ||
        !data.validResponse
    ){
        $("#invalidResponse").show();
        return false;
    } else {
        $("#invalidResponse").hide();
        return true;
    }
}

function showInvalidDataMsg() {

}

jQuery(document).ready(function ($) {

    $("#showPasswords").click(function () {
        $("#showPasswords").hide();
        $("#hidePasswords").show();
        toggle(1);
    });

    $("#hidePasswords").click(function () {
        $("#showPasswords").show();
        $("#hidePasswords").hide();
        toggle(0);
    });

    $("#extractPasswords").click(function () {
        sendMessageToCurrentTab(
            {'kaletschTechExtractPasswords': true},
            function (data) {

                if(!checkData(data)){
                    return;
                }

                $("#stats--pwd")
                    .html(data.passwords.length + " Password(s) found")
                    .show();

                $("#passwords")
                    .val(data.passwords.join("\n"))
                    .show("");

                $("#clearPasswords").show();
            }
        );

    });

    $("#clearPasswords").click(function () {
        $("#stats--pwd").hide();
        $("#passwords").hide("").val("");
        $("#clearPasswords").hide();
    });

    sendMessageToCurrentTab({'kaletschTechTest': true}, function (data) {
        if(!checkData(data)){
            $("#showPasswords").hide();
            $("#extractPasswords").hide();
        }
    });

});