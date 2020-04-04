const redis = require("redis")
const client = redis.createClient()

client.flushdb() //limpar cache
client.on("error", (error) => console.error(error))

const countUsers = 50
const _1_to_99_key = "_1_to_99"
for (let index = 1; index <= 99; index++) {
    client.sadd(_1_to_99_key, index)
}

client.smembers(_1_to_99_key, redis.print)

for (let index = 1; index <= countUsers; index++) {
    const userKey = `user:${index}`
    const cartelaKey = `cartela:${index}`
    client.hmset(userKey, 'name', `user${index}`)
    client.hmset(userKey, 'bcartela', cartelaKey)
    client.hmset(userKey, 'bscore', `score:${index}`)
    client.hgetall(userKey)
    client.srandmember(_1_to_99_key, 15, (err, results) => {
        for (let index = 0; index < results.length; index++) {
            client.sadd(cartelaKey, results[index])
        }
        client.smembers(cartelaKey, redis.print)
    })
}