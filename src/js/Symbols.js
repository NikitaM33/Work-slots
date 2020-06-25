import * as PIXI from 'pixi.js';

export default class Symbols {
    fillSymbols(textures, slot, container) {
        for(let j = 0; j < 4; j++) {
            let symbol = new PIXI.Sprite(textures[Math.floor(Math.random() * textures.length)]);
            symbol.y = j * 83;
            symbol.scale.x = symbol.scale.y = Math.min(83 / symbol.width, 83 / symbol.height);
            symbol.x  = Math.round((83 - symbol.width) / 2);
            slot.symbols.push(symbol);
            container.addChild(symbol);
        };
    }
}