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

// URL: https://us-central1-gestionar-gastos.cloudfunctions.net/regressionReq
export const regressionReq = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    functions.logger.info("Petition requested for Regression ALL."
        , {structuredData: true});

    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "*");

    const familyID = request.body.id_familia;

    admin.firestore().collection("gastos")
        .where("id_familia", "==", familyID ).get()
        .then((res) => {
          const data:any = [];
          const pairs:any = [];
          const dateDat:any[] = [];
          const dataId:any[] = [];

          res.forEach((doc) => {
            const dt = new Date((""+doc.data().fecha).substring(0, 19));

            const aux = [dt.getTime(), doc.data().monto];
            pairs.push(aux);

            const aux2 = [dt.getTime(), doc.data().id_usuario, doc.data().id];
            dataId.push(aux2);

            data.push(doc.data());
          });

          pairs.sort(function(a, b) {
            return a[0]-b[0];
          });

          dataId.sort(function(a, b) {
            return a[0]-b[0];
          });

          const hour = ((1000 * 60) * 60)*100;
          const firstReg = pairs[0][0]/hour;

          pairs.forEach((element) => {
            dateDat.push((new Date(element[0])).toISOString());
            element[0] = parseFloat(((element[0]/hour)-firstReg).toFixed(2));
          });

          if (Object.keys(data).length == 0) {
            response.status(404)
                .send({"error": "No existen gastos con ese ID"});
          } else {
            const result = regression.linear(pairs);

            const input:any[] = [];
            const regr :any[] = [];
            const inputDate:any[] = [];
            const regrDate :any[] = [];

            let c = 0;
            pairs.forEach((element) => {
              let aux = {x: element[0], y: element[1]};
              input.push(aux);

              aux = {x: dateDat[c], y: element[1]};
              inputDate.push(aux);
              c++;
            });

            c = 0;
            result.points.forEach((element) => {
              let aux = {x: element[0], y: element[1]};
              regr.push(aux);

              aux = {x: dateDat[c], y: element[1]};
              regrDate.push(aux);
              c++;
            });

            const jsonRes = {
              data: {
                dataId: dataId,
                inputDate: inputDate,
                pointsDate: regrDate,
              },
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
          response.status(500).send({"error": error});
        });
  });
});

export const homeReq = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    functions.logger.info("Petition requested for HOME."
        , {structuredData: true});

    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "*");

    const familyID = request.body.id_familia;
    let presp: number;
    let prespGst = 0;
    let gastoTot = 0;
    let firsDay = 0;
    let gastosMes: any = [];

    admin.firestore().collection("gastos")
        .where("id_familia", "==", familyID ).get()
        .then((res) => {
          admin.firestore().collection("families")
              .where("id", "==", familyID ).get()
              .then((fam) => {
                res.forEach((doc) => {
                  gastosMes.push(doc.data());
                });

                fam.forEach((doc) => {
                  presp = doc.data().presupuesto_global;
                  firsDay = doc.data().primer_dia_mes;
                });

                let auxDate1:any = (new Date((new Date().setDate(firsDay+1))))
                    .toISOString().substring(0, 10);
                let auxDate2:any = new Date((new Date((new Date().setDate(0))))
                    .setDate(firsDay)).toISOString().substring(0, 10);

                auxDate1 = (new Date(auxDate1)).getTime();
                auxDate2 = (new Date(auxDate2)).getTime();

                gastosMes = gastosMes.filter((data) =>{
                  const date = (new Date(data.fecha)).getTime();
                  return (date<=auxDate1 && date>=auxDate2);
                });

                gastosMes.forEach((element) => {
                  gastoTot+=element.monto;
                });

                if (gastoTot >= presp) {
                  prespGst = 0;
                } else {
                  prespGst = presp-gastoTot;
                }

                const jsonRes ={
                  presp: presp,
                  prespGst: prespGst,
                  gastoTot: gastoTot,
                };

                response.send(jsonRes);
              })
              .catch((error) => {
                // En caso de un error
                console.log(error);
                functions.logger.info(error, {structuredData: true});
                response.status(500).send({"error": error});
              });
        })
        .catch((error) => {
          // En caso de un error
          console.log(error);
          functions.logger.info(error, {structuredData: true});
          response.status(500).send({"error": error});
        });
  });
});

export const categoryReq = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    functions.logger.info("Petition requested for REPORTS."
        , {structuredData: true});

    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "*");

    const familyID = request.body.id_familia;
    let gastosMes: any = [];
    let firsDay = 0;
    let presp: number;

    // Variables para los totales de gastos en cada categoria
    let gastoSalud=0.0;
    let gastoTransporte=0.0;
    let gastoVivienda=0.0;
    let gastoOcio=0.0;
    let gastoEducacion=0.0;
    let gastoAlimentacion=0.0;
    let gastoServicios=0.0;

    admin.firestore().collection("gastos")
        .where("id_familia", "==", familyID ).get()
        .then((res) => {
          admin.firestore().collection("families")
              .where("id", "==", familyID ).get()
              .then((fam) => {
                res.forEach((doc) => {
                  gastosMes.push(doc.data());
                });

                fam.forEach((doc) => {
                  presp = doc.data().presupuesto_global;
                  firsDay = doc.data().primer_dia_mes;
                });

                let auxDate1:any = (new Date((new Date().setDate(firsDay+1))))
                    .toISOString().substring(0, 10);
                let auxDate2:any = new Date((new Date((new Date().setDate(0))))
                    .setDate(firsDay)).toISOString().substring(0, 10);

                auxDate1 = (new Date(auxDate1)).getTime();
                auxDate2 = (new Date(auxDate2)).getTime();

                gastosMes = gastosMes.filter((data) =>{
                  const date = (new Date(data.fecha)).getTime();
                  return (date<=auxDate1 && date>=auxDate2);
                });

                gastosMes.forEach((element) => {
                  if (element.id_categoria=="834IqsQWzMFPdsE7TZKu") {
                    gastoAlimentacion+=element.monto;
                  }
                  if (element.id_categoria=="yfXjC94YqUqIbn4zXMjx") {
                    gastoServicios+=element.monto;
                  }
                  if (element.id_categoria=="EjKGtXUIHEnwC0MKrzIn") {
                    gastoEducacion=element.monto;
                  }
                  if (element.id_categoria=="Y2xbbnUeLwCz5UhfMMJZ") {
                    gastoOcio=element.monto;
                  }
                  if (element.id_categoria=="pZbMomfUFtw8u2aD0sEC") {
                    gastoTransporte=element.monto;
                  }
                  if (element.id_categoria=="NgNS2EM0p4UdeAQlZ4q6") {
                    gastoVivienda=element.monto;
                  }
                  if (element.id_categoria=="Mp82DGLcR5AUOEk5DSrC") {
                    gastoSalud=element.monto;
                  }
                });

                const jsonRes ={
                  presp: presp,
                  gastoAlimentacion: gastoAlimentacion,
                  gastoServicios: gastoServicios,
                  gastoEducacion: gastoEducacion,
                  gastoOcio: gastoOcio,
                  gastoTransporte: gastoTransporte,
                  gastoVivienda: gastoVivienda,
                  gastoSalud: gastoSalud,
                };

                response.send(jsonRes);
              })
              .catch((error) => {
                // En caso de un error
                console.log(error);
                functions.logger.info(error, {structuredData: true});
                response.status(500).send({"error": error});
              });
        })
        .catch((error) => {
          // En caso de un error
          console.log(error);
          functions.logger.info(error, {structuredData: true});
          response.status(500).send({"error": error});
        });
  });
});


