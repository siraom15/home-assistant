export HA_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhMmRkMzFkYTNkY2Q0NGY3OWM2NTdhZjY0Njg2ZmFkYyIsImlhdCI6MTc4NzE5NjEyMCwiZXhwIjoyMTAyNTU2MTIwfQ.KL38Ta9XOld_QNneTlnU5ONjDIUuV3ANyzp8gJXIhlI

curl \
  -H "Authorization: Bearer $HA_TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/

curl \
  -H "Authorization: Bearer $HA_TOKEN" \
  http://localhost:8123/api/states