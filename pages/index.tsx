import { GetStaticProps } from "next";
import React, { useState } from "react";
import { Product } from "../product/types";
import api from "../product/api";
import { Button, Grid, Link, Stack, Text } from "@chakra-ui/react";

interface Props {
  products: Product[];
}
// para localizar la moneda.
function parseCurrency(value: number): string {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

const IndexRoute: React.FC<Props> = ({ products }) => {
  // seteamos el estado con un array vacio que va tener un arr de Product
  const [cart, setcart] = React.useState<Product[]>([]);
  //para generar en base a  lo que tengamos en el carrito.
  // inicialmente string vacio.
  const text = React.useMemo(
    // el use memo asegura que solo se ejecute cuando cambie la dependencia CHECK USEEFFECT, en este caso , cuando cambie el cart.
    () =>
      cart
        .reduce(
          (message, product) =>
            // por cada element, le agrega esto.
            message.concat(
              `* ${product.title} -${parseCurrency(product.price)}\n`
            ),
          ``
        )
        // mas el total o valor final del carro
        .concat(
          `\nTotal:${parseCurrency(
            cart.reduce(
              // el 0 es con lo que inicia.
              (total, product) => total + product.price,
              0
            )
          )}`
        ),
    [cart]
  );

  // function handleAddToCart(product: Product) {
  //   setcart((cart) => cart.concat(product));
  // }
  // onClick={() => handleAddToCart(product)}
  // TODO SOLO SI SACO POR FUERA para limpiar.

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
            <Text>{parseCurrency(product.price)}</Text>
            {/* mas semantico imposible...concatena el producto que acabas de clickear en el carrito. ojo al argumento del producto q me lo comi la primera vez */}
            <Button
              colorScheme="blue"
              onClick={() => setcart((cart) => cart.concat(product))}
            >
              Agregar
            </Button>
          </Stack>
        ))}
      </Grid>
      {/* el carrito con el bool para mostrar solo si tiene productos agregados. */}
      {Boolean(cart.length) && (
        <Button
          colorScheme="whatsapp"
          as={Link}
          isExternal
          // encodeURIComponent verifica de escapar correctamente por url el txt
          href={`https://wa.me/541126125615?text=${encodeURIComponent(text)}`}
        >
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
