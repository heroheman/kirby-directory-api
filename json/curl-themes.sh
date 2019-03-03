#! /bin/bash

tmppath='./tmp'
totalcount=$(curl -s https://api.github.com/search/issues?q=is:open+repo:wachilt/kirby-themes | jq -r '.total_count')
echo $totalcount
iteration=$((totalcount/100+1))

for (( counter=1; counter<=$iteration; counter+=1 )); do
    curl -vs "https://api.github.com/search/issues?q=is:open+repo:wachilt/kirby-themes&sort=updated&order=desc&per_page=100&page=$counter" \
        | jq -r '.items[] | [{ item_type: "theme", title: .title, number: .number, id: .id, html_url: .html_url, labels: .labels, body: .body, created_at: .created_at, updated_at: .updated_at }]' > $tmppath/themes-$counter.json
done

rm themes.json
touch themes.json

jq -s '[.[][]]' $tmppath/themes-*.json > themes.json

jq length themes.json

rm $tmppath/themes-*
