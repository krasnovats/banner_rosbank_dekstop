(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"index_atlas_1", frames: [[2029,433,17,17],[693,748,28,17],[2029,414,19,17],[2029,452,17,17],[2032,276,16,17],[2032,295,16,17],[557,743,26,20],[2032,314,16,17],[2032,371,14,17],[2029,471,17,17],[2029,528,15,17],[1895,640,15,17],[2032,333,16,17],[2029,490,17,17],[531,690,56,51],[1895,660,56,52],[2029,509,17,17],[589,690,56,49],[1837,640,56,67],[1741,640,56,76],[647,690,51,49],[2032,352,16,17],[1917,552,62,106],[773,640,57,106],[832,640,57,106],[1186,640,56,106],[1981,552,60,106],[1953,660,56,52],[1523,640,50,106],[1244,640,56,106],[531,582,59,106],[1799,640,36,106],[1302,640,56,106],[1659,640,44,106],[891,640,57,106],[1470,640,51,106],[653,582,58,106],[950,640,57,106],[1009,640,57,106],[1360,640,53,106],[1415,640,53,106],[1068,640,57,106],[1127,640,57,106],[713,640,58,106],[592,582,59,106],[1575,640,45,106],[1705,640,34,136],[1787,502,63,136],[795,502,72,136],[1852,502,63,136],[1720,502,65,136],[1584,502,66,136],[720,502,73,136],[1652,502,66,136],[1164,502,69,136],[1942,0,99,136],[1235,502,69,136],[869,502,72,136],[2011,660,29,37],[1921,714,26,37],[589,741,24,37],[1949,714,26,37],[1917,502,23,37],[615,741,24,37],[641,741,24,37],[1977,714,26,37],[667,741,24,37],[2011,699,27,37],[1741,718,26,37],[1892,714,27,37],[1769,718,26,37],[1865,734,25,37],[531,743,24,37],[2005,738,25,37],[1837,734,26,37],[0,502,529,477],[1622,640,35,136],[1306,502,69,136],[1377,502,67,136],[1446,502,67,136],[1942,276,88,136],[943,502,72,136],[531,502,187,78],[1017,502,72,136],[1942,414,85,136],[1837,709,53,23],[1515,502,67,136],[1091,502,71,136],[1942,138,94,136],[0,0,1940,500]]}
];


(lib.AnMovieClip = function(){
	this.currentSoundStreamInMovieclip;
	this.actionFrames = [];
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(positionOrLabel);
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		var keys = this.soundStreamDuration.keys();
		for(var i = 0;i<this.soundStreamDuration.size; i++){
			var key = keys.next().value;
			key.instance.stop();
		}
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var keys = this.soundStreamDuration.keys();
			for(var i = 0; i< this.soundStreamDuration.size ; i++){
				var key = keys.next().value; 
				var value = this.soundStreamDuration.get(key);
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					this.soundStreamDuration.delete(key);
				}
			}
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var keys = this.soundStreamDuration.keys();
				var maxDuration = 0;
				for(var i=0;i<this.soundStreamDuration.size;i++){
					var key = keys.next().value;
					var value = this.soundStreamDuration.get(key);
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				}
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_275 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_273 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_271 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_272 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_276 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_270 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_265 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_278 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_268 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_267 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_264 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_277 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_261 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_260 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_256 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_257 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_263 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_258 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_254 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_253 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_255 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_274 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_249 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_247 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_248 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_246 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_250 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_252 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_245 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_251 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_243 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_244 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_240 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_241 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_242 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_238 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_233 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_239 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_235 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_231 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_237 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_236 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_232 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_230 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_229 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_234 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_227 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_225 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_223 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(48);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_220 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(49);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_224 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(50);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_217 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(51);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_216 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(52);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_226 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(53);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_221 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(54);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_218 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(55);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_219 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(56);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_222 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(57);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_214 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(58);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_215 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(59);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_211 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(60);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_213 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(61);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_210 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(62);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_209 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(63);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_204 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(64);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_206 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(65);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_208 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(66);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_201 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(67);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_207 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(68);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_203 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(69);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_212 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(70);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_200 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(71);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_202 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(72);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_205 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(73);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_199 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(74);
}).prototype = p = new cjs.Sprite();



(lib.Ресурс52xpngкопия = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(75);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_198 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(76);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_195 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(77);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_197 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(78);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_194 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(79);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_196 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(80);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_193 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(81);
}).prototype = p = new cjs.Sprite();



