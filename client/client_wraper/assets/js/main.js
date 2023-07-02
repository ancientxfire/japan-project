let params = new URLSearchParams(document.location.search);
var userName;
var className;
var task_active
var currentUUID

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

// Listen to message from child window
eventer(messageEvent,async function (e) {
    
    var key = e.message ? "message" : "data";
    var data = e[key];
    //run function//
    if (data == "startButtonPressed") {
        task_active = true
        const allowedTask = await client
            .from("tasks")
            .select()
            .eq("uuid",currentUUID)
        if (allowedTask.data[0].ipad == true){
            iframeMain.src = "./loading.html"
            task_active = false
            currentUUID = ""
            getTask()
            return
        }
        console.log(allowedTask)
        iframeMain.src = `https://schule.matthiaskoplin.me/kulturtag-quiz/?name=${userName}&?class=${className}`
        const deactivateTask = await client
            .from("tasks")
            .update({"ipad":true})
            .eq("uuid",currentUUID)
        currentUUID = ""
    }
}, false);


realtimeClient =client
    .channel('any')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, payload => {
        getTask()
    })
    .subscribe()

async function getTask(){
    if (task_active == true){
        return
    }
    const { data, error } = await client
        .from('tasks')
        .select()
        .order('ipad', { ascending: true })
        .order('created_at', { ascending: true })
        
    console.log(data)
    if (data.length == 0){
        return
    }
    console.log(data[0].ipad)
    if (data[0].ipad == true){
        return
    }
    userName = data[0].name
    className = data[0].class
    iframeMain.src = `./start.html?name=${userName}&?class=${className}`
    
    currentUUID= data[0].uuid
    

}
getTask()