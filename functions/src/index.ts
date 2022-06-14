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

    const familyID = request.body.id_familia;
    console.log("ID> "+familyID);

    admin.firestore().collection("gastos")
        .where("id_familia", "==", familyID ).get()
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

          const hour = ((1000 * 60) * 60)*100;

          const firstReg = pairs[0][0]/hour;

          pairs.forEach((element) => {
            element[0] = parseFloat(((element[0]/hour)-firstReg).toFixed(2));
          });

          // console.log(pairs);

          const result = regression.linear(pairs);

          if (Object.keys(data).length == 0) {
            response.status(404)
                .send({"error": "No existen gastos con ese ID"});
          } else {
            const jsonRes = {
              raw: pairs,
              points: result.points,
              equation: result.equation,
              r2: result.r2,
              string: result.string,
            };

            response.send(jsonRes);
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
