import axios from "axios";
import { Product } from "./types";
import Papa from "papaparse";
import { rejects } from "assert";

export default {
  list: async (): Promise<Product[]> => {
    return axios
      .get(
        `https://docs.google.com/spreadsheets/d/e/2PACX-1vREON2yt_A34bZbW9yjHAhyFh5RodpoWkIVkznL09r_DFqu86RUcwZFzOcHpNzvl1F3IotIWUYmtBx_/pub?output=csv`,
        {
          responseType: "blob",
        }
      )
      .then(
        (response) =>
          // papaparse no funciona con promises => usamos constructor de promise
          // devuelve una promise que es un array de productos.
          new Promise<Product[]>((resolve, reject) => {
            //data es lo que viene del .csv
            Papa.parse(response.data, {
              // le pasamos un obj con params, el header indica que el primer elemento de nuestro array arma y sortea nuestra tabla y armar el json correctamente.
              header: true,
              // resultado del obj parseado
              //  version anterior ====== complete: (results) => resolve(results.data as Product[]),
              complete: (results) => {
                // el refactoreo es para darle un cuerpo a la function
                const products = results.data as Product[];
                return resolve(
                  products.map((product) => ({
                    ...product,
                    price: Number(product.price),
                  }))
                );
              },

              // si hay error devuelve mensaje y no trata de parsearlo.
              error: (error) => reject(error.message),
            });
          })
      );
  },
};
