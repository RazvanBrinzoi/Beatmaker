class DrumKit{
    constructor(){
        this.pads = document.querySelectorAll(".pad");
        this.playBtn = document.querySelector(".play");
        this.currentKick = "./sounds/kick-classic.wav";
        this.currentSnare = "./sounds/snare-acoustic01.wav";
        this.currentHihat = "./sounds/hihat-acoustic01.wav";
        this.kickAudio = document.querySelector(".kick-sound");
        this.snareAudio = document.querySelector(".snare-sound");
        this.hihatAudio = document.querySelector(".hihat-sound");
        this.index = 0;
        this.bpm = 100;
        this.isPlaying = null;
        this.selects = document.querySelectorAll("select");
        this.muteBtns = document.querySelectorAll(".mute")
        this.tempoSlider = document.querySelector(".tempo-slider");
    }
    repeat(){
        let step = this.index % 8;
        //console.log("step "+step+" and index "+this.index);
        const activeBars = document.querySelectorAll(".b"+step);
        //console.log(activeBars);
        activeBars.forEach(bar => {
            bar.style.animation = "playTrack 0.3s alternate ease-in-out 2";
            //check if active
            if(bar.classList.contains("active")){
                //check each sound
                if(bar.classList.contains("kick-pad")){
                    //this.kickAudio.play();
                    this.kickAudio.currentTime = 0;
                    this.kickAudio.play();
                }
                if(bar.classList.contains("snare-pad")){
                    //this.snareAudio.play();
                    this.snareAudio.currentTime =0;
                    this.snareAudio.play();
                }
                if(bar.classList.contains("hihat-pad")){
                    //this.hihatAudio.play();
                    this.hihatAudio.currentTime = 0;
                    this.hihatAudio.play();
                }
            }
        });
        this.index += 1;
    }
    start(){
        const interval = (60/this.bpm) * 1000;
        if(!this.isPlaying){
            this.isPlaying = setInterval(() => {
                this.repeat();
            }, interval);
        }else{
            clearInterval(this.isPlaying);
            this.isPlaying = null;
            this.index = 0;
        }
    }

    updateBtn() {
        if(this.isPlaying){
            this.playBtn.innerText = "Stop";
            this.playBtn.classList.add =(".active");
            console.log(this.playBtn.classList);
        }else{
            this.playBtn.innerText = "Play";
            this.playBtn.classList.remove =("active");
        }
    }

    activePad(){
        this.classList.toggle("active");
    }

    changeSound(event){
        //console.log(event);
        const selectionName = event.target.name;
        //console.log(selectionName);
        const selectionValue = event.target.value;
        console.log(selectionValue);
        switch(selectionName){
            case "kick-select":
                this.kickAudio.src = selectionValue;
                break;
            case "snare-select":
                this.snareAudio.src = selectionValue;
                break;
            case "hihat-select":
                this.hihatAudio.src = selectionValue;
                break;
        }
    }

    mute(event){
        //console.log(event);
        const muteTrack = event.target.getAttribute("data-track");
        //console.log(muteTrack);
        event.target.classList.toggle("active");
        if(event.target.classList.contains("active")){
            switch(muteTrack){
                case "0":
                    this.kickAudio.volume = 0;
                    break;
                case "1":
                    this.snareAudio.volume = 0;
                    break;
                case "2":
                    this.hihatAudio.volume = 0;
                    break;
            }
        }else{
            switch(muteTrack){
                case "0":
                    this.kickAudio.volume = 1;
                    break;
                case "1":
                    this.snareAudio.volume = 1;
                    break;
                case "2":
                    this.hihatAudio.volume = 1;
                    break;
            }
        }
    }

    changeTempo(e){
        //console.log(e);
        const tempoText = document.querySelector(".tempo-nr");
        this.bpm = e.target.value;
        tempoText.innerText = e.target.value;
    }
    
    updateTempo(e){
        clearInterval(this.isPlaying);
        this.isPlaying = null;
        const playBtn = document.querySelector(".play");
        this.start();
    }
}

const drumKit = new DrumKit();
//drumKit.start();
drumKit.pads.forEach(pad => {
    pad.addEventListener("click", drumKit.activePad);
    pad.addEventListener("animationend", function(){
        this.style.animation = "";
    });
});

drumKit.playBtn.addEventListener("click", ()=>{
    drumKit.start();
    drumKit.updateBtn();
});

drumKit.selects.forEach(select => {
    select.addEventListener("change", function(event){
        drumKit.changeSound(event);
    });
});

drumKit.muteBtns.forEach(btn =>{
    btn.addEventListener("click", function(event){
        drumKit.mute(event);
    });
});

drumKit.tempoSlider.addEventListener("input", function(e){
    drumKit.changeTempo(e);
});

drumKit.tempoSlider.addEventListener("input", function(e){
    drumKit.updateTempo(e);
    drumKit.updateBtn();
});
