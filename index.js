var winBarCharts={}
var lossBarCharts={}

var winSubbarCharts={}
var lossSubarCharts={}

var driverArray =["BuyerInterview"]

var SheetName;
var numofWins=0;
var numofLoss=0;

//**************************************************************************************************************
// display checkboxes
$('#AllChannels').click(function() { 
  $(this.form.elements).filter('#BuyerSurveys').prop('checked', this.checked);
  $(this.form.elements).filter('#RepSurveys').prop('checked', this.checked);
  if($("#BuyerInterview").prop("checked", false)){
    $(this.form.elements).filter('#BuyerInterview').prop('checked', this.checked);
  }
  if($('input:checked').length === 0){
    $("#BuyerInterview").prop("checked", true)
  }
});
// the rule of when a user clicks a checkbox
document.getElementById("BuyerInterview").addEventListener("click", function(){

  if(driverArray.includes("BuyerInterview")){
    driverArray = driverArray.filter(x => x !== "BuyerInterview")
  }
  else{
    driverArray.push("BuyerInterview")
  }

  if(driverArray.length === 0){
    driverArray.push("BuyerInterview")
    document.querySelector('#BuyerInterview').checked = true
  }
  disPlayDrivers(driverArray)
});
document.getElementById("BuyerSurveys").addEventListener("click", function(){

  if(driverArray.includes("BuyerSurveys")){
    driverArray = driverArray.filter(x => x !== "BuyerSurveys")
  }
  else{
    driverArray.push("BuyerSurveys")
  }

  if(driverArray.length === 0){
    driverArray.push("BuyerInterview")
    document.querySelector('#BuyerInterview').checked = true
  }
  disPlayDrivers(driverArray)
});
document.getElementById("RepSurveys").addEventListener("click", function(){

  if(driverArray.includes("RepSurveys")){
    driverArray = driverArray.filter(x => x !== "RepSurveys")
  }
  else{
    driverArray.push("RepSurveys")
  }

  if(driverArray.length === 0){
    driverArray.push("BuyerInterview")
    document.querySelector('#BuyerInterview').checked = true
  }
  disPlayDrivers(driverArray)
});
document.getElementById("AllChannels").addEventListener("change", function(){

  if(this.checked){
    driverArray = ["BuyerInterview", "BuyerSurveys", "RepSurveys"]
  }
  else{
    driverArray = ["BuyerInterview"]
  }
  disPlayDrivers(driverArray)
});
//**************************************************************************************************************

// default page
disPlayDrivers(driverArray)

