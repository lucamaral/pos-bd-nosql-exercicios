const redis = require("redis")
const client = redis.createClient()

client.flushdb() //limpar cache
client.on("error", (error) => console.error(error))

const countUsers = 50
const _1_to_99_key = "_1_to_99"
const _1_to_99 = [_1_to_99_key]
for (let index = 1; index <= 99; index++) {
    _1_to_99.push(index)
}

client.sadd(_1_to_99_key, _1_to_99)

for (let index = 1; index <= countUsers; index++) {
    const userKey = `user:${index}`
    client.hmset(userKey, 'name', `user${index}`)
    client.hmset(userKey, 'bcartela', `cartela:${index}`)
    client.hmset(userKey, 'bscore', `score:${index}`)
    client.hgetall(userKey)
    client.srandmember(_1_to_99_key, (err, results) => {
        client.sadd(`cartela:${index}`, results)
    })
    client.get(`cartela:${index}`, redis.print)
}