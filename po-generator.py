import datetime
import re

import requests

n = input("Insert issue number: ")
n = str(int(n))  # crash if not a number
url = 'https://github.com/Tommimon/add-to-desktop/issues/' + n
regex = r'<td class="d-block comment-body markdown-body  js-comment-body">[\s\S]*?<\/td>'

page = requests.get(url).text
block = re.findall(regex, page)[0]
fields = ['Language name',
          'Language code',
          'Plural Forms (optional)',
          'Translator username',
          'Translator email',
          'Add to Desktop']


def retrive_value(field_name):
    pattern = field_name + r':.*<[^a]'
    matches = re.findall(pattern, block)
    if len(matches) == 0:
        return ''
    return matches[0].split(field_name + ':')[1].removesuffix('</').removesuffix('<b').strip()


form = dict()
for i in fields:
    form[i] = retrive_value(i)
if form['Plural Forms (optional)'] == '':
    form['Plural Forms (optional)'] = 'nplurals=2; plural=(n > 1);'
if form['Translator email'] != '':
    form['Translator email'] = form['Translator email'].split('>')[1].removesuffix('</a').strip()
form['year'] = str(datetime.datetime.now().year)
form['datetime'] = str(datetime.datetime.now(datetime.timezone.utc)).split('.')[0][:-3] + '+0000'

text = '''# LANGUAGE NAME translations for add-to-desktop package.
# Copyright (C) 2020-YEAR the add-to-desktop's copyright holder
# This file is distributed under the same license as the add-to-desktop package.
# TRANSLATOR USERNAME <TRANSLATOR EMAIL>, YEAR.
#
msgid ""
msgstr ""
"Project-Id-Version: add-to-desktop@tommimon.github.com\\n"
"Report-Msgid-Bugs-To: https://github.com/Tommimon/add-to-desktop\\n"
"POT-Creation-Date: DATETIME\\n"
"PO-Revision-Date: DATETIME\\n"
"Last-Translator: TRANSLATOR USERNAME <TRANSLATOR EMAIL>\\n"
"Language-Team: LANGUAGE NAME\\n"
"Language: LANGUAGE CODE\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: PLURAL FORMS (OPTIONAL)\\n"

#: shortcutMaker.js:50
msgid "Add to Desktop"
msgstr "ADD TO DESKTOP"

'''

for k, e in form.items():
    text = text.replace(k.upper(), e)

with open('po/' + form['Language code'] + '.po', 'w') as file:
    file.write(text)
