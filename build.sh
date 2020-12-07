# compile language
mkdir locale
for f in po/*; do
  name=${f:3:${#str}-3};
  mkdir locale/"$name";
  mkdir locale/"$name"/LC_MESSAGES;
  msgfmt "$f" --output-file=locale/"$name"/LC_MESSAGES/add-to-desktop.mo;
done