(lib.Path = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(82);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_192 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(83);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_188 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(84);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_187 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(85);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_191 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(86);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_189 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(87);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_190 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(88);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_228 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(89);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_279 = function() {
	this.initialize(img.CachedBmp_279);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,4091,576);// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.ClipGroup = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_4
	this.instance = new lib.Ресурс52xpngкопия();
	this.instance.setTransform(43,93,0.5329,0.5329);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ClipGroup, new cjs.Rectangle(43,93,281.9,254.2), null);


(lib.ClipGroup_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Фон
	this.instance_1 = new lib.CachedBmp_279();
	this.instance_1.setTransform(-32.7,-18.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ClipGroup_1, new cjs.Rectangle(-32.7,-18.9,2045.5,288), null);


(lib.ClipGroup_2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_2 (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	mask_1.graphics.p("A6nD3IAAntMA1PAAAIAAHtg");
	mask_1.setTransform(170.375,24.725);

	// Слой_3
	this.instance_2 = new lib.CachedBmp_278();
	this.instance_2.setTransform(103,32.5,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_277();
	this.instance_3.setTransform(94.05,32.5,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_276();
	this.instance_4.setTransform(85.15,32.35,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_275();
	this.instance_5.setTransform(75,32.45,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_274();
	this.instance_6.setTransform(65.2,32.5,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_273();
	this.instance_7.setTransform(49.9,32.55,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_272();
	this.instance_8.setTransform(40.55,32.45,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_271();
	this.instance_9.setTransform(29,32.5,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_270();
	this.instance_10.setTransform(18.75,32.3,0.5,0.5);

	this.instance_11 = new lib.CachedBmp_272();
	this.instance_11.setTransform(8.7,32.45,0.5,0.5);

	this.instance_12 = new lib.CachedBmp_268();
	this.instance_12.setTransform(0,32.5,0.5,0.5);

	this.instance_13 = new lib.CachedBmp_267();
	this.instance_13.setTransform(103.15,16.2,0.5,0.5);

	this.instance_14 = new lib.CachedBmp_278();
	this.instance_14.setTransform(92.9,16.35,0.5,0.5);

	this.instance_15 = new lib.CachedBmp_265();
	this.instance_15.setTransform(78.35,16.35,0.5,0.5);

	this.instance_16 = new lib.CachedBmp_264();
	this.instance_16.setTransform(68.2,16.35,0.5,0.5);

	this.instance_17 = new lib.CachedBmp_263();
	this.instance_17.setTransform(58.5,16.3,0.5,0.5);

	this.instance_18 = new lib.CachedBmp_277();
	this.instance_18.setTransform(50.65,16.35,0.5,0.5);

	this.instance_19 = new lib.CachedBmp_261();
	this.instance_19.setTransform(41.75,16.2,0.5,0.5);

	this.instance_20 = new lib.CachedBmp_260();
	this.instance_20.setTransform(30.95,16.3,0.5,0.5);

	this.instance_21 = new lib.CachedBmp_274();
	this.instance_21.setTransform(21.2,16.35,0.5,0.5);

	this.instance_22 = new lib.CachedBmp_258();
	this.instance_22.setTransform(312.55,16.45,0.5,0.5);

	this.instance_23 = new lib.CachedBmp_257();
	this.instance_23.setTransform(189,15.9,0.5,0.5);

	this.instance_24 = new lib.CachedBmp_256();
	this.instance_24.setTransform(250.15,15.85,0.5,0.5);

	this.instance_25 = new lib.CachedBmp_255();
	this.instance_25.setTransform(282.4,16.45,0.5,0.5);

	this.instance_26 = new lib.CachedBmp_254();
	this.instance_26.setTransform(127.85,15.85,0.5,0.5);

	this.instance_27 = new lib.CachedBmp_253();
	this.instance_27.setTransform(219.35,3.5,0.5,0.5);

	this.instance_28 = new lib.CachedBmp_252();
	this.instance_28.setTransform(158.25,15.9,0.5,0.5);

	var maskedShapeInstanceList = [this.instance_2,this.instance_3,this.instance_4,this.instance_5,this.instance_6,this.instance_7,this.instance_8,this.instance_9,this.instance_10,this.instance_11,this.instance_12,this.instance_13,this.instance_14,this.instance_15,this.instance_16,this.instance_17,this.instance_18,this.instance_19,this.instance_20,this.instance_21,this.instance_22,this.instance_23,this.instance_24,this.instance_25,this.instance_26,this.instance_27,this.instance_28];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask_1;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_28},{t:this.instance_27},{t:this.instance_26},{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21},{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ClipGroup_2, new cjs.Rectangle(0,3.5,340.6,45.9), null);


(lib.ClipGroup_3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_3
	this.instance_29 = new lib.CachedBmp_251();
	this.instance_29.setTransform(525.6,-1.8,0.5,0.5);

	this.instance_30 = new lib.CachedBmp_250();
	this.instance_30.setTransform(499.95,-1.8,0.5,0.5);

	this.instance_31 = new lib.CachedBmp_249();
	this.instance_31.setTransform(473.4,-1.8,0.5,0.5);

	this.instance_32 = new lib.CachedBmp_248();
	this.instance_32.setTransform(449,-1.8,0.5,0.5);

	this.instance_33 = new lib.CachedBmp_247();
	this.instance_33.setTransform(424.55,-1.8,0.5,0.5);

	this.instance_34 = new lib.CachedBmp_246();
	this.instance_34.setTransform(400.6,-1.8,0.5,0.5);

	this.instance_35 = new lib.CachedBmp_245();
	this.instance_35.setTransform(379.95,-1.8,0.5,0.5);

	this.instance_36 = new lib.CachedBmp_244();
	this.instance_36.setTransform(366.4,-1.8,0.5,0.5);

	this.instance_37 = new lib.CachedBmp_243();
	this.instance_37.setTransform(341.1,-1.8,0.5,0.5);

	this.instance_38 = new lib.CachedBmp_242();
	this.instance_38.setTransform(306.85,-1.8,0.5,0.5);

	this.instance_39 = new lib.CachedBmp_241();
	this.instance_39.setTransform(289.3,-1.8,0.5,0.5);

	this.instance_40 = new lib.CachedBmp_240();
	this.instance_40.setTransform(265.4,-1.8,0.5,0.5);

	this.instance_41 = new lib.CachedBmp_239();
	this.instance_41.setTransform(241,-1.8,0.5,0.5);

	this.instance_42 = new lib.CachedBmp_238();
	this.instance_42.setTransform(219.65,-1.8,0.5,0.5);

	this.instance_43 = new lib.CachedBmp_237();
	this.instance_43.setTransform(187.75,-1.8,0.5,0.5);

	this.instance_44 = new lib.CachedBmp_236();
	this.instance_44.setTransform(163.35,-1.8,0.5,0.5);

	this.instance_45 = new lib.CachedBmp_235();
	this.instance_45.setTransform(138.9,-1.8,0.5,0.5);

	this.instance_46 = new lib.CachedBmp_234();
	this.instance_46.setTransform(120.6,-1.8,0.5,0.5);

	this.instance_47 = new lib.CachedBmp_233();
	this.instance_47.setTransform(95.6,-1.8,0.5,0.5);

	this.instance_48 = new lib.CachedBmp_232();
	this.instance_48.setTransform(71.3,-1.8,0.5,0.5);

	this.instance_49 = new lib.CachedBmp_231();
	this.instance_49.setTransform(48.8,-1.8,0.5,0.5);

	this.instance_50 = new lib.CachedBmp_230();
	this.instance_50.setTransform(24.2,-1.8,0.5,0.5);

	this.instance_51 = new lib.CachedBmp_229();
	this.instance_51.setTransform(-1.2,-1.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_51},{t:this.instance_50},{t:this.instance_49},{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_44},{t:this.instance_43},{t:this.instance_42},{t:this.instance_41},{t:this.instance_40},{t:this.instance_39},{t:this.instance_38},{t:this.instance_37},{t:this.instance_36},{t:this.instance_35},{t:this.instance_34},{t:this.instance_33},{t:this.instance_32},{t:this.instance_31},{t:this.instance_30},{t:this.instance_29}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ClipGroup_3, new cjs.Rectangle(-1.2,-1.8,554.8000000000001,53), null);


(lib.ClipGroup_0 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_2 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AujigIdHjlIAAInI9HDkg");
	mask.setTransform(93.225,39.025);

	// Слой_3
	this.instance = new lib.Path();

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ClipGroup_0, new cjs.Rectangle(0,0,186.5,78), null);


(lib.ClipGroup_4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,0,0);


(lib.Button_mane = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_228();
	this.instance.setTransform(0,0,0.5,0.5);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(3).to({_off:false},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,970,250);


(lib.Анимация5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_215();
	this.instance.setTransform(65.1,-9.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_214();
	this.instance_1.setTransform(54.65,-9.15,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_213();
	this.instance_2.setTransform(46.1,-9.15,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_212();
	this.instance_3.setTransform(37.35,-9.15,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_211();
	this.instance_4.setTransform(29.5,-9.15,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_210();
	this.instance_5.setTransform(22.05,-9.15,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_209();
	this.instance_6.setTransform(14.2,-9.15,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_208();
	this.instance_7.setTransform(2.9,-9.15,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_207();
	this.instance_8.setTransform(-6.05,-9.15,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_206();
	this.instance_9.setTransform(-14.6,-9.15,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_205();
	this.instance_10.setTransform(-22.65,-9.15,0.5,0.5);

	this.instance_11 = new lib.CachedBmp_204();
	this.instance_11.setTransform(-30.6,-9.15,0.5,0.5);

	this.instance_12 = new lib.CachedBmp_203();
	this.instance_12.setTransform(-39.85,-9.15,0.5,0.5);

	this.instance_13 = new lib.CachedBmp_202();
	this.instance_13.setTransform(-47.8,-9.15,0.5,0.5);

	this.instance_14 = new lib.CachedBmp_201();
	this.instance_14.setTransform(-60.4,-9.15,0.5,0.5);

	this.instance_15 = new lib.CachedBmp_200();
	this.instance_15.setTransform(-68.85,-9.15,0.5,0.5);

	this.instance_16 = new lib.CachedBmp_199();
	this.instance_16.setTransform(-77.8,-9.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-77.8,-9.1,155.89999999999998,18.5);


(lib.ClipGroup_5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_3
	this.instance_52 = new lib.ClipGroup_0();
	this.instance_52.setTransform(484.8,49.4,1,1,0,0,0,93.5,39);

	this.timeline.addTween(cjs.Tween.get(this.instance_52).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ClipGroup_5, new cjs.Rectangle(391.3,10.4,186.99999999999994,78.1), null);


(lib.Символ2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_227();
	this.instance.setTransform(367.65,8,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_226();
	this.instance_1.setTransform(338.75,8,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_225();
	this.instance_2.setTransform(311.55,8,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_224();
	this.instance_3.setTransform(283.25,8,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_223();
	this.instance_4.setTransform(238.65,8,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_222();
	this.instance_5.setTransform(206.8,8,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_221();
	this.instance_6.setTransform(163.5,8,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_220();
	this.instance_7.setTransform(136.45,8,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_219();
	this.instance_8.setTransform(106.1,8,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_218();
	this.instance_9.setTransform(61.05,8,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_217();
	this.instance_10.setTransform(32.05,8,0.5,0.5);

	this.instance_11 = new lib.CachedBmp_216();
	this.instance_11.setTransform(0,8,0.5,0.5);

	this.instance_12 = new lib.ClipGroup_4();
	this.instance_12.setTransform(392.8,35.2,1,1,0,0,0,383.2,19.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Символ2, new cjs.Rectangle(0,8,384.7,68), null);


(lib.Анимация3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_198();
	this.instance.setTransform(339.3,-55.4,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_197();
	this.instance_1.setTransform(309.95,-55.4,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_196();
	this.instance_2.setTransform(270.05,-55.4,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_195();
	this.instance_3.setTransform(240,-55.4,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_194();
	this.instance_4.setTransform(210.75,-55.4,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_193();
	this.instance_5.setTransform(166.15,-55.4,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_192();
	this.instance_6.setTransform(134.3,-55.4,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_191();
	this.instance_7.setTransform(91.85,-55.4,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_190();
	this.instance_8.setTransform(49.2,-55.4,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_189();
	this.instance_9.setTransform(17.9,-55.4,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_188();
	this.instance_10.setTransform(-20.4,-55.4,0.5,0.5);

	this.instance_11 = new lib.ClipGroup_4();
	this.instance_11.setTransform(26.45,83.3,1,1,0,0,0,383.2,19.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-20.4,-55.4,377.2,68);


(lib.Анимация1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.ClipGroup_2();
	this.instance.setTransform(-0.05,6.4,1,1,0,0,0,170.3,24.7);

	this.instance_1 = new lib.CachedBmp_187();
	this.instance_1.setTransform(50.75,-18.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-170.3,-18.3,340.70000000000005,49.5);


(lib.Container = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Market
	this.instance = new lib.Анимация5("synched",0);
	this.instance.setTransform(658.7,225.65);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(89).to({_off:false},0).to({alpha:1},16).wait(45));

	// H1
	this.instance_1 = new lib.Символ2();
	this.instance_1.setTransform(-216.6,52.25,1,1,0,0,0,196.3,33.9);
	this.instance_1.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({x:210.7,alpha:1},14,cjs.Ease.quadInOut).wait(136));

	// H1_end
	this.instance_2 = new lib.Анимация3("synched",0);
	this.instance_2.setTransform(428.05,81.75);
	this.instance_2.alpha = 0;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(29).to({_off:false},0).to({rotation:360,alpha:1},10).to({startPosition:0},110).wait(1));

	// Man
	this.instance_3 = new lib.ClipGroup();
	this.instance_3.setTransform(347.9,132.55,1,1,0,0,0,156.7,215.8);
	this.instance_3.alpha = 0;
	this.instance_3._off = true;

	this.instance_4 = new lib.ClipGroup();
	this.instance_4.setTransform(809.05,132.55,1,1,0,0,0,156.7,215.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_3}]},29).to({state:[{t:this.instance_3}]},10).to({state:[{t:this.instance_3}]},18).to({state:[{t:this.instance_4},{t:this.instance_3}]},17).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_3}]},74).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(29).to({_off:false},0).to({x:809.05,alpha:1},10).wait(111));

	// Form__red
	this.instance_5 = new lib.ClipGroup_5();
	this.instance_5.setTransform(112.5,46.35,1,1,0,0,0,93.5,39);
	this.instance_5.alpha = 0;
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(33).to({_off:false},0).to({alpha:1},15).wait(102));

	// H2
	this.instance_6 = new lib.ClipGroup_3();
	this.instance_6.setTransform(-312.65,111.75,1,1,0,0,0,275.4,16.8);
	this.instance_6.alpha = 0;
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(59).to({_off:false},0).to({x:291.2,alpha:1},15).wait(76));

	// Logo
	this.instance_7 = new lib.Анимация1("synched",0);
	this.instance_7.setTransform(193.65,207.5);
	this.instance_7.alpha = 0;
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(89).to({_off:false},0).to({alpha:1},15).wait(46));

	// Фон
	this.instance_8 = new lib.ClipGroup_1();
	this.instance_8.setTransform(485,137.1,0.4899,1,0,0,0,989.9,125);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(150));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-589.2,-203.4,1575.3000000000002,484.6);


// stage content:
(lib.Dekstop_12062023 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	this.actionFrames = [0];
	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.clearAllSoundStreams();
		 
		/* Нажмите для перехода к веб-странице
		При нажатии на указанный экземпляр символа производится загрузка веб-страницы в новом окне обозревателя.
		
		Инструкции:
		1. Замените http://www.adobe.com на адрес желаемой веб-страницы.
		   Не удаляйте кавычки ("").
		*/
		
		this.button_mane.addEventListener("click", fl_ClickToGoToWebPage_3);
		
		function fl_ClickToGoToWebPage_3() {
			window.open("https://www.rosbank.ru/kreditnye-karty/kreditnaya-karta-mir-120navsyo-plus?from=e:MainSlider-b:kreditnaya_karta_mir_120navsyo_plus-s:1", "_blank");
		}
		
		if (typeof(this.initialized) == "undefined") {
		    this.button_main.addEventListener("click", function(event) {
		        if(event.nativeEvent.button === 0){
		          window.click();
		        }
		    });
		    this.initialized = true;
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// button
	this.button_mane = new lib.Button_mane();
	this.button_mane.name = "button_mane";
	this.button_mane.setTransform(484.9,125,1,1,0,0,0,484.9,125);
	new cjs.ButtonHelper(this.button_mane, 0, 1, 2, false, new lib.Button_mane(), 3);

	this.timeline.addTween(cjs.Tween.get(this.button_mane).wait(1));

	// Container
	this.instance = new lib.Container();
	this.instance.setTransform(484.9,112.9,1,1,0,0,0,484.9,125);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(72.1,106.1,914,163.00000000000003);
// library properties:
lib.properties = {
	id: '15C160BC64066D4F9D7CC2F3E4090CC3',
	width: 970,
	height: 250,
	fps: 30,
	color: "#333333",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_279.png?1686583541396", id:"CachedBmp_279"},
		{src:"images/index_atlas_1.png?1686583541368", id:"index_atlas_1"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['15C160BC64066D4F9D7CC2F3E4090CC3'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;