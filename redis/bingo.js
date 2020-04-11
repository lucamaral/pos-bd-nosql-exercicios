const redis = require("redis")
const client = redis.createClient()
const subscriber = redis.createClient();
const publisher = redis.createClient();

client.flushdb() //limpar cache
client.on("error", (erro) => { throw erro })

const QTD_USUARIOS = 50
const NUMEROS_1_99_KEY = "NUMEROS_1_99_KEY"
const RODADAS_KEY = "RODADAS_KEY"
const RODADAS_ORDENADAS_KEY = "RODADAS_ORDENADAS_KEY"
const TAMANHO_CARTELA = 15
const BINGO = "BINGO"

console.log(":::::::::::::BINGO:::::::::::::")
subscribeVencedor()
prepararBingo()
nova_rodada()

function subscribeVencedor() {
    subscriber.on("message", (channel, userId) => {
        let resultado = {}
        const userKey = `user:${userId}`
        client.hgetall(userKey, (erro, user) => {
            if (erro) throw erro
            client.smembers(user.bcartela, (erro, cartela) => {
                if (erro) throw erro
                client.lrange(RODADAS_ORDENADAS_KEY, 0, -1, (erro, rodadas) => {
                    if (erro) throw erro
                    console.log("::: BINGO :::")
                    console.log(`Usuário : ${user.name} | Cartela : (${cartela}) | Números Sorteados : (${rodadas})`)
                    subscriber.quit()
                    publisher.quit()
                    client.quit()
                })
            })
        })
    })
    subscriber.subscribe(BINGO)
}

function prepararBingo() {
    for (let index = 1; index <= 99; index++) {
        client.sadd(NUMEROS_1_99_KEY, index)
    }
    for (let index = 1; index <= QTD_USUARIOS; index++) {
        const userKey = `user:${index}`
        const cartelaKey = `cartela:${index}`
        client.hmset(userKey, 'name', `user${index}`)
        client.hmset(userKey, 'bcartela', cartelaKey)
        client.hmset(userKey, 'bscore', `score:${index}`)

        client.srandmember(NUMEROS_1_99_KEY, TAMANHO_CARTELA, (erro, cartela) => {
            if (erro) throw erro
            client.sadd(cartelaKey, cartela)
            console.log(`Usuário ${index} | Cartela : (${cartela})`)
        })
    }
}

function nova_rodada() {
    client.srandmember(NUMEROS_1_99_KEY, (erro, numero) => {
        if (erro) throw erro
        client.sismember(RODADAS_KEY, numero, (erro, rodadaRepetida) => {
            if (erro) throw erro
            if (rodadaRepetida) {
                nova_rodada()
            } else {
                console.log(`:: NOVA RODADA ::`)
                console.log(`- Número ${numero}`)
                client.sadd(RODADAS_KEY, numero)
                client.lpush(RODADAS_ORDENADAS_KEY, numero)
                let userIdx = 1
                verificar_cartela(userIdx, numero)
            }
        })
    })
}

function verificar_cartela(userIdx, numero) {
    if (userIdx > QTD_USUARIOS) {
        nova_rodada()
    } else {
        client.sismember(`cartela:${userIdx}`, numero, (erro, contemNaCartela) => {
            if (erro) throw erro
            if (contemNaCartela) {
                client.sadd(`score:${userIdx}`, numero, (erro) => {
                    if (erro) throw erro
                    client.scard(`score:${userIdx}`, (err, score) => {
                        if (erro) throw erro
                        console.log(`Usuário ${userIdx} | Score ${score}`)
                        if (score === TAMANHO_CARTELA) {
                            publisher.publish(BINGO, userIdx) // poderia ser uma chamada de função simples, fiz com eventos para testar...
                        } else {
                            verificar_cartela(++userIdx, numero)
                        }
                    })
                })
            } else {
                verificar_cartela(++userIdx, numero)
            }
        })
    }
}