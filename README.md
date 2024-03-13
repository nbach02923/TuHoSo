# Migrating DB Instruction:
1. Create .env file in the root path:
    The env file container 6 variables:
    - **NODE_ENV**: to defy which evironment and data base the server and sequelize ORM will connect to.
    - **HOST**: to deecide which domain the server will run on
    - **PORT**: to decide the poporo that domain the server will run on,
    - **EXPIRE_TIME**: to determine the time a token will expire
    - **ALG**: to decide the algorithm the token will be using when sign token
    - **API_LINK**: the API link of the static to be served
2. Run project command:
    ```
    $ npm run start
    ```
    Option:
    - To change the environment project running on, change the NODE_ENV variable in env file.
3. Create database command(only when database is not yet create):
    ```
    $ npm run create
    ```
    Option: 
    - Type ```-- --env {env}``` to specify which environment to create the database. There are 3 environment variables:
        - Development(default if no specified)
        - Test
        - Production
        - Can be more but need configuration into the config.json and ./models/index.js
    - Or modify config.json and .env file to make sequelize connect to the database you want **(RECOMMEND)**.
4. Create a model command:
    ```
    $ npm run model:create -- --name {modelName} --attributes {modelAttributes}
    ```
    - This command will create the model and it migrations or you can create your own model and migrations.
    - Sequelize when create tables, columns, etc will only read the migrations file which is in the migrations directory. When working with the API inject data to table, the sequelize will read model in the models directory.
5. Run the migrate:
    - Run the migration:
    ```
    $ npm run migrate:up
    ```
    Sequelize will read all up function in files in the migrations folder. So when create a migrations, and want to update it don't modify the old migrations, create the new migrations then update the database.
    - Terminate the migration:
    ```
    $ npm run migrate:down
    ```
    Sequelize will read the down function in files in the migrations folder.
6. Create a seed to inject to database:
    - Create seed file in seeders folder
    ```
    $ npm run seeder:create
    ```
    The up function will inject data to table when command seeder:up is run and down function when seeder:down is run. No need to run seeder:down when migrate:down cause the table is already drop.
