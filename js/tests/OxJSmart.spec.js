testOxJSmart(
    require('../src/OxJSmart')
);

function testOxJSmart(OxJSmart) {
    "use strict"

    describe('Smarty', function () {
        it('processes block oxhasrights', function () {
            var tpl = 'One [{oxhasrights ident="test"}]Two [{/oxhasrights}]Three'

            var t = OxJSmart.create(tpl)
            expect(t.fetch()).toBe('One Two Three')
        })

        it('processes oxmultilang', function () {
            var tpl = 'Hello [{oxmultilang ident="FOO" args=\'big\'}] World!'

            OxJSmart.setLanguageKeys({
                FOO: "whole %s"
            })

            var t = OxJSmart.create(tpl)
            expect(t.fetch()).toBe('Hello whole big World!')
        })

        it('processes oxmultilang with args array', function () {
            var tpl = 'Hello [{oxmultilang ident="FOO" args="$mlArgs"}] World!'

            OxJSmart.setLanguageKeys({
                FOO: "whole %s %s"
            })

            var t = OxJSmart.create(tpl)
            expect(t.fetch({mlArgs: ['big', 'colorful']})).toBe('Hello whole big colorful World!')
        })

        it('processes oxformattime', function () {
            var tpl = '[{52156|oxformattime}]'

            var t = OxJSmart.create(tpl)
            expect(t.fetch()).toBe('14:29:16')
        })

        it('processes oxprice', function () {
            var tpl = '[{oxprice price="895" currency=$currency}]'

            var t = OxJSmart.create(tpl)
            expect(t.fetch({currency: {sign: '€'}})).toBe('8,95 €')
        })

        it('processes oxgetseourl', function () {
            var tpl = 'what [{oxgetseourl ident="matters" type="no_care"}]?'

            var t = OxJSmart.create(tpl)
            expect(t.fetch()).toBe('what matters?')
        })
    });
}
