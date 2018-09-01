import { REGEX } from '../phrases';

describe('REGEX', () => {
    describe('SCROLL', () => {
        it('I scroll to the top of the page', () => {
            expect(
                'I scroll to the top of the page'
                .match(REGEX.SCROLL)[1]
            ).toBe('top');
        });

        it('I scroll to the bottom of the page', () => {
            expect(
                'I scroll to the bottom of the page'
                .match(REGEX.SCROLL)[1]
            ).toBe('bottom')
        });

        it('I scroll to the side of the page', () => {
            expect(
                'I scroll to the side of the page'
                .match(REGEX.SCROLL)
            ).toBeNull()
        });
    });

    describe('CLICK', () => {
        it('I click on the "Save Button', () => {
            expect(
                'I click on the "Save Button"'
                .match(REGEX.CLICK)[1]
            ).toBe('Save Button')
        });

        it('I click on a "Button"', () => {
            expect(
                'I click on a "Button"'
                .match(REGEX.CLICK)[1]
            ).toBe('Button')
        });

        it('I click on a "Button" inside a "Modal"', () => {
            const m = 'I click on a "Button" inside a "Modal"'
                .match(REGEX.CLICK);
            
            expect(m[1]).toBe('Button');
            expect(m[2]).toBe('Modal');
        });

        it('I click on a "Button" inside a "Modal" contaning "Text"', () => {
            const m = 'I click on a "Button" inside a "Modal" containing "Text"'
                .match(REGEX.CLICK);
            
            expect(m[1]).toBe('Button');
            expect(m[2]).toBe('Modal');
            expect(m[3]).toBe('Text');
        });
    });

    describe('TYPE', () => {
        it('I type "toli" into the "Username Input"', () => {
            const m ='I type "toli" into the "Username Input"'
                .match(REGEX.TYPE);
            
            expect(m[1]).toBe('toli');
            expect(m[2]).toBe('Username Input');
        });

        it('I type "toli" in the "Username Input', () => {
            const m ='I type "toli" in the "Username Input"'
                .match(REGEX.TYPE);
            
            expect(m[1]).toBe('toli');
            expect(m[2]).toBe('Username Input');
        });

        it('I type "toli" in the "Username Input" inside the "Signup Modal"', () => {
            const m = 'I type "toli" in the "Username Input" inside the "Signup Modal"'
                .match(REGEX.TYPE);
            
            expect(m[1]).toBe('toli');
            expect(m[2]).toBe('Username Input');
            expect(m[3]).toBe('Signup Modal');
        });

        it('I type "toli" in the "Username Input" inside the "Signup Modal" containing "randy"', () => {
            const m = 'I type "toli" in the "Username Input" inside the "Signup Modal" containing "randy"'
                .match(REGEX.TYPE);
            
            expect(m[1]).toBe('toli');
            expect(m[2]).toBe('Username Input');
            expect(m[3]).toBe('Signup Modal');
            expect(m[4]).toBe('randy');
        });
    });

    describe('REPLACE', () => {
        it('I replace the contents of the "Username Input" with "toli"', () => {
            const m ='I replace the contents of the "Username Input" with "toli"'
                .match(REGEX.REPLACE);
            
            expect(m[1]).toBe('Username Input');
            expect(m[4]).toBe('toli');
        });

        it('I replace the contents of "Username Input" with "toli"', () => {
            const m ='I replace the contents of "Username Input" with "toli"'
                .match(REGEX.REPLACE);
            
            expect(m[1]).toBe('Username Input');
            expect(m[4]).toBe('toli');
        });

        it('I replace the contents of the "Username Input" inside the "Signup Modal" with "toli"', () => {
            const m ='I replace the contents of the "Username Input" inside the "Signup Modal" with "toli"'
                .match(REGEX.REPLACE);
            
            expect(m[1]).toBe('Username Input');
            expect(m[2]).toBe('Signup Modal');
            expect(m[4]).toBe('toli');
        });

        it('I replace the contents of the "Username Input" inside the "Signup Modal" containing "randy" with "toli"', () => {
            const m ='I replace the contents of the "Username Input" inside the "Signup Modal" containing "randy" with "toli"'
                .match(REGEX.REPLACE);
            
            expect(m[1]).toBe('Username Input');
            expect(m[2]).toBe('Signup Modal');
            expect(m[3]).toBe('randy');
            expect(m[4]).toBe('toli');
        });
    });

    describe('OPEN', () => {
        it('I open the "Signup Page"', () => {
            const m = 'I open the "Signup Page"'
                .match(REGEX.OPEN);
            
            expect(m[1]).toBe('Signup Page');
        });

        it('I open "Home"', () => {
            const m = 'I open "Home"'
                .match(REGEX.OPEN);
            
            expect(m[1]).toBe('Home');
        });

        it('I open "Home" page', () => {
            const m = 'I open "Home" page'
                .match(REGEX.OPEN);
            
            expect(m[1]).toBe('Home');
        });
    });

    describe('WAIT_FOR_RESULTS', () => {
        it('I wait for results to load', () => {
            const m = 'I wait for results to load'
                .match(REGEX.WAIT_FOR_RESULTS);
            
            expect(m[0]).toBeTruthy();
        });

        it('I wait for results to load and stuff', () => {
            const m = 'I wait for results to load and stuff'
                .match(REGEX.WAIT_FOR_RESULTS);
            
            expect(m).toBeNull();
        });
    });

    describe('WAIT_SECONDS', () => {
        it('I wait 10 seconds', () => {
            const m = 'I wait 10 seconds'
                .match(REGEX.WAIT_SECONDS);
            
            expect(m[1]).toBe('10');
        });

        it('I wait ten seconds', () => {
            const m = 'I wait ten seconds'
                .match(REGEX.WAIT_SECONDS);
            
            expect(m).toBeNull();
        });
    });

    describe('DRAG_ABOVE', () => {
        it('I drag the "Button" above the "Trash Can"', () => {
            const m = 'I drag the "Button" above the "Trash Can"'
                .match(REGEX.DRAG_ABOVE);
            
            expect(m[1]).toBe('Button');
            expect(m[4]).toBe('Trash Can');
        });

        it('I drag the "Button" inside the "Modal" above the "Trash Can"', () => {
            const m = 'I drag the "Button" inside the "Modal" above the "Trash Can"'
                .match(REGEX.DRAG_ABOVE);
            
            expect(m[1]).toBe('Button');
            expect(m[2]).toBe('Modal');
            expect(m[4]).toBe('Trash Can');
        });

        it('I drag the "Button" inside the "Modal" above the "Trash Can" inside the "Sidebar" containting "Trash Cans"', () => {
            const m = 'I drag the "Button" inside the "Modal" above the "Trash Can" inside the "Sidebar" containing "Trash Cans"'
                .match(REGEX.DRAG_ABOVE);
            
            expect(m[1]).toBe('Button');
            expect(m[2]).toBe('Modal');
            expect(m[3]).toBeUndefined();
            expect(m[4]).toBe('Trash Can');
            expect(m[5]).toBe('Sidebar');
            expect(m[6]).toBe('Trash Cans');
        });
    });

    describe('TAKE_SNAPSHOT', () => {
        it('I take a snapshot named "Home Page"', () => {
            const m = 'I take a snapshot named "Home Page"'
                .match(REGEX.TAKE_SNAPSHOT);
            
            expect(m[1]).toBe('Home Page');
        });
    });

    describe('TAKE_EL_SNAPSHOT', () => {
        it('I take a snapshot of the "Modal"', () => {
            const m = 'I take a snapshot of the "Modal"'
                .match(REGEX.TAKE_EL_SNAPSHOT);
            
            expect(m[1]).toBe('Modal');
        });
    });

    describe('ON_PAGE', () => {
        it('I should be on the "Front Page"', () => {
            const m = 'I should be on the "Front Page"'
                .match(REGEX.ON_PAGE);
            
            expect(m[1]).toBe('Front Page');
        });
    });

    describe('REDIRECTED_TO', () => {
        it('I should be redirected to the "Front Page"', () => {
            const m = 'I should be redirected to the "Front Page"'
                .match(REGEX.REDIRECTED_TO);
            
            expect(m[1]).toBe('Front Page');
        });
    });

    describe('N_ELEMENTS', () => {
        it('I should see 3 "Buttons"', () => {
            const m = 'I should see 3 "Buttons"'
                .match(REGEX.N_ELEMENTS);
            
            expect(m[1]).toBe('3');
            expect(m[2]).toBe('Buttons');
        });

        it('I should see 3 "Buttons" containing "Submit"', () => {
            const m = 'I should see 3 "Buttons" containing "Submit"'
                .match(REGEX.N_ELEMENTS);
            
            expect(m[1]).toBe('3');
            expect(m[2]).toBe('Buttons');
            expect(m[4]).toBe('Submit');
        });
    });

    describe('TEXT_ON_EL', () => {
        it('I should see "Hello World" on the "Submit Button"', () => {
            const m = 'I should see "Hello World" on the "Submit Button"'
                .match(REGEX.TEXT_ON_EL);
            
            expect(m[1]).toBe('Hello World');
            expect(m[2]).toBe('Submit Button');
        });
    });

    describe('EL_EXISTS', () => {
        it('I should see a "Submit Button"', () => {
            const m = 'I should see a "Submit Button"'
                .match(REGEX.EL_EXISTS);
            
            expect(m[1]).toBe('Submit Button')
        });

        it('I should see a "Submit Button" in the "Footer"', () => {
            const m = 'I should see a "Submit Button" in the "Footer"'
                .match(REGEX.EL_EXISTS);
            
            expect(m[1]).toBe('Submit Button')
            expect(m[2]).toBe('Footer')
        });


        it('I should see a "Submit Button" in the "Footer" containing "Submit"', () => {
            const m = 'I should see a "Submit Button" in the "Footer" containing "Submit"'
                .match(REGEX.EL_EXISTS);
            
            expect(m[1]).toBe('Submit Button')
            expect(m[2]).toBe('Footer')
            expect(m[3]).toBe('Submit')
        });
    });

    describe('EL_DOES_NOT_EXIST', () => {
        it('I should not see a "Submit Button"', () => {
            const m = 'I should not see a "Submit Button"'
                .match(REGEX.EL_DOES_NOT_EXIST);
            
            expect(m[1]).toBe('Submit Button')
        });

        it('I should not see a "Submit Button" in the "Footer"', () => {
            const m = 'I should not see a "Submit Button" in the "Footer"'
                .match(REGEX.EL_DOES_NOT_EXIST);
            
            expect(m[1]).toBe('Submit Button')
            expect(m[2]).toBe('Footer')
        });


        it('I should not see a "Submit Button" in the "Footer" containing "Submit"', () => {
            const m = 'I should not see a "Submit Button" in the "Footer" containing "Submit"'
                .match(REGEX.EL_DOES_NOT_EXIST);
            
            expect(m[1]).toBe('Submit Button')
            expect(m[2]).toBe('Footer')
            expect(m[3]).toBe('Submit')
        });
    });

    describe('EL_CONTAINS_TEXT', () => {
        it('The "Submit Button" should contain "hello"', () => {
            const m = 'The "Submit Button" should contain "hello"'
                .match(REGEX.EL_CONTAINS_TEXT);
            
            expect(m[1]).toBe('Submit Button')
            expect(m[4]).toBe('hello')
        });

        it('"Username" should be "toli"', () => {
            const m = '"Username" should be "toli"'
                .match(REGEX.EL_CONTAINS_TEXT);
            
            expect(m[1]).toBe('Username')
            expect(m[4]).toBe('toli')
        });

        it('The "Submit Button" in the "Footer" should contain "Submit"', () => {
            const m = 'The "Submit Button" in the "Footer" should contain "Submit"'
                .match(REGEX.EL_CONTAINS_TEXT);
            
            expect(m[1]).toBe('Submit Button')
            expect(m[2]).toBe('Footer')
            expect(m[4]).toBe('Submit');
        });
    });

    describe('EL_VALUE', () => {
        it('The "Submit Button\'s" value should be "hello"', () => {
            const m = 'The "Submit Button\'s" value should be "hello"'
                .match(REGEX.EL_VALUE);
            
            expect(m[1]).toBe('Submit Button\'s');
            expect(m[4]).toBe('hello');
        });

        it('"Username\'s" value should be "toli"', () => {
            const m = '"Username\'s" value should be "toli"'
                .match(REGEX.EL_VALUE);
            
            expect(m[1]).toBe('Username\'s');
            expect(m[4]).toBe('toli');
        });

        it('"Username" in the "Footer\'s" value should be "toli"', () => {
            const m = '"Username" in the "Footer\'s" value should be "toli"'
                .match(REGEX.EL_VALUE);
            
            expect(m[1]).toBe('Username');
            expect(m[2]).toBe('Footer\'s');
            expect(m[4]).toBe('toli');
        });
    });

    describe('EL_BACKBGROUND', () => {
        it('I should see a "#ffffff" background on the "Button"', () => {
            const m = 'I should see a "#ffffff" background on the "Button"'
                .match(REGEX.EL_BACKBGROUND);
            
            expect(m[1]).toBe('#ffffff');
            expect(m[2]).toBe('Button');
        });

        it('I should see a "#ffffff" background on the "Button" in the "Modal"', () => {
            const m = 'I should see a "#ffffff" background on the "Button" in the "Modal"'
                .match(REGEX.EL_BACKBGROUND);
            
            expect(m[1]).toBe('#ffffff');
            expect(m[2]).toBe('Button');
            expect(m[3]).toBe('Modal');
        });
    });

    describe('EL_BORDER', () => {
        it('I should see a "#ffffff" border on the "Button"', () => {
            const m = 'I should see a "#ffffff" border on the "Button"'
                .match(REGEX.EL_BORDER);
            
            expect(m[1]).toBe('#ffffff');
            expect(m[2]).toBe('Button');
        });

        it('I should see a "#ffffff" border on the "Button" in the "Modal"', () => {
            const m = 'I should see a "#ffffff" border on the "Button" in the "Modal"'
                .match(REGEX.EL_BORDER);
            
            expect(m[1]).toBe('#ffffff');
            expect(m[2]).toBe('Button');
            expect(m[3]).toBe('Modal');
        });
    });
});