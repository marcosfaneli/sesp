# sesp

# Passos iniciais para executar o projeto

  ### Executar via Docker

  ```sh
   $ docker run -it -d --name postgres -p 5432:5432 -e > POSTGRES_USERNAME=postgres -e POSTGRES_PASSWORD=123456 > postgres:13.1  

   $ npx knex --knexfile knexfile.ts migrate:latest

   $ docker-compose up -d
  
  ```
  ### Executar local
  
  ```sh
  $ npm install -g typescript

  $ npm install 
  
  $ ts-node-dev src/server.ts
  ```