import * as PIXI from 'pixi.js';
import Symbols from './Symbols';

export default class CreateSlots {
    constructor(container) {
        this.container = container
    }

    createSlotsContainer(slotsBox, slotsImages, slots) {
        for(let i = 0; i < 5; i++) {
            let sc = new PIXI.Container();
            sc.position.set(10, 9)
            sc.x = i * 135;
            slotsBox.addChild(sc);
    
            const slot = {
                container: sc,
                symbols: [],
                position: 0,
                previousPosition: 0,
                blur: new PIXI.filters.BlurFilter()
            };
    
            slot.blur.blurX = 0;
            slot.blur.blurY = 0;
            sc.filters = [slot.blur];
    
            // Random symbol in each slot
            let symbols = new Symbols();
            symbols.fillSymbols(slotsImages, slot, sc);
            slots.push(slot);
        }
    }
}