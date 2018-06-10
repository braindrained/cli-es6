# cli-es6
Command line tool that read csv

Requisiti di sistema
-----------
1. Installa Node.js.
   https://nodejs.org/en/download/.
   
2. Installa Yarn.
   https://yarnpkg.com/en/docs/install

Installazione, test, build
----------

1. Installa dipendenze:

        $ yarn

2. Esegui check in ambiente di sviluppo:

        $ yarn start check

3. Esegui in ambiente di sviluppo:

        $ yarn start run

4. Esegui flow:

        $ yarn flow

5. Esegui build:

        $ yarn build
        
6. Installazione:

        $ npm install -g

Utilizzo
-----------

Creare la cartella files contentente le due cartelle origin e destination.
Copiare nella cartella origin i file da elaborare.
Eseguire i seguenti comandi:

1. Help:

        $ cli-es6 --help
        
2. Check:

        $ cli-es6 check
        
3. Run:

        $ cli-es6 run
