$(document).ready(() => {  
    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAK1XlyW-eK16a8tXT1H8Vqz6UDxOEblgs",
        authDomain: "rutgersfirebaseintro.firebaseapp.com",
        databaseURL: "https://rutgersfirebaseintro.firebaseio.com",
        projectId: "rutgersfirebaseintro",
        storageBucket: "rutgersfirebaseintro.appspot.com",
        messagingSenderId: "685944157008"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    //Get animals from the db
    // Firebase is always watching for changes to the data.
    // When changes occurs it will print them to console and html    
    database.ref().on("value", function (resp) {
        gbmGifs.buttonsArray = resp.val();
        //Show the animals from the firebase database
        populateFireBaseGifs();

    }, function (error) {
         console.log("There was an error: " + error.code);
    });

    var populateFireBaseGifs = () => {
        //Loop through and show them to the client:
        for (let i = 0; i < gbmGifs.buttonsArray.animals.length; i++) {
            //Create a span that will hold each animal button
            var animalName = $("<span class='animal-name'>");
            //Add a data attribute that will be used to load out the gifs
            animalName.attr("data", gbmGifs.buttonsArray.animals[i]);
            //Add the text to the span which corresponds to the array i
            animalName.text(gbmGifs.buttonsArray.animals[i]);
            //Show the span to the user
            $("#animals-buttons").append(animalName);
        }
    };

    //Object:
    var gbmGifs = {

        //Create a buttons array:  This list is populated from Firebase db
        buttonsArray  : [],

        //When a user clicks the 'Add Animal', they should push what is added to the array
        addAnimal : function()  {
            //Get the value from the input
            var newAnimal = $("#add-animal").val();
            //Remove any white spaces and change to upperCase:
            newAnimal = newAnimal.toUpperCase().trim();
            //Check if a user entered something:
            if (!newAnimal){
                //Show an alert that
                alert("Please enter the animal's name!");
                //Get the list of animals from firebase and show them
                populateFireBaseGifs();
            }else{              
                //check if that already exist in the array: if it already exisit, the index will not be -1
                if (gbmGifs.buttonsArray.animals.indexOf(newAnimal) == -1) {
                    //If it doesn't exisit in the array, then push it
                    gbmGifs.buttonsArray.animals.push(newAnimal);
                    //Save the new array in the database:                    
                    database.ref().set({
                        animals: gbmGifs.buttonsArray.animals
                    });
                }else{
                    //Change the color of the button the user is trying to add again...
                    //TODO:
                    $("span:eq("+ gbmGifs.buttonsArray.animals.indexOf(newAnimal)+ ")").css("color", "red");
                    //For now, alert that the button has already been added and show the index number:
                    alert("That animal already exist on INDEX: " + gbmGifs.buttonsArray.animals.indexOf(newAnimal));
                    //Show the animals from firebase
                    populateFireBaseGifs();
                }
            }
        },

        //Clear animals
        clearAnimals : () => {
            database.ref().set({
                animals: ["MONKEY"]
            });
            //populateFireBaseGifs();

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

    //Clear animals buttons:
    $(".clear-animal-button").click(function (e) {
        e.preventDefault();
        //First, we empty the buttons div:
        $("#animals-buttons").empty();
        //Check if there are more than one button in the div
        if (gbmGifs.buttonsArray.animals.length > 1){        
            //Then call the addAnimal() method to add it to the list        
            if (confirm("Are you sure? Removing all animals will clear the database and leave one animal only. Are you really sure?") == true){
                gbmGifs.clearAnimals();
                //Empty the input field:
                $("#add-animal").val("");
                $("#animals").empty();
            }else{
                populateFireBaseGifs();
            }        
        }else{
            alert("There is only one button, you can only remove buttons when there is more than one");
            populateFireBaseGifs();
        }
        console.log(gbmGifs.buttonsArray.animals.length);

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