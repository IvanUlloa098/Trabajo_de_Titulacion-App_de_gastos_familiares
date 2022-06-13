import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as regression from "regression";

const cors = require("cors")({origin: true});
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// Check TypeScript code => npm run-script lint -- --fix
// Compile into JavaScript => npm run-script build
// Use Firebase Function Emulator to run your
//  Cloud Functions locally => firebase serve --only functions
// Deploy Functions => firebase deploy --only functions

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Yup, it's working!", {structuredData: true});
  // response.send("Hello from Firebase! I'm really smart!");

  admin.firestore().doc("categories/834IqsQWzMFPdsE7TZKu").get()
      .then((res) => {
        const data = res.data();
        response.send(data);
      })
      .catch((error) => {
        // En caso de un error
        console.log(error);
        functions.logger.info(error, {structuredData: true});
        response.status(500).send(error);
      });
});

// URL: https://us-central1-gestionar-gastos.cloudfunctions.net/regressionReq
export const regressionReq = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    // functions.logger.info("Yup, it's working!", {structuredData: true});
    // response.send("Hello from Firebase! I'm really smart!");

    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "*");

    const userID = request.body.id_usuario;
    console.log("ID> "+userID);

    admin.firestore().collection("gastos")
        .where("id_usuario", "==", userID).get()
        .then((res) => {
          const data:any = [];
          const pairs:any = [];

          res.forEach((doc) => {
            const dt = new Date((""+doc.data().fecha).substring(0, 19));
            const aux = [dt.getTime(),
              doc.data().monto];
            pairs.push(aux);

            // console.log((""+doc.data().fecha).substring(0, 19));
            // console.log(typeof doc.data().monto);

            data.push(doc.data());
          });

          pairs.sort(function(a, b) {
            return a[0]-b[0];
          });

          let c = 0;
          pairs.forEach((element) => {
            element[0] = c;
            c++;
          });

          // console.log(pairs);

          const result = regression.linear(pairs);

          if (Object.keys(data).length == 0) {
            response.status(404)
                .send({"error": "No existen gastos con ese ID"});
          } else {
            response.send(result);
          }
        })
        .catch((error) => {
          // En caso de un error
          console.log(error);
          functions.logger.info(error, {structuredData: true});
          response.status(500).send(error);
        });
  });
});
