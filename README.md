# 10Question-form-XPath

This is a second version of the _10-Question-form_ repository where XML is now accessed through XPath.

It also contains improved JS to enable new functions to check that all questions have been answered (whether correct or incorrectly).

Automatic correction triggers an XML transformation to show the table with options and answers.

Among the **options**, the correct ones are identified

Among the  given **answers** the correct ones are also flagged

JS provides a final score for the test

**HTML**
there are two pages: _intro_ (with brief instructions) and _examen_

**CSS**
I have separated CSS files for each page and each page has desktop and mobile version. Additionally, the XSL file used for transformation has also desktop and mobile CSS versions

**IMG**
There are a few images used in this project

**XML**
There is a 10 question, 2 x 5-type form with corresponding data

**JS**
the examen form has a comprehensive JS script which takes care of the dynamics of the page, includes a countdown timer and a final score. It also informs if each question has been _correctly_ answered or _wrongly_, in which case it offers the correct solution, but now all this correcting procedure spits it out to a transformed XML

JS enforces answering each question, provided that we are within the time limit

If time runs out, auto-correction is triggered no matter how many questions are or are not answered.

See the **doc**umentation folder for a detailed list of all micro-tasks included in this project.
_Master_ branch is minified while _Indented_ branch is indented. Both branches are checked and validated
