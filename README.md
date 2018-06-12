# cli-es6
Command line tool that read csv

Requisiti di sistema
-----------
1. Installa Node.js.
   https://nodejs.org/en/download/.
   
2. Installa Yarn.
   https://yarnpkg.com/en/docs/install

Installazione, controllo codice, build
----------

1. Clona progetto e installa dipendenze:
         
        $ git clone git@github.com:braindrained/cli-es6.git cli-es6
        $ yarn

2. Esegui check in ambiente di sviluppo:

        $ yarn start check

3. Esegui elaborazione files in ambiente di sviluppo:

        $ yarn start run

4. Controllo codice:

        $ yarn test

5. Esegui build:

        $ yarn build
        
6. Installazione:

        $ npm install -g

Utilizzo una volta installato
-----------

Creare la cartella files contentente le due cartelle origin e destination.

Copiare nella cartella origin i file da elaborare.

Eseguire i seguenti comandi:

1. Help ritorna la lista dei comandi eseguibili:

        $ cli-es6 -help
        //oppure
        $ cli-es6 -h
        
2. Check verifica i files nelle directory:

        $ cli-es6 check
        
3. Run esegue programma:

        $ cli-es6 run
