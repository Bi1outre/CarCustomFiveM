function triggerResizeEvent() {
    var resizeEvent = new Event('resize', {
        bubbles: true,
        cancelable: false
    });
    document.body.dispatchEvent(resizeEvent);
}

function updateClientValue() {
    const priceElement = document.getElementById('price');
    const clientElement = document.getElementById('client');
    
    const priceValue = parseFloat(priceElement.innerText);
    const clientValue = priceValue * 1.20;
    
    clientElement.innerText = clientValue.toFixed(0);
}

function resetSelects() {
    var selects = document.querySelectorAll('select');
    
    selects.forEach(function(select) {
        select.selectedIndex = 0;

        var event = new Event('change', {
        });
        select.dispatchEvent(event);
    });
}

function showElements(className) {
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'block';
    }
    triggerResizeEvent()
}

function checkSelectionJantes(){
    value = document.getElementById("JantesCat").value
    if(value == 0){
        document.getElementById("choixJantes").style.display = "none";
        document.getElementById("Pneucustom").style.display ="none";
    }
    else if(value in [1,2,3,4,5,6,7,8]){
        document.getElementById("choixJantes").style.display = "flex";
        document.getElementById("Pneucustom").style.display ="none";
        $.post('https://r_tuning/MaxTireValue', JSON.stringify({
            
            cat : value
        }));
    }else {
        document.getElementById("choixJantes").style.display = "flex";
        document.getElementById("Pneucustom").style.display ="flex";
        $.post('https://r_tuning/MaxTireValue', JSON.stringify({
            
            cat : value
        }));
    }
}

function checkSelection() {
    var select = document.getElementById('PeintureCouleur');
    var cameleonDiv = document.getElementById('Cameleon');
    if (select.value === 'Caméléon') {
        cameleonDiv.style.display = 'flex';
        document.getElementById('ColorPickerPrincipal').style.display = 'none';
    } else {
        cameleonDiv.style.display = 'none';
        document.getElementById('ColorPickerPrincipal').style.display = 'flex';
    }
  }
  
function hideElements(className) {
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
    triggerResizeEvent()
}

function adjustValue(elementId, increment) {
    var inputElement = document.getElementById(elementId);
    var maxValue = parseInt(inputElement.max);
    var currentValue = parseInt(inputElement.value);
    if (!isNaN(currentValue)) {
        var newValue = currentValue + increment;

        // Vérifier si la nouvelle valeur dépasse la valeur maximale
        if (newValue > maxValue) {
            // Repasser la valeur à la valeur maximale
            inputElement.value = -1;
            newValue = -1;
        } else if (newValue < -1) {
            // Si la nouvelle valeur est -2, repasser à la valeur maximale
            inputElement.value = maxValue;
            newValue = maxValue;
        } else {
            inputElement.value = newValue;
        }
    }
    
    $.post('https://r_tuning/tuning', JSON.stringify({
        carrosserieIndex : elementId,
        carrosserieValeur : newValue
    }));
}
function adjustJante(elementId, increment) {
    var inputElement = document.getElementById(elementId);
    var maxValue = parseInt(inputElement.max);
    var currentValue = parseInt(inputElement.value);
    if (!isNaN(currentValue)) {
        var newValue = currentValue + increment;

        // Vérifier si la nouvelle valeur dépasse la valeur maximale
        if (newValue > maxValue) {
            // Repasser la valeur à la valeur maximale
            inputElement.value = -1;
            newValue = -1;
        } else if (newValue < -1) {
            // Si la nouvelle valeur est -2, repasser à la valeur maximale
            inputElement.value = maxValue;
            newValue = maxValue;
        } else {
            inputElement.value = newValue;
        }
    }
    cat = document.getElementById("JantesCat").value
    $.post('https://r_tuning/Jantes', JSON.stringify({
        numCat : cat ,
        numJante : newValue
    }));
}
function adjustcolorXenon(elementId, increment) {
    var inputElement = document.getElementById(elementId);
    var maxValue = parseInt(inputElement.max);
    var currentValue = parseInt(inputElement.value);
    if (!isNaN(currentValue)) {
        var newValue = currentValue + increment;

        // Vérifier si la nouvelle valeur dépasse la valeur maximale
        if (newValue > maxValue) {
            // Repasser la valeur à la valeur maximale
            inputElement.value = -1;
            newValue = -1;
        } else if (newValue < -1) {
            // Si la nouvelle valeur est -2, repasser à la valeur maximale
            inputElement.value = maxValue;
            newValue = maxValue;
        } else {
            inputElement.value = newValue;
        }
    }
    $.post('https://r_tuning/XenonColor', JSON.stringify({
        indexcouleurxenon :  newValue
    }));
}
function adjustcolorNeon(elementId, increment) {
    var inputElement = document.getElementById(elementId);
    var maxValue = parseInt(inputElement.max);
    var currentValue = parseInt(inputElement.value);
    if (!isNaN(currentValue)) {
        var newValue = currentValue + increment;

        // Vérifier si la nouvelle valeur dépasse la valeur maximale
        if (newValue > maxValue) {
            // Repasser la valeur à la valeur maximale
            inputElement.value = 0;
            newValue = 0;
        } else if (newValue < 0) {
            // Si la nouvelle valeur est -2, repasser à la valeur maximale
            inputElement.value = maxValue;
            newValue = maxValue;
        } else {
            inputElement.value = newValue;
        }
    }
    $.post('https://r_tuning/NeonColor', JSON.stringify({
        indexcouleurneon :  newValue
    }));
}

