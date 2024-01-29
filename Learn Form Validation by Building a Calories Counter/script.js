const calorieCounter=document.getElementById('calorie-counter');
const budgetNumberInput=document.getElementById('budget');
const entryDropdown=document.getElementById('entry-dropdown');
const addEntryButton=document.getElementById('add-entry');
const clearButton=document.getElementById('clear');
const output=document.getElementById('output');
let isError=false;

function cleanInputString(str){
    const regex=/[+-\s]/g;
    return str.replace(regex,"");
}

function isInvalidInput(str){
    const regex=/\d+e\d+/i;
    return str.match(regex);
}

function addEntry(){
    //'document.querySelector' allows we to select and retrieve the first HTML element that matches a specified CSS selector within the document
    const targetInputContainer=document.querySelector(`#${entryDropdown.value} .input-container`);
    //querySelectorAll similar to document.querySelector, but instead of returning the first element that matches a specified CSS selector
    // it returns a NodeList containing all the elements that match the selector.
    const entryNumber=targetInputContainer.querySelectorAll('input[type="text"]').length+1;
    const HTMLString=`
        <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
        <input type="text" id="Name" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name"/>
        <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
        <input type="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories"/>
    `;
    //Your other bug occurs if you add a Breakfast entry, fill it in, then add a second Breakfast entry. 
    // it will disappeared
    //This is because you are updating innerHTML directly, which does not preserve your input content.
    //targetInputContainer.innerHTML+=HTMLString
    //The insertAdjacentHtml method takes two arguments.
    //The first argument is a string that specifies the position of the inserted element
    //The second argument is a string containing the HTML to be inserted.
    //For the first argument, pass the string beforeend to insert the new element as the last child of targetInputContainer.
    targetInputContainer.insertAdjacentHTML("beforeend",HTMLString);
}
//.addEventListener() method takes two arguments
//The first is the event to listen to-we will choose click
// The second is the callback function, or the function that runs when the event is triggered. - pass the addEntry to method
addEntryButton.addEventListener("click",addEntry);

function getCaloriesFromInputs(list){
    let calories=0;
    for(let i=0;i<list.length;i++){
        const currVal=cleanInputString(list[i].value);
        const invalidInputMatch=isInvalidInput(currVal);
        if(invalidInputMatch){
            //Browsers have a built in alert() function, which you can use to display a pop-up message to the user
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError=true;
            return null;
        }
        calories+=Number(currVal);
    }
    return calories;
}

function calculateCalories(e){
    e.preventDefault();
    isError=false;
    const breakfastNumberInputs=document.querySelectorAll('#breakfast input[type=number]');
    const lunchNumberInputs=document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs=document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs=document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs=document.querySelectorAll('#exercise input[type=number]');
    const breakfastCalories=getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories=getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories=getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories=getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories=getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories=getCaloriesFromInputs([budgetNumberInput]);
    if(isError){
        return;
    }
    const consumedCalories=breakfastCalories+lunchCalories+dinnerCalories+snacksCalories;
    const remainingCalories=budgetCalories-consumedCalories+exerciseCalories;
    const surplusOrDeficit=(remainingCalories>=0?"Surplus":"Deficit");
    output.innerHTML=`
        <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
        <hr>
            <p>${budgetCalories} Calories Budgeted</p>
            <p>${consumedCalories} Calories Consumed</p>
            <p>${exerciseCalories} Calories Burned</p>
        </hr>
    `;
    //Your output variable is an Element, which has a classList property
    //This property has a .remove() method, which accepts a string representing the class to remove from the element.
    output.classList.remove("hide");
}

calorieCounter.addEventListener("submit",calculateCalories);

function clearForm(){
    //Conversion to Array: If you need to use array methods on a NodeList, you can convert it to an array using methods like Array.from or the spread syntax.
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));
    for(let i=0;i<inputContainers.length;i++){
        inputContainers[i].innerHTML="";
    }
    budgetNumberInput.value="";
    //The difference between innerText and innerHTML is that innerText will not render HTML elements, but will display the tags and content as raw text.
    output.innerText="";
    output.classList.add("hide");
}

clearButton.addEventListener("click",clearForm);