import axios from "axios";
import { GetStaticProps } from "next";
import React from "react";
import api from "../product/api";
import { Product } from "../product/types";

interface Props {
  products: Product[];
}

const IndexRoute: React.FC<Props> = () => {
  return <div>{`<IndexRoute />`}</div>;
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    props: {
      products,
    },
  };
};

export default IndexRoute;
