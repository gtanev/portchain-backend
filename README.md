# Portchain

This is a web application written in JavaScript with Node and React. It retrieves data about 
container vessels and their schedules from an external API, analyzes this data and displays related statistics.

External API endpoints:

    https://import-coding-challenge-api.portchain.com/api/v2/vessels
    https://import-coding-challenge-api.portchain.com/api/v2/schedule/:vesselIMO

The backend server imports the data from the above endpoints, performs some transformations and exposes 
its own RESTful API for querying the data transformed with relevant statistics calculated 
internally. These include the number of completed port calls for each port and each vessel, port call duration 
percentiles, and port call forecast delay percentiles.

The backend API accepts GET requests on the `ports` and `vessels` endpoints, with optional query 
parameters used to sort and limit the requested data and compute additional statistics. The results 
are returned to the client as a JSON response.

Backend API endpoints:

    GET /                                   - List all available endpoints
    
    GET /ports                              – List all ports and their number of port calls
    GET /ports/:portId                      – Find a port by ID 
    GET /ports/:portId/schedule             - Find a port schedule by ID
    GET /ports?[sortKey: string(s), sortDir: string, limit: number, durationPerc: number(s)]
                                            – List the top <limit> ports sorted by <sortKey> in a <sortDir> direction,
                                            along with the <durationPerc> percentiles of their port call durations

    GET /vessels                            – List all vessels and their number of port calls
    GET /vessels/:vesselId                  – Find a vessel by ID (i.e. IMO)
    GET /vessels/:vesselId/schedule         - Find a vessel schedule by ID (i.e. IMO)
    GET /vessels?[sortKey: string(s), sortDir: string, limit: number, delayDays: number(s), delayPerc: number(s)]
                                            – List the top <limit> vessels sorted by <sortKey> in a <sortDir> direction, 
                                            along with the <delayPerc> percentiles of their <delayDays>-day port call delays

The frontend client fetches data from the above endpoints and renders a graphical representation in the browser.

### Frameworks and libraries

- Express
- NodeCache
- Axios
- React
- Material-UI
- Recharts

### Setting up and running the application locally

1. Make sure you have **Node.js** v12+ installed in your environment.
2. Clone the `portchain-backend` and `portchain-frontend` repositories.
3. Start the backend server by running `npm install` followed by `npm start` in the `portchain-backend` project directory.
4. Launch the client application by running `npm install` followed by `npm start` in the `portchain-frontend` project directory.

### Notes

- The backend server is set to run on port `8080` and the frontend client on port `3000`.
- To ensure data integrity and isolate the business logic, all calculations are performed on the server.
