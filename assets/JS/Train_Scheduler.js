$(document).ready(function () {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBezflAVsW8kGBSCzKov1Hg1rugmCylX6Y",
    authDomain: "monashbootcamp-46344.firebaseapp.com",
    databaseURL: "https://monashbootcamp-46344.firebaseio.com",
    projectId: "monashbootcamp-46344",
    storageBucket: "",
    messagingSenderId: "136258130818",
    appId: "1:136258130818:web:907c359fcd547da1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();


  (function () {
    'use strict';
    window.addEventListener('load', function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          } else {
            var trainName = $('#trainName').val().trim();
            var trainDestination = $('#trainDestination').val().trim()
            var firstTrainTime = $('#firstTrainTime').val()
            var trainFrequency = $('#trainFrequency').val().trim();

            var con = database.ref('/trainTimeTable').push({
              trainName: trainName,
              trainDestination: trainDestination,
              firstTrainTime: firstTrainTime,
              trainFrequency: trainFrequency
            });
          }
          form.classList.add('was-validated');
        }, false);

      });

    }, false);
  })();

  database.ref('/trainTimeTable').on('child_added', function (snapshot) {
    var row = $('<tr>');

    var currentDate = moment()

    var trainName = snapshot.val().trainName;
    var trainDestination = snapshot.val().trainDestination;
    var trainFrequency = snapshot.val().trainFrequency;
    var firstTrainTime = snapshot.val().firstTrainTime;

    // process for calculating the Next Arrival and Minutes Away fields...
    // make sure the first train time is after the current time
    var firstTrainTimeConvert = moment(firstTrainTime, "hh:mm A").subtract(1, "years");
    // store variable for current time
    var currentTime = moment().format("HH:mm");
    // store variable for difference of current time and first train time
    var trainTimeCurrentTimeDifference = moment().diff(moment(firstTrainTimeConvert), "minutes");
    // store the time left
    var timeLeft = trainTimeCurrentTimeDifference % trainFrequency;
    // calculate and store the minutes until next train arrives
    var minutesAway = trainFrequency - timeLeft;
    // calculate the next arriving train
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");


//display the timetable
    row.append($('<td>' + trainName + '</td>'));
    row.append($('<td>' + trainDestination + '</td>'));
    row.append($('<td>' + trainFrequency + ' min</td>'));
    row.append($('<td>' + nextArrival + '</td>'))
    row.append($('<td>' + minutesAway + ' min </td>'));
    $('#tableBody').append(row);
  });
});