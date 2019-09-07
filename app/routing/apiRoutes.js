// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on friends
// ===============================================================================

var friends = require('../data/friends.js');

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
    // API GET Requests
    // Below code handles when users "visit" a page.
    // In each of the below cases when a user visits a link
    // (ex: localhost:PORT/api/friends... they are shown a JSON of the data in the table)
    // ----------------------------------------------------------------------------------

    app.get('/api/friends', function (req, res) {
        res.json(friends);
    });
    // API POST Requests
    // Below code handles when a user submits a form and thus submits data to the server.
    // In each of the below cases, when a user submits form data (a JSON object)
    // ...the JSON is pushed to the appropriate JavaScript array
    // (ex. User fills out a survey... this data is then sent to the server...
    // Then the server saves the data to the friends array)
    // ---------------------------------------------------------------------------

    app.post('/api/friends', function (req, res) {
        // when filling out a survey --> newFriend is created
        var newFriend = req.body;
        var bestMatch = {};

        for (var i = 0; i < newFriend.scores.length; i++) {
            if (newFriend.scores[i] == "1 (Disagree)") {
                newFriend.scores[i] = 1;
            } else if (newFriend.scores[i] == "5 (Agree)") {
                newFriend.scores[i] = 5;
            } else {
                newFriend.scores[i] = parseInt(newFriend.scores[i]);
            }
        }

        //compare the difference between current user's scores against those from other users, question by question. Add up the differences to calculate the `totalDifference`.

        var bestMatchFriend = 0;
        var bestMatchDifference = 40;

        for (var i = 0; i < friends.length; i++) {
            var totalDifference = 0;

            for (var j = 0; j < friends[i].scores.length; j++) {
                var differenceOneScore = Math.abs(friends[i].scores[j] - newFriend.scores[j]);
                totalDifference += differenceOneScore;
            }

            if (totalDifference < bestMatchDifference) {
                bestMatchFriend = i;
                bestMatchDifference = totalDifference;
            }
        }

        bestMatch = friends[bestMatchFriend];

        friends.push(newFriend);

        res.json(bestMatch);
    });

};