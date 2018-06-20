# cli-es6
Command line tool that read and mount csv files

To start
-----------
1. Install Node.
   https://nodejs.org/en/download/.
   
2. Install Yarn.
   https://yarnpkg.com/en/docs/install

Install, check code, build
----------

1. Clone and install dependencies:
         
        $ git clone git@github.com:braindrained/cli-es6.git cli-es6
        $ yarn

2. Check in dev environment:

        $ yarn start check
        // or 
        $ yarn start ck

3. Run in dev environment:

        $ yarn start run
        // or 
        $ yarn start r

4. Check code:

        $ yarn test

5. Build:

        $ yarn build
        
6. Install globally:

        $ npm install -g

Once installed
-----------

Create the directories:

```
.
└── files
    ├── destination
    └── origin
```     

Copy in origin the files to process.

Comands:

1. Help:

        $ cli-es6 -help
        // or
        $ cli-es6 -h
        
2. Check:

        $ cli-es6 check
        // or
        $ cli-es6 ck
        
3. Run:

        $ cli-es6 run
        // or
        $ cli-es6 r
