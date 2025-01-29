while true; do
  cat ./stats/d500-6.json | jq -c "." 2> /dev/null | jplot rss heapTotal heapUsed 2> /dev/null;
  sleep 5;
done