//**************************************************************************************************************
// drivers page 
function disPlayDrivers(driverName){
  fetch('dataset.xlsx').then(function (res) {
    if (!res.ok) throw new Error("fetch failed");
    return res.arrayBuffer();
  })
  .then(function (res) {
    
    var data = new Uint8Array(res);
    var workbook = XLSX.read(data, {type: "array"});

    const leftbox = document.querySelector('.leftbox');
    const rightbox = document.querySelector('.rightbox');

    console.log(driverName)

    for(let z=0; z<driverName.length; z++){
      
      //loop each channel name in driverName
      switch(driverName[z]) {
        case "BuyerInterview":
          SheetName = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[3]], { raw: true }); 
          break;
        case "BuyerSurveys":
          SheetName = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[2]], { raw: true }); 
          break;
        case "RepSurveys":
          SheetName = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]], { raw: true }); 
          break;
        default:
      }

      // console.log(SheetName)

      var leftChild = leftbox.querySelectorAll("section");
      var rightChild = rightbox.querySelectorAll("section")

      var checkboxes = document.querySelector('.leftbox').childElementCount
      // if the user alraady clicked a driver, and then delete all subdrivers on the page
      if(checkboxes > 0){
        leftChild.forEach(x => x.remove())
        rightChild.forEach(y => y.remove())
        numofWins=0;
        numofLoss=0;
      }

      var outComeIndex=0;
      // open the dataset, locate the outcome column
      for(let i=0; i<Object.entries(SheetName[0]).length; i++){
        if(Object.values(SheetName[0])[i] === "Outcome"){
          var outComeIndex = i;
        }
      }
      // open the dataset, locate the win column and lose column
      for(let j=0; j<Object.entries(SheetName).length; j++){
        if(Object.values(SheetName[j])[outComeIndex] === "win"){
          numofWins++;
        }
        else if(Object.values(SheetName[j])[outComeIndex] === "Loss to Competitor" 
        || Object.values(SheetName[j])[outComeIndex] === "Lost to Competitor"
        || Object.values(SheetName[j])[outComeIndex] === "Loss to Competitor"
        || Object.values(SheetName[j])[outComeIndex] === "Loss to No Decision"){
          numofLoss++;
        }
      }
      // add propertu to winBarCharts and lossBarCharts
      if(z===0){
        for (let [key, value] of Object.entries(SheetName[0])){
          for(let i=0; i<Object.entries(SheetName[0]).length; i++){
              if(key === i.toString()){
                winBarCharts[value] = 0
                lossBarCharts[value] = 0;
              }
          }
        }
      }

      // calculate how many wins and losses
      for(let i=0; i<Object.keys(winBarCharts).length; i++){
        var winCount=0;
        var loseCount=0;
        for (let j=0; j<Object.entries(SheetName[0]).length; j++){

          if(Object.values(SheetName[0])[j] === Object.keys(winBarCharts)[i]){

            // console.log(Object.keys(winBarCharts)[i])
            for(let k=1; k<SheetName.length; k++){
              if(Object.values(SheetName[k])[outComeIndex] === "win"){
                winCount += Object.values(SheetName[k])[j]
              }
              else if(Object.values(SheetName[k])[outComeIndex] === "Loss to Competitor" 
              || Object.values(SheetName[k])[outComeIndex] === "Lost to Competitor"
              || Object.values(SheetName[k])[outComeIndex] === "Loss to Competitor"
              || Object.values(SheetName[k])[outComeIndex] === "Lost to No Decision"
              || Object.values(SheetName[k])[outComeIndex] === "Loss to No Decision"
              || Object.values(SheetName[k])[outComeIndex] === "loss"){
                loseCount += Object.values(SheetName[k])[j]
              }
            }
          }
        }

        winBarCharts[Object.keys(winBarCharts)[i]] += winCount
        lossBarCharts[Object.keys(lossBarCharts)[i]] += loseCount
        
      }
    }

    // sort winBarCharts and lossBarCharts
    var sortedWinDrivers = Object.entries(winBarCharts).sort((a, b) => b[1] - a[1]);
    var sortedLossDrivers = Object.entries(lossBarCharts).sort((a, b) => a[1] - b[1]);
    
    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ deal with the data ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ create the all nodes and charts ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    for(let i=0; i<Object.keys(sortedWinDrivers).length; i++){

      var leftsectionTag = document.createElement('section');
      var leftdivTag = document.createElement('div');
      var leftdriverTag = document.createElement('p');

      var leftNumDivTag = document.createElement('div');
      var leftNumTag = document.createElement('p');

      var leftdriversName = Object.values(sortedWinDrivers)[i][0]
      var leftdrivers = document.createTextNode(leftdriversName)
    
      leftsectionTag.setAttribute("class", "leftsection")

      leftdriverTag.appendChild(leftdrivers)
      leftdivTag.id = "left" + leftdriversName.replace(/[^A-Za-z0-9_]/g,"");
      leftdivTag.setAttribute('onclick', "displaySubdrivers("+leftdivTag.id+")");
      leftdivTag.setAttribute('class', "leftdrivername");
      leftNumDivTag.setAttribute("id", leftdivTag.id + "NumTag")
      leftNumDivTag.setAttribute("class", "NumTag")

      leftbox.appendChild(leftsectionTag)
      leftsectionTag.appendChild(leftdivTag)
      leftdivTag.appendChild(leftdriverTag)



      var rightsectionTag = document.createElement('section');
      var rightdivTag = document.createElement('div');
      var rightdriverTag = document.createElement('p');

      var rightNumDivTag = document.createElement('div');
      var rightNumTag  = document.createElement('p');

      var rightdriversName = Object.values(sortedLossDrivers)[i][0]
      var rightdrivers = document.createTextNode(rightdriversName)

      rightsectionTag.setAttribute("class", "rightsection")

      rightdriverTag.appendChild(rightdrivers)
      rightdivTag.id = "right" + rightdriversName.replace(/[^A-Za-z0-9_]/g,"");
      rightdivTag.setAttribute('onclick', "displaySubdrivers("+rightdivTag.id + ")");
      rightdivTag.setAttribute('class', "rightdrivername");
      rightNumDivTag.setAttribute("id", rightdivTag.id + "NumTag")
      rightNumDivTag.setAttribute("class", "NumTag")

      rightbox.appendChild(rightsectionTag)
      rightsectionTag.appendChild(rightdivTag)
      rightdivTag.appendChild(rightdriverTag)



      var leftdiv = d3.select(".leftsection:nth-child(" + (i+1) +")")
      .append('div')
      .attr('class', leftdivTag.id+"chart")

      var leftNum = (Object.values(sortedWinDrivers)[i][1] / numofWins).toFixed(3)
      var leftdriversNum = document.createTextNode(leftNum)
      leftNumTag.appendChild(leftdriversNum)
      leftNumDivTag.appendChild(leftNumTag)
      // leftsectionTag.appendChild(leftNumDivTag)
      
      var leftsvg = leftdiv.append('svg')

      const transition = d3.transition().duration(2000)

      var leftrects = leftsvg.append('rect')
      leftrects.attr('width', 0)
        .attr("height", 27)
        .attr("fill", "#45A263")
        .attr("rx", 4)
        .attr("ry", 3)
        .attr("x", 0)
        .attr("y", 50)
        .transition(transition)
          .attr('width', Math.abs(leftNum*250))
          .attr("rx", 4)
          .attr("ry", 3)

      leftsvg.append("text")
        .text(leftNum)
        .attr("fill", "black")
        .attr("x", Math.abs(leftNum*250)/4)
        .attr("y", 43)


      // console.log((Math.abs(Object.values(sorteddisplayDrivers)[i][1]) / numofWins).toFixed(3))



      var rightdiv = d3.select(".rightsection:nth-child(" + (i+1) +")")
      .append('div')
      .attr('class', rightdivTag.id+"chart")

      var rightNum = (Object.values(sortedLossDrivers)[i][1] / numofLoss).toFixed(3)
      var rightdriversNum = document.createTextNode(rightNum)
      rightNumTag.appendChild(rightdriversNum)
      rightNumDivTag.appendChild(rightNumTag)
      // rightsectionTag.appendChild(rightNumDivTag)

      var rightsvg = rightdiv.append('svg')

      var rightrects = rightsvg.append('rect')
      rightrects.attr('width', 0)
        .attr("height", 27)
        .attr("fill", "#E0433C")
        .attr("rx", 4)
        .attr("ry", 3)
        .attr("x", 0)
        .attr("y", 50)
        .transition(transition)
          .attr('width', Math.abs(rightNum*250))
          .attr("rx", 4)
          .attr("ry", 3)

      rightsvg.append("text")
          .text(rightNum)
          .attr("fill", "black")
          .attr("x", Math.abs(rightNum*250)/5)
          .attr("y", 44)

      // console.log((Math.abs(Object.values(sorteddisplayDrivers)[i][1]) / numofLoss).toFixed(3))
    }

    console.log("numofWins: " + numofWins)
    console.log("numofLoss: " + numofLoss)
  })
}