function checkToggleState(toggleId) {
    var toggle = document.getElementById(toggleId);
    var isChecked = toggle.checked;

    $.post('https://r_tuning/Neon', JSON.stringify({
        type : toggleId,
        bool : isChecked
    }));
}

function adjustPneuCustom(elementId, increment) {
    var inputElement = document.getElementById(elementId);
    var maxValue = parseInt(inputElement.max);
    var currentValue = parseInt(inputElement.value);
    if (!isNaN(currentValue)) {
        var newValue = currentValue + increment;

        // Vérifier si la nouvelle valeur dépasse la valeur maximale
        if (newValue > maxValue) {
            // Repasser la valeur à la valeur maximale
            inputElement.value = 0;
            newValue = 0;
        } else if (newValue < 0) {
            // Si la nouvelle valeur est -2, repasser à la valeur maximale
            inputElement.value = maxValue;
            newValue = maxValue;
        } else {
            inputElement.value = newValue;
        }
    }

    var pas = document.getElementById("categoriepneu").max 
    pas = parseInt(pas) + 1
    var actual = document.getElementById("categoriepneu").value
    var value = (pas * newValue) + parseInt(actual)
    $.post('https://r_tuning/PneuCustom', JSON.stringify({
        value : value
    }));
}
function adjustTint(elementId, increment) {
    var inputElement = document.getElementById(elementId);
    var maxValue = parseInt(inputElement.max);
    var currentValue = parseInt(inputElement.value);
    if (!isNaN(currentValue)) {
        var newValue = currentValue + increment;

        // Vérifier si la nouvelle valeur dépasse la valeur maximale
        if (newValue > maxValue) {
            // Repasser la valeur à la valeur maximale
            inputElement.value = 0;
            newValue = 0;
        }else if (newValue < 0) {
            // Si la nouvelle valeur est -2, repasser à la valeur maximale
            inputElement.value = maxValue;
            newValue = maxValue;
        }else if (newValue == 4){
            newValue = newValue + increment;
            inputElement.value = newValue;
        }else {
            inputElement.value = newValue;
        }
    }
    $.post('https://r_tuning/WindowTint', JSON.stringify({
        windowtint : newValue
    }));
}
$(document).ready(function() {
    document.body.style.display="none";

    const observer = new MutationObserver(updateClientValue);
    const config = { childList: true };
    observer.observe(document.getElementById('price'), config);
    
    var container = document.body;
    var timeoutId;
    function handleWheelEvent() {
        // Annuler le temporisateur précédent s'il existe
        clearTimeout(timeoutId);
    
        // Définir un nouveau temporisateur
        timeoutId = setTimeout(function() {
          // Le code ici sera exécuté après une pause de temps après la dernière occurrence de l'événement wheel
          triggerResizeEvent();
        }, 200); // Ajustez la durée en millisecondes selon vos besoins
      }
    // Ajout de l'événement wheel à l'élément container
    container.addEventListener('wheel', handleWheelEvent);

    document.addEventListener('keydown', function(event) {
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

        if (arrowKeys.includes(event.key)) {
            event.preventDefault();
        }
    });
    
    document.getElementById("MenuDeroulant").addEventListener('change', function(){

        var elements = document.getElementsByClassName("Modifications");
        var child = elements[0].children[0];
        if (this.checked){
            child.style.width = '45vh';
            document.getElementById('imgderoulant').style.transform = "scaleX(1.10)";
        }else {
            child.style.width = '0vh';
            document.getElementById('imgderoulant').style.transform = "scaleX(-1.05)";
        }
    })

    document.getElementById("Valider").addEventListener('click', function() {
        $.post('https://r_tuning/AskValidate', JSON.stringify({}));
    })

    document.getElementById("Facturer").addEventListener('click', function() {
        $.post('https://r_tuning/DoBill', JSON.stringify({}));
    })

    document.getElementById("Annuler").addEventListener('click', function() {
        $.post('https://r_tuning/Cancel', JSON.stringify({}));
    })
    
    document.getElementById("door").addEventListener('click', function(){
        $.post('https://r_tuning/Open', JSON.stringify({ 
            Part : "door"
        }));
    })
    document.getElementById("hood").addEventListener('click', function(){
        $.post('https://r_tuning/Open', JSON.stringify({ 
            Part : "hood"
        }));
    })
    document.getElementById("top").addEventListener('click', function(){
        $.post('https://r_tuning/Focus', JSON.stringify({ 
            Key : "Up"
        }));
    })
    document.getElementById("bot").addEventListener('click', function(){
        $.post('https://r_tuning/Focus', JSON.stringify({ 
            Key : "Down"
        }));
    })
    document.getElementById("left").addEventListener('click', function(){
        $.post('https://r_tuning/Focus', JSON.stringify({ 
            Key : "Left"
        }));
    })
    document.getElementById("right").addEventListener('click', function(){
        $.post('https://r_tuning/Focus', JSON.stringify({ 
            Key : "Right"
        }));
    })
    window.addEventListener("message", (event) =>{
        var item = event.data
        if(item !== undefined && item.type == "custom"){
            if(item.display){
                
                for (let i = 0; i < item.modavailable.length ; i++){
                    let actual = (item.modavailable[i]).toString()
                    let divElement = document.getElementById(actual);
                    if(divElement){
                        divElement.style.display = "flex";
                        divElement.querySelector('p').textContent = item.namemod[i]
                        divElement.querySelector('input').max = item.availablemax[i]-1
                        divElement.querySelector('input').value = item.actualmod[i]
                    }
                }

                for (let i = 0;i < item.modnotavailable.length;i++){
                    let actual = (item.modnotavailable[i]).toString()
                    let divElement = document.getElementById(actual);
                    if(divElement){
                        divElement.style.display = "none";
                    }

                }
                var doc = document.getElementById("ListeModif");
                while (doc.firstChild) {
                    doc.removeChild(doc.firstChild);
                }
                document.getElementById("fenetre").value = item.WindowTint

                document.getElementById("Moteur").checked = item.Moteur
                document.getElementById("Freins").checked = item.Freins
                document.getElementById("Transmission").checked = item.Transmission
                document.getElementById("Turbo").checked = item.Turbo

                document.getElementById("Neon").checked = item.Neon
                document.getElementById("Xenon").checked = item.Xenon
                document.getElementById("price").textContent = 0
                document.body.style.display = "flex";
                resetSelects();
                triggerResizeEvent();
            }
            else if(item.display === false){
                document.body.style.display = "none";
            }
        }else if (item !== undefined && item.type == 'response:tuning') {
            let divId = (item.index).toString();
            let divElement = document.getElementById(divId);
            let pElement = divElement.querySelector('p');
            pElement.textContent = item.value.toString();
        }
        else if (item !== undefined && item.type == 'MaxTireValueResponse') {
            document.getElementById("categoriepneu").max = item.max
        }
        else if (item !== undefined && item.type == 'Modify') {
            if(item.Price){
                itemPrice = parseFloat(item.Price);
            }
            montantActuelle = parseFloat(document.getElementById("price").textContent);

            if (item.toDelete){
                if(["Neon","Xenon","Moteur","Transmission","Freins","Turbo"].includes(item.Label)){
                    let itemPrice = parseFloat(document.querySelectorAll('#' + item.Label)[1].getAttribute("data-cost"));
                    document.querySelectorAll('#' + item.Label)[1].remove()

                    newMontant = montantActuelle - itemPrice;
                
                    document.getElementById("price").textContent = newMontant
                }else{
                    if(document.getElementById(item.Label)){
                        let itemPrice = parseFloat(document.getElementById(item.Label).getAttribute("data-cost"));
                        document.getElementById(item.Label).remove()
                        newMontant = montantActuelle - itemPrice;
                
                        document.getElementById("price").textContent = newMontant
                    }
                }

                
            }else {
                if(document.getElementById(item.Label) && ((item.Label!="Xenon") && (item.Label!="Neon") && (item.Label!="Moteur") && (item.Label!="Transmission") &&(item.Label!="Freins") && (item.Label!="Turbo") ) ){
                    
                }
                else{
                    newMontant = montantActuelle + itemPrice;
                    document.getElementById("price").textContent = newMontant

                    doc = document.getElementById("ListeModif")

                    newDiv = document.createElement('div')
                    newDiv.setAttribute("data-cost", item.Price);
                    newDiv.id = item.Label
                    newDiv.classList.add("Piece")

                    newP = document.createElement('p')
                    newP.textContent = item.Label
                    newDiv.appendChild(newP)

                    newButton = document.createElement('button')
                    newImg = document.createElement('img')
                    newImg.src = "images/delete.png"

                    newButton.appendChild(newImg)
                    newDiv.appendChild(newButton)
                    doc.appendChild(newDiv)

                    newButton.addEventListener('click',function(){
                        let parentDiv = this.parentNode;
                        let itemPrice = parseFloat(parentDiv.getAttribute("data-cost"));
                        parentDiv.remove();
                        let montantActuelle = parseFloat(document.getElementById("price").textContent);
                        let newMontant = montantActuelle - itemPrice;
                        document.getElementById("price").textContent = newMontant

                        $.post('https://r_tuning/List', JSON.stringify({
                            retour : item.Label
                        }));
                    })
                }
            }
        }
        else if (item !== undefined && item.type == 'change') {
            document.getElementById(item.TypeModif).checked = item.check
        }
        else if (item !== undefined && item.type == 'changeMod') {
            document.getElementById(item.Cat).querySelector("input").value = item.value
        }
    })

    
});

