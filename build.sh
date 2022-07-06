#!/bin/bash

# compile language
mkdir locale
for f in po/*; do
    name=${f:3:${#f}-6};
    mkdir locale/"$name";
    mkdir locale/"$name"/LC_MESSAGES;
    msgfmt "$f" --output-file=locale/"$name"/LC_MESSAGES/add-to-desktop.mo;
done

# find version
while read line
do
    if echo "$line" | grep -q '"version":'
    then
        version=${line:11:${#line}-11};
    fi
done < metadata.json

# create .zip
mkdir output
zip output/add-to-desktop@tommimon.github.com.v"${version}".shell-extension.zip ./*.js README.md LICENSE metadata.json -r locale
