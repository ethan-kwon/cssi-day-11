let googleUser = null

window.onload = () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // this code runs if the user is logged in
            console.log("logged in as", user.displayName)
            const welcomeMessage = document.querySelector("#welcome");
            welcomeMessage.innerHTML = `Welcome ${user.displayName} <br> What's on your mind?`
            googleUser = user;
        } else {
            // this code runs if the user is not logged in
            console.log("not logged in")
        }
    })

    const createNoteButton = document.querySelector("#createNoteButton");
    createNoteButton.addEventListener("click", () => {
        // get values from the form
        const noteTitle = document.querySelector("#noteTitle").value;
        const noteText = document.querySelector("#noteText").value;
        const noteLabels = document.querySelector("#noteLabels").value;
        console.log(noteTitle, noteText, noteLabels.split(" "));

        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);

        // write these values to the database
        firebase.database().ref(`/users/${googleUser.uid}`).push({
            title: noteTitle,
            text: noteText,
            created: today.toUTCString(),
            labels: noteLabels.split(" ")
        }).then(() => {
            console.log("database write successful");
            document.querySelector("#noteTitle").value = "";
            document.querySelector("#noteText").value = "";
            document.querySelector("#noteLabels").value = "";
        })
        .catch(error => {
            console.log("error writing new note: ", error);
        })
    })
}