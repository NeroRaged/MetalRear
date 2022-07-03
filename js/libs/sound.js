var Sound = function (source, volume, loop) {
            this.source = source;
            this.volume = volume;
            this.loop = loop;
            var son;
            this.son = son;
            this.finish = false;
            this.stop = function () {
                try{
                    document.body.removeChild(this.son);
                }catch(e){
                    
                }
            }
            this.start = function () {
                /*
                <audio controls loop autoplay hidden>
                    <source src="bosse.mp3" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                */
                if (this.finish) return false;
                this.son = document.createElement("audio");
                this.son.setAttribute("loop","");
                this.son.setAttribute("autoplay","");
                this.verySon = document.createElement("source");
                this.son.setAttribute("src",this.source);
                this.son.setAttribute("type", "audio/mpeg");
                
                document.body.appendChild(this.son);
            }
            this.remove = function () {
                document.body.removeChild(this.son);
                this.finish = true;
            }
            this.init = function (volume, loop) {
                this.finish = false;
                this.volume = volume;
                this.loop = loop;
            }
        };