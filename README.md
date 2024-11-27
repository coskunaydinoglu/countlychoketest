# Countly Choke Test
Countly Choke Test is used to make load tests on data ingestion apis by sending sample event.

You can add other events by checking the api reference

https://api.count.ly/reference/i

Script sends all the possible data at maximum rates. It is possible to spawn the script multiple times or per cores too by making multiple loop calls. Currently there is only one ```loop``` call.

Script runs as long as it gets failure from the server. It is possible to script to continue send requests by setting stopOnError variable false

# Prequistics
Choke test script can work standalone. It doesn't have to be in the server where countly is running. It is not part of Countly Server.

Min requirements
> = node v12. 20.0

# Environmental Variables
APP_KEY --> The app key they is retrieved from Countly
SERVER_URL --> Countly server url

# Running the script
```
npm i
node index.js
```

# SDK Tests
This script does not cover SDK Test.
To test SDK's impact on the client devices plase install the sdk with default settings on a fresh app/website and disable intenet connection. With a loop record 1000 events (any custom event would do) per minute and run the app/website for 10 minutes to check the SDK's impact on the storage and memory."

