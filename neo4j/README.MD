### Exercício 1 - Retrieving Nodes
---
- Exercise 1.1: Retrieve all nodes from the database
```
match (v) return v
```
- Exercise 1.2: Examine the data model for the graph
```
call db.schema.visualization
```
- Exercise 1.3: Retrieve all Person nodes
```
match (p:Person) return p
```
- Exercise 1.4: Retrieve all Movie nodes
```
match (m:Movie) return m
```

### Exercício 2 – Filtering queries using property values

- Exercise 2.1: Retrieve all movies that were released in a specific year.
```
match (m:Movie {released : 2003}) return m
```
- Exercise 2.2: View the retrieved results as a table.
```
match (m:Movie {released : 2003}) return m
# Selecionando opção de visualização em tabela
# Pesquisando em um ano diferente
```
- Exercise 2.3: Query the database for all property keys.
```
call db.propertyKeys
```
- Exercise 2.4: Retrieve all Movies released in a specific year, returning
their titles.
```
match (m:Movie {released:2006}) return m.title
```
- Exercise 2.5: Display title, released, and tagline values for every Movie
node in the graph.
```
match (m:Movie) return m.title, m.released, m.tagline
```
- Exercise 2.6: Display more user-friendly headers in the table
```
match (m:Movie) return m.title as `Título do Filme`, m.released as `Ano de lançamento`, m.tagline as Slogan
```

### Exercício 3 - Filtering queries using relationships

- Exercise 3.1: Display the schema of the database.
```
call db.schema.visualization
```
- Exercise 3.2: Retrieve all people who wrote the movie Speed Racer.
```
match (p:Person)-[:WROTE]->(m:Movie {title:'Speed Racer'}) return p
```
- Exercise 3.3: Retrieve all movies that are connected to the person,
Tom Hanks.
```
match (m:Movie)--(p:Person {name : 'Tom Hanks'}) return m.title
```
- Exercise 3.4: Retrieve information about the relationships Tom Hanks
had with the set of movies retrieved earlier.
```
match (m:Movie)-[rel]-(p:Person {name : 'Tom Hanks'}) return m.title, type(rel)
```
- Exercise 3.5: Retrieve information about the roles that Tom Hanks
acted in.
```
match (m:Movie)-[rel:ACTED_IN]-(p:Person {name : 'Tom Hanks'}) return m.title, rel.roles
```

### Exercício 4 – Filtering queries using WHERE clause

- Exercise 4.1: Retrieve all movies that Tom Cruise acted in.
```
match (p:Person)-[:ACTED_IN]-(m:Movie) where p.name = 'Tom Cruise' return m.title
```
- Exercise 4.2: Retrieve all people that were born in the 70’s.
```
match (p:Person) where p.born >= 1970 and p.born <= 1979 return p.name
```
- Exercise 4.3: Retrieve the actors who acted in the movie The Matrix
who were born after 1960.
```
match (p:Person)-[:ACTED_IN]-(m:Movie) where m.title = 'The Matrix' and p.born > 1960 return p.name, p.born
```
- Exercise 4.4: Retrieve all movies by testing the node label and a
property.
```
match (m) where m:Movie and m.released = 2000 return m.title
```
- Exercise 4.5: Retrieve all people that wrote movies by testing the
relationship between two nodes.
```
match (p)-[rel]-(m) where p:Person and type(rel) = 'WROTE' and m:Movie return p.name, m.title
```
- Exercise 4.6: Retrieve all people in the graph that do not have a
property.
```
match (p:Person) where not exists(p.born) return p.name
```
- Exercise 4.7: Retrieve all people related to movies where the
relationship has a property.
```
match (p:Person)-[rel]-(m:Movie) where exists(rel.rating) return p.name, m.title, rel.rating
```
- Exercise 4.8: Retrieve all actors whose name begins with James.
```
match (p:Person)-[:ACTED_IN]-(:Movie) where p.name starts with 'James' return p.name
```
- Exercise 4.9: Retrieve all all REVIEW relationships from the graph
with filtered results.
```
match (:Person)-[r:REVIEWED]->(m:Movie) where toLower(r.summary) contains 'fun' return m.title, r.summary, r.rating
```
- Exercise 4.10: Retrieve all people who have produced a movie, but
have not directed a movie.
```
match (p:Person)-[:PRODUCED]->(m:Movie) where not ((p)-[:DIRECTED]->(:Movie)) return p.name, m.title
```
- Exercise 4.11: Retrieve the movies and their actors where one of the
actors also directed the movie.
```
match (p1:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(p2:Person) where exists((p2)-[:DIRECTED]->(m)) return p1.name as Ator, p2.name as `Ator/Diretor`, m.title as Filme
```
- Exercise 4.12: Retrieve all movies that were released in a set of
years.
```
match (m:Movie) where m.released in [2000, 2004, 2008] return m.title, m.released
```
- Exercise 4.13: Retrieve the movies that have an actor’s role that is
the name of the movie.
```
match (p:Person)-[r:ACTED_IN]-(m:Movie) where m.title in r.roles return m.title, r.roles, p.name
```

