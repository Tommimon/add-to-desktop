#!/bin/bash

# Path to the JSON file
json_file="metadata.json"

# Check if file exists
if [[ ! -f "$json_file" ]]; then
    echo "Error: $json_file not found"
    exit 1
fi

# Extract the current version and last shell-version
current_version=$(jq '.version' "$json_file")
last_shell_version=$(jq '.["shell-version"][-1]' "$json_file" | tr -d '"')
echo "Current version: $current_version"
echo "Last shell-version: $last_shell_version"

# Calculate new values
new_version=$((current_version + 1))
new_shell_version=$((last_shell_version + 1))

# Update the JSON file using jq
jq ".version = $new_version | .[\"shell-version\"] += [\"$new_shell_version\"]" "$json_file" > "${json_file}.tmp" && mv "${json_file}.tmp" "$json_file"

echo "Updated $json_file:"
echo "  Version: $current_version → $new_version"
echo "  Shell-version: added $new_shell_version"
