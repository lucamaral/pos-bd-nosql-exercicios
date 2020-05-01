(function() {
    
    const hbase = require("hbase")
    const italians_generate = require("./italians-generate.js")

    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const client = hbase({
        host: "172.17.0.2",
        port: 8080
    })
    
    const criarPessoa = function (index, nextPersonCallback){
        var person = italians_generate.randPerson(index+100);
        var colunas = [
            'personal-data:firstname',
            'personal-data:surname',
            'personal-data:age',
            'personal-data:bloodType',
            'personal-data:city',
            'personal-data:father',
            'personal-data:mother',
    
            'app-data:id_num',
            'app-data:email',
            'app-data:registerDate',
            'app-data:ticketNumber',
            'app-data:username',
    
            'professional-data:jobs',
            'professional-data:salary',
            
            'miscelaneous:favFruits',
            'miscelaneous:movies',
            'miscelaneous:cat',
            'miscelaneous:dog'
        ]
        var valores = [
            person.firstname,
            person.surname,
            person.age.toString(),
            person.bloodType,
            person.city || "",
            JSON.stringify(person.father) || "",
            JSON.stringify(person.mother) || "",
    
            person.id_num.toString(),
            person.email,
            person.registerDate.toString(),
            person.ticketNumber.toString(),
            person.username,
            
            JSON.stringify(person.jobs || []),
            person.salary.toString(),
            
            JSON.stringify(person.favFruits || []),
            JSON.stringify(person.movies || []),
            JSON.stringify(person.cat) || "",
            JSON.stringify(person.dog)  || ""
        ]
        client.table("italians")
            .row(person.username)
            .put(colunas, valores, function (err, success){
                if (err) console.info(err)
                if(success){
                    nextPersonCallback(++index)
                }
            })
    }
    
    const criarProximaPessoa = function (nextIndex){
        if(nextIndex !== 1000){
            criarPessoa(nextIndex, criarProximaPessoa)
        }else{
            console.info("Base Populada!")
            mainOptions()
        }
    }

    const quantidadeDeGatosECachorros = function (callback){
        const scanner = client.table("italians").scan({column : ['miscelaneous:cat', 'miscelaneous:dog']})
        var gatos = 0
        var cachorros = 0
        scanner.on("readable", function (){
            while (row = scanner.read()){
                var valor = row.$
                if(valor !== ''){
                    if(row.column === 'miscelaneous:cat'){
                        ++gatos
                    }else if(row.column === 'miscelaneous:dog'){
                        ++cachorros
                    }
                }
            }
        })
        scanner.on("end", function (){
            callback(gatos, cachorros)
        })
    }

    const quantidadeDePessoas = function (callback){
        const scanner = client.table("italians").scan({column : ['personal-data:firstname']})
        var pessoas = 0
        scanner.on("readable", function (){
            while (row = scanner.read()){
                ++pessoas
            }
        })
        scanner.on("end", function (){
            callback(pessoas)
        })
    }

    const quantidadeDePaisEMaes = function (callback){
        const scanner = client.table("italians").scan({column : ['personal-data:father', 'personal-data:mother']})
        var pais = 0
        var maes = 0
        scanner.on("readable", function (){
            while (row = scanner.read()){
                var valor = row.$
                if(valor !== ''){
                    if(row.column === 'personal-data:father'){
                        ++pais
                    }else if(row.column === 'personal-data:mother'){
                        ++maes
                    }
                }
            }
        })
        scanner.on("end", function (){
            callback(pais, maes)
        })
    }

    const quantidadeDeFrutasEFilmes = function (callback){
        const scanner = client.table("italians").scan({column : ['miscelaneous:favFruits', 'miscelaneous:movies']})
        var frutas = 0
        var filmes = 0
        scanner.on("readable", function (){
            while (row = scanner.read()){
                var valor = JSON.parse(row.$)
                if(row.column === 'miscelaneous:favFruits'){
                    frutas += valor.length
                }else if(row.column === 'miscelaneous:movies'){
                    filmes += valor.length
                }
            }
        })
        scanner.on("end", function (){
            callback(frutas, filmes)
        })
    }

    const quantidadeTotalSalarios = function (callback){
        const scanner = client.table("italians").scan({column : ['professional-data:salary']})
        var totalSalarios = 0
        scanner.on("readable", function (){
            while (row = scanner.read()){
                totalSalarios += new Number(row.$)
            }
        })
        scanner.on("end", function (){
            callback(totalSalarios)
        })
    }

    const mainOptions = function (){
        console.info("")
        console.info("------------------ Italianos ------------------");
        console.info("")
        console.info("0 - Popular tabela");
        console.info("1 - Quantidade de gatos e cachorros na amostra");
        console.info("2 - Média de gatos e cachorros na população");
        console.info("3 - Quantidade de pais e mães");
        console.info("4 - Média de pais e mães");
        console.info("5 - Média de frutas e filmes por italiano");
        console.info("6 - Salário médio dos italianos");
        console.info("Sair - Para sair")
        
        rl.question("Selecione umas das opções acima (0,1,2,3,4,5,6,Sair)", function (option){
            switch (option){
                case "0":
                    console.info("0 - Popular tabela");
                    var index = 0;
                    criarPessoa(index, criarProximaPessoa)
                    break;
                case "1":
                    console.info("1 - Quantidade de gatos e cachorros na amostra");
                    quantidadeDeGatosECachorros(function (gatos, cachorros){
                        console.info("Quantidade de gatos : " + gatos)
                        console.info("Quantidade de cachorros : " + cachorros)
                        mainOptions();
                    })
                    break;
                case "2":
                    console.info("2 - Média de gatos e cachorros na população");
                    quantidadeDePessoas(function (qtdPessoas){
                        quantidadeDeGatosECachorros(function (gatos, cachorros) {
                            console.info("Média de gatos por italiano: " + gatos / qtdPessoas)
                            console.info("Média de cachorros por italiano: " + cachorros / qtdPessoas)
                            mainOptions();
                        })
                    })
                    break;
                case "3":
                    console.info("3 - Quantidade de pais e mães");
                    quantidadeDePaisEMaes(function (pais, maes){
                        console.info("Quantidade de pais : " + pais)
                        console.info("Quantidade de maes : " + maes)
                        mainOptions();
                    })
                    break;
                case "4":
                    console.info("4 - Média de pais e mães");
                    quantidadeDePessoas(function (qtdPessoas){
                        quantidadeDePaisEMaes(function (pais, maes) {
                            console.info("Média de pais por italiano: " + pais / qtdPessoas)
                            console.info("Média de mães por italiano: " + maes / qtdPessoas)
                            mainOptions();
                        })
                    })
                    break;
                case "5":
                    console.info("5 - Média de frutas e filmes por italiano");
                    quantidadeDePessoas(function (qtdPessoas){
                        quantidadeDeFrutasEFilmes(function (frutas, filmes) {
                            console.info("Média de frutas por italiano: " + frutas / qtdPessoas)
                            console.info("Média de filmes por italiano: " + filmes / qtdPessoas)
                            mainOptions();
                        })
                    })
                    break;
                case "6":
                    console.info("6 - Salário médio dos italianos");
                    quantidadeDePessoas(function (qtdPessoas){
                        quantidadeTotalSalarios(function (totalSalarios) {
                            console.info("Salário médio dos italianos: " + totalSalarios / qtdPessoas)
                            mainOptions();
                        })
                    })
                    break;
                default:
                    console.info("Arrivederci")
                    process.exit(0)
            }
        })
    }

    mainOptions()
    
})()