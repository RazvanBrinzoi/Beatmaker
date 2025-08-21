// Definim tipuri pentru sunete și selecturi
type Track = "kick" | "snare" | "hihat";

class DrumKit {
    pads: NodeListOf<HTMLDivElement>;
    playBtn: HTMLButtonElement;
    kickAudio: HTMLAudioElement;
    snareAudio: HTMLAudioElement;
    hihatAudio: HTMLAudioElement;
    selects: NodeListOf<HTMLSelectElement>;
    muteBtns: NodeListOf<HTMLButtonElement>;
    tempoSlider: HTMLInputElement;

    currentKick: string = "./sounds/kick-classic.wav";
    currentSnare: string = "./sounds/snare-acoustic01.wav";
    currentHihat: string = "./sounds/hihat-acoustic01.wav";

    index: number = 0;
    bpm: number = 100;
    isPlaying: number | null = null;

    constructor() {
        this.pads = document.querySelectorAll(".pad");
        this.playBtn = document.querySelector(".play") as HTMLButtonElement;
        this.kickAudio = document.querySelector(".kick-sound") as HTMLAudioElement;
        this.snareAudio = document.querySelector(".snare-sound") as HTMLAudioElement;
        this.hihatAudio = document.querySelector(".hihat-sound") as HTMLAudioElement;
        this.selects = document.querySelectorAll("select");
        this.muteBtns = document.querySelectorAll(".mute");
        this.tempoSlider = document.querySelector(".tempo-slider") as HTMLInputElement;
    }

    repeat(): void {
        const step = this.index % 8;
        const activeBars = document.querySelectorAll(`.b${step}`) as NodeListOf<HTMLDivElement>;

        activeBars.forEach(bar => {
            bar.style.animation = "playTrack 0.3s alternate ease-in-out 2";
            if (bar.classList.contains("active")) {
                if (bar.classList.contains("kick-pad")) {
                    this.kickAudio.currentTime = 0;
                    this.kickAudio.play();
                }
                if (bar.classList.contains("snare-pad")) {
                    this.snareAudio.currentTime = 0;
                    this.snareAudio.play();
                }
                if (bar.classList.contains("hihat-pad")) {
                    this.hihatAudio.currentTime = 0;
                    this.hihatAudio.play();
                }
            }
        });
        this.index += 1;
    }

    start(): void {
        const interval = (60 / this.bpm) * 1000;
        if (!this.isPlaying) {
            this.isPlaying = window.setInterval(() => this.repeat(), interval);
        } else {
            clearInterval(this.isPlaying);
            this.isPlaying = null;
            this.index = 0;
        }
    }

    updateBtn(): void {
        if (this.isPlaying) {
            this.playBtn.innerText = "Stop";
            this.playBtn.classList.add("active");
        } else {
            this.playBtn.innerText = "Play";
            this.playBtn.classList.remove("active");
        }
    }

    activePad(this: HTMLDivElement): void {
        this.classList.toggle("active");
    }

    changeSound(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const selectionName = target.name;
        const selectionValue = target.value;

        switch (selectionName) {
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

    mute(event: Event): void {
        const target = event.target as HTMLButtonElement;
        const muteTrack = target.dataset.track;
        target.classList.toggle("active");

        if (muteTrack === undefined) return;

        const volume = target.classList.contains("active") ? 0 : 1;

        switch (muteTrack) {
            case "0": this.kickAudio.volume = volume; break;
            case "1": this.snareAudio.volume = volume; break;
            case "2": this.hihatAudio.volume = volume; break;
        }
    }

    changeTempo(e: Event): void {
        const target = e.target as HTMLInputElement;
        const tempoText = document.querySelector(".tempo-nr") as HTMLElement;
        this.bpm = parseInt(target.value);
        tempoText.innerText = target.value;
    }

    updateTempo(e: Event): void {
        if (this.isPlaying) clearInterval(this.isPlaying);
        this.isPlaying = null;
        this.start();
    }
}

// Initializare DrumKit
const drumKit = new DrumKit();

// Event listeners
drumKit.pads.forEach(pad => {
    pad.addEventListener("click", drumKit.activePad);
    pad.addEventListener("animationend", function() {
        (this as HTMLDivElement).style.animation = "";
    });
});

drumKit.playBtn.addEventListener("click", () => {
    drumKit.start();
    drumKit.updateBtn();
});

drumKit.selects.forEach(select => {
    select.addEventListener("change", (e) => drumKit.changeSound(e));
});

drumKit.muteBtns.forEach(btn => {
    btn.addEventListener("click", (e) => drumKit.mute(e));
});

drumKit.tempoSlider.addEventListener("input", (e) => {
    drumKit.changeTempo(e);
    drumKit.updateTempo(e);
    drumKit.updateBtn();
});