### Exercício 5 – Controlling query processing

- Exercise 5.1: Retrieve data using multiple MATCH patterns.
```
match (p1:Person {name : 'Gene Hackman'})-[:ACTED_IN]->(m:Movie)<-[:DIRECTED]-(p2:Person),
      (p3:Person)-[:ACTED_IN]->(m)
return p1.name as Ator, p2.name as Diretor,p3.name as `co-ator`, m.title as Filme
```
- Exercise 5.2: Retrieve particular nodes that have a relationship.
```
match (p1:Person {name : 'James Thompson'})-[:FOLLOWS]-(p2:Person) return p1, p2
```
- Exercise 5.3: Modify the query to retrieve nodes that are exactly
three hops away.
```
match (p1:Person {name : 'James Thompson'})-[:FOLLOWS*3]-(p2:Person) return p1, p2
```
- Exercise 5.4: Modify the query to retrieve nodes that are one and
two hops away.
```
match (p1:Person {name : 'James Thompson'})-[:FOLLOWS*1..2]-(p2:Person) return p1, p2
```
- Exercise 5.5: Modify the query to retrieve particular nodes that are
connected no matter how many hops are required.
```
match (p1:Person {name : 'James Thompson'})-[:FOLLOWS*]-(p2:Person) return p1, p2
```
- Exercise 5.6: Specify optional data to be retrieved during the query.
```
match (p:Person) 
where p.name starts with 'Tom'
optional match (p)-[:DIRECTED]->(m:Movie)
return p.name, m.title
```
- Exercise 5.7: Retrieve nodes by collecting a list.
```
match (p:Person)-[:ACTED_IN]->(m:Movie)
return p.name, collect(m.title) as `lista de filmes`
```
- Exercise 5.8: Retrieve all movies that Tom Cruise has acted in and the co-actors that acted in the same movie by collecting a list
```
match (p1:Person {name : 'Tom Cruise'})-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(p2:Person)
return m.title, collect(p2.name) as `co-atores`
```
- Exercise 5.9: Retrieve nodes as lists and return data associated with
the corresponding lists.
```
match (p:Person)-[:REVIEWED]->(m:Movie)
return m.title, collect(p.name) as revisores, count(p.name) as quantidade
```
- Exercise 5.10: Retrieve nodes and their relationships as lists.
```
match (p1:Person)-[:DIRECTED]->(m:Movie)<-[:ACTED_IN]-(p2:Person)
return p1.name as Diretor, count(p2) as `Numero de Atores`, collect(p2.name) as Atores
```
- Exercise 5.11: Retrieve the actors who have acted in exactly five
movies.
```
match (p:Person)-[:ACTED_IN]->(m:Movie)
with p, count(m) as qtdFilmes, collect (m.title) as filmes
where qtdFilmes = 5
return p.name, filmes
```
- Exercise 5.12: Retrieve the movies that have at least 2 directors with other
optional data.
```
match (p:Person)-[:DIRECTED]->(m:Movie)
with collect(p.name) as Diretores, count(p) as qtdDiretores, m
where qtdDiretores >= 2
OPTIONAL match ((p2:Person)-[:REVIEWED]-(m))
return m.title as filme, Diretores, collect(p2.name) as Revisores
```

### Exercício 6 – Controlling results returned

