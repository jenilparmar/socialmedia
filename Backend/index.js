const express = require("express");
const mongoose = require("mongoose");
const { MongoClient, ObjectId } = require("mongodb");

const {
  getImageL1,
  getImageL2,
  getImageL3,
  getImageL4,
} = require("./likeConfiguration");

const PORT = 5000;
const app = express();
url = "mongodb://127.0.0.1:27017/SocailMedia";
const dbName = "MemeMenia";
let db;
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected successfully to MongoDB server");
    db = client.db(dbName);
  })
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(express.json());
function getLikeInfo(acn, pera) {
  db.collection("Posts")
    .findOne({ accountName: acn })
    .then((data) => {
      return data["likes"][pera];
    })
    .catch((e) => {
      return e;
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/users/:email", (req, res) => {
  const email = req.params.email;
  const user = {
    email: email,
  };
  db.collection("Users")
    .findOne(user)
    .then((data) => {
      console.log(data);
      res.send(data);
      // res.sendStatus(404)
    })
    .catch((error) => console.log(error));
});
app.post("/Posts", (req, res) => {
  const post = req.body;

  db.collection("Posts")
    .insertOne(post)
    .then((data) => {
      let insertedId = data.insertedId; // Get the inserted ID
      // Update the FindUser collection with the post ID
      db.collection("FindUser")
        .updateOne(
          { accountName: post.accountName }, // Assuming you're using accountName to identify the user
          { $push: { posts: insertedId } } // Add the post ID to the user's posts array
        )
        .then(() => {
          res.send("Post saved successfully and linked to the user.");
        })
        .catch((error) => {
          console.error("Error updating FindUser collection:", error);
          res.status(500).send("Error updating FindUser collection.");
        });
    })
    .catch((error) => {
      console.error("Error inserting post:", error);
      res.status(500).send("Error inserting post.");
    });
});
app.get("/PostData/:name", (req, res) => {
  const name = req.params.name;

  db.collection("Posts")
    .findOne({ accountName: name }) // Query for a document where the 'name' field matches the provided name
    .then((data) => {
      if (data) {
        res.json(data); // Send the found document as a JSON response
      } else {
        res.status(404).send("No document found with the given name"); // Handle case where no document is found
      }
    })
    .catch((e) => {
      console.error("Error fetching data", e);
      res.status(500).send("Error fetching data"); // Handle potential errors
    });
});
app.get("/GetAllPosts", (req, res) => {
  db.collection("Posts")
    .find({})
    .toArray()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error("Error fetching data", error);
      res.status(500).send("Error fetching data");
    });
});
app.get("/search/:name", (req, res) => {
  const name = req.params.name;
  db.collection("FindUser")
    .findOne({ accountName: name })
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
});
app.get("/Auth/:email/:passward", (req, res) => {
  const email = req.params.email;
  const passward = req.params.passward;
  db.collection("Users")
    .findOne({
      email: email,
      passward: passward,
    })
    .then((data) => {
      if (data) res.send(data);
      else {
        res.sendStatus(404);
      }
    })
    .catch((e) => res.send(e));
});
app.get("/Dataentry/:email/:passward/:name", (req, res) => {
  const email = req.params.email;
  const name = req.params.name;
  const passward = req.params.passward;
  const data2 = {
    accountName: name,
    post: {},
    followers: 0,
    following: 0,
    imgUrl: "lkjdg",
  };
  db.collection("Users")
    .insertOne({
      email: email,
      accountName: name,
      passward: passward,
    })
    .then((data) => {
      db.collection("FindUser")
      .insertOne(data2)
      res.status(200).send(data);
    })
    .catch((e) => res.send(e));
 
});
app.get("/ForgotPass/:email", (req, res) => {
  const email = req.params.email;
  db.collection("Users")
    .findOne({ email: email })
    .then((data) => res.send(data["passward"]))
    .catch((e) => res.send(e));
});
app.get("/PostComment/:id/:text", (req, res) => {
  const id = req.params.id;
  const text = req.params.text;

  try {
    const objectId = new ObjectId(id);

    db.collection("Posts")
      .updateOne({ _id: objectId }, { $push: { comments: text } })
      .then((result) => {
        if (result.modifiedCount > 0) {
          res.send("Comment added successfully");
        } else {
          res.status(404).send("Post not found");
        }
      })
      .catch((e) => {
        console.error("Error updating post comments:", e);
        res.status(500).send("Internal Server Error");
      });
  } catch (error) {
    console.error("Invalid ID format:", error);
    res.status(400).send("Invalid ID format");
  }
});
app.get("/Addlike/:id/:pera", (req, res) => {
  const id = req.params.id;
  const pera = req.params.pera;

  db.collection("Posts")
    .updateOne(
      { _id: new ObjectId(id) }, // Filter by the post's ObjectId
      { $inc: { ["likes." + pera]: 1 } } // Increment the likes by 1 for the specified pera
    )
    .then((result) => {
      // Check if the update was successful
      if (result.modifiedCount > 0) {
        res.send("Like added successfully");
      } else {
        res.status(404).send("Post not found");
      }
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error updating like:", error);
      res.status(500).send("Internal server error");
    });
});
app.get("/findUser/:name", (req, res) => {
  const name = req.params.name;
  db.collection("FindUser")
    .insertOne({
      accountName: name,
    })
    .then((data) => {
      res.send("successfully added");
    })
    .catch((e) => {
      console.log(e);
    });
});
app.get('/getProfilePosts/:name', (req, res) => {
  const name = req.params.name;
  db.collection('Posts').find({ accountName: name })
    .toArray() // Convert the cursor to an array
    .then(posts => {
      if (posts.length > 0) {
        res.send(posts);
      } else {
        res.status(404).send("No posts found for the given accountName.");
      }
    })
    .catch(e => {
      console.log("Error:", e);
      res.status(500).send("An error occurred while fetching profile posts.");
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/GetLikeButtons", (req, res) => {
  const likesObj = {
    1: getImageL1(),
    2: getImageL2(),
    3: getImageL3(),
    4: getImageL4(),
  };

  res.send(likesObj);
});

app.get("/api", (req, res) => {
  res.json({
    message: {
      1: "Jenil",
      2: "Parmar",
      3: "Web-developer",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