//**************************************************************************************************************








//**************************************************************************************************************
function displaySubdrivers(id){
  
  fetch('dataset.xlsx').then(function (res) {
    if (!res.ok) throw new Error("fetch failed");
    return res.arrayBuffer();
  })
  .then(function (res) {

    var letters = "abcdefghijklmnopqrstuvwxyz";

    var data = new Uint8Array(res);
    var workbook = XLSX.read(data, {type: "array"});

    id=id.id

    // console.log(id)

    var displayWinSubDrivers = {};
    var displayLossSubDrivers = {};

    var checkChild = document.querySelector('#'+ id)
    var checkCharts = document.querySelector('.'+id+'chart')
    var numTag = document.querySelector("#" + id + "NumTag")
   

    var allChild = checkChild.querySelectorAll("h4");
    var subCharts = checkCharts.querySelectorAll(".subdriverscharts")
    //var checknumTag = numTag.querySelectorAll("h4")
    // var checknumTag = numTag.querySelectorAll("p")

    var checkChildCount = document.querySelector('#'+ id).childElementCount

    if(checkChildCount === 1){

      for(let z=0; z<driverArray.length; z++){

        switch(driverArray[z]) {
          case "BuyerInterview":
            SheetName = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[3]], { raw: true }); 
            break;
          case "BuyerSurveys":
            SheetName = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[2]], { raw: true }); 
            break;
          case "RepSurveys":
            SheetName = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]], { raw: true }); 
            break;
          default:
        }

        var outComeIndex=0;

        for(let i=0; i<Object.entries(SheetName[0]).length; i++){
          if(Object.values(SheetName[0])[i] === "Outcome"){
            var outComeIndex = i;
          }
        }

        if(z===0){
          for (let [key, value] of Object.entries(SheetName[0])){
            for(let i=0; i<Object.entries(SheetName[0]).length; i++){
              if(key.substring(0,1) === i.toString()){
                for(let j=0; j<letters.length; j++){
                  if(key.substring(1,2) === letters[j]){
                    winSubbarCharts[value] = 0  
                    lossSubarCharts[value] = 0  
                  }
                }
              }
            }
          }
        }

  
      for(let i=0; i<Object.entries(winSubbarCharts).length; i++){
        var winCount=0;
        var loseCount=0;
        for (let j=0; j<Object.entries(SheetName[0]).length; j++){
  
          if(Object.values(SheetName[0])[j] === Object.keys(winSubbarCharts)[i]){
  
            // console.log(Object.keys(driverObject)[i])
            for(let k=1; k<SheetName.length; k++){
              if(Object.values(SheetName[k])[outComeIndex] === "win"){
                winCount += Object.values(SheetName[k])[j]
              }
              else if(Object.values(SheetName[k])[outComeIndex] === "loss" 
              || Object.values(SheetName[k])[outComeIndex] === "Loss to Competitor" 
              || Object.values(SheetName[k])[outComeIndex] === "Lost to Competitor"
              || Object.values(SheetName[k])[outComeIndex] === "Loss to No Decision"
              || Object.values(SheetName[k])[outComeIndex] === "Lost to No Decision"){
                loseCount += Object.values(SheetName[k])[j]
              }
            }
          }
        }
        winSubbarCharts[Object.keys(winSubbarCharts)[i]] += winCount
        lossSubarCharts[Object.keys(lossSubarCharts)[i]] += loseCount
      }

      
      
      // console.log(winSubbarCharts)
      // console.log(lossSubarCharts)
  
      var replacedID = id.replace("left", "");
      replacedID = replacedID.replace("right", "");
  
      for(let i=0; i<Object.keys(winSubbarCharts).length; i++){
  
        if(Object.keys(winSubbarCharts)[i].replace(/[^A-Za-z0-9_]/g,"").includes(replacedID)){
          displayWinSubDrivers[Object.keys(winSubbarCharts)[i]] = Object.values(winSubbarCharts)[i]
        }
        if(Object.keys(lossSubarCharts)[i].replace(/[^A-Za-z0-9_]/g,"").includes(replacedID)){
          displayLossSubDrivers[Object.keys(lossSubarCharts)[i]] = Object.values(lossSubarCharts)[i]
        }
      }
  
      var sorteddisplayWinSubDrivers = Object.entries(displayWinSubDrivers).sort((a, b) => b[1] - a[1]);
      var sorteddisplayLossSubDrivers = Object.entries(displayLossSubDrivers).sort((a, b) => a[1] - b[1]);
    }

    console.log(sorteddisplayLossSubDrivers)

    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ deal with the data ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ create the all nodes and charts ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

      for(let i=0; i<Object.keys(sorteddisplayWinSubDrivers).length; i++){
  
        var subleftdriverTag = document.createElement('h4');
        var subleftdriverName = Object.values(sorteddisplayWinSubDrivers)[i][0]


        var subrightdriverTag = document.createElement('h4');
        var subrightdriverName = Object.values(sorteddisplayLossSubDrivers)[i][0]


        var leftNums = (Object.values(sorteddisplayWinSubDrivers)[i][1] / numofWins).toFixed(3)
        var rightNums = (Object.values(sorteddisplayLossSubDrivers)[i][1] / numofLoss).toFixed(3)

        console.log(rightNums)
        var tags = document.createElement("h4")

        // differentiate the win side and the lose side by id
        if(id.includes("left")){
          
          var nums = document.createTextNode(leftNums)
          tags.appendChild(nums)
          // numTag.appendChild(tags) 

          var subleftdriver = document.createTextNode(subleftdriverName)
          subleftdriverTag.appendChild(subleftdriver)
          var divleftTag = document.querySelector('#' + id)
          divleftTag.appendChild(subleftdriverTag)
        }
        else if(id.includes("right")){

          var nums = document.createTextNode(rightNums)
          tags.appendChild(nums)
          // numTag.appendChild(tags)

          var subrightdriver = document.createTextNode(subrightdriverName)
          subrightdriverTag.appendChild(subrightdriver)
          var divrightTag = document.querySelector('#' + id)
          divrightTag.appendChild(subrightdriverTag)
        }

        var div = d3.select('.' + id + 'chart')

        const transition = d3.transition().duration(2000)
        
        var svg = div.append('svg')
        .attr("class", "subdriverscharts")

        // console.log(sorteddisplaySubDrivers)


        // differentiate the win side and the lose side by id, and display it in different color
        if(id.includes("left")){
          var rects = svg.append('rect')
          rects.attr('width', 0)
          .attr("height", 23)
          .attr("fill", "#45A263")
          .attr("rx", 4)
          .attr("ry", 3)
          .attr("x", 0)
          .attr("y", 30)
          .transition(transition)
            .attr('width', Math.abs(leftNums*250))
            .attr("rx", 4)
            .attr("ry", 3)
          
          svg.append("text")
          .text(leftNums)
          .attr("fill", "black")
          .attr("x", Math.abs(leftNums*250)/4)
          .attr("y", 30)

            // console.log((Object.values(sorteddisplaySubDrivers)[i][1] / numofWins).toFixed(3)*50)
        }
        else if(id.includes("right")){
          var rects = svg.append('rect')
          rects.attr('width', 0)
          .attr("height", 23)
          .attr("fill", "#E0433C")
          .attr("rx", 4)
          .attr("ry", 3)
          .attr("x", 0)
          .attr("y", 30)
          .transition(transition)
            .attr('width', Math.abs(rightNums*250))
            .attr("rx", 4)
            .attr("ry", 3)

          svg.append("text")
            .text(rightNums)
            .attr("fill", "black")
            .attr("x", Math.abs(rightNums*250)/4)
            .attr("y", 30)

            // console.log((Object.values(sorteddisplaySubDrivers)[i][1] / numofLoss).toFixed(3)*50)
        }
      }
    }
    // if there is subdrivers under a driver, if the user click the driver again, just get rid of all subdrivers, otherwise it would repeat all subdrivers after subdrivers
    else if(checkChildCount > 1){
      subCharts.forEach(x => x.remove())
      allChild.forEach(z => z.remove())
      checknumTag.forEach(k => k.remove())
    }
    })
}
//**************************************************************************************************************