const http = require("http");

http.Server(
    (req,res) => {
        res.end(`

        <script>// Function Fix for "requestAnimationFrame" 12.06.17
        var i = 0;
        (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
        || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
        timeToCall);
        lastTime = currTime + timeToCall;
        return id;
        };
        if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
        };
        }());
        
        i = (function() {
            'use strict';
            var currentScore = 0;
        
            // Fix for AudioContext 12.06.17
            var AudioContext = window.AudioContext // Default
                || window.webkitAudioContext // Safari and old versions of Chrome
                || false;
        
            function Runner(jmp,duck,i) {
                this.i = Math.random();
                if (Runner.instance_) {
                    return Runner.instance_
                }
                Runner.instance_ = this;
                this.outerContainerEl = document.querySelector("div");
                this.containerEl = null;
                this.snackbarEl = null;
                this.config = Runner.config;
                this.dimensions = Runner.defaultDimensions;
                this.canvas = null;
                this.canvasCtx = null;
                this.tRex = null;
                this.distanceMeter = null;
                this.distanceRan = 0;
                this.highestScore = 0;
                this.time = 0;
                this.runningTime = 0;
                this.msPerFrame = 1000 / FPS;
                this.currentSpeed = this.config.SPEED;
                this.obstacles = [];
                this.started = false;
                this.activated = false;
                this.crashed = false;
                this.paused = false;
                this.resizeTimerId_ = null;
                this.playCount = 0;
                this.audioBuffer = null;
                this.soundFx = {};
                this.audioContext = null;
                this.images = {};
                this.imagesLoaded = 0;
                this.loadImages();
                this.gamepadPreviousKeyDown = false;
                this.keycodes = {
                    JUMP: {
                        jmp: 1
                    },
                    DUCK: {
                        duck: 1
                    },
                    RESTART: {
                        '13': 1
                    }
                };
                this.keycodes['JUMP'][jmp]=1
                this.keycodes['DUCK'][duck]=1
                

            }
            window['Runner'] = Runner;
            var DEFAULT_WIDTH = 600;
            var FPS = 60;
            var IS_HIDPI = window.devicePixelRatio > 1;
            var IS_IOS = window.navigator.userAgent.indexOf('CriOS') > -1 || window.navigator.userAgent == 'UIWebViewForStaticFileContent';
            var IS_MOBILE = window.navigator.userAgent.indexOf('Mobi') > -1 || IS_IOS;
            var IS_TOUCH_ENABLED = 'ontouchstart' in window;
            Runner.config = {
                ACCELERATION: 0.001,
                BG_CLOUD_SPEED: 0.2,
                BOTTOM_PAD: 10,
                CLEAR_TIME: 3000,
                CLOUD_FREQUENCY: 0.5,
                GAMEOVER_CLEAR_TIME: 750,
                GAP_COEFFICIENT: 0.6,
                GRAVITY: 0.6,
                INITIAL_JUMP_VELOCITY: 12,
                MAX_CLOUDS: 6,
                MAX_OBSTACLE_LENGTH: 3,
                MAX_OBSTACLE_DUPLICATION: 2,
                MAX_SPEED: 13,
                MIN_JUMP_HEIGHT: 35,
                MOBILE_SPEED_COEFFICIENT: 1.2,
                RESOURCE_TEMPLATE_ID: 'audio-resources',
                SPEED: 6,
                SPEED_DROP_COEFFICIENT: 3
            };
            Runner.defaultDimensions = {
                WIDTH: DEFAULT_WIDTH,
                HEIGHT: 150
            };
            Runner.classes = {
                CANVAS: 'runner-canvas',
                CONTAINER: 'runner-container',
                CRASHED: 'crashed',
                ICON: 'icon-offline',
                SNACKBAR: 'snackbar',
                SNACKBAR_SHOW: 'snackbar-show',
                TOUCH_CONTROLLER: 'controller'
            };
            Runner.spriteDefinition = {
                LDPI: {
                    CACTUS_LARGE: {
                        x: 332,
                        y: 2
                    },
                    CACTUS_SMALL: {
                        x: 228,
                        y: 2
                    },
                    CLOUD: {
                        x: 86,
                        y: 2
                    },
                    HORIZON: {
                        x: 2,
                        y: 54
                    },
                    PTERODACTYL: {
                        x: 134,
                        y: 2
                    },
                    RESTART: {
                        x: 2,
                        y: 2
                    },
                    TEXT_SPRITE: {
                        x: 484,
                        y: 2
                    },
                    TREX: {
                        x: 677,
                        y: 2
                    }
                },
                HDPI: {
                    CACTUS_LARGE: {
                        x: 652,
                        y: 2
                    },
                    CACTUS_SMALL: {
                        x: 446,
                        y: 2
                    },
                    CLOUD: {
                        x: 166,
                        y: 2
                    },
                    HORIZON: {
                        x: 2,
                        y: 104
                    },
                    PTERODACTYL: {
                        x: 260,
                        y: 2
                    },
                    RESTART: {
                        x: 2,
                        y: 2
                    },
                    TEXT_SPRITE: {
                        x: 954,
                        y: 2
                    },
                    TREX: {
                        x: 1338,
                        y: 2
                    }
                }
            };
            Runner.sounds = {
                BUTTON_PRESS: 'offline-sound-press',
                HIT: 'offline-sound-hit',
                SCORE: 'offline-sound-reached'
            };
            // this.keycodes = {
            //     JUMP: {
            //         jmp: 1
            //     },
            //     DUCK: {
            //         duck: 1
            //     },
            //     RESTART: {
            //         '13': 1
            //     }
            // };
            Runner.events = {
                ANIM_END: 'webkitAnimationEnd',
                CLICK: 'click',
                KEYDOWN: 'keydown',
                KEYUP: 'keyup',
                MOUSEDOWN: 'mousedown',
                MOUSEUP: 'mouseup',
                RESIZE: 'resize',
                TOUCHEND: 'touchend',
                TOUCHSTART: 'touchstart',
                VISIBILITY: 'visibilitychange',
                BLUR: 'blur',
                FOCUS: 'focus',
                LOAD: 'load',
                GAMEPADCONNECTED: 'gamepadconnected'
            };
            Runner.prototype = {
                isDisabled: function() {
                    return loadTimeData && loadTimeData.valueExists('disabledEasterEgg')
                },
                setupDisabledRunner: function() {
                    this.containerEl = document.createElement('div');
                    this.containerEl.className = Runner.classes.SNACKBAR;
                    this.containerEl.textContent = loadTimeData.getValue('disabledEasterEgg');
                    this.outerContainerEl.appendChild(this.containerEl);
                    document.addEventListener(Runner.events.KEYDOWN, function(e) {
                        if (this.keycodes.JUMP[e.keyCode]) {
                            this.containerEl.classList.add(Runner.classes.SNACKBAR_SHOW);
                            document.querySelector('.icon').classList.add('icon-disabled')
                        }
                    }.bind(this))
                },
                updateConfigSetting: function(setting, value) {
                    if (setting in this.config && value != undefined) {
                        this.config[setting] = value;
                        switch (setting) {
                            case 'GRAVITY':
                            case 'MIN_JUMP_HEIGHT':
                            case 'SPEED_DROP_COEFFICIENT':
                                this.tRex.config[setting] = value;
                                break;
                            case 'INITIAL_JUMP_VELOCITY':
                                this.tRex.setJumpVelocity(value);
                                break;
                            case 'SPEED':
                                this.setSpeed(value);
                                break
                        }
                    }
                },
                loadImages: function() {
                    if (IS_HIDPI) {
                        Runner.imageSprite = document.getElementById('resources-2x');
                        this.spriteDef = Runner.spriteDefinition.HDPI
                    } else {
                        Runner.imageSprite = document.getElementById('resources-1x');
                        this.spriteDef = Runner.spriteDefinition.LDPI
                    }
                    this.init()
                },
                loadSounds: function() {
                    if (false) { // Fix 12.06.17
                        this.audioContext = new AudioContext();
                        var resourceTemplate = document.getElementById(this.config.RESOURCE_TEMPLATE_ID).content;
                        for (var sound in Runner.sounds) {
                            var soundSrc = resourceTemplate.getElementById(Runner.sounds[sound]).src;
                            soundSrc = soundSrc.substr(soundSrc.indexOf(',') + 1);
                            var buffer = decodeBase64ToArrayBuffer(soundSrc);
                            this.audioContext.decodeAudioData(buffer, function(index, audioData) {
                                this.soundFx[index] = audioData
                            }.bind(this, sound))
                        }
                    }
                },
                setSpeed: function(opt_speed) {
                    var speed = opt_speed || this.currentSpeed;
                    if (this.dimensions.WIDTH < DEFAULT_WIDTH) {
                        var mobileSpeed = speed * this.dimensions.WIDTH / DEFAULT_WIDTH * this.config.MOBILE_SPEED_COEFFICIENT;
                        this.currentSpeed = mobileSpeed > speed ? speed : mobileSpeed
                    } else if (opt_speed) {
                        this.currentSpeed = opt_speed
                    }
                },
                init: function() {
                    this.adjustDimensions();
                    this.setSpeed();
                    this.containerEl = document.createElement('div');
                    this.containerEl.className = Runner.classes.CONTAINER + this.i;
                    this.canvas = createCanvas(this.containerEl, this.dimensions.WIDTH, this.dimensions.HEIGHT, Runner.classes.PLAYER);
                    this.canvasCtx = this.canvas.getContext('2d');
                    this.canvasCtx.fillStyle = '#f7f7f7';
                    this.canvasCtx.fill();
                    Runner.updateCanvasScaling(this.canvas);
                    this.horizon = new Horizon(this.canvas, this.spriteDef, this.dimensions, this.config.GAP_COEFFICIENT);
                    this.distanceMeter = new DistanceMeter(this.canvas, this.spriteDef.TEXT_SPRITE, this.dimensions.WIDTH);
                    this.tRex = new Trex(this.canvas, this.spriteDef.TREX);
                    this.outerContainerEl.appendChild(this.containerEl);
                    if (IS_MOBILE) {
                        this.createTouchController()
                    }
                    this.startListening();
                    this.update();
                    window.addEventListener(Runner.events.RESIZE, this.debounceResize.bind(this))
                },
                createTouchController: function() {
                    this.touchController = document.createElement('div');
                    this.touchController.className = Runner.classes.TOUCH_CONTROLLER
                },
                debounceResize: function() {
                    if (!this.resizeTimerId_) {
                        this.resizeTimerId_ = setInterval(this.adjustDimensions.bind(this), 250)
                    }
                },
                adjustDimensions: function() {
                    clearInterval(this.resizeTimerId_);
                    this.resizeTimerId_ = null;
                    var boxStyles = window.getComputedStyle(this.outerContainerEl);
                    var padding = Number(boxStyles.paddingLeft.substr(0, boxStyles.paddingLeft.length - 2));
                    this.dimensions.WIDTH = this.outerContainerEl.offsetWidth - padding * 2;
                    if (this.canvas) {
                        this.canvas.width = this.dimensions.WIDTH;
                        this.canvas.height = this.dimensions.HEIGHT;
                        Runner.updateCanvasScaling(this.canvas);
                        this.distanceMeter.calcXPos(this.dimensions.WIDTH);
                        this.clearCanvas();
                        this.horizon.update(0, 0, true);
                        this.tRex.update(0);
                        if (this.activated || this.crashed || this.paused) {
                            this.containerEl.style.width = this.dimensions.WIDTH + 'px';
                            this.containerEl.style.height = this.dimensions.HEIGHT + 'px';
                            this.distanceMeter.update(0, Math.ceil(this.distanceRan));
                            this.stop()
                        } else {
                            this.tRex.draw(0, 0)
                        }
                        if (this.crashed && this.gameOverPanel) {
                            this.gameOverPanel.updateDimensions(this.dimensions.WIDTH);
                            this.gameOverPanel.draw()
                        }
                    }
                },
                playIntro: function() {
                    if (!this.started && !this.crashed) {
                        this.playingIntro = true;
                        this.tRex.playingIntro = true;
                        var keyframes = '@-webkit-keyframes intro { ' + 'from { width:' + Trex.config.WIDTH + 'px }' + 'to { width: ' + this.dimensions.WIDTH + 'px }' + '}';
                        document.styleSheets[0].insertRule(keyframes, 0);
                        this.containerEl.addEventListener(Runner.events.ANIM_END, this.startGame.bind(this));
                        this.containerEl.style.webkitAnimation = 'intro .4s ease-out 1 both';
                        this.containerEl.style.width = this.dimensions.WIDTH + 'px';
                        if (this.touchController) {
                            this.outerContainerEl.appendChild(this.touchController)
                        }
                        this.activated = true;
                        this.started = true
                    } else if (this.crashed) {
                        this.restart()
                    }
                },
                startGame: function() {
                    this.runningTime = 0;
                    this.playingIntro = false;
                    this.tRex.playingIntro = false;
                    this.containerEl.style.webkitAnimation = '';
                    this.playCount++;
                    document.addEventListener(Runner.events.VISIBILITY, this.onVisibilityChange.bind(this));
                    window.addEventListener(Runner.events.BLUR, this.onVisibilityChange.bind(this));
                    window.addEventListener(Runner.events.FOCUS, this.onVisibilityChange.bind(this))
                },
                clearCanvas: function() {
                    this.canvasCtx.clearRect(0, 0, this.dimensions.WIDTH, this.dimensions.HEIGHT)
                },
                update: function() {
                    this.drawPending = false;
                    var now = getTimeStamp();
                    var deltaTime = now - (this.time || now);
                    this.time = now;
                    if (this.activated) {
                        this.clearCanvas();
                        if (this.tRex.jumping) {
                            this.tRex.updateJump(deltaTime)
                        }
                        this.runningTime += deltaTime;
                        var hasObstacles = this.runningTime > this.config.CLEAR_TIME;
                        if (this.tRex.jumpCount == 1 && !this.playingIntro) {
                            this.playIntro()
                        }
                        if (this.playingIntro) {
                            this.horizon.update(0, this.currentSpeed, hasObstacles)
                        } else {
                            deltaTime = !this.started ? 0 : deltaTime;
                            this.horizon.update(deltaTime, this.currentSpeed, hasObstacles)
                        }
                        var collision = hasObstacles && checkForCollision(this.horizon.obstacles[0], this.tRex);
                        if (!collision) {
                            this.distanceRan += this.currentSpeed * deltaTime / this.msPerFrame;
                            if (this.currentSpeed < this.config.MAX_SPEED) {
                                this.currentSpeed += this.config.ACCELERATION
                            }
                        } else {
                            this.gameOver()
                        }
                        var playAcheivementSound = this.distanceMeter.update(deltaTime, Math.ceil(this.distanceRan));
                        if (playAcheivementSound) {
                            this.playSound(this.soundFx.SCORE)
                        }
                    }
                    if (!this.crashed) {
                        this.tRex.update(deltaTime);
                        this.raq()
                    }
                },
                handleEvent: function(e) {
                    return (function(evtType, events) {
                        switch (evtType) {
                            case events.KEYDOWN:
                            case events.TOUCHSTART:
                            case events.MOUSEDOWN:
                            case events.GAMEPADCONNECTED:
                                this.onKeyDown(e);
                                break;
                            case events.KEYUP:
                            case events.TOUCHEND:
                            case events.MOUSEUP:
                                this.onKeyUp(e);
                                break
                        }
                    }.bind(this))(e.type, Runner.events)
                },
                startListening: function() {
                    document.addEventListener(Runner.events.KEYDOWN, this);
                    document.addEventListener(Runner.events.KEYUP, this);
                    if (IS_MOBILE) {
                        this.touchController.addEventListener(Runner.events.TOUCHSTART, this);
                        this.touchController.addEventListener(Runner.events.TOUCHEND, this);
                        this.containerEl.addEventListener(Runner.events.TOUCHSTART, this)
                    } else {
                        document.addEventListener(Runner.events.MOUSEDOWN, this);
                        document.addEventListener(Runner.events.MOUSEUP, this)
                    }
                    window.addEventListener(Runner.events.GAMEPADCONNECTED, this);
                    window.setInterval(this.pollGamepads.bind(this), 10)
                },
                pollGamepads: function() {
                    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []); //  Fix for navigator.getGamepads() 12.06.17
                    var keydown = false;
                    for (var i = 0; i < gamepads.length; i++) {
                        if (gamepads[i] != undefined) {
                            if (gamepads[i].buttons.filter(function(e) {
                                    return e.pressed == true
                                }).length > 0) {
                                keydown = true
                            }
                        }
                    }
                    if (keydown != this.gamepadPreviousKeyDown) {
                        this.gamepadPreviousKeyDown = keydown;
                        var event = new Event(keydown ? 'keydown' : 'keyup');
                        event.keyCode = 32;
                        event.which = event.keyCode;
                        event.altKey = false;
                        event.ctrlKey = true;
                        event.shiftKey = false;
                        event.metaKey = false;
                        document.dispatchEvent(event)
                    }
                },
                stopListening: function() {
                    document.removeEventListener(Runner.events.KEYDOWN, this);
                    document.removeEventListener(Runner.events.KEYUP, this);
                    if (IS_MOBILE) {
                        this.touchController.removeEventListener(Runner.events.TOUCHSTART, this);
                        this.touchController.removeEventListener(Runner.events.TOUCHEND, this);
                        this.containerEl.removeEventListener(Runner.events.TOUCHSTART, this)
                    } else {
                        document.removeEventListener(Runner.events.MOUSEDOWN, this);
                        document.removeEventListener(Runner.events.MOUSEUP, this)
                    }
                },
                onKeyDown: function(e) {
                    if (IS_MOBILE) {
                        e.preventDefault()
                    }
                    if (!this.crashed && (this.keycodes.JUMP[e.keyCode] || e.type == Runner.events.TOUCHSTART || e.type == Runner.events.GAMEPADCONNECTED)) {
                        if (!this.activated) {
                            this.loadSounds();
                            this.activated = true
                        }
                        if (!this.tRex.jumping && !this.tRex.ducking) {
                            this.playSound(this.soundFx.BUTTON_PRESS);
                            this.tRex.startJump(this.currentSpeed)
                        }
                    }
                    if (this.crashed && e.type == Runner.events.TOUCHSTART && e.currentTarget == this.containerEl) {
                        this.restart()
                    }
                    if (this.activated && !this.crashed && this.keycodes.DUCK[e.keyCode]) {
                        e.preventDefault();
                        if (this.tRex.jumping) {
                            this.tRex.setSpeedDrop()
                        } else if (!this.tRex.jumping && !this.tRex.ducking) {
                            this.tRex.setDuck(true)
                        }
                    }
                },
                onKeyUp: function(e) {
                    var keyCode = String(e.keyCode);
                    var isjumpKey = this.keycodes.JUMP[keyCode] || e.type == Runner.events.TOUCHEND || e.type == Runner.events.MOUSEDOWN;
                    if (this.isRunning() && isjumpKey) {
                        this.tRex.endJump()
                    } else if (this.keycodes.DUCK[keyCode]) {
                        this.tRex.speedDrop = false;
                        this.tRex.setDuck(false)
                    } else if (this.crashed) {
                        var deltaTime = getTimeStamp() - this.time;
                        if (this.keycodes.RESTART[keyCode]) {
                            this.restart()
                        }
                    } else if (this.paused && isjumpKey) {
                        this.tRex.reset();
                        this.play()
                    }
                },
                isLeftClickOnCanvas: function(e) {
                    return e.button != null && e.button < 2 && e.type == Runner.events.MOUSEUP && e.target == this.canvas
                },
                raq: function() {
                    if (!this.drawPending) {
                        this.drawPending = true;
                        this.raqId = requestAnimationFrame(this.update.bind(this))
                    }
                },
                isRunning: function() {
                    return !!this.raqId
                },
                gameOver: function() {
                    this.playSound(this.soundFx.HIT);
                    vibrate(200);
                    this.stop();
                    this.crashed = true;
                    this.distanceMeter.acheivement = false;
                    this.tRex.update(100, Trex.status.CRASHED);
                    if (!this.gameOverPanel) {
                        this.gameOverPanel = new GameOverPanel(this.canvas, this.spriteDef.TEXT_SPRITE, this.spriteDef.RESTART, this.dimensions)
                    } else {
                        this.gameOverPanel.draw()
                    }
                    if (this.distanceRan > this.highestScore) {
                        this.highestScore = Math.ceil(this.distanceRan);
                        this.distanceMeter.setHighScore(this.highestScore);
                        currentScore = Math.round(this.highestScore * 0.025);
                        var score_d = 0;
                        if (document.getElementById("score-5") !== null) {
                            score_d = document.getElementById("score-5").innerHTML
                        }
                    }
                    this.time = getTimeStamp()
                },
                stop: function() {
                    this.activated = false;
                    this.paused = true;
                    cancelAnimationFrame(this.raqId);
                    this.raqId = 0
                },
                play: function() {
                    if (!this.crashed) {
                        this.activated = true;
                        this.paused = false;
                        this.tRex.update(0, Trex.status.RUNNING);
                        this.time = getTimeStamp();
                        this.update()
                    }
                },
                restart: function() {
                    if (!this.raqId) {
                        this.playCount++;
                        this.runningTime = 0;
                        this.activated = true;
                        this.crashed = false;
                        this.distanceRan = 0;
                        this.setSpeed(this.config.SPEED);
                        this.time = getTimeStamp();
                        this.containerEl.classList.remove(Runner.classes.CRASHED);
                        this.clearCanvas();
                        this.distanceMeter.reset(this.highestScore);
                        this.horizon.reset();
                        this.tRex.reset();
                        this.playSound(this.soundFx.BUTTON_PRESS);
                        this.update()
                    }
                },
                onVisibilityChange: function(e) {
                    if (document.hidden || document.webkitHidden || e.type == 'blur') {
                        this.stop()
                    } else if (!this.crashed) {
                        this.tRex.reset();
                        this.play()
                    }
                },
                playSound: function(soundBuffer) {
                    if (soundBuffer) {
                        var sourceNode = this.audioContext.createBufferSource();
                        sourceNode.buffer = soundBuffer;
                        sourceNode.connect(this.audioContext.destination);
                        sourceNode.start(0)
                    }
                }
            };
            Runner.updateCanvasScaling = function(canvas, opt_width, opt_height) {
                var context = canvas.getContext('2d');
                var devicePixelRatio = Math.floor(window.devicePixelRatio) || 1;
                var backingStoreRatio = Math.floor(context.webkitBackingStorePixelRatio) || 1;
                var ratio = devicePixelRatio / backingStoreRatio;
                if (devicePixelRatio !== backingStoreRatio) {
                    var oldWidth = opt_width || canvas.width;
                    var oldHeight = opt_height || canvas.height;
                    canvas.width = oldWidth * ratio;
                    canvas.height = oldHeight * ratio;
                    canvas.style.width = oldWidth + 'px';
                    canvas.style.height = oldHeight + 'px';
                    context.scale(ratio, ratio);
                    return true
                } else if (devicePixelRatio == 1) {
                    canvas.style.width = canvas.width + 'px';
                    canvas.style.height = canvas.height + 'px'
                }
                return false
            };
        
            function getRandomNum(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min
            }
        
            function vibrate(duration) {
                if (IS_MOBILE && window.navigator.vibrate) {
                    window.navigator.vibrate(duration)
                }
            }
        
            function createCanvas(container, width, height, opt_classname) {
                var canvas = document.createElement('canvas');
                canvas.className = opt_classname ? Runner.classes.CANVAS + ' ' + opt_classname : Runner.classes.CANVAS;
                canvas.width = width;
                canvas.height = height;
                container.appendChild(canvas);
                return canvas
            }
        
            function decodeBase64ToArrayBuffer(base64String) {
                var len = (base64String.length / 4) * 3;
                var str = atob(base64String);
                var arrayBuffer = new ArrayBuffer(len);
                var bytes = new Uint8Array(arrayBuffer);
                for (var i = 0; i < len; i++) {
                    bytes[i] = str.charCodeAt(i)
                }
                return bytes.buffer
            }
        
            function getTimeStamp() {
                //return IS_IOS ? new Date().getTime() : performance.now()
                return new Date().getTime(); // Safari 5.17 Fix 12.06.17
            }
        
            function GameOverPanel(canvas, textImgPos, restartImgPos, dimensions) {
                this.canvas = canvas;
                this.canvasCtx = canvas.getContext('2d');
                this.canvasDimensions = dimensions;
                this.textImgPos = textImgPos;
                this.restartImgPos = restartImgPos;
                this.draw()
            };
            GameOverPanel.dimensions = {
                TEXT_X: 0,
                TEXT_Y: 13,
                TEXT_WIDTH: 191,
                TEXT_HEIGHT: 11,
                RESTART_WIDTH: 36,
                RESTART_HEIGHT: 32
            };
            GameOverPanel.prototype = {
                updateDimensions: function(width, opt_height) {
                    this.canvasDimensions.WIDTH = width;
                    if (opt_height) {
                        this.canvasDimensions.HEIGHT = opt_height
                    }
                },
                draw: function() {
                    var dimensions = GameOverPanel.dimensions;
                    var centerX = this.canvasDimensions.WIDTH / 2;
                    var textSourceX = dimensions.TEXT_X;
                    var textSourceY = dimensions.TEXT_Y;
                    var textSourceWidth = dimensions.TEXT_WIDTH;
                    var textSourceHeight = dimensions.TEXT_HEIGHT;
                    var textTargetX = Math.round(centerX - (dimensions.TEXT_WIDTH / 2));
                    var textTargetY = Math.round((this.canvasDimensions.HEIGHT - 25) / 3);
                    var textTargetWidth = dimensions.TEXT_WIDTH;
                    var textTargetHeight = dimensions.TEXT_HEIGHT;
                    var restartSourceWidth = dimensions.RESTART_WIDTH;
                    var restartSourceHeight = dimensions.RESTART_HEIGHT;
                    var restartTargetX = centerX - (dimensions.RESTART_WIDTH / 2);
                    var restartTargetY = this.canvasDimensions.HEIGHT / 2;
                    if (IS_HIDPI) {
                        textSourceY *= 2;
                        textSourceX *= 2;
                        textSourceWidth *= 2;
                        textSourceHeight *= 2;
                        restartSourceWidth *= 2;
                        restartSourceHeight *= 2
                    }
                    textSourceX += this.textImgPos.x;
                    textSourceY += this.textImgPos.y;
                    this.canvasCtx.drawImage(Runner.imageSprite, textSourceX, textSourceY, textSourceWidth, textSourceHeight, textTargetX, textTargetY, textTargetWidth, textTargetHeight);
                    this.canvasCtx.drawImage(Runner.imageSprite, this.restartImgPos.x, this.restartImgPos.y, restartSourceWidth, restartSourceHeight, restartTargetX, restartTargetY, dimensions.RESTART_WIDTH, dimensions.RESTART_HEIGHT)
                }
            };
        
            function checkForCollision(obstacle, tRex, opt_canvasCtx) {
                var obstacleBoxXPos = Runner.defaultDimensions.WIDTH + obstacle.xPos;
                var tRexBox = new CollisionBox(tRex.xPos + 1, tRex.yPos + 1, tRex.config.WIDTH - 2, tRex.config.HEIGHT - 2);
                var obstacleBox = new CollisionBox(obstacle.xPos + 1, obstacle.yPos + 1, obstacle.typeConfig.width * obstacle.size - 2, obstacle.typeConfig.height - 2);
                if (opt_canvasCtx) {
                    drawCollisionBoxes(opt_canvasCtx, tRexBox, obstacleBox)
                }
                if (boxCompare(tRexBox, obstacleBox)) {
                    var collisionBoxes = obstacle.collisionBoxes;
                    var tRexCollisionBoxes = tRex.ducking ? Trex.collisionBoxes.DUCKING : Trex.collisionBoxes.RUNNING;
                    for (var t = 0; t < tRexCollisionBoxes.length; t++) {
                        for (var i = 0; i < collisionBoxes.length; i++) {
                            var adjTrexBox = createAdjustedCollisionBox(tRexCollisionBoxes[t], tRexBox);
                            var adjObstacleBox = createAdjustedCollisionBox(collisionBoxes[i], obstacleBox);
                            var crashed = boxCompare(adjTrexBox, adjObstacleBox);
                            if (opt_canvasCtx) {
                                drawCollisionBoxes(opt_canvasCtx, adjTrexBox, adjObstacleBox)
                            }
                            if (crashed) {
                                return [adjTrexBox, adjObstacleBox]
                            }
                        }
                    }
                }
                return false
            };
        
            function createAdjustedCollisionBox(box, adjustment) {
                return new CollisionBox(box.x + adjustment.x, box.y + adjustment.y, box.width, box.height)
            };
        
            function drawCollisionBoxes(canvasCtx, tRexBox, obstacleBox) {
                canvasCtx.save();
                canvasCtx.strokeStyle = '#f00';
                canvasCtx.strokeRect(tRexBox.x, tRexBox.y, tRexBox.width, tRexBox.height);
                canvasCtx.strokeStyle = '#0f0';
                canvasCtx.strokeRect(obstacleBox.x, obstacleBox.y, obstacleBox.width, obstacleBox.height);
                canvasCtx.restore()
            };
        
            function boxCompare(tRexBox, obstacleBox) {
                var crashed = false;
                var tRexBoxX = tRexBox.x;
                var tRexBoxY = tRexBox.y;
                var obstacleBoxX = obstacleBox.x;
                var obstacleBoxY = obstacleBox.y;
                if (tRexBox.x < obstacleBoxX + obstacleBox.width && tRexBox.x + tRexBox.width > obstacleBoxX && tRexBox.y < obstacleBox.y + obstacleBox.height && tRexBox.height + tRexBox.y > obstacleBox.y) {
                    crashed = true
                }
                return crashed
            };
        
            function CollisionBox(x, y, w, h) {
                this.x = x;
                this.y = y;
                this.width = w;
                this.height = h
            };
        
            function Obstacle(canvasCtx, type, spriteImgPos, dimensions, gapCoefficient, speed) {
                this.canvasCtx = canvasCtx;
                this.spritePos = spriteImgPos;
                this.typeConfig = type;
                this.gapCoefficient = gapCoefficient;
                this.size = getRandomNum(1, Obstacle.MAX_OBSTACLE_LENGTH);
                this.dimensions = dimensions;
                this.remove = false;
                this.xPos = 0;
                this.yPos = 0;
                this.width = 0;
                this.collisionBoxes = [];
                this.gap = 0;
                this.speedOffset = 0;
                this.currentFrame = 0;
                this.timer = 0;
                this.init(speed)
            };
            Obstacle.MAX_GAP_COEFFICIENT = 1.5;
            Obstacle.MAX_OBSTACLE_LENGTH = 3, Obstacle.prototype = {
                init: function(speed) {
                    this.cloneCollisionBoxes();
                    if (this.size > 1 && this.typeConfig.multipleSpeed > speed) {
                        this.size = 1
                    }
                    this.width = this.typeConfig.width * this.size;
                    this.xPos = this.dimensions.WIDTH - this.width;
                    if (Array.isArray(this.typeConfig.yPos)) {
                        var yPosConfig = IS_MOBILE ? this.typeConfig.yPosMobile : this.typeConfig.yPos;
                        this.yPos = yPosConfig[getRandomNum(0, yPosConfig.length - 1)]
                    } else {
                        this.yPos = this.typeConfig.yPos
                    }
                    this.draw();
                    if (this.size > 1) {
                        this.collisionBoxes[1].width = this.width - this.collisionBoxes[0].width - this.collisionBoxes[2].width;
                        this.collisionBoxes[2].x = this.width - this.collisionBoxes[2].width
                    }
                    if (this.typeConfig.speedOffset) {
                        this.speedOffset = Math.random() > 0.5 ? this.typeConfig.speedOffset : -this.typeConfig.speedOffset
                    }
                    this.gap = this.getGap(this.gapCoefficient, speed)
                },
                draw: function() {
                    var sourceWidth = this.typeConfig.width;
                    var sourceHeight = this.typeConfig.height;
                    if (IS_HIDPI) {
                        sourceWidth = sourceWidth * 2;
                        sourceHeight = sourceHeight * 2
                    }
                    var sourceX = (sourceWidth * this.size) * (0.5 * (this.size - 1)) + this.spritePos.x;
                    if (this.currentFrame > 0) {
                        sourceX += sourceWidth * this.currentFrame
                    }
                    this.canvasCtx.drawImage(Runner.imageSprite, sourceX, this.spritePos.y, sourceWidth * this.size, sourceHeight, this.xPos, this.yPos, this.typeConfig.width * this.size, this.typeConfig.height)
                },
                update: function(deltaTime, speed) {
                    if (!this.remove) {
                        if (this.typeConfig.speedOffset) {
                            speed += this.speedOffset
                        }
                        this.xPos -= Math.floor((speed * FPS / 1000) * deltaTime);
                        if (this.typeConfig.numFrames) {
                            this.timer += deltaTime;
                            if (this.timer >= this.typeConfig.frameRate) {
                                this.currentFrame = this.currentFrame == this.typeConfig.numFrames - 1 ? 0 : this.currentFrame + 1;
                                this.timer = 0
                            }
                        }
                        this.draw();
                        if (!this.isVisible()) {
                            this.remove = true
                        }
                    }
                },
                getGap: function(gapCoefficient, speed) {
                    var minGap = Math.round(this.width * speed + this.typeConfig.minGap * gapCoefficient);
                    var maxGap = Math.round(minGap * Obstacle.MAX_GAP_COEFFICIENT);
                    return getRandomNum(minGap, maxGap)
                },
                isVisible: function() {
                    return this.xPos + this.width > 0
                },
                cloneCollisionBoxes: function() {
                    var collisionBoxes = this.typeConfig.collisionBoxes;
                    for (var i = collisionBoxes.length - 1; i >= 0; i--) {
                        this.collisionBoxes[i] = new CollisionBox(collisionBoxes[i].x, collisionBoxes[i].y, collisionBoxes[i].width, collisionBoxes[i].height)
                    }
                }
            };
            Obstacle.types = [{
                type: 'CACTUS_SMALL',
                width: 17,
                height: 35,
                yPos: 105,
                multipleSpeed: 4,
                minGap: 120,
                minSpeed: 0,
                collisionBoxes: [new CollisionBox(0, 7, 5, 27), new CollisionBox(4, 0, 6, 34), new CollisionBox(10, 4, 7, 14)]
            }, {
                type: 'CACTUS_LARGE',
                width: 25,
                height: 50,
                yPos: 90,
                multipleSpeed: 7,
                minGap: 120,
                minSpeed: 0,
                collisionBoxes: [new CollisionBox(0, 12, 7, 38), new CollisionBox(8, 0, 7, 49), new CollisionBox(13, 10, 10, 38)]
            }, {
                type: 'PTERODACTYL',
                width: 46,
                height: 40,
                yPos: [100, 75, 50],
                yPosMobile: [100, 50],
                multipleSpeed: 999,
                minSpeed: 8.5,
                minGap: 150,
                collisionBoxes: [new CollisionBox(15, 15, 16, 5), new CollisionBox(18, 21, 24, 6), new CollisionBox(2, 14, 4, 3), new CollisionBox(6, 10, 4, 7), new CollisionBox(10, 8, 6, 9)],
                numFrames: 2,
                frameRate: 1000 / 6,
                speedOffset: .8
            }];
        
            function Trex(canvas, spritePos) {
                this.canvas = canvas;
                this.canvasCtx = canvas.getContext('2d');
                this.spritePos = spritePos;
                this.xPos = 0;
                this.yPos = 0;
                this.groundYPos = 0;
                this.currentFrame = 0;
                this.currentAnimFrames = [];
                this.blinkDelay = 0;
                this.animStartTime = 0;
                this.timer = 0;
                this.msPerFrame = 1000 / FPS;
                this.config = Trex.config;
                this.status = Trex.status.WAITING;
                this.jumping = false;
                this.ducking = false;
                this.jumpVelocity = 0;
                this.reachedMinHeight = false;
                this.speedDrop = false;
                this.jumpCount = 0;
                this.jumpspotX = 0;
                this.init()
            };
            Trex.config = {
                DROP_VELOCITY: -5,
                GRAVITY: 0.6,
                HEIGHT: 47,
                HEIGHT_DUCK: 25,
                INIITAL_JUMP_VELOCITY: -10,
                INTRO_DURATION: 1500,
                MAX_JUMP_HEIGHT: 30,
                MIN_JUMP_HEIGHT: 30,
                SPEED_DROP_COEFFICIENT: 3,
                SPRITE_WIDTH: 262,
                START_X_POS: 50,
                WIDTH: 44,
                WIDTH_DUCK: 59
            };
            Trex.collisionBoxes = {
                DUCKING: [new CollisionBox(1, 18, 55, 25)],
                RUNNING: [new CollisionBox(22, 0, 17, 16), new CollisionBox(1, 18, 30, 9), new CollisionBox(10, 35, 14, 8), new CollisionBox(1, 24, 29, 5), new CollisionBox(5, 30, 21, 4), new CollisionBox(9, 34, 15, 4)]
            };
            Trex.status = {
                CRASHED: 'CRASHED',
                DUCKING: 'DUCKING',
                JUMPING: 'JUMPING',
                RUNNING: 'RUNNING',
                WAITING: 'WAITING'
            };
            Trex.BLINK_TIMING = 7000;
            Trex.animFrames = {
                WAITING: {
                    frames: [44, 0],
                    msPerFrame: 1000 / 3
                },
                RUNNING: {
                    frames: [88, 132],
                    msPerFrame: 1000 / 12
                },
                CRASHED: {
                    frames: [220],
                    msPerFrame: 1000 / 60
                },
                JUMPING: {
                    frames: [0],
                    msPerFrame: 1000 / 60
                },
                DUCKING: {
                    frames: [262, 321],
                    msPerFrame: 1000 / 8
                }
            };
            Trex.prototype = {
                init: function() {
                    this.blinkDelay = this.setBlinkDelay();
                    this.groundYPos = Runner.defaultDimensions.HEIGHT - this.config.HEIGHT - Runner.config.BOTTOM_PAD;
                    this.yPos = this.groundYPos;
                    this.minJumpHeight = this.groundYPos - this.config.MIN_JUMP_HEIGHT;
                    this.draw(0, 0);
                    this.update(0, Trex.status.WAITING)
                },
                setJumpVelocity: function(setting) {
                    this.config.INIITAL_JUMP_VELOCITY = -setting;
                    this.config.DROP_VELOCITY = -setting / 2
                },
                update: function(deltaTime, opt_status) {
                    this.timer += deltaTime;
                    if (opt_status) {
                        this.status = opt_status;
                        this.currentFrame = 0;
                        this.msPerFrame = Trex.animFrames[opt_status].msPerFrame;
                        this.currentAnimFrames = Trex.animFrames[opt_status].frames;
                        if (opt_status == Trex.status.WAITING) {
                            this.animStartTime = getTimeStamp();
                            this.setBlinkDelay()
                        }
                    }
                    if (this.playingIntro && this.xPos < this.config.START_X_POS) {
                        this.xPos += Math.round((this.config.START_X_POS / this.config.INTRO_DURATION) * deltaTime)
                    }
                    if (this.status == Trex.status.WAITING) {
                        this.blink(getTimeStamp())
                    } else {
                        this.draw(this.currentAnimFrames[this.currentFrame], 0)
                    }
                    if (this.timer >= this.msPerFrame) {
                        this.currentFrame = this.currentFrame == this.currentAnimFrames.length - 1 ? 0 : this.currentFrame + 1;
                        this.timer = 0
                    }
                    if (this.speedDrop && this.yPos == this.groundYPos) {
                        this.speedDrop = false;
                        this.setDuck(true)
                    }
                },
                draw: function(x, y) {
                    var sourceX = x;
                    var sourceY = y;
                    var sourceWidth = this.ducking && this.status != Trex.status.CRASHED ? this.config.WIDTH_DUCK : this.config.WIDTH;
                    var sourceHeight = this.config.HEIGHT;
                    if (IS_HIDPI) {
                        sourceX *= 2;
                        sourceY *= 2;
                        sourceWidth *= 2;
                        sourceHeight *= 2
                    }
                    sourceX += this.spritePos.x;
                    sourceY += this.spritePos.y;
                    if (this.ducking && this.status != Trex.status.CRASHED) {
                        this.canvasCtx.drawImage(Runner.imageSprite, sourceX, sourceY, sourceWidth, sourceHeight, this.xPos, this.yPos, this.config.WIDTH_DUCK, this.config.HEIGHT)
                    } else {
                        if (this.ducking && this.status == Trex.status.CRASHED) {
                            this.xPos++
                        }
                        this.canvasCtx.drawImage(Runner.imageSprite, sourceX, sourceY, sourceWidth, sourceHeight, this.xPos, this.yPos, this.config.WIDTH, this.config.HEIGHT)
                    }
                },
                setBlinkDelay: function() {
                    this.blinkDelay = Math.ceil(Math.random() * Trex.BLINK_TIMING)
                },
                blink: function(time) {
                    var deltaTime = time - this.animStartTime;
                    if (deltaTime >= this.blinkDelay) {
                        this.draw(this.currentAnimFrames[this.currentFrame], 0);
                        if (this.currentFrame == 1) {
                            this.setBlinkDelay();
                            this.animStartTime = time
                        }
                    }
                },
                startJump: function(speed) {
                    if (!this.jumping) {
                        this.update(0, Trex.status.JUMPING);
                        this.jumpVelocity = this.config.INIITAL_JUMP_VELOCITY - (speed / 10);
                        this.jumping = true;
                        this.reachedMinHeight = false;
                        this.speedDrop = false
                    }
                },
                endJump: function() {
                    if (this.reachedMinHeight && this.jumpVelocity < this.config.DROP_VELOCITY) {
                        this.jumpVelocity = this.config.DROP_VELOCITY
                    }
                },
                updateJump: function(deltaTime, speed) {
                    var msPerFrame = Trex.animFrames[this.status].msPerFrame;
                    var framesElapsed = deltaTime / msPerFrame;
                    if (this.speedDrop) {
                        this.yPos += Math.round(this.jumpVelocity * this.config.SPEED_DROP_COEFFICIENT * framesElapsed)
                    } else {
                        this.yPos += Math.round(this.jumpVelocity * framesElapsed)
                    }
                    this.jumpVelocity += this.config.GRAVITY * framesElapsed;
                    if (this.yPos < this.minJumpHeight || this.speedDrop) {
                        this.reachedMinHeight = true
                    }
                    if (this.yPos < this.config.MAX_JUMP_HEIGHT || this.speedDrop) {
                        this.endJump()
                    }
                    if (this.yPos > this.groundYPos) {
                        this.reset();
                        this.jumpCount++
                    }
                    this.update(deltaTime)
                },
                setSpeedDrop: function() {
                    this.speedDrop = true;
                    this.jumpVelocity = 1
                },
                setDuck: function(isDucking) {
                    if (isDucking && this.status != Trex.status.DUCKING) {
                        this.update(0, Trex.status.DUCKING);
                        this.ducking = true
                    } else if (this.status == Trex.status.DUCKING) {
                        this.update(0, Trex.status.RUNNING);
                        this.ducking = false
                    }
                },
                reset: function() {
                    this.yPos = this.groundYPos;
                    this.jumpVelocity = 0;
                    this.jumping = false;
                    this.ducking = false;
                    this.update(0, Trex.status.RUNNING);
                    this.midair = false;
                    this.speedDrop = false;
                    this.jumpCount = 0
                }
            };
        
            function DistanceMeter(canvas, spritePos, canvasWidth) {
                this.canvas = canvas;
                this.canvasCtx = canvas.getContext('2d');
                this.image = Runner.imageSprite;
                this.spritePos = spritePos;
                this.x = 0;
                this.y = 5;
                this.currentDistance = 0;
                this.maxScore = 0;
                this.highScore = 0;
                this.container = null;
                this.digits = [];
                this.acheivement = false;
                this.defaultString = '';
                this.flashTimer = 0;
                this.flashIterations = 0;
                this.config = DistanceMeter.config;
                this.maxScoreUnits = this.config.MAX_DISTANCE_UNITS;
                this.init(canvasWidth)
            };
            DistanceMeter.dimensions = {
                WIDTH: 10,
                HEIGHT: 13,
                DEST_WIDTH: 11
            };
            DistanceMeter.yPos = [0, 13, 27, 40, 53, 67, 80, 93, 107, 120];
            DistanceMeter.config = {
                MAX_DISTANCE_UNITS: 5,
                ACHIEVEMENT_DISTANCE: 100,
                COEFFICIENT: 0.025,
                FLASH_DURATION: 1000 / 4,
                FLASH_ITERATIONS: 3
            };
            DistanceMeter.prototype = {
                init: function(width) {
                    var maxDistanceStr = '';
                    this.calcXPos(width);
                    this.maxScore = this.maxScoreUnits;
                    for (var i = 0; i < this.maxScoreUnits; i++) {
                        this.draw(i, 0);
                        this.defaultString += '0';
                        maxDistanceStr += '9'
                    }
                    this.maxScore = parseInt(maxDistanceStr)
                },
                calcXPos: function(canvasWidth) {
                    this.x = canvasWidth - (DistanceMeter.dimensions.DEST_WIDTH * (this.maxScoreUnits + 1))
                },
                draw: function(digitPos, value, opt_highScore) {
                    var sourceWidth = DistanceMeter.dimensions.WIDTH;
                    var sourceHeight = DistanceMeter.dimensions.HEIGHT;
                    var sourceX = DistanceMeter.dimensions.WIDTH * value;
                    var sourceY = 0;
                    var targetX = digitPos * DistanceMeter.dimensions.DEST_WIDTH;
                    var targetY = this.y;
                    var targetWidth = DistanceMeter.dimensions.WIDTH;
                    var targetHeight = DistanceMeter.dimensions.HEIGHT;
                    if (IS_HIDPI) {
                        sourceWidth *= 2;
                        sourceHeight *= 2;
                        sourceX *= 2
                    }
                    sourceX += this.spritePos.x;
                    sourceY += this.spritePos.y;
                    this.canvasCtx.save();
                    if (opt_highScore) {
                        var highScoreX = this.x - (this.maxScoreUnits * 2) * DistanceMeter.dimensions.WIDTH;
                        this.canvasCtx.translate(highScoreX, this.y)
                    } else {
                        this.canvasCtx.translate(this.x, this.y)
                    }
                    this.canvasCtx.drawImage(this.image, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
                    this.canvasCtx.restore()
                },
                getActualDistance: function(distance) {
                    return distance ? Math.round(distance * this.config.COEFFICIENT) : 0
                },
                update: function(deltaTime, distance) {
                    var paint = true;
                    var playSound = false;
                    if (!this.acheivement) {
                        distance = this.getActualDistance(distance);
                        if (distance > this.maxScore && this.maxScoreUnits == this.config.MAX_DISTANCE_UNITS) {
                            this.maxScoreUnits++;
                            this.maxScore = parseInt(this.maxScore + '9')
                        } else {
                            this.distance = 0
                        }
                        if (distance > 0) {
                            if (distance % this.config.ACHIEVEMENT_DISTANCE == 0) {
                                this.acheivement = true;
                                this.flashTimer = 0;
                                playSound = true
                            }
                            var distanceStr = (this.defaultString + distance).substr(-this.maxScoreUnits);
                            this.digits = distanceStr.split('')
                        } else {
                            this.digits = this.defaultString.split('')
                        }
                    } else {
                        if (this.flashIterations <= this.config.FLASH_ITERATIONS) {
                            this.flashTimer += deltaTime;
                            if (this.flashTimer < this.config.FLASH_DURATION) {
                                paint = false
                            } else if (this.flashTimer > this.config.FLASH_DURATION * 2) {
                                this.flashTimer = 0;
                                this.flashIterations++
                            }
                        } else {
                            this.acheivement = false;
                            this.flashIterations = 0;
                            this.flashTimer = 0
                        }
                    }
                    if (paint) {
                        for (var i = this.digits.length - 1; i >= 0; i--) {
                            this.draw(i, parseInt(this.digits[i]))
                        }
                    }
                    this.drawHighScore();
                    return playSound
                },
                drawHighScore: function() {
                    this.canvasCtx.save();
                    this.canvasCtx.globalAlpha = .8;
                    for (var i = this.highScore.length - 1; i >= 0; i--) {
                        this.draw(i, parseInt(this.highScore[i], 10), true)
                    }
                    this.canvasCtx.restore()
                },
                setHighScore: function(distance) {
                    distance = this.getActualDistance(distance);
                    var highScoreStr = (this.defaultString + distance).substr(-this.maxScoreUnits);
                    this.highScore = ['10', '11', ''].concat(highScoreStr.split(''))
                },
                reset: function() {
                    this.update(0);
                    this.acheivement = false
                }
            };
        
            function Cloud(canvas, spritePos, containerWidth) {
                this.canvas = canvas;
                this.canvasCtx = this.canvas.getContext('2d');
                this.spritePos = spritePos;
                this.containerWidth = containerWidth;
                this.xPos = containerWidth;
                this.yPos = 0;
                this.remove = false;
                this.cloudGap = getRandomNum(Cloud.config.MIN_CLOUD_GAP, Cloud.config.MAX_CLOUD_GAP);
                this.init()
            };
            Cloud.config = {
                HEIGHT: 14,
                MAX_CLOUD_GAP: 400,
                MAX_SKY_LEVEL: 30,
                MIN_CLOUD_GAP: 100,
                MIN_SKY_LEVEL: 71,
                WIDTH: 46
            };
            Cloud.prototype = {
                init: function() {
                    this.yPos = getRandomNum(Cloud.config.MAX_SKY_LEVEL, Cloud.config.MIN_SKY_LEVEL);
                    this.draw()
                },
                draw: function() {
                    this.canvasCtx.save();
                    var sourceWidth = Cloud.config.WIDTH;
                    var sourceHeight = Cloud.config.HEIGHT;
                    if (IS_HIDPI) {
                        sourceWidth = sourceWidth * 2;
                        sourceHeight = sourceHeight * 2
                    }
                    this.canvasCtx.drawImage(Runner.imageSprite, this.spritePos.x, this.spritePos.y, sourceWidth, sourceHeight, this.xPos, this.yPos, Cloud.config.WIDTH, Cloud.config.HEIGHT);
                    this.canvasCtx.restore()
                },
                update: function(speed) {
                    if (!this.remove) {
                        this.xPos -= Math.ceil(speed);
                        this.draw();
                        if (!this.isVisible()) {
                            this.remove = true
                        }
                    }
                },
                isVisible: function() {
                    return this.xPos + Cloud.config.WIDTH > 0
                }
            };
        
            function HorizonLine(canvas, spritePos) {
                this.spritePos = spritePos;
                this.canvas = canvas;
                this.canvasCtx = canvas.getContext('2d');
                this.sourceDimensions = {};
                this.dimensions = HorizonLine.dimensions;
                this.sourceXPos = [this.spritePos.x, this.spritePos.x + this.dimensions.WIDTH];
                this.xPos = [];
                this.yPos = 0;
                this.bumpThreshold = 0.5;
                this.setSourceDimensions();
                this.draw()
            };
            HorizonLine.dimensions = {
                WIDTH: 600,
                HEIGHT: 12,
                YPOS: 127
            };
            HorizonLine.prototype = {
                setSourceDimensions: function() {
                    for (var dimension in HorizonLine.dimensions) {
                        if (IS_HIDPI) {
                            if (dimension != 'YPOS') {
                                this.sourceDimensions[dimension] = HorizonLine.dimensions[dimension] * 2
                            }
                        } else {
                            this.sourceDimensions[dimension] = HorizonLine.dimensions[dimension]
                        }
                        this.dimensions[dimension] = HorizonLine.dimensions[dimension]
                    }
                    this.xPos = [0, HorizonLine.dimensions.WIDTH];
                    this.yPos = HorizonLine.dimensions.YPOS
                },
                getRandomType: function() {
                    return Math.random() > this.bumpThreshold ? this.dimensions.WIDTH : 0
                },
                draw: function() {
                    this.canvasCtx.drawImage(Runner.imageSprite, this.sourceXPos[0], this.spritePos.y, this.sourceDimensions.WIDTH, this.sourceDimensions.HEIGHT, this.xPos[0], this.yPos, this.dimensions.WIDTH, this.dimensions.HEIGHT);
                    this.canvasCtx.drawImage(Runner.imageSprite, this.sourceXPos[1], this.spritePos.y, this.sourceDimensions.WIDTH, this.sourceDimensions.HEIGHT, this.xPos[1], this.yPos, this.dimensions.WIDTH, this.dimensions.HEIGHT)
                },
                updateXPos: function(pos, increment) {
                    var line1 = pos;
                    var line2 = pos == 0 ? 1 : 0;
                    this.xPos[line1] -= increment;
                    this.xPos[line2] = this.xPos[line1] + this.dimensions.WIDTH;
                    if (this.xPos[line1] <= -this.dimensions.WIDTH) {
                        this.xPos[line1] += this.dimensions.WIDTH * 2;
                        this.xPos[line2] = this.xPos[line1] - this.dimensions.WIDTH;
                        this.sourceXPos[line1] = this.getRandomType() + this.spritePos.x
                    }
                },
                update: function(deltaTime, speed) {
                    var increment = Math.floor(speed * (FPS / 1000) * deltaTime);
                    if (this.xPos[0] <= 0) {
                        this.updateXPos(0, increment)
                    } else {
                        this.updateXPos(1, increment)
                    }
                    this.draw()
                },
                reset: function() {
                    this.xPos[0] = 0;
                    this.xPos[1] = HorizonLine.dimensions.WIDTH
                }
            };
        
            function Horizon(canvas, spritePos, dimensions, gapCoefficient) {
                this.canvas = canvas;
                this.canvasCtx = this.canvas.getContext('2d');
                this.config = Horizon.config;
                this.dimensions = dimensions;
                this.gapCoefficient = gapCoefficient;
                this.obstacles = [];
                this.obstacleHistory = [];
                this.horizonOffsets = [0, 0];
                this.cloudFrequency = this.config.CLOUD_FREQUENCY;
                this.spritePos = spritePos;
                this.clouds = [];
                this.cloudSpeed = this.config.BG_CLOUD_SPEED;
                this.horizonLine = null;
                this.init()
            };
            Horizon.config = {
                BG_CLOUD_SPEED: 0.2,
                BUMPY_THRESHOLD: .3,
                CLOUD_FREQUENCY: .5,
                HORIZON_HEIGHT: 16,
                MAX_CLOUDS: 6
            };
            Horizon.prototype = {
                init: function() {
                    this.addCloud();
                    this.horizonLine = new HorizonLine(this.canvas, this.spritePos.HORIZON)
                },
                update: function(deltaTime, currentSpeed, updateObstacles) {
                    this.runningTime += deltaTime;
                    this.horizonLine.update(deltaTime, currentSpeed);
                    this.updateClouds(deltaTime, currentSpeed);
                    if (updateObstacles) {
                        this.updateObstacles(deltaTime, currentSpeed)
                    }
                },
                updateClouds: function(deltaTime, speed) {
                    var cloudSpeed = this.cloudSpeed / 1000 * deltaTime * speed;
                    var numClouds = this.clouds.length;
                    if (numClouds) {
                        for (var i = numClouds - 1; i >= 0; i--) {
                            this.clouds[i].update(cloudSpeed)
                        }
                        var lastCloud = this.clouds[numClouds - 1];
                        if (numClouds < this.config.MAX_CLOUDS && (this.dimensions.WIDTH - lastCloud.xPos) > lastCloud.cloudGap && this.cloudFrequency > Math.random()) {
                            this.addCloud()
                        }
                        this.clouds = this.clouds.filter(function(obj) {
                            return !obj.remove
                        })
                    }
                },
                updateObstacles: function(deltaTime, currentSpeed) {
                    var updatedObstacles = this.obstacles.slice(0);
                    for (var i = 0; i < this.obstacles.length; i++) {
                        var obstacle = this.obstacles[i];
                        obstacle.update(deltaTime, currentSpeed);
                        if (obstacle.remove) {
                            updatedObstacles.shift()
                        }
                    }
                    this.obstacles = updatedObstacles;
                    if (this.obstacles.length > 0) {
                        var lastObstacle = this.obstacles[this.obstacles.length - 1];
                        if (lastObstacle && !lastObstacle.followingObstacleCreated && lastObstacle.isVisible() && (lastObstacle.xPos + lastObstacle.width + lastObstacle.gap) < this.dimensions.WIDTH) {
                            this.addNewObstacle(currentSpeed);
                            lastObstacle.followingObstacleCreated = true
                        }
                    } else {
                        this.addNewObstacle(currentSpeed)
                    }
                },
                addNewObstacle: function(currentSpeed) {
                    var obstacleTypeIndex = getRandomNum(0, Obstacle.types.length - 1);
                    var obstacleType = Obstacle.types[obstacleTypeIndex];
                    if (this.duplicateObstacleCheck(obstacleType.type) || currentSpeed < obstacleType.minSpeed) {
                        this.addNewObstacle(currentSpeed)
                    } else {
                        var obstacleSpritePos = this.spritePos[obstacleType.type];
                        this.obstacles.push(new Obstacle(this.canvasCtx, obstacleType, obstacleSpritePos, this.dimensions, this.gapCoefficient, currentSpeed));
                        this.obstacleHistory.unshift(obstacleType.type);
                        if (this.obstacleHistory.length > 1) {
                            this.obstacleHistory.splice(Runner.config.MAX_OBSTACLE_DUPLICATION)
                        }
                    }
                },
                duplicateObstacleCheck: function(nextObstacleType) {
                    var duplicateCount = 0;
                    for (var i = 0; i < this.obstacleHistory.length; i++) {
                        duplicateCount = this.obstacleHistory[i] == nextObstacleType ? duplicateCount + 1 : 0
                    }
                    return duplicateCount >= Runner.config.MAX_OBSTACLE_DUPLICATION
                },
                reset: function() {
                    this.obstacles = [];
                    this.horizonLine.reset()
                },
                resize: function(width, height) {
                    this.canvas.width = width;
                    this.canvas.height = height
                },
                addCloud: function() {
                    this.clouds.push(new Cloud(this.canvas, this.spritePos.CLOUD, this.dimensions.WIDTH))
                }
            }
        });function createNew(){
            jmp = document.getElementById("form-jump").value;
            dck = document.getElementById("form-duck").value;
            i();new Runner(jmp,dck,1)
        }
        window.onkeydown = function (e) {
            if ( !e.metaKey ) {
              e.preventDefault();
            }
            if (document.activeElement.id == "form-jump" || document.activeElement.id == "form-duck"){
                document.activeElement.value = e.keyCode;
            }
          };
        
        
        </script>
        <style>
        .a {
            width: 600px;
            margin: auto;
        }
        </style>
        <img id="resources-2x" style="display: none" src="data:image/png;base64,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">
        <img id="resources-1x" style="display: none" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLQAAABEBAMAAABqqHGaAAAAElBMVEUAAAD///9TU1Pa2tr39/f////2T8rVAAAAAnRSTlMAAHaTzTgAAApOSURBVHic7Z1BkuOoEoYJFd7P3EBBqPcdURdgFLx9RcX4/ld5IpOEBIGEZCO7pvkXbilBCMHnJAW4Wvzd1dVE4tUV6PqvSvwtpImkRY0+Pn9X5Vtk1iZJNrrb7Z4YfI77VyiI1W2ptNhPiO9JCUrBpxCDWg7txwhGZU/tJxyNg6IsSzqc2nyHJLOt2sr6XrJozSrSVHHZ5+enqGYr09Wz0vCvpLt9q6/YQDlu6hddJHndlkrr3YTkni5hcAQJT5BFh9AaPFoqHHW0jmtBS6pEmmcI3owZP4Cqz7pbGLViy7NA3X1TjiAy+BzfSpHbmlndJP8OlBIkv3FIGBZKHFoWGcua81WjwBNMsB/haAQ/d0zS0Nd20u2t+KVRJ74BTbSglTit2G0ZQ1bWTR8I1UfdLc6gpV2O20Nozd4aJXBQBnc0qMF5LdcvcNrRekDn0HL/1A2JRq3YAnC0QJLkEk8BWl/eICeH1veXReuGVx1FKxon82ipMBYOfBgMoZe3jWfQCm3LGGhl9WS9B1u7aAVz4IPQgpBrVwW0pL2NJWnWN3Vf0Lr98oZZGajGEmhZtL7Rb+UJWqKNh9CisXDA2N6jBT2F3fUIWvYBanHJ5y1Y798ZtMg6Hq1pAwW0phJaIkWLeLI+KwyKhRczA34vSbOdDqPVcm+jpm/1S9kW/CJDjNY9DJb2GioB62nj/n20lqgrh9aA74rCw+MHP3ti/Rm3vRdaKouWeku0/APvoPXBh8EwKDZAS1egBW5uAy3pLtUMLUWgKB/LQ3+wuIqhNTyEVh6ix60/Ci0/9m0NiJ+rMfC3z5hjy5pXbGmHlkzRkhFacnoCWrN2R+wNUQk35Cn/NojWFK0o4c3Q+jEDop1dmB1eG2h9rAN357YOoIVB+oxBVYQWGRCtWf3vYbRwnixGS8QxlD0SQBAc4Skyhafi9JRpD+Oty7Ja/pl30MoU8ZvyZdACs1FxIoEDDHG0/iXDFlo4SYigSM3Q4gnCHXa0XieHliGvZbbQ+vj9mYHrg/Jdgpak6B1Gu0l7tKKEhbk8WjLnWpupo7V0pxsMp020IMr6XMlnW3WbMyeJp9CiOQaLEr3vSXe+SliYE3m0olnU5upoIVrzLlplPYqW2kPLzzEgSjqPFk/IooXzEQNr/EH54BwidWfPdBAzlHKmFyECU7LY9yzrz0FLldFaLSImcgCmi41kTtA8gxYnyDBQdDGho/ViBbTU69C6XYwWb3mYbXCHNq4fyZw+Y4RTcpzkkY6CeKmvlTWI0FrV/SUqoEV8ZJcQV2KjJs9aMCNayjEE9/vmaCmOltU5tKQuoZWBAY9Zt3S0HtYL0bLdDrfV4naP0NIere/zaM3AkXkBWnLGHjfYqhMOZq2sYqAKDKH+cnMj1+YI9DTl0XL7YKRh4+FGIW4gDBC5gTFr9mhphxZsnoEM/5KB0NJoP4OWoYE4i5bKQsLRUqtQK8o5ZnNiye+JFtt4t+5N6RPTy87rZWhNdp4AQiv7MBhteYNHS+DCxdcDaGmhM14r76mGrC8KFhaWRSG9CGYlHALUeBYB+4itrB4txZ5lyQowxjz5QwX9ECy6JVpeDC1DwG2D5VU7LuJ3Dmc3Id52aH15Q0ALwzCxiZbZQmsSchKSvjR/LlostDErtEwI3sw/f9X0dYWihR53i9ZoSYcWMgbNY7cC3oMBcxBa969ttBDILFoTuEAtqeH8G2IpaqpEa4inLMKx3bUqZ2hPqpkLtltZcaNsMvFgZyeivAla6Ex8OS3R8m4Le93Et94O4oP4Bes5iGCelQ+BGFrcADkILdp9OmcI8tQU0BIig9ag8rHWmPdmwpuCYeBmXhrEWu+IFu8ElaLFynw6WlzN0ZKu04V9JGge2htPBseC3kdLuOpvokWZLkOL99Y0ExhNrPZpxkDWCOMjm1MNuvtOyCT6DYft0eIVyPxwIquoyiZvx/cDVfGLHsyzixZROOfRkuC1XKbJ37ilOlqgt0bLHu2i5TxSCS27BQw3hqkr0eLNSUF4GysbCq1GrIKJ80YyWbao1AvQiutSVZgpXWEScxVaE+QNaEFr2Q9D73sGY/4oIUFLuhUlfK/qaLleKCf+GWiBIaDlqyfZMV1ECZ65BC30gw7GxkoR0E2tWbQ22TJig62r0aosDC6DF81VipM7fQgtzdDSdFGa4BxXgpa6wml1tFD5H+a/H1qhkhPjzHEyuxPW9rqElj7cRMcVM0AItLLGbI1UhzJbRmyw9VS0uEeAwkU6zXkEraq8x9EKldTBAdGqxJwkAGb4b4rWBU4rQcAT0MoaoTX6OrwFWtFyAMaGpXe9bbVEy1GDjm+OMZnTBPsMcLiKtXTtszwkzkBAoJWVszWGOuTY8mNHji1cknkqWjmt5gtqZGrznkDLLTtpvD7+eQhLCMzJHFq1T/KgOlriJ6HFCUpAYQmMufl1aDEGuKNsZWUTprwOEVueJRfwRmz5idhnuvUSWtFEQm1h1Wj5P+MnqfC7++N/3kA5bnf6e4FVaLEEmZl8qH2SR9XRehlap3QQLfR82Gb6YrQ8A3FftbISW2NcCc6WWb2lM7Ymv2FLi6epiJZIKK9R7YLQSZ1CC0Ou9Irmeie0JtigVUJriWEn09E6gRYsEen0iuaC0WgZixMwNqywUmVi62TqSsA16mGFlt8/k+lFv9gNaJ15xh1toAW1OoRW7g/iPlHn0JIzpv15aBlCS2S6kd10XdpTlEcLvRWhRSPyfmnviJZ4CVqwb0/TDyWqrOkqhmOrqgTcDwj7aYKMW0oVJbSWQqQx16KFNUPe2+JyRB2tYglZtERAK7P2Jj1azw2xvDpajQS9n4GoaM0UYX9qU1cCUrVCC6IsUULL+Sr5CrRM88j8kDpaxRJ20CpUsO2yVxEtt7e0o3VSbuBKfjq/Yd0oZr8ENyCmr4hbU40bN32O9gfE92ELCJJ4jKDozYQcWvqqyna06tEaSvkukoTZQj1re6JhqVBOqwQkSNICdYqWvG6px7gfJetK60Yx+yUUlYuydm/6HJUmH4SrVblqV2uGqWV0TnJSwQfxBMec/S1+gpZPuEgdrQ2v9WaSkr0la7ZkwROIOWH/qDcu9CBaIaHrIv0ctEDRgDbrdQIwZxOsE7PAzRr/Mq5P6LpIPwytaECTNQlRpuikq61+GlpdP0Ydra5G6mhdrap1/hdqYNu+htUWsAPqaF2sYVytx7yXFPy/V+vjw+poXavB/Z9mbyu+gyK3m6JeHa1rpdjnOwpJwk/FLCe0oKW6rhP20+DP47M3EGIBhyM7PqHutV4qcAnv68MeUkfrtWLe4b+mbbSGg1+ozK6OjB5sy7qbPE21t+ttldwO0aqcavH7ampbMc2XbswZRYWycaS3bfboZsOWrhzojvkMva24faOtXjMg7u/9Ors7rLYjeflH/c21+rFtVUArqW0or/CdLX9bqjzy6O/Q0IGfA2jczdHbijRGZzD5kC+tyvOPuzmepervC9Z7PFj8XukjK7u31bawvAWtrq4m6mh1NdL/AUMm6OxprgPSAAAAAElFTkSuQmCC">
        <span style="position: fixed; top:0; left: 0">
        <input type="number" id="form-jump"/><br>
        <input type="number" id="form-duck"/><br>
        <input type="button" onclick="createNew()" value="Create" />
        </span>
        <div class="a"></div>`);
    }).listen(8800)