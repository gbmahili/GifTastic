$(document).ready(() => {
    
    

    var gbmGifs = {
        //Create a buttons array:
        buttonsArray : ["DOG", "CAT", "RABBIT", "CHICKEN"],

        //populate buttons:
        populateAnimalButtons : () => {

            //Loop through and show them to the client:
            for (let i = 0; i < gbmGifs.buttonsArray.length; i++) {
                //Create a span that will hold each animal button
                var animalName = $("<span class='animal-name'>");
                //Add a data attribute that will be used to load out the gifs
                animalName.attr("data", gbmGifs.buttonsArray[i]);
                //Add the text to the span which corresponds to the array i
                animalName.text(gbmGifs.buttonsArray[i]);
                //Show the span to the user
                $("#animals-buttons").append(animalName);

            }
        },

        //When a user clicks the 'Add Animal', they should push what is added to the array
        addAnimal : function()  {
            //Get the value from the input
            var newAnimal = $("#add-animal").val();
            //Remove any white spaces and change to upperCase:
            newAnimal = newAnimal.toUpperCase().trim();
            //Check if a user entered something:
            if (!newAnimal){
                //alert("Enter Animal Text");
                gbmGifs.populateAnimalButtons();
            }else{              
                //check if that already exist in the array: if it already exisit, the index will not be -1
                if (gbmGifs.buttonsArray.indexOf(newAnimal) == -1) {
                    //If it doesn't exisit in the array, then push it
                    gbmGifs.buttonsArray.push(newAnimal);
                    $("span").css("color", "red");
                }else{
                    //Change the color of the button the user is trying to add again...
                    //TODO:
                    $("span:eq("+ gbmGifs.buttonsArray.indexOf(newAnimal)+ ")").css("color", "red");
                    //For now, alert that the button has already been added and show the index number:
                    alert("That animal already exist on INDEX: " + gbmGifs.buttonsArray.indexOf(newAnimal));
                }
                //Then call the populateAnimalButtons
                gbmGifs.populateAnimalButtons();
            }
        },

        //Show gifs when abutton is clicked
        showGifs : function()  {
            
            console.log(animalQuery);
            //get a list of all the gifs
            var apiKey = "HKDCUnDebWZ1eBybt5aIopjO8RPrmK78";
            var gifURL = "https://api.giphy.com/v1/gifs/search?q=" + animalQuery + "&api_key=" + apiKey +"&limit=10";

            $.ajax({
                url: gifURL,
                method: "GET"
            }).done(function(response){
                for (let i = 0; i < response.data.length; i++) {
                    var animalImage = response.data[i].images.original.url;
                    var imageTag = $("<img width='400' height='250'>");
                    imageTag.attr("src", animalImage).attr("alt", animalQuery);
                    //imageTag.attr("src", animalImage);
                    $("#animals").append(imageTag);
                    
                }
            });
        }

    };//End of Object


    //Call the populateAnimalButtons on page load
    gbmGifs.populateAnimalButtons();

    //Call the addAnimal method on button click:
    $(".add-animal-button").click(function (e){
        e.preventDefault();        
        //First, we empty the buttons div:
        $("#animals-buttons").empty();
        //Then call the addAnimal() method to add it to the list
        gbmGifs.addAnimal();
        //Empty the input field:
        $("#add-animal").val("");

    });

    //When I click on Animal name button:
    $(".animal-name").click( function()  {
        //First, we empty all other animals
        $("#animals").empty();
        //Get the animalName being searched:        
        animalQuery = $(this).attr("data");  
        //alert("hi");
        gbmGifs.showGifs();

    });
    //document.getElementsByTagName('span').addEventListener('click', doSomething, false);
    
    



});