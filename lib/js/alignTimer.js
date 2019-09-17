class AlignTimer{
    static db;

    constructor(idx, className, parent, id, time){
        this.maxTime = time;
        AlignTimer.db = firebase.database().ref('/timers');
        this.container = document.createElement("div");
        this.container.className = className;
        this.container.id = `timer${idx}`;
        this.idx = idx;
        this.timerText = document.createElement('span');
        this.timerText.innerText = '00:00:00';
        this.timerText.className = "button timerText"
        this.container.appendChild(this.timerText)
        this.enabled = false;
        this.intervalID;

        this.setInitialTime();

        parent.appendChild(this.container);
        
        const start = document.createElement('i');
        const stop = document.createElement('i');
        const check = document.createElement('i');
        start.className = "fas fa-play timeB button";
        stop.className = "fas fa-pause timeB button";
        check.className = "fas fa-check timeB button";
        start.onclick = () => { this.start(idx) };
        stop.onclick = () => { this.pause() };
        check.onclick = () => { this.check(event, id) };
        this.container.appendChild(start);
        this.container.appendChild(stop);
        this.container.appendChild(check);

    }

    start(){
        AlignTimer.db.child(`/timer${this.idx}`).update({
            'startTime': Date.now()
        });
        this.intervalID = setInterval(async (e) => {
            this.timerText.innerText = this.formatTime(await this.getTimeElapsed());
            if(Date.parse('01/01/2019 ' + this.timerText.innerText) > Date.parse('01/01/2019 ' + this.maxTime)){
                console.log(this.timerText.style.color);
                this.timerText.style.color = "red";
            }
        }, 1000);
    }

    async getTimeElapsed(){
        const values = await AlignTimer.db.child(`/timer${this.idx}`).once('value');
        let time = Date.now() - values.val().startTime;
        if(values.val().storedTime){
            time += values.val().storedTime;
        }
        console.log(time);
        return time;
    }

    async setInitialTime(){
        const values = await AlignTimer.db.child(`/timer${this.idx}`).once('value');
        let time = 0;
        if(values.val().storedTime){
            time += values.val().storedTime;
        }
        this.timerText.innerText = this.formatTime(time);
    }

    formatTime(millis){
        const time = new Date(millis);
        const addZero = (t) => `${t}`.length === 1 ? `0${t}` : `${t}`
        const hours = addZero(time.getUTCHours());
        const minutes = addZero(time.getUTCMinutes());
        const seconds = addZero(time.getUTCSeconds());
        return `${hours}:${minutes}:${seconds}`
    }
 
    async pause(){
        const stored = await this.getTimeElapsed();
        AlignTimer.db.child(`/timer${this.idx}`).update({
            'storedTime': stored
        });
        console.log(this.intervalID);
        if(this.intervalID){
            clearInterval(this.intervalID);
        }
    }

    async check(event, id){
        let unitPath = event.path[2];
        unitPath.remove();
        firebase.database().ref('tasks/').child(id).remove();
        AlignTimer.db.child(`/timer${this.idx}`).remove();
    }
}
