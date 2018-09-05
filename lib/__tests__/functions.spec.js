import {
    hex2rgbCSS,
    buildClassSelector,
    parseNumberEls,
    getNormalized,
    getSelector,
    selectElement,
    itemShouldBeVisible,
    shouldExist,

    scroll,
    click,
    type,
    replace,
    open,
    waitForResults,
    dragAbove,
    takeSnapshot,
    takeElSnapshot,
    onPage,
    redirectedTo,
    nElments,
    textOnEl,
    elExists,
    elDoesNotExist,
    elBackground,
    elBorder,
} from '../functions';

import { ELEMENT_SELECTORS } from '../variables';
jest.mock('../variables');

describe('functions', () => {
    let get;
    let last;
    let eq;
    let first;
    let should;
    let window;
    let then;
    let scrollTo;
    let click;

    beforeEach(() => {
        ELEMENT_SELECTORS['Button'] = '.button';
        ELEMENT_SELECTORS['Modal'] = {
            default: '.modal',
            Button: '.modal-button',
        };

        last = jest.fn();
        eq = jest.fn();
        should = jest.fn();
        first = jest.fn().mockReturnValue({
            should,
        });

        then = jest.fn();
        scrollTo = jest.fn();
        click = jest.fn();

        window = jest.fn().mockReturnValue({
            then: then
                .mockImplementation((func) => {
                    func({ scrollTo });

                    return {
                        then: (func) => {
                            func([{ scrollHeight: 1000 }] )
                        }
                    }
                })
        })

        get = jest.fn().mockReturnValue({
            last,
            eq,
            first,
        })

        global.cy = {
            get,
            window,
            click
        };
    });

    describe('hex2rbgCSS', () => {
        it('converts a color with no alpha', () => {
            expect(hex2rgbCSS('F2F2F2')).toEqual('rgb(242, 242, 242)');
        });

        it('converts a color with an alpha', () => {
            expect(hex2rgbCSS('F2F2F280')).toEqual('rgb(242, 242, 242, 0.5)');
        })
	});

    describe('buildClassSelector', () => {
        it('Converts a class to an attribute', () => {
            expect(buildClassSelector('.test-class')).toEqual('[class*="test-class"]')
        });
        
        it('Attaches :modifiers to the end', () => {
            expect(buildClassSelector('.test-class:hover')).toEqual('[class*="test-class"]:hover')
        });

        it('Matches Child Classes', () => {
            expect(buildClassSelector('.test-class .class-2')).toEqual('[class*="test-class"] [class*="class-2"]')
        });

        it('Matches Multiple Classes', () => {
            expect(buildClassSelector('.test-class.class-2')).toEqual('[class*="test-class"][class*="class-2"]')
        });

        it('Handles :contains()', () => {
            expect(buildClassSelector('.test-class:contains("Good Stuff")')).toEqual('[class*="test-class"]:contains("Good Stuff")')
        });

        it('Matches Wierd Combos of Classes', () => {
            expect(buildClassSelector('.test-class.class-2:active .class3:hover > .class4'))
                .toEqual('[class*="test-class"][class*="class-2"]:active [class*="class3"]:hover > [class*="class4"]')
        });
	});

    describe('parseNumberEls', () => {
        it('handles last element', () => {
            expect(parseNumberEls('last Button')).toEqual({
                ordinal: 'last',
                el: 'Button'
            });
        });

        it('handles numbered elements', () => {
            expect(parseNumberEls('third Button')).toEqual({
                ordinal: 3,
                el: 'Button'
            });

            expect(parseNumberEls('fifty-sixth Button')).toEqual({
                ordinal: 56,
                el: 'Button'
            });
        });

        it('handles elements without a number', () => {
            expect(parseNumberEls('Button')).toEqual({
                el: 'Button'
            });
        });
	});

    describe('getNormalized', () => {
        it('accepts just the element', () => {
            getNormalized('Button');

            expect(get).toBeCalledWith('[class*="button"]')
        });

        it('an element and its parent', () => {
            getNormalized(['Modal', 'Button']);

            expect(get).toBeCalledWith('[class*="modal"] [class*="modal-button"]')
        });

        it('filters out undefined elements', () => {
            getNormalized([null,'Button']);

            expect(get).toBeCalledWith('[class*="button"]')
        });

        it('Gets rid of \'s', () => {
            getNormalized(['Button\'s']);

            expect(get).toBeCalledWith('[class*="button"]');
        })

        it('Makes an element sigular if the singular option is passed in' , () => {
            getNormalized(['Buttons'], { singular: true });

            expect(get).toBeCalledWith('[class*="button"]')
        });

        it('parses out ordinals', () => {
            getNormalized(['third Button']);
            getNormalized(['last Button']);

            expect(get).toBeCalledWith('[class*="button"]')
            expect(eq).toBeCalledWith(2)
            expect(last).toBeCalled()
        });

        it('throws an error if the selector is not defined', () => {
            expect(() =>{
                getNormalized(['Link']);
            }).toThrow('The className was not defined for Link')

            expect(() =>{
                getNormalized(['Modal', 'Link']);
            }).toThrow('The className was not defined for Modal>Link')


            expect(() =>{
                getNormalized(['Header', 'Link']);
            }).toThrow('The className was not defined for Header')
        });

        it('selects the correct element if text is passed', () => {
            getNormalized('Button', { text: 'Hi There' });

            expect(get).toBeCalledWith('[class*="button"]:contains("Hi There")')
        });
	});

    describe('getSelector', () => {
        it('accepts just the element', () => {
            expect(getSelector('Button')).toBe('[class*="button"]');
        });

        it('an element and its parent', () => {
            expect(
                getSelector(['Modal', 'Button'])
            ).toBe('[class*="modal"] [class*="modal-button"]');
        });

        it('filters out undefined elements', () => {
            expect(getSelector([null,'Button'])).toBe('[class*="button"]');
        });

        it('Gets rid of \'s', () => {
            expect(getSelector(['Button\'s']))
                .toBe('[class*="button"]');
        })

        it('Makes an element singular if the singular option is passed in' , () => {
            expect(getSelector(['Buttons'], { singular: true }))
                .toBe('[class*="button"]')
        });

        it('parses out ordinals', () => {
            expect(getSelector(['third Button'])).toBe('[class*="button"]');
            expect(getSelector(['last Button'])).toBe('[class*="button"]');
        });

        it('throws an error if the selector is not defined', () => {
            expect(() =>{
                getSelector(['Link']);
            }).toThrow('The className was not defined for Link')

            expect(() =>{
                getSelector(['Modal', 'Link']);
            }).toThrow('The className was not defined for Modal>Link')


            expect(() =>{
                getSelector(['Header', 'Link']);
            }).toThrow('The className was not defined for Header')
        });

        it('selects the correct element if text is passed', () => {
            expect(getSelector('Button', { text: 'Hi There' }))
                .toBe('[class*="button"]:contains("Hi There")')
        });
	});

    test('elExists', () => {
        elExists('Button');
        
        expect(get).toBeCalledWith('[class*="button"]')
        expect(first).toBeCalled();
        expect(should).toBeCalledWith('exist');
	});

    // gotta figure out how to test this...
    describe('scroll', () => {
        it('scrolls to the top', () => {
            scroll('top');
            
            expect(window).toHaveBeenCalled();
            expect(get).toHaveBeenCalledWith('body');
            expect(scrollTo).toHaveBeenCalledWith(0, 0);
        });

        it('scrolls to the bottom', () => {
            scroll('bottom');
            
            expect(window).toHaveBeenCalled();
            expect(get).toHaveBeenCalledWith('body');
            expect(scrollTo).toHaveBeenCalledWith(0, 1100);
        });
    });

    test('click', () => {
        click(['Modal', 'Button'], { text: 'Hello' });

        expect(click).toBeCalled();
	});

    describe('type', () => {
        // let type = jest.fn();
        // let ogGetNormalized;
        // beforeEach(() => {
        //     ogGetNormalized = getNormalized;
        //     getNormalized = jest.fn().mockReturnValue({
        //         type
        //     });
        // });

        // it('works with a random variable', () => {
        //     type('user<rand:userId>')
        // })

        // afterEach(() => {
        //     // getNormalized = ogGetNormalized;
        // })
	});

    describe('replace', () => {

	});

    describe('open', () => {

	});

    describe('waitForResults', () => {

	});

    describe('dragAbove', () => {

	});

    describe('takeSnapshot', () => {

	});

    describe('takeElSnapshot', () => {

	});

    describe('onPage', () => {

	});

    describe('redirectedTo', () => {

	});

    describe('nElments', () => {

	});

    describe('textOnEl', () => {

	});

    describe('elExists', () => {

	});

    describe('elDoesNotExist', () => {

	});

    describe('elBackground', () => {

	});

    describe('elBorder', () => {

	});

})