let mediaDevices = undefined,
    optionMedia = {
        audio: true,
        video: {
            width: 1024,
            height: 720,
            facingMode: "user"
        }
    },
    optionRecord = {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2048000,
        // mimeType: "video/webm;codecs=vp9",
        mimeType: "video/webm"
    },
    id = "",
    mediaStream = undefined,
    mediaRecord = undefined
const video = document.getElementById('video'),
    videoData = [],
    btnStart = document.getElementById('play'),
    btnStop = document.getElementById('stop')

//
function isValid(){

    let valid = true

    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {

        navigator.mediaDevices.getUserMedia = function(constraints) {

            const getUserMedia = navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia

            if (!getUserMedia) {
                valid = false
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
            }

            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject)
            })

        }

    }

    if(mediaDevices === undefined) mediaDevices = navigator.mediaDevices

    return valid

}

//
async function initMedia(_media){

    mediaStream = await mediaDevices.getUserMedia(optionMedia)
    id = mediaStream.id

    mediaRecord = new MediaRecorder(mediaStream, optionRecord)

    window.mediaStream = mediaStream
    window.mediaRecorder = mediaRecord

}

function onDataAvailable(e){
    videoData.push(e.data)
}

function onStop() {
    loading()
}

function loading(){

    const blob = new Blob(videoData, {type: optionRecord.mimeType})
    videoData.length = 0

    const recordedMedia = document.createElement("VIDEO")
    recordedMedia.controls = true

    const recordedMediaURL = URL.createObjectURL(blob)

    recordedMedia.src = recordedMediaURL

    const downloadButton = document.createElement("A")

    downloadButton.download = "media"

    downloadButton.href = recordedMediaURL
    downloadButton.innerText = "Download"

    downloadButton.onclick = () => {
        return URL.createObjectURL(blob)
    }

    document.getElementById("section").insertAdjacentElement("beforeend", recordedMedia)
    document.getElementById("section").insertAdjacentElement("beforeend", downloadButton)

}

btnStart.addEventListener("click", async function(){

    if(isValid()){

        await initMedia(video)

        mediaRecord.start()

        mediaRecord.addEventListener("dataavailable", onDataAvailable)

        mediaRecord.addEventListener("stop", onStop)

        video.srcObject = mediaStream

        btnStop.removeAttribute("disabled")
        btnStart.setAttribute("disabled", "disabled")

    }

})

btnStop.addEventListener("click", function () {

    if(mediaRecorder !== undefined && mediaRecord.state === "recording") {

        mediaRecorder.stop()

        mediaStream.getTracks()
            .forEach((track) => {
                track.stop()
            })

        btnStart.removeAttribute("disabled")
        btnStop.setAttribute("disabled", "disabled")

    }

})
