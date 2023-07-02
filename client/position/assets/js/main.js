const urlParams = new URLSearchParams(window.location.search);
const uuid =  urlParams.get("uuid") 
async function main(){
    
    
    if (uuid == null){
        alert("This uuid is invalid, please scan again.")
        return window.close();
    }
    const placementQuery = await client
    .from('scoreboard')
    .select()
    .order('correct', { ascending: false })
    .order('incorrect', { ascending: true })
    if (placementQuery.error){
        return alert("This uuid is invalid, please scan again.")
    }
    var placementArray = placementQuery.data
    var placement;

    /* placementArray = placementArray.sort((a,b) => {
        if (a.correct === b.correct){
            return a.correct < b.correct ? -1 : 1
        } else {
            return a.incorrect < b.incorrect ? -1 : 1
        }
    }) */

    placementArray.find((o,i) => {if(o.uuid === uuid){
        placement = i + 1
    }})

    console.log(placement)
    document.getElementById("placement_headding").innerHTML = "Platz "+(placement)
    document.getElementById("placement_crown").classList.add("score"+(placement))
    if (placement <= 3){
        document.getElementById("placement_crown").style.display = "block"
    } else {
        document.getElementById("placement_crown").style.display = "none"
    }
    console.log(placementArray[placement-1].snack)
    if (placementArray[placement-1].snack == false){
        document.getElementById("Snack_snack_bar").style.display = "flex"
    } else {
        document.getElementById("Snack_snack_bar").style.display = "none"
    }
    
}

main()
async function liveUpdate() {
    console.log(client
  .channel('any')
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'scoreboard' }, payload => {
    const data = payload.new
    console.log("Refreshing...")
    main()
  })
  .subscribe())
}
liveUpdate()