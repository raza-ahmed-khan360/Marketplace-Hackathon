export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(1),
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(0),
            }
          ]
        }
      ],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'processing',
    },
    {
      name: 'total',
      title: 'Total Amount',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'firstName', title: 'First Name', type: 'string' },
        { name: 'lastName', title: 'Last Name', type: 'string' },
        { name: 'address', title: 'Street Address', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'state', title: 'State', type: 'string' },
        { name: 'postalCode', title: 'Postal Code', type: 'string' },
        { name: 'country', title: 'Country', type: 'string' },
        { name: 'phone', title: 'Phone', type: 'string' },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'paymentInfo',
      title: 'Payment Information',
      type: 'object',
      fields: [
        {
          name: 'method',
          title: 'Payment Method',
          type: 'string',
          options: {
            list: [
              { title: 'Credit Card', value: 'credit_card' },
              { title: 'PayPal', value: 'paypal' },
              { title: 'Store Credits', value: 'store_credits' },
            ],
          },
        },
        { name: 'transactionId', title: 'Transaction ID', type: 'string' },
        { name: 'paidAt', title: 'Paid At', type: 'datetime' },
      ],
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'status',
    },
  },
}