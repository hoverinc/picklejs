(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['../regexBuilder'], factory);
    } else if (typeof exports !== "undefined") {
        factory(require('../regexBuilder'));
    } else {
        var mod = {
            exports: {}
        };
        factory(global.regexBuilder);
        global.regexBuilderSpec = mod.exports;
    }
})(this, function (_regexBuilder) {
    'use strict';

    describe('RegexBuilder', () => {
        describe('r', () => {
            it('creates a regex that matches from start to finish', () => {
                const hello = (0, _regexBuilder.r)('hello');

                expect('hello'.match(hello)[0]).toBe('hello');
            });

            it('won\'t match if there is extra characters at the start or end', () => {
                const hello = (0, _regexBuilder.r)('hello');

                expect('1hello1'.match(hello)).toBeFalsy();
            });
        });

        describe('or', () => {
            it('matches against a required list', () => {
                const list = (0, _regexBuilder.or)(['toli', 'randy', 'axel'], { required: true });

                expect('I am toli'.match(list)[0]).toBe('toli');
            });

            it('doesn\'t match against a required list if the subject is not present', () => {
                const list = (0, _regexBuilder.or)(['toli', 'randy', 'axel'], { required: true });

                expect('I am Groot'.match(list)).toBeNull();
            });

            it('matches if the list is not required', () => {
                const list = (0, _regexBuilder.or)(['toli', 'randy', 'axel']);

                expect('I am Groot'.match(list)[0]).toBe('');
            });

            it('captures the item if capturing is enabled', () => {
                const list = (0, _regexBuilder.or)(['toli', 'randy', 'axel'], { capture: true, required: true });

                expect('I am toli'.match(list)[1]).toBe('toli');
            });
        });

        describe('string', () => {
            it('matches a string in quotes', () => {
                expect('I am "Groot"'.match(_regexBuilder.string)[1]).toBe('Groot');
            });

            it('does not match a string without quotes', () => {
                expect('I am Groot'.match(_regexBuilder.string)).toBeNull();
            });
        });

        describe('int', () => {
            it('matches an int', () => {
                expect('I am #1'.match(_regexBuilder.int)[1]).toBe('1');
            });

            it('does not match a string without quotes', () => {
                expect('I am # one'.match(_regexBuilder.int)).toBeNull();
            });
        });

        describe('elInEl', () => {
            it('matches basic element', () => {
                expect('I should see an "Element"'.match(_regexBuilder.elInEl)[1]).toBe('Element');
            });

            it('matches element with no space in the front', () => {
                expect('"Username" should be red'.match(_regexBuilder.elInEl)[1]).toBe('Username');
            });

            it('matches an element with a parent', () => {
                const m = 'I should see a "Button" in the "Modal"'.match(_regexBuilder.elInEl);
                expect(m[1]).toBe('Button');
                expect(m[2]).toBe('Modal');
            });

            it('matches an element with text', () => {
                const m = 'I should see a "Button" in the "Modal" containing "Submit"'.match(_regexBuilder.elInEl);
                expect(m[1]).toBe('Button');
                expect(m[2]).toBe('Modal');
                expect(m[3]).toBe('Submit');
            });

            it('works with other verbs', () => {
                const m = 'I should see a "Button" on the "Modal" containing "Submit"'.match(_regexBuilder.elInEl);
                expect(m[1]).toBe('Button');
                expect(m[2]).toBe('Modal');
                expect(m[3]).toBe('Submit');
            });
        });

        describe('page', () => {
            it('should match a page', () => {
                const m = 'I should be on "Home"'.match(_regexBuilder.page);
                expect(m[1]).toBe('Home');
            });

            it('should match a page with a suffix', () => {
                const m = 'I should be on "Home" Page'.match(_regexBuilder.page);
                expect(m[1]).toBe('Home');
            });

            it('should match a page with the in front', () => {
                const m = 'I should be on the "Home" Page'.match(_regexBuilder.page);
                expect(m[1]).toBe('Home');
            });
        });
    });
});
//# sourceMappingURL=regexBuilder.spec.js.map