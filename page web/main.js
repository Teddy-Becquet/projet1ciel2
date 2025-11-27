window.addEventListener("load", function () {
    let consent = confirm("Do you accept cookies?");

    if (consent) {
        console.log("The user has accepted the cookies.");
    } else {
        console.log("The user has refused the cookies.");
    }
});
