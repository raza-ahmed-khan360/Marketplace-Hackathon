import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      total,
      shippingAddress,
      user = { _type: 'reference', _ref: 'user-id-placeholder' }, // TODO: Replace with actual user authentication
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order items' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Create order document
    const orderData = {
      _type: 'order',
      orderNumber: `ORD-${Date.now()}`,
      user,
      items: items.map(item => ({
        _type: 'orderItem',
        product: { _type: 'reference', _ref: item.id },
        quantity: item.quantity,
        price: item.price
      })),
      total,
      status: 'processing',
      shippingAddress: {
        ...shippingAddress,
        _type: 'object'
      },
      paymentInfo: {
        _type: 'object',
        method: 'credit_card', // Default payment method
        transactionId: `TXN-${Date.now()}`,
        paidAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create the order in Sanity
    const createdOrder = await client.create(orderData);

    return NextResponse.json(
      { 
        message: 'Order created successfully', 
        orderId: createdOrder._id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}