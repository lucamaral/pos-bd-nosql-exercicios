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
hbase shell /tmp/italians.hbase
```

#### Agora execute as seguintes operações:
1. Adicione mais 2 italianos mantendo adicionando informações como data
de nascimento nas informações pessoais e um atributo de anos de
experiência nas informações profissionais;
```
put 'italians', '11', 'personal-data:name',  'Luigi Sorrentino'
put 'italians', '11', 'personal-data:city',  'Napoli'
put 'italians', '11', 'personal-data:bornDate',  '01/01/1995'
put 'italians', '11', 'professional-data:role',  'Suporte'
put 'italians', '11', 'professional-data:salary',  '2778'
put 'italians', '11', 'personal-data:yearsXP',  '5'

put 'italians', '12', 'personal-data:name',  'Salvatori Ferrari'
put 'italians', '12', 'personal-data:city',  'Roma'
put 'italians', '12', 'personal-data:bornDate',  '02/02/1990'
put 'italians', '12', 'professional-data:role',  'Desenvolvedor'
put 'italians', '12', 'professional-data:salary',  '7000'
put 'italians', '12', 'personal-data:yearsXP',  '10'

```
2. Adicione o controle de 5 versões na tabela de dados pessoais.
```
alter 'italians', NAME => 'personal-data', VERSIONS => 5
```
3. Faça 5 alterações em um dos italianos;
```
put 'italians', '11', 'personal-data:city',  'Napoles'
put 'italians', '11', 'personal-data:city',  'Nápoles'
put 'italians', '11', 'personal-data:bornDate',  '10/05/1995'
put 'italians', '11', 'professional-data:role',  'Suporte 2'
put 'italians', '11', 'professional-data:salary',  '4000'
```
4. Com o operador get, verifique como o HBase armazenou o histórico.
```
get 'italians', '11', {COLUMN => 'personal-data', VERSIONS=>3}
get 'italians', '11', {COLUMN => 'professional-data', VERSIONS=>2}
```
5. Utilize o scan para mostrar apenas o nome e profissão dos italianos.
```
scan 'italians',{COLUMNS => ['personal-data:name', 'professional-data:role']}
```
6. Apague os italianos com row id ímpar
```
deleteall 'italians', '1'
deleteall 'italians', '3'
deleteall 'italians', '5'
deleteall 'italians', '7'
deleteall 'italians', '9'
deleteall 'italians', '11'
```
7. Crie um contador de idade 55 para o italiano de row id 5
```
incr 'italians', '5', 'personal-data:age', 55
```
8. Incremente a idade do italiano em 1
```
incr 'italians', '5', 'personal-data:age', 1
```
