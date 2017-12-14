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
                alert("Enter Animal Text");
                gbmGifs.populateAnimalButtons();
            }else{              
                //check if that already exist in the array: if it already exisit, the index will not be -1
                if (gbmGifs.buttonsArray.indexOf(newAnimal) == -1) {
                    //If it doesn't exisit in the array, then push it
                    gbmGifs.buttonsArray.push(newAnimal);
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
            //get a list of all the gifs
            var apiKey = "HKDCUnDebWZ1eBybt5aIopjO8RPrmK78";
            var gifURL = "https://api.giphy.com/v1/gifs/search?q=" + animalQuery + "&api_key=" + apiKey +"&limit=12";

            $.ajax({
                url: gifURL,
                method: "GET"
            }).done(function(response){
                for (let i = 0; i < response.data.length; i++) {
                    //Create the still image of the animal
                    var animalImageStill = response.data[i].images.fixed_width_still.url;
                    //Create the animated image of the animal
                    var animalImage = response.data[i].images.original.url;
                    //Create an ImageTag
                    var imageTag = $("<img  width='300' height='180' class='gif img-responsive thumbnail'>");
                    //Add all the needed attributes. Theses will be used to animate the image
                    imageTag.attr("src", animalImageStill).attr("alt", animalQuery).attr("data-still", animalImageStill).attr("data-animate", animalImage).attr("data-state", "still");
                    //Create a centered div that will take all the images in a bootstrap frame
                    var imgDiv = $('<center><div class="col-md-5 imgDiv">');
                    //Append a paragraph with Rating
                    imgDiv.append('<p class="rating text-center"> Rating: ' + response.data[i].rating.toUpperCase() +'</p>');
                    //Append the ImageTag into the div
                    imgDiv.append(imageTag);
                    //Append the div witht he image to the #animals div
                    $("#animals").append(imgDiv).append("<hr>");
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

    //When a user presses ENTER, click the Add-Animal-Button
    $("#add-animal").keyup(function (e) {
        //check to see if the enter key was pressed
        if (e.which === 13) {
            //if so, run the addTask function
            $(".add-animal-button").click();
        }
    });

    //When I click on Animal name button:    
    //This piece is not working with the usual jQuery Click $(".animal-name").on("click", function () {});
    $(document).on("click", ".animal-name", function () {
        //First, we empty all other animals
        $("#animals").empty();
        //Get the animalName being searched:        
        animalQuery = $(this).attr("data");
        //Then call the showGifs() method
        gbmGifs.showGifs();        
    });

    //Animate Gif on click

    $(document).on("click", ".gif", function () {
        // Let's get the state of the clicked gif: the state was added on the fly
        var state = $(this).attr("data-state");
        console.log("cliked images");
        //If the state is equal to 'still':
        if (state === "still") {
            //Change the image source and use the link in the data-animate attribute.
            $(this).attr("src", $(this).attr("data-animate"));
            //Then change the 'data-state' to animate
            $(this).attr("data-state", "animate");
        //Else, reverse back to the original
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });

});