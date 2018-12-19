import * as functions from '../functions';
import { ELEMENT_SELECTORS, STATE, setScreens } from '../common/variables';

let {
    hex2rgbCSS,
    buildClassSelector,
    parseNumberEls,
    getNormalized,
    getSelector,

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
    nElements,
    textOnEl,
    elExists,
    elDoesNotExist,
    elBackground,
    elBorder,
} = functions;

jest.mock('../common/variables');

describe('functions', () => {
    let get;
    let last;
    let eq;
    let first;
    let should;
    let window;
    let then;
    let scrollTo;
    let clickFn;
    let typeFn;
    let clearFn;
    let visitFn;
    let wait;
    let matchImageSnapshot;
    let url;

    beforeEach(() => {
        ELEMENT_SELECTORS['Button'] = '.button';
        ELEMENT_SELECTORS['Input'] = '.input';
        ELEMENT_SELECTORS['Modal'] = {
            default: '.modal',
            Button: '.modal-button',
        };

        setScreens({
            'Home': '/home'
        });

        last = jest.fn();
        eq = jest.fn();
        should = jest.fn();
        clickFn = jest.fn();
        first = jest.fn().mockReturnValue({
            should,
            click: clickFn
        });


        then = jest.fn();
        scrollTo = jest.fn();

        typeFn = jest.fn();

        clearFn = jest.fn().mockReturnValue({
            type: typeFn
        });

        visitFn = jest.fn();

        wait = jest.fn();

        matchImageSnapshot = jest.fn();

        url = jest.fn().mockReturnValue({
            should
        })

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
            type: typeFn,
            click: clickFn,
            clear: clearFn,
            matchImageSnapshot,
            should,
        })

        global.cy = {
            get,
            window,
            click: clickFn,

            visit: visitFn,
            wait,
            matchImageSnapshot,
            url: url,
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

        it('Handles Child Classes', () => {
            expect(buildClassSelector('.test-class .class-2')).toEqual('[class*="test-class"] [class*="class-2"]')
        });

        it('Handles Multiple Classes', () => {
            expect(buildClassSelector('.test-class.class-2')).toEqual('[class*="test-class"][class*="class-2"]')
        });

        it('Handles :contains()', () => {
            expect(buildClassSelector('.test-class:contains("Good Stuff")')).toEqual('[class*="test-class"]:contains("Good Stuff")')
        });

        it('Handles Wierd Combos of Classes', () => {
            expect(buildClassSelector('.test-class.class-2:active .class3:hover > .class4'))
                .toEqual('[class*="test-class"][class*="class-2"]:active [class*="class3"]:hover > [class*="class4"]')
        });
	});

    describe('parseNumberEls', () => {
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

        it('handles last element', () => {
            expect(parseNumberEls('last Button')).toEqual({
                ordinal: 'last',
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

        it('accepts an element and its parent', () => {
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

        it('selects the correct element if text is passed', () => {
            getNormalized('Button', { text: 'Hi There' });

            expect(get).toBeCalledWith('[class*="button"]:contains("Hi There")')
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
        click('Button', 'Modal', { text: 'Hello' });

        expect(clickFn).toBeCalled();
	});

    describe('type', () => {
        it('works with text', () => {
            type('hello', 'Input');
            expect(typeFn).toBeCalledWith('hello');
        })
        it('works with a random variable', () => {
            type('user<rand:userId>', 'Input');

            // not sure how to match random
            expect(typeFn).toBeCalledWith(
                expect.stringMatching(/user\d+/)
            );
        })

        it('generates a random variable, saves it and then allows it to be used`', () => {
            type('user<rand:userId>', 'Input');

            expect(STATE.userId).toEqual(
                expect.stringMatching(/\d+/)
            );

            type('user<var:userId>', 'Input');

            expect(typeFn).toHaveBeenCalledWith(
                'user' + STATE.userId
            );
        })
	});

    test('replace', () => {
        replace('Input', '', '', 'hello');

        expect(clearFn).toHaveBeenCalled();
        expect(typeFn).toBeCalledWith('hello')
	});

    test('open', () => {
        open('Home');

        expect(visitFn).toBeCalledWith('/home');

	});

    test('waitForResults', () => {
        waitForResults();

        expect(wait).toBeCalledWith(1000)
	});

    // Experimental, not nailed down yet
    describe('dragAbove', () => {

	});

    test('takeSnapshot', () => {
        takeSnapshot('Test');

        expect(matchImageSnapshot).toBeCalledWith(
            'Test', {
                threshold: 1000,
                thresholdType: 'pixel'
            }
        );
	});

    test('takeElSnapshot', () => {
        takeElSnapshot('Input');

        expect(matchImageSnapshot).toBeCalledWith(
            'Input', {
                threshold: 1000,
                thresholdType: 'pixel'
            }
        );
	});

    test('onPage', () => {
        onPage('Home');

        expect(should).toBeCalledWith(
            'contain',
            '/home'
        );
	});

    test('redirectedTo', () => {
        redirectedTo('Home');

        expect(should).toBeCalledWith(
            'contain',
            '/home'
        );
	});

    test('nElements', () => {
        nElements(3, 'Input')
        expect(should).toHaveBeenCalledWith(
            'have.length',
            3
        );
    });
    
    test('elExists', () => {
        elExists('Input');

        expect(should).toHaveBeenCalledWith('exist')
	});

    test('textOnEl', () => {
        textOnEl('Text', 'Button', 'Modal');

        expect(should).toHaveBeenCalledWith('exist')

	});

    test('elDoesNotExist', () => {
        elDoesNotExist('Input');

        expect(should).toHaveBeenCalledWith(
            'have.length',
            0
        )
	});

    test('elBackground', () => {
        elBackground('#ffffff', 'Input');

        expect(should).toHaveBeenLastCalledWith(
            'have.css',
            'background-color',
            'rgb(255, 255, 255)'
        );
	});

    test('elBorder', () => {
        elBorder('#ffffff', 'Input');

        expect(should).toHaveBeenLastCalledWith(
            'have.css',
            'border-color',
            'rgb(255, 255, 255)'
        );
	});
})