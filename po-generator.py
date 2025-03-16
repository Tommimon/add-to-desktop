import datetime
import re
import requests
import html
import unicodedata

n = input("Insert issue number: ")
n = str(int(n))  # crash if not a number
url = 'https://github.com/Tommimon/add-to-desktop/issues/' + n
regex = r'<div class="Box-sc-g0xbh4-0 markdown-body NewMarkdownViewer-module__safe-html-box--cRsz0">[\s\S]*?<\/div>'

page = requests.get(url).text
block = re.findall(regex, page)[0]
fields = ['Language Name',
          'Language Code',
          'Plural Forms',
          'Username',
          'Email',
          'Add to Desktop']

def remove_non_printable_chars(s):
    return ''.join(c for c in s if unicodedata.category(c)[0] != 'C')

def retrive_value(field_name):
    pattern = r'<h3 dir="auto">' + field_name + r'<\/h3>\n<p dir="auto">(?:[^\/](?:\/[ae])*)+<\/p>'
    matches = re.findall(pattern, block)
    if len(matches) == 0:
        return ''
    return remove_non_printable_chars(html.unescape(matches[0].split('<p dir="auto">')[1].removesuffix('</p>').strip()))


form = dict()
for i in fields:
    form[i] = retrive_value(i)
if "No response" in form['Plural Forms']:
    form['Plural Forms'] = 'nplurals=2; plural=(n > 1);'
if form['Email'] != '':
    form['Email'] = form['Email'].split('>')[1].removesuffix('</a').strip()
form['year'] = str(datetime.datetime.now().year)
form['datetime'] = str(datetime.datetime.now(datetime.timezone.utc)).split('.')[0][:-3] + '+0000'

text = '''# LANGUAGE NAME translations for add-to-desktop package.
# Copyright (C) 2020-YEAR the add-to-desktop's copyright holder
# This file is distributed under the same license as the add-to-desktop package.
# USERNAME <EMAIL>, YEAR.
#
msgid ""
msgstr ""
"Project-Id-Version: add-to-desktop@tommimon.github.com\\n"
"Report-Msgid-Bugs-To: https://github.com/Tommimon/add-to-desktop\\n"
"POT-Creation-Date: DATETIME\\n"
"PO-Revision-Date: DATETIME\\n"
"Last-Translator: USERNAME <EMAIL>\\n"
"Language-Team: LANGUAGE NAME\\n"
"Language: LANGUAGE CODE\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: PLURAL FORMS\\n"

#: shortcutMaker.js:49
msgid "Add to Desktop"
msgstr "ADD TO DESKTOP"
'''

for k, e in form.items():
    text = text.replace(k.upper(), e)

with open('po/' + form['Language Code'] + '.po', 'w') as file:
    file.write(text)
