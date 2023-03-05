const mediaSelector = document.getElementById("media");

const webCamContainer =
    document.getElementById("web-cam-container");

let selectedMedia = null;

// This array stores the recorded media data
let chunks = [];

mediaSelector.addEventListener("change", (e) => {

    // Takes the current value of the mediaSeletor
    selectedMedia = e.target.value;

    if(selectedMedia !== "video" && selectedMedia !== "audio"){
        return;
    }

    document.getElementById(
        `${selectedMedia}-recorder`)
        .style.display = "block";

    document.getElementById(
        `${otherRecorderContainer(
            selectedMedia)}-recorder`)
        .style.display = "none";

});

function otherRecorderContainer(selectedMedia) {

    return selectedMedia === "video" ?
        "audio" : "video";

}

const audioMediaConstraints = {
    audio: true,
    video: false,
};

const videoMediaConstraints = {
    audio: true,
    video: true,
};

// When the user clicks the "Start
// Recording" button this function
// gets invoked
function startRecording(thisButton, otherButton) {

    // Access the camera and microphone
    navigator.mediaDevices.getUserMedia(
        selectedMedia === "video" ?
            videoMediaConstraints :
            audioMediaConstraints)
        .then((mediaStream) => {

            // Create a new MediaRecorder instance
            const mediaRecorder = new MediaRecorder(mediaStream);

            //Make the mediaStream global
            window.mediaStream = mediaStream;
            //Make the mediaRecorder global
            window.mediaRecorder = mediaRecorder;

            mediaRecorder.start();

            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            // When the MediaRecorder stops
            // recording, it emits "stop"
            // event
            mediaRecorder.onstop = () => {

                const blob = new Blob(
                    chunks, {
                        type: selectedMedia === "video" ?
                            "video/mp4" : "audio/mpeg"
                    });
                chunks = [];

                // Create a video or audio element
                // that stores the recorded media
                const recordedMedia = document.createElement(
                    selectedMedia === "video" ? "video" : "audio");
                recordedMedia.controls = true;

                // You can not directly set the blob as
                // the source of the video or audio element
                // Instead, you need to create a URL for blob
                // using URL.createObjectURL() method.
                const recordedMediaURL = URL.createObjectURL(blob);

                // Now you can use the created URL as the
                // source of the video or audio element
                recordedMedia.src = recordedMediaURL;

                // Create a download button that lets the
                // user download the recorded media
                const downloadButton = document.createElement("a");

                // Set the download attribute to true so that
                // when the user clicks the link the recorded
                // media is automatically gets downloaded.
                downloadButton.download = "media";

                downloadButton.href = recordedMediaURL;
                downloadButton.innerText = "Download it!";

                downloadButton.onclick = () => {

                    /* After download revoke the created URL
                    using URL.revokeObjectURL() method to
                    avoid possible memory leak. Though,
                    the browser automatically revokes the
                    created URL when the document is unloaded,
                    but still it is good to revoke the created
                    URLs */
                    URL.revokeObjectURL(recordedMedia);
                };

                document.getElementById(
                    `${selectedMedia}-recorder`).append(
                    recordedMedia, downloadButton);
            };

            if (selectedMedia === "video") {

                // Remember to use the srcObject
                // attribute since the src attribute
                // doesn't support media stream as a value
                webCamContainer.srcObject = mediaStream;
            }

            document.getElementById(
                `${selectedMedia}-record-status`)
                .innerText = "Recording";

            thisButton.disabled = true;
            otherButton.disabled = false;
        });
}

function stopRecording(thisButton, otherButton) {

    // Stop the recording
    window.mediaRecorder.stop();

    // Stop all the tracks in the
    // received media stream
    window.mediaStream.getTracks()
        .forEach((track) => {
            track.stop();
        });

    document.getElementById(
        `${selectedMedia}-record-status`)
        .innerText = "Recording done!";
    thisButton.disabled = true;
    otherButton.disabled = false;
}