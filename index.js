
import dotenv from 'dotenv';
dotenv.config();
const APP_KEY = process.env.APP_KEY
const SERVER_URL = process.env.SERVER_URL

let userLimit = 100000;//maximum value of the user id generated
let stopOnError = true;
import got from 'got';
const start = Date.now();

var counter = {sent: 0, success: 0, error: 0};
var now = Date.now() - userLimit;
async function makeRequest(cnt) {
    var body = {};
    body.device_id = cnt;
    body.app_key = APP_KEY;
    body.begin_session = 1;
    body.timestamp = cnt + now;
    body.hour = 1;
    body.dow = 1;
    body.metrics = JSON.stringify({
        "_os": "Android",
        "_os_version": "4.1",
        "_device": "Samsung Galaxy",
        "_resolution": "1200x800",
        "_carrier": "Vodafone",
        "_app_version": "1.2",
        "_density": "MDPI",
        "_store": "com.android.vending",
        "_browser": "Chrome",
        "_browser_version": "40.0.0"
    });
    body.events = JSON.stringify([
        {
            "key": "level_success",
            "count": 1,
            "hour": 1,
            "dow": 1
        },
        {
            "key": "level_fail",
            "count": 1,
            "hour": 1,
            "dow": 1
        },
        {
            "key": "in_app_purchase",
            "count": 1,
            "sum": 2.97,
            "dur": 1000,
            "hour": 1,
            "dow": 1,
            "segmentation": {
                "app_version": "1.0",
                "country": "Germany"
            }
        },
        {
            "key": "[CLY]_view",
            "count": 1,
            "hour": 1,
            "dow": 1,
            "segmentation": {
                "name": "view1",
                "segment": "Android",
                "visit": 1,
                "start": 1
            }
        }
    ]);
    body.crash = {
        //device metrics
        "_os": "Android",
        "_os_version": "4.1",
        "_manufacture": "Samsung", //may not be provided for ios or be constant, like Apple
        "_device": "Galaxy S4", //model for Android, iPhone1,1 etc for iOS
        "_resolution": "1900x1080",
        "_app_version": "2.1",
        "_cpu": "armv7", //type of cpu used on device (for ios will be based on device)
        "_opengl": "2.1", //version of open gl supported

        //state of device
        "_ram_current": 1024, //in megabytes
        "_ram_total": 4096,
        "_disk_current": 3000, //in megabytes
        "_disk_total": 10240,
        "_bat": 99, //battery level from 0 to 100
        //or provide "_bat_current" and "_bat_total" if other scale
        "_orientation": "portrait", //in which device was held, landscape, portrait, etc

        //bools
        "_root": false, //true if device is rooted/jailbroken, false or not provided if not
        "_online": true, //true if device is connected to the internet (WiFi or 3G), false or 	not provided if not connected
        "_muted": false, //true if volume is off, device is in muted state
        "_background": false, //true if app was in background when it crashed

        //error info
        "_name": "Null Pointer exception", //optional if provided by OS/Platform, else will use first line of 		stack
        "_error": "Some error stack here", //error stack, can provide multiple separated by blank new line
        "_nonfatal": false, //true if handled exception, false or not provided if unhandled crash
        "_logs": "logs provided here", //some additional logs provided, if any 
        "_run": 180, //running time since app start in seconds

        //custom key/values provided by developers
        "_custom": {
            "facebook_sdk": "3.5",
            "admob": "6.5"
        }
    };
    var options = {
        json: body,
        https: { rejectUnauthorized: false }
    };
    counter.sent++;
    try {

        const response = await got.post(SERVER_URL, options)
        if(!response) {
            counter.error++;
        } else if(response.statusCode === 200) {
            counter.success++;
        } else {
            counter.error++;
            if (!counter[response.statusCode]) {
                counter[response.statusCode] = 0;
            }
            counter[response.statusCode]++;
        }
    } catch(error) {
        if (stopOnError && counter.error > 0) {
            console.log(((Date.now() - start) / 1000 / 60).toFixed(2), JSON.stringify(counter));
            process.exit(0);
        }

    }

    /* got.post(SERVER_URL, options, function(error, response) {
        //console.log(error, response);
        if (error || !response) {
            counter.error++;
        }
        else if (response.statusCode === 200) {
            counter.success++;
        }
        else {
            counter.error++;
            if (!counter[response.statusCode]) {
                counter[response.statusCode] = 0;
            }
            counter[response.statusCode]++;
        }
        if (stopOnError && counter.error > 0) {
            console.log(((Date.now() - start) / 1000 / 60).toFixed(2), JSON.stringify(counter));
            process.exit(0);
        }
    }); */
}

function loop(i) {
    setTimeout(function() {
        makeRequest(i);
        if (Date.now() - start <= 1000 * 60 * 60) {
            i++;
            loop(i);
        }
        else {
            clearInterval(interval);
            console.log(((Date.now() - start) / 1000 / 60).toFixed(2), JSON.stringify(counter));
        }
    }, 1);
}
loop(1);
var interval = setInterval(function() {
    console.log(((Date.now() - start) / 1000 / 60).toFixed(2), JSON.stringify(counter));
}, 1000);
