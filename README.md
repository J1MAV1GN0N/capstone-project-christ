# Capstone Project Christ

# Functionality of the application

This application will allow creating/removing/updating/fetching image items and watermark them. Each user only has access to image items that he/she has created.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless image pplication.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button to import this file:
https://github.com/J1MAV1GN0N/capstone-project-christ/blob/master/CapstoneProject.postman_collection.json


# Code Sources and inspiration:
https://blog.logrocket.com/image-processing-with-node-and-jimp/
https://www.youtube.com/watch?v=xjrI_9V07fY
https://rossbulat.medium.com/image-processing-in-nodejs-with-jimp-174f39336153

