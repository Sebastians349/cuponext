import { GetStaticProps } from "next";
import React, { useState } from "react";
import { Product } from "../product/types";
import api from "../product/api";
import { Button, Flex, Grid, Image, Link, Stack, Text } from "@chakra-ui/react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
// el AnimateSharedLayout hace q compartar la misma anim con el id

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
  const [selectedImage, setSelectedImage] = React.useState<string>(null);

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
    <AnimateSharedLayout type="crossfade">
      <Stack>
        <Grid
          gridGap={6}
          p={1}
          templateColumns="repeat(auto-fill, minmax(230px, 1fr ))"
        >
          {products.map((product) => (
            <Stack key={product.id} bgColor="gray.100" spacing={3} p={4}>
              <Image
                as={motion.img}
                alt={product.title}
                cursor="pointer"
                layoutId={product.image}
                src={product.image}
                fallbackSrc="https://via.placeholder.com/125"
                objectFit="cover"
                borderRadius="md"
                maxH={128}
                onClick={() => setSelectedImage(product.image)}
              />

              <Stack spacing={1}>
                <Text fontWeight="semibold ">{product.title}</Text>
                <Text color="green.500" fontSize="sm">
                  {parseCurrency(product.price)}
                </Text>
              </Stack>
              {/* mas semantico imposible...concatena el producto que acabas de clickear en el carrito. ojo al argumento del producto q me lo comi la primera vez */}
              <Button
                colorScheme="primary"
                // setear desde el extend
                onClick={() => setcart((cart) => cart.concat(product))}
                size="sm"
                variant="outline"
                bottom={0}
              >
                Agregar
              </Button>
            </Stack>
          ))}
        </Grid>
        {/* el carrito con el bool para mostrar solo si tiene productos agregados. */}
        {Boolean(cart.length) && (
          <AnimatePresence>
            <Flex
              as={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              alignItems="center"
              justifyContent="center"
              bottom={0}
              position="sticky"
              p={4}
            >
              <Button
                size="lg"
                colorScheme="whatsapp"
                as={Link}
                isExternal
                width="fit-content"
                _hover={{ textDecoration: "none" }}
                // encodeURIComponent verifica de escapar correctamente por url el txt
                href={`https://wa.me/541126125615?text=${encodeURIComponent(
                  text
                )}`}
                leftIcon={
                  <Image
                    src="https://icongr.am/fontawesome/whatsapp.svg?size=32&color=ffffff"
                    alt="logo de whatsapp"
                  />
                }
              >
                Completar la compra ({cart.length} productos)
              </Button>
            </Flex>
          </AnimatePresence>
        )}
      </Stack>
      <AnimatePresence>
        {selectedImage && (
          <Flex
            key="backdrop"
            alignItems="center"
            as={motion.div}
            bgColor="rgba(0,0,0,0.5)"
            h="100%"
            w="100%"
            justifyContent="center"
            layoutId={selectedImage}
            left={0}
            top={0}
            position="fixed"
            onClick={() => setSelectedImage(null)}
          >
            <Image key="image" src={selectedImage} alt="imagen del producto" />
          </Flex>
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    // CHECKTODO
    // este parametro revalida en tiempo la info cacheada (ojo q esta en seg) despues de ese tiempo dispara un req a next para que vaya al server y parsee la nueva info.
    revalidate: 10,
    props: {
      products,
    },
  };
};

export default IndexRoute;
