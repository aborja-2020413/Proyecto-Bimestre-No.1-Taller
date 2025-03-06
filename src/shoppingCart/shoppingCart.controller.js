import Cart from  './shoppingCart.model.js'
import Product from '../product/product.model.js'
import Client from '../client/client.model.js'
import Invoice from '../Invoice/invoice.model.js'

// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
    try {
        let { user, products, quantities } = req.body;

        // Verificar si el usuario existe
        const usEr = await Client.findById(user);
        if (!usEr) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        /*
        // Asegurar que products y quantities sean arrays
        if (!Array.isArray(products)) {
            products = [products];
        }
        if (!Array.isArray(quantities)) {
            quantities = [quantities];
        }

        // Convertir quantities a números
        quantities = quantities.map(q => Number(q));
        */

        // Validar que los arrays tengan el mismo tamaño
        if (products.length !== quantities.length) {
            return res.status(400).json({ mensaje: 'Los productos y cantidades deben coincidir' });
        }

        // Buscar si ya existe un carrito para este usuario
        let cart = await Cart.findOne({ user });

        if (!cart) {
            // Si no existe, creamos uno nuevo
            cart = new Cart({ user, products, quantities });
        } else {
            // Iterar sobre los productos y agregarlos al carrito
            products.forEach((product, index) => {
                const quantity = quantities[index];

                // Verificar si el producto ya está en el carrito
                const productIndex = cart.products.indexOf(product);

                if (productIndex !== -1) {
                    // Producto ya existe, actualizamos la cantidad
                    cart.quantities[productIndex] += quantity;
                } else {
                    // Si el producto no está en el carrito, lo agregamos
                    cart.products.push(product);
                    cart.quantities.push(quantity);
                }
            });
        }

        // Guardamos el carrito actualizado
        await cart.save();
        res.status(200).json({ mensaje: 'Producto(s) agregado(s) al carrito', cart });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ver el carrito de un usuario
export const getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('products');
        
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/*
// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.indexOf(productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        // Actualizamos la cantidad del producto
        cart.quantities[productIndex] = quantity;

        await cart.save();
        res.status(200).json({ message: 'Cantidad actualizada', cart });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
*/

// Eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.indexOf(productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        // Eliminamos el producto del carrito
        cart.products.splice(productIndex, 1);
        cart.quantities.splice(productIndex, 1);

        await cart.save();
        res.status(200).json({ message: 'Producto eliminado del carrito', cart });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Limpiar el carrito (vaciar todo el carrito)
export const clearCart = async (req, res) => {
    const { userId } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Limpiamos el carrito
        cart.products = [];
        cart.quantities = [];

        await cart.save();
        res.status(200).json({ message: 'Carrito vaciado', cart });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/*PROCESO DE COMPRA*/
export const checkout = async (req, res) => {
    try {
        const { user } = req.body;

        // Verificar si el usuario existe
        const usEr = await Client.findById(user);
        if (!usEr) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ user });
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ mensaje: 'El carrito está vacío' });
        }

        let total = 0;
        const { products, quantities } = cart;

        // Validar stock y calcular total
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i]);
            if (!product) {
                return res.status(404).json({ mensaje: `Producto con ID ${products[i]} no encontrado` });
            }
            if (product.stock < quantities[i]) {
                return res.status(400).json({ mensaje: `Stock insuficiente para el producto ${product.name}` });
            }

            total += product.price * quantities[i];

            // Reducir stock del producto
            product.stock -= quantities[i];
            await product.save();
        }

        // Crear la factura
        const invoice = new Invoice({
            user,
            products,
            quantities,
            total,
            status: 'Pagado'
        });

        await invoice.save();

        // Eliminar el carrito después de la compra
        await Cart.findOneAndDelete({ user });

        res.status(201).json({ mensaje: 'Compra completada con éxito', invoice });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/*PROCESO DE COMPRA*/