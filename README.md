unmarried-taxes
===============

My fiance and I aren't married, which means we have some flexibility in who claims what for deductions.  Figuring out what to do is hard, though, so I wrote this tool to help me experiment with different approaches - it allows you to slide various deductions to one person or the other, and recalculates the taxes owed based on those choices.

To run
======

```
git submodule update --init --remote
```

Then open the unmarried-taxes.html page and mess with stuff.

Annual Updates
==============

- Google for any notable tax changes YOY
- Update Taxes.js
-- update the ranges for federalBrackets
-- update standardDeduction
-- update amtHighRateStart
-- update amtExemption
-- update amtPhaseOutStart
-- update socialSecurityCap
-- update longTermCapitalGains levels (assuming I fix this code)
- copy settings.js to settings-override.js
-- Add in relevant w2 info