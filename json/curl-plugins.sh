#! /bin/bash

tmppath='./tmp'
totalcount=$(curl -s https://api.github.com/search/issues?q=is:open+repo:texnixe/kirby-plugins | jq -r '.total_count')
echo $totalcount
iteration=$((totalcount/100+1))

for (( counter=1; counter<=$iteration; counter+=1 )); do
    curl -vs "https://api.github.com/search/issues?q=is:open+repo:texnixe/kirby-plugins&sort=updated&order=desc&per_page=100&page=$counter" \
        | jq -r '.items[] | [{ item_type: "plugin", title: .title, number: .number, id: .id, html_url: .html_url, labels: .labels, body: .body, created_at: .created_at, updated_at: .updated_at }]' > $tmppath/plugins-$counter.json
done

rm plugins.json
touch plugins.json

jq -s '[.[][]]' $tmppath/plugins-*.json > plugins.json

echo $iteration
jq length plugins.json

rm $tmppath/plugins-*
