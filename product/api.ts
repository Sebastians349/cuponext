import axios from "axios";
import { Product } from "./types";

export default {
  list: async (): Promise<Product[]> => {
    return axios
      .get(
        `https://docs.google.com/spreadsheets/d/e/2PACX-1vREON2yt_A34bZbW9yjHAhyFh5RodpoWkIVkznL09r_DFqu86RUcwZFzOcHpNzvl1F3IotIWUYmtBx_/pub?output=csv`,
        {
          responseType: "blob",
        }
      )
      .then((response) => {
        console.log(response.data);
        return response.data;
      });
  },
};
