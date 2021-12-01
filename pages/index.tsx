import { GetStaticProps } from "next";
import React, { useState } from "react";
import { Product } from "../product/types";
import api from "../product/api";
import { Button, Grid, Stack, Text } from "@chakra-ui/react";

interface Props {
  products: Product[];
}

const IndexRoute: React.FC<Props> = ({ products }) => {
  // seteamos el estado con un array vacio que va tener un arr de Product
  const [cart, setcart] = React.useState<Product[]>([]);

  return (
    <Stack>
      <Grid
        gridGap={6}
        p={1}
        templateColumns="repeat(auto-fill, minmax(230px, 1fr ))"
      >
        {products.map((product) => (
          <Stack key={product.id} bgColor="gray.100" p={1}>
            <Text fontWeight="semibold ">{product.title}</Text>
            <Text>${product.price}</Text>
            {/* mas semantico imposible...concatena el producto que acabas de clickear en el carrito. ojo al argumento del producto q me lo comi la primera vez */}
            <Button
              colorScheme="blue"
              onClick={() => setcart(cart.concat(product))}
            >
              Agregar
            </Button>
          </Stack>
        ))}
      </Grid>
      {/* el carrito con el bool para mostrar solo si tiene productos agregados. */}
      {Boolean(cart.length) && (
        <Button colorScheme="whatsapp">
          Completar la compra ({cart.length} productos)
        </Button>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    props: {
      products,
    },
    // COLORCHECKTODO
    // este parametro revalida en tiempo la info cacheada (ojo q esta en seg) despues de ese tiempo dispara un req a next para que vaya al server y parsee la nueva info.
    ////// revalidate : 10 //////
  };
};

export default IndexRoute;