- Exercise 6.1: Execute a query that returns duplicate records.
```
match (p:Person)-[:ACTED_IN]->(m:Movie)
where m.released >= 1990 and m.released < 2000
return m.released, m.title, collect(p.name) as Atores
```
- Exercise 6.2: Modify the query to eliminate duplication.
```
match (p:Person)-[:ACTED_IN]->(m:Movie)
where m.released >= 1990 and m.released < 2000
return m.released, collect(m.title), collect(p.name) as Atores
```
- Exercise 6.3: Modify the query to eliminate more duplication.
```
match (p:Person)-[:ACTED_IN]->(m:Movie)
where m.released >= 1990 and m.released < 2000
return m.released, collect(distinct m.title), collect(p.name) as Atores
```
- Exercise 6.4: Sort results returned.
```
match (p:Person)-[:ACTED_IN]->(m:Movie)
where m.released >= 1990 and m.released < 2000
return m.released, collect(distinct m.title), collect(p.name) as Atores
order by m.released DESC
```
- Exercise 6.5: Retrieve the top 5 ratings and their associated movies.
```
match (:Person)-[r:REVIEWED]->(m:Movie)
where exists(r.rating)
return m.title, r.rating
order by r.rating desc 
limit 5
```
- Exercise 6.6: Retrieve all actors that have not appeared in more than 3 movies
```
match (p:Person)-[:ACTED_IN]->(m:Movie)
with count(m) as qtdFilmes, p, collect(m.title) as filmes
where qtdFilmes <= 3
return p.name, filmes
```

### Exercício 7 – Working with cypher data

- Exercise 7.1: Collect and use lists.
```
match (p1:Person)-[:ACTED_IN]->(m:Movie)<-[:PRODUCED]-(p2:Person)
with collect(distinct p1.name) as Atores, count(distinct p1.name) as qtdAtores,
     collect(distinct p2.name) as Produtores,
     m.title as filme
return filme, Atores, Produtores
order by qtdAtores desc
```
- Exercise 7.2: Collect a list.
```
match (p:Person)-[:ACTED_IN]->(m:Movie)
with p, collect(m.title) as filmes
where size(filmes) > 5
return p.name, filmes
```
- Exercise 7.3: Unwind a list.
```
match (p:Person)-[:ACTED_IN]->(m:Movie)
with p, collect(m.title) as filmes
where size(filmes) > 5
with p,filmes unwind filmes as filme
return p.name, filme
```
- Exercise 7.4: Perform a calculation with the date type.
```
match (p:Person {name : "Tom Hanks"})-[:ACTED_IN]->(m:Movie)
return m.title, m.released, date().year - m.released as `idade do filme`, m.released - p.born as `idade do Tom`
order by `idade do filme`
```

### Exercício 8 – Creating nodes
- Exercise 8.1: Create a Movie node.
```
CREATE (:Movie {title:'Forrest Gump'})
```
- Exercise 8.2: Retrieve the newly-created node.
```
match (m:Movie {title : 'Forrest Gump'}) return m
```
- Exercise 8.3: Create a Person node.
```
create (:Person {name : 'Robin Wright'})
```
- Exercise 8.4: Retrieve the newly-created node.
```
match (p:Person {name : 'Robin Wright'}) return p
```
- Exercise 8.5: Add a label to a node.
```
match (m:Movie)
where m.released < 2010
set m:OlderMovie
return m
```
- Exercise 8.6: Retrieve the node using the new label.
```
match (om:OlderMovie) return om
```
- Exercise 8.7: Add the Female label to selected nodes.
```
match (p:Person)
where p.name starts with 'Robin'
set p:Female
return p
```
- Exercise 8.8: Retrieve all Female nodes.
```
match (f:Female) return f
```
- Exercise 8.9: Remove the Female label from the nodes that have this
label.
```
match (f:Female) remove f:Female
```
- Exercise 8.10: View the current schema of the graph.
```
call db.schema.visualization
```
- Exercise 8.11: Add properties to a movie.
```
match (m:Movie {title : 'Forrest Gump'})
set m:OlderMovie, m.released = 1994, m.tagline = 'Life is like a box of chocolates…​you never know what you’re gonna get', m.lengthInMinutes = 142
```
- Exercise 8.12: Retrieve an OlderMovie node to confirm the label and
properties.
```
match (om:OlderMovie {title : 'Forrest Gump'}) return om
```
- Exercise 8.13: Add properties to the person, Robin Wright.
```
match (p:Person {name : 'Robin Wright'})
set p.born = 1966,
p.birthPlace = 'Dallas'
```
- Exercise 8.14: Retrieve an updated Person node.
```
match (p:Person {name : 'Robin Wright'}) return p
```
- Exercise 8.15: Remove a property from a Movie node.
```
match (m:Movie {title : 'Forrest Gump'}) set m.lengthInMinutes = null
```
- Exercise 8.16: Retrieve the node to confirm that the property has
been removed.
```
match (m:Movie {title : 'Forrest Gump'}) return m
```
- Exercise 8.17: Remove a property from a Person node.
```
match (p:Person {name : 'Robin Wright'}) set p.birthPlace = null
```
- Exercise 8.18: Retrieve the node to confirm that the property has
been removed.
```
match (p:Person {name : 'Robin Wright'}) return p
```

