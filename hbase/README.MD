### Atividade HBASE

#### Baixar o hbase e copiar o arquivo de italianos

```
docker pull dajobe/hbase
docker run --name hbase-furb dajobe/hbase
docker exec -it hbase-furb /bin/bash
docker cp italians.txt hbase-furb:/tmp
hbase shell
```

#### Agora, de dentro da imagem faça os sefuintes procedimentos:
1. Crie a tabela com 2 famílias de colunas:
   1.  a. personal-data
   2.  b. professional-data
```
create name_space 'pos_furb'
create table 'pos_furb':'italians', 'personal-data', 'professional-data'
```
2. Importe o arquivo via linha de comando
```
```

#### Agora execute as seguintes operações:
1. Adicione mais 2 italianos mantendo adicionando informações como data
de nascimento nas informações pessoais e um atributo de anos de
experiência nas informações profissionais;
```
put 'italians', '1', 'personal-data:name', 'Luigi'
put 'italians', '1', 'personal-data:bornDate', '19/08/1990'
put 'italians', '1', 'professional-data:yearsOfExperience', '10'
put 'italians', '2', 'personal-data:name', 'Salvatori'
put 'italians', '2', 'personal-data:bornDate', '19/08/1980'
put 'italians', '2', 'professional-data:yearsOfExperience', '15'
```
2. Adicione o controle de 5 versões na tabela de dados pessoais.
```
```
3. Faça 5 alterações em um dos italianos;
```
```
4. Com o operador get, verifique como o HBase armazenou o histórico.
```
```
5. Utilize o scan para mostrar apenas o nome e profissão dos italianos.
```
```
6. Apague os italianos com row id ímpar
```
```
7. Crie um contador de idade 55 para o italiano de row id 5
```
```
8. Incremente a idade do italiano em 1
```
```
