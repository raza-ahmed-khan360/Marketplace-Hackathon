export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
      hidden: true,
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'User', value: 'user' },
          { title: 'Admin', value: 'admin' },
        ],
      },
      initialValue: 'user',
    },
    {
      name: 'isVerified',
      title: 'Is Verified',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'otp',
      title: 'OTP',
      type: 'object',
      fields: [
        { name: 'code', type: 'string' },
        { name: 'expiresAt', type: 'datetime' },
      ],
    },
    {
      name: 'credits',
      title: 'Credits',
      type: 'number',
      initialValue: 0,
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: 'orders',
      title: 'Orders',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'order' }] }],
    },
    {
      name: 'addresses',
      title: 'Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Address Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Home', value: 'home' },
                  { title: 'Work', value: 'work' },
                  { title: 'Other', value: 'other' },
                ],
              },
            },
            { name: 'firstName', title: 'First Name', type: 'string' },
            { name: 'lastName', title: 'Last Name', type: 'string' },
            { name: 'address', title: 'Street Address', type: 'string' },
            { name: 'city', title: 'City', type: 'string' },
            { name: 'state', title: 'State', type: 'string' },
            { name: 'postalCode', title: 'Postal Code', type: 'string' },
            { name: 'country', title: 'Country', type: 'string' },
            { name: 'phone', title: 'Phone', type: 'string' },
            { name: 'isDefault', title: 'Is Default', type: 'boolean', initialValue: false },
          ],
        },
      ],
    },
    {
      name: 'wishlist',
      title: 'Wishlist',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
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
    {
      name: 'lastLoginAt',
      title: 'Last Login At',
      type: 'datetime',
    },
    {
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      fields: [
        { name: 'lastOrderDate', type: 'datetime' },
        { name: 'totalOrders', type: 'number', initialValue: 0 },
        { name: 'totalSpent', type: 'number', initialValue: 0 },
        { name: 'preferredCategories', type: 'array', of: [{ type: 'string' }] },
      ],
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
  },
}; 