# Project Name: Comforty Website

## Overview
Comforty Website is a fully responsive website designed to showcase products with a modern layout and aesthetic. The project focuses on enhancing user experience, showcasing product features, and ensuring accessibility across devices.

You can check it out by yourself [Click Here](https://figma-hackathon-temp-08.vercel.app)
You can check out the workflow brainstorming of this project [here](https://mm.tt/app/map/3583370281?t=ht8J3oF9VY) 

# Comforty - Modern Furniture Marketplace

A modern, responsive e-commerce marketplace built with Next.js, featuring a seamless shopping experience for furniture and home decor. The platform includes user authentication, product management, cart functionality, and a secure checkout process.

## Project Overview

Comforty is a full-featured e-commerce marketplace that offers:
- Responsive design for all devices
- User authentication and authorization
- Product search and filtering
- Shopping cart and wishlist functionality
- Secure checkout process
- Admin dashboard for product and order management
- Newsletter subscription
- Real-time product updates

## Features
- **Responsive Design**: Adapts seamlessly to all screen sizes, providing a consistent experience.
- **Dynamic Components**: Built with React and Next.js for modular and scalable development.
- **Product Display**: Includes an image gallery and detailed descriptions for showcasing products.
- **Call-to-Action Buttons**: Encourages user interaction with intuitive and styled buttons.
- **Rating & Reviews System**: 
  - Star rating display for products
  - Customer reviews and feedback
  - Interactive review submission
  - Review management on product pages

## Admin Panel Features
- **Secure Authentication**: Dedicated admin login system with protected routes
- **Dashboard Overview**: 
  - Total orders, products, and revenue statistics
  - Recent order tracking
  - Quick status updates
- **Product Management**:
  - Add, edit, and delete products
  - Manage inventory levels
  - Update product status
  - Image upload support
- **Order Management**:
  - View and track all orders
  - Update order status (Processing, Shipped, Delivered, Cancelled)
  - Detailed order information including customer details
  - Order history tracking

### Admin Access
To access the admin panel:
1. Navigate to `/admin/login`
2. Use the following credentials:
   - Email: admin@example.com
   - Password: admin123

### Tech Stack
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: Sanity.io (Headless CMS)
- Authentication: NextAuth.js
- State Management: React Context
- Styling: Tailwind CSS with custom configuration
- Animation: Framer Motion

## Setup Instructions

### Prerequisites
- Node.js 18.x or later
- npm or yarn package manager
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/comforty-marketplace.git
cd comforty-marketplace
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the project root and add the following variables:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production
```bash
npm run build
# or
yarn build
```

## Deployment Details

### Staging Environment
- Staging URL: [https://marketplace-hackathon-comforty.vercel.app](https://marketplace-hackathon-comforty.vercel.app)

### Production Deployment Steps

1. Merge changes to main branch
```bash
git checkout main
git merge staging
```

2. Push to trigger deployment
```bash
git push origin main
```

3. Monitor deployment status on Vercel dashboard

### Environment Configuration
- Configure environment variables in Vercel project settings
- Enable automatic deployments for staging branch
- Set up branch protection rules for main branch

## Testing Details

### Functional Testing
- Unit tests using Jest and React Testing Library
- Integration tests for critical user flows
- E2E tests using Cypress

Run tests:
```bash
# Unit and integration tests
npm run test

# E2E tests
npm run cypress
```

### Performance Testing
- Lighthouse scores:
  - Performance: 95+
  - Accessibility: 98+
  - Best Practices: 95+
  - SEO: 100

### Security Testing
- Regular security audits using npm audit
- OWASP Top 10 compliance checks
- XSS protection enabled
- CSRF protection implemented
- Rate limiting for API routes

### Test Reports
- [Test Case Report (CSV)](./docs/test-cases.csv)
- [Lighthouse Report](./docs/lighthouse-report.html)
- [Security Audit Report](./docs/security-audit.pdf)

## Journey & Development
1. The project began with basic structural design using Next.js and Tailwind CSS.
2. Tailwind CSS was employed for responsiveness and utility-based styling.
3. Online resources like **ChatGPT** and **Claude** were instrumental in resolving technical challenges and enhancing development speed.
4. Specific tasks like implementing responsive layouts and dynamic button styling were iteratively refined for better usability.
5. Final touches involved optimizing the site for mobile and desktop views, ensuring pixel-perfect design.

## Resources Used
1. **ChatGPT**: Provided guidance on writing cleaner code, making layouts responsive, and debugging issues.
2. **Claude**: Assisted in planning the structure and resolving specific programming challenges.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is developed as part of the GIAIC Hackathon and is intended for educational purposes. All rights are reserved to GIAIC (Governor's Initiative on Artificial Intelligence and Computing) and the Project Developer. See the [LICENSE](LICENSE) file for full terms and conditions.

## Support

For support, email support@comforty.com or join our Slack channel.

## Future Improvements
- Add more payment gateways
- Implement real-time order tracking
- Add multi-language support
- Enhance mobile app experience
- Implement AI-powered product recommendations