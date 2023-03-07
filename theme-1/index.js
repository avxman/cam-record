class RecordCamera{

    constructor(options = {
        optionMedia:{
            audio: true,
            video: {
                width: 1024,
                height: 720,
                facingMode: "user"
            }
        },
        optionRecord:{
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2048000,
            // mimeType: "video/webm;codecs=vp9",
            mimeType: "video/webm"
        },
        maxSize: 52428800, // 50Mb, 52428800
        elementVideo: "#video-record",
        elementContainer: "#video-record-download",
        elementGroupBtn: "#video-record-group-btn",
        elementBtnPlay: "#play",
        elementBtnStop: "#stop",
        linkUpload: "/record-camera-upload",
    }) {

        // variables
        this.mediaDevices = undefined
        this.mediaStream = undefined
        this.mediaRecord = undefined
        this.timeoutTrack = undefined
        this.id = ""
        this.size = 0
        this.linkFromVideo = ""

        // const
        this.videoData = []
        this.interval = 1000
        this.linkUpload = options.linkUpload
        this.optionMedia = options.optionMedia
        this.optionRecord = options.optionRecord
        this.maxSize = options.maxSize
        this.video = document.querySelector(options.elementVideo)
        this.btnPlay = document.querySelector(options.elementBtnPlay)
        this.btnStop = document.querySelector(options.elementBtnStop)
        this.container = document.querySelector(options.elementContainer)
        this.groupBtn = document.querySelector(options.elementGroupBtn)

        this.onBtnPlay()
        this.onBtnStop()

    }

    onBtnPlay()
    {
        this.btnPlay.addEventListener("click", async ()=>{

            if(this.isValid() && await this.initMedia(this.video)){

                this.clearContent()

                this.mediaRecord.addEventListener("dataavailable", (e)=>{
                    this.onDataAvailable(e)
                })

                this.mediaRecord.addEventListener("stop", ()=>{
                    this.onStop()
                })

                this.mediaRecord.start()

                this.video.srcObject = mediaStream

                this.timeoutTrack = setInterval(() => {
                    this.updateTrack()
                }, this.interval)

                this.btnChange()

            }

        })
    }

    onBtnStop()
    {
        this.btnStop.addEventListener("click", () => {
            this.stop()
        })
    }

    clearContent(){
        this.container.innerHTML = ""
        this.groupBtn.innerHTML = ""
    }

    isValid(){

        let valid = true

        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {}
        }

        if (navigator.mediaDevices.getUserMedia === undefined) {

            navigator.mediaDevices.getUserMedia = (constraints)=>{

                const getUserMedia = navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia

                if (!getUserMedia) {
                    valid = false
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
                }

                return new Promise((resolve, reject) => {
                    getUserMedia.call(navigator, constraints, resolve, reject)
                })

            }

        }

        if(this.mediaDevices === undefined) this.mediaDevices = navigator.mediaDevices

        return valid

    }

    btnChange(isPlay = true) {
        if(isPlay){
            this.btnStop.removeAttribute("disabled")
            this.btnPlay.setAttribute("disabled", "disabled")
        }
        else{
            this.btnPlay.removeAttribute("disabled")
            this.btnStop.setAttribute("disabled", "disabled")
        }
    }

    sizeValid(){
        if(this.size < this.maxSize && this.size >= this.maxSize*0.9){
            console.log("Скоро будет привышен лимит размера записи")
        }
        else if(this.size >= this.maxSize){
            console.log("Лимит записи привышен. Останавливаю запись")
            this.stop()
        }
    }

    async initMedia(_media) {

        try{
            this.mediaStream = await this.mediaDevices.getUserMedia(this.optionMedia)
            this.id = this.mediaStream.id

            this.mediaRecord = new MediaRecorder(this.mediaStream, this.optionRecord)

            window.mediaStream = this.mediaStream
            window.mediaRecorder = this.mediaRecord

            return true
        }
        catch (e) {
            console.log(e.message)
            return false
        }

    }

    onDataAvailable(e){
        this.videoData.push(e.data)
        this.size += e.data.size
        this.sizeValid()
    }

    onStop() {
        this.stopped()
    }

    stop(){

        if(this.mediaRecord !== undefined && this.mediaRecord.state === "recording") {

            this.mediaRecord.stop()

            this.mediaStream.getTracks()
                .forEach((track) => {
                    track.stop()
                })

            if(this.timeoutTrack !== undefined){
                clearInterval(this.timeoutTrack)
            }

            this.btnChange(false)

        }

    }

    stopped(){

        const blob = new Blob(this.videoData, {type: this.optionRecord.mimeType})

        this.videoData.length = 0

        const recordedMediaURL = URL.createObjectURL(blob)

        this.insertBtn(
            this.createTagVideo(recordedMediaURL),
            this.createTagLink(recordedMediaURL),
            this.createTagAttach(blob)
        )

    }

    createTagVideo(recordedMediaURL)
    {

        const recordedMedia = document.createElement("VIDEO")

        recordedMedia.controls = true

        recordedMedia.src = recordedMediaURL

        return recordedMedia

    }

    createTagLink(recordedMediaURL)
    {

        const downloadButton = document.createElement("A")

        downloadButton.id = "btn-download"

        downloadButton.download = "media"

        downloadButton.href = recordedMediaURL

        downloadButton.innerText = "Download"

        downloadButton.onclick = () => {
            return recordedMediaURL
        }

        return downloadButton

    }

    createTagAttach(blob)
    {
        const uploadButton = document.createElement("A")

        uploadButton.id = "btn-upload"

        uploadButton.href = "#"

        uploadButton.innerText = "Attach"

        uploadButton.onclick = async () => {
            await this.onSend(blob)
        }

        return uploadButton
    }

    insertBtn(contentMedia, contentLink, contentUpload)
    {
        this.container.insertAdjacentElement("beforeend", contentMedia)
        this.groupBtn.insertAdjacentElement("beforeend", contentLink)
        this.groupBtn.insertAdjacentElement("beforeend", contentUpload)
        this.container.classList.add("active")
    }

    updateTrack(){
        if(this.mediaRecord !== undefined)
            this.mediaRecord.requestData()
    }

    // TODO До делать отправку видео на сервер и получение ссылки после сохранения
    async onSend(data)
    {

        const res = await fetch(
            this.linkUpload,
            {
                method: "POST",
                body: data
            }
        )
        if(res.ok){
            console.log("Good!")
            const data = await res.json()
            if(data.link) this.linkFromVideo = data.link
            else console.warn("Link not found")
        }
        else{
            console.error("Bad")
        }

            // .then(response => {
            //     if (response.ok) return response
            //     else throw Error(`Server returned ${response.status}: ${response.statusText}`)
            // })
            // .then(response => console.log(response.text()))
            // .catch(err => {
            //     console.log(err)
            // })
    }


}