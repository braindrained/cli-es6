# cli-es6
Command line tool per leggere file csv

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
        // oppure 
        $ yarn start ck

3. Esegui elaborazione files in ambiente di sviluppo:

        $ yarn start run
        // oppure 
        $ yarn start r

4. Controllo codice:

        $ yarn test

5. Esegui build:

        $ yarn build
        
6. Installazione:

        $ npm install -g

Utilizzo una volta installato
-----------

Creare la cartella **files** contenente le due cartelle **origin** e **destination**.

```
.
└── files
    ├── destination
    └── origin
```     

Copiare nella cartella origin i file da elaborare.

Descrizione comandi:

1. Help ritorna la lista dei comandi eseguibili:

        $ cli-es6 -help
        // oppure
        $ cli-es6 -h
        
2. Check verifica i files nelle directory:

        $ cli-es6 check
        // oppure
        $ cli-es6 ck
        
3. Run esegue programma:

        $ cli-es6 run
        // oppure
        $ cli-es6 r