### Exercício 9 – Creating relationships

- Exercise 9.1: Create ACTED_IN relationships.
```
match (m:Movie {title : 'Forrest Gump'})
match (p:Person)
where p.name in ['Tom Hanks', 'Robin Wright', 'Gary Sinise']
create (p)-[:ACTED_IN]->(m)
```
- Exercise 9.2: Create DIRECTED relationships.
```
match (p:Person {name : 'Robert Zemeckis'})
match (m:Movie {title : 'Forrest Gump'})
create (p)-[:DIRECTED]->(m)
```
- Exercise 9.3: Create a HELPED relationship.
```
match (p1:Person {name : 'Tom Hanks'})
match (p2:Person {name : 'Gary Sinise'})
create (p1)-[:HELPED]->(p2)
```
- Exercise 9.4: Query nodes and new relationships.
```
match (p:Person)-[rel]-(m:Movie {title : 'Forrest Gump'})
return p, rel, m
```
- Exercise 9.5: Add properties to relationships.
```
match (p:Person)-[rel:ACTED_IN]->(m:Movie {title : 'Forrest Gump'})
set rel.roles = 
case p.name
when 'Tom Hanks' THEN ['Forrest Gump']
when 'Robin Wright' THEN ['Jenny Curran']
when 'Gary Sinise' THEN ['Lieutenant Dan Taylor']
end
```
- Exercise 9.6: Add a property to the HELPED relationship.
```
match (p1:Person)-[rel:HELPED]->(p2:Person)
where p1.name = 'Tom Hanks' and p2.name = 'Gary Sinise'
set rel.research = 'war history'
```
- Exercise 9.7: View the current list of property keys in the graph.
```
call db.propertyKeys
```
- Exercise 9.8: View the current schema of the graph.
```
call db.schema.visualization
```
- Exercise 9.9: Retrieve the names and roles for actors.
```
match (p:Person)-[rel:ACTED_IN]->(m:Movie {title : 'Forrest Gump'})
return p.name, rel.roles, m.title
```
- Exercise 9.10: Retrieve information about any specific relationships.
```
match (a)-[rel:HELPED]-(b) return a, rel, b
```
- Exercise 9.11: Modify a property of a relationship.
```
match (p:Person {name : 'Gary Sinise'})-[rel:ACTED_IN]->(m:Movie {title : 'Forrest Gump'})
set rel.roles = ['Lt. Dan Taylor']
```
- Exercise 9.12: Remove a property from a relationship.
```
match (p1:Person)-[rel:HELPED]->(p2:Person)
where p1.name = 'Tom Hanks' and p2.name = 'Gary Sinise'
set rel.research = null
```
- Exercise 9.13: Confirm that your modifications were made to the
graph.
```
match (p:Person)-[rel:ACTED_IN]->(m:Movie {title : 'Forrest Gump'})
return p, rel, m
```

### Exercício 10 – Deleting nodes and relationships

- Exercise 10.1: Delete a relationship.
```
match ()-[rel:HELPED]-() delete rel
```
- Exercise 10.2: Confirm that the relationship has been deleted.
```
match ()-[rel:HELPED]-() return rel
```
- Exercise 10.3: Retrieve a movie and all of its relationships.
```
match (p)-[rel]-(m:Movie {title : 'Forrest Gump'}) return p, rel, m
```
- Exercise 10.4: Try deleting a node without detaching its relationships.
```
match (m:Movie {title : 'Forrest Gump'}) delete m
```
- Exercise 10.5: Delete a Movie node, along with its relationships.
```
match (m:Movie {title : 'Forrest Gump'}) detach delete m
```
- Exercise 10.6: Confirm that the Movie node has been deleted.
```
match (m:Movie {title : 'Forrest Gump'}) return m
```
