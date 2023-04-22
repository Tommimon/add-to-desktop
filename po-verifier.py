import re
import os

REGEX = r'''^# [A-Z][A-Za-z ]+ translations for add-to-desktop package\.
# Copyright \(C\) 2020-20[0-9][0-9] the add-to-desktop's copyright holder
# This file is distributed under the same license as the add-to-desktop package\.
# [^\#\"\:\n]+ <\S+@\S+\.\S+>, 20[0-9][0-9]\.
#
msgid ""\n*
msgstr ""\n*
"Project-Id-Version: add-to-desktop@tommimon\.github\.com\\n"\n*
"Report-Msgid-Bugs-To: https:\/\/github\.com\/Tommimon\/add-to-desktop\\n"\n*
"POT-Creation-Date: 20[0-9][0-9]-[01][0-9]-[0-3][0-9] [012][0-9]:[0-5][0-9][\+\-][01][0-9][0-5][0-9]\\n"\n*
"PO-Revision-Date: 20[0-9][0-9]-[01][0-9]-[0-3][0-9] [012][0-9]:[0-5][0-9][\+\-][01][0-9][0-5][0-9]\\n"\n*
"Last-Translator: [^\#\"\:\n]+ <\S+@\S+\.\S+>\\n"\n*
"Language-Team: [A-Z][A-Za-z ]+\\n"\n*
"Language: [a-z][a-z]\\n"\n*
"MIME-Version: [\.0-9]+\\n"\n*
"Content-Type: text\/plain; charset=UTF-8\\n"\n*
"Content-Transfer-Encoding: 8bit\\n"\n*
"Plural-Forms: [^\#\"\:\n]+\\n"\n*(\"[^ \#\"\:\n]+\: [^\#\"\:\n]+\\n\"\n)*\n*
#: shortcutMaker\.js:49
msgid "Add to Desktop"
msgstr "[^\#\"\:\n]+"\n*$'''

exit_code = 0

for filename in os.listdir('po/'):
    with open('po/' + filename) as file:
        text = file.read()
        if not re.match(REGEX, text):
            print("Sintax error in", filename)
            exit_code = 1

if exit_code == 0:
    print("All syntax checks passed!")

exit(exit_code)
