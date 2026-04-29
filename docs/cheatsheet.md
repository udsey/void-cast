Run both client and server
```
npm run dev:all
```
Run server only
```
npm run dev:server
```
Run client only
```
npm run dev:client
```

---

Generate migration files from your schema
```
db:generate
```
Apply migrations to Postgres
```
npm run db:migrate
```
Force DB reset
```
db:push
```
---

Start container with db in detach mode
```
docker compose up -d
```
Stop container and delete volumes
```
docker compose down -v
```

Access DB inside container
```
docker exec -it void_cast_db psql -U void_cast -d void_cast
```
Check container logs
```
docker logs void_cast_db
```