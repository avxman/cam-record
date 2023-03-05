const localVideo = document.getElementById('localVideo');
const fileName = 'media.webm';
let chunks = [];
let mediaRecorder;

const startRecord = async () => {
    const mimeType = 'video/webm;codecs=vp9';

    if (!MediaRecorder.isTypeSupported(mimeType)) {
        alert('vp8/opus mime type is not supported');

        return;
    }

    const options = {
        audioBitsPerSecond: 128000,
        mimeType,
        videoBitsPerSecond: 2500000
    }

    const mediaStream = await getLocalMediaStream();

    mediaRecorder = new MediaRecorder(mediaStream, options);

    setListeners();

    mediaRecorder.start(10000);
};

const getLocalMediaStream = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = mediaStream;

    return mediaStream;
};

const setListeners = () => {
    mediaRecorder.ondataavailable = handleOnDataAvailable;
    mediaRecorder.onstop = handleOnStop;
};

const handleOnDataAvailable = ({ data }) => {
    if (data.size > 0) {
        chunks.push(data);
    }
};

const handleOnStop = () => {
    saveFile();

    destroyListeners();
    mediaRecorder = undefined;
};

const destroyListeners = () => {
    mediaRecorder.ondataavailable = undefined;
    mediaRecorder.onstop = undefined;
};

const stopRecord = async () => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
};

const saveFile = () => {

    const blob = new Blob(chunks);

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.style.display = 'none';
    link.href = blobUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
    chunks = [];

};