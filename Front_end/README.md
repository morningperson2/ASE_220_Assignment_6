#NKU ASE220 Mid-term starter package
This repository is designed for the ASE220 - Full-stack development course. This repository contains a starter application for the midterm that demonstrates how to create a full-stack Content Management System (CMS) that leverages JSONblob.com as a remote database.

### The application demostrates:
- client-side application design
- the use of RESTful APIs
- CRUD operations
- client-server communication

I did not implement any fancy HTML/CSS design because the focus of this application is to understand how a client application would interact with the server-side component via REST APIs.

### How to start
1. Load the folder into Visual Studio code and start the live server
2. Browse index.html

### How it works
The assets folder contains the following "libraries":
- api.js: this libary realizes API calls to exchange information between the client and the server in JSON format. API calls are based on AXIOS (https://axios-http.com/docs/intro).
- database.js: this library manages CRUD database operations and standardizes them, providing an interface to the API libary.
- getAllURLParams.js: this library retrieves query string parameters, which are utilized to view, edit, or delete a single quote.

This application is built using the Model-View-Controller approach, to best separate the interface (HTML), the data (API/JSON), and the logic. This is implemented as follows:
- The HTML files only contain HTML code and links to external JavaScript files.
- The app.js file contains the logic of the application: it manipulates the DOM, listens to events, and communicates with the database
- The database and APIs provide the application with data storage/retrieval capabilities.

Have fun!