import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js/lib/core';
import '../styles/main.scss';
import CreateSlots from './CreateSlots';

let Application = PIXI.Application,
    loader = PIXI.loader,
    Textures = PIXI.utils.TextureCache

let app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
    resolution: 1
});

app.renderer.backgroundColor = 0x061639;

document.body.appendChild(app.view);

loader
    .add('src/images/engrySlots.json')
    .add('src/images/eggBird.png')
    .add('src/images/bombBird.png')
    .add('src/images/kingPig.png')
    .add('src/images/yelowBird.png')
    .add('src/images/igorBird.png')
    .load(setup);

// center of display
let centerX = window.innerWidth / 2,
    centerY = window.innerHeight / 2;

// Text style
const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
});

function setup() {

    // Background
    let bacground = Textures['fon.png'];
    let bg = new PIXI.Sprite(bacground);
    bg.position.set(0, 0);

    // Transparent box for slots
    let transparentBox = new Graphics();
    transparentBox.lineStyle(5, 0xffffff, 0.6);
    transparentBox.beginFill(0xffffff, 0.5);
    transparentBox.drawRoundedRect(-9, 0, 650, 270, 8);
    transparentBox.endFill();

    // Slots images
    let slotsImages = [
        PIXI.Texture.from('src/images/eggBird.png'),
        PIXI.Texture.from('src/images/bombBird.png'),
        PIXI.Texture.from('src/images/kingPig.png'),
        PIXI.Texture.from('src/images/yelowBird.png'),
        PIXI.Texture.from('src/images/igorBird.png')
    ]

    // Slots container
    let slots = [];
    let slotsBox = new PIXI.Container();
    slotsBox.position.set(60, 65);
    slotsBox.addChild(transparentBox);

    // Create slots texture
    let slotContainer = new PIXI.Container();
    let createSlots = new CreateSlots(slotContainer);
    createSlots.createSlotsContainer(slotsBox, slotsImages, slots);

    // Top text box
    let header = new Graphics();
    header.beginFill(0x1099bb);
    header.drawRect(0, -59, 740, 60)
    header.endFill();

    let headerText = new PIXI.Text('ENGRY SLOTS!', style);
    headerText.position.set((header.width - headerText.width) / 2, (header.height - headerText.height) / 2);

    // Bottom text box with button
    let footer = new Graphics();
    footer.beginFill(0x1099bb);
    footer.drawRect(0, bg.height, 740, 60);
    footer.endFill();

    let footerText = new PIXI.Text('SPIN IT!', style);
    footerText.position.set((footer.width - footerText.width) / 2, (footer.height - footerText.height) / 2);
    footerText.y = bg.height + (footer.height - footerText.height) / 2;

    // Create a button
    footer.interactive = true;
    footer.buttonMode = true;

    // Start game
    footer.addListener('pointerdown', () => {
        startGame()
    });

    // Game container
    let gameContainer = new PIXI.Container();
    gameContainer.addChild(bg);
    gameContainer.addChild(slotsBox);
    gameContainer.addChild(headerText);
    gameContainer.addChild(footer);
    gameContainer.addChild(footerText);
    gameContainer.position.set(centerX - gameContainer.width / 2, centerY - gameContainer.height / 2);
    // game.position.set(centerY - game.height / 2);

    app.stage.addChild(gameContainer);


    // Start spin function
    let start = false;

    function startGame() {
        if(start) return;

        start = true;
        
        for(let i = 0; i < slots.length; i++) {
            let random = Math.floor(Math.random() * 3);
            let result = slots[i].position + 10 + i * 5 + random;
            let spinTime = 2500 + i * 600 + random * 600;
            startSpin(slots[i], 'position', result, spinTime, backout(0.5), null, i === slots.length - 1 ? spinStop : null);
        }
    };

    // Stop spin function
    function spinStop() {
        start = false;
    };

    app.ticker.add(delta => {
        for(let i = 0; i < slots.length; i++) {
            slots[i].blur.blurY = (slots[i].position - slots[i].previousPosition) * 8;
            slots[i].previousPosition = slots[i].position;

            // Update symbols
            for(let j = 0; j < slots[i].symbols.length; j++) {
                let symb = slots[i].symbols[j];
                let prev = symb.y;
                symb.y = ((slots[i].position + j) % slots[i].symbols.length) * 83 - 83;

                if(symb.y < 0 && prev > 83) {
                    symb.texture = slotsImages[Math.floor(Math.random() * slotsImages.length)];
                    symb.scale.x = symb.scale.y = Math.min(83 / symb.texture.width, 83 / symb.texture.height);
                    symb.x = Math.round((83 - symb.width) / 2);
                }
            }
        }
    })


    // Very simple tweening utility function
    let spining = [];

    function startSpin(object, property, target, time, easing, onchange, oncomplete) {
        let spin = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onchange,
            complete: oncomplete,
            start: Date.now(),
        };

        spining.push(spin);
        return spin;
    }



    // Listen for animate update.
    app.ticker.add((delta) => {
        let now = Date.now();
        let remove = [];
        for (let i = 0; i < spining.length; i++) {
            let t = spining[i];
            let phase = Math.min(1, (now - t.start) / t.time);
    
            t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change) t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            spining.splice(spining.indexOf(remove[i]), 1);
        }
    });
    
    // Basic lerp function.
    function lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }
    
    // Backout function from tweenjs.
    // https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
    function backout(amount) {
        return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
    }
}