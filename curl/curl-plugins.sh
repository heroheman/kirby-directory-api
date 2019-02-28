#! /bin/bash

totalcount=$(curl -s https://api.github.com/search/issues?q=is:open+repo:texnixe/kirby-plugins | jq -r '.total_count')
jsonpath='../json'
tmppath='./tmp'
echo $totalcount
iteration=$((totalcount/100+1))

for (( counter=1; counter<=$iteration; counter+=1 )); do
    curl -vs "https://api.github.com/search/issues?q=is:open+repo:texnixe/kirby-plugins&sort=updated&order=desc&per_page=100&page=$counter"| jq -r '.items' > $tmppath/plugins-$counter.json
done

rm $jsonpath/plugins.json
touch $jsonpath/plugins.json

jq -s '[.[][]]' $tmppath/plugins-*.json > $itempath/plugins.json

echo $iteration
jq length $itempath/plugins.json

rm $tmppath/plugins-*
