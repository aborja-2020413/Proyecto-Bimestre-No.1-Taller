import Invoice from './invoice.model.js'
import Product from '../product/product.model.js'
import Client from '../client/client.model.js'


// Crear una factura (validando stock)
export const createInvoice = async (req, res) => {
    try {
        const { user, products, quantities, status } = req.body;

        // Verificar si el usuario existe
        const usEr = await Client.findById(user);
        if (!usEr) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        // Validar que productos y cantidades tengan el mismo tamaño
        if (products.length !== quantities.length) {
            return res.status(400).json({ mensaje: 'Los productos y cantidades deben coincidir' });
        }

        let total = 0;

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

            // Reducir stock
            product.stock -= quantities[i];
            await product.save();
        }

        // Crear la factura
        const invoice = new Invoice({
            user: user,
            products,
            quantities,
            total,
            status
        });

        await invoice.save();
        res.status(201).json({ mensaje: 'Factura creada con éxito', invoice });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Editar una factura (validando stock)
export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params; // ID de la factura a editar
        const { products, quantities, status } = req.body;

        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ mensaje: 'Factura no encontrada' });
        }

        // Restaurar stock de los productos originales
        for (let i = 0; i < invoice.products.length; i++) {
            const product = await Product.findById(invoice.products[i]);
            if (product) {
                product.stock += invoice.quantities[i];
                await product.save();
            }
        }

        let total = 0;

        // Validar stock y calcular nuevo total
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i]);
            if (!product) {
                return res.status(404).json({ mensaje: `Producto con ID ${products[i]} no encontrado` });
            }
            if (product.stock < quantities[i]) {
                return res.status(400).json({ mensaje: `Stock insuficiente para el producto ${product.name}` });
            }

            total += product.price * quantities[i];

            // Reducir stock
            product.stock -= quantities[i];
            await product.save();
        }

        // Actualizar factura
        invoice.products = products;
        invoice.quantities = quantities;
        invoice.total = total; 
        invoice.status = status;
        await invoice.save();

        res.status(200).json({ mensaje: 'Factura actualizada con éxito', invoice });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ver facturas de un usuario específico
export const getUserInvoices = async (req, res) => {
    try {
        const { userId } = req.params;

        const invoices = await Invoice.find({ user: userId }).populate('products');
        if (!invoices.length) {
            return res.status(404).json({ mensaje: 'No hay facturas para este usuario' });
        }

        res.status(200).json(invoices);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ver los productos detallados en una factura
export const getInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findById(id).populate('products');
        if (!invoice) {
            return res.status(404).json({ mensaje: 'Factura no encontrada' });
        }

        res.status(200).json(invoice);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/*HISTORIAL DE COMPRA*/
// Obtener historial de compras de un usuario
export const getPurchaseHistory = async (req, res) => {
    try {
        const { user } = req.params; // Se recibe el ID del usuario por params

        // Verificar si el usuario existe
        const usEr = await Client.findById(user);
        if (!usEr) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        // Buscar todas las facturas del usuario
        const invoices = await Invoice.find({ user }).populate('products');

        // Verificar si el usuario tiene compras
        if (invoices.length === 0) {
            return res.status(404).json({ mensaje: 'No hay compras registradas para este usuario' });
        }

        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/*HISTORIAL DE COMPRA*/