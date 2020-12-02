class Grain {
   
    constructor(num, bufnum, positionx, positiony,attack,release,spread, rate){
        // console.log(rate);
       this.num = num;
       this.bufnum = bufnum;
        this.now = context.currentTime; //update the time value
        //create the source
        this.source = context.createBufferSource();
        this.source.playbackRate.value = this.source.playbackRate.value * rate;
        this.source.buffer = buffers[bufnum];
        
        //create the gain for enveloping
        this.gain = context.createGain();
        this.gain.connect(master);


        this.source.connect(this.gain);
        //update the position and calcuate the offset
        
        this.positionx = positionx;
        this.positiony = positiony;

        this.offset = this.positionx * (buffers[this.bufnum].duration / CANVASWIDTH); //pixels to seconds
        
        //update and calculate the amplitude
        this.amp = this.positiony / CANVASHEIGHT;
        this.amp = map(this.amp,0.0,1.0,1.0,0.0) * 0.7;
        
        //playback rate
        this.rate = rate;


        //parameters
        this.attack = attack * 0.4;
        this.release = release * random(1.5, 9.0);

        if(this.release < 0){
            this.release = 0.1; // 0 - release causes mute for some reason
        }
        this.spread = spread;
    
        this.randomoffset = (Math.random() * this.spread) - (this.spread / 2); //in seconds
        ///envelope

        this.alive = true;
        this.timeBorn = millis();
        this.lifespan = 2000.0;
        this.lifeWidth = 100;

    }


    checkLife(currentTime){
        // console.log(currentTime);
        const timeElapsed = currentTime - this.timeBorn;
        this.lifeWidth -= 5;
        fadeVals[this.bufnum] += 5;
        if(timeElapsed > this.lifespan){
            // console.log('should return true');
            this.alive = false;
        }
        

        
        
    }


    display(){
        	//drawing the lines
	stroke(random(125) + 125, random(250), random(250)); //,(this.amp + 0.8) * 255
	strokeWeight(this.amp * this.lifeWidth);
	this.randomoffsetinpixels = this.randomoffset / (buffers[this.bufnum].duration / CANVASWIDTH);
	//p.background();
    // line(this.positionx + this.randomoffsetinpixels, TRACKHEIGHT * this.bufnum , this.positionx + this.randomoffsetinpixels, TRACKHEIGHT * this.bufnum + TRACKHEIGHT);
     line(this.positionx + this.randomoffsetinpixels, trackOffsets[this.bufnum] , this.positionx + this.randomoffsetinpixels, trackOffsets[this.bufnum] + TRACKHEIGHT*2);

    }


    play(){
        const dur = this.attack + this.release;
        // console.log(dur);
        let offset = this.offset + this.randomoffset;
 
        if(offset <= 0){
            offset = 0;
        }
        
        this.source.start(this.now, offset, dur); //parameters (when,offset,duration)
        fadeVals[this.bufnum] = 0;
        // this.source.start();
        
         this.gain.gain.setValueAtTime(0.0, this.now);
         this.gain.gain.linearRampToValueAtTime(this.amp,this.now + this.attack);
         this.gain.gain.linearRampToValueAtTime(0,this.now + (this.attack +  this.release) );
        
        //garbage collection
         this.source.stop(this.now + this.attack + this.release + 0.1); 
        var tms = (this.attack + this.release) * 1000; //calculate the time in miliseconds
        setTimeout(() => {
            this.gain.disconnect();
            // if(yes === 1){
            //     that.panner.disconnect();
            // }
        },tms + 200);
    }
}
